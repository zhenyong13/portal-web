<%@page import="java.io.FileInputStream"%>
<%@page import="java.io.FileOutputStream"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.io.File"%>
<%@ page language="java" import="java.util.*,com.zhuozhengsoft.pageoffice.*,com.zhuozhengsoft.pageoffice.wordwriter.*" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.pageoffice.cn" prefix="po" %>

 
<%!
// 拷贝文件
public void copyFile(String oldPath, String newPath){
		try {
			int bytesum = 0;
			int byteread = 0;
			File oldfile = new File(oldPath);
			if (oldfile.exists()) { //文件存在时 
				InputStream inStream = new FileInputStream(oldPath); //读入原文件 
				FileOutputStream fs = new FileOutputStream(newPath);
				byte[] buffer = new byte[1444];
				int length;
				while ((byteread = inStream.read(buffer)) != -1) {
					bytesum += byteread; //字节数 文件大小 
					System.out.println(bytesum);
					fs.write(buffer, 0, byteread);
				}
				inStream.close();
			}
		} catch (Exception e) {
			System.out.println("复制单个文件操作出错");
			e.printStackTrace();
		}

}
%>
<%

	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+"/"+request.getContextPath();
	System.out.println(basePath);	
	String mbfilecode = request.getParameter("mbfilecode");//红头模版  filecode
	String reddoctype=request.getParameter("reddoctype");//红头类型
	String filecode = request.getParameter("filecode");//原文件 filecode
	String taskcode = request.getParameter("taskcode");//任务编码 
	String filetype = request.getParameter("filetype");//文件类型
	String filePath="";
	 if(filecode ==null || "".equals(filecode) || filecode =="null"){
		 filecode="doc/test.doc";
	}
	
	if( "pdf".equals( filetype )){ // 是PDF文件
		PDFCtrl poCtrl1 = new PDFCtrl(request);
		poCtrl1.setServerPage(request.getContextPath()+"/poserver.do"); //此行必须
		
		// Create custom toolbar
		poCtrl1.addCustomToolButton("打印", "Print()", 6);
		poCtrl1.addCustomToolButton("隐藏/显示书签", "SetBookmarks()", 0);
		poCtrl1.addCustomToolButton("-", "", 0);
		poCtrl1.addCustomToolButton("实际大小", "SetPageReal()", 16);
		poCtrl1.addCustomToolButton("适合页面", "SetPageFit()", 17);
		poCtrl1.addCustomToolButton("适合宽度", "SetPageWidth()", 18);
		poCtrl1.addCustomToolButton("-", "", 0);
		poCtrl1.addCustomToolButton("首页", "FirstPage()", 8);
		poCtrl1.addCustomToolButton("上一页", "PreviousPage()", 9);
		poCtrl1.addCustomToolButton("下一页", "NextPage()", 10);
		poCtrl1.addCustomToolButton("尾页", "LastPage()", 11);
		poCtrl1.addCustomToolButton("-", "", 0);
		
		if(!"".equals( filecode )){
			String fileUrl =basePath+"/download?filecode="+filecode;
			System.out.println(fileUrl);
			poCtrl1.webOpen(fileUrl);
		}else{
			poCtrl1.webOpen("doc/test.pdf");
		}
		poCtrl1.setTagId("PDFCtrl1"); //此行必须
	}else{
		//***************************卓正PageOffice组件的使用********************************
		PageOfficeCtrl poCtrl1 = new PageOfficeCtrl(request);
		poCtrl1.setServerPage(request.getContextPath()+"/poserver.do"); //此行必须
		poCtrl1.setCustomToolbar(false);
		poCtrl1.setSaveFilePage("SaveFile.jsp");
		String oldFile=basePath+"/download?filecode="+filecode;
		oldFile="doc/test.doc";
		if (mbfilecode != null && mbfilecode.trim() != "" && mbfilecode.trim() != "null") {
			// 选择模板后执行套红
			// 复制模板，命名为正式发文的文件名：zhengshi.doc
			String templateName = mbfilecode;// request.getParameter("mb");
			String templatePath = basePath+"/download?filecode="+mbfilecode;//模板文件
			System.out.println(templatePath);
			templatePath=request.getServletContext().getRealPath("doc/temp2008.doc");//
			filePath = request.getServletContext().getRealPath("doc/test2.doc");//新文件
			System.out.println(filePath);
			copyFile(templatePath, filePath); 

			// 填充数据和正文内容到“zhengshi.doc”
			 WordDocument doc = new WordDocument();
			DataRegion copies = doc.openDataRegion("PO_Copies");
			copies.setValue("6");
			DataRegion docNum = doc.openDataRegion("PO_DocNum");
			docNum.setValue("001");
			DataRegion issueDate = doc.openDataRegion("PO_IssueDate");
			issueDate.setValue("2013-5-30");
			DataRegion issueDept = doc.openDataRegion("PO_IssueDept");
			issueDept.setValue("开发部");
			DataRegion sTextS = doc.openDataRegion("PO_STextS");
			sTextS.setValue("[word]doc/test.doc[/word]");
			DataRegion sTitle = doc.openDataRegion("PO_sTitle");
			sTitle.setValue("北京某公司文件");
			DataRegion topicWords = doc.openDataRegion("PO_TopicWords");
			topicWords.setValue("Pageoffice、 套红");
			poCtrl1.setWriter(doc); 
			
		} else {
			//首次加载时，加载正文内容：test.doc
			//fileName = "test.doc";
			filePath="doc/test.doc";
		}
		poCtrl1.webOpen(filePath, OpenModeType.docNormalEdit, "");
		poCtrl1.setTagId("PageOfficeCtrl1"); //此行必须
	}

	
%>
<!DOCTYPE>
<html>
<head>
    <title></title>
    <style>
	.btn-sm{
	    padding: 5px 10px;
	    font-size: 12px;
	    line-height: 1.5;
	    border-radius: 3px;
	}
	.btn{
		display: inline-block;
	    padding: 6px 12px;
	    margin-bottom: 0;
	    font-size: 14px;
	    font-weight: normal;
	    text-align: center;
	    white-space: nowrap;
	    vertical-align: middle;
	    cursor: pointer;
	    color: #333;
	    background-color: #fff;
	    -webkit-user-select: none;
	    -moz-user-select: none;
	    -ms-user-select: none;
	    user-select: none;
	    background-image: none;
	    border: 1px solid #ccc;
	    border-radius: 4px;
	}
	.save{
	    padding: 5px 10px;
	    font-size: 12px;
	    line-height: 1.5;
	    border-radius: 3px;
	}
	.save:hover{
		background-color: #e6e6e6;
	}
	.taohong{
	    color: #fff;
	    background-color: #3071a9;
	    border-color: #285e8e;
		padding: 5px 10px;
	    font-size: 12px;
	    line-height: 1.5;
	    border-radius: 3px;
	}
	.taohong:hover{
		 background-color: #285e8e;
	}
	strong{
	    font-size: 15px;
	    padding: 2px 5px 0;
	    color: #666;
	}
	.templatename{
		width:240px;
		height:30px;
	}
	.templatename option {font-size:14px;line-height:30px; font-family:宋体;}
	.templatename option:hover{background-color: #3071a9;}
	
	.imgRecognize{position: absolute;right:15px;top:20px;}
	#content .flow4{height:50px;}
</style>

	<script language="javascript" type="text/javascript">
	    function AfterDocumentOpened() {
	        //alert(document.getElementById("PDFCtrl1").Caption);
	    }
	    function SetBookmarks() {
	        document.getElementById("PDFCtrl1").BookmarksVisible = !document.getElementById("PDFCtrl1").BookmarksVisible;
	    }
	    
	    function Print() {
	        document.getElementById("PDFCtrl1").ShowDialog(4);
	    }
	    function SwitchFullScreen() {
	        document.getElementById("PDFCtrl1").FullScreen = !document.getElementById("PDFCtrl1").FullScreen;
	    }
	    function SetPageReal() {
	        document.getElementById("PDFCtrl1").SetPageFit(1);
	    }
	    function SetPageFit() {
	        document.getElementById("PDFCtrl1").SetPageFit(2);
	    }
	    function SetPageWidth() {
	        document.getElementById("PDFCtrl1").SetPageFit(3);
	    }
	    function ZoomIn() {
	        document.getElementById("PDFCtrl1").ZoomIn();
	    }
	    function ZoomOut() {
	        document.getElementById("PDFCtrl1").ZoomOut();
	    }
	    function FirstPage() {
	        document.getElementById("PDFCtrl1").GoToFirstPage();
	    }
	    function PreviousPage() {
	        document.getElementById("PDFCtrl1").GoToPreviousPage();
	    }
	    function NextPage() {
	        document.getElementById("PDFCtrl1").GoToNextPage();
	    }
	    function LastPage() {
	        document.getElementById("PDFCtrl1").GoToLastPage();
	    }
	    function RotateRight() {
	        document.getElementById("PDFCtrl1").RotateRight();
	    }
	    function RotateLeft() {
	        document.getElementById("PDFCtrl1").RotateLeft();
	    }
	</script>
	
    <script type="text/javascript">
        function Save() {
            document.getElementById("PageOfficeCtrl1").WebSave();
        }
        function ShowDefineDataRegions() {
            //document.getElementById("PageOfficeCtrl1").ShowHtmlModelessDialog("DataRegionDlg.htm", "parameter=xx", "left=300px;top=390px;width=520px;height=410px;frame:no;");
            var url = "DataRegionDlg.htm"; 
			var xmlHttpRequest = createXmlHttpRequest(); 
			xmlHttpRequest.onreadystatechange = callBack; 
			xmlHttpRequest.open("POST",url,true); 
			xmlHttpRequest.send(null); 
        }
        
        function createXmlHttpRequest(){ 
			if(window.ActiveXObject){ //如果是IE浏览器 
				return new ActiveXObject("Microsoft.XMLHTTP"); 
			}else if(window.XMLHttpRequest){ //非IE浏览器 
				return new XMLHttpRequest(); 
			} 
		}
        
        function callBack(){
			//if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200){ 
			//var response = xmlHttpRequest.responseText; 
			//document.getElementById("PageOfficeCtrl1").innerHtml = response;

			//} 
			console.log(xmlHttpRequest);
			
			
		} 
        
      //套红
    	function taoHong() {
    	  	var filecode='<%=filecode%>';
    	  	var reddoctype='<%=reddoctype%>';
    		var mb = document.getElementById("templateName").value;
    		document.getElementById("form1").action = "fileReview.jsp?mbfilecode=" + mb+"&filecode="+filecode+"&reddoctype="+reddoctype;
    		document.forms[0].submit();
    	}
        
        //保存并关闭
    	function saveAndClose() {
    		document.getElementById("PageOfficeCtrl1").WebSave();
    		//location.href = "index.jsp";
    	}
    	
    </script>
</head>
<body>
		<div id="content" style="width:100%; height:580px;overflow:hidden;float:left;">
			<div id="textcontent" style="width:100%;height: 1200px;float:left;">
				<div class="flow4">
					<form method="post" id="form1">
						<strong>模板列表：</strong>
						<span style="color: Red;">
						<select name="templateName" id="templateName" class="templatename">
								<option value='temp2008.doc' selected="selected">
									模板一
								</option>
								<option value='temp2009.doc'>
									模板二
								</option>
								<option value='temp2010.doc'>
									模板三
								</option>
							</select> 
						</span>
						<span style="color: Red;width:80px;"><a onclick="taoHong()" class="taohong btn btn-sm">一键套红</a></span>
						<span style="color: Red;"><a class="save btn btn-sm" onclick="saveAndClose()">保存</a></span>
						
						<span class="imgRecognize"><a class="btn btn-sm">切换到图文识别</a></span>
					</form>
				</div>
				<!--**************   卓正 PageOffice组件 ************************-->
				<% if("pdf".equals( filetype )){
				%>
					<po:PDFCtrl id="PDFCtrl1" />
				<%
				}else{
				%>
					<po:PageOfficeCtrl id="PageOfficeCtrl1" />
				<%
				}
				%>
			</div>
		</div>
		 
</body>
</html>