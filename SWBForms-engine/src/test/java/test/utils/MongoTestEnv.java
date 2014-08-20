/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package test.utils;

import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodProcess;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;
import java.io.IOException;

/**
 *
 * @author serch
 */
public class MongoTestEnv {
    
    private static final MongodStarter starter = MongodStarter.getDefaultInstance();

    private static MongodExecutable _mongodExe;
    private static MongodProcess _mongod;
    private static boolean started = false;
    
    public static synchronized void startup() throws IOException{
        if (!started){
            started = true;
            _mongodExe = starter.prepare(new MongodConfigBuilder()
                .version(Version.Main.PRODUCTION)
                .net(new Net(27018, Network.localhostIsIPv6()))
                .build());
            _mongod = _mongodExe.start();
            Runtime.getRuntime().addShutdownHook(new Thread(){

                @Override
                public void run() {
                    _mongod.stop();
                    _mongodExe.stop();
                }
                
            });
        }
    }
    
    
    
    
    
    
}
