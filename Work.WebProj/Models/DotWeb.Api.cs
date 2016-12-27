using DotWeb.CommSetup;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Newtonsoft.Json;
using ProcCore;
using ProcCore.Business;
using ProcCore.Business.DB0;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Transactions;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace DotWeb.Api
{
    public class BaseApiController : ApiController
    {
        protected int defPageSize = 10;
        protected string aspUserId;
        protected int departmentId;
        protected string UserId;
        protected string LoginUserFlag = string.Empty;//N:管理端登錄 Y:用戶端登錄
        protected IEnumerable<string> UserRoles;
        protected C591613_TylynaEntities db0;
        protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            base.Initialize(controllerContext);

            var identity = User.Identity; //一定要有值 無值為系統出問題
            #region 判斷是管理端、用戶端登入
            //var getLoginUserFlag = controllerContext.Request.Headers.GetCookies(CommWebSetup.LoginType).SingleOrDefault();
            //LoginUserFlag = getLoginUserFlag == null ? "" :
            //    EncryptString.desDecryptBase64(getLoginUserFlag[CommWebSetup.LoginType].Value);
            #endregion
            if (identity.IsAuthenticated)
            {
                var FormsIdentity = (System.Web.Security.FormsIdentity)User.Identity; //一定要有值 無值為系統出問題
                var id = EncryptString.desDecryptBase64(HttpUtility.UrlDecode(FormsIdentity.Ticket.Name));//userid
                //取得權限
                var roles = FormsIdentity.Ticket.UserData.Split(',');
                var roleId = roles.FirstOrDefault();
                string[] r_s = new string[] { "Admins", "Managers" };
                if (r_s.Contains(roleId))
                {//管理端登入
                    LoginUserFlag = "N";
                    aspUserId = id;
                    ApplicationUser aspnet_user = UserManager.FindById(aspUserId);
                    UserId = aspnet_user.Id;
                    departmentId = aspnet_user.department_id;
                    UserRoles = aspnet_user.Roles.Select(x => x.RoleId);
                }
                else
                {
                    LoginUserFlag = "Y";
                    UserId = id;
                    //取得權限
                    UserRoles = FormsIdentity.Ticket.UserData.Split(',');
                }
            }
        }
        protected virtual string getRecMessage(string MsgId)
        {
            string r = Resources.Res.ResourceManager.GetString(MsgId);
            return string.IsNullOrEmpty(r) ? MsgId : r;
        }
        protected virtual LogicCenter openLogic()
        {
            LogicCenter dbLogic = new LogicCenter(CommSetup.CommWebSetup.DB0_CodeString);
            dbLogic.IP = System.Web.HttpContext.Current.Request.UserHostAddress;

            return dbLogic;
        }
        protected string getNowLnag()
        {
            return System.Globalization.CultureInfo.CurrentCulture.Name;
        }
        protected static C591613_TylynaEntities getDB0()
        {
            LogicCenter.SetDB0EntityString(CommWebSetup.DB0_CodeString); //取得連線字串
            return LogicCenter.getDB0;
        }

        protected static SqlConnection getDb0Connection()
        {
            string connectionstring = LogicCenter.GetDB0ConnectionString(CommWebSetup.DB0_CodeString); //取得連線字串
            SqlConnection connection = new SqlConnection(connectionstring);
            return connection;
        }

        protected string ModelStateErrorPack()
        {
            List<string> errMessage = new List<string>();
            foreach (var modelState in ModelState.Values)
                foreach (var error in modelState.Errors)
                    errMessage.Add(error.ErrorMessage);

            return string.Join(":", errMessage);
        }

        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }
        public RoleManager<IdentityRole> roleManager
        {
            get
            {
                ApplicationDbContext context = ApplicationDbContext.Create();
                return new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));
            }
        }
        protected int GetNewId()
        {
            return GetNewId(ProcCore.Business.CodeTable.Base);
        }
        protected int GetNewId(CodeTable tab)
        {
            using (TransactionScope tx = new TransactionScope())
            {
                var db = getDB0();
                try
                {
                    string tab_name = Enum.GetName(typeof(CodeTable), tab);
                    var items = db.i_IDX.Where(x => x.table_name == tab_name).FirstOrDefault();

                    if (items == null)
                    {
                        return 0;
                    }
                    else
                    {
                        items.IDX++;
                        db.SaveChanges();
                        tx.Complete();
                        return items.IDX;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    return 0;
                }
                finally
                {
                    db.Dispose();
                }
            }
        }
        protected TransactionScope defAsyncScope()
        {
            return new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);
        }
        protected string getErrorMessage(Exception ex)
        {
            string s = null;
            if (ex.InnerException != null)
            {
                s = getErrorMessage(ex.InnerException);
            }
            else
            {
                s = ex.Message;
            }
            return s;
        }
        protected string getDbEntityValidationException(DbEntityValidationException ex)
        {
            string m = null;
            foreach (var err_Items in ex.EntityValidationErrors)
            {
                foreach (var err_Item in err_Items.ValidationErrors)
                {
                    m += $"[{err_Item.PropertyName}][{err_Item.ErrorMessage}]";
                }
            }
            return m;
        }
        public static string RemoveScriptTag(string htmlSource)
        {
            //移除  javascript code.
            htmlSource = Regex.Replace(htmlSource, @"<script[\d\D]*?>[\d\D]*?</script>", String.Empty);

            //移除html tag.
            //htmlSource = Regex.Replace(htmlSource, @"<[^>]*>", String.Empty);
            return htmlSource;
        }

        protected SerializeFile[] lstImgFile(string file_kind, string id)
        {
            string up_path_tpl_o = "~/_Code/SysUpFiles/{0}/{1}/{2}";
            string up_path_tpl_s = "~/_Code/SysUpFiles/{0}/{1}";

            string web_path_org = string.Format(up_path_tpl_o, file_kind, id, "origin");
            string server_path_org = System.Web.Hosting.HostingEnvironment.MapPath(web_path_org);
            string web_path_icon = string.Format(up_path_tpl_o, file_kind, id, "icon");

            List<SerializeFile> l_files = new List<SerializeFile>();

            string file_json_web_path = string.Format(up_path_tpl_s, file_kind, id);
            string file_json_server_path = System.Web.Hosting.HostingEnvironment.MapPath(file_json_web_path) + "\\file.json";

            string web_path_s = string.Format(up_path_tpl_s, file_kind, id, "origin");
            string server_path_s = System.Web.Hosting.HostingEnvironment.MapPath(web_path_s);

            if (System.IO.File.Exists(file_json_server_path))
            {
                var read_json = System.IO.File.ReadAllText(file_json_server_path);
                var get_file_json_object = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json).OrderBy(x => x.sort);

                foreach (var m in get_file_json_object)
                {
                    string get_file = server_path_org + "//" + m.fileName;
                    if (System.IO.File.Exists(get_file))
                    {
                        FileInfo file_info = new FileInfo(get_file);
                        SerializeFile file_object = new SerializeFile()
                        {
                            guid = m.guid,
                            fileName = file_info.Name,
                            fileKind = id,
                            iconPath = Url.Content(web_path_icon + "/" + file_info.Name),
                            originPath = Url.Content(web_path_org + "/" + file_info.Name),
                            size = file_info.Length,
                            isImage = true
                        };
                        l_files.Add(file_object);
                    }
                }
            }

            return l_files.ToArray();
        }
        protected ApiGetFile getImgFirst(string file_kind, string id, string size)
        {
            string up_path_tpl_o = "~/_Code/SysUpFiles/{0}/{1}/{2}";
            string up_path_tpl_s = "~/_Code/SysUpFiles/{0}/{1}";

            string web_path_size = string.Format(up_path_tpl_o, file_kind, id, size);
            string server_path_size = System.Web.Hosting.HostingEnvironment.MapPath(web_path_size);


            string file_json_web_path = string.Format(up_path_tpl_s, file_kind, id);
            string file_json_server_path = System.Web.Hosting.HostingEnvironment.MapPath(file_json_web_path) + "\\file.json";

            string web_path_s = string.Format(up_path_tpl_s, file_kind, id, size);
            string server_path_s = System.Web.Hosting.HostingEnvironment.MapPath(web_path_s);

            if (File.Exists(file_json_server_path))
            {
                var read_json = File.ReadAllText(file_json_server_path);
                var get_file_json_object = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json).OrderBy(x => x.sort).FirstOrDefault();

                if (get_file_json_object != null)
                {
                    string get_file = server_path_size + "//" + get_file_json_object.fileName;
                    if (File.Exists(get_file))
                    {
                        FileInfo file_info = new FileInfo(get_file);
                        ApiGetFile file_object = new ApiGetFile()
                        {
                            guid = get_file_json_object.guid,
                            src_path = Url.Content(web_path_size + "/" + file_info.Name),
                            size = file_info.Length,
                        };
                        return file_object;
                    }
                }
            }

            return null;
        }
        protected IList<ApiGetFile> getImgFiles(string file_kind, string id, string size)
        {
            string up_path_tpl_o = "~/_Code/SysUpFiles/{0}/{1}/{2}";
            string up_path_tpl_s = "~/_Code/SysUpFiles/{0}/{1}";

            string web_path_size = string.Format(up_path_tpl_o, file_kind, id, size);
            string server_path_size = System.Web.Hosting.HostingEnvironment.MapPath(web_path_size);


            string file_json_web_path = string.Format(up_path_tpl_s, file_kind, id);
            string file_json_server_path = System.Web.Hosting.HostingEnvironment.MapPath(file_json_web_path) + "\\file.json";

            string web_path_s = string.Format(up_path_tpl_s, file_kind, id, size);
            string server_path_s = System.Web.Hosting.HostingEnvironment.MapPath(web_path_s);

            if (File.Exists(file_json_server_path))
            {
                var read_json = File.ReadAllText(file_json_server_path);
                var get_file_json_object = JsonConvert.DeserializeObject<IList<JsonFileInfo>>(read_json).OrderBy(x => x.sort);

                if (get_file_json_object != null)
                {
                    IList<ApiGetFile> ilits_file = new List<ApiGetFile>();
                    foreach (var get_file_object in get_file_json_object)
                    {
                        string get_file = server_path_size + "//" + get_file_object.fileName;
                        if (File.Exists(get_file))
                        {
                            FileInfo file_info = new FileInfo(get_file);
                            ApiGetFile file_object = new ApiGetFile()
                            {
                                guid = get_file_object.guid,
                                src_path = Url.Content(web_path_size + "/" + file_info.Name),
                                size = file_info.Length,
                            };

                            ilits_file.Add(file_object);

                        }
                    }
                    return ilits_file;
                }
            }

            return null;
        }
        protected class ApiGetFile
        {
            public string guid { get; set; }
            public long size { get; set; }
            public string src_path { get; set; }
            public string link_path { get; set; }
        }

        #region 寄信相關
        public bool Mail_Send(string MailFrom, string[] MailTos, string MailSub, string MailBody, bool isBodyHtml)
        {
            try
            {
                //建立MailMessage物件
                MailMessage mms = new MailMessage();
                if (MailFrom != null)
                {
                    var mf = MailFrom.Split(':');
                    if (mf.Length == 2)
                    {
                        mms.From = new MailAddress(mf[1], mf[0]);//寄件人
                    }
                    else if (mf.Length == 1)
                    {
                        mms.From = new MailAddress(mf[0]);//寄件人
                    }
                }
                //mms.From = new MailAddress(MailFrom);//寄件人
                mms.Subject = MailSub;//信件主旨
                mms.Body = MailBody;//信件內容
                mms.IsBodyHtml = isBodyHtml;//判斷是否採用html格式

                if (MailTos != null)//防呆
                {
                    foreach (var str in MailTos)
                    {
                        if (str != "")
                        {
                            var m = str.Split(':');
                            if (m.Length == 2)
                            {
                                mms.To.Add(new MailAddress(m[1], m[0]));
                            }
                            else if (m.Length == 1)
                            {
                                mms.To.Add(new MailAddress(m[0]));
                            }
                        }
                    }
                }//End if (MailTos !=null)//防呆

                //if (Bcc != null) //防呆
                //{
                //    for (int i = 0; i < Bcc.Length; i++)
                //    {
                //        if (!string.IsNullOrEmpty(Bcc[i].Trim()))
                //        {
                //            //加入信件的密件副本(們)address
                //            mms.Bcc.Add(new MailAddress(Bcc[i].Trim()));
                //        }

                //    }
                //}//End if (Ccs!=null) //防呆



                using (SmtpClient client = new SmtpClient(CommWebSetup.MailServer))//或公司、客戶的smtp_server

                    client.Send(mms);//寄出一封信

                //釋放每個附件，才不會Lock住
                if (mms.Attachments != null && mms.Attachments.Count > 0)
                {
                    for (int i = 0; i < mms.Attachments.Count; i++)
                    {
                        mms.Attachments[i].Dispose();
                        mms.Attachments[i] = null;
                    }
                }

                return true;//寄信成功
            }
            catch (Exception)
            {
                return false;//寄信失敗
            }
        }

        #endregion
        #region forgot mail code
        protected ResultInfo addCheckCode(string mail)
        {
            ResultInfo r = new ResultInfo();
            using (TransactionScope tx = new TransactionScope())
            {
                using (var db = getDB0())
                {
                    try
                    {
                        TimeLinessCode md = new TimeLinessCode()
                        {
                            Id = Guid.NewGuid().ToString(),
                            email = mail,
                            is_use = false,
                            i_InsertDateTime = DateTime.Now,
                            i_ExpiryDateTime = DateTime.Now.AddHours(1)//有效時間為1小時
                        };

                        db.TimeLinessCode.Add(md);

                        db.SaveChanges();
                        tx.Complete();
                        r.result = true;
                        r.no = md.Id;
                    }
                    catch (Exception ex)
                    {
                        r.result = false;
                        r.message = ex.ToString();
                    }
                }
            }
            return r;
        }
        protected bool checkCode(string code)
        {
            using (var db0 = getDB0())
            {
                string dec_code = EncryptString.desDecryptBase64(code);//解密
                var item = db0.TimeLinessCode.FirstOrDefault(x => x.Id == dec_code & !x.is_use);
                bool res = item == null ? false : true;

                return res;
            }
        }
        protected void upCheckCode(string code)
        {
            ResultInfo r = new ResultInfo();
            using (TransactionScope tx = new TransactionScope())
            {
                using (var db = getDB0())
                {
                    try
                    {
                        string dec_code = EncryptString.desDecryptBase64(code);//解密
                        var item = db.TimeLinessCode.Find(dec_code);

                        item.is_use = true;

                        db.SaveChanges();
                        tx.Complete();
                        r.result = true;
                    }
                    catch (Exception ex)
                    {
                        r.result = false;
                        r.message = ex.ToString();
                    }
                }
            }
        }
        #endregion
    }

    #region 泛型控制器擴充

    [System.Web.Http.Authorize(Roles = "Managers,Admins")]
    public abstract class ajaxApi<M, Q> : BaseApiController
        where M : new()
        where Q : QueryBase
    {
        protected ResultInfo<M> r;
        protected ResultInfo<M[]> rs;
        protected M item;
    }

    [System.Web.Http.Authorize(Roles = "Managers,Admins")]
    public abstract class ajaxApi<M> : BaseApiController
    where M : new()
    {
        protected ResultInfo<M> r;
        protected ResultInfo<M[]> rs;
        protected M item;
    }


    [System.Web.Http.Authorize(Roles = "Managers,Admins")]
    public abstract class ajaxBaseApi : BaseApiController
    {

    }
    //All Roles
    [System.Web.Http.Authorize]
    public abstract class ajaxAllBaseApi : BaseApiController
    {
    }

    #endregion
}