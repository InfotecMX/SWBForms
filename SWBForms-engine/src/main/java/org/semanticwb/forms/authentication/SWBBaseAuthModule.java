/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package org.semanticwb.forms.authentication;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import java.util.List;
import org.semanticwb.forms.SWBScriptEngine;
import org.semanticwb.forms.SWBUserRepository;
import org.semanticwb.forms.script.ScriptObject;

/**
 *
 * @author javiersolis
 */
public class SWBBaseAuthModule implements SWBAuthModule
{    
    private ScriptObject ams=null;                      //AuthModuleScript
    private SWBUserRepository userRep=null;      
    private SWBScriptEngine engine=null;
    
    public SWBBaseAuthModule(ScriptObject ams, SWBUserRepository userRep, SWBScriptEngine engine)
    {
        this.ams=ams;
        this.userRep=userRep;
        this.engine=engine;
        init();
    }    
    
    private void init()
    {
        //System.out.println("SWBBaseAuthModule:init()");
    }
    
    public BasicDBList listUsers(BasicDBObject query) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public BasicDBObject getUserById(String userid) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public BasicDBObject getUserByLogin(String login) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public BasicDBObject validateUser(String login, Object credential) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public boolean hasUserRole(String userid, String role) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public boolean hasUserGroup(String userid, String group) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public List<String> listUserRoles(String userid) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public List<String> listUserGroups(String userid) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    public boolean isUserActive(String userid) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
}
