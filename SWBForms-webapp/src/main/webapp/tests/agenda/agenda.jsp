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
        <script type="text/javascript" >var isomorphicDir = "/isomorphic/";</script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Core.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Foundation.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Containers.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Grids.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Forms.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_DataBinding.js" ></script>
        <script type="text/javascript" src="/isomorphic/system/modules/ISC_Calendar.js" ></script>
        <script type="text/javascript" src="/isomorphic/skins/Enterprise/load_skin.js" ></script>
<!--        <script type="text/javascript" SRC="/isomorphic/locales/frameworkMessages_es.properties" ></script>-->

        <script type="text/javascript" src="/swbforms/js/swbf.js" ></script>
        <script type="text/javascript" src="datasources.js" ></script>
        <script type="text/javascript" src="/swbforms/js/swbf_lang.js" ></script>
    </head>
    <body>
        <h1>Hello World!</h1>
        <div>
            <h2 style="margin-right: 50px">Sexo:</h2>
            <script type="text/javascript">
                //swbf.createGrid({width:document.width - 230, height:document.height - 180}, "Bancos");
                swbf.createGrid({left:"-10", margin:"10px", width: "100%", height: 200}, "Sexo");
            </script>
          
            <h2>Estados:</h2>
            <script type="text/javascript">
                //swbf.createGrid({width:document.width - 230, height:document.height - 180}, "Bancos");
                swbf.createGrid({showFilterEditor: true, left:"-10", margin:"10px", width: "100%", height: 200}, "Estados");
            </script>         
            
            <h2>Direcciones:</h2>
            <script type="text/javascript">
                //swbf.createGrid({width:document.width - 230, height:document.height - 180}, "Bancos");
                swbf.createGrid({left:"-10", margin:"10px", width: "100%", height: 200}, "Direccion");
            </script>       
            
            <h2>Religiones:</h2>
            <script type="text/javascript">
                //swbf.createGrid({width:document.width - 230, height:document.height - 180}, "Bancos");
                swbf.createGrid({left:"-10", margin:"10px", width: "100%", height: 200}, "Religiones");
            </script>              
            
            <h2>Agenda:</h2>
            <script type="text/javascript">
                swbf.createGrid(
                {
                    left:"-10", margin:"10px", width: "100%",                    
                    height: 200,
                    
                    recordDoubleClick: function(grid, record)
                    {
                        window.location = "detail.jsp?dsName=Agenda&_id=" + record._id;
                        return false;
                    },
                    addButtonClick: function(event)
                    {
                        window.location = "detail.jsp?dsName=Agenda";
                        return false;
                    },
                    //initialCriteria:{estatusTienda:"527f0b780364321b91c89f9d"},
                    
                    autoFetchTextMatchStyle:"exact",                    
                }, "Agenda");
            </script>   
            
            <h2>Aurticulos:</h2>
            <script type="text/javascript">
                //swbf.createGrid({width:document.width - 230, height:document.height - 180}, "Bancos");
                swbf.createGrid(
                {
                    left:"-10", margin:"10px", width: "100%",                    
                    height: 200,
                    
                    recordDoubleClick: function(grid, record)
                    {
                        window.location = "detail.jsp?dsName=Articulos&_id=" + record._id;
                        return false;
                    },
                    addButtonClick: function(event)
                    {
                        window.location = "detail.jsp?dsName=Articulos";
                        return false;
                    },
                    //initialCriteria:{estatusTienda:"527f0b780364321b91c89f9d"},
                    
                    autoFetchTextMatchStyle:"exact",                    
                }, "Articulos");
            </script>              
            
            <h2>Autores:</h2>
            <script type="text/javascript">
                //swbf.createGrid({width:document.width - 230, height:document.height - 180}, "Bancos");
                swbf.createGrid({left:"-10", margin:"10px", width: "100%", height: 200}, "Autor");
            </script>              
         
        </div>
    </body>
</html>
