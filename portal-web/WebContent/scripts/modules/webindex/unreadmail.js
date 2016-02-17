define(function(require, exports, module) {
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	var $ = require("jquery");
	require("bootstrap");
	require("pagination");
	
	mdboss.View.unReadMailMoreView = Backbone.View.extend({
		 el: '#mainContainer',
		 initialize: function (data) {
				this.pageNo = 1;
				this.totalPage = 5;
				this.keyword = "";
				mdboss.fillPage(require("text!template/page/webindex/unreadmail_more.html"));
				this.render();
		 },
		 events:{
			 "click .pro_ioc":"search",//搜索
			 'keypress .pro_input':'keywords',//搜索
		 },
		 render:function(){
			 this.renderList();
		 },
		 search:function(e){
			 this.pageNo = 1; 
			 this.keyword = $(".pro_input").val();
			 this.renderList();
		 },
		 keywords:function(e){
	         if(e.which == 13){
	        	 this.pageNo = 1; 
	        	 this.keyword = $(".pro_input").val();
	        	 this.renderList();
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
        	 this.renderList();
		 },
		 renderList:function(newstype){
			 var v_this = this;
			 //渲染新闻列表
			 var commonModel = new mdboss.Model.commonModel();
			 commonModel.save({
				    "usercode": mdboss.usercode, 
				    "pageNo": this.pageNo, 
				    "pageSize": mdboss.pageSize,
				    "orderBy": "", 
				    "keyword": this.keyword
				},{url:mdboss.api.unreadmaillist, success:function(m, res){
				 if(res.rc == 1){
					 //设置列表
					 console.log($("#more-right-list-template").html());
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
 	            			v_this.renderList();
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
	
	//列表#m/list,详情#m/detail/id
	var unreadmail = function(moudle,type1,type2,params) {
		 mdboss.fillWrap(require("text!template/common/wrap_.html"));
	     $("#mainContainer").css("background","#fff");
		switch (type1) {
		case "list":
				new mdboss.View.unReadMailMoreView();
			break;
		case "detail":
			
			break;
		default:
			break;
		}
		
	};

	module.exports = unreadmail;

});