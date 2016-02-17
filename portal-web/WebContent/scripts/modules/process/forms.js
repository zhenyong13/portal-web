/**
 * Created by jahon on 15/5/10.
 */

define(function (require, exports, module) {
	$ = require("jquery");
	require("upload");
	Dialog = require("dialog");
	require("validVal")($);

	mdboss.Model.formNewModel = Backbone.Model.extend({
		actionUrl:'',
		url:function(){
			return this.actionUrl;
		},
		initialize : function() {
		},
		updateForm:function(post,callback){
			this.actionUrl=mdboss.api.processStart;
			return this.save(post,{success:callback,error:function(){
				$("#submit-loading-mask").hide();
				$("#submit-loading").hide();
				mdboss.error();
				}});
		},
		submitForm:function(post,callback,error){
			return this.save(post,{url:mdboss.api.deployprocdef,success:callback,error:error});
		},
		editForm:function(post,callback,error){
			return this.save(post,{url:mdboss.api.editForm,success:callback,error:error});
		},
		deleteForm:function(post,callback){
			return this.save(post,{url:mdboss.api.deleteForm,success:callback,error:function(){
				$("#submit-loading-mask").hide();
				$("#submit-loading").hide();
				mdboss.error();
				}});
		}
    	
    });
	//部署流程
	mdboss.View.formNewView = Backbone.View.extend({
		$dialog:"",
		file:{},
		initialize : function(data) {
			_this=this;
			_this.data=data;
			var dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                    $(this).find(".jscroll").jScrollPane();
                }
            }, {"title":_this.data.window,"width":"500px","height":"350px","icon":"iconfont icon-mdliucheng","resize":function(){
                }}).show(function(){
                	$dialog=this;
                	 var template = Handlebars.compile(require("text!../../../template/page/process/form/uploadProcess.html"));
        			 var html = template({data:_this.data});//
                     $($dialog.dialog).find(".loading").removeClass("loading");
                     $(html).appendTo($($dialog.dialog).find(".dialog-content")).fadeIn();
                     mdboss.loadParentType(_this,"processtype","process",_this.data.processtype);
        			 mdboss.dataselect(_this, "isStart", "COMMON_STATE", _this.data.status, "200");
                });
			this.$el = dialog.$html;
		},
		events:{
			"click .js_form_submit":"form_submit",
			"click .js_form_cancel":"form_cancel",
			"change .js_file_upload":"file_upload",
			"click .js_del_file":"delfile",
		},
		delfile:function(e){
			_this=this;
			_this.file={};
			_this.$el.find("#file_list").html("");
		},
		file_upload:function(){
			_this=this;
			  var allowExtention = ".zip,.bar";
			  var filepath=$("#file_upload").val();
			  var ext=filepath.substring(filepath.lastIndexOf(".")).toLowerCase();
			  if(allowExtention.indexOf(ext)!=-1){
				  $.ajaxFileUpload({
		                url:mdboss.api.fileupload,//处理图片脚本
		                secureuri :false,
		                fileElementId :'file_upload',//file控件id
		                dataType : 'multipart/form-data',
		                success : function (data, status){
		                    if(data != 'undefined'){
		                    	var start=data.indexOf(">");
		                    	var end=data.lastIndexOf("<");
		                    	var json=eval('(' + data.substring(start+1,end)+ ')');
		                    	_this.file.id=json.id;
		                    	_this.file.name=json.name;
		                    	var html=new Array();
								html.push('<span class="file-show" style="margin-left:10px;">');
								html.push('<a class="filename_view js_file_view" data-file-id="'+_this.file.id+'">'+_this.file.name+'</a>');
								html.push('<a  href="'+baseConfig.avatar_url+_this.file.id+'" class="filename_view fa fa-download" target="_blank"></a>');
								html.push('<a data-fileid="'+_this.file.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
								html.push('</span>');
		                    	$("#file_list").html(html.join(''));
		                        }else{
		                        	mdboss.error(data.msg);
		                        }
		                    }
		                ,
		                error: function(data, status, e){
		                	mdboss.error(e);
		                }
		        });
			  }else{
				  mdboss.alert("文件格式不允许！"); 
				  return;
			  }
			  
		},
		form_submit:function(){
			console.log("sdf");
			_this=this;
			var newModel=new mdboss.Model.formNewModel();
			var usercode=mdboss.usercode;
			var processname=this.$el.find("#processname").val();//编辑时不为空
			var processcode=_this.$el.find("#processcode").val();//编辑时不为空
			var isenabled=_this.$el.find("#isStart").val();
			var processdesc=_this.$el.find("#opinion").val();
			var processtype=_this.$el.find("#processtype").val();
			var sortorder=_this.$el.find("#sortorder").val();
			
			if(sortorder);else sortorder = null ;
			if(processdesc);else processdesc = null ;
			if(isenabled);else isenabled = null ;
			
			
			if(_this.data.is_add){
				if(!this.file.id){
					mdboss.notifyTips("请上传流程定义文件在提交");
					return;
				}
				
				$("#submit-loading-mask").show();
				$("#submit-loading").show();
				var data={"usercode":usercode,"filecode":this.file.id,"filename":this.file.name,"isenabled":isenabled,"processdesc":processdesc,"processtype":processtype};
				data.sortorder = sortorder;
				newModel.submitForm(data,function(model,response){
					$("#submit-loading-mask").hide();
					$("#submit-loading").hide();
					if(response.rc==1){
						mdboss.notifyTips("部署成功");
						var callback = _this.data.callbacks;
		        		var callbackFn = typeof callback == "function" ? callback : function () { };
		        		callbackFn();
						$dialog.close();
					}else{
						mdboss.error(response.msg);
					}
				},function(){
					$("#submit-loading-mask").hide();
					$("#submit-loading").hide();
					mdboss.error();
				});
			}else{
				$("#submit-loading-mask").show();
				$("#submit-loading").show();
				var data={"usercode":usercode,"filecode":this.file.id,"processcode":processcode,"processname":processname,"isenabled":isenabled,"processdesc":processdesc,"processtype":processtype};
				data.sortorder = sortorder;
				newModel.editForm(data,function(model,response){
					$("#submit-loading-mask").hide();
					$("#submit-loading").hide();
					if(response.rc==1){
						mdboss.notifyTips("编辑成功");
						var callback = _this.data.callbacks;
		        		var callbackFn = typeof callback == "function" ? callback : function () { };
		        		callbackFn();
						$dialog.close();
					}else{
						mdboss.error(response.msg);
					}
				},function(){
					$("#submit-loading-mask").hide();
					$("#submit-loading").hide();
					mdboss.error();
				});
			}
			
			
		},
		form_cancel:function(){
			$dialog.close();
		}
	});
//部署流程 ---------------------------------------
//新建分类 ---------------------------------------s
mdboss.View.typeNewView = Backbone.View.extend({
		
		$dialog:"",
		initialize : function(data) {
			_this=this;
			v_this=this;
			v_this.rdata=data;
			this.title = "新建分类";
			if(data && data.title){
				this.title = data.title;
			}
			_this.dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                    $(this).find(".jscroll").jScrollPane();
                }
            }, {"title":this.title,"width":"500px","height":"320px","icon":"iconfont icon-mdliucheng","resize":function(){
                }}).show(function(){
                	var _this = this;
                	$dialog=this;
                	 var template = Handlebars.compile(require("text!template/page/process/form/processType.html"));
                	 if(v_this.rdata){
                		 var html = template(v_this.rdata);
                         $(_this.dialog).find(".loading").removeClass("loading");
                         $(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
                         console.log(v_this.rdata.parentcode);
                         console.log(v_this.rdata.status);
                         v_this.loadParentType(v_this.rdata.parentcode);
                         mdboss.dataselect(v_this, "status","COMMON_STATE",v_this.rdata.status, 205);
                         v_this.$el.find("#parend_type").hide();
                	 }else{
                		 var html = template();
                         $(_this.dialog).find(".loading").removeClass("loading");
                         $(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
                         v_this.loadParentType();
                         mdboss.dataselect(v_this, "status","COMMON_STATE",null, 205);
                	 }
                    
                     $(_this.dialog).find( ".js_processtypeform" ).validVal();
                });
			this.$el = _this.dialog.$html;
		},
		events:{
			"click .js_form_submit":"form_submit",
			"click .js_form_cancel":"form_cancel",
			"click .js_type_class":"icon_select"
		},
		loadParentType:function(pcode){//加载父分类  
			var v_this = this;
		   var tmpCondition = new Array();
          tmpCondition.push({"key":"typeclass","operate":"EqualTo","v1": "process"});
          tmpCondition.push({"key":"parentcode","operate":"EqualTo","v1": "-1"});
			mdboss.reqsubmit({"usercode":mdboss.usercode,"queryCondition":tmpCondition,"orderBy":"parentcode,sortorder","pageNo":1,"pageSize":0},
					mdboss.api.processtypelist,function(m, res){
				if(res.rc == 1){
					v_this.$el.find("#parentcode").empty();
					v_this.$el.find("#parentcode").append('<option value="-1">请选择</option>');
  	            	var tmp = res.data.rows;
  					  for(var i =0; i<tmp.length; i++){
  						  var htm ='<option value="'+tmp[i].typecode+'">'+tmp[i].typename+'</option>';
  						  if(pcode && pcode == tmp[i].typecode){
  							 htm ='<option value="'+tmp[i].typecode+'" selected="selected">'+tmp[i].typename+'</option>';
  						  }
  						  v_this.$el.find("#parentcode").append(htm);
  					  }
  					v_this.$el.find("#parentcode").select2({"width": "205"});
				}else{
					mdboss.error(res.msg);
				}
			});
		},
		icon_select:function(e){
			_this=this;
			$(e.currentTarget).attr("disabled",false);
			 seajs.use("iconselect", function () {
				 new mdboss.View.iconSelectView({parent:_this});
			 });
		},
		form_submit:function(){
			_this=this;
			  var form_data = _this.$el.find(".js_processtypeform").triggerHandler( "submitForm" );
    	      if ( form_data ) {
    	    		_this=this;
    				var name=_this.$el.find("#type_name").val();
    				var style=_this.$el.find("#type_class").val();
    				var parentcode=_this.$el.find("#parentcode").val();
    				var sortorder=_this.$el.find("#sortorder").val();
    				var status=_this.$el.find("#status").val();
    				var tid=_this.$el.find("#tid").val();
    				var typecode=_this.$el.find("#type_code").val();
    				
    				if(typecode);else typecode = null;
    				if(status);else status = null;
    				if(sortorder);else sortorder = null;
    				if(style);else style = null;
    				
    				var data={"usercode":mdboss.usercode,"parentcode":parentcode,"typename":name,"typeclass":"process","iconclass":style,
    						"sortorder":sortorder,"status":status};
    				var url = mdboss.api.processtypeadd;
    				var msg = "新建流程分类成功";
    				if(tid){
    					data.tid = tid;
    					data.typecode = typecode;
    					msg ="编辑流程分类成功";
    					url = mdboss.api.processtypeupdate;
    				}
    				var model=new mdboss.Model.formNewModel();
    				$("#submit-loading-mask").show();
    				$("#submit-loading").show();
    				model.save(data,{url:url,success:function(m,d){
    					$("#submit-loading-mask").hide();
    					$("#submit-loading").hide();
    					if(d.rc==1){
        					mdboss.notifyTips(msg);
        					Backbone.history.loadUrl();
        					_this.dialog.close();
    					}else{
    						mdboss.error(d.msg);
    					}
    					
    					
    				},error:function(){
    					mdboss.error( );
    				}});
    	      }
		},
		form_cancel:function(){
			_this=this;
			_this.dialog.close();
		}
	});
//新建分类 ---------------------------------------e
});