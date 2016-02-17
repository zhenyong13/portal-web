define(function (require, exports, module) {
	
	var $ = require("jquery");
	var funddevice = require("funddevice");//问题反馈 
	var fundassests = require("fundassests");//问题反馈 
	 
    
    /** ***************************帮助******************************************************* */
    //
    var help = function (modulecode, type) {
    	mdboss.setLeftMenu(type, modulecode,"noscroll");//刷新左侧菜单
       	if(type=="device"){//设备反馈
       		funddevice.deviceFunc();
       	} else if( type=="assests" ){//资产
       		fundassests.assestsFunc();
       	}
    };
    module.exports = help;

});