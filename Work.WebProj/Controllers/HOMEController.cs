using System.Web.Mvc;
using DotWeb.Controller;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System.Linq;

namespace DotWeb.Controllers
{
    public class HomeController : WebUserController
    {
        // 以下皆為編輯器
        // 簡介(利他精神)
        public ActionResult AboutUs()
        {
            List<Editor_L2> md = new List<Editor_L2>();
            int l1_id = (int)EditorState.AboutUs;
            using (var db0 = getDB0())
            {
                md = db0.Editor_L2
                    .OrderByDescending(x => x.sort)
                    .Where(x => x.editor_l1_id == l1_id & !x.i_Hide).ToList();
            }
            return View(md);
        }
        // 利他嚴選(嚴選製程)
        public ActionResult Quality(int? id)
        {
            EditorContent md = new EditorContent();
            int l1_id = (int)EditorState.Quality;
            using (var db0 = getDB0())
            {
                #region 過濾不存在id
                bool Exist = db0.Editor_L2.Any(x => x.editor_l1_id == l1_id & x.editor_l2_id == id & !x.i_Hide);
                if (id == null || !Exist)
                {
                    id = db0.Editor_L2.Where(x => x.editor_l1_id == l1_id & !x.i_Hide)
                                      .OrderByDescending(x => x.sort)
                                      .FirstOrDefault().editor_l2_id;
                }
                #endregion
                var item = db0.Editor_L2.Find(id);

                md.editor = item;
                md.menuStroe = db0.Editor_L2
                                .Where(x => x.editor_l1_id == l1_id & !x.i_Hide)
                                .OrderByDescending(x => x.sort)
                                .ToList();

                ViewBag.menu = id;
            }
            return View(md);
        }
        //// 利他嚴選(專業烘焙)
        //public ActionResult Quality2()
        //{
        //    return View();
        //}
        //// 利他嚴選(安心認證)
        //public ActionResult Quality3()
        //{
        //    return View();
        //}
        // 利他故事
        public ActionResult Story()
        {
            List<Editor_L2> md = new List<Editor_L2>();
            int l1_id = (int)EditorState.Story;
            using (var db0 = getDB0())
            {
                md = db0.Editor_L2
                    .OrderByDescending(x => x.sort)
                    .Where(x => x.editor_l1_id == l1_id & !x.i_Hide).ToList();
            }
            return View(md);
        }
        // 聯絡我們
        public ActionResult ContactUs()
        {
            return View();
        }
    }
    public class EditorContent
    {
        public IEnumerable<Editor_L2> menuStroe { get; set; }
        public Editor_L2 editor { get; set; }
    }
}