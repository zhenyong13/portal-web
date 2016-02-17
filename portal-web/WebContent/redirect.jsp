 <%@page import="java.io.FileInputStream"%>
<%@page import="java.io.FileOutputStream"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.io.File"%>
 <%@ page language="java" import="java.util.*,com.zhuozhengsoft.pageoffice.*" pageEncoding="gb2312"%>
<%
String path = request.getContextPath();
String filecode=request.getParameter("filecode");
String reddoctype=request.getParameter("reddoctype");
String taskcode=request.getParameter("taskcode");
String filetype=request.getParameter("filetype"); // 文件类型
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/"; 
String url="fileReview.jsp?filecode="+filecode+"&reddoctype=11&taskcode="+taskcode+"filetype="+filetype;
/* if( "pdf".equals( filetype )){ //PDF文件预览
	url="pdf.jsp?filecode="+filecode;
} */
String redirect=PageOfficeLink.openWindow(request, url,"width=1200px;height=800px;");
redirect=redirect.replaceAll("\r\n","");
%>
<!DOCTYPE>
<html>
<head>
    <title></title>
    <script>
  		  function load(){
  			  var url="<%=redirect%>";
  			  window.location.href=url;
  		  }
  		  load();
    </script>
</head>
<body>
</body>
</html>