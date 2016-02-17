/**
 * 公文便签新建
 * 使用方法
  seajs.use("meno", function () {
      var meno=new mdboss.Model.processMeno();
      new mdboss.View.processMeno(meno);
   });
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss"), 
	$ = require("jquery");
	// 公文打印
	mdboss.View.printView = Backbone.View.extend({
		el:"#page-main",
		initialize : function(options) {
			this.render(options);
		},
		render:function(post){
			p_this=this;
			var commonModel=new mdboss.Model.commonModel();
			commonModel.save(post,{url:mdboss.api.yswprint,success:function(model,res){
				if(res.rc==1){
					seajs.use("dynamicform", function (getdynamicView) {
						 p_this.dynamicView=getdynamicView({el:p_this.$el,formdata:res.data.formdata,isprint:true,"special":res.data.formurl});
		            });
					$("body").css("overflow","auto");
				}else{
					mdboss.error(res.msg);
				}
				
			},error:function(){
				mdboss.error();
			}});
			return this;
		}
	});
});