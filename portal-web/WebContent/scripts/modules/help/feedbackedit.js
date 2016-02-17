define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("upload");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.feedbackeditFunc=function(data){
		new mdboss.View.feedbackedit(data);
     };
     
	
     mdboss.View.feedbackedit = Backbone.View.extend({
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
        		 this.title="新增问题";
        	 }else if(data.title == "edit"){
        		 this.title="编辑问题";
        	 }else if(data.title == "view"){
        		 this.title="问题详情";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改问题";
        	 }else{
        		 this.title="";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/help/feedback/view.html");
        	 this.edit_html = require("text!template/page/help/feedback/edit.html");
        	 this.batchedit_html=require("text!template/page/help/feedback/batchedit.html");
        	 
        	 this.height = "550px";
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
                 		 			resData.filecodes =   JSON.parse(resData.filecodes);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			
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
                 		 			resData.filecodes =   JSON.parse(resData.filecodes);
                 		 			var html=template(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
//                 		 			
                 		 			_this.dataselect(resData.issuetype, resData.status , resData.issuelevel);
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
        		 			 template=Handlebars.compile(_this.batchedit_html);
        		 			 var html=template({"creator":mdboss.getUserinfo().username, "createtime":mdboss.getDate()});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 _this.dataselect();
        		 		 }else{
        		 			 template=Handlebars.compile(_this.edit_html);
        		 			 var uuid =  mdboss.getuuid();
        		 			 
        		 			var html=template({"uuid":uuid,"creator":mdboss.getUserinfo().username, "createtime":mdboss.getDate()});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 _this.dataselect();
	           		 		 _this.uuid = uuid;
		           		 	 _this.uED = UE.getEditor('feedbackEditor_'+uuid,{
		    	            	 initialFrameWidth :"100%",//设置编辑器宽度
		    	            	 initialFrameHeight:250,//设置编辑器高度
		    	            	 scaleEnabled:true
		           		 	 });
        		 			 $( "#module_form" ).validVal();
        		 			 
        		 			$("#backedit_div").mCustomScrollbar({scrollButtons:{
     	    					enable:false }, theme: "darkblue",horizontalScroll:false,
    	            		 });
        		 		 }
        		 		 // 
        		 		
                	}
                	 $("#moduleview").select2({width:'200'});
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dataselect:function(moduletype, status, level){//下拉列表数据获取
        	 mdboss.dataselect(this, "isusetype", "OA_ISSUETYPE",moduletype);
//        	 mdboss.dataselect(this, "status", "OA_ISSUESTATUS",status);
//        	 mdboss.dataselect(this, "isuselevel", "OA_ISSUELEVEL",level);
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 "change .js_file_upload":"file_upload",
        	 "click .js_form_submit_":"batchUpdata",
        	 "click .js_form_cancel_":"jsformcancel",
        	 "click .js_file_view":"file_view",//文件查看 
         },
         file_view:function(e){
         	var filecode=$(e.currentTarget).data("file-id");
         	seajs.use("review", function () {
         		new mdboss.View.fileReview({model:new mdboss.Model.commonModel( 
    	      			 {"filecode":filecode,"baseurl":baseConfig.base}
    	           )});
         	});
         },
         jsformcancel:function(e){
        	 _this=this;
        	 _this.dialog.close();
         },
         batchUpdata:function(e){
        	 _this=this;
        	 var tids = _this.rdata.tids;
    		 
        	 var req = {};
        	 req.usercode= mdboss.usercode;
        	 req.tids = tids;
        	 var isusetype=_this.$el.find("#isusetype").val();
        	 var status=_this.$el.find("#status").val();
        	 var isuselevel=_this.$el.find("#isuselevel").val();
        	 
        	 if(isusetype) req.issuetype = isusetype; 
        	 if(status) req.status = status; 
        	 if(isuselevel) req.issuelevel = isuselevel; 
        	 
        	 var callback = _this.rdata.renderData;
        	 var url = mdboss.api.modulebatchedit;
    		
        	 var commonModel=new mdboss.Model.commonModel();
			 commonModel.save(req, {url:url,success:function(model,res){
        		 if(res.rc==1){
        			 mdboss.notifyTips("修改成功！");
        			 var callbackFn = typeof callback == "function" ? callback : function () { };
        			 callbackFn(_this.rdata.pview); //回调刷新列表
        			 _this.jsformcancel();
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 },error:function(){
        		 mdboss.error();
        	 }});
         },
         file_upload:function(){
          	 _this=this;
           	   //上传文件
               $.ajaxFileUpload({
                   url:mdboss.api.fileupload,//处理图片脚本
                   secureuri :false,
                   fileElementId :'feedbackUpload',//file控件id
                   dataType : 'multipart/form-data',
                   success : function (data, status){
                       if(data != 'undefined'){
                      	var start=data.indexOf(">");
                      	var end=data.lastIndexOf("<");
                      	var json=eval('(' + data.substring(start+1,end)+ ')');
                      	 if(json!=undefined){
                      		 if(json.length!=undefined){
                      			 $(json).each(function(index,item){
                                		var html=new Array();
        								html.push('<span class="file-show" style="margin-left:10px;" data-name="'+item.name+'" data-code="'+item.id+'">');
        								html.push('<a  class="file_view  js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
        								html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="filename_view fa fa-download" target="_blank"></a>');
        								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
        								html.push('</span>');
        		                    	$("#feedbackUpload-showfiles").append(html.join(''));
                                	});
  	                         }else{
  	                        	 item=json;
  	                        	var html=new Array();
								html.push('<span class="file-show" style="margin-left:10px;" data-name="'+item.name+'" data-code="'+item.id+'">');
								html.push('<a  class="file_view  js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
								html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="filename_view fa fa-download" target="_blank"></a>');
								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
								html.push('</span>');
		                    	$("#feedbackUpload-showfiles").append(html.join(''));
		                    	_this.dialog.find(".jscroll").jScrollPane();
  	                         }
                  			 _this.dialog.find(".jscroll").jScrollPane();
                       }else{
                      	 mdboss.notifyTips("文件上传失败！");
                       }
                   }
                  },
                   error: function(data, status, e){
                	   mdboss.error(e);
                   }
           });
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
	        	 var title=_this.$el.find("#title").val();
	        	 var issuecode=_this.$el.find("#issuecode").val();
	        	 var isusetype=_this.$el.find("#isusetype").val();
	        	 var status=_this.$el.find("#status").val();
	        	 var isuselevel=_this.$el.find("#isuselevel").val();
	        	 var content = UE.getEditor('feedbackEditor_'+_this.uuid).getContent();
	        	 var tmpsubmit=new Array();
//	        	 tmpsubmit.push({"code":"code","name":"name","editable":false});
	        	 _this.$el.find("#feedbackUpload-showfiles").find(".file-show").each(function(index,item){
	    				var name=$(item).data("name");
	    				var code=$(item).data("code");
//	    				var isedit=$(item).data("isedit");
//	    				console.log($(item));
	    				tmpsubmit.push({"code":code,"name":name,"editable":true});//提交时数据//"editable":false
	    		 });
	        	 
	        	 if(isusetype);else isusetype= null; //
	        	 if(title);else title= null; //
	        	 if(issuecode);else issuecode= null; //
	        	 
	        	 var callback = _this.rdata.renderData;
	        	 var req = {};
	        	 if(tids){
	        		 req.usercode= mdboss.usercode;
	        	 }else{
	        		 req={"usercode":mdboss.usercode, "issuecode":issuecode, "issuelevel":isuselevel,"status":status,
	        				 "title": title,"content": content, "issuetype": isusetype, "filecodes":JSON.stringify(tmpsubmit)};
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.feedbackadd;
	        	 if(tid){
	        		 url =mdboss.api.feedbackedit;
	        		 req.tid = tid;
	        	 }else{
	        		 req.creator = mdboss.usercode;
    				 req.createtime = mdboss.getDate();
	        	 }
	        	 if(tids){
	        		 req.tids = tids;
	        		 url =mdboss.api.feedbackbatchedit;
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
        	 UE.getEditor('feedbackEditor_'+this.uuid).destroy();
        	 _this=this;
        	 _this.dialog.close();
 		},
     });
});