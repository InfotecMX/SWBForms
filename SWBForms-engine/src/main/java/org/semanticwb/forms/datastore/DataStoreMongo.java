/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.semanticwb.forms.datastore;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import java.io.IOException;
import java.util.Iterator;
import org.bson.types.ObjectId;
import org.semanticwb.forms.SWBDataSource;
import org.semanticwb.forms.script.ScriptObject;

/**
 *
 * @author javiersolis
 */
public class DataStoreMongo implements DataStore
{
    private static MongoClient mongoClient=null;
        
    SWBDataSource base=null;
    ScriptObject dataStore=null;
        
    public DataStoreMongo(ScriptObject dataStore, SWBDataSource base) 
    {
        System.out.println("DataStoreMongo:"+dataStore);
        this.dataStore=dataStore;
        this.base=base;         
        try
        {
            initDB();
        }catch(IOException e)
        {
            e.printStackTrace();
        }
    }
    
    private void initDB() throws IOException
    {
        if(mongoClient==null)
        {
            synchronized(DataStoreMongo.class)
            {
                if(mongoClient==null)
                {
                    //TODO:configurar direccion de servidor
                    mongoClient = new MongoClient(dataStore.getString("host"),(Integer)dataStore.get("port").getValue());
                }                
            }
        }
    }
    
    public BasicDBObject fetch(BasicDBObject json) throws IOException
    {
//        MongoClient mongoClient = new MongoClient("localhost");
        try
        {
            ScriptObject dss=base.getDataSourceScript();        
            String modelid=dss.getString("modelid");
            String scls=dss.getString("scls");
            DB db = mongoClient.getDB(modelid);
            DBCollection coll = db.getCollection(scls);

            //BasicDBObject json=(BasicDBObject) JSON.parse(query);
            //String operationType = json.getString("operationType");
            int startRow = json.getInt("startRow",0);
            int endRow = json.getInt("endRow",0);
            //String dataSource = json.getString("dataSource");
            //String componentId = json.getString("componentId");
            String textMatchStyle = json.getString("textMatchStyle");
            BasicDBObject data = (BasicDBObject)json.get("data");
            BasicDBObject oldValues = (BasicDBObject)json.get("oldValues");
            BasicDBList sortBy= (BasicDBList)json.get("sortBy");        


            BasicDBObject ret=new BasicDBObject();
            BasicDBObject resp=new BasicDBObject();
            BasicDBList ndata=new BasicDBList();
            ret.append("response", resp);
            resp.append("status", 0);
            resp.append("startRow", startRow);
            resp.append("data", ndata);

            //textMatchStyle
            //  exact
            //  substring
            // startsWith
            if(data!=null && data.size()>0)
            {
                Iterator<String> it=data.keySet().iterator();
                while(it.hasNext())
                {
                    String key=it.next();
                    Object val=data.get(key);

                    if(key.equals("_id"))
                    {
                        if(val instanceof BasicDBList)
                        {
                            data.put(key, new BasicDBObject().append("$in",val));
                        }
                    }else if(textMatchStyle!=null && val instanceof String)
                    {
                        if("substring".equals(textMatchStyle))
                        {
                            data.put(key, new BasicDBObject().append("$regex",val));
                        }else if("startsWith".equals(textMatchStyle))
                        {
                            data.put(key, new BasicDBObject().append("$regex","^"+val));
                        }
                    }

                }
            }

            //System.out.println("find:"+scls+" "+data);

            DBCursor cur = coll.find(data);
            int total=cur.count();

            //Sort
            if(sortBy!=null)
            {
                BasicDBObject sort=new BasicDBObject();
                for(int x=0;x<sortBy.size();x++)
                {
                    String field=(String)sortBy.get(x);
                    if(field.startsWith("-"))
                    {
                        sort.append(field.substring(1), -1);
                    }else
                    {
                        sort.append(field, 1);
                    }
                }
                cur.sort(sort);
            }            


            if(startRow>0)cur.skip(startRow);
            cur.limit(endRow-startRow);
            int endrow=startRow;
            try
            {
                while (cur.hasNext())
                {
                    DBObject dbobj = cur.next();
                    ndata.add(dbobj);
                    endrow++;
                    if(endrow==endRow)break;
                }
            } finally
            {
                cur.close();
            }            
            resp.append("endRow", endrow);
            resp.append("totalRows", total);   
            //System.out.println("fetach:"+ret);
            return ret;        
        }finally
        {
//            mongoClient.close();
        }
    }    
    
    public BasicDBObject add(BasicDBObject json) throws IOException
    {
//        MongoClient mongoClient = new MongoClient("localhost");
        try
        {        
            ScriptObject dss=base.getDataSourceScript();        
            initDB();
            String modelid=dss.getString("modelid");
            String scls=dss.getString("scls");
            DB db = mongoClient.getDB(modelid);
            DBCollection coll = db.getCollection(scls);

            BasicDBObject data = (BasicDBObject)json.get("data");

            BasicDBObject obj=data;//copyJSONObject(data);
            if(obj.getString("_id")==null)
            {
                ObjectId id = new ObjectId();
                obj.append("_id", "_suri:"+modelid+":"+scls+":"+id.toString());
                //obj.append("_id", id);
            }
            coll.insert(obj);

            BasicDBObject ret=new BasicDBObject();
            BasicDBObject resp=new BasicDBObject();
            ret.append("response", resp);
            resp.append("status", 0);
            resp.append("data", obj);
            return ret;
        }finally
        {
//            mongoClient.close();
        }
    }
    
    public BasicDBObject remove(BasicDBObject json) throws IOException
    {
//        MongoClient mongoClient = new MongoClient("localhost");
        try
        {
            ScriptObject dss=base.getDataSourceScript();        
            initDB();
            String modelid=dss.getString("modelid");
            String scls=dss.getString("scls");
            DB db = mongoClient.getDB(modelid);
            DBCollection coll = db.getCollection(scls);

            BasicDBObject data = (BasicDBObject)json.get("data");

            //ObjectId id=getObjectId(data);
            String id=data.getString("_id");
            BasicDBObject search=new BasicDBObject().append("_id", id);
            DBObject base=coll.findAndRemove(search);

            BasicDBObject ret=new BasicDBObject();
            BasicDBObject resp=new BasicDBObject();
            ret.append("response", resp);
            resp.append("status", 0);

            return ret;
        }finally
        {
//            mongoClient.close();
        }
    }    
    
    public BasicDBObject update(BasicDBObject json) throws IOException
    {
//        MongoClient mongoClient = new MongoClient("localhost");
        try
        {        
            ScriptObject dss=base.getDataSourceScript();        
            initDB();
            String modelid=dss.getString("modelid");
            String scls=dss.getString("scls");
            DB db = mongoClient.getDB(modelid);
            DBCollection coll = db.getCollection(scls);

            BasicDBObject data = (BasicDBObject)json.get("data");

            String id=data.getString("_id");
            BasicDBObject search=new BasicDBObject().append("_id", id);

            DBObject base=coll.findOne(search);
            //System.out.println("base"+base);

            data.remove("_id");
            DBObject obj=copyDBObject(base,data);
            //data.markAsPartialObject();
            //DBObject obj=coll.findAndModify(search, data);
            coll.save(obj);

            BasicDBObject ret=new BasicDBObject();
            BasicDBObject resp=new BasicDBObject();
            ret.append("response", resp);
            resp.append("status", 0);
            resp.append("data", obj);

            return ret;
        }finally
        {
//            mongoClient.close();
        }
    }        
    
    
    private DBObject copyDBObject(DBObject base, DBObject jobj)
    {
        Iterator<String> it = jobj.keySet().iterator();
        while (it.hasNext())
        {
            String key = it.next();
            base.put(key, jobj.get(key));
        }
        return base;
    }     
    
    public void close()
    { 
        if(mongoClient!=null)
        {
            mongoClient.close();
        }
    }
    

    
}
