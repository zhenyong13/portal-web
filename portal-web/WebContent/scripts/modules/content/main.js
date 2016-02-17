define(function (require, exports, module) {
	
	var $ = require("jquery");
	var news = require("news");//新闻管理 
	var notice = require("notice");//通知管理 
	var meetinfo = require("meetinfo");//会议公告管理 
	var work = require("work");//快捷方式 
	var link = require("link");//新闻管理 
	var portal = require("portal");//门户页面排版管理 
	var business = require("business");//门户页面排版管理 
    
    /** ***************************内容管理******************************************************* */
    var content = function (modulecode, type) {
    	mdboss.setLeftMenu(type, modulecode,"noscroll");//刷新左侧菜单
    	switch(type){
	    	case "news"://新闻管理
	    		news.newsFunc();
	       		break;
	    	case "work"://快捷方式
	    		work.workFun();
	    		break;
	    	case "notice"://公告
	    		notice.noticeFunc();
	    		break;
	    	case "link"://链接管理
	    		link.linkFun();
	    		break;
	    	case "portal"://门户管理-页面排版
	    		portal.portalFun();
	    		break;
	    	case "meetinfo"://会议公告
	    		meetinfo.meetinfoFunc();
	    		break;
	    	case "business"://业务指引
	    		business.businessFunc();
	    		break;
	       	default:
	       		news.newsFunc();
    	}
    };
    module.exports = content;
    
    /** ***************************内容管理******************************************************* */
});