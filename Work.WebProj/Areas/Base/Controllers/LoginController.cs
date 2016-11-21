using DotWeb.CommSetup;
using DotWeb.Controller;
using GooglereCAPTCHa.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using ProcCore;
using ProcCore.Business.DB0;
using ProcCore.HandleResult;
using ProcCore.NetExtension;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.Entity;
using System.Linq;
using System.Runtime.Caching;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;


namespace DotWeb.Areas.Base.Controllers
{
    public class LoginController : WebUserController
    {
        private ApplicationUserManager _userManager;
        private ApplicationSignInManager _signInManager;

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set
            {
                _signInManager = value;
            }
        }

        public ActionResult Main()
        {
            HttpContext.GetOwinContext().Authentication.SignOut();
            ViewData["username"] = "";
            ViewData["password"] = "";
            ViewData["validate"] = "";

#if DEBUG
            ViewData["username"] = CommWebSetup.AutoLoginUser;
            ViewData["password"] = CommWebSetup.AutoLoginPassword;
            ViewData["validate"] = "1";
#endif
            removeCookie("user_id");
            removeCookie("user_name");
            removeCookie("user_login");
            removeCookie("community_id");
            ViewBag.BodyClass = "Login";
            ViewBag.Year = DateTime.Now.Year;

            return View("index");
        }
        [AllowAnonymous]
        public ActionResult ResetPassword(string code)
        {
            if (code == null)
            {
                return View("Error");
            }

            ResetPasswordViewModel md = new ResetPasswordViewModel()
            {
                Code = code
            };

            return View(md);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<string> ajax_Login(LoginViewModel model)
        {
            var userManager = UserManager;

            LoginResult getLoginResult = new LoginResult();


            #region 驗證碼檢查程序

#if DEBUG
            getLoginResult.vildate = true;
#else
            //if (string.IsNullOrEmpty(Session["CheckCode"].ToString()))
            //{
            //    Session["CheckCode"] = Guid.NewGuid();
            //    getLoginResult.result = false;
            //    getLoginResult.message = Resources.Res.Log_Err_ImgValideNotEquel;
            //    return defJSON(getLoginResult);
            //}

            //getLoginResult.vildate = Session["CheckCode"].Equals(model.validate) ? true : false;
            ValidateResponse Validate = ValidateCaptcha(model.validate);
            getLoginResult.vildate = Validate.Success;
#endif
            if (!getLoginResult.vildate)
            {
                //Session["CheckCode"] = Guid.NewGuid(); //只要有錯先隨意產生唯一碼 以防暴力破解，新的CheckCode會在Validate產生。
                getLoginResult.result = false;
                getLoginResult.message = Resources.Res.Log_Err_ImgValideNotEquel;
                return defJSON(getLoginResult);
            }
            #endregion

            #region 帳密碼檢查

            var db = getDB0();
            //var get_secretary = db.Community.Where(x => x.account == model.account && x.passwd == model.password);
            SignInStatus result;
            ApplicationUser item;
            IEnumerable<string> get_user_roles_id;

            result = await SignInManager.PasswordSignInAsync(model.account, model.password, model.rememberme, shouldLockout: false);

            if (result == SignInStatus.Failure)
            {
                getLoginResult.result = false;
                getLoginResult.message = Resources.Res.Login_Err_Password;
                return defJSON(getLoginResult);
            }

            getLoginResult.result = true;
            item = await userManager.FindByNameAsync(model.account);
            get_user_roles_id = item.Roles.Select(x => x.RoleId);


            ApplicationDbContext context = ApplicationDbContext.Create();
            var roleManage = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            var get_user_roles_name = roleManage.Roles.Where(x => get_user_roles_id.Contains(x.Id)).Select(x => x.Name);
            getLoginResult.url = Url.Content("~/Active/CommunityNews");
            if (get_user_roles_name.Contains("Secretary"))

                Response.Cookies.Add(new HttpCookie(CommWebSetup.Cookie_UserName, item.UserName));
            Response.Cookies.Add(new HttpCookie(CommWebSetup.Cookie_LastLogin, DateTime.Now.ToString("yyyy-MM-dd")));
            #endregion

            //語系使用
            HttpCookie WebLang = Request.Cookies[CommWebSetup.WebCookiesId + ".Lang"];
            WebLang.Value = model.lang;
            Response.Cookies.Add(WebLang);

            try
            {
                var item_department = await db.Department.FindAsync(item.department_id);

                Response.Cookies.Add(new HttpCookie(CommWebSetup.Cookie_DepartmentId, item.department_id.ToString()));

                Response.Cookies.Add(new HttpCookie("user_login", Server.UrlEncode(EncryptString.desEncryptBase64("N"))));
                var item_lang = db.i_Lang
                    .Where(x => x.lang == WebLang.Value)
                    .Select(x => new { x.area })
                    .Single();

                ViewData["lang"] = item_lang.area;
                db.Dispose();
            }
            catch (Exception ex)
            {
                getLoginResult.result = false;
                getLoginResult.message = ex.Message;
                return defJSON(getLoginResult);
            }

            return defJSON(getLoginResult);
        }
        private async Task SignInAsync(ApplicationUser user, bool isPersistent)
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            AuthenticationManager.SignIn(
                new AuthenticationProperties() { IsPersistent = isPersistent },
                await user.GenerateUserIdentityAsync(UserManager));
        }
        [HttpPost]
        public string ajax_Lang()
        {
            using (var db = getDB0())
            {
                var langs = db.i_Lang.Where(x => x.isuse == true).OrderBy(x => x.sort);
                return defJSON(langs);
            }
        }
        public RedirectResult Logout()
        {
            HttpContext.GetOwinContext().Authentication.SignOut();

            string getLoginFlag = string.Empty;
            var getCookie = Request.Cookies["user_login"];
            getLoginFlag = getCookie == null ? "Y" :
                EncryptString.desDecryptBase64(Server.UrlDecode(getCookie.Value)); //Value:N

            removeCookie("user_id");
            removeCookie("user_name");
            removeCookie("community_id");
            removeCookie("user_login");
            removeCookie(CommWebSetup.LoginId);
            removeCookie(CommWebSetup.LoginType);


            ObjectCache cache = MemoryCache.Default;
            cache.Clear();

            //SiteMaps.ReleaseSiteMap();

            FormsAuthentication.SignOut();
            if (getLoginFlag == "Y")
                return Redirect("~");
            else
                return Redirect("~/_SysAdm?t=" + DateTime.Now.Ticks);

        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<string> ajax_ForgotPassword(ForgotPasswordViewModel model)
        {
            ResultInfo rAjaxResult = new ResultInfo();

            try
            {
                if (ModelState.IsValid)
                {
                    var user = await UserManager.FindByEmailAsync(model.Email);
                    //2014-5-20 Jerry 目前本系統不作Email驗證工作
                    //if (user == null || !(await UserManager.IsEmailConfirmedAsync(user.Id)))
                    if (user == null)
                        throw new Exception(Resources.Res.Login_Err_Password);

                    string code = await UserManager.GeneratePasswordResetTokenAsync(user.Id);
                    var callbackUrl = Url.Action("ResetPassword", "MNGLogin", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                    await UserManager.SendEmailAsync(user.Id, "重設密碼", "請按 <a href=\"" + callbackUrl + "\">這裏</a> 重設密碼");

                    rAjaxResult.result = true;
                }
                else
                {
                    List<string> errMessage = new List<string>();
                    foreach (ModelState modelState in ModelState.Values)
                        foreach (ModelError error in modelState.Errors)
                            errMessage.Add(error.ErrorMessage);

                    rAjaxResult.message = String.Join(":", errMessage);
                    rAjaxResult.result = false;
                }
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.Message;
            }

            return defJSON(rAjaxResult);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<string> ajax_ResetPassword(ResetPasswordViewModel model)
        {
            ResultInfo rAjaxResult = new ResultInfo();

            try
            {
                if (ModelState.IsValid)
                {
                    var user = await UserManager.FindByEmailAsync(model.Email);
                    if (user == null)
                    {
                        rAjaxResult.result = false;
                        rAjaxResult.message = Resources.Res.Log_Err_NoThisUser;
                        return defJSON(rAjaxResult);
                    }
                    IdentityResult result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
                    if (result.Succeeded)
                    {
                        rAjaxResult.result = true;
                        return defJSON(rAjaxResult);
                    }
                    else
                    {
                        rAjaxResult.message = String.Join(":", result.Errors);
                        rAjaxResult.result = false;
                        return defJSON(rAjaxResult);
                    }
                }
                else
                {
                    List<string> errMessage = new List<string>();
                    foreach (ModelState modelState in ModelState.Values)
                        foreach (ModelError error in modelState.Errors)
                            errMessage.Add(error.ErrorMessage);

                    rAjaxResult.message = String.Join(":", errMessage);
                    rAjaxResult.result = false;
                    return defJSON(rAjaxResult);
                }
            }
            catch (Exception ex)
            {
                rAjaxResult.result = false;
                rAjaxResult.message = ex.Message;
                return defJSON(rAjaxResult);
            }
        }
        private void removeCookie(string key)
        {
            var c = new HttpCookie(key);
            c.Values.Clear();
            c.Expires = DateTime.Now.AddDays(-1);
            Response.Cookies.Set(c);
        }

        #region 後台登入
        [HttpPost]
        [AllowAnonymous]
        public async Task<string> ajax_NewLogin(LoginViewModel model)
        {
            var userManager = UserManager;
            LoginResult getLoginResult = new LoginResult();

            #region 驗證碼檢查程序

#if DEBUG
            getLoginResult.vildate = true;
#else
            #region Google驗證(目前無使用換成數字驗證碼)
            if (!ModelState.IsValid)
            {
                getLoginResult.result = false;
                getLoginResult.message = Resources.Res.Login_Err_Normal;
                return defJSON(getLoginResult);
            }
            ValidateResponse Validate = ValidateCaptcha(model.validate);
            getLoginResult.vildate = Validate.Success;
            #endregion
#endif
            if (!getLoginResult.vildate)
            {
                //Session["CheckCode"] = Guid.NewGuid();//只要有錯先隨意產生唯一碼 以防暴力破解，新的CheckCode會在Validate產生。
                getLoginResult.result = false;
                getLoginResult.message = Resources.Res.Log_Err_googleValideNotEquel;
                return defJSON(getLoginResult);
            }
            #endregion

            try
            {
                #region 帳密碼檢查

                using (var db0 = getDB0())
                {
                    ApplicationUser get_user;
                    IEnumerable<string> get_user_roles_name;

                    string PW_Hash = UserManager.PasswordHasher.HashPassword(model.password);
                    // result = await SignInManager.PasswordSignInAsync(model.account, model.password, model.rememberme, shouldLockout: false);
                    var result = await db0.AspNetUsers.AnyAsync(x => x.UserName == model.account & x.PasswordHash == PW_Hash);

                    if (result)
                    {
                        getLoginResult.result = false;
                        getLoginResult.message = Resources.Res.Login_Err_Password;
                        return defJSON(getLoginResult);
                    }

                    getLoginResult.result = true;
                    get_user = await userManager.FindByNameAsync(model.account);
                    //get_user_roles_id = get_user.Roles.Select(x=>x.RoleId);
                    get_user_roles_name = db0.AspNetUsers.FirstOrDefault(x => x.Id == get_user.Id).AspNetRoles.Select(x => x.Name);
                    //本專案目前一個帳號只對映一個role 以first role為主

                    if (get_user != null)
                    {
                        #region 前台_會員登入用cookie

                        string userData = get_user_roles_name.FirstOrDefault();
                        string encode_userid = Server.UrlEncode(EncryptString.desEncryptBase64(get_user.Id));//userid 加密
                        FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, encode_userid, DateTime.Now, DateTime.Now.AddMinutes(180), false, userData, FormsAuthentication.FormsCookiePath);

                        string encTicket = FormsAuthentication.Encrypt(ticket);
                        Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));

                        var cookie_loginid = new HttpCookie(CommWebSetup.LoginId, Server.UrlEncode(EncryptString.desEncryptBase64(get_user.UserName)));
                        cookie_loginid.HttpOnly = true;
                        Response.Cookies.Add(cookie_loginid);

                        //LoginType //N:管理者登錄 Y:一般會員登錄
                        var cookie_login_type = new HttpCookie(CommWebSetup.LoginType, Server.UrlEncode(EncryptString.desEncryptBase64("N")));
                        cookie_login_type.HttpOnly = true;
                        Response.Cookies.Add(cookie_login_type);

                        #endregion
                        #region 後台_會員登入用cookie
                        Session["CheckCode"] = "jcin";

                        #endregion

                        getLoginResult.result = true;
                        string result_url = Url.Content(CommWebSetup.ManageDefCTR);

                        getLoginResult.url = result_url;
                        return defJSON(getLoginResult);
                    }
                    else
                    {
                        getLoginResult.result = false;
                        getLoginResult.message = Resources.Res.Login_Err_Password;//帳號或密碼錯誤 請重新輸入
                        return defJSON(getLoginResult);
                    }


                }
                #endregion
            }
            catch (Exception ex)
            {
                getLoginResult.result = false;
                getLoginResult.message = ex.Message;
                return defJSON(getLoginResult);
            }

        }
        #endregion



        public class MemberLogin
        {
            public string act { get; set; }
            public string pwd { get; set; }
            public string validate { get; set; }
        }
        class LoginResult
        {
            public String title { get; set; }
            public Boolean vildate { get; set; }
            public Boolean result { get; set; }
            public String message { get; set; }
            public String url { get; set; }
        }
        public class LoginViewModel
        {
            [Required]
            public string account { get; set; }
            [Required]
            [DataType(DataType.Password)]
            public string password { get; set; }
            [Required]
            public string lang { get; set; }
            [Required]
            public string validate { get; set; }
            public bool rememberme { get; set; }
        }
    }
}
