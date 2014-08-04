<%@page import="org.semanticwb.forms.script.*"%><%@page import="java.io.*"%><%@page import="com.mongodb.util.JSON"%><%@page import="org.bson.types.ObjectId"%><%@page import="com.mongodb.*"%><%@page import="java.util.*"%><%@page import="org.semanticwb.forms.*"%><%@page import="org.semanticwb.*"%><%@page contentType="text/xml" pageEncoding="UTF-8"%><%!
//global
    BasicDBObject getOperation(BasicDBObject json, SWBScriptEngine engine, String dataSource) throws IOException
    {
        BasicDBObject ret=null;
        String operationType = json.getString("operationType");
        
        SWBDataSource ds=engine.getDataSource(dataSource);
        //System.out.println("ds:"+dataSource+" "+ds);        

        if(ds!=null)
        {
            if (SWBDataSource.ACTION_FETCH.equals(operationType))
            {
                ret=ds.fetch(json);
            } else if (SWBDataSource.ACTION_UPDATE.equals(operationType))
            {
                ret=ds.update(json);
            } else if (SWBDataSource.ACTION_ADD.equals(operationType))
            {
                ret=ds.add(json);
            } else if (SWBDataSource.ACTION_REMOVE.equals(operationType))
            {
                ret=ds.remove(json);
            } else if (SWBDataSource.ACTION_VALIDATE.equals(operationType))
            {
                ret=ds.validate(json);
            }
            
/*            
            List<SWBDataService> dataServices=engine.findDataServices(dataSource, operationType);
            if(dataServices!=null)
            {
                Iterator<SWBDataService> dsit=dataServices.iterator();
                while(dsit.hasNext())
                {
                    SWBDataService dsrv=dsit.next();
                    ScriptObject func=dsrv.getDataServiceScript().get("service");
                    if(func!=null && func.isFunction())
                    {
                        func.invoke(json,ret.get("response"),"TODO:User");
                    }
                }            
            }
*/        
        }else
        {
            ret=SWBDataSource.getError(-1);
        }    
        return ret;
    }
    
%><%
    //init SWBPlatform
    if (SWBForms.getApplicationPath() == null)
    {
        String apppath = config.getServletContext().getRealPath("/");
        SWBForms.createInstance(apppath);
    }            
    
    BasicDBObject json=null;
    try
    {
        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Pragma", "no-cache");
        
        String in=SWBFormsUtils.readInputStream(request.getInputStream(),"utf-8");
        json=(BasicDBObject)JSON.parse(in);
        
        String dssp = request.getParameter("dssp");    
        String ds = request.getParameter("ds");    
        SWBScriptEngine engine=SWBScriptEngine.getScriptEngine(dssp);
        //System.out.println("engine:"+engine);        
        
        
        //JSONObject json = new JSONObject(in);
        //System.out.println("in:"+json);
        
        BasicDBObject transaction = (BasicDBObject)json.get("transaction");
        if(transaction!=null)
        {
            BasicDBList ret=new BasicDBList();
            BasicDBList operations = (BasicDBList)transaction.get("operations");
            Iterator it=operations.iterator();
            while (it.hasNext()) 
            {
                    BasicDBObject json2 = (BasicDBObject)it.next();                         
                    BasicDBObject r=getOperation(json2,engine,ds);
                    BasicDBObject resp = (BasicDBObject)r.get("response");   
                    //System.out.println("resp:"+resp+" "+json2);
                    if(resp!=null)resp.append("queueStatus", resp.getInt("status"));
                    ret.add(r);
            }
            out.println(ret);
            //System.out.println("out:"+ret);
        }else
        {
            out.println(getOperation(json,engine,ds));
        }
    } catch (Throwable e)
    {
        e.printStackTrace();
        System.out.println("Error"+json);
    }
%>