/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package org.semanticwb.forms.authentication;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import java.util.List;

/**
 *
 * @author javiersolis
 */
public interface SWBAuthModule
{
    BasicDBList listUsers(BasicDBObject query);
    BasicDBObject getUserById(String userid);
    BasicDBObject getUserByLogin(String login);
    BasicDBObject validateUser(String login, Object credential);
    boolean hasUserRole(String userid, String role);
    boolean hasUserGroup(String userid, String group);
    List<String> listUserRoles(String userid);
    List<String> listUserGroups(String userid);
    boolean isUserActive(String userid);
}
