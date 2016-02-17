define(function(require, exports, module) {
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	var $ = require("jquery");
	
	mdboss.View.eventsView = Backbone.View.extend({
		 el: '#mainContainer',
		 initialize: function (data) {
			 	this.eventcode = data.year;
				 this.render();
		 },
		 render:function(){
			 mdboss.fillWrap(require("text!template/common/wrap_.html"));
			 $("#mainContainer").css("background","#ffffff");
			 mdboss.fillPage(require("text!template/page/webindex/bigevents.html"));
			 this.renderData();
		 },
		 renderData:function(){
			 var v_this = this;
			 //获取左侧菜单
			 var commonModel = new mdboss.Model.commonModel();
			 //详情
			 commonModel.save({"usercode":mdboss.usercode,"eventcode":v_this.eventcode},
					 {url:mdboss.api.portal_bigeventdetails,success:function(m,res){
					if(res.rc == 1){
						//导航
						var template = Handlebars.compile($("#big-events-list-template").html());
						
//						var todoOrder = res.data.allevents.sort(  function(a, b)
//	    		                {
//	    		                    if(a.eventtime < b.eventtime) return -1;
//	    		                    if(a.eventtime > b.eventtime) return 1;
//	    		                    return 0;
//	    		                }
//	    		            );
//						var tmp = new Array();
//    		            $.each(todoOrder, function(index, item)
//    		                {
//	    		            	 tmp.push(item);
//    		                }
//    		            );
						
						var html = template({"bigevents":res.data.allevents, "currentevent":res.data.currentevent.eventcode });
						$("#event_left_menu").html(html);
						
						//详情
						template = Handlebars.compile($("#big-events-detail-template").html());
						html = template( res.data.detail );
						$("#event_detail").html(html);
					 }else{
						 mdboss.error(res.msg);
					 }
			 },error:function(){
					mdboss.error();
				}});//end 详情
		 }
		
	});
	var bigevents = function(data) {
		new mdboss.View.eventsView(data); 
	};

	module.exports = bigevents;

});