/**
 * 添加字号
 * 使用方法
  seajs.use("serialcode", function () {
      new mdboss.View.serialcode({callbacks:function(res){}});
   });
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss"), 
	$ = require("jquery"), 
	Dialog = require("dialog");
	require("fullcalendar");
	// 添加顺序号
	mdboss.View.serialcode = Backbone.View.extend({
		
		initialize : function(data) {
			this.callbacks=data.callbacks;
			this.dialog = new Dialog({
				type : "html",
				value : '<div class="loading"></div>',
				fillCallback : function() {}
			}, {
				"title" : "请填写新的字号并确认",
				"width" : "300px",
				"height" : "160px",
				"icon" : "iconfont icon-mdliucheng",
				"resize" : function() {
					$(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
				}
			}).show(function() {
				var _this = this;
				$.get("template/page/process/form/serialcode.html", function(html) {
					$(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
					$(_this).find(".loading").hide();
					$(_this.dialog).find(".loading").removeClass("loading");
				});
			});
			this.$el = this.dialog.$html;
		},
		events:{
			"click .btn-primary":"submit",
			"click .btn-sm":"cancel"
		},
		submit:function(e){
			_this=this;
				//添加顺序号数据
				$(_this.dialog).find(".loading");
				var serialcode =  $.trim(_this.$el.find("#js_zihao_value").val());
				var commonModel=new mdboss.Model.commonModel();
				$("#submit-loading").show();
		   		commonModel.save({"serialcode":serialcode,"usercode":mdboss.usercode},{url: mdboss.api["sunxu"],success:function(model,result){
		   			$("#submit-loading").hide();
            	   if(result.rc==1){
            		   $(_this.dialog).find(".loading").removeClass("loading");
		            	_this.callbacks({"serialcode":serialcode});
		            	_this.dialog.close();
            	   }else{
            		  mdboss.error(result.msg);
            	   }
		   		},error:function(){
		   			$("#submit-loading").hide();
		   			mdboss.error();
		   		}});
		},
		cancel:function(e){
			_this=this;
			_this.dialog.close();
		}
	});
});