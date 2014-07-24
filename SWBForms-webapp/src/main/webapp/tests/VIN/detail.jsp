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
        <link href="/swbforms/css/swbf.css" rel="stylesheet" type="text/css" />
        <script type="text/javascript" src="/swbforms/js/swbf.js" ></script>
    </head>
    <body>
        <script type="text/javascript">
            swbf.initPlatform("datasources.js");
        </script>  
        <%
            String id = request.getParameter("_id");
            String dsName = request.getParameter("dsName");
            if (id != null)
            {
                id = "\"" + id + "\"";
            }
        %>        
        <h1>Detalle</h1>
        <div>
            <h2>Detalle:</h2>
            <script type="text/javascript">
                swbf.createForm({title: "Forma", width: "99%", height: "50%",
                 
                    fields: [
                        {name: "titulo"},
                        {name: "area", canEdit:true},
                        {name: "fecha"},
                        {name: "autor"},
                        {name: "revisor"},
                        {name: "direccion", winEdit: {title:"Hola", 
                            fields: [
                                {name: "calle"},
                                {name: "numero"},
                                //{name: "colonia"},
                                {name: "municipio"},
                                {name: "cp",validators:[{stype:"zipcode", errorMessage:"hola error..."}]},
                                {name: "pais"},
                                {name: "estado"}
                            ]}, //winEdit:false   deshabilitar winEdit del padre
                            fields: [
                                {name: "calle"},
                                {name: "numero"},
                                {name: "colonia"},
                                {name: "municipio"},
                                {name: "cp",validators:[{stype:"zipcode"}]},
                                //{name: "estado"},
                            ]
                        }
                    ],
        
/*                    
                    links: [
                        {name: "direccion2", fields: [
                                {name: "calle"},
                                {name: "numero"},
                                {name: "colonia"},
                                {name: "municipio"},
                                {name: "cp"},
                                //{name: "estado"},
                            ]
                        }
                    ]
*/                    
                    
                },<%=id%>, "<%=dsName%>");
            </script>
        </div>

    </body>
</html>
