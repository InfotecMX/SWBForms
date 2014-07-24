<%@page import="java.util.concurrent.ConcurrentHashMap"%>
<%@page import="java.util.zip.CRC32"%>
<%@page import="org.apache.commons.fileupload.FileItem"%>
<%@page import="org.apache.commons.fileupload.disk.DiskFileItemFactory"%>
<%@page import="org.apache.commons.fileupload.servlet.ServletFileUpload"%>
<%@page import="java.io.FileOutputStream"%>
<%@page import="java.io.InputStreamReader"%>
<%@page import="java.io.FileInputStream"%>
<%@page import="java.io.BufferedReader"%>
<%@page import="java.io.PrintWriter"%>
<%@page import="java.io.File"%>
<%@page import="java.io.ByteArrayOutputStream"%><%@page import="java.io.IOException"%><%@page import="java.io.InputStream"%><%@page import="com.mongodb.util.JSON"%><%@page import="org.bson.types.ObjectId"%><%@page import="com.mongodb.*"%><%@page import="java.io.DataInputStream"%><%@page import="java.util.*"%><%@page import="org.semanticwb.platform.*"%><%@page import="java.util.Iterator"%><%@page import="org.semanticwb.*"%><%@page contentType="text/xml" pageEncoding="UTF-8"%><%!
    
   private static final int CHUNK_SIZE = 10 * 1024 * 1024; //10MB
   private static LongFileUploadUtils fileUtil;
   //private static ConcurrentHashMap<String, ArrayList<SemanticObject>> enProceso =new ConcurrentHashMap<String, ArrayList<SemanticObject>>();
   
    
   private void startUploadProcess(HttpServletRequest request, HttpServletResponse response) throws IOException 
   {
        String userStr = request.getSession().getId();
        System.out.println("LongFileUploader.startUploadProcess: userStr:"+userStr);
        response.setHeader("mimetype", "text/json-comment-filtered");
        PrintWriter out = response.getWriter();
        out.print("{\"chunkSize\":" + CHUNK_SIZE);
        ArrayList<PendingFile> lpf = fileUtil.getListOfPendingFiles(userStr);
        if (!lpf.isEmpty()) {
            out.print(", \"pendingFiles\":[");
            boolean doComma = false;
            for (PendingFile pf : lpf) {
                if (pf.isDone()) {
                    continue;
                }
                if (doComma) {
                    out.print(",");
                }
                out.print("{\"id\":\"" + pf.getId() + "\",\"size\":"
                        + pf.getSize() + ",\"filename\":\"" + pf.getFilename()
                        + "\",\"crc\":\"" + pf.getIniCRC() + "\"}");
                doComma = true;
            }
            out.print("]");
        }
        out.print("}");
    }

    private void uploadSolicitude(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String filename = request.getParameter("filename");
        String size = request.getParameter("size");
        String crc = request.getParameter("iniCRC");
        String sdate = request.getParameter("sDate");
        String localId = request.getParameter("localId");
        String userStr = request.getSession().getId();
        
        PendingFile pf = fileUtil.haveWorkingFile(filename, Long.parseLong(size),
                crc, userStr);
        if (null == pf) {
            if (fileUtil.addWorkingFile(filename, Long.parseLong(size), crc,
                    sdate, userStr)) {
                pf = fileUtil.haveWorkingFile(filename, Long.parseLong(size),
                        crc, userStr);
            }
        }
        System.out.println("LongFileUploader.uploadSolicitude: filename:"+filename);
        response.setHeader("mimetype", "text/json-comment-filtered");
        PrintWriter out = response.getWriter();
        long localsize = 0;
        File wrkfile = new File(fileUtil.getWorkingDirectory(), pf.getId());
        if (!wrkfile.exists()) {
            wrkfile.mkdirs();
        }
        File updFile = new File(wrkfile, pf.getFilename());
        if (updFile.exists()) {
            localsize = updFile.length();
        }
        System.out.println("LongFileUploader.uploadSolicitude: bytes uploaded:"+localsize);
        out.print("{\"file2Upload\":{\"localId\":" + localId + ",\"id\":\""
                + pf.getId() + "\",\"bytesRecived\":" + localsize + "}}");
    }

    private void uploadChunk(HttpServletRequest request, HttpServletResponse response, String param) {
        File workfiledir = new File(fileUtil.getWorkingDirectory(), param);
        PendingFile pf = fileUtil.getPendingFileFromId(param);
        if (!workfiledir.exists()) {
            workfiledir.mkdirs();
        }
        String crc = "";
        String tmpFileName = UUID.randomUUID().toString();
        System.out.println("LongFileUploader.uploadChunk:"+tmpFileName);
        if (ServletFileUpload.isMultipartContent(request)) {
            DiskFileItemFactory factory = new DiskFileItemFactory(1024 * 1024,
                    workfiledir);
            ServletFileUpload upload = new ServletFileUpload(factory);
            upload.setSizeMax(CHUNK_SIZE + 1024);
            try {
                List<FileItem> items = upload.parseRequest(request);
                File uplFile = new File(workfiledir, tmpFileName);
                for (FileItem item : items) {
                    if (!item.isFormField()) {
                        item.write(uplFile);
                    } else {
                        if ("crc".equals(item.getFieldName())) {
                            crc = item.getString();
                        }
                    }
                }
                String calcCrc = calcCRC(uplFile, false);
                if (calcCrc.equals(crc)) {
                    File updfile = new File(workfiledir, pf.getFilename());
                    if (!updfile.exists()) {
                        boolean worked = uplFile.renameTo(updfile);
                        if (!worked) {
                            throw new IOException("Can't rename a file");
                        }
                    } else {
                        FileOutputStream fos = new FileOutputStream(updfile,
                                true);
                        FileInputStream fis = new FileInputStream(uplFile);
                        byte[] tempBytes = new byte[CHUNK_SIZE];
                        int blksize = 0;
                        while ((blksize = fis.read(tempBytes)) > -1) {
                            fos.write(tempBytes, 0, blksize);
                        }
                        fis.close();
                        fos.flush();
                        fos.close();
                        if (updfile.length() == pf.getSize()) {
                            pf.setDone(true);
                        }
                        uplFile.delete();
                    }
                }
            } catch (Exception ioe) {
                ioe.printStackTrace();
                //log.error(ioe);
            }
        }
    }

    private static String calcCRC(File file, boolean start) {
        CRC32 crc = new CRC32();
        FileInputStream fin = null;
        try {
            fin = new FileInputStream(file);
            byte[] buffer = new byte[8192];
            int read = 0;
            while ((read = fin.read(buffer)) != -1) {
                crc.update(buffer, 0, read);
                if (start) {
                    break;
                }
            }
        } catch (IOException ex) {
            ex.printStackTrace();
            //log.error(ex);
        } finally {
            if (null != fin) {
                try {
                    fin.close();
                } catch (IOException ex) {
                    ex.printStackTrace();
                    //log.error(ex);
                }
            }
        }
        return Long.toHexString(crc.getValue());
    }

    private void abortUpload(HttpServletRequest request, HttpServletResponse response, String param)
            throws IOException {
        boolean ret = fileUtil.removePendingFile(param);
        System.out.println("LongFileUploader.abortUpload: "+param+" : "+ret);
        response.setHeader("mimetype", "text/json-comment-filtered");
        PrintWriter out = response.getWriter();
        out.print("{\"deleted\":\"" + ret + "\"}");
    }

    private void eofCheck(HttpServletRequest request, HttpServletResponse response, String param)
            throws IOException {
        String pdir = request.getParameter("dirToPlace");
        System.out.println("LongFileUploader.eofCheck: pdir="+pdir);
        String key = request.getSession(true).getId();
        System.out.println("LongFileUploader.eofCheck: key "+key);
        boolean ret = false;
/*        
        ArrayList<SemanticObject> also = enProceso.get(key);
        if (null != also) {
            SemanticObject so = null;
            for (SemanticObject currSo : also) {
                System.out.println("LongFileUploader.eofCheck: currSo.getId() " +currSo.getId());
                if (currSo.getId().equals(pdir)) {
                    so = currSo;
                    break;
                }
            }
            System.out.println("LongFileUploader.eofCheck: so:"+so);
            if (null != so) {
                pdir = so.getWorkPath();
                System.out.println("LongFileUploader.eofCheck: pdir2="+pdir);
                File dir = new File(org.semanticwb.SWBPortal.getWorkPath(), pdir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }
                if (dir.exists()) {
                    PendingFile pf = fileUtil.getPendingFileFromId(param);
                    File dest = new File(dir, SWBUtils.TEXT.replaceSpecialCharacters(pf.getFilename().toString(),'.', true));
                    if (!dest.exists()) {
                        File workfiledir = new File(fileUtil.getWorkingDirectory(), param);
                        File orig = new File(workfiledir, pf.getFilename());
                        ret = orig.renameTo(dest);
                        if (!ret) {
                            FileInputStream fis = new FileInputStream(orig);
                            FileOutputStream fos = new FileOutputStream(dest);
                            byte[] buffer = new byte[8192];
                            int readbytes = 0;
                            while ((readbytes = fis.read(buffer)) > -1) {
                                fos.write(buffer, 0, readbytes);
                            }
                            fis.close();
                            fos.flush();
                            fos.close();
                            orig.delete();
                            ret = true;
                        }
                        SemanticProperty sp = so.getSemanticClass()
                                .getProperty(propertyName);
                        log.trace("LongFileUploader.eofCheck: SemanticProperty:"+sp);
                        if (propertyName.startsWith("has")) {
                            so.addLiteralProperty(sp,
                                    new SemanticLiteral(dest.getName()));
                        } else {
                            String currVal = so.getProperty(sp);
                            if (null != currVal) {
                                File currFile = new File(dir, currVal);
                                if (currFile.exists()) {
                                    currFile.delete();
                                }
                            }
                            so.setProperty(sp, dest.getName());
                        }
                        Iterator<SemanticLiteral> iter = so.listLiteralProperties(sp);
                        while(iter.hasNext()){
                            SemanticLiteral sl = iter.next();
                            log.trace("Value found: "+sl.getString());
                        }
                        workfiledir.delete();
                        fileUtil.updateChanges();
                    }
                }
            }
        }
*/ 
        System.out.println("LongFileUploader.eofCheck: ret:"+ret);
        response.setHeader("mimetype", "text/json-comment-filtered");
        PrintWriter out = response.getWriter();
        out.print("{\"saved\":\"" + ret + "\"}");
    }

    private void giveStatus(HttpServletRequest request, HttpServletResponse response, String param)
            throws IOException {
        PendingFile pf = fileUtil.getPendingFileFromId(param);
        response.setHeader("mimetype", "text/json-comment-filtered");
        PrintWriter out = response.getWriter();
        long localsize = 0;
        File wrkfile = new File(fileUtil.getWorkingDirectory(), pf.getId());
        File updFile = new File(wrkfile, pf.getFilename());
        if (updFile.exists()) {
            localsize = updFile.length();
        }
        System.out.println("LongFileUploader.giveStatus: id "+pf.getId()+" bytes:"+localsize);
        out.print("{\"id\":\"" + pf.getId() + "\",\"bytesRecived\":"
                + localsize + "}");
    }    
    
    
class PendingFile {

    private final String id;
    private String filename;
    private long size;
    private String date;
    private String iniCRC;
    private boolean done = false;
    private String sUser;

    public PendingFile(String id) {
        this.id = id;
    }

    public PendingFile(String id, String filename, long size, String date,
            String iniCRC, String user) {
        this.id = id;
        this.filename = filename;
        this.size = size;
        this.date = date;
        this.iniCRC = iniCRC;
        this.sUser = user;
    }

    public String getId() {
        return id;
    }

    public String getFilename() {
        return filename;
    }

    public long getSize() {
        return size;
    }

    public String getDate() {
        return date;
    }

    public String getIniCRC() {
        return iniCRC;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public void setIniCRC(String iniCRC) {
        this.iniCRC = iniCRC;
    }

    public boolean isDone() {
        return done;
    }

    public void setDone(boolean done) {
        this.done = done;
    }

    public String getsUser() {
        return sUser;
    }

    public void setsUser(String sUser) {
        this.sUser = sUser;
    }

    public String toString() {
        return id + "|" + filename + "|" + size + "|" + date + "|" + iniCRC + "|" + done +"|"+sUser+ "\n";
    }
}    

class LongFileUploadUtils {
    private File workingDirectory;
    private ArrayList<PendingFile> pending=new ArrayList<PendingFile>();
    private LongFileUploadUtils(){
        
    }
    public void init(final File wrkDir) throws IOException{
        if (!wrkDir.exists()){
            wrkDir.mkdirs();
        } 
        workingDirectory = wrkDir;
        File config = new File(workingDirectory,"uploadLongFiles.config");
        if (config.exists()){
            BufferedReader bf = new BufferedReader(new InputStreamReader(
                    new FileInputStream(config)));
            String pf = null;
            while ((pf = bf.readLine())!=null){ 
                String[] parts = pf.split("\\|"); 
                if (parts.length==7 && parts[5].equals("false")){
                    PendingFile tpf = new PendingFile(parts[0], parts[1], 
                            Long.parseLong(parts[2]), parts[3], parts[4], 
                            parts[6]);
                    pending.add(tpf);
                }
            }
            bf.close();
        }
    }
    
    public PendingFile haveWorkingFile(String name, long size, String crc, String user){
        PendingFile pf = null;
        for (PendingFile lpf:pending){
            if (lpf.getsUser().equals(user) && lpf.getFilename().equalsIgnoreCase(name) && lpf.getSize()==size 
                    && lpf.getIniCRC().equalsIgnoreCase(crc)){
                pf = lpf;
                break;
            }
        }
        return pf;
    }
    
    public boolean addWorkingFile(String name, long size, String crc, 
            String date, String user){
        if (null==haveWorkingFile(name, size, crc, user)) {
            PendingFile pf = new PendingFile(UUID.randomUUID().toString(), name, 
                    size, date, crc, user);
            pending.add(pf);
            new Thread(){
                public void run(){
                    saveData();
                }
            }.start();
            return true;
        }
        return false;
    }
    
    private synchronized void saveData(){
        try {
            File config = new File(workingDirectory,"uploadLongFiles.config");
            FileOutputStream osw = new FileOutputStream(config);
            for (PendingFile pf:pending){
                osw.write(pf.toString().getBytes("ISO8859-1"));
            }
            osw.close();
        } catch (Exception e)
        {
            e.printStackTrace();
            //log.error("Error Saving Config data of LargeUpload", e);
        }
    }
    
    public ArrayList<PendingFile> getListOfPendingFiles(String strUser){
        ArrayList<PendingFile> ret = new ArrayList<PendingFile>();
        for (PendingFile pf: pending){
            if (strUser.equals(pf.getsUser()))
            {
                ret.add(pf);
            }
        }
        return ret;
    }
    
    public PendingFile getPendingFileFromId(String id){
        PendingFile ret = null;
        for (PendingFile pf: pending){
            if (id.equals(pf.getId())){
                ret = pf;
                break;
            }
        }
        return ret;
    }
    
    public boolean removePendingFile(String id){
        boolean ret =false;
        PendingFile pf = getPendingFileFromId(id);
        if (null!=pf){
            File dir = new File(workingDirectory, id);
            for (File file:dir.listFiles()){
                if (file.exists()){
                    file.delete();
                }
            }
            ret = dir.delete();
            pending.remove(pf);
        }
        return ret;
    }
    
    public void updateChanges(){
        new Thread(){
                public void run(){
                    saveData();
                }
            }.start();
    }
    
    public File getWorkingDirectory()
    {
        return workingDirectory;
    }
}

    
%><%
    try
    {
        //String in=SWBUtils.readInputStream(request.getInputStream(),"utf-8");
        String parameter="id";
        
        String uri = request.getRequestURI();
        String urlBase = "/swbadmin/jsp/fileUploadDS.jsp";//paramRequest.getRenderUrl().setCallMethod(SWBResourceURL.Call_DIRECT).toString();
        //SemanticObject so = null;
        
        String path = "";
        String cmd = "";
        String param = "";

        if (request.getParameter(parameter) != null) 
        {
            System.out.println("LongFileUploader: parameter " + parameter + ":" + request.getParameter(parameter));
            so = paramRequest.getWebPage().getWebSite().getSemanticModel()
                    .getSemanticObject(request.getParameter(parameter));
            System.out.println("LongFileUploader: so:"+so);
            System.out.println("LongFileUploader: sosClass:"+so.getSemanticClass().getURI());
            System.out.println("LongFileUploader: classUri:"+classUri);
            if (so.getSemanticClass().getURI().equals(classUri)) {
                String key = request.getSession(true).getId();
                System.out.println("LongFileUploader: key "+key);
                if (!enProceso.containsKey(key)) {
                    enProceso.put(key, new ArrayList<SemanticObject>());
                }
                ArrayList<SemanticObject> also = enProceso.get(key);
                if (!also.contains(so)) {
                    also.add(so);
                }
            }
        }
        if (SWBResourceURL.Call_DIRECT == paramRequest.getCallMethod()) {
            if (uri.indexOf(urlBase) > -1) {
                path = uri.substring(urlBase.length());
            }
            int inicmd = path.indexOf("/");
            int endcmd = path.indexOf("/", inicmd + 1);

            if (endcmd > -1) {
                cmd = path.substring(inicmd + 1, endcmd);
            } else {
                cmd = path.substring(inicmd + 1);
            }

            if (endcmd > -1 && path.length() > endcmd) {
                param = path.substring(endcmd + 1);
            }
        }
        System.out.println("LongFileUploader: cmd:"+cmd);
        if (cmd.equals("start")) {
            startUploadProcess(request, response, paramRequest);
        } else if (cmd.equals("uploadSolicitude")) {
            uploadSolicitude(request, response, paramRequest);
        } else if (cmd.equals("uploadchunk")) {
            uploadChunk(request, response, paramRequest, param);
        } else if (cmd.equals("abortupload")) {
            abortUpload(request, response, paramRequest, param);
        } else if (cmd.equals("eofcheck")) {
            eofCheck(request, response, paramRequest, param);
        } else if (cmd.equals("status")) {
            giveStatus(request, response, paramRequest, param);
        } else {
            String id = SWBUtils.TEXT.replaceSpecialCharacters(
                    paramRequest.getResourceBase().getTitle(), true);
            String url = "/bduplaoder";
            String redirectedURL = "/";
            System.out.println("LongFileUploader: uri en " + redirectURL + ":" + request.getParameter(redirectURL));
            try {
                redirectedURL = URLDecoder.decode(request.getParameter(redirectURL), "UTF-8");
            } catch (Exception noe) {
                System.out.println("LongFileUploader: Sin Redirect URL");
            }
            System.out.println("LongFileUploader: uri decoded: " + redirectedURL);
            if (!redirectedURL.startsWith("/")) {
                redirectedURL = "";
            }
            if (null != so) {
                out.println("<script src=\"/swbadmin/js/longfu/json2.js\"></script>"
                        + "<script src=\"/swbadmin/js/longfu/swblongfileuploader.js\">"
                        + "</script><script type=\"text/javascript\">"
                        + "var " + id + "_lfu = new LongFileUploader(\"" + urlBase
                        + "\",\"" + so.getId() //Revisar...
                        + "\", \"" + id + "\",\"" + redirectedURL + "\");</script>");
                out.println("<div id=\"" + id + "\"><form>file: <input type=\"file\" "
                        + "name=\"updfile\" id=\"updfile\" "
                        + "onchange=\"" + id + "_lfu.sendFile(this)\"/>"
                        + "<div id=\"progressBar\" style=\"width:100%; height:15px; "
                        + "border:1px solid #000; overflow:hidden;\">"
                        + "<div id=\"" + id + "_percentage\" style=\"width:0%; height:15px; "
                        + "border-right: 1px solid #000000; background: #0000ff;\">"
                        + "</div><div id=\"" + id + "_label\" style=\"color: #000000; "
                        + "font-size: 15px; font-style: italic; font-weight: "
                        + "bold; left: 25px; position: relative; top: -16px;\">"
                        + "</div></div>"
                        + "</form></div>");
            } else {
                out.print("No se encontró el objeto semántico relacionado");
            }
        }
        
        
        
        
        
    } catch (Throwable e)
    {
        e.printStackTrace();
    }
%>