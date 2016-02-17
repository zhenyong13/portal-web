define(function (require, exports, module) {
	
	var $ = require("jquery");
	require("fullcalendar");
	var attendindex = require("attendindex");
	require("pagination");
    
    /**---------------------------------------------------------------------------------------*/
	//部门选择
    mdboss.Model.deptSearch= Backbone.Model.extend({
        url: mdboss.api.orgs   
    }); 
    
    /** ***************************考勤统计******************************************************* */
    //考勤统计
    var attendance = function (type, modulecode) {
    	
    	//加载框框
        if(type =="statis" || type=="travel" || type=="workday"){
        	mdboss.setLeftMenu(type, modulecode);//刷新左侧菜单
        }else{
        	mdboss.setLeftMenu(type, modulecode,"noscroll");//刷新左侧菜单
        }
    	//右侧页面内容 
    	mdboss.fillPage(require("text!template/page/attendance/attendance.html"));
    	var deptModel=new mdboss.Model.deptSearch();//{dept:result.data["orgs"]}
    	if(type=="signin"){//补签
    		seajs.use(["resign"],function(){
    			new mdboss.View.attach();//{dept:result.data["orgs"].rows}
    		});
    	}else if(type=="statis"){
    		seajs.use(["statis"],function(){
    			new mdboss.View.statis({deptModel:deptModel});
    		});
    	}else if(type=="travel"){
    		seajs.use(["travel"],function(){
    			new mdboss.View.travel({deptModel:deptModel});
    		});
    	}else if(type == "workday"){//工作日定义
    		seajs.use(["workday"],function(){
    			new mdboss.View.workday();
    		});
    	}else if(type == "sign"){//签到查询
    		seajs.use(["sign"],function(){
    			new mdboss.View.signquery({});//dept:result.data["orgs"].rows
    		});
    	}else{//首页,签到统计
    		attendindex.attendindexFun();
    	}
    };
    module.exports = attendance;

});