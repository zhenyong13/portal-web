define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("upload");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.meetinfoeditFunc=function(data){
		new mdboss.View.meetinfoedit(data);
     };
     
	
     mdboss.View.meetinfoedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.rdata=data;  //传入的参数
        	 //标题
        	 if(data.title == "add"){
        		 this.title="创建会议公告";
        	 }else if(data.title == "edit"){
        		 this.title="编辑会议公告";
        	 }else if(data.title == "view"){
        		 this.title="会议公告详情";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改会议公告";
        	 }else{
        		 this.title="";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/content/meetinfo/view.html");
        	 this.edit_html = require("text!template/page/content/meetinfo/edit.html");
        	 this.batchedit_html=require("text!template/page/content/meetinfo/batchedit.html");
        	 
        	 this.height = "480px";
        	 _this.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){ $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});   }
             }, {"title":_this.title ,"width":"900px","height":_this.height,"icon":"iconfont icon-mdliucheng",
            	 full:false, layer:false,btns: ['min','max','close'],
            	 "resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.rdata.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "meetinfoview", "post" : { "usercode":mdboss.usercode, "tid":_this.rdata.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["meetinfoview"];
                 		 		if(_this.rdata.view){//详情
                 		 			var templateA=Handlebars.compile(_this.view_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		 
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.edit_html);
                 		 			var uuid =  mdboss.getuuid();
                 		 			resData.uuid = uuid;
                 		 			_this.uuid = uuid;
                 		 			var html=template(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			_this.dataselect(resData.topshow);
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
        		 			 var html=template({"creator":mdboss.getUserinfo().username, "createtime":mdboss.getDate()});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 _this.dataselect();
        		 		 }else{
        		 			 template=Handlebars.compile(_this.edit_html);
        		 			 var uuid =  mdboss.getuuid();
        		 			 
        		 			var html=template({"uuid":uuid,"creator":mdboss.getUserinfo().username, "createtime":mdboss.getDate()});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 _this.dataselect();
        		 			 $( "#module_form" ).validVal();
        		 		 }
        		 		 // 
                	}
                	 $("#moduleview").select2({width:'200'});
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dataselect:function(topshow ){//下拉列表数据获取
        	 mdboss.dataselect(this, "topshow", "OA_ISSUETYPE",topshow);
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
	        	 var tid=$("#tid").val();
	        	 var reqData = {};
	        	 mdboss.elementValue(_this, reqData, "topshow");
	        	 mdboss.elementValue(_this, reqData, "createtime");
	        	 mdboss.elementValue(_this, reqData, "creator");
	        	 reqData.content= _this.$el.find("#noticeContent").val();
	        	 
	        	 var callback = _this.rdata.renderData;
	        
	        	 var url = mdboss.api.meetinfoadd; 	 //新增,修改
	        	 if(tid){
	        		 url =mdboss.api.meetinfoedit;
	        		 reqData.tid = tid;
	        	 }else{
	        		 reqData.creator = mdboss.usercode;
	        		 reqData.createtime = mdboss.getDate();
	        	 }
	        	 
	        	 reqData.usercode = mdboss.usercode;
	        	 var commonModel=new mdboss.Model.commonModel();
				 commonModel.save(reqData, {url:url,success:function(model,res){
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