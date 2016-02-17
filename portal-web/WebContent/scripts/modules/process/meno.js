/**
 * 公文便签新建
 * 使用方法
  seajs.use("meno", function () {
      var meno=new mdboss.Model.processMeno();
      new mdboss.View.processMeno(meno);
   });
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss"), 
	$ = require("jquery"), 
	Dialog = require("dialog");
	require("fullcalendar");
	/* 公文便签新建 */
	mdboss.Model.processMeno = Backbone.Model.extend({
		initialize: function(){  
        },  
        defaults: {  
            meno:''
        }
	});

	// 公文便签新建
	mdboss.View.processMeno = Backbone.View.extend({
		
		initialize : function(data) {
			_this = this;
			var _model = data.model;
			this.callbacks=data.callbacks;
			_this.dialog = new Dialog({
				type : "html",
				value : '<div class="loading"></div>',
				fillCallback : function() {}
			}, {
				"title" : "请填写便签意见,并确认",
				"width" : "300px",
				"height" : "160px",
				"icon" : "iconfont icon-mdliucheng",
				"resize" : function() {
					$(_this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
				}
			}).show(function() {
				var _this = this;
				$.get("template/page/process/form/memo.html", function(html) {
					$(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();

					$(_this).find(".loading").hide();
					$(_this.dialog).find(".loading").removeClass("loading");
				});
			});
			this.$el = _this.dialog.$html;
		},
		events:{
			"click .btn-primary":"submit",
			"click .btn-sm":"cancel"
		},
		submit:function(e){
			_this=this;
			//获取便签数据 
			var meno =  $("#processMeno").val();
			 var createtime=$.fullCalendar.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
			 //添加便签到缓存
			_this.callbacks({"userinfo": mdboss.cache.data.getMyInfo,"createtime":createtime,"meno":meno});
			_this.dialog.close();
		},
		cancel:function(e){
			_this=this;
			_this.dialog.close();
		}
	});
});