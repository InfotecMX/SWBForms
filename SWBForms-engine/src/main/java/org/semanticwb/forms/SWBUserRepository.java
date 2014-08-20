/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package org.semanticwb.forms;

import com.mongodb.BasicDBObject;
import java.lang.reflect.Constructor;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.semanticwb.forms.authentication.SWBAuthModule;
import org.semanticwb.forms.script.ScriptObject;

/**
 *
 * @author javiersolis
 */
public class SWBUserRepository 
{
    SWBAuthModule authModule=null; 
    ScriptObject urs=null;
    SWBScriptEngine engine=null;
    
    public SWBUserRepository(ScriptObject urs, SWBScriptEngine engine)
    {
        this.urs=urs;
        this.engine=engine;
        init();
    }
    
    private void init()
    {
        //System.out.println("SWBUserRepository:init()");        
        String sauthModule=urs.getString("authModule");
        if(sauthModule!=null)
        {
            ScriptObject swbf=new ScriptObject(engine.getNativeScriptEngine().get("swbf"));
            ScriptObject ams=swbf.get("authModules").get(sauthModule); 
            try
            {
                Class cls=Class.forName(ams.getString("class"));
                Constructor c=cls.getConstructor(ScriptObject.class, SWBUserRepository.class, SWBScriptEngine.class);
                System.out.println("Loading AuthModule:"+sauthModule);
                authModule=(SWBAuthModule)c.newInstance(ams,this,engine);
            }catch(Exception e)
            {
                e.printStackTrace();
            }             
        }
    }

    public SWBAuthModule getAuthModule() {
        return authModule;
    }
    
    public ScriptObject getUserRepositoryScript()
    {
        return urs;
    }
    
    public SWBUser getUserById(String userid)
    {
        if(authModule!=null)
        {
            BasicDBObject obj=authModule.getUserById(userid);
            if(obj!=null)
            {
                return new SWBUser(obj, this);
            }
        }
        return null;
    }
    
    public SWBUser getUserByLogin(String login)
    {
        if(authModule!=null)
        {
            BasicDBObject obj=authModule.getUserByLogin(login);
            if(obj!=null)
            {
                return new SWBUser(obj, this);
            }
        }
        return null;
    }
    
    public List<SWBUser> listUsers(BasicDBObject query)
    {
        List<SWBUser> ret=new ArrayList();
        if(authModule!=null)
        {
            Iterator it=authModule.listUsers(query).iterator();
            while (it.hasNext()) {
                BasicDBObject obj = (BasicDBObject)it.next();
                ret.add(new SWBUser(obj,this));
            }
        }
        return ret;
    }
    
    boolean hasUserRole(String userid, String role)
    {
        if(authModule!=null)return authModule.hasUserRole(userid, role);
        return false;        
    }
    
    boolean hasUserGroup(String userid, String group)
    {
        if(authModule!=null)return authModule.hasUserRole(userid, group);
        return false;        
    }
    
    List<String> listUserRoles(String userid)
    {
        if(authModule!=null)return authModule.listUserRoles(userid);
        return new ArrayList<String>();
    }
    
    List<String> listUserGroups(String userid)
    {
        if(authModule!=null)return authModule.listUserGroups(userid);
        return new ArrayList<String>();
    }    
    
    public boolean isUserActive(String userid)
    {
        if(authModule!=null)return authModule.isUserActive(userid);
        return false;
    }  
    
    public SWBUser validateUser(String login, Object credential)
    {
        if(authModule!=null)
        {
            BasicDBObject obj=authModule.validateUser(login, credential);
            if(obj!=null)
            {
                return new SWBUser(obj, this);
            }            
        }
        return null;
    }      
    
}
