define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.answereditFunc=function(data){
		new mdboss.View.answeredit(data);
     };
     
	
     mdboss.View.answeredit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 //传入的参数
        	 _this.rdata=data;
        	 _this.ueditor=null;
        	 this.filecode="";
        	 this.uuid="";
        	 this.uED=null;
        	 //标题
        	 if(data.title == "add"){
        		 this.title="新增处理";
        	 }else if(data.title == "edit"){
        		 this.title="编辑处理";
        	 }else if(data.title == "view"){
        		 this.title="处理详情";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改处理";
        	 }else{
        		 this.title="";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/help/answer/view.html");
        	 this.edit_html = require("text!template/page/help/answer/edit.html");
//        	 this.batchedit_html=require("text!template/page/help/answer/batchedit.html");
        	 
        	 this.height = "580px";
        	 if(_this.rdata.tids){
        		 this.height="230px";
        	 }
        	 _this.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){ $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});   }
             }, {"title":_this.title ,"width":"1000px","height":_this.height,"icon":"iconfont icon-mdliucheng",
            	 full:false, layer:false,btns: ['min','max','close'],
            	 "resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.rdata.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "feedbackview", "post" : { "usercode":mdboss.usercode, "tid":_this.rdata.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["feedbackview"];
                 		 		if(_this.rdata.view){//详情
                 		 			var templateA=Handlebars.compile(_this.view_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			console.log(resData.content);
                 		 			var html = resData.content ;
                 		 			$("#feedbackView").html($(html));
                 		 			$("#module_form_info").mCustomScrollbar({scrollButtons:{
                 		 				enable:false }, theme: "darkblue",horizontalScroll:false,
                 		 			});
                 		 			$("#feedbackView").mCustomScrollbar({scrollButtons:{
                 						enable:false }, theme: "darkblue",horizontalScroll:false,
                                    });
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.edit_html);
                 		 			var uuid =  mdboss.getuuid();
                 		 			resData.uuid = uuid;
                 		 			_this.uuid = uuid;
                		 			var html=template({"uuid":uuid,"creator":mdboss.getUserinfo().username, "createtime":mdboss.getDate() ,"title":_this.rdata.name, "issuecode":_this.rdata.issuecode});
        	           		 		 
                 		 			
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
//                 		 			
//                 		 			_this.dataselect(resData.issuetype, resData.status , resData.issuelevel);
                 		 			UE.getEditor('feedbackEditor_'+uuid,{
	               	                 	 initialFrameWidth :"100%",//设置编辑器宽度
	               	                 	 initialFrameHeight:250,//设置编辑器高度
	               	                 	 scaleEnabled:true,
                                	 }).addListener("ready", function () {
                        		         this.setContent(resData.content);
                        			});;
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
        		 			 
        		 		 }else{
        		 			 template=Handlebars.compile(_this.edit_html);
        		 			 var uuid =  mdboss.getuuid();
        		 			 
        		 			var html=template({"uuid":uuid,"creator":mdboss.getUserinfo().username, "createtime":mdboss.getDate() ,"title":_this.rdata.name, "issuecode":_this.rdata.issuecode});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
//	           		 		 _this.dataselect();
	           		 		 _this.uuid = uuid;
		           		 	 _this.uED = UE.getEditor('feedbackEditor_'+uuid,{
		    	            	 initialFrameWidth :"100%",//设置编辑器宽度
		    	            	 initialFrameHeight:250,//设置编辑器高度
		    	            	 scaleEnabled:true
		           		 	 });
        		 			 $( "#module_form" ).validVal();
        		 		 }
        		 		 // 
//        		 		$("#feedbackContent").mCustomScrollbar({scrollButtons:{
// 	    					enable:false }, theme: "darkblue",horizontalScroll:false,
//	            		 });
                	}
                	 $("#moduleview").select2({width:'200'});
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dataselect:function(moduletype, status, level){//下拉列表数据获取
//        	 mdboss.dataselect(this, "isusetype", "OA_ISSUETYPE",moduletype);
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
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
	        	 var tid=_this.rdata.tid;
	        	 var issuecode=_this.$el.find("#issuecode").val();
	        	 var content = UE.getEditor('feedbackEditor_'+_this.uuid).getContent();
	        	 
	        	 if(issuecode);else issuecode= null; //
	        	 
	        	 var callback = _this.rdata.renderData;
	        	 var req = {};
	        	 if(tids){
	        		 req.usercode= mdboss.usercode;
	        	 }else{
	        		 req={"usercode":mdboss.usercode, "issuecode":issuecode,  "content": content,  };
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.answeradd;
	        	 if(tid){
	        		 url =mdboss.api.answeredit;
	        		 req.tid = tid;
	        		 req.updator = mdboss.usercode;
    				 req.updatetime = mdboss.getDate();
	        	 }else{
	        		 req.creator = mdboss.usercode;
    				 req.createtime = mdboss.getDate();
	        	 }
	        	 if(tids){
	        		 req.tids = tids;
	        		 url =mdboss.api.answerbatchedit;
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
	        			 callbackFn(_this.rdata.pview, _this.rdata.issuecode, _this.rdata.name);
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
        	 UE.getEditor('feedbackEditor_'+this.uuid).destroy();
        	 _this=this;
        	 _this.dialog.close();
 		},
     });
});