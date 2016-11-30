using System.Web.Mvc;
using DotWeb.Controller;
using ProcCore.Business.LogicConect;
using ProcCore.Business.DB0;
using System.Linq;
using System;
using System.Collections.Generic;
using ProcCore.HandleResult;

namespace DotWeb.Controllers
{
    public class EmailController : WebUserController
    {
        public EmailController() : base()
        {
            System.Web.Routing.RouteData route = new System.Web.Routing.RouteData();
            route.Values.Add("action", "Reply"); // ActionName
            route.Values.Add("controller", "Email");
            newContext = new ControllerContext(new System.Web.HttpContextWrapper(System.Web.HttpContext.Current), route, this);
        }
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
        public ActionResult Reply()
        {//已付款通知
            RemitEmail emd = new RemitEmail()
            {
                no = "p123",
                day = DateTime.Now
            };
            return View("Email_paymentreply", emd);
        }
        public ActionResult Ship()
        {//出貨通知
            RemitEmail emd = new RemitEmail()
            {
                no = "p123",
                day = DateTime.Now
            };
            return View("Email_ship", emd);
        }
        public ActionResult Forgot()
        {//忘記密碼
            return View("Email_forgot");
        }

        #region email寄送程式
        /// <summary>
        /// 送出訂單
        /// </summary>
        /// <param name="md"></param>
        /// <param name="ctr"></param>
        /// <returns></returns>
        public ResultInfo sendOrderMail(OrderEmail md)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                #region 信件發送
                string Body = getMailBody("../Email/Email_order", md, newContext);//套用信件版面
                Boolean mail;

                #region 收信人及寄信人
                string sendMail = openLogic().getReceiveMails()[0];

                List<string> r_mails = openLogic().getReceiveMails().ToList();
                if (!r_mails.Any(x => x == md.purchase.receive_name)) { r_mails.Add(md.purchase.receive_name + ":" + md.purchase.receive_email); }
                #endregion

                mail = Mail_Send(sendMail, //寄信人
                                r_mails.ToArray(), //收信人
                                string.Format(Resources.Res.MailTitle_Order, Resources.Res.System_FrontName), //信件標題
                                Body, //信件內容
                                true); //是否為html格式
                if (mail == false)
                {//送信失敗
                    r.result = false;
                    r.message = Resources.Res.Log_Err_SendMailFail;
                    return r;
                }
                #endregion

            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            return r;
        }

        /// <summary>
        /// 訂單對帳通知
        /// </summary>
        /// <param name="no"></param>
        /// <param name="remit_day"></param>
        /// <returns></returns>
        public ResultInfo sendRemitMail(RemitEmail md)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                #region 信件發送
                string Body = getMailBody("../Email/Email_paymentreply", md, newContext);//套用信件版面
                Boolean mail;

                #region 收信人及寄信人
                string sendMail = openLogic().getReceiveMails()[0];
                List<string> r_mails = openLogic().getReceiveMails().ToList();
                #endregion

                mail = Mail_Send(sendMail, //寄信人
                                r_mails.ToArray(), //收信人
                                string.Format(Resources.Res.MailTitle_Reply, Resources.Res.System_FrontName), //信件標題
                                Body, //信件內容
                                true); //是否為html格式
                if (mail == false)
                {//送信失敗
                    r.result = true;
                    r.message = Resources.Res.Log_Err_SendMailFail;
                    return r;
                }
                #endregion
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            return r;
        }

        /// <summary>
        /// 出貨通知
        /// </summary>
        /// <param name="no"></param>
        /// <param name="remit_day"></param>
        /// <returns></returns>
        public ResultInfo sendShipMail(ShipEmail md)
        {
            ResultInfo r = new ResultInfo();
            try
            {
                #region 信件發送
                string Body = getMailBody("../Email/Email_ship", md, newContext);//套用信件版面
                Boolean mail;

                #region 收信人及寄信人
                string sendMail = openLogic().getReceiveMails()[0];
                List<string> r_mails = openLogic().getReceiveMails().ToList();
                if (!r_mails.Any(x => x == md.mail)) { r_mails.Add(md.name + ":" + md.mail); }
                #endregion

                mail = Mail_Send(sendMail, //寄信人
                                r_mails.ToArray(), //收信人
                                string.Format(Resources.Res.MailTitle_Ship, Resources.Res.System_FrontName), //信件標題
                                Body, //信件內容
                                true); //是否為html格式
                if (mail == false)
                {//送信失敗
                    r.result = true;
                    r.message = Resources.Res.Log_Err_SendMailFail;
                    return r;
                }
                #endregion
            }
            catch (Exception ex)
            {
                r.result = false;
                r.message = ex.Message;
            }
            return r;
        }
        #endregion
    }
    public class OrderEmail
    {
        //轉帳資訊
        public string AccountName { get; set; }
        public string AccountNumber { get; set; }
        public string BankCode { get; set; }
        public string BankName { get; set; }
        //會員是否有登入
        public bool isLogin { get; set; }

        public Purchase purchase { get; set; }
    }
    public class RemitEmail
    {
        public string no { get; set; }
        public DateTime? day { get; set; }
    }
    public class ShipEmail : RemitEmail
    {
        public string name { get; set; }
        public string mail { get; set; }
    }
}
