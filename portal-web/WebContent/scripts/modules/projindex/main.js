define(function(require, exports, module) {
	var $ = require("jquery");
	require("migrate");
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	require("navigation");
	mdboss.View.projNavView = Backbone.View.extend({
		 el: '#mainContainer',
		 initialize: function () {
		 }
		 
	});
	
	var projindex = function() {
		mdboss.getReady({
			data:[],
			template : ["projindex"]
		}, function(result, msg) {
			mdboss.fillWrap(require("text!../../../template/common/wrap_.html"));
			if (result) {
				var template = Handlebars.compile(result.template["projindex"]);
				var html = template();
				mdboss.fillPage(html);
				seajs.use("projdetail",function(){
					new mdboss.View.newProjView({proj:"1"});
					new mdboss.View.projNavView();
				});
			} else {
				mdboss.error(msg);
			}
		});
	};

	module.exports = projindex;

});