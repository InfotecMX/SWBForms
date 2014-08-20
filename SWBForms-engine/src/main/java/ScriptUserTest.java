
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import javax.script.Bindings;
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import javax.script.SimpleBindings;
import javax.script.SimpleScriptContext;
import jdk.nashorn.api.scripting.ScriptObjectMirror;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author javiersolis
 */
public class ScriptUserTest {
    
    HashMap<String, Bindings> users=new HashMap();
    
    public Bindings getUserBindings(String user, ScriptEngine engine)
    {
        Bindings b = users.get(user);
        if(b==null)
        {
            b = new SimpleBindings();     
            Bindings enginescope=engine.getBindings(ScriptContext.ENGINE_SCOPE);            
            Iterator<Map.Entry<String,Object>> set=enginescope.entrySet().iterator();
            while (set.hasNext()) {
                Map.Entry<String, Object> entry = set.next();
                b.put(entry.getKey(), entry.getValue());
                //System.out.println(user+" prop:"+entry.getKey()+" "+entry.getValue().hashCode());
            }
            b.put("user", user);            
            users.put(user, b);
        }
        return b;        
    }
    
    public void eval(String script, ScriptEngine engine, String user)
    {
        Bindings b = getUserBindings(user, engine);
        try
        {
            engine.eval(script,b);
        }catch(Exception e)
        {
            e.printStackTrace();
        }
    }
    
    public static void main(String args[]) throws ScriptException
    {
        ScriptEngineManager factory = new ScriptEngineManager();         
        long time=System.currentTimeMillis();     
        
        ScriptUserTest t=new ScriptUserTest();
        
        ScriptEngine engine=factory.getEngineByName("JavaScript");  
        engine.eval("var x={val:10};");        
        engine.eval("var z=50;");        
        engine.eval("var user='hola';function getUser(){return this.user}");        
        engine.eval("print('x0:'+x.val)"); 
        
        System.out.println("Time:"+(System.currentTimeMillis()-time));
        time=System.currentTimeMillis();
            
        t.eval("var y=1;", engine, "user1");
        t.eval("var y=2;", engine, "user2");
        t.eval("print(user+' '+y+' '+x.val)", engine, "user1");
        t.eval("print(user+' '+y+' '+x.val)", engine, "user2");
        for(int x=0;x<1000;x++)
        {
            t.eval("y++", engine, "user1");            
        }
        t.eval("print(user+' '+y+' '+x.val)", engine, "user1");
        t.eval("print(user+' '+y+' '+x.val)", engine, "user2");
        
        t.eval("x.val=20", engine, "user1");
        
        t.eval("print(user+' '+y+' '+x.val+' ->'+z.hashCode())", engine, "user1");
        t.eval("print(user+' '+y+' '+x.val+' ->'+z.hashCode())", engine, "user2");
        System.out.println("Time:"+(System.currentTimeMillis()-time));
        time=System.currentTimeMillis();
        
        Bindings b1=t.getUserBindings("user1", engine);
        System.out.println(b1.get("z").getClass());
        
        Bindings b2=t.getUserBindings("user2", engine);
        System.out.println(b2.get("z").getClass());
        
        ScriptObjectMirror som=(ScriptObjectMirror)b1.get("getUser");
        System.out.println(som.call(b1, null));
        
        //t.eval("print('user:'+getUser())", engine, "user1");
    }
}
