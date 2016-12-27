using System.Web.Mvc;
using DotWeb.Controller;
using System.Linq;
using ProcCore;
using System;
using System.Web;

namespace DotWeb.Controllers
{
    [MyAuthorizeForC(Roles = "Customers")]
    public class UserController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Account");
        }
        // 會員註冊
        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();
        }
        [AllowAnonymous]
        public ActionResult Finish()
        {
            return View();
        }
        // 會員資料編輯
        public ActionResult Account()
        {
            return View();
        }
        // 會員訂單列表(含曆史訂單)
        public ActionResult Receipt_list()
        {
            return View();
        }
        // 會員訂單詳細資料
        public ActionResult Receipt_content(string no)
        {
            if (no == null)
            {
                return Redirect("~/User/Receipt_list");
            }
            return View();
        }

        // 會員忘記密碼
        [AllowAnonymous]
        public ActionResult ChangePassWord(string mail, string code)
        {
            using (var db0 = getDB0())
            {
                bool check = false;
                string dec_code = string.Empty;
                try
                {
                    dec_code = EncryptString.desDecryptBase64(code);
                }
                catch (Exception ex)
                {
                    string test = ex.ToString();
                }


                var item = db0.TimeLinessCode.FirstOrDefault(x => x.Id == dec_code);

                if (mail == null || code == null || item == null)
                {
                    check = true;
                }
                else if (!db0.Customer.Any(x => x.email == mail))
                {
                    check = true;
                }
                else if (DateTime.Now > item.i_ExpiryDateTime)
                {//超過有效期限
                    check = true;
                }
                else if (item.is_use)
                {//已使用過
                    check = true;
                }


                if (check)
                {
                    return Redirect("~/User/LinkFail");
                }
            }
            return View();
        }
        [AllowAnonymous]
        public ActionResult LinkFail()
        {//連結失效
            return View();
        }
    }

}
