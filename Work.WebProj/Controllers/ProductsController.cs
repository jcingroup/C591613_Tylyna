using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class ProductsController : WebUserController
    {
        // GET: Products
        public ActionResult Index()
        {
            return View("Normal");
        }
        // 咖啡品項(一般商品) - 分類九宮格，點選後進入咖啡介紹 Detail
        public ActionResult Normal()
        {
            return View();
        }
        // 季節限定(限定商品) - 分類九宮格，點選後進入咖啡介紹 Detail
        public ActionResult Special()
        {
            return View();
        }
        // 咖啡介紹
        public ActionResult Detail()
        {
            return View();
        }
        // 品嚐LITA - all 商品列表
        public ActionResult Taste()
        {
            return View();
        }
    }
}