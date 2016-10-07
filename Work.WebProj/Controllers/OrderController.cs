using System.Web.Mvc;
using DotWeb.Controller;


namespace DotWeb.Controllers
{
    public class OrderController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Cart");
        }
        public ActionResult Cart()
        {
            return View();
        }
        public ActionResult Step1_order()
        {
            return View();
        }
        public ActionResult Step2_check()
        {
            return View();
        }
        public ActionResult Order_list()
        {
            return View();
        }
    }

}
