define(function(require, exports, module) {
	var $ = require("jquery");
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
//	require("tree")($);
	require("daterangepicker_moment");
	require("daterangepicker");
	//专业详情
	mdboss.View.professdetailView = Backbone.View.extend({
		el: "#rightMainContainer",
		 initialize: function () {
			 var template = Handlebars.compile(require("text!../../../template/page/project/professdetails.html"));
			 var html = template();
			 mdboss.fillPage(html);
			 this.loadleftlist();
			 this.loadrightdetail();
			
		 },
		 loadleftlist:function(e){
			//加载left 
			 var datalist = Handlebars.compile($("#profess-list-template").html());
			 var datalisthtml = datalist();
			 $("#leftModule").html(datalisthtml);
		 },
		 loadrightdetail:function(e){
			//加载right
			 var datadetail = Handlebars.compile($("#profess-detail-template").html());
			 var html = datadetail();
			 $(".middle-and-right").html(html);
		 },
		 getprojectdetail:function(e){
			 this.loadrightdetail(e);
		 },
		 contraction:function(e){
			 //收起
			 $(".m_da").stop().animate({height:"0"},1000,function(){
				 $(".p_m_dh").css("display","none");
				 $(".rightdaohang").css("display","inherit");
				 $(".p_m_bg").css("display","none");
				 $(".m_da").css("display","none");
				 $(".js_contraction").css("display","none");
			});
			 $(".js_contraction").html("展开");
			 $(".js_contraction").addClass("js_open");
			 $(".js_contraction").removeClass("js_contraction");
		 },
		 js_open:function(e){
			 //展开
			 var count=$(".m_da").find("li").length;
			 $(".m_da").stop().animate({height:count*30},1000);
			 $(".js_open").addClass("js_contraction");
			 $(".js_open").html("收起");
			 $(".js_open").removeClass("js_open");
			 $(".p_m_dh").css("display","inherit");
			 $(".rightdaohang").css("display","none");
		 },
		 onedaohang:function(e){
			 //竖着的导航菜单展开
			 var count=$(".m_da").find("li").length;
			 $(".m_da").stop().animate({height:count*30},500,function(){
				 $(".js_open").addClass("js_contraction");
				 $(".js_open").html("收起");
				 $(".js_open").removeClass("js_open");
				 $(".rightdaohang").css("display","none");
				 $(".p_m_dh").css("display","inherit");
				 $(".m_da").css("display","inherit");
				 $(".p_m_bg").css("display","inherit");
				 
			 });
		 },
		 goanchor:function(e){
			var $this=$(e.currentTarget);
			var dataId=$this.data("id");
			document.getElementById(dataId).scrollIntoView();
		},
		professss:function(e){
			var current=$(e.currentTarget);
			var ss= current.find(".js_ss").html();
			if(ss=="收缩"){
				current.find(".js_ss").html("展开");
			}else{
				current.find(".js_ss").html("收缩");
			}
			current.next().slideToggle(500);
		},
		 events:{
			"click .products_list_title_1_list":"getprojectdetail",
			"click #menu .p_m_dh":"goanchor",//导航
			"click .js_contraction":"contraction",//点击收起
			"click .js_open":"js_open",//点击展开
			"click .onedaohang":"onedaohang",//点击竖着的快捷导航展开
			"click .products_list_title_1":"professss",//点击竖着的快捷导航展开
			
		 }
		 
	});
	
});