using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.LogicConect;
using ProcCore.Business.DB0;
using System.Linq;

namespace DotWeb.Controllers
{
    public class EmailController : WebUserController
    {
        public ActionResult Order()
        {//完成訂購
            var open = openLogic();
            Purchase md = new Purchase();
            using (var db0 = getDB0())
            {
                md = db0.Purchase.FirstOrDefault();//隨便抓第一筆
                md.Deatil = md.PurchaseDetail.ToList();
            }
            OrderEmail emd = new OrderEmail()
            {
                purchase = md,
                AccountName = (string)open.getParmValue(ParmDefine.AccountName),
                AccountNumber = (string)open.getParmValue(ParmDefine.AccountNumber),
                BankCode = (string)open.getParmValue(ParmDefine.BankCode),
                BankName = (string)open.getParmValue(ParmDefine.BankName)
            };
            return View("Email_order", emd);
        }
    }

}
