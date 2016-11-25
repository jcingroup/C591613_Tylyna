using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.HandleResult;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System;
using System.Linq;

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
            Purchase md = new Purchase();
            List<PurchaseDetail> mds = new List<PurchaseDetail>();
            if (Session["ShoppingCart"] != null)
                mds = (List<PurchaseDetail>)Session["ShoppingCart"];

            if (mds.Count() <= 0)//購物車內沒資料,無法連到確認訂單
            {
                return Redirect("~/Order/Index");
            }
            using (var db0 = getDB0())
            {
                md = new Purchase()
                {
                    purchase_no=null,//後面再帶入
                    customer_id=0,//後面再帶入
                    pay_state=0,
                    ship_state=0,
                    Deatil=mds
                };

            }

            return View(md);
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
        #region 購物車
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
        [HttpPost]
        public string delProductCart(int p_d_id)
        {
            ResultInfo<List<PurchaseDetail>> r = new ResultInfo<List<PurchaseDetail>>();
            List<PurchaseDetail> mds = new List<PurchaseDetail>();
            try
            {
                if (Session["ShoppingCart"] != null)
                    mds = (List<PurchaseDetail>)Session["ShoppingCart"];

                var del_item = mds.Where(x => x.product_detail_id == p_d_id).FirstOrDefault();
                if (del_item != null)
                    mds.Remove(del_item);

                if (Session["ShoppingCart"] == null || del_item == null)
                {
                    r.result = false;
                    r.message = Resources.Res.Log_Err_Cart_ProductExist;
                }
                else
                {//有抓到購物車及刪除資料才更新購物車內容
                    Session["ShoppingCart"] = mds;
                    r.result = true;
                    r.id = mds.Count();
                }

            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            return defJSON(r);
        }
        [HttpPost]
        public string chgProductQty(chgQty p)
        {
            ResultInfo<List<PurchaseDetail>> r = new ResultInfo<List<PurchaseDetail>>();
            List<PurchaseDetail> mds = new List<PurchaseDetail>();
            try
            {
                if (Session["ShoppingCart"] != null)
                    mds = (List<PurchaseDetail>)Session["ShoppingCart"];

                var item = mds.Where(x => x.product_detail_id == p.p_d_id).FirstOrDefault();
                if (item != null)
                {
                    item.qty = p.qty;
                    item.sub_total = p.qty * item.price;
                }

                if (Session["ShoppingCart"] == null || item == null)
                {
                    r.result = false;
                    r.message = Resources.Res.Log_Err_Cart_ProductExist;
                }
                else
                {//有抓到購物車及修改資料才更新購物車內容
                    Session["ShoppingCart"] = mds;
                    r.result = true;
                }
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            return defJSON(r);
        }
        #endregion
    }
    public class chgQty
    {
        public int p_d_id { get; set; }
        public int qty { get; set; }
    }
}
