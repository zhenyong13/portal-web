﻿define(function(require, exports, module) {
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	var $ = require("jquery");
	require("bootstrap");
	require("pagination");
	
	mdboss.View.newMoreView = Backbone.View.extend({
		 el: '#mainContainer',
		 initialize: function (data) {
				this.pageNo = 1;
				this.totalPage = 5;
				this.keyword = "";
				this.newstype=data.newstype;
		 },
		 events:{
			 "click .pro_ioc":"search",//搜索
			 'keypress .pro_input':'keywords',//搜索
		 },
		 render:function(){
			 this.renderNewstype();
			 this.renderNewsList();
		 },
		 search:function(e){
			 this.pageNo = 1; 
			 this.keyword = $(".pro_input").val();
			 this.renderNewsList();
		 },
		 keywords:function(e){
	         if(e.which == 13){
	        	 this.pageNo = 1; 
	        	 this.keyword = $(".pro_input").val();
	        	 this.renderNewsList();
	         }
		 },
		 pageMore:function(e){//分页
			 var $this  = $(e.currentTarget);
        	 var pageNo = $this.find("a").text();
        	 if(pageNo =="→"){
        		 this.pageNo +=1; 
        	 }else if(pageNo =="←"){
        		 this.pageNo -=1; 
        	 }else{
        		 this.pageNo = pageNo;
        	 }
        	 this.renderNewsList();
		 },
		 renderNewstype:function(){
			 var v_this = this;
			 // 渲染新闻分类
			 var typemodel = new mdboss.Model.commonModel();
			 typemodel.save({"usercode":mdboss.usercode,"definition":"$CMS_NEWSTYPE"},{url:mdboss.api.queryProcesstype,success:function(m,res){
				 var template_m = Handlebars.compile($("#more-left-menu-template").html());
				 var currenttype="";
				 $(res.data.rows).each(function(i,item){
					 if(item.dictcode==v_this.newstype){
						 item.isdefault=true;
						 currenttype=item.dictname;
					 }else{
						 item.isdefault=false;
					 }
				 });
				 console.log("当前分类"+res.data.rows);
				 $("#top_menu").attr("href","#newsmore/"+v_this.newstype);
				 var html = template_m({"menuList":res.data.rows,"currentType":v_this.newstype});
				 $("#left_menu").html(html);
				 $("#top_menu").html(currenttype);
				 v_this.renderNewsList(v_this.newstype);
			 }});
		 },
		 renderNewsList:function(newstype){
			 var v_this = this;
			 //渲染新闻列表
			 var commonModel = new mdboss.Model.commonModel();
			 commonModel.save({
				    "usercode": mdboss.usercode, 
				    "pageNo": this.pageNo, 
				    "pageSize": mdboss.pageSize, 
				    "queryCondition": [ {"key":"title","operate":"Like","v1":this.keyword} ], 
				    "orderBy": "publishtime"
				},{url:mdboss.api.newslist, success:function(m, res){
				 if(res.rc == 1){
					 //设置列表
					 var template = Handlebars.compile($("#more-right-list-template").html());
					 var html = template({"infoList":res.data.rows });
					 $("#list_more").html(html);
					 //分页
					 if(v_this.pageNo%5 == 0 && res.data.rows.length>0){
 	             		v_this.totalPage+=5;
 		         	 }
 		         	 if(res.data.rows.length==0){
 		         		if(v_this.totalPage>5)
 		         			v_this.totalPage-=5;
 		         	 }
 		         	 if(v_this.pageNo ==1){
 		         		v_this.totalPage =5;
 		         	 }
	             	$("#more_pagination").bs_pagination({ totalPages : v_this.totalPage, currentPage:v_this.pageNo,
	             		onChangePage: function(event, data) {
 	            			v_this.pageNo = data.currentPage;
 	            			v_this.renderData();
             			}
	             	});
				 }else{
					 mdboss.error(res.msg);
				 }
			 },error:function(){
					mdboss.error();
				}});
		 }
	});
	
	
	var newsmore = function(data) {
		mdboss.getReady({
			data:[ ],
			template : ["newsmore"]
		}, function(result, msg) {
			//加载框框
	        mdboss.fillWrap(require("text!template/common/wrap_.html"));
	        $("#mainContainer").css("background","#fff");
			if (result) {
				mdboss.fillPage(result.template["newsmore"] );
				 var newmoreview=new mdboss.View.newMoreView({"newstype":data.newstype});
				 newmoreview.render();
			} else {
				 mdboss.error(msg);
			}
		});
		 
	};

	module.exports = newsmore;

});