/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package org.semanticwb.forms;

import com.mongodb.BasicDBObject;
import java.io.IOException;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;
import test.utils.MongoTestEnv;

/**
 *
 * @author serch
 */
@RunWith(JUnit4.class)
public class TestSWBDataSource {
    
    
    private String query00 = "{ \"dataSource\":\"ds_Pais\", \"operationType\":\"fetch\", \"componentId\":\"isc_ListGrid_3\", \"data\":null, \"oldValues\":null }";
    private String query01 = "{ \"dataSource\":\"ds_Pais\", \"operationType\":\"add\", \"textMatchStyle\":\"exact\", \"componentId\":\"isc_ListGrid_0\", \"data\":{ \"nombre\":\"Estados Unidos de America\", \"abre\":\"USA\" }, \"oldValues\":null }";
    private String query02 = "{ \"dataSource\" : \"ds_Pais\" , \"operationType\" : \"add\" , \"textMatchStyle\" : \"exact\" , \"componentId\" : \"isc_ListGrid_0\" , \"data\" : { \"nombre\" : \"Alemania\" } , \"oldValues\" :  null }";
    
    private String query03 = "{ \"dataSource\" : \"ds_Pais\" , \"operationType\" : \"add\" , \"textMatchStyle\" : \"exact\" , \"componentId\" : \"isc_ListGrid_0\" , \"data\" : { \"nombre\" : \"Alemania\" , \"abre\" : \"GER\" , \"_id\" : \"_suri:VINDB:Pais:53d856373004a8c6db16ac1b\"} , \"oldValues\" :  null }";
    
    @Before
    public void before() throws IOException{
        MongoTestEnv.startup();
        
    }
    
    @Test
    public void test() throws IOException{
        SWBForms.createInstance("src/test/resources");
        SWBScriptEngine engine = SWBScriptEngine.getScriptEngine("/datasource/datasources.js");
        SWBDataSource datasource = engine.getDataSource("Pais");
        BasicDBObject bdbo = datasource.fetch();
        int basicSize= ((BasicDBObject)bdbo.get("response")).getInt("totalRows");
//        assertEquals(0,((BasicDBObject)bdbo.get("response")).getInt("totalRows"));
//        System.out.println("");
//        System.out.println("bdbo1:"+bdbo);
        bdbo = datasource.add(query02);
//        System.out.println("");
//        System.out.println("bdbo_:"+bdbo);
        bdbo = datasource.add(query03);
//        System.out.println("bdbo_:"+bdbo);
        bdbo = datasource.fetch();
        assertEquals(basicSize+2,((BasicDBObject)bdbo.get("response")).getInt("totalRows"));
//        System.out.println("bdbo1:"+bdbo);
        
    }
    
    
}
