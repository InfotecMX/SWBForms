<%-- 
    Document   : agenda
    Created on : 11-nov-2013, 16:03:28
    Author     : javier.solis.g
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <link href="/swbforms/css/swbf.css" rel="stylesheet" type="text/css" />
        <script type="text/javascript" src="/swbforms/js/swbf.js" ></script>
    </head>
    <body>
        <script type="text/javascript">
            swbf.initPlatform("datasources.js");
        </script>  

        
        <h1>Hello World!</h1>
        
        <div>
            <h2 style="margin-right: 50px">Areas</h2>
            <script type="text/javascript">
                swbf.createGrid({left:"-10", margin:"10px", width: "100%", height: 200}, "Area");
            </script>          
        </div>          
        
    </body>
</html>
