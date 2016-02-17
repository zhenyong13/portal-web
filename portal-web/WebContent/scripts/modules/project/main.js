define(function(require, exports, module) {
	var $ = require("jquery");
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	 var architectconfig = require("architectconfig");//项目架构 
	 var professconfig = require("professconfig");//专业配置
	 var roleconfig = require("roleconfig");//角色配置
	 var projectphase = require("projectphase");//项目阶段
	 var members = require("members");//项目成员
	 require("projectlist");//项目列表
	 require("professlist");//项目专业列表
	 require("projectdetail");//项目详情 
	 require("professdetail");//专业详情
//	require("tree")($);
	
	var project = function(modulecode,type) {
		if(type==undefined||type==""){
			type="list";
		}
		switch(type){
		case "architectconfig":
			mdboss.setLeftMenu(type, modulecode);//刷新左侧菜单
			architectconfig.architectconfigFunc();
			break;
		case "professconfig":
			mdboss.setLeftMenu(type, modulecode);//刷新左侧菜单
			professconfig.professconfigFunc();
			break;
		case "roleconfig":
			mdboss.setLeftMenu(type, modulecode,"noscroll");//刷新左侧菜单
			roleconfig.roleconfigFunc();
			break;
		case "list":
			mdboss.setLeftMenu(type, modulecode , "noscroll");//刷新左侧菜单
			new mdboss.View.projectListView();
			break;
		case "profess":
			mdboss.setLeftMenu(type, modulecode , "noscroll");//刷新左侧菜单
			new mdboss.View.professListView();
			break;
		case "phase": //项目阶段
			mdboss.setLeftMenu(type, modulecode,"noscroll");//刷新左侧菜单
			projectphase.projectphaseFunc();
			break;
		case "members": //项目成员
			mdboss.setLeftMenu(type, modulecode,"noscroll");//刷新左侧菜单
			members.membersFunc();
			break;
			
		}
	};

	module.exports = project;

});