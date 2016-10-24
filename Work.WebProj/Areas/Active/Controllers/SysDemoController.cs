using DotWeb.CommSetup;
using DotWeb.Controller;
using ProcCore.Business.LogicConect;
using ProcCore.HandleResult;
using System;
using System.IO;
using System.Web.Mvc;
using System.Linq;
using System.Collections.Generic;

namespace DotWeb.Areas.Active.Controllers
{
    public class SysDemoController : WebUserController
    {
        // GET: Active/SysDemo
        public ActionResult Index()
        {
            return View("Order_list");
        }
        // 產品
        // 資料列表
        public ActionResult Products_list()
        {
            return View();
        }
        // 資料編輯
        public ActionResult Products_edit()
        {
            return View();
        }
        // 產品分類
        public ActionResult Products_Kind()
        {
            return View();
        }
        // 產品品名
        public ActionResult Products_Name()
        {
            return View();
        }
        // 會員及訂單
        // 訂單列表
        public ActionResult Order_list()
        {
            return View();
        }
        // 訂單編輯
        public ActionResult Order_edit()
        {
            return View();
        }
        // 統計(以待出貨為主)
        public ActionResult Order_count()
        {
            return View();
        }
        // 收款方式
        public ActionResult Payment()
        {
            return View();
        }
        // 會員列表
        public ActionResult Account_list()
        {
            return View();
        }
        // 會員編輯
        public ActionResult Account_edit()
        {
            return View();
        }

        // 其他頁資訊管理(編輯器)
        // 首頁輪播圖
        public ActionResult Index_list()
        {
            return View();
        }
        public ActionResult Index_edit()
        {
            return View();
        }
        // 利他精神(關於我們)
        public ActionResult AboutUs()
        {
            return View();
        }
        // 利他精神
        public ActionResult Quality()
        {
            return View();
        }
        // 口味介紹/品嚐LITA(in Products sub-nav2)
        public ActionResult Taste()
        {
            return View();
        }
        // 利他故事
        public ActionResult Story()
        {
            return View();
        }

        // 最新消息
        public ActionResult News_list()
        {
            return View();
        }
        public ActionResult News_edit()
        {
            return View();
        }

        // FAQ
        public ActionResult FAQ_list()
        {
            return View();
        }
        public ActionResult FAQ_edit()
        {
            return View();
        }

        // 修改密碼
        public ActionResult ChangePW()
        {
            return View();
        }
    }
}