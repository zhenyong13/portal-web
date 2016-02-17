
define(function(require, exports, module) {
	$ = require("jquery");
	var mdboss = require("mdboss");
	// 公文流程
	mdboss.Model.diagramModel = Backbone.Model.extend({
		_this:this,
		actionUrl:'',
		url:function(){
			return this.actionUrl;
		},
		initialize : function() {
		},
		fetchDiagram:function(post,url){
			this.actionUrl=url;
			return this.save(post);
		},
		fetchActivity:function(post,url){
			this.actionUrl=url;
			return this.save(post);
		}
	});
	mdboss.View.diagramView = Backbone.View.extend({
		$el:'',
		initialize : function(data) {
			this.models=data.model;
			this.$el=data.$el;
			this.is_start=data.is_start;
			this.template=require("text!template/page/process/form/flowsheet.html");
		},
		render:function(post){
			_this=this;
			this.$el.html(this.template);
			var diagramUrl=mdboss.api.diagram;
			var activityUrl=mdboss.api.activitytrack;
			var imgModel=new mdboss.Model.commonModel();
			var imgtemplate=Handlebars.compile(_this.$el.find("#activity-img-temp").html());
			console.log(imgtemplate());
			imgModel.save(post,{url:diagramUrl,success:function(model,response){
				var imgurl=baseConfig.base+"download?filecode="+response.data.filecode;
				_this.$el.find("#processimage").html(imgtemplate({"imgurl":imgurl}));
				_this.showhtml();
			},error:function(){
				mdboss.error( );
			}});
			var activityModel=new mdboss.Model.commonModel();
			var activitytemplate=Handlebars.compile(_this.$el.find("#activity-records-temp").html());
			activityModel.save(post,{url:activityUrl,success:function(model,res){
				if(res.rc==1){
					console.log(res.data);
					_this.$el.find("#flowsheet_table").html(activitytemplate({"activity":res.data}));
					_this.showhtml();
				}else{
					mdboss.error(res.msg);
				}
				
			},error:function(){
				mdboss.error( );
			}});
			return this;
		},
		showhtml:function(){
			_this=this;
			this.$el.find(".jscroll").jScrollPane();
			$(".flowsheet_title_img").load(function(){
				_this.$el.find(".jscroll").jScrollPane();
			}).error(function(){
				_this.$el.find(".jscroll").jScrollPane();
			});
		}
	});
});