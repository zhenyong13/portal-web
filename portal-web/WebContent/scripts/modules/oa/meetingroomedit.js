﻿define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("datetimepicker");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.meetingroomeditFunc=function(data){
		new mdboss.View.meetingroomedit(data);
     };
     
	
     mdboss.View.meetingroomedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 //传入的参数
        	 _this.rdata=data;
        	 _this.ueditor=null;
        	 this.filecode="";
        	 //标题
        	 if(data.title == "add"){
        		 this.title="新增会议室";
        		 this.height = "300px";
        	 }else if(data.title == "edit"){
        		 this.title="会议室编辑";
        		 this.height = "330px";
        	 }else if(data.title == "view"){
        		 this.title="会议室详情";
        		 this.height = "310px";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改会议室";
        		 this.height="200px";
        	 }else{
        		 this.title="";
        		 this.height="230px";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/oa/meetingroom/view.html");
        	 this.edit_html = require("text!template/page/oa/meetingroom/edit.html");
        	 this.batchedit_html=require("text!template/page/oa/meetingroom/batchedit.html");
        	 
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
	                	 if(_this.rdata.roomcode){
	                		 var tmpCondition = new Array();
	         	            tmpCondition.push({"key":"roomcode", "EqualTo":"Like","v1":_this.rdata.roomcode});
	                		reqData.push( {"name" : "meetingroomlist", "post" : { "usercode":mdboss.usercode, "pageNo":1, "pageSize":1,    // 每页10条记录
	                  			"queryCondition": tmpCondition },cache:false });
	                	 }else{
	                		 reqData.push( {"name" : "meetingroomview", "post" : { "usercode":mdboss.usercode, "tid":_this.rdata.tid },cache:false });
	                	 }
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = null;
	                        	 if(_this.rdata.roomcode){
	                        		 resData = result.data["meetingroomlist"].rows[0];
	                        	 }else{
	                        		 
	                        		 resData = result.data["meetingroomview"];
	                        	 }
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
                 		 			_this.dataselect(resData.assesttype, resData.isenabled);
                 		 			_this.initDate();
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
	           		 		_this.initDate();
        		 		 }else{
        		 			 template=Handlebars.compile(_this.edit_html);
        		 			 
        		 			var html=template({});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 _this.dataselect();
	           		 		_this.initDate();
        		 			 $( "#module_form" ).validVal();
        		 		 }
        		 		 // 
                	}
             }); 
        	 this.$el = _this.dialog.$html;
         },
         initDate:function(){},
         dataselect:function(assesttype,  isenabled){//下拉列表数据获取
//        	 mdboss.dataselect(this, "meetingroom_room", "COMMON_STATE",isenabled);
//        	 this.$el.find("#circle_time").select2({"width": "200"});
//        	 this.$el.find("#time_type").select2({"width": "200"});
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #meetingroomback':'back',//退订
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
	        	 var tid=_this.$el.find("#tid").val();
	        	 var roomcode=_this.$el.find("#roomcode").val();
	        	 var position=_this.$el.find("#position").val();
	        	 var roomname=_this.$el.find("#roomname").val();
	        	 var capacity=_this.$el.find("#capacity").val();
	        	 var memo=_this.$el.find("#memo").val();//备注
	        	 if(memo);else memo= null; //
	        	 
	        	 var callback = _this.rdata.renderData;
	        	 var req = {};
	        	 if(tids){
	        		 req.usercode= mdboss.usercode;
	        	 }else{
	        		 req={"usercode":mdboss.usercode,"roomcode":roomcode, "roomname":roomname,"capacity":capacity, 
	        				 "position":position, "memo": memo};
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.meetingroomadd;
	        	 if(tid){
	        		 url =mdboss.api.meetingroomedit;
	        		 req.tid = tid;
	        	 }else{
//	        		 req.creator = mdboss.usercode;
//    				 req.createtime = mdboss.getDate();
	        	 }
	        	 if(tids){
	        		 req.tids = tids;
	        		 url =mdboss.api.meetingroombatchedit;
	        		  if(position) req.position= position;
	        		  if(capacity) req.capacity= capacity;
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