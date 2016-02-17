/**
 * 出差人数统计详情 
 */
define(function (require, exports, module) {
    var mdboss = require("mdboss");
        $      = require("jquery");
        var Dialog=require("dialog");
        require("mCustomScrollbar");
        require("mousewheel");
    
    	
	 /********************************** 统计 start****************************************************************/
	
    
    /**  统计* */
    mdboss.View.traveldetail=Backbone.View.extend({
    	 initialize: function (data) {
    		 	 _this=this;
    		 	 _this.data=data;
    		 	 _this.title="";
    		 	 if(data.traveltype=="mydept"){
    		 		_this.title="我部门出差人数";
    		 		_this.data.url=mdboss.api.myorgtraveluserinfo;
    		 		_this.data.template="#travel-detail-template";
    		 	 }else if(data.traveltype=="tomydept"){
    		 		_this.title="到我部门出差人数";
    		 		_this.data.url=mdboss.api.tomyorgtraveluserinfo;
    		 		_this.data.template="#travel-detail-tomydept-template";
    		 	 }
    		 	 this.dialog=new Dialog({
                     type: "html",
                     value: '<div class="loading"></div>',
                     fillCallback:function(){
                         $(this).find(".jscroll").jScrollPane();
                     }
                 }, {"title":_this.title,"width":"800px","height":"450px","icon":"iconfont icon-mdliucheng","layer":false,"resize":function(){
                     }}).show(function(){
                    	 var detailhtml=require("text!template/page/attendance/travel_details.html");
                    	 _this.$el.find(".dialog-content").html(detailhtml);
                    	 
                    	 if(data.traveltype=="mydept"){//
                    		 _this.$el.find("#detailHead").html(_this.$el.find("#travel-out-head-template").html());
                    	 }
                    	 var commonModel=new mdboss.Model.commonModel();
                    	 var post={"usercode":mdboss.usercode,"startday":_this.data.startday,"endday":_this.data.endday,"orgcode":_this.data.orgcode}
                    	 commonModel.save(post,{url:_this.data.url,success:function(m, res){
                    			 if(res.rc==1){
                    				 var template=Handlebars.compile(_this.$el.find(_this.data.template).html());
                    				 _this.$el.find("#datarows").html(template({"data":res.data.rows,"startrange":_this.data.startday+"至"+_this.data.endday}));
                    				 _this.$el.find("#datarows").mCustomScrollbar("destroy");
                                	 _this.$el.find("#datarows").mCustomScrollbar({
                  	            		scrollButtons:{ enable:false }, 
             	 						theme: "darkblue",
             	 						horizontalScroll:false
             	                     });
                    			 }else{
                    				 mdboss.alert(res.msg);
                    			 }
                    	 }});
                    	
                 });
    		 	this.$el = this.dialog.$html;
	        }
    });
});