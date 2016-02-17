
define(function(require, exports, module) {
	var mdboss = require("mdboss"), 
	$ = require("jquery");
	mdboss.Model.commonModel = Backbone.Model.extend({
		actionUrl:"",
		url:function(){
			return this.actionUrl;
		},
		deleCommonLang:function(id){
			this.actionUrl=mdboss.api.delcommonopinion;
			return this.save({"usercode":mdboss.usercode,"id":id},{error:function(){
				mdboss.error();
			}});
		},
		addCommonLang:function(content){
			this.actionUrl=mdboss.api.addcommonopinion;
			return this.save({"usercode":mdboss.usercode,"commonopinion":content},{error:function(){
				mdboss.error();
			}});
		}
	});
	//常用语
	mdboss.Model.commonLangModel = Backbone.Model.extend({
		_this:this,
		actionUrl:'',
		url:function(){
			return this.actionUrl;
		},
		initialize : function() {
		},
		fetchCommonLang:function(){
			this.actionUrl=mdboss.api.querycommonopinion;
			return this.save({"usercode":mdboss.usercode},{error:function(){
				mdboss.error();
			}});
		}
		
	});
	mdboss.View.commonLangView = Backbone.View.extend({
		$el:'',
		initialize : function(data) {
			this.new_common=$("#newCommonLang").val();
			this.$el=$(data.dialog.dialog).find(".dialog-content");
			this.dialog=data.dialog;
			this.template=Handlebars.compile(require("text!../../../template/page/process/form/commonLang.html"));
			this.parent=data.parent;
			this.callbacks=data.callbacks;
		},
		events:{
			"dblclick .js_common_content":"selected_common",
			"click input[name=normal]":"common_checked",
			"click .js_delete_common":"delete_common",
			"click .js_add_common":"add_common",
			"click .js_set_common":"set_common",
			"click .js_submit_common":"submit_common"
		},
		submit_common:function(){
			this.parent.$el.find("#opinion").val($("#normalcontent").val());
			var callbackFn = typeof this.callbacks== "function" ? this.callbacks: function () { };	
			callbackFn(this.parent);
			this.dialog.close();
		},
		set_common:function(){
			_this=this;
			var span=new Array();
			var common=new Array();
			_this.$el.find("input[name=normal]:checked").each(function(index,item){
				var content=$(item).data("content");
				common.push(content);
				content=content.length>3?content.substr(0,3)+"...":content;
				span.push('<a class="js_span_common" style="margin-right:5px;cursor: pointer;" data-content="'+$(item).data("content")+'">'+content+'</a>');
			});
			_this.parent.$el.find(".js_common_show").html(span.join(''));
			var model=new mdboss.Model.commonModel();
			model.save({"usercode":mdboss.usercode,"contents":common,"state":1},{url:mdboss.api.chgcommonopinion,success:function(model,response){
				_this.render();
			},error:function(){
				mdboss.error();
			}});
		},
		add_common:function(){
			_this=this;
			var commonlang=$("#newCommonLang").val();
			if($.trim(commonlang)==""){
				mdboss.error("新增常用语不能为空！");
				return;
			}
			var model=new mdboss.Model.commonModel();
			model.save({"usercode":mdboss.usercode,"content":$("#newCommonLang").val()},{url:mdboss.api.addcommonopinion,success:function(model,response){
				_this.render();
			},error:function(){
				mdboss.error();
			}});
		},
		common_checked:function(e){
        	if(this.$el.find("input[name=normal]:checked").length>5){
        		mdboss.notifyTips("最多只能设定5个常用语！");
        		return false;
        	}
		},
		delete_common:function(e){
			_this=this;
			var content=$(e.currentTarget).parent().find(".js_common_content").data("content");
			mdboss.confirm("您确定要删除吗？",function(f){
				if(f){
					var model=new mdboss.Model.commonModel();
					model.save({"usercode":mdboss.usercode,"content":content},{url:mdboss.api.delcommonopinion,
						success:function(model,response){
						_this.render();
					},error:function(){
						mdboss.error();
					}});
				}
			});
			
		},
		selected_common:function(e){
			this.$el.find("#normalcontent").val($(e.currentTarget).data("content"));
		},
		render:function(){
			_this=this;
			var model=new mdboss.Model.commonLangModel();
			model.save({"usercode":mdboss.usercode},{url:mdboss.api.querycommonopinion,success:function(model,response){
				_this.result(response);
			},error:function(){
				mdboss.error();
			}});
			return this;
		},
		result:function(response){
			if(response.data){
				this.commonLang(response);
				this.showhtml();
			}
		},
		commonLang:function(response){
			if(response.rc==1){
				var commons=new Array();
				if(response.data!=undefined&&response.data.rows!=undefined){
					 $.each(response.data.rows,function(index,item){
	               		  var content=item.content;
	               		  commons.push({"title":content.length>16?content.substr(0,16)+"...":content,"content":content,"id":item.id,"state":item.state});
	                 });
					this.commonData=commons;
				}else{
					this.commonData=new Array();
				}
				
			}else{
				mdboss.error(response.msg);
			}
		},
		showhtml:function(){
				this.$el.html(this.template({"commonLangs":this.commonData}));
				this.$el.find(".jscroll").jScrollPane();
		}
	});
});