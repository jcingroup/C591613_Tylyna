<%@ Import Namespace="System.IO" %>

<%@ Page Language="C#" %>

<html>
<body>
    <%
        var p = Server.MapPath("~/index.html");
        var f = new FileInfo(p);
        Response.Write(f.Exists);
    %>
</body>
</html>
