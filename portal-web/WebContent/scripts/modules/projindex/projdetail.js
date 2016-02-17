define(function(require, exports, module) {
	var $ = require("jquery");
	require("migrate");
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	require("scroll");
	require("navigation");
	
	mdboss.View.newProjView = Backbone.View.extend({
		el:"#mainContainer",
		initialize: function (data) {
			 var template = Handlebars.compile(require("text!../../../template/page/projindex/projdetail.html"));
				var html = template({"proj":data.proj});
				$(".js-projdetail").html(html);
				$(".projscroll").jScrollPane({"autoReinitialise": true});
				
		},
		events:{
			"click .projdetail":"projdetail",//点击项目
			"click #menu .p_m_dh":"goanchor",//导航
			 "click .js_contraction":"contraction",//点击收起
			 "click .js_open":"js_open",//点击展开
			 "click .js_projtask":"projtask",//项目任务
			 "click .js_proftask":"profstask"//专业任务
		},
		projtask:function(e){
			
		},
		profstask:function(e){
			
		},
		contraction:function(e){
			 $(".m_da").stop().animate({height:"0"},1000,function(){
				 $(".p_m_dh").css("display","none");
			});
			 $(".js_contraction").html("展开");
			 $(".js_contraction").addClass("js_open");
			 $(".js_contraction").removeClass("js_contraction");
		 },
		 js_open:function(e){
			 var count=$(".m_da").find("li").length;
			 $(".m_da").stop().animate({height:count*30},1000);
			 $(".js_open").addClass("js_contraction");
			 $(".js_open").html("收起");
			 $(".js_open").removeClass("js_open");
			 $(".p_m_dh").css("display","inherit");
		 },
		goanchor:function(e){
			var $this=$(e.currentTarget);
			var dataId=$this.data("id");
			document.getElementById(dataId).scrollIntoView();
		},
		projdetail:function(e){
			var $this=$(e.currentTarget);
			var projId=$this.data("id");
			var template = Handlebars.compile(require("text!../../../template/page/projindex/projdetail.html"));
			var html = template({"proj":projId});
			$(".js-projdetail").html(html);
			
		}
		
	});
	var projdetail = function(data) {
		mdboss.getReady({
			data:[],
			template : ["projdetail"]
		}, function(result, msg) {
			if (result) {
				var template = Handlebars.compile(result.template["projdetail"]);
				var html = template({"proj":data.proj});
				mdboss.fillPage(html);
				new mdboss.View.newProjView({"proj":data.proj}); 
			} else {
				mdboss.error(msg);
			}
		});
	};

	module.exports = projdetail;

});