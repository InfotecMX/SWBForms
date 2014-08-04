/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
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
import org.semanticwb.forms.script.ScriptObject;

/**
 *
 * @author javiersolis
 */
public interface DataStore {

    public BasicDBObject fetch(BasicDBObject json) throws IOException;

    public BasicDBObject add(BasicDBObject json) throws IOException;

    public BasicDBObject remove(BasicDBObject json) throws IOException;

    public BasicDBObject update(BasicDBObject json) throws IOException;

    public void close();
}
