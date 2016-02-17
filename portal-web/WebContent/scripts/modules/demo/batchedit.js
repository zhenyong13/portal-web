define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     Dialog = require("dialog");
	
     mdboss.View.demobatchedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tids=data.tids;
        	 _this.dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                 }
             }, {"title":"批量修改","width":"650px","height":"200px","icon":"iconfont icon-mdliucheng","resize":function(){
                 }}).show(function(){
                	 var html=require("text!../../../template/page/demo/batchedit.html")
                	 this.$html.find(".dialog-content").html(html).fadeIn();
             }); 
        	 this.$el = _this.dialog.$html;
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 
         },
         submit:function(e){
        	 _this=this;
        	 var tids=_this.tids;
        	 var name=$("#name").val();
        	 var sex=$("#sex").val();
        	 var commonModel=new mdboss.Model.commonModel();
        	 mdboss.confirm("确定要修改吗？",function(c){
        		 if(c){
        			 commonModel.save({"usercode":mdboss.usercode,"tids":tids,"name":name,"sex":sex},{url:mdboss.api.demobatchdel,success:function(model,res){
                		 if(res.rc==1){
                			 mdboss.notifyTips("批量修改成功！");
                			 Backbone.history.loadUrl();
                			 _this.cancel();
                		 }else{
                			 mdboss.notifyTips(res.msg);
                		 }
                	 },error:function(){
                		 mdboss.error();
                	 }});
        		 }
        	 })
         },
         cancel:function(){
        	 _this=this;
        	 _this.dialog.close();
 		},
     });
});