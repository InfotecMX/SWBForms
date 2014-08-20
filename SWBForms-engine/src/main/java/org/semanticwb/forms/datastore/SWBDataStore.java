/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.semanticwb.forms.datastore;

import com.mongodb.BasicDBObject;
import java.io.IOException;
import org.semanticwb.forms.SWBDataSource;

/**
 *
 * @author javiersolis
 */
public interface SWBDataStore 
{
    public BasicDBObject fetch(BasicDBObject json, SWBDataSource dataSource) throws IOException;

    public BasicDBObject add(BasicDBObject json, SWBDataSource dataSource) throws IOException;

    public BasicDBObject remove(BasicDBObject json, SWBDataSource dataSource) throws IOException;

    public BasicDBObject update(BasicDBObject json, SWBDataSource dataSource) throws IOException;

    public void close();
}
