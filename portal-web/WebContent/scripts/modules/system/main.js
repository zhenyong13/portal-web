define(function (require, exports, module) {
	
	var $ = require("jquery");
	var smodule = require("systemmodule");//模块管理 
	var widget  = require("widgetlist");//模块管理 
	var feeitem = require("feetypelist");//模块管理 
	var cachet = require("systemcachet");//模块管理 
	var table = require("systemtable");//数据库表管理 
	var column = require("systemcolumn");//数据库表-列表管理 
	var redhead = require("systemredhead");//红头 
    
    /** ***************************系统管理******************************************************* */
    //考勤统计
    var system = function (modulecode, type) {
    	if(null==type || type == undefined){
    		type = "operate";
    	}
    	mdboss.setLeftMenu(type, modulecode,"noscroll");//刷新左侧菜单
       
    	switch(type){
	    	case "module"://模块管理
	       		smodule.systemmoduel();
	       		break;
	       	case "permission"://权限管理 
	       		seajs.use(["systempermission"],function(){
	       	        mdboss.fillPage(require("text!template/page/system/permission.html"));
	       			new mdboss.View.systemPermission();
	       		});
	       		break;
	       	case "org"://组织管理
	       		seajs.use(["systemorg"],function(){
	       	        mdboss.fillPage(require("text!template/page/system/org.html"));
	       			new mdboss.View.systemOrg();
	       		});
	       		break;
	       	case "role"://角色管理
	       		seajs.use(["systemrole"],function(){
	       	        mdboss.fillPage(require("text!template/page/system/role.html"));
	       			new mdboss.View.systemRole();
	       		});
	       		break;
	       	case "operate"://操作员管理
	       		seajs.use(["systemoperate"],function(){
	       	        mdboss.fillPage(require("text!template/page/system/operate.html"));
	       			new mdboss.View.systemOperate();
	       		});
	       		break;
	       	case "param"://系统参数管理
	       		seajs.use(["systemparam"],function(){
	       	        mdboss.fillPage(require("text!template/page/system/param.html"));
	       			new mdboss.View.systemParam();
	       		});
	       		break;
	       	case "dict"://系统参数管理
	       		seajs.use(["systemdict"],function(){
	       	        mdboss.fillPage(require("text!template/page/system/dict.html"));
	       			new mdboss.View.systemDict();
	       		});
	       		break;
	       	case "roleperm"://角色授权
	       		seajs.use(["systemroleperm"],function(){
	       	        mdboss.fillPage(require("text!template/page/system/roleperm.html"));
	       			new mdboss.View.systemRolepermView();
	       		});
	       		break;
	       	case "group"://角色授权
	       		seajs.use(["systemgroup"],function(){
	       	        mdboss.fillPage(require("text!template/page/system/group.html"));
	       			new mdboss.View.systemGroupView();
	       		});
	       		break;
	       	case "widget"://组件 //TODO
	       		widget.widgetFun();
	       		break;
	       	case "feetype" ://费用类型
	       		feeitem.feetypeFun();
	       		break;
	       	case "cachet": //公章管理 
	       		cachet.cachetFun();
	       		break;
	       	case "table": //数据库表管理
	       		table.tablemoduelFun();
	       		break;
	       	case "column": //数据库表-列表管理
	       		column.columnmoduelFun();
	       		break;
	       	case "redhead": //红头管理 
	       		redhead.redheadmoduelFun();
	       		break;
    	}
    };
    module.exports = system;

});