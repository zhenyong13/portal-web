define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     Dialog = require("dialog");
	
     mdboss.View.permissionedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.rdata=data;
        	 _this.tid=data.tid;
        	 _this.detail = data.view;
        	 this.modeuledetail_html = require("text!template/page/system/permissiondetail.html");
        	 this.modeuledit_html = require("text!template/page/system/permissionedit.html");
        	 this.modeulbatchedit_html = require("text!template/page/system/permissionbatchedit.html");
        	 this.height = "315px";
        	 if(_this.rdata.tids){
        		 this.height="200px";
        	 }
        	 _this.callback=data.renderData;
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
	                	 reqData.push( {"name" : "permdetail", "post" : { "usercode":mdboss.usercode, "tid":_this.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["permdetail"];
	                        	 console.log(resData);
                 		 		if(_this.detail){//详情
                 		 			var templateA=Handlebars.compile(_this.modeuledetail_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.modeuledit_html);
                 		 			var html=template(resData);
                 		 			 _this.dataselect(resData.permtype);
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
         dataselect:function(permtype){//下拉列表数据获取
        	 mdboss.dataselect(this, "permtype", "UCP_PERMTYPE",permtype);
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
        	 
        	 var form_data = true;
    		 if(_this.rdata.tids){
    		 }else{
    			 form_data= $( "#module_form" ).triggerHandler( "submitForm" );
    		 }
 	         if ( form_data ) {
	        	 var tid=$("#tid").val();
	        	 var permcode=$("#permcode").val();
	        	 var permname=$("#permname").val();
	        	 var permtype=$("#permtype").val();
	        	 var modulecode=_this.$el.find("#parentcode").val();
	        	 var permdesc=$("#permdesc").val();
	        	 var appcode=$("#appcode").val();
	        	 
	        	 if(appcode);else appcode= null; //
	        	 if(permdesc);else permdesc= null; //
	        	 if(modulecode);else modulecode= null; //
	        	 if(permtype);else permtype= null; //
	        	 if(permcode);else permcode= null; //
	        	 
	        	 var callback = _this.callback;
	        	 var req={};
	        	 if(_this.rdata.tids){
	        		 req={"usercode":mdboss.usercode};
	        		 req.tids = _this.rdata.tids;
	        		 if(permtype){
	        			 req.permtype = permtype;
	        		 }
	        		 if(appcode){
	        			 req.appcode = appcode;
	        		 }
	        	 }else{
	        		 req={"usercode":mdboss.usercode,
		                     "permcode": permcode,"permname": permname,
		                     "permtype": permtype, "modulecode": modulecode,
		                     "permdesc": permdesc, "appcode": appcode};
	        	 }
	        	 //新增,修改
	        	 var url = mdboss.api.permadd;
	        	 if(tid){
	        		 url =mdboss.api.permedit;
	        		 req.tid = tid;
	        	 }
	        	 if(_this.rdata.tids){
	        		 url =mdboss.api.permbatchedit;
	        		 req.tids = _this.rdata.tids;
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