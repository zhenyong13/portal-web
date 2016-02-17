define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     Dialog = require("dialog");
     
     //文本编辑器
     exports.texteditFunc=function(data){
		new mdboss.View.texteditView(data);
     };
	
     mdboss.View.texteditView = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.rdata=data; //传入的参数
        	 this.uuid=mdboss.getuuid();
        	 this.edit_html = require("text!template/page/common/textEdit.html");
        	 _this.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){ $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});   }
             }, {"title":_this.rdata.title ,"width":"1100px","height":"580px","icon":"iconfont icon-mdliucheng",
            	 full:false, layer:true,btns: ['min','max'], "resize":function(){
                 }}).show(function(){
                	 var dialog=this; 
                	 var template=Handlebars.compile(_this.edit_html);
  		 			var html=template({"uuid":_this.uuid});
  		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
  		 			//
  		 			UE.getEditor('feedbackEditor_'+_this.uuid,{
    	                 	 initialFrameWidth :"100%",//设置编辑器宽度
    	                 	 initialFrameHeight:390,//设置编辑器高度
    	                 	 scaleEnabled:true,
                 	 }).addListener("ready", function () {
         		         this.setContent(_this.rdata.content);
         			});;
	
             }); 
        	 this.$el = _this.dialog.$html;
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
         },
         submit:function(e){//提交
        	 _this=this;
        	 var callback = _this.rdata.callback;
			 var callbackFn = typeof callback == "function" ? callback : function () { };
			 callbackFn( UE.getEditor('feedbackEditor_'+ _this.uuid).getContent());
			 _this.cancel();
         },
         cancel:function(){
        	 UE.getEditor('feedbackEditor_'+this.uuid).destroy();
        	 this.dialog.close();
 		},
     });
});