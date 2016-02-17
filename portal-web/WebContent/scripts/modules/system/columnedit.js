define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     Dialog = require("dialog");
	
     mdboss.View.columnedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tid=data.tid;
        	 _this.rdata=data;
        	 _this.detail = data.view;
        	 this.modeuledit_html = require("text!template/page/system/column/edit.html");
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
	                	 reqData.push( {"name" : "columnview", "post" : { "usercode":mdboss.usercode, "tid":_this.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["columnview"];
                 		 		if(_this.detail){//详情
                 		 			var templateA=Handlebars.compile(_this.modeuledetail_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.modeuledit_html);
                 		 			var html=template(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			_this.dataselect(resData.dbname, resData.tablename, resData.isuniqcode ,resData.columntype, resData.setoncreate);
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
         dataselect:function(dbname, tablename,isuniqcode,columntype,setoncreate){//下拉列表数据获取
        	 mdboss.dataselect(this, "dbname", "$UCP_DB",dbname);
        	 mdboss.dataselect(this, "tablename", "#UCP_TABLE",tablename);
        	 mdboss.dataselect(this, "isuniqcode", "$COMMON_YESORNO",isuniqcode);
        	 mdboss.dataselect(this, "setoncreate", "$COMMON_YESORNO",setoncreate);
        	 mdboss.dataselect(this, "columntype", "$UCP_COLUMNTYPE",columntype);
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_dept':'selected_dept',//选择部门
        	 'click .js_select_person':'selected_person',
        	 "click #typeclassS":"icon_select"
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
	        	 var tablename=_this.$el.find("#tablename").val();
	        	 var columncname=_this.$el.find("#columncname").val();
	        	 var dbname=_this.$el.find("#dbname").val();
	        	 var columnname=_this.$el.find("#columnname").val();
	        	 var vofieldname=_this.$el.find("#vofieldname").val();
	        	 var columntype=_this.$el.find("#columntype").val();
	        	 var isuniqcode=_this.$el.find("#isuniqcode").val();
	        	 var setoncreate=_this.$el.find("#setoncreate").val();
	        	 var voname=_this.$el.find("#voname").val();
	        	 var rulejson=_this.$el.find("#rulejson").val();
	        	 var memo=_this.$el.find("#memo").val();
	        	 
	        	 if(rulejson);else rulejson= null; //
	        	 if(memo);else memo= null; //
	        	 
	        	 
	        	 var callback = _this.callback;
	        	 var req = {};
        		 req={"usercode":mdboss.usercode,  "tablename": tablename,"columncname": columncname,"voname":voname,
        				 "dbname": dbname, "columnname": columnname,"columntype":columntype,  "isuniqcode":isuniqcode,"setoncreate":setoncreate,
        				 "vofieldname": vofieldname,  "rulejson": rulejson,  "memo": memo};
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.columnadd;
	        	 if(tid){
	        		 url =mdboss.api.columnedit;
	        		 req.tid = tid;
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