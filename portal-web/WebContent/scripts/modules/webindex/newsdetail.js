define(function(require, exports, module) {
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	var $ = require("jquery");
	mdboss.View.infoDetailView = Backbone.View.extend({
		 el: '#mainContainer',
		 initialize: function (data) {
			 this.baseUrl =baseConfig.base;
			 this.infocode = data.infocode;
			 this.newstype=data.newstype;
		     this.render();
		 },
		 events:{
			 "click #attachment a":"attachments"//点击附件
		 },
		 render:function(){
			 this.renderNewstype();
			 this.renderDetail();
		 },
		 renderNewstype:function(){
			 var v_this = this;
			 // 渲染新闻分类
			 var typemodel = new mdboss.Model.commonModel();
			 typemodel.save({"usercode":mdboss.usercode,"definition":"$CMS_NEWSTYPE"},{url:mdboss.api.queryProcesstype,success:function(m,res){
				 var template_m = Handlebars.compile($("#more-info-left-menu-template").html());
				 var currenttype="";
				 $(res.data.rows).each(function(i,item){
					 if(item.dictcode==v_this.newstype){
						 item.isdefault=true;
						 currenttype=item.dictname;
					 }else{
						 item.isdefault=false;
					 }
				 });
				 $("#top_menu").attr("href","#newsmore/"+v_this.newstype);
				 var html = template_m({"menuList":res.data.rows,"currentType":v_this.newstype});
				 $("#left_menu").html(html);
				 $("#top_menu").html(currenttype);
			 }});
		 },
		 renderDetail:function(){
			 var v_this = this;
			 var commonModel = new mdboss.Model.commonModel();
			 commonModel.save({
				    "usercode": mdboss.usercode, 
				    "tid":parseInt(v_this.infocode)
				},{url:mdboss.api.newsview, success:function(m, res){
				 if(res.rc == 1){
					 //设置内容
					 var template = Handlebars.compile($("#more-info-detail-template").html());
					 var attachment=res.data.attachment;
		
					 res.data.attachment=eval("("+attachment+")");
					 
					 console.log(res.data);
		
					 var html = template(res.data);
					 $("#info_detail").html(html);
					 $("#current_title").html(res.data.title);
				 }else{
					 mdboss.error(res.msg);
				 }
			 },error:function(){
					mdboss.error();
				}});
		 },
		 attachments:function(e){
			 var v_this=this;
			 var baseUrl=v_this.baseUrl;
			 var filecode = $(e.currentTarget).attr("fileCode");//文件编码
			 $.get(baseUrl+"redirect.jsp?filecode="+filecode, function(html){
     			$(html).appendTo(v_this.$el);
     		 });
		 }
	});
	
	var newsdetail = function(data) {
		 mdboss.fillWrap(require("text!template/common/wrap_.html"));
		 $("#mainContainer").css("background","#ffffff");
		 mdboss.fillPage(require("text!template/page/webindex/newsdetail.html"));
		 new mdboss.View.infoDetailView({"infocode":data.newsid,"newstype":data.sort});
	};

	module.exports = newsdetail;

});