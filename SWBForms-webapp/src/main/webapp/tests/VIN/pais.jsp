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
                var form=swbf.createForm({title: "Forma", width: "99%", height: "50%",     
                    values:{nombre:"Nombre por default"},
                },<%=id%>, "<%=dsName%>");
                
                form.submitButton.click = function(p1)
                {
                    swbf.submit(p1.target.form, this, function()
                    {
                        window.location = "VIN.jsp";    
                    });
                    //window.location = "/es/imicam/resultados?&id=<%=id%>";
                    //return false;
                };        
                
                form.buttons.addMember(isc.IButton.create(
                {
                    title: "Cancelar",
                    padding: "10px",
                    click: function(p1) {
                        window.location = "VIN.jsp";
                        return false;
                    }
                }));                
                
            </script>
        </div>

    </body>
</html>
