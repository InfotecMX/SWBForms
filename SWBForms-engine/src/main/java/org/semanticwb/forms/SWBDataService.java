/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.semanticwb.forms;

import org.semanticwb.forms.script.ScriptObject;

/**
 *
 * @author javier.solis
 */
public class SWBDataService 
{
    
    private String name=null;
    private SWBScriptEngine engine=null;
    private ScriptObject script=null;
    
    protected SWBDataService(String name, ScriptObject script, SWBScriptEngine engine)
    {
        this.name=name;
        this.engine=engine;
        this.script=script;
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
   
}
