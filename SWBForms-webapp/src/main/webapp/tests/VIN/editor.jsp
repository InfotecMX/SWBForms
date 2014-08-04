<%-- 
    Document   : dataSourceEditor.jsp
    Created on : Feb 4, 2014, 4:33:43 PM
    Author     : javier.solis.g
--%>
<%@page import="java.io.File"%>
<%@page import="java.io.FileOutputStream"%>
<%@page import="org.semanticwb.forms.*"%>
<%@page import="java.io.FileInputStream"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String dir=config.getServletContext().getRealPath("/")+"/"+request.getRequestURI().substring(1,request.getRequestURI().lastIndexOf("/"))+"/";
    System.out.println(dir);
    String filename=request.getParameter("fn");
    
    String path=null;
    if(filename!=null)path=dir+filename;
    
    String code=request.getParameter("code");
    
    if(code!=null)
    {
        try
        {
            FileOutputStream os=new FileOutputStream(path);
            os.write(code.getBytes());
            os.flush();
            os.close();
        }catch(Exception e)
        {
            e.printStackTrace();
        }
    }
    
    if(path!=null)
    {
        try
        {
            FileInputStream in=new FileInputStream(path);
            code=SWBFormsUtils.readInputStream(in,"utf-8");
            code=code.replaceAll("<", "&lt;");
        }catch(Exception e){code="";}
    }
    //if(code==null)code="";
    //if(filename==null)filename="";
%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>JSP Page</title>
        <script src="/swbforms/codemirror/lib/codemirror.js"></script>
        <link rel="stylesheet" href="/swbforms/codemirror/lib/codemirror.css">
        <link rel="stylesheet" href="/swbforms/codemirror/theme/eclipse.css"> 
        <script src="/swbforms/codemirror/addon/selection/active-line.js"></script>
<% 
    if(filename!=null && filename.endsWith(".js"))
    {
%>        
        <script src="/swbforms/codemirror/mode/javascript/javascript.js"></script>   
<%
    }else
    {
%>   
        <script src="/swbforms/codemirror/mode/xml/xml.js"></script>   
<%
    }
%>
        <script src="/swbforms/codemirror/addon/edit/matchbrackets.js"></script>
    <style type="text/css">
      .CodeMirror {border: 1px solid black; font-size:13px}
    </style>
    </head>
    <body>
        <h1>Code Editor</h1>
        <form action="" method="post">   
        Archivo: 
            <input type="hidden" id="fn" name="fn">
            <select name="sfn" onchange="
                if(value=='_new')document.getElementById('fn').value=prompt('File Name','[File Name]');
                else document.getElementById('fn').value=value;
                submit();
            ">
                
<%
            if(filename==null)out.println("<option></option>");
            String selected="";
            boolean fselected=false;
            File d=new File(dir);
            File[] files=d.listFiles();
            for(int x=0;x<files.length;x++)
            {
                if(filename!=null && filename.equals(files[x].getName()))
                {
                    selected="selected";
                    fselected=true;
                }
                else selected="";
                out.println("<option value=\""+files[x].getName()+"\" "+selected+">"+files[x].getName()+"</option>");
            }
            if(filename!=null && fselected==false)out.println("<option value=\""+filename+"\" selected>"+filename+"</option>");
%>            
                <option value="_new">[New File]</option>
            </select>
        </form>
        
        <form action="" method="post">           
<%
        if(filename!=null)
        {
%>            
            <input type="hidden" name="fn" value="<%=filename%>">
<%
        }
%>         
<%
        if(code!=null)
        {
%>
            <textarea name="code" id="code"><%=code%></textarea>           
            <script type="text/javascript">
              var myCodeMirror = CodeMirror.fromTextArea(code,{
                  smartIndent:true,
                  lineNumbers: true,
                  styleActiveLine: true,
                  matchBrackets: true,
                  theme:"eclipse"
              });
            </script>      
            <input type="submit">
<%
        }
%>            
        </form>
    </body>
</html>
