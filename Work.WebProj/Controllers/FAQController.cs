using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.DB0;
using System.Collections.Generic;
using System.Linq;

namespace DotWeb.Controllers
{
    public class FAQController : WebUserController
    {
        public ActionResult Index()
        {
            List<m_FAQ> items = new List<m_FAQ>();
            using (var db0 = getDB0())
            {
                items = db0.FAQ
                    .Where(x => !x.i_Hide)
                    .OrderByDescending(x => x.sort)
                    .Select(x => new m_FAQ()
                    {
                        faq_id = x.faq_id,
                        q_title = x.q_title,
                        a_content = x.a_content
                    }).ToList();
            }
            return View("FAQ", items);
        }
    }
    public class m_FAQ
    {
        public int faq_id { get; set; }
        public string q_title { get; set; }
        public string a_content { get; set; }
    }
}
