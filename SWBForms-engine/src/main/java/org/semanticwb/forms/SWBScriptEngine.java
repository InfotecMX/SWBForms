/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.semanticwb.forms;

import com.mongodb.BasicDBObject;
import java.io.File;
import java.io.Reader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import org.semanticwb.forms.script.ScriptObject;

/**
 *
 * @author javiersolis
 */
public class SWBScriptEngine 
{
    private static ConcurrentHashMap<String,SWBScriptEngine> engines=new ConcurrentHashMap();
    
    private HashMap<String,SWBDataSource> dataSources=null;
    private HashMap<String,List<SWBDataService>> dataServices=null;
    private HashMap<String,List<SWBDataProcessor>> dataProcessors=null;
    private ScriptEngine sengine=null;
    private String source=null;    
    private File file=null;    
    private transient long updated;
    private transient long lastCheck;
    
    private static final List _emptyList_=new ArrayList();
    
    private SWBScriptEngine(String source)
    {
        this.source=source;
    }
    
    private void init()
    {
        try
        {
            file=new File(SWBForms.getApplicationPath()+source);
            updated=file.lastModified();
            lastCheck=System.currentTimeMillis();        
            
            ScriptEngine engine=SWBForms.getScriptEngine();     
            engine.put("sengine", this);
            
            engine=SWBForms.loadScript("/swbforms/js/swbf_server.js", engine);
            engine=SWBForms.loadScript(source, engine);
            
            
            ScriptObject swbf=new ScriptObject(engine.get("swbf"));
                
            //Load DataSources
            {
                HashMap<String,SWBDataSource> dataSources=new HashMap();
                this.sengine=engine;
                this.dataSources=dataSources;            
                ScriptObject dss=swbf.get("dataSources");   
                Iterator<String> it=dss.keySet().iterator();
                while (it.hasNext()) {
                    String dsname = it.next();
                    dataSources.put(dsname, new SWBDataSource(dsname,this));
                }
            }
            
            //Load DataServices
            {
                HashMap<String,List<SWBDataService>> dataServices=new HashMap();
                this.dataServices=dataServices;            
                ScriptObject dss=swbf.get("dataServices");   
                Iterator<String> it=dss.keySet().iterator();
                while(it.hasNext())
                {
                    String key=it.next();
                    ScriptObject data=dss.get(key);
                    System.out.println(key+":"+data);
                    SWBDataService dataService=new SWBDataService(key,data,this);
                    
                    Iterator<ScriptObject> dsit=data.get("dataSources").values().iterator();
                    while (dsit.hasNext()) 
                    {
                        ScriptObject dsname = dsit.next();
                        Iterator<ScriptObject> acit=data.get("actions").values().iterator();
                        while (acit.hasNext()) {
                            ScriptObject action = acit.next();
                            String k=dsname.getValue()+"-"+action.getValue();
                            List<SWBDataService> arr=dataServices.get(k);
                            if(arr==null)
                            {
                                arr=new ArrayList();
                                dataServices.put(k, arr);
                            }
                            arr.add(dataService);
                            System.out.println(k+":"+dataService);
                        }
                    }
                }
            }
            
            //Load DataProcessors
            {
                HashMap<String,List<SWBDataProcessor>> dataProcessors=new HashMap();
                this.dataProcessors=dataProcessors;            
                ScriptObject dss=swbf.get("dataProcessors");   
                Iterator<String> it=dss.keySet().iterator();
                while(it.hasNext())
                {
                    String key=it.next();
                    ScriptObject data=dss.get(key);
                    System.out.println(key+":"+data);
                    SWBDataProcessor dataProcessor=new SWBDataProcessor(key,data,this);
                    
                    Iterator<ScriptObject> dsit=data.get("dataSources").values().iterator();
                    while (dsit.hasNext()) 
                    {
                        ScriptObject dsname = dsit.next();
                        Iterator<ScriptObject> acit=data.get("actions").values().iterator();
                        while (acit.hasNext()) {
                            ScriptObject action = acit.next();
                            String k=dsname.getValue()+"-"+action.getValue();
                            List<SWBDataProcessor> arr=dataProcessors.get(k);
                            if(arr==null)
                            {
                                arr=new ArrayList();
                                dataProcessors.put(k, arr);
                            }
                            arr.add(dataProcessor);
                            System.out.println(k+":"+dataProcessor);
                        }
                    }                }
            }            
        }catch(Throwable e)
        {
            e.printStackTrace();
        }
    }
    
    public SWBDataSource getDataSource(String name)
    {
        return dataSources.get(name);
    }

    /**
     * Busca los objetos SWBDataService relacionados a un especifico DataSource y una accion 
     * @param dataSource
     * @param action
     * @return Lista de SWBDataService o null si no hay SWBDataService relacionados
     */
    public List<SWBDataService> findDataServices(String dataSource, String action)
    {
        return dataServices.get(dataSource+"-"+action);
    }
    
    public void invokeDataServices(String dataSource, String action, BasicDBObject request, BasicDBObject response)
    {
        List<SWBDataService> list=findDataServices(dataSource, action);
        if(list!=null)
        {
            Iterator<SWBDataService> dsit=list.iterator();
            while(dsit.hasNext())
            {
                SWBDataService dsrv=dsit.next();
                ScriptObject func=dsrv.getDataServiceScript().get(SWBDataService.METHOD_SERVICE);
                if(func!=null && func.isFunction())
                {
                    try
                    {
                        func.invoke(request,response.get("response"),"TODO:User",dataSource,action);
                    }catch(Throwable e)
                    {
                        e.printStackTrace();
                    }
                }
            }            
        }       
    }
    
    /**
     * Busca los objetos SWBDataProcessor relacionados a un especifico DataSource y una accion 
     * @param dataSource
     * @param action
     * @return Lista de SWBDataProcessor o null si no hay SWBDataService relacionados
     */
    
    public List<SWBDataProcessor> findDataProcessors(String dataSource, String action)
    {
        return dataProcessors.get(dataSource+"-"+action);
    }   
    
    public BasicDBObject invokeDataProcessors(String dataSource, String action, String method, BasicDBObject obj)
    {
        List<SWBDataProcessor> list=findDataProcessors(dataSource, action);
        if(list!=null)
        {
            Iterator<SWBDataProcessor> dsit=list.iterator();
            while(dsit.hasNext())
            {
                SWBDataProcessor dsrv=dsit.next();
                ScriptObject func=dsrv.getDataProcessorScript().get(method);
                System.out.println("func:"+func);
                if(func!=null && func.isFunction())
                {
                    try
                    {
                        ScriptObject r=func.invoke(obj,"TODO:User",dataSource,action);
                        if(r!=null && r.getValue() instanceof BasicDBObject)
                        {
                            obj=(BasicDBObject)r.getValue();
                        }
                    }catch(Throwable e)
                    {
                        e.printStackTrace();
                    }
                }
            }            
        }   
        return obj;
    }
    
    
    public void reloadScriptEngine()
    {
        try
        {
            init();
        }catch(Exception e)
        {
            e.printStackTrace();
        }
    }
    
    public ScriptEngine getNativeScriptEngine()
    {
        return sengine;
    }
    
    public Object eval(String script) throws ScriptException
    {
        return sengine.eval(script);
    }
    
    public Object eval(Reader script) throws ScriptException
    {
        return sengine.eval(script);
    }    
    
    public void chechUpdates()
    {
        long time=System.currentTimeMillis();
        if((time-lastCheck)>10000)
        {
            lastCheck=time;
            //System.out.println("time:"+(time-lastCheck)+" updated:"+updated+" source.lastModified():"+source.lastModified());
            if(updated!=file.lastModified())
            {
                synchronized(this)
                {
                    if(updated!=file.lastModified())
                    {
                        System.out.println("Update ScriptEngine");
                        reloadScriptEngine();
                    }
                }
            }
        }
    }
    
    
//******************************** static *****************************************************//    
    
    public static SWBScriptEngine getScriptEngine(String source)
    {
        SWBScriptEngine engine=engines.get(source);        
        if(engine==null)
        {
            synchronized(engines)
            {
                engine=engines.get(source);
                if(engine==null)
                {
                    try
                    {
                        engine=new SWBScriptEngine(source);
                        engine.init();
                        engines.put(source, engine);
                    }catch(Throwable e)
                    {
                        e.printStackTrace();
                    }
                }
            }
        }else
        {
            engine.chechUpdates();
        }
        return engine;
    }
    
    
}
