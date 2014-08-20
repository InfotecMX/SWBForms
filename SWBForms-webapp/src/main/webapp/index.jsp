<%-- 
    Document   : index
    Created on : Dec 15, 2013, 5:30:59 PM
    Author     : javier.solis.g
--%>
<%@page import="org.semanticwb.forms.SWBUser"%>
<%@page import="org.semanticwb.forms.SWBForms"%>
<%@page import="org.semanticwb.forms.SWBDataSource"%>
<%@page import="org.semanticwb.forms.SWBScriptEngine"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
    </head>
    <body>
        <h1>Hello World!</h1>
        <pre>
<%
    SWBUser user=(SWBUser)session.getAttribute("user");
    if(user==null)
    {
        user=new SWBUser();
        user.put("_id", "jei");        
        session.setAttribute("user", user);
    }    
    
    //init SWBPlatform
    if (SWBForms.getApplicationPath() == null)
    {
        String apppath = config.getServletContext().getRealPath("/");
        SWBForms.createInstance(apppath);
    }         
    
    SWBScriptEngine engine=SWBForms.getUserScriptEngine("/tests/VIN/datasources.js",user);    
    SWBDataSource ds=engine.getDataSource("ReportesVIN");
    out.println("DBName:"+ds.fetch());
    //out.println("DBName:"+ds.fetch("{data:{\"_id\" : \"_suri:VINDB:ReportesVIN:53b722f130041294cd1ee2c6\"}}"));
    
    ds=engine.getDataSource("Pais");
    out.println("DBName:"+ds.fetch("{data:{nombre:\"Mex\"},textMatchStyle:\"startsWith\"}"));  
    
    out.println(ds.getDataSourceScript().getString("scls"));
    
%>        
        </pre>
    </body>
</html>
