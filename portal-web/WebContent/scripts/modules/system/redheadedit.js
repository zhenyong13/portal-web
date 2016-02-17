define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.redheadeditFunc=function(data){
		new mdboss.View.redheadedit(data);
     };
     
	
     mdboss.View.redheadedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 //传入的参数
        	 _this.rdata=data;
        	 _this.ueditor=null;
        	 this.filecode="";
        	 this.uED=null;
        	 //标题
        	 this.width = "550px";
        	 if(data.title == "add"){
        		 this.title="新增红头模版";
        		 this.height = "300px";
        	 }else if(data.title == "edit"){
        		 this.title="编辑红头模版";
        		 this.height = "300px";
        	 }else if(data.title == "view"){
        		 this.title="红头模版详情";
        		 this.height = "345px";
        		 this.width = "550px";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改红头模版";
        		 this.height="300px";
        	 }else{
        		 this.title="";
        		 this.height="230px";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/system/redhead/view.html");
        	 this.edit_html = require("text!template/page/system/redhead/edit.html");
        	 this.batchedit_html=null;//require("text!template/page/system/redhead/batchedit.html");
        	 
        	 _this.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){ $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});   }
             }, {"title":_this.title ,"width": _this.width,"height":_this.height,"icon":"iconfont icon-mdliucheng",
            	 full:false, layer:true,btns: ['min','max','close'],
            	 "resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.rdata.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "redheadview", "post" : { "usercode":mdboss.usercode, "tid":_this.rdata.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["redheadview"];
                 		 		if(_this.rdata.view){//详情
                 		 			var templateA=Handlebars.compile(_this.view_html);
                 		 			resData.baseUrl=baseConfig.avatar_url;
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.edit_html);
                 		 			resData.baseUrl=baseConfig.avatar_url;
                 		 			var html=template(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			_this.dataselect(resData.reddoctype, resData.isenabled);
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
        		 			 var html=template({ });
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
//	           		 		 _this.dataselect();
        		 		 }else{
        		 			 template=Handlebars.compile(_this.edit_html);
        		 			 
        		 			var html=template({"creator":mdboss.getUserinfo().username, "createtime":mdboss.getDate()});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 _this.dataselect();
        		 			 $( "#module_form" ).validVal();
        		 		 }
        		 		 // 
                	}
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dataselect:function(redheadtype, isenabled){//下拉列表数据获取
        	 mdboss.dataselect(this, "redheadtype", "OA_REDDOCTYPE",redheadtype);
        	 mdboss.dataselect(this, "isenabled", "COMMON_STATE",isenabled);
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_dept':'selected_dept',//选择部门
        	 "click .js_form_cancel_":"jsformcancel",
        	 "focus #leader_man":'delegateMan',//搜索委托人
        	 "keyup #leader_man":'delegateManKey',//搜索委托人
        	 "click .js_file_view":"file_view",//文件查看 
        	 "change .js_fileupload_":'filecodeUpload',//文件上传上传
         },
         delegateManKey:function(e){//回车搜索
          	if(e.which ==13){
          		this.delegateMan(e);
          	}
          },
          delegateBack:function(pview, usercode, name){
         	 pview.$el.find("#cachetmanager").val(usercode);
          },
          delegateMan:function(e){
         	 mdboss.userselect(e, this, this.delegateBack);
          },
         filecodeUpload:function(e){
        	 var v_this = this;
        	 var $this  = $(e.currentTarget);
        	 var id = $this.attr("id");
//        	 var dataid = $this.attr("data-id");
//        	 var allowExtention = ".png,.gif,.jpg,jpeg";
//			  var filepath=$("#"+id).val();
//			  var ext=filepath.substring(filepath.lastIndexOf(".")).toLowerCase();
//			  if(allowExtention.indexOf(ext)!=-1){
	        	 mdboss.fileupload(id, function(json){
	        		 if(json!=undefined){
                  		 if(json.length!=undefined){
                  			 $(json).each(function(index,item){
                            		var html=new Array();
    								html.push('<span class="file-show" data-name="'+item.name+'" data-code="'+item.id+'">');
    								html.push('<a  class="filename_view  js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
    								html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="file_view fa fa-download" target="_blank"></a>');
    								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
    								html.push('</span>');
    		                    	$("#feedbackUpload-showfiles").append(html.join(''));
                            	});
	                         }else{
	                        	 item=json;
	                        	var html=new Array();
								html.push('<span class="file-show" data-name="'+item.name+'" data-code="'+item.id+'">');
								html.push('<a  class="filename_view  js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
								html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="file_view fa fa-download" target="_blank"></a>');
								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
								html.push('</span>');
		                    	$("#feedbackUpload-showfiles").append(html.join(''));
	                    }
                   }else{
                  	 mdboss.notifyTips("文件上传失败！");
                   }
	        	 });
//			  }else{
//				  mdboss.error("上传文件类型不正确!");
//			  }
         },
         selected_dept:function(){
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
        	 if(treeNode.id =="org--1"){
        		 parent.find("#parentcode").val("");
        		 parent.find("#parentname").val("");
        	 }else{
        		 parent.find("#parentcode").val(treeNode.id);
        		 parent.find("#parentname").val(treeNode.name);
        	 }
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
        
         submit:function(e){//提交
        	 _this=this;
        	 var form_data = $( "#module_form" ).triggerHandler( "submitForm" );
 	         if ( form_data ) {
	        	 var tid = _this.$el.find("#tid").val();
	        	 var redheadtype = _this.$el.find("#redheadtype").val();
	        	 var isenabled =  _this.$el.find("#isenabled").val();
	        	 var reddocname = _this.$el.find("#reddocname").val();
	        	 var cacheturlUpload = _this.$el.find("#feedbackUpload-showfiles span:eq(0)").data("code"); 
	        	 
	        	 if(cacheturlUpload);else {mdboss.error("请上传模版"); return false;}
	        	 
	        	 var callback = _this.rdata.renderData;
	        	 var req = {"usercode":mdboss.usercode, "reddoctype":redheadtype, "reddocname":reddocname,
	        				 "filecode": cacheturlUpload,"isenabled": isenabled };
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.redheadadd;
	        	 if(tid){
	        		 url =mdboss.api.redheadedit;
	        		 req.tid = tid;
	        	 }else{
	        		 req.creator = mdboss.usercode;
    				 req.createtime = mdboss.getDate();
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