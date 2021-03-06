/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.semanticwb.forms;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import jdk.nashorn.api.scripting.NashornScriptEngineFactory;

/**
 *
 * @author javier.solis.g
 */
public class SWBForms
{    
    private static SWBForms instance=null;
    
    private static ScriptEngineManager factory = null;
    
    private static String applicationPath=null;
    
    private SWBForms(String applicationPath)
    {
        System.out.println("Initializing SWBForms:"+applicationPath);        
        instance=this;
        
        factory = new ScriptEngineManager(); 
        
        SWBForms.applicationPath=applicationPath;
        
        //DataSource.init(applicationPath+"WEB-INF/datasources/");        
    }
    
    public static SWBForms createInstance(String applicationPath)
    {
        if(instance==null)
        {
            synchronized(SWBForms.class)
            {
                if(instance==null)
                {
                    new SWBForms(applicationPath);
                }
            }
        }
        return instance;
    }

    public static String getApplicationPath() {
        return applicationPath;
    }
    
    
    public static ScriptEngine getNativeScriptEngine()
    {
        // create a JavaScript engine         
        //System.out.println(new NashornScriptEngineFactory().getParameter("THREADING"));
        return factory.getEngineByName("JavaScript");           
    }
    
    /**
     * Relaltive to Application path
     * @param source
     * @param engine 
     */
    protected static ScriptEngine loadScript(String source, ScriptEngine engine) throws IOException, ScriptException
    {
        System.out.println("loadScript:"+source);        
        File f=new File(instance.applicationPath+source);
        //System.out.println(f.getPath()+" "+f.exists());
        
        if(f.isFile())
        {
            //Carga Script de inicializacion
            FileInputStream in=new FileInputStream(f);
            InputStreamReader r=new InputStreamReader(in,"UTF8");            
            engine.eval(r);                                
        } 
        return engine;
    }
    
    public static SWBScriptEngine getUserScriptEngine(String source, SWBUser user)
    {
        SWBBaseScriptEngine engine=SWBBaseScriptEngine.getScriptEngine(source);
        if(engine!=null)return new SWBUserScriptEngine(engine,user);
        return null;
    }    
    
}
