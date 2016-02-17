/**
 * 公文环节处理信息查询
 */
define(function (require, exports, module) {
    var mdboss = require("mdboss"),
        $      = require("jquery"),
        Dialog = require("dialog");
    require("datetimepicker");
    
	var $page = mdboss.$pageWrap;
    
    /*公文环节处理信息查询*/
    mdboss.Model.processPart=Backbone.Model.extend({
    	url:mdboss.api["queryprocesspart"]
    });

    //公文环节处理信息查询
    mdboss.View.processPart=Backbone.View.extend({
        initialize:function(data){
        	this.rdata = data;
        	console.log(data);
        	var v_this = this;
        	if(data.layer==undefined){
        		data.layer=true;
        	}
        	 var dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(this).find(".scrollwrapper").jScrollPane();
                 }
             }, {"title":"环节处理信息","width":"660px","height":"324px","layer":data.layer,"icon":"iconfont icon-mdliucheng","resize":function(){
                 $(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
                 }}).show(function(){
                     var _this = this;
                     var template = Handlebars.compile(require("text!template/page/process/form/process-part.html"));
                     $(template({"userinfo": data.data.userinfo,baseUrl:baseConfig.base+"download?filecode=", "handleinfo":data.data.handleinfo,"rdata":v_this.rdata})).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
                     $(_this).find(".loading").hide();
                     $(_this.dialog).find(".loading").removeClass("loading");
                     
                     //新启流程 不能查看表单
                     if(!v_this.rdata.processinstcode||v_this.rdata.processinstcode==''){
                    	 $(_this.dialog).find(".js-show-process").css("display","none");
                     }
                 });
             this.$el=dialog.$html;
             v_this.dialog=dialog;
        },
        events:{
        	 "click .js-show-process":"showProcess",//data-module="showProcess"
        	 "click .pro_back":"moveTO",
        },
        showProcess:function(e){//显示表单
    		mdboss.module['showProcess'].call(e.currentTarget);
        },
        moveTO:function(){//回退到该环节  
        	var v_this = this;
        	mdboss.confirm("确定要回退流程吗?",function(s){
        		if(s){
        			mdboss.reqsubmit({"usercode":mdboss.usercode,processinstcode:v_this.rdata.processinstcode,taskcode:v_this.rdata.taskcode,targettaskcode:v_this.rdata.targettaskcode},
                			mdboss.api.taskmoveto, function(m, res){
                		 if(res.rc == 1){
                			 mdboss.alert("回退成功");
                		 }else{
                			 mdboss.error(res.msg);
                		 }
                	});
        		}
        	});
        },
        file_view:function(e){
        	var filecode=$(e.currentTarget).data("file-id");
        	seajs.use("review", function () {
        		new mdboss.View.fileReview({model:new mdboss.Model.commonModel( 
   	      			 {"filecode":filecode,"baseurl":baseConfig.base}
   	           )});
        	});
        }
    });
});