﻿using System.Web.Mvc;
using System.Web.Routing;

namespace DotWeb.AppStart
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
            name: "Manager",
            url: "_SysAdm",
            defaults: new { controller = "Index", action = "Login" }
            ).DataTokens["UseNamespaceFallback"] = false;

            //-----------------------------------------------------
            routes.MapRoute(
            name: "DefaultId",
            url: "{controller}/{action}/{id}",
            defaults: new { controller = "Index", action = "Index", id = UrlParameter.Optional }
            ).DataTokens["UseNamespaceFallback"] = false;

            routes.MapRoute(
            name: "DefaultNo",
            url: "{controller}/{action}/{no}",
            defaults: new { controller = "Index", action = "Index", no = UrlParameter.Optional }
            ).DataTokens["UseNamespaceFallback"] = false;

        }
    }
}
