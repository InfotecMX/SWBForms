/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package org.semanticwb.forms;

import com.mongodb.BasicDBObject;
import java.io.Reader;
import java.util.List;
import javax.script.Bindings;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import org.semanticwb.forms.datastore.SWBDataStore;
import org.semanticwb.forms.script.ScriptObject;

/**
 *
 * @author javiersolis
 */
public class SWBUserScriptEngine implements SWBScriptEngine
{
    SWBBaseScriptEngine engine=null;
    SWBUser user=null;
    
    public SWBUserScriptEngine(SWBBaseScriptEngine engine, SWBUser user)
    {
        this.engine=engine;
        this.user=user;
    }

    public void chechUpdates() {
        engine.chechUpdates();
    }

    public Object eval(String script) throws ScriptException {
        return engine.eval(script,engine.getUserBindings(this));
    }

    public Object eval(Reader script) throws ScriptException {
        return engine.eval(script,engine.getUserBindings(this));        
    }

    public List<SWBDataProcessor> findDataProcessors(String dataSource, String action) {
        return engine.findDataProcessors(dataSource, action);
    }

    public List<SWBDataService> findDataServices(String dataSource, String action) {
        return engine.findDataServices(dataSource, action);
    }

    public SWBDataSource getDataSource(String name)
    {
        ScriptObject so=engine.getDataSourceScript(name);
        if(so!=null)
        {
            return new SWBDataSource(name,so,this);
        }
        return null;
    }

    public SWBDataStore getDataStore(String name) {
        return engine.getDataStore(name);
    }

    public ScriptEngine getNativeScriptEngine() {
        return engine.getNativeScriptEngine();
    }

    public SWBUserRepository getUserRepository() {
        return engine.getUserRepository();
    }

    public BasicDBObject invokeDataProcessors(String dataSource, String action, String method, BasicDBObject obj) {
        return engine.invokeDataProcessors(this,dataSource, action, method, obj);
    }

    public void invokeDataServices(String dataSource, String action, BasicDBObject request, BasicDBObject response) {
        engine.invokeDataServices(this, dataSource, action, request, response);
    }

    public void reloadScriptEngine() {
        engine.reloadScriptEngine();
    }

    public SWBUser getUser() {
        return user;
    }

    public Bindings getUserBindings() {
        return engine.getUserBindings(this);
    }
}
