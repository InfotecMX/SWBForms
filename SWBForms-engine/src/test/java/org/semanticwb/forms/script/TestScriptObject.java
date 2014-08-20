package org.semanticwb.forms.script;

import javax.script.ScriptException;
import static org.junit.Assert.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import org.semanticwb.forms.SWBForms;
import org.semanticwb.forms.SWBScriptEngine;
import org.semanticwb.forms.SWBUser;

/**
 *
 * @author serch
 */
@RunWith(JUnit4.class)
public class TestScriptObject {
    
    @Test
    public void test() throws ScriptException{
        
        SWBForms.createInstance("src/test/resources");
        SWBUser user=new SWBUser();
        user.put("_id", "jei");
        
        SWBScriptEngine engine = SWBForms.getUserScriptEngine("/datasource/datasources.js",user);
        ScriptObject so = new ScriptObject(engine.getNativeScriptEngine().get("swbf"));
        
        assertNotNull(so);
        assertTrue(so.isScriptObject());
        assertFalse(so.isNativeObject());
        ScriptObject datasource = so.get("dataSources");
        assertNotNull(datasource);
        assertTrue(datasource.isScriptObject());
        assertEquals(6, datasource.size());
//        for(String key:datasource.keySet()){
//            ScriptObject so2 = datasource.get(key);
//            if (so2.isScriptObject()) {
//                assertFalse(so2.isNativeObject());
//            } else {
//                assertFalse(so2.isScriptObject());
//            }
//            System.out.println("key:"+ key);
//            System.out.println("String:"+so2.toString());
//            System.out.println("isScriptObject:"+so2.isScriptObject());
//            if (so2.isScriptObject()) {
//                System.out.println("isArray:"+so2.isArray());
//                System.out.println("isEmpty:"+so2.isEmpty());
//                System.out.println("isFunction:"+so2.isFunction());
//                System.out.println("size:"+so2.size());
//            }
//            
//            
//            System.out.println("isNativeObject:"+so2.isNativeObject());
//            
//            System.out.println("getValue:"+so2.getValue());
//            
//            System.out.println("");
////            System.out.println(""+so2.);
////            System.out.println(""+so2.);
//            
//        }
//        System.out.println("so.isScriptObject():"+so.isScriptObject());
    }
}
