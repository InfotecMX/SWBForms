/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.semanticwb.forms;

import com.mongodb.BasicDBObject;
import com.mongodb.util.JSON;
import java.io.IOException;
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
    
    public static BasicDBObject getError(int x)
    {
        BasicDBObject ret=new BasicDBObject();
        BasicDBObject resp=new BasicDBObject();
        ret.append("response", resp);
        resp.append("status", x);
        //resp.append("data", obj);
        return ret;
    }
}
