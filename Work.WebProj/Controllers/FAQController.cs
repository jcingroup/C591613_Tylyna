using System.Web.Mvc;
using DotWeb.Controller;


namespace DotWeb.Controllers
{
    public class FAQController : WebUserController
    {
        public ActionResult Index()
        {
            return View("FAQ");
        }        
    }

}
