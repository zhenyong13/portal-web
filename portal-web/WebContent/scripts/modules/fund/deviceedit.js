define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.deviceeditFunc=function(data){
		new mdboss.View.deviceedit(data);
     };
     
	
     mdboss.View.deviceedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 //传入的参数
        	 _this.rdata=data;
        	 _this.ueditor=null;
        	 this.filecode="";
        	 this.uED=null;
        	 //标题
        	 if(data.title == "add"){
        		 this.title="新增设备";
        		 this.height = "360px";
        	 }else if(data.title == "edit"){
        		 this.title="编辑设备";
        		 this.height = "370px";
        	 }else if(data.title == "view"){
        		 this.title="设备详情";
        		 this.height = "400px";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改设备";
        		 this.height="300px";
        	 }else{
        		 this.title="";
        		 this.height="230px";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/fund/device/view.html");
        	 this.edit_html = require("text!template/page/fund/device/edit.html");
        	 this.batchedit_html=require("text!template/page/fund/device/batchedit.html");
        	 
        	 _this.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){ $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});   }
             }, {"title":_this.title ,"width":"900px","height":_this.height,"icon":"iconfont icon-mdliucheng",
            	 full:false, layer:true,btns: ['min','max','close'],
            	 "resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.rdata.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "deviceview", "post" : { "usercode":mdboss.usercode, "tid":_this.rdata.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["deviceview"];
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
                 		 			_this.dataselect(resData.devicetype, resData.isenabled);
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
	           		 		 _this.dataselect();
        		 		 }else{
        		 			 template=Handlebars.compile(_this.edit_html);
        		 			 
        		 			var html=template({"creator":mdboss.getUserinfo().username, "createtime":mdboss.getDate()});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 _this.dataselect();
        		 			 $( "#module_form" ).validVal();
        		 		 }
        		 		 // 
                	}
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dataselect:function(devicetype, isenabled){//下拉列表数据获取
        	 mdboss.dataselect(this, "devicetype", "CM_DEVICETYPE",devicetype);
        	 mdboss.dataselect(this, "isenabled", "COMMON_STATE",isenabled);
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
         	 pview.$el.find("#devicemanager").val(usercode);
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
	        	 var devicetype=_this.$el.find("#devicetype").val();
	        	 var devicename=_this.$el.find("#devicename").val();
	        	 var unit=_this.$el.find("#unit").val();
	        	 var isenabled=_this.$el.find("#isenabled").val();
	        	 var devicecode=_this.$el.find("#devicecode").val();
	        	 var model=_this.$el.find("#model").val();
	        	 var brand=_this.$el.find("#brand").val();
	        	 
	        	 if(devicename);else devicename= null; //
	        	 if(devicetype);else devicetype= null; //
	        	 if(devicecode);else devicecode= null; //
	        	 if(isenabled);else isenabled= null; //
	        	 if(storagenum);else storagenum= null; //
	        	 if(unit);else unit= null; //
	        	 if(model);else model= null; //
	        	 if(brand);else brand= null; //
	        	 
	        	 var callback = _this.rdata.renderData;
	        	 var req = {};
	        	 if(tids){
	        		 req.usercode= mdboss.usercode;
	        	 }else{
	        		 req={"usercode":mdboss.usercode, "devicename":devicename, "devicetype":devicetype, "model":model,"brand":brand,
	        				 "storagenum":storagenum,"isenabled":isenabled,
	        				 "unit": unit,"devicecode": devicecode, };
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.deviceadd;
	        	 if(tid){
	        		 url =mdboss.api.deviceedit;
	        		 req.tid = tid;
	        	 }else{
//	        		 req.creator = mdboss.usercode;
//    				 req.createtime = mdboss.getDate();
	        	 }
	        	 if(tids){
	        		 req.tids = tids;
	        		 url =mdboss.api.devicebatchedit;
	        		 if(devicetype){
	        			 req.devicetype = devicetype;
	        		 }
	        		 if(isenabled){
	        			 req.isenabled = isenabled;
	        		 }
	        		 if(brand)
	        			 req.brand = brand;
	        		 if(unit)
	        			 req.unit = unit;
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