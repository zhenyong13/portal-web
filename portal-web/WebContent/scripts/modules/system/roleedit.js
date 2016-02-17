define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     Dialog = require("dialog");
	
     mdboss.View.roleedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tid=data.tid;
        	 _this.rdata=data;
        	 _this.detail = data.view;
        	 this.modules=new Array();//所选角色
        	 this.perms=new Array();//所选权限
        	 this.modeuledetail_html = require("text!template/page/system/roledetail.html");
        	 this.modeuledit_html = require("text!template/page/system/roleedit.html");
        	 this.modeulbatchedit_html = require("text!template/page/system/rolebatchedit.html");
        	 this.height = "270px";
        	 if(_this.rdata.tids){
        		 this.height="230px";
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
	                	 reqData.push( {"name" : "roledetail", "post" : { "usercode":mdboss.usercode, "tid":_this.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["roledetail"];
//	                        	 this.modules = resData.modules;
//	                        	 this.perms = resData.perms;
                 		 		if(_this.detail){//详情
                 		 			var templateA=Handlebars.compile(_this.modeuledetail_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.modeuledit_html);
                 		 			var html=template(resData);
                 		 			_this.dataselect(resData.roletype, resData.rolestate);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
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
         dataselect:function(roletype, rolestate){//下拉列表数据获取
        	 mdboss.dataselect(this, "roletype", "UCP_ROLETYPE",roletype);
        	 mdboss.dataselect(this, "rolestate", "COMMON_STATE", rolestate);
           },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_dept':'selected_dept',//选择部门
        	 'click .js_select_person':'selected_person',
        	 'click .js_search_roleperm':'jssearchroleperm',//角色授权
        	 'click #myworkflow':'jssearchroleperm',//角色授权
         },
         jssearchroleperm:function(){//角色授权
        	 _this=this;
        	 var dept_arr= this.modules;
        	 var perm_arr=  this.perms;
 	        seajs.use("rolepermselect", function () {
 	        	var $seldept=$(".selected_dept_show .file-show a:first-child");
 	        	if($seldept){
 	        		dept_arr = new Array();
 	        		$seldept.each(function(index,item){
 	        			dept_arr.push($(item).attr("did"));
 	        		});
 	        	}
 	        	
 	        	var $seldept=$(".selected_perm_show .file-show a:first-child");
 	        	if($seldept){
 	        		perm_arr = new Array();
	 	          	 $seldept.each(function(index,item){
	 	          		 perm_arr.push($(item).attr("did"));
	 	          	 });
 	        	}
 	        	new mdboss.View.rolepermselectView({dept:dept_arr, perms:perm_arr, parent:_this.$el,
 	        		"callbacks":_this.roleperm,"pview":_this,"title":"角色授权"});
 	        });
         },
         roleperm:function(data,permselt,modules, perms){//角色授权 回调  TODO
        	 $(".selected_dept_show").html("角色:"+data);
        	 $(".selected_perm_show").html("权限:"+permselt);
        	 this.modules = modules;
        	 this.perms = perms;
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
// 	        	var $seldept=$(".selected_dept_show .file-show a:first-child");
// 	        	$seldept.each(function(index,item){
// 	         		dept_arr.push($(item).attr("did"));
// 	         	});
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
        	 
        	 var form_data = true;
        		 if(_this.rdata.tids){
        		 }else{
        			 form_data = $( "#module_form" ).triggerHandler( "submitForm" );
        		 }
 	         if ( form_data ) {
	        	 var tid=$("#tid").val();
	        	 var rolecode=$("#rolecode").val();
	        	 var rolename=$("#rolename").val();
	        	 var roletype=$("#roletype").val();
	        	 var parentcode=_this.$el.find("#parentcode").val();
	        	 var roledesc=$("#roledesc").val();
	        	 var rolestate=$("#rolestate").val();
	        	 if(rolestate);else rolestate= null;
	        	 if(roledesc);else roledesc= null;
	        	 if(parentcode);else parentcode= null;
	        	 if(roletype);else roletype= null;
	        	 
	        	 var callback = _this.callback;
	        	 var req={};
	        	 if(_this.rdata.tids){
	        		 req={"usercode":mdboss.usercode};
	        		 req.tids = _this.rdata.tids;
	        		 if(parentcode){
	        			 req.orgcode = parentcode;
	        		 }
	        		 if(rolestate){
	        			 req.rolestate = rolestate;
	        		 }
	        		 if(roletype){
	        			 req.roletype = roletype;
	        		 }
	        	 }else{
	        		 req={"usercode":mdboss.usercode,
		                     "rolecode": rolecode,"rolename": rolename,"roletype":roletype,
		                     "orgcode": parentcode, "roledesc": roledesc, "rolestate": rolestate};
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.roleadd;
	        	 if(tid){
	        		 url =mdboss.api.roleedit;
	        		 req.tid = tid;
	        	 }
	        	 if(_this.rdata.tids){
	        		 url =mdboss.api.rolebatchedit;
	        		 req.tids = _this.rdata.tids;
	        	 }
	        	 var commonModel=new mdboss.Model.commonModel();
				 commonModel.save(req, {url:url,success:function(model,res){
	        		 if(res.rc==1){
	        			 if(tid || _this.rdata.tids){
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