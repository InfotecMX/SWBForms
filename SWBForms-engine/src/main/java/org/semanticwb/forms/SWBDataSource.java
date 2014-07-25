/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.semanticwb.forms;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import org.semanticwb.forms.datasource.DataSourceMongo;
import org.semanticwb.forms.script.ScriptObject;

/**
 *
 * @author javier.solis
 */
public class SWBDataSource 
{
    
    private String name=null;
    private SWBScriptEngine engine=null;
    private ScriptObject script=null;
    private DataSourceMongo db=null;
    
    protected SWBDataSource(String name, ScriptObject script, SWBScriptEngine engine)
    {
        this.name=name;
        this.engine=engine;
        this.script=script;
        
        db=new DataSourceMongo(this);
    }

    /**
     * Regresa Nombre del DataSource
     * @return String
     */
    public String getName() {
        return name;
    }

    /**
     * Regresa el SWBScriptEngine que contiene a este DataSource
     * @return SWBScriptEngine
     */
    public SWBScriptEngine getScriptEngine() {
        return engine;
    }
    
    /**
     * Regresa ScriptObject con el script con la definición del datasource definida el el archivo js
     * @return ScriptObject
     */
    public ScriptObject getDataSourceScript()
    {
        return script;
    }      
    
    public BasicDBObject fetch() throws IOException
    {
        return fetch("{}");
    }    
    
    public BasicDBObject fetch(String query) throws IOException
    {
        return fetch((BasicDBObject)JSON.parse(query));
    }
    
    public BasicDBObject fetch(BasicDBObject json) throws IOException
    {
        return db.fetch(json);
    }
    
    public BasicDBObject update(String query) throws IOException
    {
        return update((BasicDBObject)JSON.parse(query));
    }
    
    public BasicDBObject update(BasicDBObject json) throws IOException
    {
        return db.update(json);
    }    
    
    public BasicDBObject add(String query) throws IOException
    {
        return add((BasicDBObject)JSON.parse(query));
    }
    
    public BasicDBObject add(BasicDBObject json) throws IOException
    {
        return db.add(json);
    }    
    
    public BasicDBObject remove(String query) throws IOException
    {
        return remove((BasicDBObject)JSON.parse(query));
    }
    
    public BasicDBObject remove(BasicDBObject json) throws IOException
    {
        return db.remove(json);
    }    
    
    public BasicDBObject validate(String query) throws IOException
    {
        return validate((BasicDBObject)JSON.parse(query));
    }
    
    public BasicDBObject validate(BasicDBObject json) throws IOException
    {
//        ScriptObject dss=getDataSourceScript();        
//        String modelid=dss.getString("modelid");
//        String scls=dss.getString("scls");
        BasicDBObject ret=new BasicDBObject();
        BasicDBObject resp=new BasicDBObject();
        BasicDBObject errors=new BasicDBObject();
        ret.append("response", resp);

        boolean hasErrors=false;
        

        BasicDBObject data=(BasicDBObject)json.get("data");
        if(data!=null)
        {
            Iterator<Map.Entry<String,Object>> it=data.entrySet().iterator();
            while(it.hasNext())
            {
                Map.Entry<String,Object> entry=it.next(); 

                String key=entry.getKey();
                Object value=entry.getValue();
                ScriptObject field=getDataSourceScriptField(key);
                if(field!=null)
                {
                    ScriptObject validators=field.get("validators");
                    if(validators!=null)
                    {
                        Iterator<ScriptObject> it2=validators.values().iterator();
                        while (it2.hasNext()) 
                        {
                            ScriptObject validator = it2.next();
                            String type=validator.getString("type");

                            if("serverCustom".equals(type))
                            {
                                ScriptObject func=validator.get("serverCondition");
                                if(func!=null)
                                {
                                    //System.out.println(key+"-->"+value+"-->"+func);
                                    ScriptObject r=func.invoke(key,value,json);
                                    //System.out.println("r:"+r.getValue());
                                    if(r!=null && r.getValue().equals(false))
                                    {
                                        //System.out.println("Error...");
                                        hasErrors=true;
                                        String errmsg=validator.getString("errorMessage");
                                        if(errmsg==null)errmsg="Error..";
                                        errors.put(key, errmsg);
                                    }
                                }
                            }else if("isUnique".equals(type))
                            {
                                String id=data.getString("_id");
                                BasicDBObject req=new BasicDBObject();
                                BasicDBObject query=new BasicDBObject();
                                req.put("data", query);
                                query.put(key, value);
                                BasicDBList rdata=(BasicDBList)((BasicDBObject)fetch(req).get("response")).get("data");                                  
                                if(rdata!=null && rdata.size()>0)
                                {
                                    if(rdata.size()>1 || id==null || !((BasicDBObject)rdata.get(0)).getString("_id").equals(id))
                                    {
                                        hasErrors=true;
                                        String errmsg=validator.getString("errorMessage");
                                        //TODO:Internacionalizar...
                                        if(errmsg==null)errmsg="El valor debe de ser único..";
                                        errors.put(key, errmsg);
                                    }
                                }                                
                                //System.out.println("isUnique:"+key+"->"+value+" "+id+" "+r);
                            }
                        }
                    }
                }
            }        
        }
        
        if(hasErrors)
        {
            resp.append("status", -4);
            resp.append("errors", errors);
        }else
        {
            resp.append("status", 0);
        }
        return ret;                
    } 
    
    public ScriptObject getDataSourceScriptField(String name)
    {
        ScriptObject fields=script.get("fields");
        if(fields!=null)
        {
            Iterator<ScriptObject> it=fields.values().iterator();
            while (it.hasNext()) {
                ScriptObject field = it.next();
                String fname=field.getString("name");
                if(fname!=null && fname.equals(name))return field;
            }
        }
        
        fields=script.get("links");
        if(fields!=null)
        {
            Iterator<ScriptObject> it=fields.values().iterator();
            while (it.hasNext()) {
                ScriptObject field = it.next();
                String fname=field.getString("name");
                if(fname!=null && fname.equals(name))return field;
            }
        }
        return null;
    }
            
//******************************************* static *******************************/            
    
    public static BasicDBObject getError(int x)
    {
        BasicDBObject ret=new BasicDBObject();
        BasicDBObject resp=new BasicDBObject();
        ret.append("response", resp);
        resp.append("status", x);
        //resp.append("data", obj);
        return ret;
    }
    
    private static ScriptObject getServerValidator(ScriptObject field, String type)
    {
        ScriptObject validators=field.get("validators");
        if(validators!=null)
        {
            Iterator<ScriptObject> it2=validators.values().iterator();
            while (it2.hasNext()) {
                ScriptObject validator = it2.next();
                String stype=validator.getString("type");
                if(stype!=null && stype.equals(type))
                {
                    return validator;
                }
            }
        }
        return null;        
    }    
    
}
