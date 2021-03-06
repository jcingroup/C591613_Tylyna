﻿using ProcCore.WebCore;
using System;

namespace DotWeb.CommSetup
{
    public static class CommWebSetup
    {
        private static string GetKeyValue(string key)
        {
            return System.Configuration.ConfigurationManager.AppSettings[key];
        }
        public static string AutoLoginUser
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["DEV_USER"];
            }
        }
        public static string AutoLoginPassword
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["DEV_PWD"];
            }
        }
        public static string WebCookiesId
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["WebCookiesId"];
            }
        }
        public static string ManageDefCTR
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["ManageDefCTR"];
            }
        }
        public static string MemberDefCTR
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["MemberDefCTR"];
            }
        }
        public static string MemberRegisterCTR
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["MemberRegisterCTR"];
            }
        }
        public static string ManageTabletCTR
        {
            get
            {
                return "~/Active/Tablet/Menu";
            }
        }
        public static string UserLoginSource
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["UserLoginSource"];
            }
        }
        public static DateTime Expire
        {
            get
            {
                return DateTime.Parse(System.Configuration.ConfigurationManager.AppSettings["Expire"]);
            }
        }
        public static int MasterGridDefPageSize
        {
            get
            {
                return int.Parse(System.Configuration.ConfigurationManager.AppSettings["PageSize"]);
            }
        }
        public static string Cookie_UserName
        {
            get
            {
                return "Cookie_UserName";
            }
        }
        public static string Cookie_LastLogin
        {
            get
            {
                return "Cookie_LastLogin";
            }
        }
        public static string Cookie_DepartmentId
        {
            get
            {
                return "Cookie_DepartmentId";
            }
        }
        public static string Cookie_DepartmentName
        {
            get
            {
                return "Cookie_DepartmentName";
            }
        }
        public static string CacheVer
        {
            get
            {
                var v = GetKeyValue("CacheVer");
                if (v == "0")
                    return Guid.NewGuid().ToString();
                else
                    return v;
            }
        }
        public static string MailServer
        {
            get
            {
                return GetKeyValue("MailServer");
            }
        }
        public static string MailTitle_Order
        {
            get
            {
                return GetKeyValue("MailTitle_Order");
            }
        }
        public static string DEV_WebUrl
        {//email用
            get
            {
                return GetKeyValue("DEV_WebUrl");
            }
        }
        public static string[] MailToList
        {
            get
            {
                var s = GetKeyValue("MailToList");
                string[] r = s.Split(',');
                return r;
            }
        }
        public static string DEV_MemberPWD
        {
            get
            {
                return GetKeyValue("DEV_MemberPWD");
            }
        }
        public static string DB0_CodeString
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["DB0"];
            }
        }
        public const string LoginId = "LoginId";
        public const string LoginType = "LoginType";
    }

    #region Image UpLoad Parma
    public static class ImageFileUpParm
    {
        public static ImageUpScope NewsBasicSingle
        {
            get
            {
                ImageUpScope imUp = new ImageUpScope() { keepOrigin = true, limitCount = 50, limitSize = 1024 * 1024 * 2 };
                imUp.Parm = new ImageSizeParm[] {
                    new ImageSizeParm(){ width=700,folderName="Photo1"}
                };
                return imUp;
            }
        }
        public static ImageUpScope ProductList
        {
            get
            {
                ImageUpScope imUp = new ImageUpScope() { keepOrigin = true, limitCount = 1, limitSize = 1024 * 450 };
                imUp.Parm = new ImageSizeParm[] {
                    new ImageSizeParm(){ folderName="600", width=600}
                };
                return imUp;
            }
        }
        public static ImageUpScope BannerRotator
        {
            get
            {
                ImageUpScope imUp = new ImageUpScope() { keepOrigin = true, limitCount = 1, limitSize = 1024 * 500 };
                imUp.Parm = new ImageSizeParm[] {
                    new ImageSizeParm(){ width=1280,heigh=420,folderName="size1"}
                };
                return imUp;
            }
        }
        public static ImageUpScope NewsList
        {
            get
            {
                ImageUpScope imUp = new ImageUpScope() { keepOrigin = true, limitCount = 1, limitSize = 1024 * 800 };
                imUp.Parm = new ImageSizeParm[] {
                    new ImageSizeParm(){ folderName="size1",heigh=500}
                };
                return imUp;
            }
        }
    }
    public static class SysFileUpParm
    {
        public static FilesUpScope BaseLimit
        {
            get
            {
                FilesUpScope FiUp = new FilesUpScope() { limitCount = 5, limitSize = 1024 * 1024 * 256 };
                return FiUp;
            }
        }
    }
    #endregion
}