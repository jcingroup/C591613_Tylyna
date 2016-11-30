using System.Web.Mvc;
using DotWeb.Controller;

namespace DotWeb.Controllers
{
    public class HomeController : WebUserController
    {
        // 以下皆為編輯器
        // 簡介(利他精神)
        public ActionResult AboutUs()
        {
            return View();
        }
        // 利他嚴選(嚴選製程)
        public ActionResult Quality()
        {
            return View();
        }
        // 利他嚴選(專業烘焙)
        public ActionResult Quality2()
        {
            return View();
        }
        // 利他嚴選(安心認證)
        public ActionResult Quality3()
        {
            return View();
        }
        // 利他故事
        public ActionResult Story()
        {
            return View();
        }
        // 聯絡我們
        public ActionResult ContactUs()
        {
            return View();
        }
    }
}