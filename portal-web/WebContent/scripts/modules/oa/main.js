define(function (require, exports, module) {
	
	var $ = require("jquery");
	var meeting = require("meeting");//会议管理 
	var meetingroom = require("meetingroom");//会议室管理 
	var serial = require("serial");//会议室管理 
	var documents = require("documents");//文档管理 
    
    /** ***************************OA办公管理******************************************************* */
    var system = function (modulecode, type) {
    	if(null==type || type == undefined){
    		type = "meeting";
    	}
    	if(type == "documents"){
    		mdboss.fillWrap(require("text!template/common/wrap_no.html"));
    	}else{
    		mdboss.setLeftMenu(type, modulecode,"noscroll");//刷新左侧菜单
    	}
       	switch(type){
	       	case "meeting"://会议
	       		meeting.meetingFunc();
	       		break;
	       	case "meetingroom"://会议室 
	       		meetingroom.meetingroomFunc();
	       		break;
	    	case "serial"://字号管理 
	    		serial.serialFunc();
	       		break;
	    	case "documents"://文档管理 - 二维码 
	    		documents.documentsFunc();
	    		break;
       	}
    };
    module.exports = system;

});