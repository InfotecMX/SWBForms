package org.semanticwb.forms;

import static org.junit.Assert.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/**
 *
 * @author serch
 */
@RunWith(JUnit4.class)
public class TestSWBScriptEngine {
    
    @Test
    public void test(){
        SWBForms.createInstance("src/test/resources");
        SWBScriptEngine engine = SWBScriptEngine.getScriptEngine("/datasource/datasources.js");
        assertNotNull(engine);
        SWBDataSource datasource = engine.getDataSource("Pais");
        assertNotNull(datasource);
        datasource = engine.getDataSource("Ciudades");
        assertNull(datasource);
    }
}
