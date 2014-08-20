/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package org.semanticwb.forms;

import com.mongodb.BasicDBObject;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 *
 * @author javiersolis
 */
public class SWBUser implements Map<String, Object>
{
    private HashMap obj=null;
    private SWBUserRepository userRep=null; 
    private String _id=null;
    
    public SWBUser()
    {
        obj=new HashMap();
    }
    
    public SWBUser(BasicDBObject obj, SWBUserRepository userRep)
    {
        this.obj=new HashMap(obj);
        this.userRep=userRep;      
        _id=obj.getString("_id");
    }
    
    public String getId()
    {
        return _id;
    }
    
    /**
     * Returns the value to which the specified key is mapped, or null if this map contains no mapping for the key.     
     * More formally, if this map contains a mapping from a key k to a value v such that (key==null ? k==null : key.equals(k)), then this method returns v; otherwise it returns null. (There can be at most one such mapping.)
     * A return value of null does not necessarily indicate that the map contains no mapping for the key; it's also possible that the map explicitly maps the key to null. The containsKey operation may be used to distinguish these two cases.
     * @param key the key whose associated value is to be returned 
     * @return the value to which the specified key is mapped, or null if this map contains no mapping for the key
     */
    public Object get(Object key)
    {
        return obj.get(key);
    }
    
    /**
     * Associates the specified value with the specified key in this map (optional operation). 
     * If the map previously contained a mapping for the key, the old value is replaced by the specified value. 
     * (A map m is said to contain a mapping for a key k if and only if m.containsKey(k) would return true.)

     * @param key key with which the specified value is to be associated val 
     * @param val value to be associated with the specified key 
     * @return the previous value associated with key, or null if there was no mapping for key. 
     * (A null return can also indicate that the map previously associated null with key, 
     * if the implementation supports null values.)
     */
    public Object put(String key, Object val)
    {
        return obj.put(key, val);
    }
    
    public final boolean hasRole(String role)
    {
        return userRep.hasUserRole(getId(), role);
    }
    
    public final boolean hasGroup(String group)
    {
        return userRep.hasUserRole(getId(), group);
    }
    
    List<String> listRoles()
    {
        return userRep.listUserRoles(getId());
    }
    
    List<String> listGroups()
    {
        return userRep.listUserGroups(getId());
    }    
    
    public final boolean isActive()
    {
        if(userRep.getAuthModule()!=null)return userRep.isUserActive(getId());
        return (Boolean)obj.get("active");
    }

    public int size() {
        return obj.size();
    }

    public boolean isEmpty() {
        return obj.isEmpty();
    }

    public boolean containsKey(Object key) {
        return obj.containsKey(key);
    }

    public boolean containsValue(Object value) {
        return obj.containsValue(value);
    }

    public Object remove(Object key) {
        return obj.remove(key);
    }

    public void putAll(Map<? extends String, ? extends Object> m) {
        obj.putAll(m);
    }

    public void clear() {
        obj.clear();
    }

    public Set<String> keySet() {
        return obj.keySet();
    }

    public Collection<Object> values() {
        return obj.values();
    }

    public Set<Entry<String, Object>> entrySet() {
        return obj.entrySet();
    }
    
    public void reload()
    {
        BasicDBObject o=userRep.getAuthModule().getUserById(getId());
        if(o!=null)
        {
            obj.putAll(o);        
        }
    }

    @Override
    public boolean equals(Object obj) {
        return this.obj.equals(obj);
    }    

    @Override
    public int hashCode() {
        return obj.hashCode();
    }
    
}
