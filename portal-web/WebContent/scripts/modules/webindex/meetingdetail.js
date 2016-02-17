define(function(require, exports, module) {
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	var $ = require("jquery");
	mdboss.View.infoDetailView = Backbone.View.extend({
		 el: '#mainContainer',
		 initialize: function (data) {
			 this.infocode = data.infocode;
			 this.newstype=data.newstype;
		     this.render();
		 },
		 render:function(){
			 mdboss.fillWrap(require("text!template/common/wrap_.html"));
			 $("#mainContainer").css("background","#ffffff");
			 mdboss.fillPage(require("text!template/page/webindex/meetingdetail.html"));
			 this.renderDetail();
		 },
		 renderDetail:function(){
			 var v_this = this;
			 var commonModel = new mdboss.Model.commonModel();
			 commonModel.save({
				    "usercode": mdboss.usercode, 
				    "tid":parseInt(v_this.infocode)
				},{url:mdboss.api.meetinfoview, success:function(m, res){
				 if(res.rc == 1){
					 //设置内容
					 var template = Handlebars.compile($("#more-info-detail-template").html());
					 var html = template(res.data);
					 $("#info_detail").html(html);
					 $("#current_title").html(res.data.title);
				 }else{
					 mdboss.error(res.msg);
				 }
			 },error:function(){
					mdboss.error();
				}});
		 
		 }
	});
	
	var meetingdetail = function(data) {
		 new mdboss.View.infoDetailView({"infocode":data.meetingid});
	};

	module.exports = meetingdetail;

});