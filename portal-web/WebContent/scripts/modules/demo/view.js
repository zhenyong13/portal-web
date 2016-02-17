define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     Dialog = require("dialog");
	
     mdboss.View.demoview = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tid=data.tid;
        	 _this.dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                 }
             }, {"title":"修改记录","width":"450px","height":"200px","icon":"iconfont icon-mdliucheng","resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 var commonModel=new mdboss.Model.commonModel();
                	 commonModel.save({"tid":_this.tid},{url:mdboss.api.demodetail,success:function(model,res){
                		 	if(res.rc==1){
                		 		 var template=Handlebars.compile(require("text!../../../template/page/demo/view.html"));
                		 		 var html=template(res.data);
                		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
                		 	}else{
                		 		 mdboss.notifyTips("获取数据失败！");
                		 	}
                	 },error:function(){
                		 mdboss.error();
                	 }});
                	
                	 
             }); 
        	 this.$el = _this.dialog.$html;
         }
     });
});