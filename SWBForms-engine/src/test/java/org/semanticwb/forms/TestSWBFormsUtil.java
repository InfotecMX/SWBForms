package org.semanticwb.forms;

import java.io.FileInputStream;
import java.io.InputStream;
import static org.junit.Assert.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

/**
 *
 * @author serch
 */
@RunWith(JUnit4.class)
public class TestSWBFormsUtil {
    String base="Con el cambio de direccionamiento externo fue necesario reconectar el bridge br-ex\n" +
"\n" +
"ovs-vsctl del-port br-ex vlan1616\n" +
"ovs-vsctl add-port br-ex vlan1193\n" +
"\n" +
"después hubo que retirar la red exerna, esto se hizo con dashboard, liberando las ips reservadas y borrandolo para volver a crearlo con el nuevo direccionamiento\n" +
"\n" +
"\n" +
"neutron net-create ext-net -- --router:external=True --provider:network_type gre --provider:segmentation_id 2\n" +
"neutron subnet-create ext-net  --allocation-pool start=172.18.93.10,end=172.18.93.60  --gateway=172.18.93.62 --enable_dhcp=False  172.18.93.0/26\n" +
"\n" +
"";
    
    @Test
    public void test() throws Exception{
        InputStream is = new FileInputStream("src/test/resources/testStream.txt");
        byte[] out = SWBFormsUtils.readFully(is);
        assertArrayEquals(base.getBytes(), out);
        is.close();
        is = new FileInputStream("src/test/resources/testStream.txt");
        String out2 = SWBFormsUtils.readInputStream(is);
        assertEquals(base, out2);
        is.close();
        is = new FileInputStream("src/test/resources/testStream.txt");
        String out3 = SWBFormsUtils.readInputStream(is,"ISO8859-1");
        String base2 = new String(base.getBytes(),"ISO8859-1");
        assertEquals(base2, out3);
        is.close();
    }
}
