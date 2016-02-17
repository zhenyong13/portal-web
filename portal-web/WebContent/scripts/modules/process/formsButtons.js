/**
 * 公文便签新建
 * 使用方法
  seajs.use("meno", function () {
      var meno=new mdboss.Model.processMeno();
      new mdboss.View.processMeno(meno);
   });
 */
define(function(require, exports, module) {
	$ = require("jquery"); 
	

	//流程处理过程中按钮控制
	mdboss.View.buttonsView = Backbone.View.extend({
		initialize : function(options) {
			this.data=options;
		},
		render:function(info){
			_this=this;
			 mdboss.getReady({data:[],template:["buttons"]},function(result,msg){
                 if(result) {
                     var processInfo=_this.data.processInfo;
                     var buttonsInfo=new Array();
                     $.each(processInfo.data.buttons,function(index,item){
                    	 switch(item){
                    	 	case "submit":buttonsInfo.push({"class":"js_submit btn-success","processinstcode":_this.data.processinstcode,"ico_class":"icon-fasong","desc":"提交"});break;
                    	 	case "commit":buttonsInfo.push({"class":"js_submit btn-success","processinstcode":_this.data.processinstcode,"ico_class":"icon-fasong","desc":"提交"});break;
                    	 	case "readed":buttonsInfo.push({"class":"js_submit btn-success","type":"readed","processinstcode":_this.data.processinstcode,"ico_class":"icon-fasong","desc":"已阅"});break;
                    	 	case "save":buttonsInfo.push({"class":"js_save","processinstcode":_this.data.processinstcode,"ico_class":"icon-save","desc":"保存"});break;
                    	 	case "circularize":buttonsInfo.push({"class":"js_circularize","processinstcode":_this.data.processinstcode,"ico_class":"icon-code-fork","desc":"传阅"});break;
                    	 	case "diagram": var disg = "流程图";
                    	 		if(info){
                    	 			disg ="流程跟踪";
                    	 		}
                    	 		buttonsInfo.push({"class":"js_diagram","processinstcode":_this.data.processinstcode,"ico_class":"icon-liucheng iconfont","desc":disg});break;
                    	 	case "watched":buttonsInfo.push({"class":"js_watch","type":"watch","processinstcode":_this.data.processinstcode,"ico_class":"icon-star iconfont","desc":"关注"});break;
                    	 	case "cancelwatched":buttonsInfo.push({"class":"js_watch","type":"cancel_watch","processinstcode":_this.data.processinstcode,"ico_class":"icon-wrench","desc":"取消关注"});break;
                    	 	case "remind":buttonsInfo.push({"class":"js_remind","processinstcode":_this.data.processinstcode,"taskcode":_this.data.taskcode,"ico_class":"icon-bell iconfont","desc":"提醒"});break;
                    	 	case "print":buttonsInfo.push({"class":"js_print","processinstcode":_this.data.processinstcode,"ico_class":"icon-dayin iconfont","desc":"打印"});break;
                    	 	case "withdraw":buttonsInfo.push({"class":"js_withdraw","processinstcode":_this.data.processinstcode,"ico_class":"icon-back iconfont","desc":"撤回"});break;
                    	 	case "termination":buttonsInfo.push({"class":"js_termination","processinstcode":_this.data.processinstcode,"ico_class":"icon-stack","desc":"终止"});break;
                    	 	case "delete":buttonsInfo.push({"class":"js_delete","processinstcode":_this.data.processinstcode,"ico_class":"icon-trash","desc":"删除"});break;
                    	 	case "backtostart":buttonsInfo.push({"class":"js_restart","processinstcode":_this.data.processinstcode,"taskcode":_this.data.taskcode,"ico_class":"fa fa-reply","desc":"回退至拟稿人"});break;
                    	 }
                     });
                     var template = Handlebars.compile(result.template["buttons"]);
                     var html = template({processInfo:buttonsInfo});
                     $(html).appendTo(_this.data.content.find(".buttons_view"));
                     _this.data.content.find(".jscroll").jScrollPane();
                 }
                 else{
                	 mdboss.error(msg);
                 }
             });
		}
		 
	
	});
});