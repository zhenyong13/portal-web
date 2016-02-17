define(function(require, exports, module) {
	var $ = require("jquery");
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
//	require("tree")($);
	require("daterangepicker_moment");
	require("daterangepicker");
	//项目详情
	mdboss.View.projdetailslistView = Backbone.View.extend({
		 el: "#rightMainContainer",
		 initialize: function () {
			 var template = Handlebars.compile(require("text!../../../template/page/project/projectdetails.html"));
			 var html = template();
			 mdboss.fillPage(html);
			 this.loadleftlist();
			 this.loadrightdetail();
			 this.loadprojectwork();
			 this.loadprojectdocument();
			 this.loadprofesswork();
			 this.loadprofessissues();
			 this.loadprojectlog();
			
		 },
		 loadleftlist:function(e){
			//加载left 
			 var datalist = Handlebars.compile($("#project-list-template").html());
			 var datalisthtml = datalist();
			 $("#leftModule").html(datalisthtml);
		 },
		 loadrightdetail:function(e){
			//加载right
			 var datadetail = Handlebars.compile($("#project-detail-template").html());
			 var html = datadetail();
			 $(".middle-and-right").html(html);
		 },
		 loadprojectwork:function(e){
			//加载项目任务
			 var projectwork = Handlebars.compile($("#project-work-template").html());
			 var projectworkhtml = projectwork();
			 $(".js-project-work-list").html(projectworkhtml);
		},
		loadprojectdocument:function(e){
			//加载项目公文
			console.log("加载项目公文");
			 var projectdocument = Handlebars.compile($("#project-document-template").html());
			 var projectdocumenthtml = projectdocument();
			 $(".js-project-document-list").html(projectdocumenthtml);
		},
		loadprofessdocument:function(e){
			//加载专业公文
			console.log("加载专业公文");
			 var projectdocument = Handlebars.compile($("#profess-document-template").html());
			 var projectdocumenthtml = projectdocument();
			 $(".js-project-document-list").html(projectdocumenthtml);
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
		loadprofesswork:function(e){
			//加载专业任务
			var professwork = Handlebars.compile($("#profess-work-template").html());
			var professworkhtml = professwork();
			$(".js-project-work-list").html(professworkhtml);
		},
		loadprofessissues:function(e){
			//加载项目问题列表
			var professissues = Handlebars.compile($("#project-issues-template").html());
			var professissueshtml = professissues();
			$(".js-project-issues-list").html(professissueshtml);
		},
		loadprofessissues:function(e){
			//加载专业问题列表
			var professissues = Handlebars.compile($("#profess-issues-template").html());
			var professissueshtml = professissues();
			$(".js-project-issues-list").html(professissueshtml);
		},
		loadprojectlog:function(e){
			//加载项目日志
			var projectlog = Handlebars.compile($("#project-log-template").html());
			var projectloghtml = projectlog();
			$(".js-project-log-list").html(projectloghtml);
		},
		loadprofesslog:function(e){
			//加载专业日志
			var professlog = Handlebars.compile($("#profess-log-template").html());
			var professloghtml = professlog();
			$(".js-project-log-list").html(professloghtml);
		},
		 events:{
			"click .products_list_title_1_list":"getprojectdetail",
			"click #menu .p_m_dh":"goanchor",//导航
			"click .js_contraction":"contraction",//点击收起
			"click .js_open":"js_open",//点击展开
			"click .onedaohang":"onedaohang",//点击竖着的快捷导航展开
			"click .js-project-work":"loadprojectwork",//点击项目任务
			"click .js-profess-work":"loadprofesswork",//点击专业任务
			"click .js-project-document":"loadprojectdocument",//点击项目公文
			"click .js-profess-document":"loadprofessdocument",//点击专业公文
			"click .js-project-issues":"loadprofessissues",//点击项目问题列表
			"click .js-profess-issues":"loadprofessissues",//点击专业问题列表
			"click .js-project-log":"loadprojectlog",//点击项目日志
			"click .js-profess-log":"loadprofesslog",//点击专业日志
			
		 }
	});
	
});