/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.semanticwb.forms;

import com.mongodb.BasicDBObject;
import java.io.File;
import java.io.Reader;
import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.script.Bindings;
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import javax.script.SimpleBindings;
import org.semanticwb.forms.script.ScriptObject;
import org.semanticwb.forms.datastore.SWBDataStore;

/**
 *
 * @author javiersolis
 */
public class SWBBaseScriptEngine implements SWBScriptEngine 
{
    private static final ConcurrentHashMap<String,SWBBaseScriptEngine> engines=new ConcurrentHashMap();
    
//    private final HashMap<SWBUser, Bindings> users=new HashMap();    
    private HashMap<String,ScriptObject> dataSources=null;
    private HashMap<String,SWBDataStore> dataStores=null;
    private HashMap<String,List<SWBDataService>> dataServices=null;
    private HashMap<String,List<SWBDataProcessor>> dataProcessors=null;
    private SWBUserRepository userRep=null;
    
    private ScriptEngine sengine=null;
    private String source=null;    
    private File file=null;    
    private transient long updated;
    private transient long lastCheck;
    
    private static final List _emptyList_=new ArrayList();
    
    private SWBBaseScriptEngine(String source)
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
            
            ScriptEngine engine=SWBForms.getNativeScriptEngine();     
            //engine.put("_swbf_sengine", this);
            
            engine=SWBForms.loadScript("/swbforms/js/swbf_server.js", engine);
            engine=SWBForms.loadScript(source, engine);            
            
            ScriptObject swbf=new ScriptObject(engine.get("swbf"));
              
            //Load DataStores
            {
                HashMap<String,SWBDataStore> dataStores=new HashMap();
                this.sengine=engine;
                this.dataStores=dataStores;            
                ScriptObject dss=swbf.get("dataStores");   
                Iterator<String> it=dss.keySet().iterator();
                while (it.hasNext()) {
                    String dsname = it.next();
                    ScriptObject dataStore=dss.get(dsname);
                    String dataStoreClass=dataStore.getString("class");
                    try
                    {
                        Class cls=Class.forName(dataStoreClass);
                        Constructor c=cls.getConstructor(ScriptObject.class);
                        System.out.println("Loading DataStore:"+dsname);
                        dataStores.put(dsname,(SWBDataStore)c.newInstance(dataStore));
                    }catch(Exception e){e.printStackTrace();}        
                }
            }            
            
            //Load DataSources
            {
                HashMap<String,ScriptObject> dataSources=new HashMap();
                this.sengine=engine;
                this.dataSources=dataSources;            
                ScriptObject dss=swbf.get("dataSources");   
                Iterator<String> it=dss.keySet().iterator();
                while (it.hasNext()) {
                    String dsname = it.next();
                    System.out.println("Loading DataSource:"+dsname);                    
                    ScriptObject so=dss.get(dsname);
                    dataSources.put(dsname, so);
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
                    System.out.println("Loading DataService:"+key);
                    SWBDataService dataService=new SWBDataService(key,data);
                    
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
                            //System.out.println(k+":"+dataService);
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
                    System.out.println("Loading DataProcessor:"+key);
                    SWBDataProcessor dataProcessor=new SWBDataProcessor(key,data);
                    
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
                            //System.out.println(k+":"+dataProcessor);
                        }
                    }
                }
            }    
            
            //Load UserRepository
            {
                ScriptObject ur=swbf.get("userRepository");   
                System.out.println("Loading UserRepository");
                userRep=new SWBUserRepository(ur, this);
            }                          
        }catch(Throwable e)
        {
            e.printStackTrace();
        }
    }
    
    public ScriptObject getDataSourceScript(String name)
    {
        return dataSources.get(name);
    }
    
    @Override
    public SWBDataSource getDataSource(String name)
    {
        ScriptObject so=getDataSourceScript(name);
        if(so!=null)
        {
            return new SWBDataSource(name,so,this);
        }
        return null;
    }
    
    @Override
    public SWBDataStore getDataStore(String name)
    {
        return dataStores.get(name);
    }    

    /**
     * Busca los objetos SWBDataService relacionados a un especifico DataSource y una accion 
     * @param dataSource
     * @param action
     * @return Lista de SWBDataService o null si no hay SWBDataService relacionados
     */
    @Override
    public List<SWBDataService> findDataServices(String dataSource, String action)
    {
        return dataServices.get(dataSource+"-"+action);
    }
    
    @Override
    public void invokeDataServices(String dataSource, String action, BasicDBObject request, BasicDBObject response)
    {
        invokeDataServices(null, dataSource, action, request, response);
    }
       
    protected void invokeDataServices(SWBUserScriptEngine userengine, String dataSource, String action, BasicDBObject request, BasicDBObject response)
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
                        func.invoke(userengine,request,response.get("response"),dataSource,action);
                    }catch(Throwable e)
                    {
                        e.printStackTrace();
                    }
                }
            }            
        }       
    }
    
    @Override
    public SWBUserRepository getUserRepository()
    {
        return userRep;
    }
    
    /**
     * Busca los objetos SWBDataProcessor relacionados a un especifico DataSource y una accion 
     * @param dataSource
     * @param action
     * @return Lista de SWBDataProcessor o null si no hay SWBDataService relacionados
     */
    
    @Override
    public List<SWBDataProcessor> findDataProcessors(String dataSource, String action)
    {
        return dataProcessors.get(dataSource+"-"+action);
    }   

    @Override
    public BasicDBObject invokeDataProcessors(String dataSource, String action, String method, BasicDBObject obj)
    {
        return invokeDataProcessors(null, dataSource, action, method, obj);
    }
    
    
    protected BasicDBObject invokeDataProcessors(SWBUserScriptEngine userengine, String dataSource, String action, String method, BasicDBObject obj)
    {
        List<SWBDataProcessor> list=findDataProcessors(dataSource, action);
        if(list!=null)
        {
            Iterator<SWBDataProcessor> dsit=list.iterator();
            while(dsit.hasNext())
            {
                SWBDataProcessor dsrv=dsit.next();
                ScriptObject func=dsrv.getDataProcessorScript().get(method);
                //System.out.println("func:"+func);
                if(func!=null && func.isFunction())
                {
                    try
                    {
                        ScriptObject r=func.invoke(userengine,obj,dataSource,action);
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
    
    
    @Override
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
    
    @Override
    public ScriptEngine getNativeScriptEngine()
    {
        return sengine;
    }
    
    @Override
    public Object eval(String script) throws ScriptException
    {
        return sengine.eval(script);
    }
    
    protected Object eval(String script, Bindings bind) throws ScriptException
    {
        return sengine.eval(script, bind);
    }
    
    @Override
    public Object eval(Reader script) throws ScriptException
    {
        return sengine.eval(script);
    }    
    
    protected Object eval(Reader script, Bindings bind) throws ScriptException
    {
        return sengine.eval(script,bind);
    }        
    
    @Override
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
    
   
    public Bindings getUserBindings(SWBUserScriptEngine engine)
    {
        Bindings b=null;
//        if(user==null)return null;
//        Bindings b = users.get(user);
        System.out.println("getUserBindings:"+engine);
//        if(b==null)
//        {
//            synchronized(users)
//            {           
//                b = users.get(user);
//                if(b==null)
//                {
                    b = new SimpleBindings();     
                    Bindings enginescope=sengine.getBindings(ScriptContext.ENGINE_SCOPE);            
                    Iterator<Map.Entry<String,Object>> set=enginescope.entrySet().iterator();
                    while (set.hasNext()) {
                        Map.Entry<String, Object> entry = set.next();
                        b.put(entry.getKey(), entry.getValue());
//                        System.out.println(engine.getUser()+" prop:"+entry.getKey()+" "+entry.getValue().hashCode());
                    }
                    //b.put("_swbf_user", user);  
                    b.put("sengine", engine);
//                    users.put(user, b);
//                }
//            }
//        }
        return b;        
    }

    public SWBUser getUser() {
        return null;
    }

    public Bindings getUserBindings() {
        return null;
    }    
    
//******************************** static *****************************************************//    
    
    protected static SWBBaseScriptEngine getScriptEngine(String source)
    {
        SWBBaseScriptEngine engine=engines.get(source);        
        if(engine==null)
        {
            synchronized(engines)
            {
                engine=engines.get(source);
                if(engine==null)
                {
                    try
                    {
                        engine=new SWBBaseScriptEngine(source);
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
