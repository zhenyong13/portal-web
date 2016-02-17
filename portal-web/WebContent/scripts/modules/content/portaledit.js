﻿define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     Dialog = require("dialog");
	
     mdboss.View.portaledit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tid=data.tid;
        	 _this.rdata=data;
        	 _this.detail = data.view;
        	 this.modeuledetail_html = require("text!template/page/content/portal/view.html");
        	 this.modeuledit_html = require("text!template/page/content/portal/edit.html");
        	 this.batchedit_html=require("text!template/page/content/portal/batchedit.html");
        	 _this.callback=data.renderData;
        	 this.height = "380px";
        	 if(_this.rdata.tids){
        		 this.height="230px";
        	 }
        	 _this.dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                 }
             }, {"title":data.title ,"width":"850px","height":_this.height,"icon":"iconfont icon-mdliucheng","resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "portalview", "post" : { "usercode":mdboss.usercode, "tid":_this.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["portalview"];
                 		 		if(_this.detail){//详情
                 		 			var templateA=Handlebars.compile(_this.modeuledetail_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.modeuledit_html);
                 		 			var html=template(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			$( "#module_form" ).validVal();
                 		 		}    
                 		 		 $("#sid").select2({width:'200'});
	                         } 
	                         else {
	                         	mdboss.error(msg);
	                         }
	                     });
                	 }else{//新增
                		 var template=null;
        		 		 if(_this.rdata.tids){
        		 			 template=Handlebars.compile(_this.batchedit_html);
        		 			 var html=template({});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
        		 		 }else{
        		 			 template=Handlebars.compile(_this.modeuledit_html);
        		 			var html=template({});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 $("#sid").select2({width:'200'});
        		 			 $( "#module_form" ).validVal();
        		 		 }
                	}
              
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dataselect:function(moduletype, modulelevel){//下拉列表数据获取
          	//模块类型
        	 mdboss.dataselect(this, "moduletype", "UCP_MODULETYPE",moduletype);
        	 mdboss.dataselect(this, "modulelevel", "UCP_MODULELEVEL",modulelevel);
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_dept':'selected_dept',//选择部门
        	 'click .js_select_person':'selected_person',
        	 "click #typeclassS":"icon_select"
         },
         icon_select:function(e){
 			_this=this;
 			$(e.currentTarget).attr("disabled",false);
 			 seajs.use("iconselect", function () {
 				 new mdboss.View.iconSelectView({parent:_this});
 			 });
 		},
         selected_person:function(e){
        	 _this=this;
        	 mdboss.selectedperson({"callbacks":_this.selpersoncallback});
         },
         selpersoncallback:function(data){
    	 	var template=Handlebars.compile($("#sel-personshow-template").html());
    		$(".selected_person_show").html(template({"persons":data}));
         },
         selected_dept:function(e){
        	_this=this;
        	var dept_arr=new Array();
 	        seajs.use("moduleselect", function () {
 	         	dept_arr.push(_this.$el.find("#parentcode").val());
 	        	new mdboss.View.moduleselectView({dept:dept_arr,parent:_this.$el,"callback":_this.dataSet,"pview":_this});
 	        });
         },
         dataSet:function(treeNode, parent,pview){
        	 parent.find("#parentcode").val(treeNode.id);
        	 parent.find("#parentname").val(treeNode.name);
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
	        	 
	        	 var callback = _this.callback;
	        	 var reqData = {};
	        	 reqData.tid = tid;
	        	 mdboss.elementValue(_this, reqData, "sid");
	        	 mdboss.elementValue(_this, reqData, "seqno");
	        	 mdboss.elementValue(_this, reqData, "columncode");
	        	 mdboss.elementValue(_this, reqData, "columnname");
	        	 mdboss.elementValue(_this, reqData, "templatecode");
	        	 mdboss.elementValue(_this, reqData, "columnurl");
	        	 mdboss.elementValue(_this, reqData, "columnsort");
	        	 mdboss.elementValue(_this, reqData, "moreurl");
	        	 mdboss.elementValue(_this, reqData, "condition");
	        	 if(tids){
	        	 }else{
	        		  
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.portaladd;
	        	 if(tid){
	        		 url =mdboss.api.portaledit;
	        	 }
	        	 if(tids){
	        		 req.tids = tids;
	        		 url =mdboss.api.modulebatchedit;
	        	 }
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