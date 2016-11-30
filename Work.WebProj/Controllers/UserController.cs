using System.Web.Mvc;
using DotWeb.Controller;


namespace DotWeb.Controllers
{
    [MyAuthorizeForC(Roles = "Customers")]
    public class UserController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Account");
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
    }

}
