/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package org.semanticwb.forms;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 *
 * @author javier.solis.g
 */
public class SWBFormsUtils
{
    /**
     * Lee el contenido del InputStream y lo convierte a un String
     * @param inputStream
     * @return
     * @throws IOException 
     */
    public static String readInputStream(InputStream inputStream) throws IOException 
    {
        return new String(readFully(inputStream));
    }      
    
    /**
     * Lee el contenido del InputStream y lo convierte a un String, con la codificacion especificada
     * @param inputStream
     * @param encoding
     * @return
     * @throws IOException 
     */
    public static String readInputStream(InputStream inputStream, String encoding) throws IOException 
    {
        return new String(readFully(inputStream), encoding);
    }    

    /**
     * Lee el contenido del InputStream y lo convierte a un arreglo de bytes
     * @param inputStream
     * @return
     * @throws IOException 
     */
    public static byte[] readFully(InputStream inputStream) throws IOException 
    {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        byte[] buffer = new byte[1024];
        int length = 0;
        while ((length = inputStream.read(buffer)) != -1) {
            baos.write(buffer, 0, length);
        }
        return baos.toByteArray();
    }      
}
