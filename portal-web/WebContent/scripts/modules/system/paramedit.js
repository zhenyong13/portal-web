/**
 * 系统参数
 */
define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     Dialog = require("dialog");
	
     mdboss.View.paramedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tid=data.tid;
        	 _this.rdata=data;
        	 _this.detail = data.view;
        	 this.modeuledetail_html = require("text!template/page/system/paramdetail.html");
        	 this.modeuledit_html = require("text!template/page/system/paramedit.html");
        	 this.modeulbatchedit_html = require("text!template/page/system/parambatchedit.html");
        	 _this.callback=data.renderData;
        	 _this.height= "290px";
        	 if(_this.rdata.tids){
        		 _this.height= "150px";
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
	                	 reqData.push( {"name" : "paramdetail", "post" : { "usercode":mdboss.usercode, "tid":_this.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["paramdetail"];
	                        	 console.log(resData);
                 		 		if(_this.detail){//详情
                 		 			var templateA=Handlebars.compile(_this.modeuledetail_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.modeuledit_html);
                 		 			var html=template(resData);
                 		 			 _this.dataselect(resData.paramtype);
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
         dataselect:function(paramtype){//下拉列表数据获取
        	 mdboss.dataselect(this, "paramtype", "COMMON_PARAMTYPE",paramtype);
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
        		 form_data = $( "#module_form" ).triggerHandler( "submitForm" );
        	 }
 	         if ( form_data ) {
	        	 var tid=$("#tid").val();
	        	 var paramcode=_this.$el.find("#paramcode").val();
	        	 var paramname=_this.$el.find("#paramname").val();
	        	 var paramtype=_this.$el.find("#paramtype").val();
	        	 var value=_this.$el.find("#value").val();
	        	 var paramdesc=_this.$el.find("#paramdesc").val();
	        	 var appcode=_this.$el.find("#appcode").val();
	        	 
	        	 if(appcode);else appcode= null; //
	        	 if(paramname);else paramname= null; //
	        	 if(paramdesc);else paramdesc= null; //
	        	 if(value);else value= null; //
	        	 if(paramtype);else paramtype= null; //
	        	 if(paramcode);else paramcode= null; //
	        	 
	        	 var callback = _this.callback;
	        	 var req={};
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.paramadd;
	        	
	        	 if(_this.rdata.tids){
	        		 url =mdboss.api.parambatchedit;
	        		 req={"usercode":mdboss.usercode};
	        		 req.tids = _this.rdata.tids;
	        		 if(appcode){
	        			 req.appcode=appcode;
	        		 }
	        		 if(paramtype){
	        			 req.paramtype=paramtype;
	        		 }
	        	 }else{
	        		 req={"usercode":mdboss.usercode,
		                     "paramcode": paramcode,"paramname": paramname,
		                     "paramtype": paramtype, "value": value,
		                     "paramdesc": paramdesc, "appcode": appcode};
	        	 }
	        	 if(tid){
	        		 url =mdboss.api.paramedit;
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