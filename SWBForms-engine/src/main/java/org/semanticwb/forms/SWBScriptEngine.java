/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.semanticwb.forms;

import java.io.File;
import java.io.Reader;
import java.util.ArrayList;
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
    
    private ScriptEngine sengine=null;
    private String source=null;    
    private File file=null;    
    private transient long updated;
    private transient long lastCheck;
    
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
            
            sengine=engine;
        }catch(Throwable e)
        {
            e.printStackTrace();
        }
    }
    
    public SWBDataSource getDataSource(String name)
    {
        try
        {
            if(sengine!=null && sengine.get("swbf")!=null)
            {
                ScriptObject swbf=new ScriptObject(sengine.get("swbf"));
                ScriptObject dataSources=swbf.get("dataSources");   
                ScriptObject ds=dataSources.get(name);
                if(ds!=null)return new SWBDataSource(name,ds,this);
            }
        }catch(Throwable e)
        {
            e.printStackTrace();
        }
        return null;        
    }
    
    public List<SWBDataService> findDataServices(String dataSource, String action)
    {
        ArrayList<SWBDataService> arr=new ArrayList();
        try
        {
            if(sengine!=null && sengine.get("swbf")!=null)
            {
                ScriptObject swbf=new ScriptObject(sengine.get("swbf"));
                ScriptObject dataServices=swbf.get("dataServices");   
                Iterator<String> it=dataServices.keySet().iterator();
                while(it.hasNext())
                {
                    String key=it.next();
                    ScriptObject ds=dataServices.get(key);
                    if(ds.get("dataSources").containsValue(dataSource) && ds.get("actions").containsValue(action))
                    {
                        arr.add(new SWBDataService(key,ds,this));
                    }
                }
            }
        }catch(Throwable e)
        {
            e.printStackTrace();
        }
        return arr;        
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
