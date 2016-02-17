define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     require("mCustomScrollbar");
     require("scroll");
     require("jqueryform");
     var qcodeSetting = require("qcodeSetting");
     Dialog = require("dialog");
     
     var countNo = 1;
     
     //文档目录
     exports.documentsFunc=function(){
    	mdboss.fillPage(require("text!template/page/oa/documents/index.html"));
		new mdboss.View.documentsView();
     };
     
     mdboss.View.documentsView = Backbone.View.extend({
         el: '#rightMainContainer',
         initialize:function(){
        	 this.pageNo=1;
        	 this.pageSize=10;
        	 this.nodeId= "";
        	 this.module_list_html=$("#module-list-template").html();
        	 this.orderBy="";
        	 this.folderCode ="";
        	 this.baseUrl =baseConfig.base;
        	 this.render();
         },
         events: {
        	 'click #newGroup':'newGroup',//创建新目录
        	 'click #check-all-module':'checkall',//全选
        	 'click #module-del':'batchdel',//批量删除
        	 'click #module-add':'moduleadd',//新增
        	 'click #module-batch':'modulebatch',//批量修改
        	 'click #module-export':'dataexport',//导出
        	 'click .js_module_edit':'dataedit',////修改
        	 "click .js_module_view":"dataview",
        	 'click .js_module_del':"datadel",
        	 'click #module-flow-list li span.js-check-box i':'checkbox',//checkobx 选中取消
        	 'click .js_sort':'sorting',//排序 
        	 "click .js_document-qcode":"qcodeSetting",//二维码设置	
        	 "click .js_document-move":"documentmove",//文件移动
        	 "click .js_document-download":"qcodeDownload",//下载
        	 "click #document-create":"uploadView",//下载
        	  "keyup #document-keywords":"searchFile" ,//文件搜索
         },
         searchFile:function(e){
        	if(e.which == 13){
	   			 this.pageNo = 1;
	   			 this.renderData();
   		 	}
         },
         newGroup:function(){
        	 var v_this = this;
        	//新增节点
        	 var folderName = "新建文件夹" + (countNo++);
        	 var reqData ={"parentcode":"-1", "foldercode": "foldercode-"+mdboss.getuuid(),"foldername":folderName, "folderpath":"/"+folderName};
        	 reqData.createtime = mdboss.getDate();
			 reqData.creator = mdboss.usercode;
        	 mdboss.reqsubmit(reqData, mdboss.api.folderadd, function(m, res){
        		 if(res.rc==1){
			    		mdboss.notifyTips("新建目录成功！");
			    		v_this.leftDirDataLoad();
				 	}else{
				 		mdboss.error(res.msg);
				 	}
        	 });
         },
         documentmove:function(e){//文件移动
        	 var filecode = $(e.currentTarget).data("code");
        	 _this=this;
        	 var dept_arr=new Array();
 	        seajs.use("dirselect", function () {
 	        	new mdboss.View.moduleselectView({dept:dept_arr,parent:_this.$el,"callback":_this.movecallback,"pview":_this,"filecode":filecode});
 	        });
         },
         qcodeDownload:function(e){
        	 var t=this;
        	 var filecode=$(e.currentTarget).data("code");
        	 window.open (t.baseUrl+'download?filecode='+filecode, "newwindow");
         },
         movecallback:function(treeNode, parent, pview, filecode){ ////文件移动回调 
        	 //移动
        	 var reqData = {"tid":filecode , "foldercode": treeNode.id}; 
        	 mdboss.reqsubmit(reqData, mdboss.api.folderfileedit, function(m, res){
        		 if(res.rc == 1){
        			 mdboss.alert("移动成功!");
        			 pview.renderData();
//        			 Backbone.history.loadUrl();
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 });
        	
         },
         qcodeSetting:function(e){
        	 var filecode = $(e.currentTarget).data("code"); 
        	 var qrType=$.trim($(e.currentTarget).html());
        	 qcodeSetting.qcodeSetting({"renderData":v_this.renderDataBack,"pview":this,"filecode":filecode,"qrType":qrType});
         },
         sorting:function(e){
        	this.orderBy = mdboss.sorting(e, this.orderBy);
        	this.pageNo =1;
        	this.renderData();
         },
         modulebatch:function(){//指修改
        	 var tids = this.getTids();
        	 if(tids.length >0){
        		 var v_this = this;
        		 meetingedit.meetingeditFunc({"tids":tids,"title":"batch","renderData":v_this.renderDataBack,"pview":v_this});
        	 }else{
        		 mdboss.error("请选择要修改的记录！");
        	 }
         },
         datadel:function(e){ //删除单行记录
        	 var v_this = this;
        	 var tid=$(e.currentTarget).data("tid"); 
        	 var commonModel=new mdboss.Model.commonModel();
        	 mdboss.confirm("确定要删除吗？",function(c){
        		 if(c){
        			 commonModel.save({"usercode":mdboss.usercode,"tid":tid},
        					 {url:mdboss.api.meetingdelete,success:function(model,res){
             		 	if(res.rc==1){
             		 		mdboss.notifyTips("删除成功！");
             		 		v_this.renderData();
             		 	}else{
             		 		mdboss.error(res.msg);
             		 	}
             	 },error:function(){
             		 mdboss.error();
             	 }});
        	  }
        	});
         },
         dataview:function(e){//查看详情
// 			var v_this = this;
        	var tid=$(e.currentTarget).data("tid"); 
        	$(e.currentTarget).closest("li").addClass("selected");//
        	meetingedit.meetingeditFunc({"tid":tid, "title":"view","view":true});
//        	 
         },
         moduleadd:function(){//新增 
        	 var v_this = this;
        	 meetingedit.meetingeditFunc({"title":"add","renderData":v_this.renderDataBack,"pview":v_this});
         },
         dataedit:function(e){//新增修改记录  
        	var v_this = this;
        	var tid=$(e.currentTarget).data("tid"); 
        	$(e.currentTarget).closest("li").addClass("selected");//
        	meetingedit.meetingeditFunc({"tid":tid,"title":"edit","renderData":v_this.renderDataBack,"pview":v_this});
         },
         renderDataBack:function(pview){
        	 pview.renderData();
         },
         dataexport:function(){
        	v_this=this;
        	seajs.use("sign_export", function () {
        		new mdboss.View.signExport({condition:v_this.condition});
        	 });
         },
         getTids:function(){
        	 var tids=new Array();
        	 $("#module-flow-list").find("li  i.icon-checkbox-checked").each(function(index,item){
        		 tids.push($(item).data("id"));
        	 });
        	 return tids;
         },
         batchupdate:function(){//
        	 var tids=v_this.getTids();
        	 if(tids.length==0){
        		 mdboss.notifyTips("请选择批量修改的记录！");
        		 return false;
        	 }else{
        		 seajs.use("demobatchedit", function () {
            		 new  mdboss.View.demobatchedit({"tids":tids});
            	 });
        	 }
         },
         checkbox:function(e){
        	 $_this=$(e.currentTarget);
         	$_checkbox=$("#module-flow-list li span.js-check-box");
         	if($_this.hasClass("icon-checkbox-checked")){
         		$_this.closest("li").removeClass("selected");
         		$_this.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
         		if($("#check-all-module").hasClass("icon-checkbox-checked")){
         			$("#check-all-module").addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
         		}
         	}else{
         		$_this.closest("li").addClass("selected");
         		$_this.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
         		if($_checkbox.find("i").length==$_checkbox.find("i.icon-checkbox-checked").length){
             		$("#check-all-module").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
             	}
         	} 
         },
         batchdel:function(e){//批量删除
        	 v_this=this;
        	 var delIds=v_this.getTids();
        	 if(delIds.length==0){
        		 mdboss.error("请选择批量删除的记录！");
        		 return false;
        	 }else{
        		 var commonModel=new mdboss.Model.commonModel();
            	 mdboss.confirm("确定要删除吗？",function(c){
            		 if(c){
            			 commonModel.save({"usercode":mdboss.usercode,"tids":delIds},
            					 {url:mdboss.api.meetingdeletebatch,success:function(model,res){
                    		 if(res.rc==1){
                    			 mdboss.notifyTips("删除成功！");
                    			 v_this.renderData();
                    		 }else{
                    			 mdboss.error(res.msg);
                    		 }
                    	 },error:function(){
                    		 mdboss.error();
                    	 }});
            		 }
            	 });
        	 }
         },
         checkall:function(e){
        	 e.preventDefault();
        	 $this= $("#check-all-module");
        	 $this.toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
        	 var $li = $("#module-flow-list").find("li");
             var $i = $("#module-flow-list").find("li  i");
             if($this.hasClass("icon-checkbox-checked")){
            	 $i.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	 $li.addClass("selected");
             }else{
            	 $li.removeClass("selected");
            	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
             }
         },
         render:function(){
        	 //加载左侧目录 
        	 this.leftDirDataLoad();
        	 setTimeout(function(){
        		 $("#dirTreeDemo_1_a").click();//初始化选择目录的第一个文件夹
        	 },500);
         },
         leftDirDataLoad:function(){// 
        	 var d_this = this;
        	 mdboss.reqsubmit({}, mdboss.api.folderlist, function(m, res){
        		 if(res.rc == 1){
        			 d_this.nodeId = res.data.rows[0].foldercode;
        			 d_this.renderData( );
        			 d_this.leftDirLoad(res.data.rows);
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 });
         },
         //目录 操作
         beforeDrag :function(treeId, treeNodes) {
 			return true;
 		 },
         beforeDrop: function (treeId, treeNodes, targetNode, moveType, isCopy) {
 			return true;
 		},
        onDrag : function (event, treeId, treeNodes) {
 		},
 		onDrop: function(event, treeId, treeNodes, targetNode, moveType, isCopy) {
 			var parentcode = "-1";
 			var folercode = "";
 			var tid = "";
 			var folderpath = "";
 			if(targetNode){
 				parentcode = targetNode.id;
 				folderpath = targetNode.fpath;
 			}
 			for (var i=0,l=treeNodes.length; i<l; i++) {
 				if(i==0){
 					folercode = treeNodes[i].id;
 					tid = treeNodes[i].tid;
 					folderpath = "/"+treeNodes[i].name;
 				}
 			}
 			var reqData = {"parentcode":parentcode, "folercode":folercode};
 			reqData.tid = tid; // 
 			reqData.folderpath = folderpath; //  
 			reqData.updatetime = mdboss.getDate();
			reqData.updator = mdboss.usercode;
			
 			
 			mdboss.reqsubmit(reqData, mdboss.api.folderedit, function(m , res){
 				if(res.rc == 1){
 					mdboss.alert("移动成功!");
 				}else{
 					mdboss.error(res.msg);
 				}
 			});
 		},
         
         beforeRemove:function(treeId,treeNode){//删除节点
        	 if(!treeNode.children||treeNode.children.length<=0){
        		 return confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
        	 }else{
        		 mdboss.alert("该目录存在子节点，不能删除");
        		 return false;
        	 }
         },
         onRemove:function(e,treeId,treeNode){
        	 //删除节点
			 mdboss.reqsubmit({"tid":treeNode.tid}, mdboss.api.folderdelete , function(m, res){
			    	if(res.rc==1){
			    		mdboss.notifyTips("删除成功！");
				 	}else{
				 		mdboss.error(res.msg);
				 	}
			 });
         },
         beforeRename:function(treeId,treeNode,newName){//重命名结点
         },
         onRename:function(e, treeId, treeNode){ //重命名
        	 v_this = this;
			 var reqData = {"tid":treeNode.tid, "foldername":treeNode.name};
			 
			 if(treeNode.tid){//有tid编辑
				 reqData.updatetime = mdboss.getDate();
				 reqData.updator = mdboss.usercode;
				 mdboss.reqsubmit(reqData , mdboss.api.folderedit , function(m, res){
					 if(res.rc==1){
						 mdboss.notifyTips("编辑成功！");
					 }else{
						 mdboss.error(res.msg);
					 }
				 });
				 
			 }else{//添加 
				 
				 var reqData = {"foldercode":treeNode.id,"foldername":treeNode.name,
						 "parentcode":treeNode.pId,"folderpath":treeNode.fpath+"/"+treeNode.name};
					reqData.createtime = mdboss.getDate();
					reqData.creator = mdboss.usercode;
					mdboss.reqsubmit(reqData, mdboss.api.folderadd, function(m,res){
						if(res.rc==1){
				    		mdboss.alert("新建成功！");
				    		Backbone.history.loadUrl(); // TODO
					 	}else{
					 		mdboss.error(res.msg);
					 	}
					});
			 }
			 
         },
         addHoverDom:function(treeId, treeNode) {
//        	 var v_this = this;
			var sObj = $("#" + treeNode.tId + "_span");
			if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
			var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
				+ "' title='add node' onfocus='this.blur();'></span>";
			sObj.after(addStr);
			var btn = $("#addBtn_"+treeNode.tId);
			if (btn) btn.bind("click", function(){
				
				//新增节点
				var parentcode = treeNode.id;
				var foldercode = "folder-"+mdboss.getuuid();
				var fileName = "新建目录"+ (countNo++);
				var folderpath = treeNode.fpath ;
				
				var zTree = $.fn.zTree.getZTreeObj("dirTreeDemo");
				zTree.addNodes(treeNode, {id:foldercode, pId:parentcode, name:fileName,"fpath": folderpath});
				var length = treeNode.children.length;
				zTree.editName(treeNode.children[length-1]);//处理编辑状态
				return false;
			});
		},
         removeHoverDom:function(treeId, treeNode) {
 			$("#addBtn_"+treeNode.tId).unbind().remove();
 		},
 		showRemoveBtn:function(treeId, treeNode) {
 			return true;
		},
		showRenameBtn:function(treeId, treeNode){
			return true;
		},
		beforeEditName:function(treeId, treeNode) {
		},
         //目录 操作
         leftDirLoad:function(dirList){//加载目录结构  // 
        	 var d_this = this;
        	 var setting = {
        			 view :{  
            			addHoverDom: d_this.addHoverDom,
      					removeHoverDom: d_this.removeHoverDom,
      					selectedMulti: false,
            	     }  ,
        			 edit:{
        				 enable:true,
        				 editNameSelectAll: true,
        				 removeTitle:'删除',
        	             renameTitle:'重命名',
    					showRemoveBtn: d_this.showRemoveBtn,
    					showRenameBtn: d_this.showRenameBtn
        			 },
           			data: {
        				simpleData: { enable: true }
        			},
           			callback:{
           				beforeClick:function(treeId,treeNode){
           	        	 //console.log("click="+treeNode.id);
           	        	 d_this.pageNo = 1;
           	        	 d_this.nodeId = treeNode.id;
           	        	 d_this.renderData();
           	         },
           				beforeDrag: d_this.beforeDrag,
           				onDrag: d_this.onDrag,
           				beforeDrop: d_this.beforeDrop,
           				onDrop: d_this.onDrop,
           				beforeEditName: d_this.beforeEditName,
        				beforeRemove: d_this.beforeRemove,
        				onRemove: d_this.onRemove,
        				beforeRename:d_this.beforeRename,
        				onRename:d_this.onRename
           			},
           			
           			
           		};
              var zNodes=new Array();
              if(dirList){
             		$.each(dirList,function(index,item){
             			countNo ++;
              			if(item.parentcode =="-1"){
              				zNodes.push({"id":item.foldercode,"pId":item.parentcode,"name":item.foldername,"fpath":item.folderpath,"tid":item.id,"open":true});
              			}else{
              				zNodes.push({"id":item.foldercode,"pId":item.parentcode,"name":item.foldername,"fpath":item.folderpath, "tid":item.id});
              			}
                  	});
              }
               $.fn.zTree.init($("#dirTreeDemo"), setting, zNodes);
               $("#dirTreeDemo").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false });  
         },
         renderData:function(){//渲染列表
        	 v_this=this;
        	 $("#check-all-module").removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
        	 var commonModel=new mdboss.Model.commonModel();        	 
        	 //查询条件
        	 var tmpCondition = new Array();
	             
	         if(this.modulename){
	            tmpCondition.push({"key":"filename", "operate":"Like","v1": v_this.$el.find("#document-keywords").val()});
	         }
	           
	            //目录
	         if(this.nodeId){
	            tmpCondition.push({"key":"foldercode", "operate":"EqualTo","v1": this.nodeId});
	         }

	         v_this.condition = tmpCondition;
        	 $("#submit-loading").show();
        	 $("#module-flow-list").mCustomScrollbar("destroy");
             commonModel.save({ "usercode":mdboss.usercode,"pageNo":this.pageNo, "pageSize":v_this.pageSize,    // 每页10条记录
     			"queryCondition": v_this.condition,"orderBy":this.orderBy},{url:mdboss.api.folderfilelist,success:function(model,res){
     				$("#submit-loading").hide();
     				if(res.rc == 1){
     	            	 var listTemplate = Handlebars.compile(v_this.module_list_html);
     	            	 var listHtml=listTemplate({data:res.data});
     	            	 v_this.$el.find("#module-flow-list").html(listHtml);
     	            	 
 	            		 $("#module-flow-list").mCustomScrollbar({scrollButtons:{
 	    					enable:false }, theme: "darkblue",horizontalScroll:false,
 	            		 });

     	            	 v_this.totalPage =parseInt((res.data.total+mdboss.pageSize-1)/v_this.pageSize);
     	            	 $("#module_pagination").bs_pagination({ totalPages:v_this.totalPage,currentPage:v_this.pageNo,
     	            		rowsPerPage:v_this.pageSize,
     	            		onChangePage: function(event, data) {
     	            			v_this.pageNo = data.currentPage;
     	            			v_this.pageSize = data.rowsPerPage;
     	            			v_this.renderData();
	             			},
	             			totalRows:res.data.total,
	             			showGoToPage: true,
	        				showRowsPerPage : true,
	        				showRowsInfo : true,
	        				showRowsDefaultInfo : true,
     	            	 });
     				}else{
     					mdboss.error(res.msg);
     				}
     			},error:function(){
     				$("#submit-loading").hide();
     				mdboss.error();
     			}});
         },
         uploadView:function(){
        	 new mdboss.View.uploadView({"parent":this,"render":this.renderDataBack});
         }
          
     });
     
     //上传文档弹窗界面
     mdboss.View.uploadView = Backbone.View.extend({
    	 el:'.page-m',
 		 initialize : function(data) {
 			var t=this;
 			t.rdata = data;
 			this.uploadView=new Dialog({
                type: "html",  value: '<div class="loading"></div>', 
                fillCallback:function(){
               	 $(t.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true}); 
                }
            }, {"title":"上传文档界面" ,
           	 "width":"700px",
           	 "height":"400px",
           	 "icon":"iconfont icon-mdliucheng",
           	 full:false, 
           	 layer:true,
           	 btns: ['min','max','close'],
           	 "resize":function(){
           		 
                }
                }).show(function(){
               	 var listTemplate = Handlebars.compile($("#uploadFileView-template").html());
               	 $("#dialogTree").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false });  
               	 this.$html.find(".dialog-content").html(listTemplate);
               	 $("#userCodeDir").val(mdboss.usercode);
                }); 
 			this.$el = this.uploadView.$html; 
	 		},
	 		events:{
	        	"change .js_file_upload":"fileUpload",//上传文档
	        	"click #selectFolder":"selectFolder",//选择目录
	        	"click #uploadFormSubmit":"uploadFormSubmit",//提交
        		"click #uploadFormCancel":"uploadFormCancel"//提交	
	 		},
	        fileUpload:function(e){
	        	 var allowExtention = ".png,.jpg,.jpeg,.pdf,.tif";
	 	    	 var $target = $(e.currentTarget);
			     var filepath= $target.val();
			     var ext=filepath.substring(filepath.lastIndexOf(".")).toLowerCase();
			     if(allowExtention.indexOf(ext)==-1){
					 mdboss.error("上传的文件格式不正确，只能为png、jpg、jpeg、pdf");
					 return;
			     }			     
	     
			     this.filename=filepath.substring(filepath.lastIndexOf("\\")+1);
			     
			     $target.closest(".controls").find("#pick_ipt").append(this.filename);

			     var elementId = "file_upload";
			     if($target.data("attach")){
					 this.elementId = "attachfile_upload";
			     }
	         },
	         selectFolder:function(e){
	        	 var t=this;
	        	 t.FolderView=new Dialog({
	                 type: "html",  value: '<div class="loading"></div>', 
	                 fillCallback:function(){
	                	 $(t.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true}); 
	                 }
	             }, {"title":"选择目录" ,
	            	 "width":"300px",
	            	 "height":"300px", 
	            	 "icon":"iconfont icon-mdliucheng",
	            	 full:false, 
	            	 layer:true,
	            	 btns: ['min','max','close'],
	            	 "resize":function(){
	            		 
	                 }
	                 }).show(function(){
	                	 $dialog=this;
	                	 console.log(this);
	                	 var listTemplate = Handlebars.compile($("#selectFolder-template").html());
	                	 this.$html.find(".dialog-content").html(listTemplate);
	                	 
	                	 mdboss.reqsubmit({}, mdboss.api.folderlist, function(m, res){
	                		 if(res.rc == 1){
	                			 t.nodeId = res.data.rows[0].foldercode;
	                			 t.folderLoad(res.data.rows,$dialog);
	                			 
	                		 }else{
	                			 mdboss.error(res.msg);
	                		 }
	                	 });
	
	                 }); 
	         },
	         folderLoad:function(dirList,dialog){//加载目录
	        	 var t=this;
	        	 var setting = {
	           			data: {
	        				simpleData: { enable: true }
	        			},
	           			callback:{
	           				beforeClick:function(treeId,treeNode){
	           					console.log(treeNode);
	           					t.pageNo = 1;
	           					t.nodeId = treeNode.id;
	           					$("#selectFolder").html(treeNode.name).attr("foldercode",treeNode.id);
	           					$("#folderCodeDir").val(treeNode.id);
	           					dialog.close();
	           	            }
	           			},
	           			
	           		};
	              var zNodes=new Array();
	              if(dirList){
	             		$.each(dirList,function(index,item){
	              			if(item.parentcode =="-1"){
	              				zNodes.push({"id":item.foldercode,"pId":item.parentcode,"name":item.foldername,"open":true});
	              			}else{
	              				zNodes.push({"id":item.foldercode,"pId":item.parentcode,"name":item.foldername});
	              			}
	                  	});
	              }
	               $.fn.zTree.init($("#dialogTree"), setting, zNodes);
	               $("#dialogTree").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false });
	         },
	         uploadFormSubmit:function(e){//文件上传
	        	    var q_this = this;  
	        	    
	        	    var foldercode=$(e.currentTarget).closest(".uploadFileView").find("#selectFolder").attr("foldercode");
	        	    var filedesc=$(e.currentTarget).closest(".uploadFileView").find("#filedesc").val();
	        	    
	        	    if(!foldercode||foldercode==''){
	        	    	mdboss.notifyTips("请选择文件目录");
	        	    	return;
	        	    }
	        	    
	        	    var params={
	        	    	foldercode:$("#folderCodeDir").val(),
	        	    	filedesc:filedesc,
	        	    	usercode:mdboss.usercode
	        	    };
	        	    
	    		    //上传文件
		            $.ajaxFileUpload({
		                url: mdboss.api.fileuploadCommon,//处理图片脚本  
		                secureuri :false,
		                urlparam:false,
		                data:params,
		                fileElementId :q_this.elementId,//file控件id
		                dataType : 'multipart/form-data',
		                success : function (data, status){
		                	q_this.uploadFormCancel();
		                    if(data != 'undefined'){
			                   var start=data.indexOf(">");
			                   var end=data.lastIndexOf("<");
			                   var json=eval('(' + data.substring(start+1,end)+ ')');
			                   if(json!=undefined){
			                	   console.log(json);
			                	   params.filecode = json.id;
//			                	   params.fileid = json.id;
//			                	   params.createtime = mdboss.getDate();
//			                	   params.creator = mdboss.usercode;
			                	   
			                	   
			                	   if(json.length!=undefined){
			                		    //多个文件上传  --得修改  支持批量提交  TODO
		                      			 $(json).each(function(index,item){
		                      				 params.filecode = item.id;
		                      				 mdboss.reqsubmit(params, mdboss.api.folderfileadd, function(m, res){
						                		   if(res.rc ==1){
						                		   }else{
						                			   mdboss.error(res.msg);
						                		   }
						                	   });
		                                	});
		                      			 	// 成功处理
		                      			   if(index == (json.length-1)){
		                      				   mdboss.alert("文件成功！");
		                      				   var callback = q_this.rdata.render;
		                      				   var callbackFn = typeof callback == "function" ? callback : function () { };
		                      				   callbackFn(q_this.rdata.parent);
		                      			   }
		                      			 
		  	                         }else{
		  	                        	 params.filecode = json.id;
		  	                        	 mdboss.reqsubmit(params, mdboss.api.folderfileadd, function(m, res){
					                		   if(res.rc ==1){
					                			   mdboss.alert("文件成功！");
//							                	   Backbone.history.loadUrl(); //
							                	   var callback = q_this.rdata.render;
							                	   var callbackFn = typeof callback == "function" ? callback : function () { };
							  					   callbackFn(q_this.rdata.parent);
					                		   }else{
					                			   mdboss.error(res.msg);
					                		   }
					                	   });
		  	                         }//
			                	   
			                	   
			                	  
		                       }else{
		                      		mdboss.alert("文件上传失败！");
		                       }
		                    }
		               },
		               error: function(data, status, e){
		             	   mdboss.error(e);
		               }
		            });
	         },
	         uploadFormCancel:function(e){
	        	 this.uploadView.close();
	         }
	         
	        
	 });
     
});