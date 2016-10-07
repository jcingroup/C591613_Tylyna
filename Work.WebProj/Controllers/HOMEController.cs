using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class HomeController : WebUserController
    {
        // GET: HOME        
        public ActionResult AboutUs()
        {
            return View();
        }
        public ActionResult Quality()
        {
            return View();
        }
        public ActionResult Info()
        {
            return View();
        }
        public ActionResult Story()
        {
            return View();
        }
        public ActionResult ContactUs()
        {
            return View();
        }
    }
}