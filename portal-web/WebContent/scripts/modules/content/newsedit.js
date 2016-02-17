define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("upload");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.newseditFunc=function(data){
		new mdboss.View.newsedit(data);
     };
     
	
     mdboss.View.newsedit = Backbone.View.extend({
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
        		 this.title="创建新闻";
        	 }else if(data.title == "publish"){
        		 this.title="发布新闻";
        	 }else if(data.title == "edit"){
        		 this.title="编辑新闻";
        	 }else if(data.title == "view"){
        		 this.title="新闻详情";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改新闻";
        	 }else{
        		 this.title="";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/content/news/view.html");
        	 this.edit_html = require("text!template/page/content/news/edit.html");
        	 this.batchedit_html=require("text!template/page/content/news/batchedit.html");
        	 
        	 this.height = "580px";
        	 if(_this.rdata.tids){
        		 this.height="230px";
        	 }
        	 _this.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){ $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});   }
             }, {"title":_this.title ,"width":"1100px","height":_this.height,"icon":"iconfont icon-mdliucheng",
            	 full:false, layer:false,btns: ['min','max','close'], "resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.rdata.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "feedbackview", "post" : { "usercode":mdboss.usercode, "tid":_this.rdata.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["feedbackview"];
	                        	 resData.attachment=eval("("+resData.attachment+")");
	                        	 
                 		 		if(_this.rdata.view){//详情
                 		 			var templateA=Handlebars.compile(_this.view_html);
                 		 			console.log(resData);
                 		 			
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			
                 		 			var html = resData.content ;
                 		 			$("#feedbackView").html($(html));               		 			
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.edit_html);
                 		 			var uuid =  mdboss.getuuid();
                 		 			resData.uuid = uuid;
                 		 			_this.uuid = uuid;
                 		 			
                 		 			var html=template(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			
                 		 			_this.dataselect(resData.topshow, resData.newstype, resData.status );
                 		 			UE.getEditor('feedbackEditor_'+uuid,{
	               	                 	 initialFrameWidth :"100%",//设置编辑器宽度
	               	                 	 initialFrameHeight:220,//设置编辑器高度
	               	                 	 scaleEnabled:true,
                                	 }).addListener("ready", function () {
                        		         this.setContent(resData.content);
                        			});;
                 		 			$( "#module_form" ).validVal();
                 		 		}
	                         }else {
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
		    	            	 initialFrameHeight:220,//设置编辑器高度
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
                	 dialog.$html.find(".dialog-content").mCustomScrollbar({scrollButtons:{
   		 				enable:false }, theme: "darkblue",horizontalScroll:false,
   		 			 });
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dataselect:function(topshow, newstype , status){//下拉列表数据获取
        	 mdboss.dataselect(this, "topshow", "COMMON_YESORNO",topshow);
        	 mdboss.dataselect(this, "newstype", "CMS_NEWSTYPE",newstype);
        	 mdboss.dataselect(this, "status", "CMS_NEWSSTATUS",status);
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 "change .js_new_img_upload":"jsNewImgUpload",//新闻图片上传
        	 "change .js_file_upload":"file_upload",
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
         jsNewImgUpload:function(e){//新闻图片上传
        	 _this=this;
        	 var allowExtention = ".jpg,.png,.JPEG";
			  var filepath=$("#newsImgUpload").val();
			  var ext=filepath.substring(filepath.lastIndexOf(".")).toLowerCase();
			  if(allowExtention.indexOf(ext) < 0){
				  mdboss.alert("上传的图片格式不对!");
				  return false;
			  }
         	   //上传文件
             $.ajaxFileUpload({
                 url:mdboss.api.fileupload,//处理图片脚本
                 secureuri :false,
                 fileElementId :'newsImgUpload',//file控件id
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
      								html.push('<a  class="js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
      								html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="filename_view fa fa-download" target="_blank"></a>');
      								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
      								html.push('</span>');
      		                    	$("#newsImg-showfiles").append(html.join(''));
                              	});
	                         }else{
	                        	 item=json;
	                        	var html=new Array();
								html.push('<span class="file-show" style="margin-left:10px;" data-name="'+item.name+'" data-code="'+item.id+'">');
								html.push('<a  class="js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
								html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="filename_view fa fa-download" target="_blank"></a>');
								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
								html.push('</span>');
		                    	$("#newsImg-showfiles").append(html.join(''));
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
         file_upload:function(){//附件上传
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
        								html.push('<a  class="js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
        								html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="filename_view fa fa-download" target="_blank"></a>');
        								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
        								html.push('</span>');
        		                    	$("#feedbackUpload-showfiles").append(html.join(''));
                                	});
  	                         }else{
  	                        	 item=json;
  	                        	var html=new Array();
								html.push('<span class="file-show" style="margin-left:10px;" data-name="'+item.name+'" data-code="'+item.id+'">');
								html.push('<a  class="js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
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
//        	 var tids = _this.rdata.tids;
        	 var form_data = $( "#module_form" ).triggerHandler( "submitForm" );

        	 if ( form_data ) {
	        	 var tid=$("#tid").val();
	        	 var reqData = {};
	        	 mdboss.elementValue(_this , reqData, "title");
	        	 mdboss.elementValue(_this , reqData, "source");
	        	 mdboss.elementValue(_this , reqData, "newstype");
	        	 mdboss.elementValue(_this , reqData, "topshow");
	        	 mdboss.elementValue(_this , reqData, "status");
	        	 mdboss.elementValue(_this , reqData, "creator");
	        	 mdboss.elementValue(_this , reqData, "createtime");
	        	 var content = UE.getEditor('feedbackEditor_'+_this.uuid).getContent();
	        	 reqData.content = content;
	        	 var img = null;
	        	//图片
	        	 _this.$el.find("#newsImg-showfiles").find(".file-show").each(function(index,item){
	        		 var code=$(item).data("code");
	        		 img = code;
	        	 });
	        	 if(img){
	        		 reqData.showimg = true;
	        	 }else{
	        		 reqData.showimg = false;
	        	 }
	        	 reqData.img= img;
	        	 
	        	 if(!reqData.topshow||reqData.topshow==''){
	        		 mdboss.notifyTips("请选择是否置顶");
	        		 return;
	        	 }
	        	 
	        	 if(!reqData.newstype||reqData.newstype==''){
	        		 mdboss.notifyTips("请选择新闻分类");
	        		 return;
	        	 }
	        	 
	        	 if(!reqData.status||reqData.status==''){
	        		 mdboss.notifyTips("请选择发布状态");
	        		 return;
	        	 }

	        	 var tmpsubmit=new Array(); //附件
	        	 _this.$el.find("#feedbackUpload-showfiles").find(".file-show").each(function(index,item){
	    				var name=$(item).data("name");
	    				var code=$(item).data("code");
	    				tmpsubmit.push({"code":code,"name":name,"editable":true});//提交时数据//"editable":false
	    		 });
	        	 reqData.attachment= tmpsubmit;
	        	 
	        	 var callback = _this.rdata.renderData;
	        	 var url = mdboss.api.newsadd;   //新增,修改
	        	 if(tid){
	        		 url =mdboss.api.newsedit;
	        		 reqData.tid = tid;
	        	 }else{
	        		 reqData.creator = mdboss.usercode;
	        		 reqData.createtime = mdboss.getDate();
	        	 }
	        	 reqData.usercode = mdboss.usercode;
	        	 var commonModel=new mdboss.Model.commonModel();
				 commonModel.save(reqData, {url:url,success:function(model,res){
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