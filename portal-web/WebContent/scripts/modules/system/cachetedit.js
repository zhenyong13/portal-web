define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.cacheteditFunc=function(data){
		new mdboss.View.cachetedit(data);
     };
     
	
     mdboss.View.cachetedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 //传入的参数
        	 _this.rdata=data;
        	 _this.ueditor=null;
        	 this.filecode="";
        	 this.uED=null;
        	 //标题
        	 this.width = "550px";
        	 if(data.title == "add"){
        		 this.title="新增公章";
        		 this.height = "360px";
        	 }else if(data.title == "edit"){
        		 this.title="编辑公章";
        		 this.height = "370px";
        	 }else if(data.title == "view"){
        		 this.title="公章详情";
        		 this.height = "280px";
        		 this.width = "900px";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改公章";
        		 this.height="300px";
        	 }else{
        		 this.title="";
        		 this.height="230px";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/system/cachet/view.html");
        	 this.edit_html = require("text!template/page/system/cachet/edit.html");
        	 this.batchedit_html=require("text!template/page/system/cachet/batchedit.html");
        	 
        	 _this.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){ $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});   }
             }, {"title":_this.title ,"width": _this.width,"height":_this.height,"icon":"iconfont icon-mdliucheng",
            	 full:false, layer:true,btns: ['min','max','close'],
            	 "resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.rdata.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "cachetview", "post" : { "usercode":mdboss.usercode, "tid":_this.rdata.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["cachetview"];
                 		 		if(_this.rdata.view){//详情
                 		 			var templateA=Handlebars.compile(_this.view_html);
                 		 			resData.baseurl=baseConfig.avatar_url;
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.edit_html);
                 		 			resData.baseurl=baseConfig.avatar_url;
                 		 			var html=template(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
//                 		 			_this.dataselect(resData.cachetmanager);
                 		 			$( "#module_form" ).validVal();
                 		 		}   
	                         } 
	                         else {
	                         	mdboss.error(msg);
	                         }
	                     });
                	 }else{//新增
                		 var template=null;
        		 		 if(_this.rdata.tids){//批量修改
        		 			 template=Handlebars.compile(_this.batchedit_html);
        		 			 var html=template({ });
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
//	           		 		 _this.dataselect();
        		 		 }else{
        		 			 template=Handlebars.compile(_this.edit_html);
        		 			 
        		 			var html=template({"creator":mdboss.getUserinfo().username, "createtime":mdboss.getDate()});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
//	           		 		 _this.dataselect();
        		 			 $( "#module_form" ).validVal();
        		 		 }
        		 		 // 
                	}
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dataselect:function(moduletype, status, level){//下拉列表数据获取
        	 mdboss.dataselect(this, "cachetmanager", "OA_ISSUETYPE",moduletype);
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_dept':'selected_dept',//选择部门
        	 "click .js_form_submit_":"batchUpdata",
        	 "click .js_form_cancel_":"jsformcancel",
        	 "focus #leader_man":'delegateMan',//搜索委托人
        	 "keyup #leader_man":'delegateManKey',//搜索委托人
        	 "click .js_file_view":"file_view",//文件查看 
        	 "change .js_fileupload_":'filecodeUpload',//文件上传上传
         },
         delegateManKey:function(e){//回车搜索
          	if(e.which ==13){
          		this.delegateMan(e);
          	}
          },
          delegateBack:function(pview, usercode, name){
         	 pview.$el.find("#cachetmanager").val(usercode);
          },
          delegateMan:function(e){
         	 mdboss.userselect(e, this, this.delegateBack);
          },
         filecodeUpload:function(e){
        	 var v_this = this;
        	 var $this  = $(e.currentTarget);
        	 var id = $this.attr("id");
        	 var dataid = $this.attr("data-id");
        	 var allowExtention = ".png,.gif,.jpg,jpeg";
			  var filepath=$("#"+id).val();
			  var ext=filepath.substring(filepath.lastIndexOf(".")).toLowerCase();
			  if(allowExtention.indexOf(ext)!=-1){
	        	 mdboss.fileupload(id, function(data){
	        		mdboss.alert("上传成功!");
	        		 if(data instanceof Array){
	        			 if(data && data.length){
		        			 $.each(data, function(i, item){
		        				 if(i == 0){
		        					 $("#"+dataid).val(item.id);
		        					 v_this.$el.find("#"+dataid+"img").attr("src", baseConfig.avatar_url+""+item.id);
		        					 return true;
		        				 }
		        			 });
		        		 }
	        		 }else{
	        			 $("#"+dataid).val(data.id);
    					 v_this.$el.find("#"+dataid+"img").attr("src", baseConfig.avatar_url+""+data.id);
	        		 }
	        		 
	        	 });
			  }else{
				  mdboss.error("上传文件类型不正确!");
			  }
         },
         selected_dept:function(){
        	 _this=this;
        	 var dept_arr=new Array();
 	         seajs.use("orgs", function () {
 	        	if(_this.$el.find("#parentcode").val() != ""){
 	        		dept_arr.push(_this.$el.find("#parentcode").val());
 	        	}
 	        	new mdboss.View.orgsView({dept:dept_arr,parent:_this.$el,"selectOnly":true,
 	        		"callbacks":_this.searchByOrg,"pview":_this,"title":"组织选择"});
 	        });
         },
         searchByOrg:function(treeNode, parent, pview){
        	 if(treeNode.id =="org--1"){
        		 parent.find("#parentcode").val("");
        		 parent.find("#parentname").val("");
        	 }else{
        		 parent.find("#parentcode").val(treeNode.id);
        		 parent.find("#parentname").val(treeNode.name);
        	 }
         },
         file_view:function(e){
         	var filecode=$(e.currentTarget).data("file-id");
         	seajs.use("review", function () {
         		new mdboss.View.fileReview({model:new mdboss.Model.commonModel( 
    	      			 {"filecode":filecode,"baseurl":baseConfig.base}
    	           )});
         	});
         },
         jsformcancel:function(e){
        	 _this=this;
        	 _this.dialog.close();
         },
         batchUpdata:function(e){
        	 _this=this;
        	 var tids = _this.rdata.tids;
    		 
        	 var req = {};
        	 req.usercode= mdboss.usercode;
        	 req.tids = tids;
        	 var isusetype=_this.$el.find("#isusetype").val();
        	 var status=_this.$el.find("#status").val();
        	 var isuselevel=_this.$el.find("#isuselevel").val();
        	 
        	 if(isusetype) req.issuetype = isusetype; 
        	 if(status) req.status = status; 
        	 if(isuselevel) req.issuelevel = isuselevel; 
        	 
        	 var callback = _this.rdata.renderData;
        	 var url = mdboss.api.modulebatchedit;
    		
        	 var commonModel=new mdboss.Model.commonModel();
			 commonModel.save(req, {url:url,success:function(model,res){
        		 if(res.rc==1){
        			 mdboss.notifyTips("修改成功！");
        			 var callbackFn = typeof callback == "function" ? callback : function () { };
        			 callbackFn(_this.rdata.pview); //回调刷新列表
        			 _this.jsformcancel();
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 },error:function(){
        		 mdboss.error();
        	 }});
         },
        
         submit:function(e){//提交
        	 _this=this;
        	 var tids = _this.rdata.tids;
        	 var form_data = true;
    		 if(tids){
    		 }else{
    			 form_data = $( "#module_form" ).triggerHandler( "submitForm" );
    		 }
 	         if ( form_data ) {
	        	 var tid=$("#tid").val();
	        	 var parentcode=_this.$el.find("#parentcode").val();
	        	 var cachetname=_this.$el.find("#cachetname").val();
	        	 var cachetmanager=_this.$el.find("#cachetmanager").val();
	        	 var cacheturl=_this.$el.find("#cacheturl").val();
	        	 var cachetcode=_this.$el.find("#cachetcode").val();
	        	 
	        	 
	        	 if(cachetname);else cachetname= null; //
	        	 if(cacheturl);else cacheturl= null; //
	        	 if(cachetcode);else cachetcode= null; //
	        	 if(cachetmanager);else cachetmanager= null; //
	        	 if(cacheturl);else cacheturl= null; //
	        	 
	        	 var callback = _this.rdata.renderData;
	        	 var req = {};
	        	 if(tids){
	        		 req.usercode= mdboss.usercode;
	        	 }else{
	        		 req={"usercode":mdboss.usercode, "cachetname":cachetname, "cachetmanager":cachetmanager, "orgcode":parentcode,
	        				 "cacheturl": cacheturl,"cachetcode": cachetcode, };
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.cachetadd;
	        	 if(tid){
	        		 url =mdboss.api.cachetedit;
	        		 req.tid = tid;
	        		 var creator=_this.$el.find("#creator").val();
		        	 var createtime=_this.$el.find("#createtime").val();
		        	 if(creator);else creator= null; //
		        	 if(createtime);else createtime= null; //
		        	 req.creator = creator;
		        	 req.createtime = createtime;
	        	 }else{
	        		 req.creator = mdboss.usercode;
    				 req.createtime = mdboss.getDate();
	        	 }
	        	 if(tids){
	        		 req.tids = tids;
	        		 url =mdboss.api.cachetbatchedit;
	        		 if(cachetmanager){
	        			 req.cachetmanager = cachetmanager;
	        		 }
	        		 if(parentcode)
	        			 req.orgcode = parentcode;
	        	 }
	        	 var commonModel=new mdboss.Model.commonModel();
				 commonModel.save(req, {url:url,success:function(model,res){
	        		 if(res.rc==1){
	        			 if(tid){
	        				 mdboss.notifyTips("修改成功！");
	        			 }else{
	        				 mdboss.notifyTips("新增成功！");
	        			 }
	        			 //回调刷新列表
	        			 var callbackFn = typeof callback == "function" ? callback : function () { };
	        			 callbackFn(_this.rdata.pview);
	        			 _this.cancel();
	        		 }else{
	        			 mdboss.error(res.msg);
	        		 }
	        	 },error:function(){
	        		 mdboss.error();
	        	 }});
 	        }
         },
         cancel:function(){
        	 _this=this;
        	 _this.dialog.close();
 		},
     });
});