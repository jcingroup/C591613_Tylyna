using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.HandleResult;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System;

namespace DotWeb.Controllers
{
    public class OrderController : WebUserController
    {
        public ActionResult Index()
        {
            return View("Cart");
        }
        // 購物車
        public ActionResult Cart()
        {
            return View();
        }
        // 填寫訂單資料
        public ActionResult Step1_order()
        {
            return View();
        }
        // 下訂完成
        public ActionResult Step2_check()
        {
            return View();
        }
        // 已付款通知
        public ActionResult Reply()
        {
            return View();
        }
        // 完成訂單流程
        public ActionResult Finish()
        {
            return View();
        }

        /// <summary>
        /// 取得購物車資料
        /// </summary>
        /// <param name="md"></param>
        /// <returns></returns>
        [HttpGet]
        public string getCart()
        {
            ResultInfo<List<PurchaseDetail>> r = new ResultInfo<List<PurchaseDetail>>();
            List<PurchaseDetail> mds = new List<PurchaseDetail>();
            try
            {
                if (Session["ShoppingCart"] != null)
                    mds = (List<PurchaseDetail>)Session["ShoppingCart"];

                foreach (var i in mds)
                {
                    var img = getImgFirst("ProductImg", i.product_id.ToString(), "600");
                    i.img_src = img != null ? img.src_path : null;
                }

                r.data = mds;
                r.result = true;
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            return defJSON(r);
        }
    }

}
