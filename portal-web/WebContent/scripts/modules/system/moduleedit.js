define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     Dialog = require("dialog");
	
     mdboss.View.moduleedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tid=data.tid;
        	 _this.rdata=data;
        	 _this.detail = data.view;
        	 this.modeuledetail_html = require("text!template/page/system/moduledetail.html");
        	 this.modeuledit_html = require("text!template/page/system/moduleedit.html");
        	 this.modeuledit_html = require("text!template/page/system/moduleedit.html");
        	 this.batchedit_html=require("text!template/page/system/modulebatchedit.html");
        	 _this.callback=data.renderData;
        	 this.height = "440px";
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
	                	 reqData.push( {"name" : "moduledetail", "post" : { "usercode":mdboss.usercode, "tid":_this.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["moduledetail"];
//	                        	 console.log(resData);
                 		 		if(_this.detail){//详情
                 		 			var templateA=Handlebars.compile(_this.modeuledetail_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.modeuledit_html);
                 		 			var html=template(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			dialog.$html.find("#moduleview").select2({width:'200'});
                 		 			_this.dataselect(resData.moduletype, resData.modulelevel);
                 		 			$( "#module_form" ).validVal();
                 		 		}                    		 		 
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
	           		 		 _this.dataselect();
        		 		 }else{
        		 			 template=Handlebars.compile(_this.modeuledit_html);
        		 			var html=template({});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 _this.dataselect();
        		 			 $( "#module_form" ).validVal();
        		 		 }
                	}
                	 $("#moduleview").select2({width:'200'});
              
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
	        	 var modulecode=$("#modulecode").val();
	        	 var modulename=$("#modulename").val();
	        	 var moduletype=$("#moduletype").val();
	        	 var parentcode=_this.$el.find("#parentcode").val();
	        	 var moduleuri=$("#moduleuri").val();
	        	 var moduleview=$("#moduleview").val();
	        	 var modulelevel=$("#modulelevel").val();
	        	 var moduleorder=$("#moduleorder").val();
	        	 var iconclass=$("#type_class").val();
	        	 var rel=$("#rel").val();
	        	 var moduledesc=$("#moduledesc").val();
	        	 var appcode=$("#appcode").val();
	        	 var external=$("#external").val();
	        	 
	        	 if(external);else external= null; //
	        	 if(appcode);else appcode= null; //
	        	 if(moduledesc);else moduledesc= null; //
	        	 if(rel);else rel= null; //
	        	 if(iconclass);else iconclass= null; //
	        	 if(moduleorder);else moduleorder= null; //
	        	 if(modulelevel);else modulelevel= null; //
	        	 if(moduleview);else moduleview= null; //
	        	 if(moduleuri);else moduleuri= null; //
	        	 if(parentcode);else parentcode= null; //
	        	 
	        	 
	        	 var callback = _this.callback;
	        	 var req = {};
	        	 if(tids){
	        		 req.usercode= mdboss.usercode;
	        		 if(parentcode){
	        			 req.parentcode= parentcode;
	        		 }
	        		 if(moduleview)
	        			 req.moduleview =moduleview;
	        		 if(modulelevel)
	        			 req.modulelevel =modulelevel;
	        		 if(appcode)
	        			 req.appcode =appcode;
	        		 if(moduletype)
	        			 req.moduletype =moduletype;
	        	 }else{
	        		 req={"usercode":mdboss.usercode,
	        				 "modulecode": modulecode,"modulename": modulename,
	        				 "moduletype": moduletype, "parentcode": parentcode,
	        				 "moduleuri": moduleuri,  "moduleview": moduleview,
	        				 "modulelevel": modulelevel, "moduleorder": moduleorder,
	        				 "iconclass": iconclass, "rel": rel,
	        				 "moduledesc": moduledesc, "appcode": appcode, "external": external};
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.moduleadd;
	        	 if(tid){
	        		 url =mdboss.api.moduleedit;
	        		 req.tid = tid;
	        	 }
	        	 if(tids){
	        		 req.tids = tids;
	        		 url =mdboss.api.modulebatchedit;
	        	 }
	        	 var commonModel=new mdboss.Model.commonModel();
				 commonModel.save(req, {url:url,success:function(model,res){
	        		 if(res.rc==1){
	        			 if(tid){
	        				 mdboss.notifyTips("修改成功！");
	        			 }else{
	        				 mdboss.notifyTips("新增成功！");
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