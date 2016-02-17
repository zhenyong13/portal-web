define(function (require, exports, module) {
	
	var $ = require("jquery");
	var feedback = require("helpfeedback");//问题反馈 
	var helpapply = require("helpapply");//问题反馈 
	 
    
    /** ***************************帮助******************************************************* */
    //
    var help = function (modulecode, type) {
    	mdboss.setLeftMenu(type, modulecode,"noscroll");//刷新左侧菜单
       	if(type=="feedback"){//问题反馈
       		feedback.feedbackFunc();
       	} else if( type=="apply" ){//使用帮助
       		helpapply.applyFunc();
       	}
    };
    module.exports = help;

});