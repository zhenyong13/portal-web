define(function(require, exports, module) {
	var $ = require("jquery");
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	
	mdboss.View.reportIndexView = Backbone.View.extend({
		 el: mdboss.$pageMain,
		 initialize: function () {
		 },
		 events:{
			 "click #menu .p_m_dh":"goanchor",//导航
			 "click .js_contraction":"contraction",//点击收起
			 "click .js_open":"js_open"//点击展开
		 },
		 goanchor:function(e){
			 var $this=$(e.currentTarget);
			 var navid=$this.data("id");
			 document.getElementById(navid).scrollIntoView();
		 },
		 contraction:function(e){
			 $(".m_da").stop().animate({height:"0"},3000,function(){
				 $(".p_m_dh").css("display","none");
			});
			 $(".js_contraction").html("展开");
			 $(".js_contraction").addClass("js_open");
			 $(".js_contraction").removeClass("js_contraction");
		 },
		 js_open:function(e){
			 var count=$(".m_da").find("li").length;
			 console.log(count);
			 $(".m_da").stop().animate({height:count*30},3000);
			 $(".js_open").addClass("js_contraction");
			 $(".js_open").html("收起");
			 $(".js_open").removeClass("js_open");
			 $(".p_m_dh").css("display","inherit");
		 },
	});
	
	var reportindex = function() {
		mdboss.getReady({
			data:[],
			template : ["reportindex"]
		}, function(result, msg) {
			mdboss.fillWrap(require("text!../../../template/common/wrap_.html"));
			if (result) {
				var template = Handlebars.compile(result.template["reportindex"]);
				var html = template();
				mdboss.fillPage(html);
				new mdboss.View.reportIndexView();
			} else {
				mdboss.error(msg);
			}
		});
	};

	module.exports = reportindex;

});