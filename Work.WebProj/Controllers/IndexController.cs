using System.Web.Mvc;
using DotWeb.Controller;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System.Linq;
using ProcCore.Business.LogicConect;

namespace DotWeb.Controllers
{
    public class IndexController : WebUserController
    {
        public ActionResult Index()
        {
            IndexContent md = new IndexContent();
            var open = openLogic();
            using (var db0 = getDB0())
            {
                #region banner
                md.banner = db0.Banner
                                .Where(x => !x.i_Hide)
                                .OrderByDescending(x => x.sort)
                                .ToList();
                foreach (var i in md.banner)
                {
                    var img = getImgFirst("BannerImg", i.banner_id.ToString(), "size1");
                    i.img_src = img != null ? img.src_path : null;
                }
                #endregion
                md.youtube_url = (string)open.getParmValue(ParmDefine.YoutubeUrl);
                #region news
                md.news = db0.News
                            .Where(x => !x.i_Hide & !x.no_index)
                            .OrderByDescending(x => x.sort)
                            .Take(3)//最多3筆
                            .ToList();
                foreach (var i in md.news)
                {
                    i.news_content = i.news_content != null ? RemoveHTMLTag(i.news_content) : null;//移除html標籤
                    var img = getImgFirst("NewsImg", i.news_id.ToString(), "size1");
                    i.img_src = img != null ? img.src_path : null;
                }
                #endregion

            }
            return View("Index", md);
        }
        public RedirectResult Login()
        {
            return Redirect("~/Base/Login");
        }
    }
    public class IndexContent
    {
        public IEnumerable<Banner> banner { get; set; }
        public string youtube_url { get; set; }
        public IEnumerable<News> news { get; set; }//最多三筆
    }
}
