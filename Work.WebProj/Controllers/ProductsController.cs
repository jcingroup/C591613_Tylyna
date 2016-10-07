using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class ProductsController : WebUserController
    {
        // GET: Products
        public ActionResult Index()
        {
            return View("list");
        }
        public ActionResult list()
        {
            return View();
        }
        public ActionResult Content()
        {
            return View();
        }
    }
}