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
    public class ParamDataController : AdminController
    {
        #region Action and function section
        public ActionResult Main()
        {
            ActionRun();
            return View();
        }
        public ActionResult Youtube()
        {
            ActionRun();
            return View();
        }
        //測試sortable用
        public ActionResult Sortable()
        {
            ActionRun();
            return View();
        }
        #endregion
    }
}