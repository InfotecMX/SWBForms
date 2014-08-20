
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleScriptContext;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author javiersolis
 */
public class Test {
    public static void main(String args[]) throws ScriptException
    {
        ScriptEngineManager factory = new ScriptEngineManager();         
        long time=System.currentTimeMillis();     
        
        ScriptEngine engine=factory.getEngineByName("JavaScript");  
        engine.eval("var x=10;");        
        engine.eval("print('x0:'+x)"); 
        System.out.println("x1:"+engine.get("x"));
        
        ScriptContext myCtx = new SimpleScriptContext(); 
        myCtx.setBindings(engine.getBindings(ScriptContext.GLOBAL_SCOPE), ScriptContext.GLOBAL_SCOPE); 
        myCtx.setBindings(engine.getBindings(ScriptContext.ENGINE_SCOPE), ScriptContext.ENGINE_SCOPE); 
        
        //Bindings b = new SimpleBindings(); 
        //b.put("foo", "world");
        //myCtx.setBindings(b, ScriptContext.GLOBAL_SCOPE);
        
        engine.eval("print(x)",myCtx); 
        engine.eval("var y=20;",myCtx); 
        engine.eval("print(y)",myCtx); 
        engine.eval("print(y)"); 
        
        
    }
}
