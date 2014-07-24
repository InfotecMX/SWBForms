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
            <h2 style="margin-right: 50px">Estado</h2>
            <script type="text/javascript">
                swbf.createGrid({left:"-10", margin:"10px", width: "100%", height: 200}, "Pais");
            </script>          
        </div>           
        
        <div>
            <h2 style="margin-right: 50px">Estado</h2>
            <script type="text/javascript">
                swbf.createGrid({left:"-10", margin:"10px", width: "100%", height: 200}, "Estado");
            </script>          
        </div>          
        
        <div>
            <h2 style="margin-right: 50px">Personal:</h2>
            <script type="text/javascript">
                swbf.createGrid({left:"-10", margin:"10px", width: "100%", height: 200}, "Personal");
            </script>          
        </div>    
        
        <div>
            <h2 style="margin-right: 50px">Direccion</h2>
            <script type="text/javascript">
                swbf.createGrid({left:"-10", margin:"10px", width: "100%", height: 200}, "Direccion");
            </script>          
        </div>            
        
        <div>
            <h2 style="margin-right: 50px">Reportes:</h2>
            <script type="text/javascript">
                swbf.createGrid(
                {
                    left:"-10", margin:"10px", width: "100%",                    
                    height: 200,
                    
                    fields:[
                        {name: "titulo"},
                        {name: "area"},
                        {name: "fecha"},
                        {name: "autor"},
                        {name: "revisor"}
                    ],
                    
                    recordDoubleClick: function(grid, record)
                    {
                        window.location = "detail.jsp?dsName=ReportesVIN&_id=" + record._id;
                        return false;
                    },
                    addButtonClick: function(event)
                    {
                        window.location = "detail.jsp?dsName=ReportesVIN";
                        return false;
                    },
                    //initialCriteria:{estatusTienda:"527f0b780364321b91c89f9d"},
                    
                    autoFetchTextMatchStyle:"exact",                    
                }, "ReportesVIN");
            </script>  
          
        </div>

    </body>
</html>
