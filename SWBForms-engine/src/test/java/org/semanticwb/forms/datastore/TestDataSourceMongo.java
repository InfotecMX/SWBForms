package org.semanticwb.forms.datastore;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import java.io.IOException;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

import static org.mockito.Mockito.*;
import org.semanticwb.forms.SWBDataSource;
import org.semanticwb.forms.script.ScriptObject;
import test.utils.MongoTestEnv;

/**
 *
 * @author serch
 */
@RunWith(JUnit4.class)
public class TestDataSourceMongo {
    
    
    private MongoClient _mongo;
    
    
    @Before
    public void before() throws IOException{
        MongoTestEnv.startup();
        _mongo=new MongoClient("localhost",27018);
    }
    
    @Test
    public void test() throws IOException{
        SWBDataSource mokedDataSource = mock(SWBDataSource.class);
        ScriptObject sso = mock(ScriptObject.class);
        when(mokedDataSource.getDataSourceScript()) .thenReturn(sso);
        when(sso.getString("modelid")).thenReturn("TESTDB");
        when(sso.getString("scls")).thenReturn("Country");
        ScriptObject sods = mock(ScriptObject.class);
        ScriptObject soport = mock(ScriptObject.class);
        when(soport.getValue()).thenReturn(27018);
        when(sods.getString("host")).thenReturn("localhost");
        when(sods.get("port")).thenReturn(soport);
        
        DataStoreMongo dsm = new DataStoreMongo(sods);
        BasicDBObject bdbo = new BasicDBObject();
        BasicDBObject oldSet = (new BasicDBObject("name", "México")).append("iso2", "si");
        BasicDBObject newSet = (new BasicDBObject("name", "México")).append("iso2", "no");
        bdbo.append("data", oldSet);
        dsm.add(bdbo,mokedDataSource);
        assertEquals("México", _mongo.getDB("TESTDB").getCollection("Country").findOne().get("name"));
        BasicDBObject result = (BasicDBObject)((BasicDBList)((BasicDBObject)dsm.fetch(bdbo,mokedDataSource).get("response")).get("data")).get(0);
        assertEquals("México",result.getString("name"));
        String id = result.getString("_id");
        bdbo.append("data", newSet);
        newSet.append("_id", id);
        dsm.update(bdbo,mokedDataSource);
        bdbo.append("data", oldSet);
        assertEquals(0, ((BasicDBList)((BasicDBObject)dsm.fetch(bdbo,mokedDataSource).get("response")).get("data")).size());
        bdbo.append("data", newSet);
        newSet.append("_id", id);
        result = (BasicDBObject)((BasicDBList)((BasicDBObject)dsm.fetch(bdbo,mokedDataSource).get("response")).get("data")).get(0);
        assertNotEquals("si", result.getString("iso2"));
        assertEquals("no", result.getString("iso2"));
//        System.out.println(newSet.get("_id")+" -> "+result.getString("_id"));
        dsm.remove(bdbo,mokedDataSource);
        assertEquals(0, ((BasicDBList)((BasicDBObject)dsm.fetch(bdbo,mokedDataSource).get("response")).get("data")).size());
//        
//        System.out.println("result: "+ result);
//        System.out.println("DBO_id:"+dsm.fetch(bdbo));
//        
//        Iterator<DBObject> iterDB = _mongo.getDB("VINDB").getCollection("Pais").find();
//        while(iterDB.hasNext()){
//            System.out.println("++++++++++ "+iterDB.next());
//        }
//        result = (BasicDBObject)((BasicDBList)((BasicDBObject)dsm.fetch(bdbo).get("response")).get("data")).get(0);
//        assertNotEquals("si", sso);
//        System.out.println("DBO_id:"+dsm.fetch(bdbo));
//        System.out.println("***************: "+
//                ((BasicDBObject)((BasicDBList)((BasicDBObject)dsm.fetch(bdbo).get("response")).get("data")).get(0)).getString("abre"));
//        System.out.println("DBO_id:"+dsm.fetch(bdbo));
//        System.out.println("mongo:"+_mongo.getDB("VINDB").getCollection("Pais").findOne());
    }
    
}
