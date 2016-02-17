/**
 * 系统参数
 */
define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     Dialog = require("dialog");
	
     mdboss.View.widgetedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tid=data.tid;
        	 _this.rdata=data;
        	 _this.detail = data.view;
        	 this.modeuledetail_html = require("text!template/page/system/widget/widgetdetail.html");
        	 this.modeuledit_html = require("text!template/page/system/widget/widgetedit.html");
        	 this.modeulbatchedit_html = require("text!template/page/system/widget/widgetbatchedit.html");
        	 _this.callback=data.renderData;
        	 this.height = "300px";
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
	                	 reqData.push( {"name" : "widgetdetail", "post" : { "usercode":mdboss.usercode, "tid":_this.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["widgetdetail"];
                 		 		if(_this.detail){//详情
                 		 			var templateA=Handlebars.compile(_this.modeuledetail_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.modeuledit_html);
                 		 			var html=template(resData);
                 		 			 _this.dataselect(resData.grouptype);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			$( "#module_form" ).validVal();
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
                	}
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dataselect:function(grouptype){//下拉列表数据获取
          	 //群组类型
        	 mdboss.dataselect(this, "grouptype", "UCP_GROUPTYPE",grouptype);
  			
         },
         events: {
        	 'click .js_search_dept':'selected_dept',//选择部门
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 'click .js_select_person':'selected_person'
         },
         selected_dept:function(e){
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
         selected_person:function(e){
        	 _this=this;
        	 mdboss.selectedperson({"callbacks":_this.selpersoncallback});
         },
         selpersoncallback:function(data){
    	 	var template=Handlebars.compile($("#sel-personshow-template").html());
    		$(".selected_person_show").html(template({"persons":data}));
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
	        	 var tid=_this.$el.find("#tid").val();
	        	 var groupcode=_this.$el.find("#groupcode").val();
	        	 var groupname=_this.$el.find("#groupname").val();
	        	 var sortorder=_this.$el.find("#sortorder").val();
	        	 var sid=_this.$el.find("#sid").val();
	        	 var appcode=_this.$el.find("#appcode").val();
	        	 var minheight=_this.$el.find("#minheight").val();
	        	 var isdefault=_this.$el.find("input[name=isdefault]:checked").val()=="true" ? true:false;
	        	 var isshow=_this.$el.find("input[name=isshow]:checked").val()=="true" ? true:false;
	        	 
	        	 
	        	 if(sortorder);else sortorder= null; //
	        	 if(appcode);else appcode= null; //
	        	 if(minheight);else minheight= null; //
	        	 
	        	 var callback = _this.callback;
	        	 var req={};
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.widgetadd;
	        	 
	        	 if(_this.rdata.tids){
	        		 url =mdboss.api.widgetbatchupdate;
	        		 req={"usercode":mdboss.usercode};
	        		 req.tids = _this.rdata.tids;
	        		 if(appcode){
	        			 req.appcode=appcode;
	        		 }
	        		 if(sid){
	        			 req.sid=sid;
	        		 }
	        		 if(minheight){
	        			 req.minheight=minheight;
	        		 }
	        		 if(_this.$el.find("input[name=isdefault]:checked").val()){
	        			 req.isdefault=_this.$el.find("input[name=isdefault]:checked").val()=="true" ? true:false;
	        		 }
	        		 if(_this.$el.find("input[name=isshow]:checked").val()){
	        			 req.isshow=_this.$el.find("input[name=isshow]:checked").val()=="true" ? true:false;
	        		 }
	        	 }else{
	        		 req={"usercode":mdboss.usercode,
		                     "templateid": groupcode,"name": groupname,
		                     "sortorder": sortorder, "isshow": isshow,
		                     "isdefault": isdefault,"minheight": minheight ,"appcode":appcode, "sid":sid};
	        	 }
	        	 if(tid){
	        		 url =mdboss.api.widgetupdate;
	        		 req.tid = tid;
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