define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     Dialog = require("dialog");
	
     mdboss.View.tableedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tid=data.tid;
        	 _this.rdata=data;
        	 _this.detail = data.view;
        	 this.modeuledit_html = require("text!template/page/system/table/edit.html");
        	 _this.callback=data.renderData;
        	 this.height = "430px";
        	 if(_this.rdata.tids){
        		 this.height="230px";
        	 }
        	 _this.dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                 }
             }, {"title":data.title ,"width":"600px","height":_this.height,"icon":"iconfont icon-mdliucheng","resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "tableview", "post" : { "usercode":mdboss.usercode, "tid":_this.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["tableview"];
//	                        	 console.log(resData);
                 		 		if(_this.detail){//详情
                 		 			var templateA=Handlebars.compile(_this.modeuledetail_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.modeuledit_html);
                 		 			var html=template(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
//                 		 			dialog.$html.find("#moduleview").select2({width:'200'});
//                 		 			_this.dataselect(resData.moduletype, resData.modulelevel);
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
	        	 var tablecname=_this.$el.find("#tablecname").val();
	        	 var dbname=_this.$el.find("#dbname").val();
	        	 var dbcname=_this.$el.find("#dbcname").val();
	        	 var voname=_this.$el.find("#voname").val();
	        	 var appcode=_this.$el.find("#appcode").val();
	        	 var memo=_this.$el.find("#memo").val();
	        	 
	        	 if(appcode);else appcode= null; //
	        	 if(memo);else memo= null; //
	        	 
	        	 
	        	 var callback = _this.callback;
	        	 var req = {};
        		 req={"usercode":mdboss.usercode,  "tablename": tablename,"tablecname": tablecname,
        				 "dbname": dbname, "dbcname": dbcname,  "voname": voname,  "appcode": appcode,  "memo": memo};
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.tableadd;
	        	 if(tid){
	        		 url =mdboss.api.tableedit;
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