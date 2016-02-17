define(function(require, exports, module) {
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	var $ = require("jquery");
	mdboss.View.moresn = Backbone.View.extend({
		 el: '',
		 initialize: function (data) {
		     this.render();
		 },
		 render:function(){
			 mdboss.fillWrap(require("text!template/common/wrap_.html"));
			 $("#mainContainer").css("background","#ffffff");
			 mdboss.fillPage(require("text!template/page/webindex/moreSn.html"));
			 this.renderData();
		 },
		 renderData:function(){
			 var Height=$(window).height()-$("#header").height(),
			 	 template = null,
			 	 html ="",
			     cwd=$(".cooperative-work-div");
			 
			 var commonModel=new mdboss.Model.commonModel();
			 commonModel.save({},{url:mdboss.api.synergism, success:function(m,res){
				 var tmp = res.data;
				 template = Handlebars.compile($("#synergism-template").html());
				 html = template({"columnList":tmp,"baseUrl":baseConfig.base});
				 cwd.append(html);
				 cwd.attr("style","height:"+Height+"px");
			 }});
		 }
	});
	
	var moreSn = function() {
		 new mdboss.View.moresn();
	};

	module.exports = moreSn;

});