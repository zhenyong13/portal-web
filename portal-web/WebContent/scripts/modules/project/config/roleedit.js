define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.projectroleeditFunc=function(data){
		new mdboss.View.projectroleedit(data);
     };
     
	
     mdboss.View.projectroleedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 //传入的参数
        	 _this.rdata=data;
        	 _this.ueditor=null;
        	 this.filecode="";
        	 //标题
        	 if(data.title == "add"){
        		 this.title="新增项目角色";
        		 this.height = "250px";
        	 }else if(data.title == "edit"){
        		 this.title="编辑项目角色";
        		 this.height = "280px";
        	 }else if(data.title == "view"){
        		 this.title="项目角色详情";
        		 this.height = "400px";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改项目角色";
        		 this.height="200px";
        	 }else{
        		 this.title="";
        		 this.height="230px";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/project/config/role/view.html");
        	 this.edit_html = require("text!template/page/project/config/role/edit.html");
        	 this.batchedit_html=require("text!template/page/project/config/role/batchedit.html");
        	 
        	 _this.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){ $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});   }
             }, {"title":_this.title ,"width":"600px","height":_this.height,"icon":"iconfont icon-mdliucheng",
            	 full:false, layer:true,btns: ['min','max','close'],
            	 "resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.rdata.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "projectroleview", "post" : { "usercode":mdboss.usercode, "tid":_this.rdata.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["projectroleview"];
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
                 		 			_this.dataselect(resData.roletype, resData.status);
                 		 			_this.$el.find( "#module_form_role" ).validVal();
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
        		 			 $( "#module_form_role" ).validVal();
        		 		 }
        		 		 // 
                	}
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dataselect:function(roletype,  status){//下拉列表数据获取
        	 mdboss.dataselect(this, "roletype", "PM_PROJECROLE",roletype);
        	 mdboss.dataselect(this, "status", "COMMON_STATE",status);
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
         },
         submit:function(e){//提交
        	 
        	 _this=this;
        	 var tids = _this.rdata.tids;
        	 var form_data = true;
    		 if(tids){
    		 }else{
    			 form_data = _this.$el.find( "#module_form_role" ).triggerHandler( "submitForm" );
    		 }
 	         if ( form_data ) {
	        	 var tid=_this.$el.find("#tid").val();
	        	 var rolecode=_this.$el.find("#rolecode").val();
	        	 var rolename=_this.$el.find("#rolename").val();
	        	 var roletype=_this.$el.find("#roletype").val();
	        	 var status=_this.$el.find("#status").val();
	        	 var roledesc=_this.$el.find("#roledesc").val();
	        	 
	        	 if(rolecode);else rolecode= null; //
	        	 if(rolename);else rolename= null; //
	        	 if(roletype);else roletype= null; //
	        	 if(status);else status= null; //
	        	 if(roledesc);else roledesc= null; //
	        	 //, "roledesc":roledesc 
	        	 var callback = _this.rdata.renderData;
	        	 var req = {};
	        	 if(tids){
	        		 req.usercode= mdboss.usercode;
	        	 }else{
	        		 req={"usercode":mdboss.usercode,"rolecode":rolecode, "rolename":rolename, "roletype":roletype,"status":status };
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.projectroleadd;
	        	 if(tid){
	        		 url =mdboss.api.projectroleedit;
	        		 req.tid = tid;
	        	 }else{
	        		 req.creator = mdboss.usercode;
    				 req.createtime = mdboss.getDate();
	        	 }
	        	 if(tids){
	        		 req.tids = tids;
	        		 url =mdboss.api.projectrolebatchedit;
	        		 if(roletype)  req.roletype = roletype;
	        		 if(status)  req.status = status;
	        	 }
	        	 var commonModel=new mdboss.Model.commonModel();
				 commonModel.save(req, {url:url,success:function(model,res){
	        		 if(res.rc==1){
	        			 if(tid){
	        				 mdboss.notifyTips("修改成功！");
	        			 }else{
	        				 mdboss.notifyTips("新增成功！");
	        			 }
	        			 var callbackFn = null;
	        			 //回调刷新列表
	        			 if(callback){
	        				 callbackFn = typeof callback == "function" ? callback : function () { };
	        				 callbackFn(_this.rdata.pview);
	        				 _this.dialog.close();
	        			 }
	        			 
	        			 //添加项目角色
	        			 if(_this.rdata.ok){
	        				 callback = _this.rdata.ok;
	        				 callbackFn = typeof callback == "function" ? callback : function () { };
	        				 callbackFn(res.data);
	        				 _this.dialog.close();
	        			 }
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
        	 
        	 var callback = _this.rdata.cancel;//取消添加
			 callbackFn = typeof callback == "function" ? callback : function () { };
			 callbackFn();
        	 
        	 _this.dialog.close();
 		},
     });
});