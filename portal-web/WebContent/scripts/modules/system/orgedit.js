define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     Dialog = require("dialog");
	
     mdboss.View.orgedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tid=data.tid;
        	 _this.rdata=data;
        	 _this.detail = data.view;
        	 this.modeuledetail_html = require("text!template/page/system/orgdetail.html");
        	 this.modeuledit_html = require("text!template/page/system/orgedit.html");
        	 this.modeulbatchedit_html = require("text!template/page/system/orgbatchedit.html");
        	 _this.callback=data.renderData;
        	 _this.height ="360px";
        	 if(_this.rdata.tids){
        		 _this.height ="200px";
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
	                	 reqData.push( {"name" : "orgdetail", "post" : { "usercode":mdboss.usercode, "tid":_this.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["orgdetail"];
	                        	 console.log(resData);
                 		 		if(_this.detail){//详情
                 		 			var templateA=Handlebars.compile(_this.modeuledetail_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.modeuledit_html);
                 		 			var html=template(resData);
                 		 			 _this.dataselect(resData.orgtype, resData.orglevel);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			$( "#module_form" ).validVal();
                 		 		}                    		 		 
	                         } 
	                         else {
	                         	mdboss.error(msg);
	                         }
	                     });
                	 }else{//新增
                		 var template= null;
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
         dataselect:function(orgtype, orglevel){//下拉列表数据获取
        	 mdboss.dataselect(this, "orgtype", "UCP_ORGTYPE",orgtype);
        	 mdboss.dataselect(this, "orglevel", "UCP_ORGLEVEL",orglevel);
          },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_org':'selected_dept',//选择部门
        	 'click .js_select_person':'selected_person',
        	 "click #typeclass":"icon_select"
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
 	        seajs.use("orgs", function () {
 	        	if(_this.$el.find("#parentcode").val() != ""){
 	        		dept_arr.push(_this.$el.find("#parentcode").val());
 	        	}
 	        	new mdboss.View.orgsView({dept:dept_arr,parent:_this.$el,"selectOnly":true,
 	        		"callbacks":_this.searchByOrg,"pview":_this,"title":"组织选择"});
 	        });
         },
         searchByOrg:function(treeNode, parent, pview){
    		 parent.find("#parentcode").val(treeNode.id);
        	 parent.find("#parentname").val(treeNode.name);
         },
         submit:function(e){//提交
        	 _this=this;
        	 var form_data = true;
        	 if(_this.rdata.tids){
        	 }else{
        		 form_data =  $( "#module_form" ).triggerHandler( "submitForm" );
        	 }
 	         if ( form_data ) {
	        	 var tid=$("#tid").val();
	        	 var orgcode=$("#orgcode").val();
	        	 var orgname=$("#orgname").val();
	        	 var orgtype=$("#orgtype").val();
	        	 var parentcode=_this.$el.find("#parentcode").val();
	        	 var orgdesc=$("#orgdesc").val();
	        	 var isenabled=$("#isenabled").val();
	        	 var orglevel=$("#orglevel").val();
	        	 var iconclass=$("#type_class").val();
	        	 var orgorder=$("#orgorder").val();
	        	 
	        	 if(iconclass);else iconclass= null; //
	        	 if(orgorder);else orgorder= null; //
	        	 if(orglevel);else orglevel= null; //
	        	 if(orgdesc);else orgdesc= null; //
	        	 if(orgtype);else orgtype= null; //
	        	 if(iconclass);else iconclass= null; //
	        	 if(isenabled);else isenabled= null; //
	        	 if(orgtype);else orgtype= null; //
	        	 
	        	 if(parentcode==""){
	        		 parentcode="org--1";
	        	 }
	        	 
	        	 var callback = _this.callback;
	        	 var req={};
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.orgadd;
	        	 if(tid){
	        		 url =mdboss.api.orgedit;
	        	 }
	        	 if(_this.rdata.tids){
	        		 url =mdboss.api.orgbatchedit; 
	        		 req={"usercode":mdboss.usercode};
	        		 req.tids = _this.rdata.tids;
	        		 if(orglevel){
	        			 req.orglevel=orglevel;
	        		 }
	        		 if(parentcode){
	        			 req.parentcode=parentcode;
	        		 }
	        		 if(isenabled){
	        			 req.isenabled=isenabled;
	        		 }
	        		 if(orgtype){
	        			 req.orgtype=orgtype;
	        		 }
	        	 }else{
	        		 req={"usercode":mdboss.usercode,
		                     "orgcode": orgcode,"orgname": orgname,"isenabled":isenabled,"orgorder":orgorder,
		                     "orgtype": orgtype, "parentcode": parentcode,"iconclass":iconclass,
		                     "orgdesc": orgdesc, "orglevel": orglevel};
	        		 req.tid = tid;
	        	 }
	        	 var commonModel=new mdboss.Model.commonModel();
				 commonModel.save(req, {url:url,success:function(model,res){
	        		 if(res.rc==1){
	        			 if(tid || _this.rdata.tids){
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