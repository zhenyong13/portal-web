/**
 * Created by jahon on 15/5/10.
 */

define(function (require, exports, module) {
	$ = require("jquery");
	require("upload");
	require("select2");
	Dialog = require("dialog");
	require("validVal")($);

	
	mdboss.Model.WfsFormModel = Backbone.Model.extend({
		actionUrl:'',
		url:function(){
			return this.actionUrl;
		},
		initialize : function() {
		},
		updateForm:function(post,callback){
			this.actionUrl=mdboss.api.formchg;
			return this.save(post,{success:callback,error:function(){
				$("#submit-loading-mask").hide();
				$("#submit-loading").hide();
				mdboss.error();}});
		},
		submitForm:function(post,callback,error){
			return this.save(post,{url:mdboss.api.formadd,success:callback,error:error});
		},
		editForm:function(post,callback,error){
			return this.save(post,{url:mdboss.api.formchg,success:callback,error:error});
		},
		copyForm:function(post,callback){
			return this.save(post,{url:mdboss.api.duplicate,success:callback,error:function(){
				$("#submit-loading-mask").hide();
				$("#submit-loading").hide();
				mdboss.error();}});
		},
		deleteForm:function(post,callback){
			return this.save(post,{url:mdboss.api.formdel,success:callback,error:function(){mdboss.error();}});
		}
    	
    });
	
	//新建表单
	mdboss.View.WfsFormView = Backbone.View.extend({
		$dialog:"",
		initialize : function(data) {
			_this=this;
			_this.data=data;
			_this.iscopy=data.is_copy;
			_this.dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                    $(this).find(".jscroll").jScrollPane();
                }
            }, {"title":_this.data.window,"width":"500px","height":"290px","icon":"iconfont icon-mdliucheng","resize":function(){
                }}).show(function(){
                	$dialog=this;
                	 var template = Handlebars.compile(require("text!template/page/wfsform/newForm.html"));
                	 
        			 var html = template({data:_this.data});
                     $($dialog.dialog).find(".loading").removeClass("loading");
                     $(html).appendTo($($dialog.dialog).find(".dialog-content")).fadeIn();
                     
                     mdboss.loadParentType(_this,"formtype","form",_this.data.formtype);
        			 mdboss.dataselect(_this, "isStart", "COMMON_STATE", _this.data.isenabled, "200");
                     $( ".process-forms" ).validVal();
                	
             });
			this.$el = _this.dialog.$html;
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
		},
		form_submit:function(){
			_this=this;
			var form_data = $( ".process-forms" ).triggerHandler( "submitForm" );
	        if ( form_data ) {
				var newModel=new mdboss.Model.WfsFormModel();
				var usercode=mdboss.usercode;
				var formname=this.$el.find("#formname").val();//编辑时不为空
				var formurl=_this.$el.find("#form_url").val();//表单url
				var formcode=_this.$el.find("#formcode").val();//编辑时不为空
				var isenabled=_this.$el.find("#isStart").val();
				var formdesc=_this.$el.find("#formdesc").val();
				var formtype=_this.$el.find("#formtype").val();//表单类型
				var sortorder=_this.$el.find("#sortorder").val();//序号
				var token=_this.$el.find("#token").val();//表单类型
				if(_this.data.is_add){
					$("#submit-loading-mask").show();//添加遮罩
					$("#submit-loading").show();
					var data={"usercode":usercode,"formname":formname, "url":formurl,"isenabled":isenabled,"formdesc":formdesc,"formtype":formtype,"sortorder":sortorder};
					console.log(data);
					newModel.submitForm(data,function(model,response){
						$("#submit-loading-mask").hide();
						$("#submit-loading").hide();
						if(response.rc==1){
							mdboss.notifyTips("新建成功");
							var callback = _this.data.callbacks;
  		        			var callbackFn = typeof callback == "function" ? callback : function () { };
  		        			callbackFn();
							_this.dialog.close();
						}else{
							mdboss.error(response.msg);
						}
					},function(){
						$("#submit-loading-mask").hide();
						$("#submit-loading").hide();
						mdboss.error();
					});
				}else{
					if(_this.iscopy){
						var data={"usercode":usercode,"formcode":formcode,"formname":formname,"url":formurl,"isenabled":isenabled,"formdesc":formdesc,"formtype":formtype,"sortorder":sortorder};
						newModel.copyForm(data,function(model,response){
							if(response.rc==1){
								mdboss.notifyTips("复制成功");
								var callback = _this.data.callbacks;
	  		        			var callbackFn = typeof callback == "function" ? callback : function () { };
	  		        			callbackFn();
								_this.dialog.close();
							}else{
								mdboss.error(response.msg);
							}
						});
						
					}else{
						$("#submit-loading-mask").show();//添加遮罩
						$("#submit-loading").show();
						var data={"usercode":usercode,"formcode":formcode,"formname":formname,"url":formurl,"isenabled":isenabled,"formdesc":formdesc,"formtype":formtype,"token":token,"sortorder":sortorder};
						newModel.editForm(data,function(model,response){
							$("#submit-loading-mask").hide();
							$("#submit-loading").hide();
							if(response.rc==1){
								mdboss.notifyTips("编辑成功");
								var callback = _this.data.callbacks;
	  		        			var callbackFn = typeof callback == "function" ? callback : function () { };
	  		        			callbackFn();
								_this.dialog.close();
							}else{
								mdboss.error(response.msg);
							}
						},function(){
							$("#submit-loading-mask").hide();
							$("#submit-loading").hide();
							mdboss.error();
						});
					}
					
				}
	        }
		},
		form_cancel:function(){
			_this=this;
			_this.dialog.close();
		}
	});
//新建表单 ---------------------------------------
	
//新建分类 ---------------------------------------s
mdboss.View.WfsFormTypeView = Backbone.View.extend({
		
		$dialog:"",
		initialize : function(data) {
			v_this = this;
			_this=this;
			this.rdata=data;
			this.title = "新建表单分类";
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
                	 var template = Handlebars.compile(require("text!template/page/wfsform/formType.html"));
                	 if(v_this.rdata && v_this.rdata.tid){
                		 var html = template(v_this.rdata);
                         $(_this.dialog).find(".loading").removeClass("loading");
                         $(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
                         v_this.loadParentType(v_this.rdata.parentcode);
                         mdboss.dataselect(v_this, "status","COMMON_STATE",v_this.rdata.status, 205);
                         $("#parenttype_code").hide();
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
		loadParentType:function(pcode){//加载父分类 
			var v_this = this;
		   var tmpCondition = new Array();
          tmpCondition.push({"key":"typeclass","operate":"EqualTo","v1": "form"});
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
		events:{
			"click .js_form_submit":"form_submit",
			"click .js_form_cancel":"form_cancel",
			"click .js_type_class":"icon_select"
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
    				var type=_this.$el.find("#type_class").val();
    				var parentcode=_this.$el.find("#parentcode").val();
    				var sortorder=_this.$el.find("#sortorder").val();
    				var status=_this.$el.find("#status").val();
    				
    				var tid=_this.$el.find("#tid").val();
    				var typecode=_this.$el.find("#type_code").val();
    				
    				var model=new mdboss.Model.WfsFormModel();
    				$("#submit-loading-mask").show();//添加遮罩
					$("#submit-loading").show();
    				var data= {usercode:mdboss.usercode,"typename":name,"typeclass":"form","iconclass":type,"parentcode":parentcode,"status":status,"sortorder":sortorder};
    				var url = mdboss.api.processtypeadd;
    				if(tid){
    					data.tid = tid;
    					data.typecode = typecode;
    					url = mdboss.api.processtypeupdate;
    				}
    				
    				model.save(data,{url:url,success:function(model,response){
    					$("#submit-loading-mask").hide();
    					$("#submit-loading").hide();
    					if(response.rc==1){
    						if(tid){
    							mdboss.notifyTips("编辑表单分类成功");
    						}else{
    							mdboss.notifyTips("新建表单分类成功");
    						}
        					Backbone.history.loadUrl();
        					_this.dialog.close();
    					}else{
    						mdboss.error(response.msg);
    					}
    					
    				},error:function(){
    					mdboss.error();
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