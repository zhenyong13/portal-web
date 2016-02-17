﻿/**
 * Created by 2goyoung on 15/4/27.
 */

define(function (require, exports, module) {

    require("backbone");
    require("cookie");
    require("scroll");
    require("fullcalendar");
    var $ = require("jquery");
    var util = require("util");
    require("tree");
	require("tree_excheck")($);
	 require("tree_exedit");
	 require("mCustomScrollbar");
    var accounting=require("accounting");
    var nowTime = new Date().getTime();
    var commonModel = Backbone.Model.extend({
    	
    });
    window.mdboss = {
        Model: {commonModel:commonModel},
        View: {},
        Collection: {},
        Router: {
            start: function () {
                var AppRouter = Backbone.Router.extend({
                    routes: {
                        "login/:usercode": "login",
                        "login/": "login",
                        "login": "login",
                        "dashboards": "dashboards",
                        "process": "process",
                        "process/:type": "process",
                        "process/:type/:usercode": "process",
                        "profile": "profile",//个人设置 
                        "profile/:type": "profile",
                        "loading": "load",
                        "demo": "demo",
                        "demo/:type": "demo",
                        "attend": "attend",
                        "attend/:type": "attend",
                        "member": "member",
                        "feed":"feed",
                        "feed/:type":"feed",
                        "message":"message",
                        "message/":"message",
                        "print/:processinstcode/:taskcode":"print",
                        "print/:processinstcode/":"print",
                        "print/:processinstcode":"print",
                        "diagram/processinst/:processinstcode":"diagram",
                        "search/:type":"search",//全局搜索
                        "search/:type/:keyword":"search",//全局搜索
                        "index":"index",
                        "bigevents/:year":"bigevents",
                        "newslist":"newslist",
                        "newsmore/:newstype":"newsmore",//新闻列表
                        "newsdetail/:sort/:id":"newsdetail",//新闻详情
                        "noticemore/":"noticemore",//公告列表
                        "noticemore":"noticemore",//公告列表
                        "noticedetail/:id":"noticedetail",//公告详情
                        "meetingmore/":"meetingmore",//会议列表
                        "meetingmore":"meetingmore",//会议列表
                        "meetingdetail/:id":"meetingdetail",//会议详情
                        "moreSn":"moreSn",//左侧栏导航 快捷方式
                        "deptindex":"deptindex",
                        "projindex":"projindex",
                        "projdetail/:proj":"projdetail",
                        "reportindex":"reportindex",
                        "myproject":"myproject",//导航的项目
                        "system":"system",//系统管理
                        "system/:module":"system",//系统管理
                        
                        "moreSidenav:module":"moreSidenav",//系统管理

                    	/*************通用配置**********************/
                        "m/:modulecode":"msystem",//全局配置
                        "m/:modulecode/:type1":"msystem",//全局配置
                        "m/:modulecode/:type1/:type2":"msystem",//全局配置
                        "m/:modulecode/:type1/:type2/:param":"msystem",//全局配置
                        /*************通用配置**********************/
                        "*pageid": "defaultPage",
                    },
                    msystem:function(modulecode, type1, type2, param){//全局通用配置 modulecode一级模块 type1二级  type2三级/参数
                   	 	mdboss.openPage(function (open) {
                            if (open) {
                            	$("#rightMainContainer").html(require("text!template/common/loading.html?_"+nowTime));
                                seajs.use(modulecode, function (infuc) {
                                	infuc(modulecode, type1, type2, param);
                                });
                            }
                        });
                   }, 
                    system:function(module){ //系统管理
                   	  mdboss.openPage(function (open) {
                            if (open) {
                                seajs.use("system", function (system) {
                               	  system("system", module);
                                });
                            }
                        });
                   },
                    myproject:function(){
                    	 mdboss.openPage(function (open) {
                             if (open) {
                                 seajs.use("myproject", function (myproject) {
                               	  myproject();
                                 });
                             }

                         });
                    },
                    projdetail:function(proj){
                      	 mdboss.openPage(function (open) {
                               if (open) {
                                   seajs.use("projdetail", function (projdetail) {
                                   	projdetail({"proj":proj});
                                   });
                               }

                           });
                      },
                      newsdetail:function(sort,id){
                       	 mdboss.openPage(function (open) {
                                if (open) {
                                    seajs.use("newsdetail", function (newsdetail) {
                                   	 newsdetail({"sort":sort,"newsid":id});
                                    });
                                }

                            });
                       },
                       newsmore:function(newstype){
                    	 
                      	 mdboss.openPage(function (open) {
                               if (open) {
                                   seajs.use("newsmore", function (newsmore) {
                                 	  newsmore({"newstype":newstype});
                                   });
                               }

                           });
                      },
                       newslist:function(){
                         	 mdboss.openPage(function (open) {
                                  if (open) {
                                      seajs.use("newslist", function (newslist) {
                                   	   newslist();
                                      });
                                  }

                              });
                         },
                         noticemore:function(){
                        	 mdboss.openPage(function (open) {
                                 if (open) {
                                     seajs.use("noticemore", function (noticemore) {
                                     	noticemore();
                                     });
                                 }

                             });
                        },
                      noticedetail:function(id){
                     	 mdboss.openPage(function (open) {
                              if (open) {
                                  seajs.use("noticedetail", function (noticedetail) {
                                	  noticedetail({"noticeid":id});
                                  });
                              }

                          });
                       },
                       meetingmore:function(){
                       	 mdboss.openPage(function (open) {
                                if (open) {
                                    seajs.use("meetingmore", function (meetingmore) {
                                    	meetingmore();
                                    });
                                }

                            });
                       },
                       meetingdetail:function(id){
                       	 mdboss.openPage(function (open) {
                                if (open) {
                                    seajs.use("meetingdetail", function (meetingdetail) {
                                  	  meetingdetail({"meetingid":id});
                                    });
                                }

                            });
                         },
                         bigevents:function(year){
                           	 mdboss.openPage(function (open) {
                                    if (open) {
                                        seajs.use("bigevents", function (bigevents) {
                                       	 bigevents({"year":year});
                                        });
                                    }

                                });
                           },
                    index:function(){
                    	 mdboss.openPage(function (open) {
                             if (open) {
                                 seajs.use("webindex", function (webindex) {
                                	 webindex();
                                 });
                             }

                         });
                    },
                    moreSn:function(){
                   	 mdboss.openPage(function (open) {
                            if (open) {
                                seajs.use("moreSn", function (moreSn) {
                                	moreSn();
                                });
                            }

                        });
                   },
                    projindex:function(){
                   	 mdboss.openPage(function (open) {
                            if (open) {
                                seajs.use("projindex", function (projindex) {
                                	projindex();
                                });
                            }

                        });
                   },
                   deptindex:function(){
                  	 mdboss.openPage(function (open) {
                           if (open) {
                               seajs.use("deptindex", function (deptindex) {
                            	   deptindex();
                               });
                           }

                       });
                  },
                  reportindex:function(){
                 	 mdboss.openPage(function (open) {
                          if (open) {
                              seajs.use("reportindex", function (reportindex) {
                            	  reportindex();
                              });
                          }

                      });
                 },
                    search:function(type,keyword){//全局搜索
                    	 mdboss.openPage(function (open) {
                             if (open) {
                            	 $("#rightMainContainer").html(require("text!../../template/common/loading.html?_"+nowTime));
                                 seajs.use("search", function (sch) {
                                	 sch(type, keyword);
                                 });
                             }
                         });
                    },
                    diagram:function(processinstcode){
                    	if (open) {
                    		$("#rightMainContainer").html(require("text!../../template/common/loading.html?_"+nowTime));
                    		seajs.use("diagram", function () {
                    			var model=new mdboss.Model.diagramModel();
                    			var diagramView=new mdboss.View.diagramView({model:model});
                    			diagramView.render({"processinstcode":processinstcode});
                    		});
                    		
                    	}
                    },
                    print:function(processinstcode,taskcode){
                    	 mdboss.openPage(function (open) {
                             if (open) {
                            	 seajs.use("print", function () {
                            		 new mdboss.View.printView({"processinstcode":processinstcode,"taskcode":taskcode,"usercode":mdboss.usercode});
                            	 });
                            	 
                             }
                         });
                    },
                    demo: function (type) {
                        mdboss.openPage(function (open) {
                            if (open) {
                            	$("#rightMainContainer").html(require("text!../../template/common/loading.html?_"+nowTime));
                                seajs.use("demo",function(project){
                                	project(type);
                                });
                            }
                        });
                    },
                    attend: function (type) {
                    	mdboss.openPage(function (open) {
                    		if (open) {
                    			$("#rightMainContainer").html(require("text!../../template/common/loading.html?_"+nowTime));
                    			seajs.use("attend",function(attendance){
                    				attendance(type,"attend");
                    			});

                    		}
                    	});
                    },
                    login: function (usercode) {
                        mdboss.openPage(function (open) {
                            if (open)
                            	$("#rightMainContainer").html(require("text!../../template/common/loading.html?_"+nowTime));
                                seajs.use("login", function (login) {
                                    new mdboss.View.loginPage({templateData: {usercode: usercode}})
                                });
                        }, "login");

                    },
                    dashboards: function () {
                        mdboss.openPage(function (open) {
                            if (open) {
                            	$("#rightMainContainer").html(require("text!../../template/common/loading.html?_"+nowTime));
                                seajs.use("dashboards", function (dashboards) {
                                    dashboards();
                                });
                            }

                        });
                    },
                    process: function (type,usercode) {
                        mdboss.openPage(function (open) {
                            if (open) {
                            	$("#rightMainContainer").html(require("text!../../template/common/loading.html?_"+nowTime));
                                seajs.use("process", function (process) {
                                    process(type, usercode,"process");
                                });
                            }

                        });
                    },
                    member: function () {
                        mdboss.openPage(function (open) {
                            if (open) {
                            	$("#rightMainContainer").html(require("text!../../template/common/loading.html?_"+nowTime));
                                seajs.use("member", function (memberorg) {
                                	memberorg();
                                });
                            }

                        });
                    },
                    //wuzy start 个人设置 
                    profile: function (type) {
                    	mdboss.openPage(function (open) {
                    		if (open) {
                    			$("#rightMainContainer").html(require("text!../../template/common/loading.html?_"+nowTime));
                    			seajs.use("profile", function (profile) {
                    				profile(type);
                    			});
                    		}
                    	});
                    },//end wuzy
                    
                    feed:function(type){
                    	mdboss.openPage(function (open) {
                            if (open) {
                            	$("#rightMainContainer").html(require("text!../../template/common/loading.html?_"+nowTime));
                                seajs.use("feed", function (feed) {
                                    feed(type);
                                });
                            };

                        });
                    },
                    load: function () {

                    },
                    defaultPage: function (pageid) {
                        if (pageid != null) {
                            mdboss.cache["data"].pageError = true;
                        }
                        mdboss.openPage(function (open) {
                            if (open)
                                seajs.use("error", function (error) {
                                    error();
                                });
                        }, "error");
                    }
                });
                mdboss.Router = new AppRouter;
            }
        },
        module: {},//存放公共模块
        $pageHeader: $("#header"),
        $pageWrap: $("#page-wrap"),
        $pageMain: $("#page-main"),
        $pageBody: $("#rightMainContainer"),
        $body: $("body"),
        cache: {
            data: {},
            template: {}
        },
        usercode: $.cookie("usercode"),
        workno: $.cookie("workno"),
        pageSize: 10,
        myinfo:  {},
        api: {
    			/* login logout */
    			"login" : baseConfig.base+"login",// 登陆
    			"logout" : baseConfig.base+"logout",// 登出
    			"getLoginState" : baseConfig.base+"rest/ucp/user/loginstate",// 获取用户登录状态
    			"getValidateCode" : baseConfig.base+"getValidateCode",// 获取验证码

    			/* header */
    			// 首页接口
    			"getModules" : baseConfig.base+"rest/ucp/mymodules",// 查询模块
    			"getMyInfo" : baseConfig.base+"rest/ucp/user/myinfo",// 我的信息
    			"getMyFollower" : baseConfig.base+"rest/ucp/user/myfollowers",// 我关注的人
    			"getMySubordinate" : baseConfig.base+"rest/ucp/user/mysubordinates",// 我的下属
    			"queryMySubordinate" : baseConfig.base+"rest/ucp/querymysubordinate",// 搜索我的下属
    			"getUserInfo" : baseConfig.base+"rest/ucp/user/userinfo",// 获取用户
    			"chgpwd" : baseConfig.base+"rest/ucp/user/chgpwd",// 修改密码
    			"resetpwd" : baseConfig.base+"rest/ucp/user/resetpwd",// 重置密码
    			"uploadavatar" : baseConfig.base+"rest/ucp/chgpwd",// 上传头像
    			"getMyProjects" : baseConfig.base+"rest/ucp/user/getMyProjects",// 查询项目 

    			/* 公文查询接口 */
//    			"queryBiaolist": baseConfig.base+"api/process/queryProcesseDef.json",//表单列表
    			"queryworkflow" : baseConfig.base+"rest/wfs/queryprocessdef",// 公文实例列表 公文查询接口
    			"queryProcesstype": baseConfig.base+"rest/common/dict/list",//公文分类查询
    			"addProcesstype": baseConfig.base+"rest/common/dict/add ",//公文分类添加
    			"delProcesstype":baseConfig.base+"rest/process/deltype",//删除公文分类
    			"queryTaskTodo" : baseConfig.base+"rest/wfs/tasks/all",// 全部待办
    			"queryMyTaskTodo" : baseConfig.base+"rest/wfs/tasks/mine",// 我的待办
    			"querySuborditnatesTaskTodo" : baseConfig.base+"rest/wfs/tasks/subordinates",// 我下属的待办
    			"queryProcessInstanceThroughed" : baseConfig.base+"rest/wfs/process-instances/throughed",// 我的经办
    			"queryProcessInstanceComplete" : baseConfig.base+"rest/wfs/tasks/mycomplete",// 我的已办
    			"queryProcessinstancesWatched" : baseConfig.base+"rest/wfs/process-instances/watched",// 我关注的公文
    			"queryProcessinstanceSharedtome" : baseConfig.base+"rest/wfs/process-instances/sharedtome",// 共享给我的公文
    			"deleteProcessinstanceSharedtome" : baseConfig.base+"rest/wfs/process/delshared",// 删除共享给我的公文

    			"queryProcessinstancesDone" : baseConfig.base+"rest/wfs/process-instances/done",// 办结公文
    			"queryProcessinstanceDraft" : baseConfig.base+"rest/wfs/process-instances/draft",// 草稿公文
    			"queryProcessinstanceHistory" : baseConfig.base+"rest/wfs/process-instances/all",// 历史公文-所有
    			"queryProcessinstancesStart" : baseConfig.base+"wfs/process-instances/start",// 我发起的公文
    			"querydoctimeline" : baseConfig.base+"rest/wfs/process/timeline",//--办理过程查询
    			"processCount" : baseConfig.base+"rest/wfs/myprocessstatinfo",// 我的公文统计
    			"deptProcessCount":  baseConfig.base+"rest/wfs/departmentprocesstatinfotop5",//部门TOP5公文统计 //
    	        "deanProcessCount":  baseConfig.base+"rest/wfs/instituteprocesstatinfotop5",//院内TOP5公文统计
    			'processDesc' : baseConfig.base+'rest/wfs/proecessdef/handle',// 待办公文详情
    			"queryprocesspart" : baseConfig.base+"rest/wfs/taskdetailinfo",// 公文环节处理信息查询
    			"stepchg":baseConfig.base+"rest/wfs/task/chg",//环节信息修改
    			"stepchgEdit":baseConfig.base+"rest/wfs/task/chgmore",//环节信息修改
    			"filterStarter" : baseConfig.base+"rest/wfs/filter/starter",// 公文筛选-申请人查询
    			"filterProcesses" : baseConfig.base+"rest/wfs/filter/processes",// 公文筛选-公文查询
    			"filterProjects" : baseConfig.base+"rest/wfs/filter/projects",// 公文筛选-项目查询
    			"filterTags" : baseConfig.base+"rest/wfs/filter/tags",// 公文筛选-标签查询
    			"querySericode":baseConfig.base+"rest/wfs/serialcode/list",//表单查询字号
    			// "querySuborditnatesTaskTodo":
    			// "api/process/querySuborditnatesTaskTodo.json",//我的已办
    			// 公文启用-停用接口
    			"processdefLoad" : baseConfig.base+"rest/wfs/process/load",// 发起公文--启用公文
    			"proecessdefHandle" : baseConfig.base+"rest/wfs/task/load",// 公文处理接口
    			"watchsharedone":baseConfig.base+"rest/wfs/processinst/view",
    			"processfinishsubtodo":baseConfig.base+"rest/wfs/task/view",
    			"processreaded":baseConfig.base+"rest/wfs/task/readed",//已阅提交
    			"submitTask" : baseConfig.base+"rest/wfs/task/commit",// 提交公文处理接口(点提交按钮时)
    			"startTask":baseConfig.base+"rest/wfs/process/startup",//启动提交
    			"queryZihao" : baseConfig.base+"rest/wfs/serialcode/nums",// 查询公文字号
    			"sunxu" : baseConfig.base+"rest/wfs/serialcode",//新建字号
    			"saveTask" : baseConfig.base+"rest/wfs/task/save",// 公文保存
    			"loaddraft":baseConfig.base+"rest/wfs/process/loaddraft",//加载草稿公文
    			"startSaveTask":baseConfig.base+"rest/wfs/process/save",//启动流程保存草稿
    			"taskWatch" : baseConfig.base+"rest/wfs/task/watch",// 公文关注
    			"cancelWatch" : baseConfig.base+"rest/wfs/task/cancelwatch",// 取消关注
    			"taskCircularize" : baseConfig.base+"rest/wfs/task/circularize",// 公文传阅
    			"withdraw" : baseConfig.base+"rest/wfs/task/withdraw",// 公文撤回
    			"taskmoveto" : baseConfig.base+"rest/wfs/task/moveto",//timeline 中 跳转
    			"delete_process" : baseConfig.base+"rest/wfs/processinst/del",// 删除公文-草稿
    			"circularize" : baseConfig.base+"rest/wfs/task/circularize",// 传阅
    			"taskBack" : baseConfig.base+"rest/wfs/task/back",// 公文回退
    			"processShare" : baseConfig.base+"rest/wfs/process/share",// 共享公文接口
    			"toShare" : baseConfig.base+"rest/wfs/task/personconfigload",// 共享人员

    			"preDiagram" : baseConfig.base+"rest/wfs/process/diagram",// 预览公文流程图接口
    			"diagram" : baseConfig.base+"rest/wfs/process/trace",// 流程图跟踪接口
    			"activity" : baseConfig.base+"rest/wfs/process/steps",// 查询流程环节接口
    			"personconfigload":baseConfig.base+"rest/wfs/task/personconfigload",//获取流程环节处理信息
    			"personconfig":baseConfig.base+"rest/wfs/task/personconfig",//流程环节处理
    			"activitytrack" : baseConfig.base+"rest/wfs/process/his/steps",
    			"docprocessremind" : "",// 公文流程提醒接口 --无路径
    			"formlist":baseConfig.base+"rest/wfs/form/list",
			
    			/* 组织结构 UCP接口 */
    			"orgs" : baseConfig.base+"rest/ucp/orgs",// 组织结构 大 查询组织结构
    			"org" : baseConfig.base+"rest/ucp/org/{id}",// 组织结构-下的 部门列表 (查询单个组织结构)
    			"members" : baseConfig.base+"rest/ucp/users",// 查询用户
    			"userdata" : baseConfig.base+"rest/wfs/task/userdata",// 选人控件
    			"selectMembers" : baseConfig.base+"rest/wfs/task/dataclassdata",// 选人控件
    			"userInfo" : baseConfig.base+"rest/ucp/user/",// 查询单个用户  rest/ucp/user/{id}
    			"usergroups" : baseConfig.base+"rest/ucp/usergroups",// 用户 群组
    			"usergroupmembers" : baseConfig.base+"rest/ucp/usergroupmembers",// 用户 群组成员
    			"role" : baseConfig.base+"rest/ucp/role",// 查询角色组
    			"userrole" : baseConfig.base+"rest/ucp/userrole",// 用户 角色成员
    			"updateUserById" : baseConfig.base+"rest/ucp/user/chg",// 用户信息修改
    			"userCard" : baseConfig.base+"rest/ucp/user/card",// 用户卡片信息

    			"orgMembers" : baseConfig.base+"rest/ucp/org/{id}/members",// 查询组织用户 (未使用)
    			"createusergroups" : baseConfig.base+"rest/ucp/createusergroups",// 创建群组 ---

    			/** 未读* */
    			"newItems" : baseConfig.base+"api/feed/newItems.json",//  未读事项暂无接口
    			"demoData" : baseConfig.base+"api/demo/demo.json",
    			"processStart" : baseConfig.base+"rest/wfs/processdef",
    			"editForm" : baseConfig.base+"rest/wfs/process/chg",// 公文表單修改

    			"deleteForm" : baseConfig.base+"rest/wfs/process/del",// 刪除公文表單
    			"createCategory" : baseConfig.base+"api/process/createCategory.json",

    			"remind" : baseConfig.base+"rest/wfs/task/remind",// 提醒 
    			"yswprint" : baseConfig.base+"rest/wfs/processinst/print",// 打印 

    			"querycommonopinion" : baseConfig.base+"rest/common/wordscommonuse/list",// 查询常用语
    			"addcommonopinion" : baseConfig.base+"rest/common/wordscommonuse/add",// 添加常用语
    			"delcommonopinion" : baseConfig.base+"rest/common/wordscommonuse/del",// 删除常用语
    			"chgcommonopinion": baseConfig.base+"rest/common/wordscommonuse/chg",//设定为常用语
    			"fileupload" : baseConfig.base+"upload",// 文件上传
    			
    			"fileuploadCommon" : baseConfig.base+"rest/common/upload",// 文件上传通用接口
    			

    			// 2015-6-18
    			"createmembergroup" : baseConfig.base+"rest/ucp/createmembergroup", // 创建群组用户
    			"terminationProcess" : baseConfig.base+"rest/wfs/processinst/terminal",// 终止
    			"search" : baseConfig.base+"rest/oa/search",// 全局搜索

    			// 人力管理 2015-6-21
    			"querytravelstatistic":baseConfig.base+ "rest/hr/attendance/querytravelstatistic",//首页统计 
            	"allinstitutetravelcountinmonth":baseConfig.base+ "rest/hr/attendance/allinstitutetravelcount",//首页全院统计 
            	"deptravelcountinmonth":baseConfig.base+ "rest/hr/attendance/deptravelcount",//首页部门出差统计 
            	"myorgtraveluserinfo":baseConfig.base+"rest/hr/attendance/myorgtraveluserinfo",//我部出差
            	"tomyorgtraveluserinfo":baseConfig.base+"rest/hr/attendance/tomyorgtraveluserinfo",//到我部出差
            	"selectcheckinoutIntoalldaysignin":baseConfig.base+"rest/hr/attendance/selectcheckinoutIntoalldaysignin",//签到数据同步接口
            	"showcheckinoutsynchrooperate":baseConfig.base+"rest/hr/attendance/showcheckinoutsynchrooperate",//是否显示签到数据同步按钮
            	
    			"countcheckinnum" : baseConfig.base+"rest/hr/attendance/countsignin",// 统计签到次数
    			"querycheckindetail" : baseConfig.base+"rest/hr/attendance/querysignindetail",// 查看签到明细
    			"counttraveldays" : baseConfig.base+"rest/hr/attendance/counttraveldays",// 统计差旅天数
    			"querytravelcheckindetail" : baseConfig.base+"rest/hr/attendance/querytravelsignindetail",// 查看差旅签到明细
    			"querycheckexact" : baseConfig.base+"rest/hr/attendance/queryresignin",// 查询补签记录
    			"applycheckexact" : baseConfig.base+"rest/hr/attendance/applyresignin",// 申请补签
    			"auditcheckexact" : baseConfig.base+"rest/hr/attendance/auditresignin",// 审批补签
    			"deleteapplycheckexact" : baseConfig.base+"rest/hr/attendance/delapplyresignin",// 删除补签申请记录
    			"setupworkday" : baseConfig.base+"rest/hr/attendance/defineworkday",// 工作日定义
    			"queryworkday" : baseConfig.base+"rest/hr/attendance/queryworkday",// 工作日定义查询
    			"setupworktime" : baseConfig.base+"rest/hr/attendance/modifyworktime",// 工作时间修改
    			"queryrealtimecheckin" : baseConfig.base+"rest/hr/attendance/queryalldaysignin",// 实时查询签到记录
    			"queryexport":"http://localhost/fileserver/base/mdbossexport_exportInfo.do",//导出时数据显示
	            "exportsubmit":"http://localhost/fileserver/base/mdbossexport_export.do",//导出提交
    			
    			"deployprocdef":baseConfig.base+"rest/wfs/process/deploy",//流程部署
				"addProcesstype": baseConfig.base+"rest/common/dict/add",//公文分类添加
				"delProcesstype": baseConfig.base+"rest/wfs/process/deltype",//删除公文分类
				
				
				//表单管理  2015-7-6
				"formitemchg":baseConfig.base+"rest/wfs/form/chgitem",//表单项编缉
				"duplicateitem":baseConfig.base+"rest/wfs/form/duplicateitem",//表单项编缉
				"listoneitem":baseConfig.base+"rest/wfs/form/listoneitem",//表单项记录单条
				"formitemdel":baseConfig.base+"rest/wfs/form/delitem",//删除表单项
				"formitemadd":baseConfig.base+"rest/wfs/form/additem",//添加表单 
				"formitemedit":baseConfig.base+"rest/wfs/form/chgitems",//添加表单 
				"formitemlist":baseConfig.base+"rest/wfs/form/listitem",//表单配置 
				//
				"formqueryall":baseConfig.base+"rest/wfs/form/queryall",//表单查询
				"formchg":baseConfig.base+"rest/wfs/form/chg",//表单编缉
				"duplicate":baseConfig.base+"rest/wfs/form/duplicate",//表单复制
				"formdel":baseConfig.base+"rest/wfs/form/del",//删除表单
				"formadd":baseConfig.base+"rest/wfs/form/add",//添加表单 
				"formdeltype":baseConfig.base+"rest/wfs/form/deltype",//删除表单分类 
				
				"processtypelist":baseConfig.base+"rest/common/wfs/commonService/Processtype/query",//表单分类列表 
				"processtypeadd":baseConfig.base+"rest/common/wfs/commonService/Processtype/create",//添加表单分类 
				"processtypedelete":baseConfig.base+"rest/common/wfs/commonService/Processtype/deleteById",//删除表单分类 
				"processtypeupdate":baseConfig.base+"rest/common/wfs/commonService/Processtype/updateById",//删除表单分类 
				
				"processetree":baseConfig.base+"rest/wfs/queryprocesstree",//公文流程查询/表单查询 
				"workflowlist":baseConfig.base+"rest/common/wfs/commonService/Workflow/query",//公文流程查询/表单查询 
				"workflowdetail":baseConfig.base+"rest/common/wfs/commonService/Workflow/queryById",//公文流程查询/表单查询 
				"workflowadd":baseConfig.base+"rest/common/wfs/commonService/Workflow/create",//添加 
				"workflowdelete":baseConfig.base+"rest/common/wfs/commonService/Workflow/deleteById",//删除 
				"workflowbatchdelete":baseConfig.base+"rest/common/wfs/commonService/Workflow/deleteById",//删除 
				"workflowupdate":baseConfig.base+"rest/common/wfs/commonService/Workflow/updateById",//编辑
				"workflowbatchupdate":baseConfig.base+"rest/common/wfs/commonService/Workflow/updateByIds",//编辑
				
				
				"queryworkform":baseConfig.base+"rest/common/wfs/commonService/Form/query",//表单查询 
				"workformdetail":baseConfig.base+"rest/common/wfs/commonService/Form/queryById",//表单查询 
				"workformadd":baseConfig.base+"rest/common/wfs/commonService/Form/create",//添加 
				"workformdelete":baseConfig.base+"rest/common/wfs/commonService/Form/deleteById",//删除 
				"workformbatchdelete":baseConfig.base+"rest/common/wfs/commonService/Form/deleteByIds",//删除 
				"workformupdate":baseConfig.base+"rest/common/wfs/commonService/Form/updateById",//编辑
				"workformbatchupdate":baseConfig.base+"rest/common/wfs/commonService/Form/updateByIds",//编辑
				
				"workformitemlist":baseConfig.base+"rest/common/wfs/commonService/Formitem/query",//表单项查询 
				"workformitemdetail":baseConfig.base+"rest/common/wfs/commonService/Formitem/queryById",//表单项查询 
				"workformitemadd":baseConfig.base+"rest/common/wfs/commonService/Formitem/create",//添加 
				"workformitemdelete":baseConfig.base+"rest/common/wfs/commonService/Formitem/deleteById",//删除 
				"workformitemupdate":baseConfig.base+"rest/common/wfs/commonService/Formitem/updateById",//编辑
				"workformitembatchupdate":baseConfig.base+"rest/common/wfs/commonService/Formitem/updateByIds",//编辑
				
				"stepinfolist":baseConfig.base+"rest/common/wfs/commonService/Step/query",//环节查询 
				"stepinfodetail":baseConfig.base+"rest/common/wfs/commonService/Step/queryById",//环节查询 
				"stepinfoadd":baseConfig.base+"rest/common/wfs/commonService/Step/create",//添加 
				"stepinfodelete":baseConfig.base+"rest/common/wfs/commonService/Step/deleteById",//删除 
				"stepinfoupdate":baseConfig.base+"rest/common/wfs/commonService/Step/updateById",//编辑
				"stepinfobatchupdate":baseConfig.base+"rest/common/wfs/commonService/Step/updateByIds",//编辑 
				
				//UCP 
				"widgetsectionlist":baseConfig.base+"rest/common/ucp/commonService/Widgetsection/query",//组件查询 
				"widgetsectiondelete":baseConfig.base+"rest/common/ucp/commonService/Widgetsection/deleteById",//组件查询 
				"widgetlist":baseConfig.base+"rest/common/ucp/commonService/Widgetdef/query",//组件查询 
				"widgetdetail":baseConfig.base+"rest/common/ucp/commonService/Widgetdef/queryById",//查询 
				"widgetadd":baseConfig.base+"rest/common/ucp/commonService/Widgetdef/create",//添加 
				"widgetdelete":baseConfig.base+"rest/common/ucp/commonService/Widgetdef/deleteById",//删除 
				//"widgetupdate":baseConfig.base+"rest/common/ucp/commonService/Widgetdef/updateById",//编辑
				"widgetupdate":baseConfig.base+"rest/ucp/widget/chg",//编辑组件
				"widgetbatchupdate":baseConfig.base+"rest/common/ucp/commonService/Widgetdef/updateByIds",//编辑 
				
				"feeitemdelete":baseConfig.base+"rest/common/ucp/commonService/Feeitem/deleteById",//费用项查询 
				"feeitemlist":baseConfig.base+"rest/common/ucp/commonService/Feeitem/query",//费用项查询 
				"feeitemadd":baseConfig.base+"rest/common/ucp/commonService/Feeitem/create",//费用项添加
				"feeitemedit":baseConfig.base+"rest/common/ucp/commonService/Feeitem/updateById",//费用项添加
				"feetypelist":baseConfig.base+"rest/common/ucp/commonService/Feetype/query",//费用项查询 
				"feetypedetail":baseConfig.base+"rest/common/ucp/commonService/Feetype/queryById",//环节查询 
				"feetypeadd":baseConfig.base+"rest/common/ucp/commonService/Feetype/create",//添加 
				"feetypedelete":baseConfig.base+"rest/common/ucp/commonService/Feetype/deleteById",//删除 
				"feetypeupdate":baseConfig.base+"rest/common/ucp/commonService/Feetype/updateById",//编辑
				"feetypebatchupdate":baseConfig.base+"rest/common/ucp/commonService/Feetype/updateByIds",//编辑 TODO
				
				"formchgstate":baseConfig.base+"rest/wfs/form/chgstate",//表单状态修改
				"formchg":baseConfig.base+"rest/wfs/form/chg",//表单编辑
				
				//2015-7-13 门户接口 Potal
				"portal_showframe":baseConfig.base+"rest/cms/showframe",//框架显示接口
				//"portal_showframe":"api/cms/portal_showframe.json",//框架显示接口 TODO
				"portal_showcolumn":baseConfig.base+"rest/cms/showcolumn",//门户栏目内容显示接口
				"portal_bigevents":baseConfig.base+"rest/cms/bigevents",//大事记查询接口
				"portal_bigeventdetails":baseConfig.base+"rest/cms/bigeventdetails",//大事记详情接口
				"portal_linkurl":baseConfig.base+"rest/cms/linkurl",//友情链接查询接口
				"info_query":baseConfig.base+"rest/cms/info/query",//资讯列表查询接口
				"info_queryinfodetails":baseConfig.base+"rest/cms/info/queryinfodetails",//资讯详情查询接口
				"demolist":baseConfig.base+"api/demo/demo.json",
				"demobatchdel":baseConfig.base+"api/demo/ok.json",
				"demodetail":baseConfig.base+"api/demo/detail.json",				
				
				//委托管理   2015-7-30 
				"entrust":baseConfig.base+"rest/common/wfs/commonService/Delegation/query",//委托编缉
				"entrustdetail":baseConfig.base+"rest/common/wfs/commonService/Delegation/queryById",//委托详情
				"deleteentrust":baseConfig.base+"rest/common/wfs/commonService/Delegation/deleteById",//删除
				"batchdeleteentrust":baseConfig.base+"rest/common/wfs/commonService/Delegation/deleteByIds",//批量删除
				"entrustadd":baseConfig.base+"rest/common/wfs/commonService/Delegation/create",//添加
				"entrustedit":baseConfig.base+"rest/common/wfs/commonService/Delegation/updateById",//编辑
				"entrustbatchedit":baseConfig.base+"rest/common/wfs/commonService/Delegation/updateByIds",//编辑
				"backdepute":baseConfig.base+"rest/common/wfs/commonService/Delegation/deleteByIds",//回收所有权限
				
				//系统管理 2015-7-30
				"sysmodulelist":baseConfig.base+"rest/common/ucp/commonService/Module/query",//模块列表
				"moduledelete":baseConfig.base+"rest/common/ucp/commonService/Module/deleteById",//删除
				"moduleadd":baseConfig.base+"rest/common/ucp/commonService/Module/create",//新增
				"moduleedit":baseConfig.base+"rest/common/ucp/commonService/Module/updateById",//编辑
				"modulebatchedit":baseConfig.base+"rest/common/ucp/commonService/Module/updateByIds",//编辑
				"moduledetail":baseConfig.base+"rest/common/ucp/commonService/Module/queryById",//详情
				"moduledeletebatch":baseConfig.base+"rest/common/ucp/commonService/Module/deleteByIds",//批量删除
				
				"syspermlist":baseConfig.base+"rest/common/ucp/commonService/Perm/query",//权限列表
				"permdelete":baseConfig.base+"rest/common/ucp/commonService/Perm/deleteById",//删除
				"permadd":baseConfig.base+"rest/common/ucp/commonService/Perm/create",//新增
				"permedit":baseConfig.base+"rest/common/ucp/commonService/Perm/updateById",//编辑
				"permbatchedit":baseConfig.base+"rest/common/ucp/commonService/Perm/updateByIds",//编辑
				"permdetail":baseConfig.base+"rest/common/ucp/commonService/Perm/queryById",//详情
				"permdeletebatch":baseConfig.base+"rest/common/ucp/commonService/Perm/deleteByIds",//批量删除
				
				"sysorglist":baseConfig.base+"rest/common/ucp/commonService/Org/query",//组织列表
				"orgdelete":baseConfig.base+"rest/common/ucp/commonService/Org/deleteById",//删除
				"orgadd":baseConfig.base+"rest/common/ucp/commonService/Org/create",//新增
				"orgedit":baseConfig.base+"rest/common/ucp/commonService/Org/updateById",//编辑
				"orgbatchedit":baseConfig.base+"rest/common/ucp/commonService/Org/updateByIds",//编辑
				"orgdetail":baseConfig.base+"rest/common/ucp/commonService/Org/queryById",//详情
				"orgdeletebatch":baseConfig.base+"rest/common/ucp/commonService/Org/deleteByIds",//批量删除
				
				"sysrolelist":baseConfig.base+"rest/common/ucp/commonService/Role/query",//权限列表
				"roledelete":baseConfig.base+"rest/common/ucp/commonService/Role/deleteById",//删除
				"roleadd":baseConfig.base+"rest/common/ucp/commonService/Role/create",//新增
				"roleedit":baseConfig.base+"rest/common/ucp/commonService/Role/updateById",//编辑
				"rolebatchedit":baseConfig.base+"rest/common/ucp/commonService/Role/updateByIds",//编辑
				"rolebatchedit":baseConfig.base+"rest/common/ucp/commonService/Role/updateByIds",//编辑
				"roledetail":baseConfig.base+"rest/common/ucp/commonService/Role/queryById",//详情
				"roledeletebatch":baseConfig.base+"rest/common/ucp/commonService/Role/deleteByIds",//批量删除
				
				"sysoperatelist":baseConfig.base+"rest/common/ucp/commonService/User/query",//权限列表
				"operatedelete":baseConfig.base+"rest/common/ucp/commonService/User/deleteById",//删除
				//"operateadd":baseConfig.base+"rest/common/ucp/commonService/User/create",//新增用户
				"operateadd":baseConfig.base+"rest/ucp/user/create",//新增用户
				"operateedit":baseConfig.base+"rest/common/ucp/commonService/User/updateSelectiveById",//编辑
				"operatebatchedit":baseConfig.base+"rest/common/ucp/commonService/User/updateByIds",//编辑
				"operatedetail":baseConfig.base+"rest/common/ucp/commonService/User/queryById",//详情
				"operatedeletebatch":baseConfig.base+"rest/common/ucp/commonService/User/deleteByIds",//批量删除
				
				"sysparamlist":baseConfig.base+"rest/common/ucp/commonService/SysParam/query",//系统参数列表
				"paramdelete":baseConfig.base+"rest/common/ucp/commonService/SysParam/deleteById",//删除
				"paramadd":baseConfig.base+"rest/common/ucp/commonService/SysParam/create",//新增
				"paramedit":baseConfig.base+"rest/common/ucp/commonService/SysParam/updateById",//编辑
				"parambatchedit":baseConfig.base+"rest/common/ucp/commonService/SysParam/updateByIds",//编辑
				"paramdetail":baseConfig.base+"rest/common/ucp/commonService/SysParam/queryById",//详情
				"paramdeletebatch":baseConfig.base+"rest/common/ucp/commonService/SysParam/deleteByIds",//批量删除
				
				"sysdictlist":baseConfig.base+"rest/common/ucp/commonService/DictItem/query",//数据字典列表
				"dictdelete":baseConfig.base+"rest/common/ucp/commonService/DictItem/deleteById",//删除
				"sysdictadd":baseConfig.base+"rest/common/ucp/commonService/DictItem/create",//新增
				"dictedit":baseConfig.base+"rest/common/ucp/commonService/DictItem/updateById",//编辑
				"dictbatchedit":baseConfig.base+"rest/common/ucp/commonService/DictItem/updateByIds",//编辑
				"dictdetail":baseConfig.base+"rest/common/ucp/commonService/DictItem/queryById",//详情
				"dictdeletebatch":baseConfig.base+"rest/common/ucp/commonService/DictItem/deleteByIds",//批量删除
				
				"sysgrouplist":baseConfig.base+"rest/common/ucp/commonService/Usergroup/query",//群组列表
				"groupdelete":baseConfig.base+"rest/common/ucp/commonService/Usergroup/deleteById",//删除
				"sysgroupadd":baseConfig.base+"rest/common/ucp/commonService/Usergroup/create",//新增
				"groupedit":baseConfig.base+"rest/common/ucp/commonService/Usergroup/updateById",//编辑
				"groupbatchedit":baseConfig.base+"rest/common/ucp/commonService/Usergroup/updateByIds",//编辑
				"groupdetail":baseConfig.base+"rest/common/ucp/commonService/Usergroup/queryById",//详情
				"groupdeletebatch":baseConfig.base+"rest/common/ucp/commonService/Usergroup/deleteByIds",//批量删除
				
				"groupuserlist":baseConfig.base+"rest/common/ucp/commonService/UsergroupMember/query",//群组成员 
				"groupuseradd":baseConfig.base+"rest/common/ucp/commonService/UsergroupMember/create",//添加群组成员
				"groupuserbatchadd":baseConfig.base+"rest/common/ucp/commonService/UsergroupMember/batchcreate",//批量添加群组成员
				"groupuserdelete":baseConfig.base+"rest/common/ucp/commonService/UsergroupMember/deleteById",//删除群组成员
				
				"sysroleplist":baseConfig.base+"rest/common/ucp/commonService/RolePerm/query",//授权列表
				"rolepdelete":baseConfig.base+"rest/common/ucp/commonService/RolePerm/deleteById",//删除
				"rolepadd":baseConfig.base+"rest/common/ucp/commonService/RolePerm/create",//新增
				"rolepedit":baseConfig.base+"rest/common/ucp/commonService/RolePerm/updateById",//编辑
				"rolepbatchedit":baseConfig.base+"rest/common/ucp/commonService/RolePerm/updateByIds",//编辑
				"rolepdetail":baseConfig.base+"rest/common/ucp/commonService/RolePerm/queryById",//详情
				"rolepdeletebatch":baseConfig.base+"rest/common/ucp/commonService/RolePerm/deleteByIds",//批量删除
				
				"roleuserlist":baseConfig.base+"rest/common/ucp/commonService/UserRole/query",//查询角色用户
				"roleuserbatchadd":baseConfig.base+"rest/common/ucp/commonService/UserRole/batchcreate",//批量添加角色用户 
				"roleuserdelete":baseConfig.base+"rest/common/ucp/commonService/UserRole/deleteById",//删除角色用户
				
//				"userrole":baseConfig.base+"rest/ucp/roleperm/listperms",//用户角色
				"userroleadd":baseConfig.base+"rest/ucp/user/chguserroles",//角色添加
				
				"rolepermedit":baseConfig.base+"rest/ucp/roleperm/listperms",//角色授权添加
				"rolepermadd":baseConfig.base+"rest/ucp/roleperm/chgperms",//角色授权 修改
				"rolepermlist":baseConfig.base+"rest/ucp/user/listperms",//角色授权列表
				"roleprocess":"api/system/processlist.json",//角色授权中-- 流程列表 TODO
				
				
				"feedbacklist":baseConfig.base+"rest/common/oa/commonService/RmIssues/query",//问题列表
				"feedbackdelete":baseConfig.base+"rest/common/oa/commonService/RmIssues/deleteById",//删除
				"feedbackadd":baseConfig.base+"rest/common/oa/commonService/RmIssues/create",//新增
				"feedbackedit":baseConfig.base+"rest/common/oa/commonService/RmIssues/updateWithBlob",//编辑
				"feedbackbatchedit":baseConfig.base+"rest/common/oa/commonService/RmIssues/updateByIds",//编辑
				"feedbackview":baseConfig.base+"rest/common/cms/commonService/News/queryById",//详情
				"feedbackdeletebatch":baseConfig.base+"rest/common/oa/commonService/RmIssues/deleteByIds",//批量删除
				
				"answerlist":baseConfig.base+"rest/common/oa/commonService/RmIssueanswer/query",//反馈列表
				"answerdelete":baseConfig.base+"rest/common/oa/commonService/RmIssueanswer/deleteById",//删除
				"answeradd":baseConfig.base+"rest/common/oa/commonService/RmIssueanswer/create",//新增
				"answeredit":baseConfig.base+"rest/common/oa/commonService/RmIssueanswer/updateWithBlob",//编辑
				"answerbatchedit":baseConfig.base+"rest/common/oa/commonService/RmIssueanswer/updateByIds",//编辑
				"answerview":baseConfig.base+"rest/common/oa/commonService/RmIssueanswer/queryById",//详情
				"answerdeletebatch":baseConfig.base+"rest/common/oa/commonService/RmIssueanswer/deleteByIds",//批量删除
				
				"cachetlist":baseConfig.base+"rest/common/oa/commonService/OrgCachet/query",//公章列表
				"cachetdelete":baseConfig.base+"rest/common/oa/commonService/OrgCachet/deleteById",//删除
				"cachetadd":baseConfig.base+"rest/common/oa/commonService/OrgCachet/create",//新增
				"cachetedit":baseConfig.base+"rest/common/oa/commonService/OrgCachet/updateById",//编辑
				"cachetbatchedit":baseConfig.base+"rest/common/oa/commonService/OrgCachet/updateByIds",//编辑
				"cachetview":baseConfig.base+"rest/common/oa/commonService/OrgCachet/queryById",//详情
				"cachetdeletebatch":baseConfig.base+"rest/common/oa/commonService/OrgCachet/deleteByIds",//批量删除
				
				"redheadlist":baseConfig.base+"rest/common/oa/commonService/DocReddocmanager/query",//红头模版列表
				"redheaddelete":baseConfig.base+"rest/common/oa/commonService/DocReddocmanager/deleteById",//删除
				"redheadadd":baseConfig.base+"rest/common/oa/commonService/DocReddocmanager/create",//新增
				"redheadedit":baseConfig.base+"rest/common/oa/commonService/DocReddocmanager/updateById",//编辑
				"redheadbatchedit":baseConfig.base+"rest/common/oa/commonService/DocReddocmanager/updateByIds",//编辑
				"redheadview":baseConfig.base+"rest/common/oa/commonService/DocReddocmanager/queryById",//详情
				"redheaddeletebatch":baseConfig.base+"rest/common/oa/commonService/DocReddocmanager/deleteByIds",//批量删除
				
				"devicelist":baseConfig.base+"rest/common/oa/commonService/Device/query",//设备列表
				"devicedelete":baseConfig.base+"rest/common/oa/commonService/Device/deleteById",//删除
				"deviceadd":baseConfig.base+"rest/common/oa/commonService/Device/create",//新增
				"deviceedit":baseConfig.base+"rest/common/oa/commonService/Device/updateById",//编辑
				"devicebatchedit":baseConfig.base+"rest/common/oa/commonService/Device/updateByIds",//编辑
				"deviceview":baseConfig.base+"rest/common/oa/commonService/Device/queryById",//详情
				"devicedeletebatch":baseConfig.base+"rest/common/oa/commonService/Device/deleteByIds",//批量删除
				
				"assestslist":baseConfig.base+"rest/common/oa/commonService/Assests/query",//资产列表
				"assestsdelete":baseConfig.base+"rest/common/oa/commonService/Assests/deleteById",//删除
				"assestsadd":baseConfig.base+"rest/common/oa/commonService/Assests/create",//新增
				"assestsedit":baseConfig.base+"rest/common/oa/commonService/Assests/updateById",//编辑
				"assestsbatchedit":baseConfig.base+"rest/common/oa/commonService/Assests/updateByIds",//编辑
				"assestsview":baseConfig.base+"rest/common/oa/commonService/Assests/queryById",//详情
				"assestsdeletebatch":baseConfig.base+"rest/common/oa/commonService/Assests/deleteByIds",//批量删除
				
				"multiselAsync":baseConfig.base+"rest/wfs/form/dynamicformitem",//多选框异步填充数据
				
				
				//项目 2015-09-04
				"projectrolelist":baseConfig.base+"rest/common/pm/commonService/ProjectRole/query", //项目角色
				"projectroleadd":baseConfig.base+"rest/common/pm/commonService/ProjectRole/create", //项目角色 添加
				"projectroleedit":baseConfig.base+"rest/common/pm/commonService/ProjectRole/updateById", //项目角色 修改
				"projectroledelete":baseConfig.base+"rest/common/pm/commonService/ProjectRole/deleteById", //项目角色 删除
				"projectrolebatchedit":baseConfig.base+"rest/common/pm/commonService/ProjectRole/updateByIds",//编辑
				"projectroleview":baseConfig.base+"rest/common/pm/commonService/ProjectRole/queryById",//详情
				"projectroledeletebatch":baseConfig.base+"rest/common/pm/commonService/ProjectRole/deleteByIds",//批量删除
				"projectprofess":baseConfig.base+"rest/common/pm/commonService/SpecialtyTemplate/query", //专业框架查询
				"projectprofessdelete":baseConfig.base+"rest/common/pm/commonService/SpecialtyTemplate/deleteById", //专业框架删除
				"projectprofessorgs":baseConfig.base+"rest/common/pm/commonService/ProjectOrgTemplate/query",
				"projectprofessadd":baseConfig.base+"rest/pm/specialtytemplate/create", //专业框架添加
				"projectprofessedit":baseConfig.base+"rest/pm/specialtytemplate/chg", //专业框架编辑
				"projectarchitect":baseConfig.base+"rest/common/pm/commonService/ProjectTemplate/query", //项目架构列表查询配置
				"projectarchitectdelete":baseConfig.base+"rest/common/pm/commonService/ProjectTemplate/deleteById", //删除项目架构列表查询配置
				"projectarchitectadd":baseConfig.base+"rest/common/pm/commonService/ProjectTemplate/create", //项目架构配置 添加
				"projectarchitectedit":baseConfig.base+"rest/common/pm/specialty/create", //项目架构配置 修改
				"projectarchitectview":baseConfig.base+"rest/pm/project/templatelist", //项目架构树查询 修改
//				"projectlist":baseConfig.base+"rest/pm/project/query",//项目列表
				"projectlist":baseConfig.base+"rest/common/pm/commonService/Project/query",//项目列表
				"professlist":baseConfig.base+"rest/common/pm/commonService/Specialty/query",//专业列表
//				"professlist":baseConfig.base+"rest/pm/specialty/query",//专业列表
				
				
				
				"projectphaselist":baseConfig.base+"rest/common/pm/commonService/Projectphase/query", //项目阶段
				"projectphaseadd":baseConfig.base+"rest/common/pm/commonService/Projectphase/create", //项目阶段 添加
				"projectphaseedit":baseConfig.base+"rest/common/pm/commonService/Projectphase/updateById", //项目阶段 修改
				"projectphasedelete":baseConfig.base+"rest/common/pm/commonService/Projectphase/deleteById", //项目阶段删除
				"projectphaseview":baseConfig.base+"rest/common/pm/commonService/Projectphase/queryById", //项目阶段  
				"projectphasebatchedit":baseConfig.base+"rest/common/pm/commonService/Projectphase/updateByIds",//编辑
				"projectphasedeletebatch":baseConfig.base+"rest/common/pm/commonService/Projectphase/deleteByIds",//批量删除
				
				"projectadd":baseConfig.base+"rest/pm/project/chg", //项目添加
				"projectarchitectedit":baseConfig.base+"rest/pm/projectorg/org", //项目编辑,架构树
				
				
				//oa模块 2015-09-15 
				"meetinglist":baseConfig.base+"rest/oa/meeting/bookingdetail",//会议室预定列表
				"meetingdelete":baseConfig.base+"rest/oa/meeting/unsubscribemeeting",//退订
				"meetingadd":baseConfig.base+"rest/oa/meeting/createmeetingbooking",//新增
				"meetingedit":baseConfig.base+"rest/oa/meeting/createmeetingbooking",//编辑
				"meetingbatchedit":baseConfig.base+"rest/common/oa/commonService/MeetingBooking/updateByIds",//编辑
				"meetingview":baseConfig.base+"rest/common/oa/commonService/MeetingBooking/query",//详情
				"meetingdeletebatch":baseConfig.base+"rest/common/oa/commonService/MeetingBooking/deleteByIds",//批量删除
				//
				"meetingroomlist":baseConfig.base+"rest/oa/meeting/querymeetingroom",//会议室列表
				"meetingroomdelete":baseConfig.base+"rest/oa/meeting/deletemeetingroom",//删除
				"meetingroomadd":baseConfig.base+"rest/oa/meeting/createmeetingroom",//新增
				"meetingroomedit":baseConfig.base+"rest/oa/meeting/modifymeetingroom",//编辑
//				"meetingroombatchedit":baseConfig.base+"rest/common/oa/commonService/Meetingroom/updateByIds",//编辑
				"meetingroomview":baseConfig.base+"rest/common/oa/commonService/Meetingroom/queryById",//详情
				"meetingroomdeletebatch":baseConfig.base+"rest/oa/meeting/batchdeletemeetingroom",//批量删除
				
				//"seriallist":baseConfig.base+"rest/common/wfs/commonService/Serial/query",//字号列表
				"seriallist":baseConfig.base+"rest/wfs/serialcode/list",//字号列表
				"serialdelete":baseConfig.base+"rest/common/wfs/commonService/Serial/deleteById",//删除
				"serialadd":baseConfig.base+"rest/common/wfs/commonService/Serial/create",//新增
				"serialedit":baseConfig.base+"rest/common/wfs/commonService/Serial/updateById",//编辑
				"serialbatchedit":baseConfig.base+"rest/common/wfs/commonService/Serial/updateByIds",//编辑
				"serialview":baseConfig.base+"rest/common/wfs/commonService/Serial/queryById",//详情
				"serialdeletebatch":baseConfig.base+"rest/common/wfs/commonService/Serial/deleteByIds",//批量删除
				
				"tablelist":baseConfig.base+"rest/common/ucp/commonService/TableConfig/query",//数据库 表
				"tabledelete":baseConfig.base+"rest/common/ucp/commonService/TableConfig/deleteById",//删除
				"tableadd":baseConfig.base+"rest/common/ucp/commonService/TableConfig/create",//新增
				"tableedit":baseConfig.base+"rest/common/ucp/commonService/TableConfig/updateById",//编辑
				"tableview":baseConfig.base+"rest/common/ucp/commonService/TableConfig/queryById",//详情
				"tabledeletebatch":baseConfig.base+"rest/common/ucp/commonService/TableConfig/deleteByIds",//批量删除
				
				"columnlist":baseConfig.base+"rest/common/ucp/commonService/TableColumnConfig/query",//数据库 表column列表
				"columndelete":baseConfig.base+"rest/common/ucp/commonService/TableColumnConfig/deleteById",//删除
				"columnadd":baseConfig.base+"rest/common/ucp/commonService/TableColumnConfig/create",//新增
				"columnedit":baseConfig.base+"rest/common/ucp/commonService/TableColumnConfig/updateById",//编辑
				"columnview":baseConfig.base+"rest/common/ucp/commonService/TableColumnConfig/queryById",//详情
				"columndeletebatch":baseConfig.base+"rest/common/ucp/commonService/TableColumnConfig/deleteByIds",//批量删除
				
				
				"qrcode":baseConfig.base+"api/demo/ok.json",//图纸二维码生成
				"blueprintlist":baseConfig.base+"api/oa/blueprint.json",//图纸二维码生成
				"folderlist":baseConfig.base+"rest/common/fsp/commonService/Folder/query",//文件目录结构
				"folderadd":baseConfig.base+"rest/common/fsp/commonService/Folder/create",//文件目录结构
				"folderedit":baseConfig.base+"rest/common/fsp/commonService/Folder/updateSelectiveById",//文件目录结构
				"folderdelete":baseConfig.base+"rest/common/fsp/commonService/Folder/deleteById",//文件目录结构
				"folderfilelist":baseConfig.base+"rest/common/fsp/commonService/Virtualfile/query",//文件列表
				"folderfileedit":baseConfig.base+"rest/common/fsp/commonService/Virtualfile/updateSelectiveById",//文件列表
				"folderfileadd":baseConfig.base+"rest/fsp/updateVirtualfileByFilecode",//更新文件
//				"folderfileadd":baseConfig.base+"rest/common/uploadonefileandformdata",//文件上传
				
				//首页模块拖动
				"dashMoudleQuery":baseConfig.base+"rest/ucp/widget/list",
				"dashMoudleUpdate":baseConfig.base+"rest/ucp/widget/chg",
				"dashMoudleReset":baseConfig.base+"rest/ucp/widget/reset",
				"pickerformdata":baseConfig.base+"rest/wfs/form/dynamicform",
				
				//首页快捷方式管理
				"snMoudleQuery":baseConfig.base+"rest/common/cms/commonService/Shortcut/list",//查询
				"snMoudleUpdate":baseConfig.base+"rest/cms/Shortcut/chg",//更新
				"snMoudleReset":baseConfig.base+"rest/common/cms/Shortcut/restoredefault",//重置
				"synergism":baseConfig.base+"rest/common/cms/commonService/Shortcut/query",//首页快捷方式管理 更多
				
				//OA模块 文档管理 二维码生成
				"qrCreate":baseConfig.base+"rest/fsp/qrcode/create",//给pdf图纸打上二维码
				"qrQuery":baseConfig.base+"rest/fsp/qrcode/query",//当点击重新生成二维码时，查询本接口查询已有的二维码信息

				//图文框选识别
				"queryrelatefile":baseConfig.base+"rest/fsp/queryrelatefile",//查询关联文件接口 上传后查询多张图片
				"picturearearecognition":baseConfig.base+"rest/ocr/picturearearecognition",//图片区域识别OCR接口
				"picturerecognition":baseConfig.base+"rest/ocr/picturerecognition",//全图片识别OCR接口
				"processrestart":baseConfig.base+"api/process/processrestart.json",//回退至拟办
				
				"memberslist":baseConfig.base+"rest/common/pm/commonService/ProjectOrgmember/query", //项目成员
                "membersadd":baseConfig.base+"rest/common/pm/commonService/ProjectOrgmember/create", //项目成员 添加
                "membersedit":baseConfig.base+"rest/common/pm/commonService/ProjectOrgmember/updateById", //项目成员 修改
                "membersdelete":baseConfig.base+"rest/common/pm/commonService/ProjectOrgmember/deleteById", //项目成员删除
                "membersview":baseConfig.base+"rest/common/pm/commonService/ProjectOrgmember/queryById", //项目成员  
                "membersbatchedit":baseConfig.base+"rest/common/pm/commonService/ProjectOrgmember/updateByIds",//编辑
                "membersdeletebatch":baseConfig.base+"rest/common/pm/commonService/ProjectOrgmember/deleteByIds",//批量删除
                
                //内容管理
				"linklist":baseConfig.base+"rest/common/cms/commonService/Friendlink/query",//链接列表
				"linkdetail":baseConfig.base+"rest/common/cms/commonService/Friendlink/queryById",//链接详情
				"linkdelete":baseConfig.base+"rest/common/cms/commonService/Friendlink/deleteById",//删除
				"linkdeletebatch":baseConfig.base+"rest/common/cms/commonService/Friendlink/deleteByIds",//删除
				"linkadd":baseConfig.base+"rest/cms/friendlink/createfriendlink",//新增
				"linkedit":baseConfig.base+"rest/common/cms/commonService/Friendlink/updateSelectiveById",//编缉
				
				"shortcutlist":baseConfig.base+"rest/common/cms/commonService/Shortcut/query",//快捷方式列表
				"shortcutview":baseConfig.base+"rest/common/cms/commonService/Shortcut/queryById",//链接详情
				"shortcutdelete":baseConfig.base+"rest/common/cms/commonService/Shortcut/deleteById",//删除
				"shortcutdeletebatch":baseConfig.base+"rest/common/cms/commonService/Shortcut/deleteByIds",//删除
				"shortcutadd":baseConfig.base+"rest/cms/shortcut/createshortcut",//新增
				"shortcutedit":baseConfig.base+"rest/common/cms/commonService/Shortcut/updateById",//编缉
				
				"newslist":baseConfig.base+"rest/common/cms/commonService/News/query",//新闻列表
				"newsview":baseConfig.base+"rest/common/cms/commonService/News/queryById",//新闻详情
				"newsdelete":baseConfig.base+"rest/common/cms/commonService/News/deleteById",//删除
				"newsdeletebatch":baseConfig.base+"rest/common/cms/commonService/News/deleteByIds",//删除
				"newsadd":baseConfig.base+"rest/cms/news/createnews",//新增
				"newsedit":baseConfig.base+"rest/common/cms/commonService/News/updateSelectiveById",//编缉
				"batchpublish":baseConfig.base+"rest/cms/news/publish",//发布
				"topshow":baseConfig.base+"rest/cms/news/newstopshow",//置顶
				
				"noticelist":baseConfig.base+"rest/common/cms/commonService/Notify/query",//通知列表
				"noticeview":baseConfig.base+"rest/common/cms/commonService/Notify/queryById",//通知详情
				"noticedelete":baseConfig.base+"rest/common/cms/commonService/Notify/deleteById",//删除
				"noticedeletebatch":baseConfig.base+"rest/common/cms/commonService/Notify/deleteByIds",//删除
				"noticeadd":baseConfig.base+"rest/cms/notify/createnotify",//新增
				"noticeedit":baseConfig.base+"rest/cms/notify/editnotify",//编缉
				"noticebatchpublish":baseConfig.base+"rest/cms/notify/publish",//发布
				"noticeTop":baseConfig.base+"rest/cms/notify/notifytopshow",//通知公告置顶接口
				
				"birthdayMessage":baseConfig.base+"rest/cms/notify/happybirthday",//生日祝福语
				
				"unreadmaillist":baseConfig.base+"api/content/unreadmaillist.json",//未读邮件列表
				"unreadmaildetail":baseConfig.base+"api/content/unreadmaildetail.json",//未读邮件详情
				"notificationlist":baseConfig.base+"api/content/notificationlist.json",//通知列表
				"birthdaylist":baseConfig.base+"rest/common/cms/commonService/Birthday/query",//生日祝福列表更多
				
				"meetinfolist":baseConfig.base+"rest/common/oa/commonService/Meeting/query",//会议公告列表
				"meetinfoview":baseConfig.base+"rest/common/oa/commonService/Meeting/queryById",//会议公告详情
				"meetinfodelete":baseConfig.base+"rest/common/oa/commonService/Meeting/deleteById",//删除
				"meetinfodeletebatch":baseConfig.base+"rest/common/oa/commonService/Meeting/deleteByIds",//删除
				"meetinfoadd":baseConfig.base+"rest/common/oa/commonService/Meeting/create",//新增
				"meetinfoedit":baseConfig.base+"rest/common/oa/commonService/Meeting/updateSelectiveById",//编缉
				"meetinfobatchpublish":baseConfig.base+"rest/oa/meeting/publish",//发布
				
				"portalview":baseConfig.base+"rest/common/cms/commonService/Column/queryById",//首页门户模块详情
				"portaldelete":baseConfig.base+"rest/common/cms/commonService/Column/deleteById",//删除
				"portaldeletebatch":baseConfig.base+"rest/common/cms/commonService/Column/deleteByIds",//删除
				"portaladd":baseConfig.base+"rest/common/cms/commonService/Column/create",//新增
				"portaledit":baseConfig.base+"rest/common/cms/commonService/Column/updateSelectiveById",//编缉
				"portalcontentsearch":baseConfig.base+"rest/common/cms/commonService/Column/query",
				
				//工作报告
				"reportitemTime":baseConfig.base+"rest/oa/timeaxisquery",//时间轴
				"reportitemAdd":baseConfig.base+"rest/common/oa/commonService/Workreport/create",//新增
				//"reportitemQuery":baseConfig.base+"rest/common/oa/commonService/Workreport/queryById",//查询
				"reportitemQuery":baseConfig.base+"rest/oa/workreport/query",//工作报告查询
				"reportitemEdit":baseConfig.base+"rest/common/oa/commonService/Workreport/updateSelectiveById",//修改
				"reportitemDelete":baseConfig.base+"rest/common/oa/commonService/Workreport/deleteById",//删除
        },
        template: {
            "header": "template/common/header.html",
            "login": "template/page/login/login.html",
            "dashboards": "template/page/dashboards/dashboards.html",
            "process": "template/page/process/process.html",
            "processList": "template/page/process/list.html",
            "processAdd": "template/page/process/add.html",
            "processForms": "template/page/process/forms.html",
            "wfsindex": "template/page/wfsform/index.html",//表单管理
            'deputeindex':"template/page/depute/deputeindex.html",//委托授权管理
            "processInfo": "template/page/process/form/demo.html",
            "error": "template/page/error/error.html",
            "demoTemplate": "template/page/demo/demo.html",

            "userList": "template/page/member/user-list.html",
            "userInfo": "template/page/member/userinfo.html",
            "organi": "template/page/member/organi.html",
            "selectMember": "template/page/member/selectMember.html",
            "receiveform": "template/page/process/form/receiveProcess.html",
            "sendProcess": "template/page/process/form/sendProcess.html",
            "personProcess":"template/page/process/form/personProcess.html",
            'yswprint':"template/page/process/form/printTask.html",
            /*aside*/
//            "processAside": "template/common/aside/process.html",
            "profileAside": "template/common/aside/profile_aside.html",//个人设置左右菜单
            
            "avatar": "template/page/profile/avatar.html",//头像设置
            "password": "template/page/profile/update_password.html",//密码修改
            "pwdupdate": "template/page/profile/password.html",//密码修改
            "profile": "template/page/profile/profile.html",//myProfile
            	
            "myProfile": "template/page/member/userinfo.html",//我的资料
            "feedAside": "template/common/aside/feed.html",
            "feed": "template/page/feed/feed.html",
            "feedItem": "template/page/feed/feed_unread.html",
            "feedList": "template/page/feed/remind.html",//提醒
            "unreadItem": "template/page/feed/unread_item.html",//未读事项
            "myWatched":"template/page/process/watched.html",
            "orgs_select":"template/page/member/orgs-select.html",
            "buttons":"template/page/process/form/buttons.html",
            "search":"template/page/search/search.html", //全局搜索
            "searchAside":"template/common/aside/search.html", //全局搜索菜单
            "formUpload":"template/page/porcess/form/uploadProcess.html",//部署流程
        	
        	"webindex":"template/page/webindex/webindex2.html",
        	"bigevents":"template/page/webindex/bigevents.html",
        	"newsmore":"template/page/webindex/company_news_more.html",//公司更多
        	"newslist":"template/page/webindex/company_news_list.html",//公司新闻列表
        	"newsdetail":"template/page/webindex/newsdetail.html",//公司新闻详情
        	"moreSidenav":"template/page/webindex/moreSidenav.html",//左侧导航 快捷方式更多
        	
        	"noticemore":"template/page/webindex/noticemore.html",//公告列表
        	"noticedetail":"template/page/webindex/noticedetail.html",//公告列表
        	
        	"meetingmore":"template/page/webindex/meetingmore.html",//会议列表
        	"meetingdetail":"template/page/webindex/meetingdetail.html",//会议列表

        	"eventdetail":"template/page/webindex/eventdetail.html",
        	"projindex":"template/page/projindex/projindex.html",
        	"projdetail":"template/page/projindex/projdetail.html",
        	"deptindex":"template/page/deptindex/deptindex.html",
        	"reportindex":"template/page/reportindex/reportindex.html",
        	"myproject":"template/page/project/projlist.html",//导航的项目
        	
        	"dashMoudleQuery":"template/page/profile/dashboardsSet.html",//个人首页设置
        	
    		//首页更多
    		"unreadmail_more":"template/page/webindex/unreadmail_more.html",//未读邮件
    		"unreadmail_detail":"template/page/webindex/unreadmail_detail.html",//未读邮件详情
        	"birthdaymore":"template/page/webindex/birthday_more.html"//更多生日祝福
        },
        render: {
            common: {
                "header": function (options) {
                    $.when($.ajax(mdboss.template["header"])).done(function (source) {
                        var template = Handlebars.compile(source);
                        var html = template({});
                        $(html).appendTo($('body'));
                    });
                }
            },
            page: {
                "login": function (usercode) {

                },
                "dashboards": function () {

                }
            }

        },

        openPage: function (callback, id) {
            var callbackFn = typeof callback == "function" ? callback : function () { };
            var self = this;
            if (id != "login") {
                this.cache["data"].hash = window.location.hash == "" || window.location.hash.match("#login") ? "#index" : window.location.hash;
            }
            var pageId;
            if (id === undefined) {
                var idReg = /(#(.+?)\/)|(#(.+))/;
                pageId = idReg.exec(window.location.hash)[2] ? idReg.exec(window.location.hash)[2] : idReg.exec(window.location.hash)[4];
            } else {
                pageId = id;
            }
            mdboss.pageId = pageId;
            mdboss.$body.removeClass(mdboss.$body.data("pageId")).addClass("page-" + pageId).data("pageId", "page-" + pageId);

            if (this.isRedirect) {
                callback(true);
                this.isRedirect = false;
                return;
            }

            var userCode = mdboss.usercode;
            if (!mdboss.cache["data"].pageError) {
                if (userCode) {
//                	 var commonModel=new mdboss.Model.commonModel();
                	 //commonModel.save({"usercode":mdboss.usercode},{url:mdboss.api["getLoginState"],success:function(m, response){
//                	 }});
                	 $.getJSON(mdboss.api["getLoginState"]+"?usercode="+mdboss.usercode, function (response) {
                        if (response.rc == 1 && response.data.loginstate == 1) {
                            if (window.location.hash != "" && !window.location.hash.match("#login")) {
                                self.isRedirect = false;
                                callbackFn(!self.isRedirect);
                            } else {
                                self.isRedirect = true;
                                callbackFn(!self.isRedirect);
                                mdboss.Router.navigate(mdboss.cache["data"].hash, {
                                    trigger: true
                                });
                            }
                        } else {
                            if (window.location.hash.match('login/' + mdboss.workno)) {
                                self.isRedirect = false;
                                callbackFn(!self.isRedirect);
                            } else {
                                self.isRedirect = true;
                                callbackFn(!self.isRedirect);
                                mdboss.Router.navigate('login/' + mdboss.workno, {
                                    trigger: true
                                });
                            }
                        }
                	 });
                } else {
                    if (window.location.hash.match("login")) {
                        this.isRedirect = false;
                        callbackFn(!this.isRedirect);

                    } else {
                        this.isRedirect = true;
                        callbackFn(!this.isRedirect);
                        mdboss.Router.navigate("login", {
                            trigger: true
                        });
                    }
                }
            } else {
                this.isRedirect = false;
                callbackFn(!this.isRedirect);
            }

        },
        getReadyCommon: {
            data: [
                 {"name": "getMyInfo", "post": function () {return {usercode: mdboss.usercode};},"cache":true},
                {"name": "getModules", "post": function () {return {usercode: mdboss.usercode};},"cache":true},
                {"name": "getUserInfo", "post": function () {return {usercode: mdboss.usercode};},"cache":true}
            ],
            template: ["header"]
        },
        getReady: function (getList, callback) {
            //list  {"data":[{name:"",post:{},cache:""}],"template":[]}
            //userInfo      用户信息
            //modules     模块数据
            var support = ["data", "template"];
            var needData = {};
            var loadList = {};
            var loadNum = 0;
            var length = 0;
            var error = false;
            var errorMsg = "";
            var tempList = [];
            var postDataMap = {};
            var cacheMap = {};

            $.each(support, function (i, n) {
                loadList[n] = [];

                if (getList[n] && getList[n].length) {
                    if (!getList[n][0]) {
                    	mdboss.notifyTips("getReady参数有错");
                        return;
                    }
//                    Array.prototype.push.apply(getList[n], mdboss.getReadyCommon[n]);
                } else {
//                    getList[n] = mdboss.getReadyCommon[n];
                }

                //处理data 分成数组和map对象
                $.each(getList[n], function (i, n) {
                    if (util.getType(n) == "object") {
                        tempList.push(n.name);
                        postDataMap[n.name] = n.post;
                        if(n.cache==undefined){
                        	n.cache=false;
                        }
                        cacheMap[n.name] = n.cache;
                    } else {
                        tempList.push(n);
                    }
                });

                getList[n] = util.unique(tempList);
                tempList = [];
                $.each(getList[n], function (j, m) {
                    if (cacheMap[m] === false || !mdboss.cache[n][m]) {
                        loadList[n].push(m);
                    }
                });
                length += loadList[n].length;
            });

            if (length) {
                $.each(support, function (i, n) {

                    if (error) {
                    	mdboss.error(errorMsg);
                        return false;
                    }

                    if (n == "data") {
                        $.each(loadList[n], function (j, m) {
                            var keyName = m;
                            if (!mdboss.api[keyName]) {
                            	mdboss.notifyTips('无法加载"' + n + '[' + keyName + ']"数据');
                                return;
                            }

                            var postData = postDataMap[keyName] ? postDataMap[keyName] : {usercode: mdboss.usercode};
                            if (util.getType(postData) == "function") {
                                postData = postData();
                            }
                            var commonModel=new mdboss.Model.commonModel();
                            commonModel.save(postData,{url:mdboss.api[keyName],success:function(model,data){
                            	loadNum += 1;
                                if (data.rc == 1) {
                                    mdboss.cache[n][keyName] = data.data;
                                } else {
                                	mdboss.alert(keyName + " 数据加载出错," + data.msg);
                                	mdboss.cache[n][keyName] = eval('({"rows":[]})');
//                                    if (!error) {
//                                        error = true;
//                                        errorMsg = data.msg;
//                                        if (typeof callbackFn == "function")
//                                            callback(false, errorMsg);
//                                    }
                                }
                                if (loadNum == length && typeof callback == "function")
                                    callback(mdboss.cache);
                            },error:function(){
                            	 mdboss.cache[n][keyName] = eval('({"rows":[]})');
                                 mdboss.alert(keyName + "数据加载出错");
                                 loadNum += 1;
                                 if (loadNum == length && typeof callback == "function")
                              	  callback(mdboss.cache);
                            }});
                        });

                    } else if (n == "template") {

                        $.each(loadList[n], function (j, m) {
                            var keyName = m;
                            if (!mdboss.template[keyName]) {
                            	mdboss.notifyTips('无法加载"' + n + '[' + keyName + ']"模版');
                                return;
                            }
                            $.ajax({
                                url: mdboss.template[keyName]+"?_="+nowTime,
                                success: function (html) {
                                    loadNum += 1;
                                    mdboss.cache[n][keyName] = html;
                                    if (loadNum == length && typeof callback == "function")
                                        callback(mdboss.cache);
                                },
                                error: function () {
                                    error = true;
                                    errorMsg = "数据加载出错";
                                    if (typeof callback == "function")
                                        callback(false, errorMsg);
                                }
                            });
                        });
                    }
                });
            } else {
                callback(mdboss.cache);
            }

        },
        setScroll: function () {
        	this.$pageWrap.find(".jscroll").jScrollPane({"autoReinitialise": true});
        },
        fillPageHeader: function () {// 加载页面头
        	var _this = this;
        	if(_this.$pageHeader.html() ==""){
        		mdboss.getReady( mdboss.getReadyCommon, function(result) {
        			 var templateHeader = Handlebars.compile(require("text!template/common/header_.html"));
    				 var htmlHeader = templateHeader({
    			            pageid: mdboss.pageId,
    			            modulelist: mdboss.cache["data"]["getModules"]["rows"],
    			            userinfo: mdboss.cache["data"]["getMyInfo"],
    			            baseUrl:baseConfig.base,
    			            myfollower: mdboss.cache["data"]["getUserInfo"]["myfollowers"],
    			            mysubordinate: mdboss.cache["data"]["getUserInfo"]["mysubordinates"]
    			        });
    				 _this.$pageHeader.html(htmlHeader);
    				 _this.checkNavmoreShow();
        		});
			}//end if 
        },
        fillWrap: function (html) {//
        	var _this = this;
        	_this.$pageMain.html(html);
        	_this.fillPageHeader();
        },
        fillPage: function (html) {//
            var _this = this;
             _this.fillPageHeader();
             $("#rightMainContainer").html(html);
            _this.setScroll();
        },
        logout: function () {
        	var commonModel=new mdboss.Model.commonModel();
	   		commonModel.save({},
             {  url: mdboss.api.logout, success: function (m,data) {
                    if (data.rc == "1") {
                    	$.cookie("usercode", "");
                    	$.cookie("workno", "");
                    	mdboss.usercode="";
                    	mdboss.workno="";
                    	mdboss.cache.data={};
                    	mdboss.Router.navigate('login', {
							 trigger: true
						 });
                    }else{
                    	mdboss.error(mdboss.msg);
                    }
                },error:function(){
                	mdboss.error();
                }
            });
        },

        init: function () {
            mdboss.Router.start();
            Backbone.history.start();
        }

    };

    //公共模板Helpers
    Handlebars.registerHelper('Header', function (pageId) {
        var template = Handlebars.compile(mdboss.cache["template"]["header"]);
        var html = template({
            pageid: mdboss.pageId,
            modulelist: mdboss.cache["data"]["getModules"]["rows"],
            userinfo: mdboss.cache["data"]["getMyInfo"],
            baseUrl:baseConfig.base,
            myfollower: mdboss.cache["data"]["getUserInfo"]["myfollowers"],
            mysubordinate: mdboss.cache["data"]["getUserInfo"]["mysubordinates"]
        });
        return html;
    });

    Handlebars.registerHelper('ProcessList', function (type, data) {
        var template = Handlebars.compile(mdboss.cache["template"]["processList"]);
        var html = template({"type":type, "processList":data});
        return html;
    });

//    Handlebars.registerHelper('ProcessAside', function (data) {
//        var template = Handlebars.compile(mdboss.cache["template"]["processAside"]);
//        var html = template({type: data});
//        return html;
//    });
    
    Handlebars.registerHelper('SearchAside', function (data, keyword) {
    	var template = Handlebars.compile(mdboss.cache["template"]["searchAside"]);
    	var html = template({"type": data, "keyword":keyword});
    	return html;
    });
    
    //个人设置左侧菜单 wuzy
    Handlebars.registerHelper('ProfileAside', function (data) {
    	var template = Handlebars.compile(mdboss.cache["template"]["profileAside"]);
    	var html = template({type: data});
    	return html;
    });//end
    //提醒
     Handlebars.registerHelper('feedList', function (data) {
        var template = Handlebars.compile(mdboss.cache["template"]["feedList"]);
        var html = template(data);
        return html;
    	 return "";
    });  
     //未读事项 
     Handlebars.registerHelper('UnreadItem', function (data) {
    	 var template = Handlebars.compile(mdboss.cache["template"]["unreadItem"]);
    	 var html = template(data);
    	 return html;
     });  
    Handlebars.registerHelper('feedAside', function (data) {
        var template = Handlebars.compile(mdboss.cache["template"]["feedAside"]);
        var html = template({type: data});
        return html;
    });
    
    //人力模块左则菜单
//    Handlebars.registerHelper('attendanceAside', function (data) {
//    	var template = Handlebars.compile(mdboss.cache["template"]["attendanceAside"]);
//    	var html = template({type: data});
//    	return html;
//    });
    
     Handlebars.registerHelper('personProcess', function (data) {
        var template = Handlebars.compile(mdboss.cache["template"]["processInfo"]);
        var html = template(data);
        return html;
    });
     //@delete
     Handlebars.registerHelper('ProcessWatchedList', function (type, data) {
     	var template = Handlebars.compile(mdboss.cache["template"]["myWatched"]);
     	var html = template({"type":type,"processList":data});
     	return html;
     });

   //将对象转为字符串
     Handlebars.registerHelper('json2Str', function (data) {
    	 if(data){
    		 return JSON.stringify(data);
    	 }else{
    		 return "";
    	 }
     });
    //扩展Helpers
    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });
    //扩展Helpers
    Handlebars.registerHelper('dateformat', function (v1) {
    	if(v1){ 
	    	 v1=v1.toString();
		     v1 =  v1.replace(/-/g,"/");
		     var date = new Date(v1);
		     return $.fullCalendar.formatDate(date, "MM/dd HH:mm");
    	}else{
    		return "";
    	}
    });
    //持续时间
    Handlebars.registerHelper('timeformat', function (v1) {
    	if(v1){
    		v1=v1.toString();
    		if(v1.toLowerCase().indexOf("d")>0){
    			return v1;
    		}else{
    			var dut = parseInt(parseInt(v1)/(1000*3600*24));
    			return dut+"D";
    		}
    	}else{
    		return "";
    	}
  });
  //扩展Helpers
    Handlebars.registerHelper('dateformat', function (v1, format) {
    	if(v1){
	    	v1=v1.toString();
	    	v1 =  v1.replace(/-/g,"/");
	    	var date = new Date(v1);
	    	return $.fullCalendar.formatDate(date, format);
    	}else{
    		return "";
    	}
    });
    //扩展Helpers
    Handlebars.registerHelper('periodLimit', function (v1, v2) {
//    	console.log(v1 +"==" + v2);
    	if(v1 && v2){
    		var temp = v1.split(":");
    		var tmp = v2.split(":");
    		var left = parseFloat(parseInt(temp[0])-8 ) * 9;
    		if(temp[1] == "30"){
    			left += 4.5;
    		}
    		left += 10;
    		var width = parseFloat( parseInt(tmp[0]) - parseInt(temp[0]) ) * 9;
    		if(tmp[1] =="30" && temp[1] != tmp[1]){
    			width += 4.5;
    		}
    		if(tmp[1] =="00" && temp[1] != tmp[1]){
    			width -= 4.5;
    		}
//    		console.log(left +"=="+width);
    		return "width: "+width+"%;margin-left: "+left+"%;";
    	}else{
    		return "width: 0px;";
    	}
    });
    Handlebars.registerHelper("recordHandler", function (items,index) {
        var html=new Array();
        for(var i=0;i<items.length;i++){
        		html.push('<div class="control-group control_export col-4">');
        		html.push('<div class="controls" style="margin-left:0px;"><input type="checkbox" name="fields'+index+'" value="'+items[i].name+'"/>'+items[i].title+'</div>');
        		html.push('</div>');
        }
        return html.join('');
    	
    });
    //通用单选
    Handlebars.registerHelper("radio_selected", function (clzz) {
    	if(clzz=="labelauty-checked"){
    		return "labelauty-checked";
    	}else if(clzz=="labelauty2-checked"){
    		return "labelauty2-checked";
    	}else if(clzz=="labelauty3-checked"){
    		return "labelauty3-checked";
    	}else if(clzz=="labelauty4-checked"){
    		return "labelauty4-checked";
    	}
    });
    Handlebars.registerHelper("memo_add", function (items,options) {
    	var is_add=false;
    	for(var i=0;i<items.length;i++){
    		if(items[i].code.editable){
    			is_add=true;
    		}
        }
    	 return is_add==true?options.fn(this):options.inverse(this);
    });
    
    Handlebars.registerHelper("addOneMore", function (index, count) {
    	if(count){
    		return index + 1 + count;
    	}
        return index + 1;
    });
    
    Handlebars.registerHelper("addOne", function (index) {
        return index + 1;
    });

    Handlebars.registerHelper("urgency_selected", function (name) {
    	if(name=="紧急"){
    		return "labelauty-checked";
    	}else if(name=="急"){
    		return "labelauty2-checked";
    	}else if(name=="一般"){
    		return "labelauty3-checked";
    	}
    });
    //通用通过表达式计算合计，转换格式
    Handlebars.registerHelper("calculate_common", function (record,exp,options) {
    	var fm=util.setAccounting(accounting,options);//设置金额格式化
    	var val=util.calculate(record,exp);
    	return fm.formatMoney(val);
    });
    //金额格式化options若无特殊格式设置可不传
    Handlebars.registerHelper("formatMoney", function (val,options) {
    	var fm=util.setAccounting(accounting,options);//设置金额格式化
    	return fm.formatMoney(val);
    });
    //输出html
    Handlebars.registerHelper("outputhtml", function (val,options) {
    	return val;
    });
    Handlebars.registerHelper("mod2", function (index,options) {
        return  index%2==0?options.inverse(this):options.fn(this);
    });
    //检测表单附件
    Handlebars.registerHelper("checkfileperm", function (vals,param,options) {
    	var hasperm=false;
    	$(vals).each(function(i,v){
    		if(v==param){
    			hasperm=true;
    		}
    	});
    	return hasperm==true?options.fn(this):options.inverse(this);
    });
    Handlebars.registerHelper("secret_selected", function (name) {
    	if(name=="商密"){
    		return "labelauty-checked";
    	}else if(name=="普通"){
    		return "labelauty2-checked";
    	}
    });
    Handlebars.registerHelper("substr", function (name,length) {
    	if(name.length<length){
    		return name;
    	}else{
    		return name.substr(0,length)+"...";
    	}
    });
    //mdboss.Router.navigate('login/1000', {
    //    trigger: true
    //});

    var global = require("global");
    var processInfo=require("processInfo");
   // var processMeno=require("meno");
    var dynamicaddevents=require("dynamicaddevents");
    dynamicaddevents(mdboss);//动态表单通用事件
    global(mdboss);
    processInfo(mdboss);
   // processMeno(mdboss);
    return mdboss;

});