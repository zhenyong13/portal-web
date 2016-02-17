define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("datetimepicker");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.serialeditFunc=function(data){
		new mdboss.View.serialedit(data);
     };
     
	
     mdboss.View.serialedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 //传入的参数
        	 _this.rdata=data;
        	 _this.ueditor=null;
        	 this.filecode="";
        	 //标题
        	 if(data.title == "add"){
        		 this.title="新增字号";
        		 this.height = "400px";
        	 }else if(data.title == "edit"){
        		 this.title="字号编辑";
        		 this.height = "400px";
        	 }else if(data.title == "view"){
        		 this.title="字号详情";
        		 this.height = "420px";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改字号";
        		 this.height="250px";
        	 }else{
        		 this.title="";
        		 this.height="230px";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/oa/serial/view.html");
        	 this.edit_html = require("text!template/page/oa/serial/edit.html");
        	 this.batchedit_html=require("text!template/page/oa/serial/batchedit.html");
        	 
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
	                	 reqData.push( {"name" : "serialview", "post" : { "usercode":mdboss.usercode, "tid":_this.rdata.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["serialview"];
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
                 		 			_this.dataselect(resData.type);
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
        		 			 
        		 			var html=template({"year":mdboss.getDate("yyyy")  });
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
         dataselect:function(serialtype){//下拉列表数据获取
        	 mdboss.dataselect(this, "serialtype", "COMMON_STATE",serialtype);
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #serialback':'back',//退订
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_dept':'selected_dept',//选择部门
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
	        	 var serialcode=_this.$el.find("#serialcode").val();
	        	 var year=_this.$el.find("#year").val();
	        	 var num=_this.$el.find("#num").val();
	        	 var parentcode=_this.$el.find("#parentcode").val();
	        	 var serialtype=_this.$el.find("#serialtype").val();
	        	 var remark=_this.$el.find("#remark").val();//备注
	        	 if(remark);else remark= null; //
	        	 
	        	 var callback = _this.rdata.renderData;
	        	 var req = {};
	        	 if(tids){
	        		 req.usercode= mdboss.usercode;
	        	 }else{
	        		 req={"usercode":mdboss.usercode,"serialcode":serialcode, "type":serialtype, 
	        				 "year":year,"num":num,
	        				 "orgcode":parentcode, "remark": remark};
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.sunxu;
	        	 if(tid){
	        		 url =mdboss.api.serialedit;
	        		 req.tid = tid;
	        	 }else{
	        		 req.creator = mdboss.usercode;
    				 req.createtime = mdboss.getDate();
	        	 }
	        	 if(tids){
	        		 req.tids = tids;
	        		 url =mdboss.api.serialbatchedit;
	        		  
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