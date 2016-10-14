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
    public class SysDemoController : AdminController
    {
        // GET: Active/SysDemo
        public ActionResult Index()
        {
            return View("Order_list");
        }
        // 產品
        public ActionResult Products_list()
        {
            return View();
        }
        public ActionResult Products_edit()
        {
            return View();
        }
        public ActionResult Products_Kind()
        {
            return View();
        }        
        // 會員及訂單
        public ActionResult Order_list()
        {
            return View();
        }
        public ActionResult Order_edit()
        {
            return View();
        }
        public ActionResult Account_list()
        {
            return View();
        }
        public ActionResult Account_edit()
        {
            return View();
        }

        // 其他頁資訊管理(編輯器)
        // 首頁
        public ActionResult Index_data()
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

        // FAQ
        public ActionResult FAQ_list()
        {
            return View();
        }
        public ActionResult FAQ_edit()
        {
            return View();
        }
    }
}