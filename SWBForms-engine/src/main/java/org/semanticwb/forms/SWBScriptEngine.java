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

/**
 *
 * @author javiersolis
 */
public interface SWBScriptEngine {

    public void chechUpdates();

    public Object eval(String script) throws ScriptException;

    public Object eval(Reader script) throws ScriptException;

    /**
     * Busca los objetos SWBDataProcessor relacionados a un especifico DataSource y una accion
     * @param dataSource
     * @param action
     * @return Lista de SWBDataProcessor o null si no hay SWBDataService relacionados
     */
    public List<SWBDataProcessor> findDataProcessors(String dataSource, String action);

    /**
     * Busca los objetos SWBDataService relacionados a un especifico DataSource y una accion
     * @param dataSource
     * @param action
     * @return Lista de SWBDataService o null si no hay SWBDataService relacionados
     */
    public List<SWBDataService> findDataServices(String dataSource, String action);

    public SWBDataSource getDataSource(String name);

    public SWBDataStore getDataStore(String name);

    public ScriptEngine getNativeScriptEngine();

    public SWBUserRepository getUserRepository();

    public BasicDBObject invokeDataProcessors(String dataSource, String action, String method, BasicDBObject obj);

    public void invokeDataServices(String dataSource, String action, BasicDBObject request, BasicDBObject response);

    public void reloadScriptEngine();
    
    public SWBUser getUser();
    
    public Bindings getUserBindings();
}
