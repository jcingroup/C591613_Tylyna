using System.Web.Mvc;
using DotWeb.Controller;


namespace DotWeb.Controllers
{
    public class NewsController : WebUserController
    {
        public ActionResult Index()
        {
            return View("list");
        }
        public ActionResult list()
        {
            return View();
        }
        public ActionResult content()
        {
            return View();
        }
    }

}
