define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("mCustomScrollbar");
     require("datetimepicker");
     Dialog = require("dialog");
     
     //模块函数
     exports.memberseditFunc=function(data){
		new mdboss.View.membersedit(data);
     };
     
	
     mdboss.View.membersedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 //传入的参数
        	 _this.rdata=data;
        	 _this.ueditor=null;
        	 this.filecode="";
        	 //标题
        	 if(data.title == "add"){
        		 this.title="新增项目成员";
        		 this.height = "260px";
        	 }else if(data.title == "edit"){
        		 this.title="编辑项目成员";
        		 this.height = "300px";
        	 }else if(data.title == "view"){
        		 this.title="项目成员详情";
        		 this.height = "350px";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改项目成员";
        		 this.height="150px";
        	 }else{
        		 this.title="";
        		 this.height="230px";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/project/config/members/view.html");
        	 this.edit_html = require("text!template/page/project/config/members/edit.html");
        	 this.batchedit_html=require("text!template/page/project/config/members/batchedit.html");
        	 this.add_html=require("text!template/page/project/config/members/add.html");
        	 
        	 _this.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){ $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});   }
             }, {"title":_this.title ,"width":"800px","height":_this.height,"icon":"iconfont icon-mdliucheng",
            	 full:false, layer:true,btns: ['min','max','close'],
            	 "resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.rdata.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "membersview", "post" : { "usercode":mdboss.usercode, "tid":_this.rdata.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["membersview"];
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
                 		 			_this.dataselect(resData.status,resData.membertype);
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
        		 			 template=Handlebars.compile(_this.add_html);
        		 			 
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
         dataselect:function(status,membertype){//下拉列表数据获取
        	 mdboss.dataselect(this, "status", "COMMON_STATE",status);
        	 mdboss.dataselect(this, "membertype", "$PM_MEMBERTYPE",membertype);
        	 mdboss.dataselect(this, "rolecode", "#PM_PROJECTROLE",membertype);
        	 this.$el.find('.date').datetimepicker({
                 format: 'yyyy-mm-dd',
                 minView: 2,
                 autoclose: true,
                 todayBtn: true,
                 language: 'zh-CN',
                 startDate: '+0d'
             });
        	 /*  _this.$el.find('.datetime').datetimepicker({
	             format: 'yyyy-mm-dd hh:mm:ss',
	             minView: 1,
	             autoclose: true,
	             language: 'zh-CN',
	             startDate: '+0d'
	         }).on('changeDate', function(ev){
	         	$(this).focus().blur();//处理选择时间后，输入框边框还是红色问题
	         });*/
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
    			 form_data = $( "#module_form" ).triggerHandler( "submitForm" );
    		 }
 	         if ( form_data ) {
 	        	 var reqData={};
 	        	 var targetusercode=_this.$el.find("usercode").val();
	        	// var tid= 
	        		 mdboss.elementValue(_this,reqData, "tid") ; //_this.$el.find("tid").val();
	        	 var projectcode=mdboss.elementValue(_this,reqData, "projectcode") ;//_this.$el.find("projectcode").val();
	        	 var specialtycode=mdboss.elementValue(_this,reqData, "specialtycode") ;//_this.$el.find("specialtycode").val();
	        	 var rolecode=mdboss.elementValue(_this, reqData,"rolecode") ;//_this.$el.find("rolecode").val();
	        	 var status=mdboss.elementValue(_this,reqData, "status") ;//_this.$el.find("status").val();
	        	 var membertype=mdboss.elementValue(_this,reqData, "membertype") ;//_this.$el.find("membertype").val();
	        	 var joindate=mdboss.elementValue(_this,reqData, "joindate") ;//_this.$el.find("joindate").val();
	        	 var leavedate=mdboss.elementValue(_this,reqData, "leavedate") ;//_this.$el.find("leavedate").val();
	        	 var reason=mdboss.elementValue(_this,reqData, "reason") ;//_this.$el.find("reason").val();
	        	 var sortorder=mdboss.elementValue(_this,reqData, "sortorder") ;//_this.$el.find("sortorder").val();
	        	 var createtime=mdboss.elementValue(_this,reqData, "createtime") ;//_this.$el.find("createtime").val();
	        	 var creator=mdboss.elementValue(_this,reqData, "creator") ;//_this.$el.find("creator").val();
	        	 console.log(reqData);
	        	 var callback = _this.rdata.renderData;
	        	var req = reqData;
	        	 if(tids){
	        		 req.usercode= mdboss.usercode;
	        	 }else{
//	        		 req={"usercode":mdboss.usercode,"projectcode":projectcode, "sortorder":sortorder, "specialtycode":specialtycode,
//	        				 "rolecode":memo,"status":status };
	        		 req=reqData;
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.membersadd;
	        	 if(tid){
	        		 url =mdboss.api.membersedit;
	        		 req.tid = tid;
	        	 }else{
//	        		 req.creator = mdboss.usercode;
//    				 req.createtime = mdboss.getDate();
	        	 }
	        	 if(tids){
	        		 req.tids = tids;
	        		 url =mdboss.api.membersbatchedit;
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