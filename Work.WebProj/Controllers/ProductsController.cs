using System.Web.Mvc;
using DotWeb.Controller;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System.Linq;
using ProcCore.HandleResult;
using System;

namespace DotWeb.Controllers
{
    public class ProductsController : WebUserController
    {
        // GET: Products
        public ActionResult Index(int? kind)
        {
            ProductList md = new ProductList();
            using (var db0 = getDB0())
            {
                md.menuStroe = db0.ProductKind
                                .Where(x => !x.i_Hide)
                                .OrderByDescending(x => x.sort)
                                .ToList();
                kind = (kind != null & md.menuStroe.Any(x => x.product_kind_id == kind)) ? kind : md.menuStroe.FirstOrDefault().product_kind_id;
                ViewBag.menu = kind;

                md.products = db0.Product
                               .Where(x => !x.i_Hide & x.product_kind_id == kind)
                               .OrderByDescending(x => x.sort)
                               .ToList();
                foreach (var i in md.products)
                {
                    var img = getImgFirst("ProductImg", i.product_id.ToString(), "600");
                    i.img_src = img != null ? img.src_path : null;
                }

            }
            return View("Normal", md);
        }
        // 咖啡品項(一般商品) - 分類九宮格，點選後進入咖啡介紹 Detail
        public ActionResult Normal()
        {
            return View();
        }
        // 季節限定(限定商品) - 分類九宮格，點選後進入咖啡介紹 Detail
        public ActionResult Special()
        {
            return View();
        }
        // 咖啡介紹
        public ActionResult Detail(int? id)
        {
            ProductContent md = new ProductContent();
            using (var db0 = getDB0())
            {
                #region 過濾不存在id
                bool Exist = db0.Product.Any(x => x.product_id == id & !x.i_Hide);
                if (id == null || !Exist)
                {
                    return Redirect("~/Products/Index");
                }
                #endregion
                var item = db0.Product.Find(id);
                var img = getImgFirst("ProductImg", item.product_id.ToString(), "600");
                item.img_src = img != null ? img.src_path : null;
                item.Deatil = item.ProductDetail
                     .Select(x => new m_ProductDetail()
                     {
                         product_id = x.product_id,
                         product_detail_id = x.product_detail_id,
                         sn = x.sn,//料號
                         pack_type = x.pack_type,//包裝
                         weight = x.weight,//重量
                         price = x.price,//單價
                         stock_state = x.stock_state,//狀態 上架/缺貨中
                         qty = 1
                     })
                    .ToList();

                md.product = item;
                md.menuStroe = db0.ProductKind
                                .Where(x => !x.i_Hide)
                                .OrderByDescending(x => x.sort)
                                .ToList();

                ViewBag.menu = item.product_kind_id;
            }
            return View(md);
        }
        // 品嚐LITA - 文案(可設超連結至該商品頁 Detail)
        public ActionResult Taste()
        {
            return View();
        }

        /// <summary>
        /// 產品加入購物車
        /// </summary>
        /// <param name="md"></param>
        /// <returns></returns>
        [HttpPost]
        public string addCart(PurchaseDetail md)
        {
            ResultInfo r = new ResultInfo();
            List<PurchaseDetail> mds = null;
            try
            {
                using (var db0 = getDB0())
                {
                    //確認該產品是否存在,是否在上架中
                    bool p_check = db0.ProductDetail.Any(x => x.product_detail_id == md.product_detail_id & x.product_id == md.product_id &
                                                              x.Product.stock_state == (int)IStockState.on_store_shelves & x.stock_state == (int)IStockState.on_store_shelves &
                                                              !x.Product.i_Hide);

                    if (p_check)
                    {
                        #region  重抓產品資料(不要相信使用者給的產品資料)
                        var p_d = db0.ProductDetail.Find(md.product_detail_id);
                        md.p_d_sn = p_d.sn;//產品料號
                        md.p_name = p_d.Product.product_name;//產品名稱
                        md.p_d_pack_type = p_d.pack_type;//產品包裝
                        md.price = p_d.price;//產品價格
                        #endregion

                        if (Session[this.CartSession] == null)
                        {
                            mds = new List<PurchaseDetail>();
                            mds.Add(md);
                        }
                        else
                        {
                            mds = (List<PurchaseDetail>)Session[this.CartSession];
                            //判斷產品是否已存在
                            var item = mds.Where(x => x.product_id == md.product_id & x.product_detail_id == md.product_detail_id).FirstOrDefault();
                            if (item != null)
                            {
                                item.qty += md.qty;
                                item.price = md.price;
                                item.sub_total = item.qty * item.price;
                            }
                            else
                            {
                                mds.Add(md);
                            }
                        }
                        Session[this.CartSession] = mds;
                        r.result = true;
                        r.id = mds.Count();//購物車目前數量
                    }
                    else
                    {
                        r.result = false;
                        r.message = string.Format(Resources.Res.Log_Err_AddCart_Exist, md.p_name);
                    }
                }

            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            return defJSON(r);
        }
    }
    public class ProductList
    {
        public IEnumerable<Product> products { get; set; }
        public IEnumerable<ProductKind> menuStroe { get; set; }
    }
    public class ProductContent
    {
        public IEnumerable<ProductKind> menuStroe { get; set; }
        public Product product { get; set; }
    }
}