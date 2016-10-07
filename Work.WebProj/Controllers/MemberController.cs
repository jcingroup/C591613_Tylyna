using System.Web.Mvc;
using DotWeb.Controller;


namespace DotWeb.Controllers
{
    public class MemberController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Member");
        }        
    }

}
