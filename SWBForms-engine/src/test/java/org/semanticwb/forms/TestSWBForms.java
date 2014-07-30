package org.semanticwb.forms;

import java.nio.file.Path;
import java.nio.file.Paths;
import javax.script.ScriptEngine;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import static org.junit.Assert.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/**
 *
 * @author serch
 */
@RunWith(JUnit4.class)
public class TestSWBForms {
    
    @Test
    public void test() throws Exception{
        SWBForms instance = SWBForms.createInstance("src/test/resources");
        assertNotNull(instance);
        ScriptEngine engine = SWBForms.getScriptEngine();
        engine=SWBForms.loadScript("/swbforms/js/swbf_server.js", engine);
        engine=SWBForms.loadScript("/datasource/datasources.js", engine);
        assertNotNull(engine);
        assertTrue(engine.get("swbf") instanceof ScriptObjectMirror);
        Path path = Paths.get("src/test/resources");
        Path path2 = Paths.get(SWBForms.getApplicationPath());
        assertEquals(path, path2);
    }
}
