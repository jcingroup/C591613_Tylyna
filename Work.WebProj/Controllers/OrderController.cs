using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.HandleResult;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System;
using System.Linq;
using DotWeb.CommSetup;
using ProcCore.Business.LogicConect;
using ProcCore;

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
            OrderInfo md = new OrderInfo();
            List<PurchaseDetail> mds = new List<PurchaseDetail>();
            if (Session[this.CartSession] != null)
                mds = (List<PurchaseDetail>)Session[this.CartSession];

            if (mds.Count() <= 0)//購物車內沒資料,無法連到確認訂單
            {
                return Redirect("~/Order/Index");
            }
            using (var db0 = getDB0())
            {

                int c_id = (this.isLogin) ? int.Parse(this.MemberId) : 0;
                var item = (this.isLogin) ? db0.Customer.Where(x => x.customer_id == c_id).FirstOrDefault() : null;
                foreach (var i in mds)
                {
                    var img = getImgFirst("ProductImg", i.product_id.ToString(), "600");
                    i.img_src = img != null ? img.src_path : null;
                }
                var purchase = new Purchase()
                {
                    purchase_no = null,//後面再帶入
                    pay_state = (int)IPayState.unpaid,
                    ship_state = (int)IShipState.unshipped,
                    total = mds.Sum(x => x.sub_total),
                    ship_fee = 0,
                    bank_charges = 0,
                    Deatil = mds
                };
                if (item != null)
                {//有登入預設帶入會員資料
                    purchase.customer_id = item.customer_id;
                    purchase.receive_email = item.email;
                    purchase.receive_name = item.c_name;
                    purchase.receive_tel = item.tel;
                    purchase.receive_mobile = item.mobile;
                    purchase.receive_zip = item.zip;
                    purchase.receive_address = item.address;
                }
                md.ship = db0.Shipment.OrderByDescending(x => x.limit_money).ToList();
                md.purchase = purchase;
            }

            return View(md);
        }
        // 下訂完成
        //public ActionResult Step2_check()
        //{
        //    return View();
        //}
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

        #region 訂單
        [HttpPost]
        public string setOrder(Purchase md)
        {
            ResultInfo r = new ResultInfo();
            r.result = true; r.hasData = true;//預設
            List<PurchaseDetail> mds = new List<PurchaseDetail>();
            try
            {
                #region 送出訂單
                using (var db0 = getDB0())
                {
                    #region 有產品不存在或下架
                    bool p_check = false; List<string> err = new List<string>();
                    foreach (var d in md.Deatil)
                    {
                        bool d_check = db0.ProductDetail.Any(x => x.product_detail_id == d.product_detail_id & x.product_id == d.product_id &
                                                               x.Product.stock_state == (int)IStockState.on_store_shelves & x.stock_state == (int)IStockState.on_store_shelves &
                                                               !x.Product.i_Hide);
                        if (d_check)
                        {
                            var item = db0.ProductDetail.Find(d.product_detail_id);
                            d.p_d_sn = item.sn;//產品料號
                            d.p_name = item.Product.product_name;//產品名稱
                            d.p_d_pack_name = item.pack_name;//產品包裝
                            d.price = item.price;//產品價格
                            d.sub_total = item.price * d.qty;
                        }
                        else
                        {
                            p_check = true;
                            err.Add(d.p_name);
                        }
                    }
                    if (p_check)
                    {//有產品不存在或下架
                        r.result = false;
                        r.message = string.Format(Resources.Res.Log_Err_AddCart_Exist, String.Join("、", err.ToArray()));
                        return defJSON(r);
                    }
                    md.total = md.Deatil.Sum(x => x.sub_total) + md.ship_fee + md.bank_charges;
                    #endregion
                }
                #region 加入會員
                if (!this.isLogin)
                {
                    var customer = new Customer()
                    {
                        email = md.receive_email,
                        c_pw = Server.UrlEncode(EncryptString.desEncryptBase64(md.receive_mobile)),//預設密碼改為手機
                        c_name = md.receive_name,
                        tel = md.receive_tel,
                        mobile = md.receive_mobile,
                        zip = md.receive_zip,
                        address = md.receive_address
                    };
                    r = addCustomer(customer);
                    if (r.result)
                    {
                        md.customer_id = r.id;
                    }
                    else
                    {//會員註冊失敗
                        r.result = false;
                        r.message = r.message;
                        return defJSON(r);
                    }

                }

                #endregion
                r = addPurchase(md);
                if (md.receive_email != null & r.result)
                {//寄送email
                    var open = openLogic();
                    OrderEmail emd = new OrderEmail()
                    {
                        purchase = md,
                        isLogin = this.isLogin,
                        AccountName = (string)open.getParmValue(ParmDefine.AccountName),
                        AccountNumber = (string)open.getParmValue(ParmDefine.AccountNumber),
                        BankCode = (string)open.getParmValue(ParmDefine.BankCode),
                        BankName = (string)open.getParmValue(ParmDefine.BankName)
                    };

                    #region 信件發送
                    ResultInfo sendmail = (new EmailController()).sendOrderMail(emd);
                    #endregion
                    if (!sendmail.result)
                    {//送信失敗
                        r.result = true;
                        r.hasData = false;
                        r.message = sendmail.message;
                    }
                    else
                    {
                        r.message = Resources.Res.Log_Success_Order;
                    }

                    Session.Remove(this.CartSession);
                }
                #endregion
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            return defJSON(r);
        }
        #endregion
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
                if (Session[this.CartSession] != null)
                    mds = (List<PurchaseDetail>)Session[this.CartSession];

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
                if (Session[this.CartSession] != null)
                    mds = (List<PurchaseDetail>)Session[this.CartSession];

                var del_item = mds.Where(x => x.product_detail_id == p_d_id).FirstOrDefault();
                if (del_item != null)
                    mds.Remove(del_item);

                if (Session[this.CartSession] == null || del_item == null)
                {
                    r.result = false;
                    r.message = Resources.Res.Log_Err_Cart_ProductExist;
                }
                else
                {//有抓到購物車及刪除資料才更新購物車內容
                    Session[this.CartSession] = mds;
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
                if (Session[this.CartSession] != null)
                    mds = (List<PurchaseDetail>)Session[this.CartSession];

                var item = mds.Where(x => x.product_detail_id == p.p_d_id).FirstOrDefault();
                if (item != null)
                {
                    item.qty = p.qty;
                    item.sub_total = p.qty * item.price;
                }

                if (Session[this.CartSession] == null || item == null)
                {
                    r.result = false;
                    r.message = Resources.Res.Log_Err_Cart_ProductExist;
                }
                else
                {//有抓到購物車及修改資料才更新購物車內容
                    Session[this.CartSession] = mds;
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
    public class OrderInfo
    {
        public Purchase purchase { get; set; }
        public IEnumerable<Shipment> ship { get; set; }
    }
}
