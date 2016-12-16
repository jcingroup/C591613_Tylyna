using System.Web.Mvc;
using DotWeb.Controller;
using System.Collections.Generic;
using System.Linq;
using ProcCore.Business.DB0;

namespace DotWeb.Controllers
{
    public class NewsController : WebUserController
    {
        public ActionResult Index()
        {
            return Redirect("~/News/list");
        }
        public ActionResult list()
        {
            List<m_News> items = new List<m_News>();
            using (var db0 = getDB0())
            {
                items = db0.News
                    .Where(x => !x.i_Hide)
                    .OrderByDescending(x => x.day)
                    .Select(x => new m_News()
                    {
                        news_id = x.news_id,
                        day = x.day,
                        news_title = x.news_title,
                        news_content = x.news_content
                    }).ToList();

                foreach (var i in items)
                {
                    i.news_content = i.news_content != null ? RemoveHTMLTag(i.news_content) : null;//移除html標籤
                    var img = getImgFirst("NewsImg", i.news_id.ToString(), "size1");
                    i.img_src = img != null ? img.src_path : null;
                }
            }
            return View(items);
        }
        public ActionResult content(int? id)
        {
            News item;
            using (var db0 = getDB0())
            {
                bool Exist = db0.News.Any(x => x.news_id == id && x.i_Hide == false);
                if (id == null || !Exist)
                {
                    return Redirect("~/News/list");
                }
                else
                {
                    item = db0.News.Find(id);
                    var img = getImgFirst("NewsImg", item.news_id.ToString(), "size1");
                    item.img_src = img != null ? img.src_path : null;
                }
            }
            return View(item);
        }
    }

    public class m_News
    {
        public int news_id { get; set; }
        public string news_title { get; set; }
        public System.DateTime day { get; set; }
        public string news_content { get; set; }
        public string img_src { get; set; }
    }
}
