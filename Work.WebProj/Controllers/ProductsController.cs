using System.Web.Mvc;
using DotWeb.Controller;
using System.Collections.Generic;
using ProcCore.Business.DB0;
using System.Linq;

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
                    var img = getImgFirst("ProductImg", i.product_id.ToString(), "700");
                    i.img_src = img.src_path;
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
        public ActionResult Detail(int id)
        {
            ProductContent md = new ProductContent();
            using (var db0 = getDB0())
            {
                var item = db0.Product.Find(id);
                var img = getImgFirst("ProductImg", item.product_id.ToString(), "700");
                item.img_src = img.src_path;

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