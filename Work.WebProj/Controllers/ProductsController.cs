using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class ProductsController : WebUserController
    {
        // GET: Products
        public ActionResult Index()
        {
            return View("Kind");
        }
        // 咖啡品項(一般)
        public ActionResult Kind()
        {
            return View();
        }
        // 季節限定
        public ActionResult Special()
        {
            return View();
        }
        // 彈跳視窗(加入購物車)
        public ActionResult Detail()
        {
            return View();
        }
        // 口味介紹-編輯器
        public ActionResult Taste()
        {
            return View();
        }
    }
}