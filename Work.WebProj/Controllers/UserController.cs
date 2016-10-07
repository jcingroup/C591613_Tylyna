using System.Web.Mvc;
using DotWeb.Controller;


namespace DotWeb.Controllers
{
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
    }

}
