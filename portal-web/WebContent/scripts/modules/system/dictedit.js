/**
 * 系统参数
 */
define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     Dialog = require("dialog");
	
     mdboss.View.dictedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tid=data.tid;
        	 _this.rdata=data;
        	 _this.detail = data.view;
        	 this.modeuledetail_html = require("text!template/page/system/dictdetail.html");
        	 this.modeuledit_html = require("text!template/page/system/dictedit.html");
        	 this.modeulbatchedit_html = require("text!template/page/system/dictbatchedit.html");
        	 _this.callback=data.renderData;
        	 this.height = "290px";
        	 if(_this.rdata.tids){
        		 this.height = "200px";
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
	                	 reqData.push( {"name" : "dictdetail", "post" : { "usercode":mdboss.usercode, "tid":_this.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["dictdetail"];
	                        	 console.log(resData);
                 		 		if(_this.detail){//详情
                 		 			var templateA=Handlebars.compile(_this.modeuledetail_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.modeuledit_html);
                 		 			var html=template(resData);
                 		 			 _this.dataselect(resData.dictstate);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			$( "#module_form" ).validVal();
                           		   $("#dictstate").select2({width:'200'});
                 		 		}                    		 		 
	                         } 
	                         else {
	                         	mdboss.error(msg);
	                         }
	                     });
                	 }else{//新增
                		 var template = null;
                		 if(_this.rdata.tids){
                			 template=Handlebars.compile(_this.modeulbatchedit_html);
                    		 var html=template({});
                    		 _this.dataselect();
                    		 dialog.$html.find(".dialog-content").html(html).fadeIn();
                    		 $( "#module_form" ).validVal();
                    	 }else{
                    		 template=Handlebars.compile(_this.modeuledit_html);
                    		 var html=template({});
                    		 _this.dataselect();
                    		 dialog.$html.find(".dialog-content").html(html).fadeIn();
                    		 $( "#module_form" ).validVal();
                    	 }
                		 $("#dictstate").select2({width:'200'});
                	}
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dataselect:function(dictstate){//下拉列表数据获取
          	 //字典状态
        	 mdboss.dataselect(this, "dictstate", "COMMON_STATE",dictstate);
  			
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_dept':'selected_dept',//选择部门
        	 'click .js_select_person':'selected_person'
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
// 	        	var $seldept=$(".selected_dept_show .file-show a:first-child");
// 	        	$seldept.each(function(index,item){
// 	         		dept_arr.push($(item).attr("did"));
// 	         	});
 	        	new mdboss.View.moduleselectView({dept:dept_arr,parent:_this.$el,"callback":_this.dataSet,"pview":_this});
 	        });
         },
         dataSet:function(treeNode, parent,pview){
        	 parent.find("#parentcode").val(treeNode.id);
        	 parent.find("#parentname").val(treeNode.name);
         },
         submit:function(e){//提交
        	 _this=this;
        	 var form_data = true;
        	 if(_this.rdata.tids){
        		 
        	 }else{
        		 $( "#module_form" ).triggerHandler( "submitForm" );
        	 }
 	         if ( form_data ) {
	        	 var tid=$("#tid").val();
	        	 var dictcode=$("#dictcode").val();
	        	 var dictname=$("#dictname").val();
	        	 var dictstate=$("#dictstate").val();
	        	 var dictorder=$("#dictorder").val();
	        	 var dictdesc=$("#dictdesc").val();
	        	 var groupcode=$("#groupcode").val();
	        	 
	        	 if(dictorder);else dictorder= null; //
	        	 if(groupcode);else groupcode= null; //
	        	 if(dictdesc);else dictdesc= null; //
	        	 if(dictstate);else dictstate= null; //
	        	 if(dictcode);else dictcode= null; //
	        	 
	        	 var callback = _this.callback;
	        	 var req={};
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.sysdictadd;
	        	
	        	 if(_this.rdata.tids){
	        		 url =mdboss.api.dictbatchedit;
	        		 req={"usercode":mdboss.usercode};
	        		 req.tids = _this.rdata.tids;
	        		 if(groupcode){
	        			 req.groupcode=groupcode;
	        		 }
	        		 if(dictstate){
	        			 req.dictstate=dictstate;
	        		 }
	        	 }else{
	        		 req={"usercode":mdboss.usercode,
		                     "dictcode": dictcode,"dictname": dictname,
		                     "dictstate": dictstate, "dictorder": dictorder,
		                     "dictdesc": dictdesc, "groupcode": groupcode};
	        	 }
	        	 if(tid){
	        		 req.tid = tid;
	        		 url =mdboss.api.dictedit;
	        	 }
	        	 var commonModel=new mdboss.Model.commonModel();
				 commonModel.save(req, {url:url,success:function(model,res){
	        		 if(res.rc==1){
	        			 if(tid){
	        				 mdboss.notifyTips("修改成功！");
	        			 }else{
	        				 mdboss.notifyTips("处理成功！");
	        			 }
	//                			 Backbone.history.loadUrl();
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