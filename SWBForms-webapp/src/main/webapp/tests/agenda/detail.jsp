<%-- 
    Document   : test
    Created on : 09-nov-2013, 10:49:58
    Author     : javier.solis.g
--%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        
        <link href="platform.css" rel="stylesheet" type="text/css" />
        <script type="text/javascript" >var isomorphicDir = "/isomorphic/";</script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Core.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Foundation.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Containers.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Grids.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Forms.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_DataBinding.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Calendar.js" ></script>
        <script type="text/javascript" src="/isomorphic/skins/Enterprise/load_skin.js" ></script>
        <script type="text/javascript" SRC="/isomorphic/locales/frameworkMessages_es.properties" ></script>

        <script type="text/javascript" src="/swbforms/js/swbf.js" ></script>
        <script type="text/javascript" src="datasources.js" ></script>
        <script type="text/javascript" src="/swbforms/js/swbf_lang.js" ></script>
        
        <!--
                <script type="text/javascript" src="/itzplatform/js/jquery.min.js" ></script>
                <script type="text/javascript" src="/itzplatform/js/itzplatform.js" ></script>
                <script src="/swbadmin/js/longfu/json2.js" ></script>
                <script src="/swbadmin/js/longfu/swblongfileuploader.js" ></script> 
        -->        
    </head>
    <body>
        <%
            String id = request.getParameter("_id");
            String dsName = request.getParameter("dsName");
            if(id!=null)id="\""+id+"\"";
        %>        
        <h1>Detalle</h1>
        <div>
            <h2>Detalle:</h2>
            <script type="text/javascript">
                swbf.createForm({title:"Forma", width: "99%", height:"70%"},<%=id%>,"<%=dsName%>");                
            </script>
        </div>

    </body>
</html>
