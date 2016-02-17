/**
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
                        "deptdetail/dept":"deptdetail",//动态详情
                        "projindex":"projindex",
                        "projdetail/:proj":"projdetail",
                        "reportindex":"reportindex",
                        "project":"project",//导航的项目
                        "project/:module":"project",//导航的项目
                        "system":"system",//系统管理
                        "system/:module":"system",//系统管理
//                        "m:/report/:workreport":"report",//报告
                         
                        /*************通用配置**********************/
                        "m/:modulecode":"msystem",//全局配置
                        "m/:modulecode/:type1":"msystem",//全局配置
                        "m/:modulecode/:type1/:type2":"msystem",//全局配置
                        "m/:modulecode/:type1/:type2/:param":"msystem",//全局配置
                        /*************通用配置**********************/
                        "*pageid": "defaultPage",
                    },
                    report:function(module){
                     	 mdboss.openPage(function (open) {
                              if (open) {
                                  seajs.use("report", function (project) {
                                	  report("report",module);
                                  });
                              }

                          });
                     },
                    msystem:function(modulecode, type1, type2, param){//全局通用配置 modulecode一级模块 type1二级  type2三级/参数 
                   	 	mdboss.openPage(function (open) {
                            if (open) {
                                seajs.use(modulecode, function (infuc) {
                                	infuc(modulecode, type1, type2, param);
                                });
                            }
                        });
                   }, 
                    system:function(module){
                    	 mdboss.openPage(function (open) {
                             if (open) {
                                 seajs.use("system", function (system) {
                                	  system("system", module);
                                 });
                             }

                         });
                    },
                    project:function(module){
                     	 mdboss.openPage(function (open) {
                              if (open) {
                                  seajs.use("project", function (project) {
                                	  project("project",module);
                                  });
                              }

                          });
                     },
                    deptdetail:function(dept){
                      	 mdboss.openPage(function (open) {
                               if (open) {
                                   seajs.use("deptdetail", function (deptdetail) {
                                	   deptdetail({"dept":dept});
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
                	   console.log("newsdetail");
                  	 mdboss.openPage(function (open) {
                           if (open) {
                               seajs.use("newsdetail", function (newsdetail) {
                              	 newsdetail({"sort":sort,"newsid":id});
                               });
                           }

                       });
                    },
                    newsmore:function(newstype){
                    	 console.log("newsmore");
                    	 mdboss.openPage(function (open) {
                             if (open) {
                                 seajs.use("newsmore", function (newsmore) {
                               	  newsmore({"newstype":newstype});
                                 });
                             }

                         });
                    },
                    newslist:function(){
                    	 console.log("newslist");
                      	 mdboss.openPage(function (open) {
                               if (open) {
                                   seajs.use("newslist", function (newslist) {
                                	   newslist();
                                   });
                               }

                           });
                      },
                      noticemore:function(){
                        	 console.log("noticemore");
                        	 mdboss.openPage(function (open) {
                                 if (open) {
                                     seajs.use("noticemore", function (noticemore) {
                                     	noticemore();
                                     });
                                 }

                             });
                        },
                      noticedetail:function(id){
                   	   console.log("noticedetail");
                     	 mdboss.openPage(function (open) {
                              if (open) {
                                  seajs.use("noticedetail", function (noticedetail) {
                                	  noticedetail({"noticeid":id});
                                  });
                              }

                          });
                       },
                       meetingmore:function(){
                       	 console.log("meetingmore");
                       	 mdboss.openPage(function (open) {
                                if (open) {
                                    seajs.use("meetingmore", function (meetingmore) {
                                    	meetingmore();
                                    });
                                }

                            });
                       },
                       meetingdetail:function(id){
                     	 console.log("meetingdetail");
                       	 mdboss.openPage(function (open) {
                                if (open) {
                                    seajs.use("meetingdetail", function (meetingdetail) {
                                  	  meetingdetail({"newsid":id});
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
                            	 $("#rightMainContainer").html(require("text!../template/common/loading.html?_"+nowTime));
                                 seajs.use("search", function (sch) {
                                	 sch(type, keyword);
                                 });
                             }
                         });
                    },
                    diagram:function(processinstcode){
                    	if (open) {
                    		$("#rightMainContainer").html(require("text!../template/common/loading.html?_"+nowTime));
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
                    			$("#rightMainContainer").html(require("text!../template/common/loading.html?_"+nowTime));
                    			seajs.use("attend",function(attendance){
                    				attendance(type,"attend");
                    			});

                    		}
                    	});
                    },
                    login: function (usercode) {
                        mdboss.openPage(function (open) {
                            if (open)
                            	$("#rightMainContainer").html(require("text!../template/common/loading.html?_"+nowTime));
                                seajs.use("login", function (login) {
                                    new mdboss.View.loginPage({templateData: {usercode: usercode}});
                                });
                        }, "login");

                    },
                    dashboards: function () {
                        mdboss.openPage(function (open) {
                            if (open) {
                            	$("#rightMainContainer").html(require("text!../template/common/loading.html?_"+nowTime));
                                seajs.use("dashboards", function (dashboards) {
                                    dashboards();
                                });
                            }

                        });
                    },
                    process: function (type,usercode) {
                        mdboss.openPage(function (open) {
                            if (open) {
                            	$("#rightMainContainer").html(require("text!template/common/loading.html?_"+nowTime));
                                seajs.use("process", function (process) {
                                    process(type, usercode,"process");
                                });
                            }

                        });
                    },
                    member: function () {
                        mdboss.openPage(function (open) {
                            if (open) {
                            	$("#rightMainContainer").html(require("text!../template/common/loading.html?_"+nowTime));
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
                    			$("#rightMainContainer").html(require("text!../template/common/loading.html?_"+nowTime));
                    			seajs.use("profile", function (profile) {
                    				profile(type);
                    			});
                    		}
                    	});
                    },//end wuzy
                    
                    feed:function(type){
                    	mdboss.openPage(function (open) {
                            if (open) {
                            	$("#rightMainContainer").html(require("text!../template/common/loading.html?_"+nowTime));
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
        	/*login*/
            "login": baseConfig.base+"api/login/login.json",
            "logout": baseConfig.base+"api/login/logout.json",
            "getLoginState": baseConfig.base+"api/login/getLoginState.json",
            "getValidateCode": baseConfig.base+"api/login/getValidateCode.json",
            "chgpwd": baseConfig.base+"api/process/remind.json",//修改密码
            "resetpwd": baseConfig.base+"api/process/remind.json",//修改密码

            /*header*/
            "getModules": "api/common/getModules.json",
            "getMyInfo": "api/user/getMyInfo.json",
            "getMyFollower": "api/user/getMyFollower.json",
            "getMySubordinate": "api/user/getMySubordinate.json",
            "queryMySubordinate": "api/user/querymysubordinate.json",
            "getUserInfo": "api/user/getUserInfo.json",

            /*公文页*/
//            "queryBiaolist": "api/process/queryProcesseDef.json",//表单列表
//            "queryProcesseDef": "api/process/queryProcesseDef.json",//公文实例列表
            "queryProcesstype":"api/process/queryProcesstype.json",
            "queryTaskTodo": "api/process/queryTaskTodo.json",//全部待办
            "queryMyTaskTodo": "api/process/queryMyTaskTodo.json",//我的待办
            "querySuborditnatesTaskTodo": "api/process/querySuborditnatesTaskTodo.json",//我的下属待办
            "queryProcessInstanceThroughed": "api/process/queryProcessInstanceThroughed.json",//我的经办
            "queryProcessInstanceComplete": "api/process/queryProcessinstanceComplete.json",//我的已办
            "queryProcessinstancesWatched": "api/process/queryProcessinstancesWatched.json",//我关注的公文
            "queryProcessinstanceSharedtome": "api/process/queryProcessinstanceSharedtome.json",//共享给我的公文
            "deleteProcessinstanceSharedtome": "api/process/queryProcessinstanceSharedtome.json",//删除共享给我的公文
            
           
            "queryProcessinstancesDone": "api/process/queryProcessinstancesDone.json",//办结公文
            "queryProcessinstanceDraft": "api/process/queryProcessinstanceDraft.json",//草稿公文
            "queryProcessinstanceHistory": "api/process/queryProcesshistory.json",//草稿公文
            "querydoctimeline": "api/process/querydoctimeline.json",//Timeline公文办理过程查询
            "processCount": "api/process/processCount.json",//我的公文统计 ，下属待办公文
            "deptProcessCount": "api/process/deptProcessCount.json",//部门TOP5公文统计
            "deanProcessCount": "api/process/deanProcessCount.json",//院内TOP5公文统计
            "processDesc": "api/process/processdesc.json",//待办公文详情
            "queryprocesspart": "api/process/queryprocesspart.json",//公文环节处理信息查询
            "stepchg":"api/attendance/ok.json",//环节信息修改
            "stepchgEdit":"api/attendance/ok.json",//环节信息修改
            //公文筛选
            "filterStarter": "api/process/filterStarter.json",//公文筛选-申请人查询
            "filterProcesses": "api/process/filterProcesses.json",//公文筛选-公文查询
            "filterProjects": "api/process/filterProjects.json",//公文筛选-项目查询
            "filterTags": "api/process/filterTags.json",//公文筛选-标签查询
            "querySericode":"api/process/querySericode.json",//查询字号
            "processdefLoad":"api/process/processdefLoad.json",//发起公文
            "proecessdefHandle":"api/process/proecessdefHandle.json",//公文处理     
            "watchsharedone":"api/process/watchsharedone.json",//我的关注共享办结查询详情
            "processfinishsubtodo":"api/process/finishedsubtodo.json",//我的已办下属待办详情查询
            "processreaded":"api/process/readed.json",//已阅提交
            "submitTask":"api/process/submitTask.json", 
            "startTask":"api/process/submitTask.json",
            "queryZihao":"api/process/queryZihao.json",
            "sunxu":"api/process/addSunxu.json",
            "saveTask":"api/process/saveTask.json",
            "loaddraft":"api/process/draft.json",//加载草稿公文
            "startSaveTask":"api/process/saveTask.json",
            "taskWatch":"api/process/taskWatch.json",//关注 
            "cancelWatch":"api/process/taskWatch.json",//取消关注
            "taskCircularize":"api/process/taskCircularize.json",//传阅
            "withdraw":"api/process/withdraw.json",//撤回
            "taskmoveto":"api/process/withdraw.json",//timeline 中跳转
            "delete_process":"api/process/delete_process.json",//删除
            "circularize":"api/process/circularize.json",//传阅
            "processShare":"api/process/taskWatch.json",//共享公文
            "toShare":"api/process/toShare.json",//共享人员
            
            "preDiagram":"api/process/preViewDiagram.json",//流程图
            "diagram":"api/process/diagram.json",//流程图
            "activity":"api/process/activity.json",
            "personconfigload":"api/process/personconfigload.json",//获取流程环节处理信息
            "personconfig":"api/process/personconfig.json",//流程环节处理
            "activitytrack":"api/process/activitytrack.json",
            "formlist":"api/process/formlist.json",
            /*组织结构*/
            "orgs": "api/member/orgs.json",//组织结构 大
            "org": "api/member/org.json",//组织结构-下的 部门列表
            "members": "api/member/members.json",
            "userdata" : "api/member/members.json",// 选人控件
            "selectMembers": "api/member/members.json",//选人控件
            "userInfo": "api/member/userinfo.json",
            "usergroups": "api/member/usergroups.json",//用户 群组     
            "usergroupmembers": "api/member/usergroupmembers.json",//用户 群组成员 
            "role": "api/member/role.json",//用户角色
            "userrole": "api/member/userrole.json",//用户 角色成员 
            "userroleadd": "api/demo/ok.json",//用户 角色成员 
            "createusergroups":"api/login/createusergroups.json",//创建群组
            "updateUserById":"api/attendance/ok.json",//用户信息修改
            "userCard" : baseConfig.base+"api/user/usercard.json",// 用户卡片信息

            /**未读**/
            "newItems":"api/feed/newItems.json",
            "demoData": "api/demo/demo.json",
            "processStart": "api/process/processStart.json",
            "editForm":"api/process/editForm.json",//公文表單修改
            "duplicate":"api/process/editForm.json",//表单复制
            "deleteForm":"api/process/deleteForm.json",//刪除公文表單
            "createCategory":"api/process/createCategory.json",
            
            
            "remind":"api/process/remind.json",//提醒
            "yswprint":"api/process/printInfo.json",//打印
           
            "querycommonopinion":"api/process/querycommonopinion.json",//查询常用语
            "addcommonopinion":"api/process/addcommonopinion.json",//添加常用语
            "delcommonopinion":"api/process/addcommonopinion.json",//删除常用语
            "chgcommonopinion":"api/process/addcommonopinion.json",//修改常用语
            "fileupload":"upload",
            
            //2015-6-18
           "createmembergroup":"api/process/remind.json",//创建群组用户
        	"terminationProcess":"api/process/termination.json",//终止流程
        	"search":"api/common/search.json",//全局搜索
        	
        	//人力管理 2015-6-21
        	"querytravelstatistic":"api/attendance/index.json",//首页统计 
        	"allinstitutetravelcountinmonth":"api/attendance/allstatic.json",//首页全院统计 
        	"deptravelcountinmonth":"api/attendance/deptravelcountinmonth.json",//首页全院统计 
        	"myorgtraveluserinfo":"api/attendance/myorgtraveluserinfo.json",//我部出差
        	"tomyorgtraveluserinfo":"api/attendance/tomyorgtraveluserinfo.json",//到我部出差 
        	"selectcheckinoutIntoalldaysignin":"api/attendance/selectcheckinoutIntoalldaysignin.json",//签到数据同步接口
        	"showcheckinoutsynchrooperate":"api/attendance/showcheckinoutsynchrooperate.json",//是否显示签到数据同步按钮
        	
        	
            "countcheckinnum":"api/attendance/countcheckinnum.json",//统计签到次数
            "querycheckindetail":"api/attendance/querycheckindetail.json",//查看签到明细
            "counttraveldays":"api/attendance/counttraveldays.json",//统计差旅天数
            "querytravelcheckindetail":"api/attendance/querytravelcheckindetail.json",//查看差旅签到明细
            "querycheckexact":"api/attendance/querycheckexact.json",//查询补签记录
            "applycheckexact":"api/attendance/ok.json",//申请补签
            "auditcheckexact":"api/attendance/ok.json",//审批补签
            "deleteapplycheckexact":"api/attendance/ok.json",//删除补签申请记录
            "setupworkday":"api/attendance/ok.json",//工作日定义
            "queryworkday" : "api/calendar/queryworkday.json",// 工作日定义查询
            "setupworktime":"api/attendance/ok.json",//工作时间修改
            "queryrealtimecheckin" : baseConfig.base+"api/attendance/queryrealtimecheckin.json",// 实时查询签到记录
            "queryexport":"api/attendance/query_export.json",//导出时数据显示
            "exportsubmit":"api/attendance/query_export.json",//导出提交
            	
        	"deployprocdef":baseConfig.base+"api/attendance/ok.json",//流程部署
			"addProcesstype": baseConfig.base+"api/attendance/ok.json",//公文分类添加
			"delProcesstype": baseConfig.base+"api/attendance/ok.json",//删除公文分类
			
			//表单管理 2015-7-6
//			"formqueryall":baseConfig.base+"api/wfsform/wfs_forms.json",//表单查询
			"formitemchg":baseConfig.base+"api/wfsform/wfs_form_ok.json",//表单项编缉
			"duplicateitem":baseConfig.base+"api/wfsform/wfs_form_ok.json",//表单项复制
			"listoneitem":baseConfig.base+"api/wfsform/wfs_formitem.json",//表单项记录单条
			"formitemdel":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除表单 
			"formitemadd":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加表单 
			"formitemedit":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加表单 
			"formitemlist":baseConfig.base+"api/wfsform/wfs_formitems.json",//表单配置 
			"formdeltype":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除表单分类 
			
			
			/****/
			"processetree":baseConfig.base+"api/process/queryProcesseTree.json",//公文流程查询/表单查询   
			"workflowlist":baseConfig.base+"api/process/queryProcesseDef.json",//公文流程查询/表单查询   
			"workflowadd":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加 
			"workflowdetail":baseConfig.base+"api/wfsform/workflowdetail.json",//添加 
			"workflowdelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除 
			"workflowbatchdelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除 
			"workflowupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			"workflowbatchupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			
			
			"queryworkform":baseConfig.base+"api/wfsform/wfs_forms.json",//表单查询 
			"workformdetail":baseConfig.base+"api/wfsform/wfs_formsdetail.json",//表单查询 
			"workformadd":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加 
			"workformdelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除 
			"workformbatchdelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除 
			"workformupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			"workformbatchupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			
			"workformitemlist":baseConfig.base+"api/wfsform/wfs_formitems.json",//表单项查询 
			"workformitemdetail":baseConfig.base+"api/wfsform/wfs_formitemsdetail.json",//表单项查询 
			"workformitemadd":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加 
			"workformitemdelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除 
			"workformitembatchdelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除 
			"workformitemupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			"workformitembatchupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			
			"stepinfolist":baseConfig.base+"api/wfsform/stepinfo.json",//表单项查询 
			"stepinfodetail":baseConfig.base+"api/wfsform/stepinfodetail.json",//表单项查询 
			"stepinfoadd":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加 
			"stepinfodelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除 
			"stepinfobatchdelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除 
			"stepinfoupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			"stepinfobatchupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			
			"widgetsectionlist":baseConfig.base+"api/system/widgetsection.json",//组件查询 
			"widgetsectiondelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//组件查询 
			"widgetlist":baseConfig.base+"api/system/widget.json",//组件查询 
			"widgetdetail":baseConfig.base+"api/system/widgetdetail.json",// 查询 
			"widgetadd":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加 
			"widgetdelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除 
			"widgetbatchdelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除 
			"widgetupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			"widgetbatchupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			
			"feeitemlist":baseConfig.base+"api/system/feeitem.json",//费用类型查询 
			"feetypelist":baseConfig.base+"api/system/feetype.json",//费用类型查询 
			"feeitemadd":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加 
			"feeitemedit":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加 
			"feetypedetail":baseConfig.base+"api/system/feetypedetail.json",// 查询 
			"feetypeadd":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加 
			"feetypedelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除 
			"feetypebatchdelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除 
			"feetypeupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			"feetypebatchupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			/****/
			
			
			"formchg":baseConfig.base+"api/wfsform/wfs_form_ok.json",//表单编缉
			"formadd":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加表单 
			"formdel":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除表单
			"formchgstate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//停用启用表单 
			"processtypeadd":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加表单分类 
			"processtypelist":baseConfig.base+"api/wfsform/wfs_formtype.json",//表单分类列表 //
			"processtypeupdate":baseConfig.base+"api/wfsform/wfs_form_ok.json",//修改分类列表 //
			"processtypedelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除分类列表 //
			"queryworkflow":baseConfig.base+"api/process/queryProcesseDef.json",//公文流程查询
			"queryworkform":baseConfig.base+"api/wfsform/wfs_forms.json",//表单查询 
			"formchg":baseConfig.base+"api/wfsform/wfs_form_ok.json",//表单状态修改
			
			//委托管理   2015-7-30 
			"entrust":baseConfig.base+"api/entruts/list.json",//委托编缉
			"entrustdetail":baseConfig.base+"api/entruts/detail.json",//委托详情
			"deleteentrust":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除
			"batchdeleteentrust":baseConfig.base+"api/wfsform/wfs_form_ok.json",//删除
			"entrustadd":baseConfig.base+"api/wfsform/wfs_form_ok.json",//添加
			"entrustedit":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			"entrustbatchedit":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			"entrustbatchdelete":baseConfig.base+"api/wfsform/wfs_form_ok.json",//编辑
			"backdepute":baseConfig.base+"api/wfsform/wfs_form_ok.json",//回收所有权限
			
			//2015-7-13 门户接口 Potal
			"portal_showframe":baseConfig.base+"api/cms/portal_showframe.json",//框架显示接口
			"portal_showcolumn":baseConfig.base+"api/cms/portal_showcolumn.json",//门户栏目内容显示接口
			"portal_bigevents":baseConfig.base+"api/cms/portal_bigevents.json",//大事记查询接口
			"portal_bigeventdetails":baseConfig.base+"api/cms/portal_bigeventdetails.json",//大事记详情接口
			"portal_linkurl":baseConfig.base+"api/cms/portal_linkurl.json",//友情链接查询接口
			"info_query":baseConfig.base+"api/cms/info_query.json",//资讯列表查询接口
			"info_queryinfodetails":baseConfig.base+"api/cms/info_queryinfodetails.json",//资讯详情查询接口
			"demolist":baseConfig.base+"api/demo/demo.json",
			"demobatchdel":baseConfig.base+"api/demo/ok.json",
			"demodetail":baseConfig.base+"api/demo/detail.json",
			
			
			
			//系统管理 2015-7-30 
			"sysmodulelist":"api/system/module.json",//模块列表
			"moduledelete":"api/demo/ok.json",//删除
			"moduleadd":"api/demo/ok.json",//新增
			"moduleedit":"api/demo/ok.json",//编辑
			"moduledetail":"api/system/moduledetail.json",//详情
			"moduledeletebatch":"api/demo/ok.json",//批量删除
			"modulebatchedit":"api/demo/ok.json",//批量修改
			
			"syspermlist":"api/system/permission.json",//权限列表
			"permdelete":"api/demo/ok.json",//删除
			"permadd":"api/demo/ok.json",//新增
			"permedit":"api/demo/ok.json",//编辑
			"permbatchedit":"api/demo/ok.json",//编辑
			"permdetail":"api/system/permissiondetail.json",//详情
			"permdeletebatch":"api/demo/ok.json",//批量删除
			
			"sysorglist":"api/system/org.json",//组织列表
			"orgdelete":"api/demo/ok.json",//删除
			"orgadd":"api/demo/ok.json",//新增
			"orgedit":"api/demo/ok.json",//编辑
			"orgbatchedit":"api/demo/ok.json",//编辑
			"orgdetail":"api/system/orgdetail.json",//详情
			"orgdeletebatch":"api/demo/ok.json",//批量删除
			"orgbatchedit":"api/demo/ok.json",//批量删除
			
			"sysrolelist":"api/system/role.json",//角色列表
			"roledelete":"api/demo/ok.json",//删除
			"roleadd":"api/demo/ok.json",//新增
			"roleedit":"api/demo/ok.json",//编辑
			"rolebatchedit":"api/demo/ok.json",//编辑
			"roledetail":"api/system/roledetail.json",//详情
			"roledeletebatch":"api/demo/ok.json",//批量删除
			
			"sysoperatelist":"api/member/members.json",//操作用户列表
			"operatedelete":"api/demo/ok.json",//删除
			"operateadd":"api/demo/ok.json",//新增
			"operateedit":"api/demo/ok.json",//编辑
			"operatebatchedit":"api/demo/ok.json",//编辑
			"operatebatchedit":"api/demo/ok.json",//编辑
			"operatedetail":"api/member/userinfo.json",//详情
			"operatedeletebatch":"api/demo/ok.json",//批量删除
			
			//首页模块拖动
			"dashMoudleQuery":"api/setting/query.json",
			"dashMoudleUpdate":"api/setting/update.json",
			"dashMoudleReset":"api/setting/reset.json",
			
			//首页快捷方式管理
			"snMoudleQuery":"api/sidenav_setting/query.json",//查询
			"snMoudleUpdate":"api/sidenav_setting/update.json",//更新
			"snMoudleReset":"api/sidenav_setting/reset.json",//重置
			
			"sysparamlist":"api/system/param.json",//系统参数列表
			"paramdelete":"api/demo/ok.json",//删除
			"paramadd":"api/demo/ok.json",//新增
			"paramedit":"api/demo/ok.json",//编辑
			"parambatchedit":"api/demo/ok.json",//编辑
			"paramdetail":"api/system/paramdetail.json",//详情
			"paramdeletebatch":"api/demo/ok.json",//批量删除
			
			"sysdictlist":"api/system/dict.json",//数据字典列表
			"dictdelete":"api/demo/ok.json",//删除
			"sysdictadd":"api/demo/ok.json",//新增
			"dictedit":"api/demo/ok.json",//编辑
			"dictbatchedit":"api/demo/ok.json",//编辑
			"dictdetail":"api/system/dictdetail.json",//详情
			"dictdeletebatch":"api/demo/ok.json",//批量删除
			
			"sysgrouplist":"api/system/group.json",//群组列表
			"groupdelete":"api/demo/ok.json",//删除
			"sysgroupadd":"api/demo/ok.json",//新增
			"groupedit":"api/demo/ok.json",//编辑
			"groupbatchedit":"api/demo/ok.json",//编辑
			"groupdetail":"api/system/groupdetail.json",//详情
			"groupdeletebatch":"api/demo/ok.json",//批量删除
			
			"groupuserlist":"api/system/groupuserlist.json",//群组成员
			"groupuseradd":"api/demo/ok.json",//添加群组成员
			"groupuserbatchadd":"api/demo/ok.json",//添加群组成员
			"groupuserdelete":"api/demo/ok.json",//删除群组成员
			
			"sysroleplist":"api/system/rolep.json",//授权列表
			"rolepdelete":"api/demo/ok.json",//删除
			"rolepadd":"api/demo/ok.json",//新增
			"rolepedit":"api/demo/ok.json",//编辑
			"rolepbatchedit":"api/demo/ok.json",//编辑
			"rolepdetail":"api/system/rolepdetail.json",//详情
			"rolepdeletebatch":"api/demo/ok.json",//批量删除
			"roleuserlist":"api/system/roleuser.json",//查询角色用户
			"roleuserdelete":"api/demo/ok.json",//删除角色用户
			"roleuserbatchadd":"api/demo/ok.json",//删除角色用户

//			"userrolelist":baseConfig.base+"api/system/userrole.json",//用户角色
//			"userrolebatchadd":baseConfig.base+"api/demo/ok.json",//批量添加用户角色
//			"userroledelete":baseConfig.base+"api/demo/ok.json",//批量添加用户角色
			
			"rolepermedit":baseConfig.base+"api/system/roleperm.json",//授权添加
			"rolepermadd":baseConfig.base+"api/demo/ok.json",//授权 修改
			"rolepermlist":baseConfig.base+"api/system/roleperm.json",//授权列表
			"roleprocess":baseConfig.base+"api/system/processlist.json",//流程列表TODO
			
			"cachetlist":baseConfig.base+"api/system/cachet.json",//问题列表
			"cachetdelete":baseConfig.base+"api/demo/ok.json",//删除
			"cachetadd":baseConfig.base+"api/demo/ok.json",//新增
			"cachetedit":baseConfig.base+"api/demo/ok.json",//编辑
			"cachetbatchedit":baseConfig.base+"api/demo/ok.json",//编辑
			"cachetview":baseConfig.base+"api/system/cachetview.json",//详情
			"cachetdeletebatch":baseConfig.base+"api/demo/ok.json",//批量删除
			
			"redheadlist":baseConfig.base+"api/system/redhead.json",//问题列表
			"redheaddelete":baseConfig.base+"api/demo/ok.json",//删除
			"redheadadd":baseConfig.base+"api/demo/ok.json",//新增
			"redheadedit":baseConfig.base+"api/demo/ok.json",//编辑
			"redheadbatchedit":baseConfig.base+"api/demo/ok.json",//编辑
			"redheadview":baseConfig.base+"api/system/redheadview.json",//详情
			"redheaddeletebatch":baseConfig.base+"api/demo/ok.json",//批量删除
			
			
			"devicelist":baseConfig.base+"api/fund/device.json",//设备列表
			"devicedelete":baseConfig.base+"api/demo/ok.json",//删除
			"deviceadd":baseConfig.base+"api/demo/ok.json",//新增
			"deviceedit":baseConfig.base+"api/demo/ok.json",//编辑
			"devicebatchedit":baseConfig.base+"api/demo/ok.json",//编辑
			"deviceview":baseConfig.base+"api/fund/deviceview.json",//详情
			"devicedeletebatch":baseConfig.base+"api/demo/ok.json",//批量删除
			
			"assestslist":baseConfig.base+"api/fund/assests.json",//设备列表
			"assestsdelete":baseConfig.base+"api/demo/ok.json",//删除
			"assestsadd":baseConfig.base+"api/demo/ok.json",//新增
			"assestsedit":baseConfig.base+"api/demo/ok.json",//编辑
			"assestsbatchedit":baseConfig.base+"api/demo/ok.json",//编辑
			"assestsview":baseConfig.base+"api/fund/assestsview.json",//详情
			"assestsdeletebatch":baseConfig.base+"api/demo/ok.json",//批量删除
			
			"feedbacklist":baseConfig.base+"api/help/feedback.json",//问题列表
			"feedbackdelete":baseConfig.base+"api/demo/ok.json",//删除
			"feedbackadd":baseConfig.base+"api/demo/ok.json",//新增
			"feedbackedit":baseConfig.base+"api/demo/ok.json",//编辑
			"feedbackbatchedit":baseConfig.base+"api/demo/ok.json",//编辑
			"feedbackview":baseConfig.base+"api/help/feedbackview.json",//详情
			"feedbackdeletebatch":baseConfig.base+"api/demo/ok.json",//批量删除
			
			"answerlist":baseConfig.base+"api/help/answer.json",//反馈列表
			"answerdelete":baseConfig.base+"api/demo/ok.json",//删除
			"answeradd":baseConfig.base+"api/demo/ok.json",//新增
			"answeredit":baseConfig.base+"api/demo/ok.json",//编辑
			"answerbatchedit":baseConfig.base+"api/demo/ok.json",//编辑
			"answerview":baseConfig.base+"api/help/answerview.json",//详情
			"answerdeletebatch":baseConfig.base+"api/demo/ok.json",//批量删除
			

			//08-11门户首页接口(生产上由rest/cms/showframe接口返回这类接口)
			"synergism":baseConfig.base+"api/webindex/synergism.json",//授权列表
			"workflow":baseConfig.base+"api/webindex/workflow.json",//授权列表
			"friendlylink":baseConfig.base+"api/webindex/friendlylink.json",//授权列表
			"newscenter":baseConfig.base+"api/webindex/newscenter.json",//授权列表
			"todoitems":baseConfig.base+"api/webindex/todoitems.json",//授权列表
			"todoemail":baseConfig.base+"api/webindex/todoemail.json",//授权列表
			"pickerformdata":baseConfig.base+"api/process/pickerformdata.json",
			"applydetail":baseConfig.base+"api/process/applylist.json",
			
			//项目
			"projectrolelist":"api/project/role.json", //项目角色
			"projectroleadd":"api/demo/ok.json", //项目角色 添加
			"projectroleedit":"api/demo/ok.json", //项目角色 修改
			"projectroledelete":"api/demo/ok.json", //项目角色 删除
			"projectroleview":"api/project/roleview.json", //项目角色  
			"projectrolebatchedit":"api/demo/ok.json",//编辑
			"projectroledeletebatch":"api/demo/ok.json",//批量删除
			
			
			"projectprofess":"api/project/profess.json", //专业
			"projectprofessdelete":"api/demo/ok.json", //专业架构删除
			"projectprofessorgs":"api/project/professorgs.json",//专业结构树
			"projectprofessadd":"api/demo/ok.json", //专业 添加
			"projectprofessedit":"api/demo/ok.json", //专业 修改
			
			"projectarchitect":"api/project/architect.json", //项目配置
			"projectarchitectadd":"api/demo/ok.json", //项目配置 添加
			"projectarchitectdelete":"api/demo/ok.json", //项目配置 添加
			"projectarchitectedit":"api/demo/ok.json", //项目配置 修改
			"projectarchitectview":"api/project/architectview.json", //项目配置 修改
			"projectlist":"api/project/projectlist.json",//项目列表
			"professlist":"api/project/professlist.json",//专业列表
			
			"projectphaselist":"api/project/phase.json", //项目阶段
			"projectphaseadd":"api/demo/ok.json", //项目阶段 添加
			"projectphaseedit":"api/demo/ok.json", //项目阶段 修改
			"projectphasedelete":"api/demo/ok.json", //项目阶段删除
			"projectphaseview":"api/project/phaseview.json", //项目阶段  
			"projectphasebatchedit":"api/demo/ok.json",//编辑
			"projectphasedeletebatch":"api/demo/ok.json",//批量删除
			
			"projectadd":"api/demo/ok.json",//项目添加
			"projectarchitectedit":"api/project/architectedit.json",//项目添加
			
			//oa模块
			"meetinglist":baseConfig.base+"api/oa/meeting.json",//会议室预定列表
			"meetingdelete":baseConfig.base+"api/demo/ok.json",//删除
			"meetingadd":baseConfig.base+"api/demo/ok.json",//新增
			"meetingedit":baseConfig.base+"api/demo/ok.json",//编辑
			"meetingbatchedit":baseConfig.base+"api/demo/ok.json",//编辑
			"meetingview":baseConfig.base+"api/oa/meetingview.json",//详情
			"meetingdeletebatch":baseConfig.base+"api/demo/ok.json",//批量删除
			//
			"meetingroomlist":baseConfig.base+"api/oa/meetingroom.json",//会议室列表
			"meetingroomdelete":baseConfig.base+"api/demo/ok.json",//删除
			"meetingroomadd":baseConfig.base+"api/demo/ok.json",//新增
			"meetingroomedit":baseConfig.base+"api/demo/ok.json",//编辑
			"meetingroombatchedit":baseConfig.base+"api/demo/ok.json",//编辑
			"meetingroomview":baseConfig.base+"api/oa/meetingroomview.json",//详情
			"meetingroomdeletebatch":baseConfig.base+"api/demo/ok.json",//批量删除
			
			"seriallist":baseConfig.base+"api/oa/serial.json",//字号列表
			"serialdelete":baseConfig.base+"api/demo/ok.json",//删除
			"serialadd":baseConfig.base+"api/demo/ok.json",//新增
			"serialedit":baseConfig.base+"api/demo/ok.json",//编辑
			"serialbatchedit":baseConfig.base+"api/demo/ok.json",//编辑
			"serialview":baseConfig.base+"api/oa/serialview.json",//详情
			"serialdeletebatch":baseConfig.base+"api/demo/ok.json",//批量删除
			
			"tablelist":baseConfig.base+"api/system/table.json",//数据库 表
			"tabledelete":baseConfig.base+"api/demo/ok.json",//删除
			"tableadd":baseConfig.base+"api/demo/ok.json",//新增
			"tableedit":baseConfig.base+"api/demo/ok.json",//编辑
			"tableview":baseConfig.base+"api/system/tableview.json",//详情
			"tabledeletebatch":baseConfig.base+"api/demo/ok.json",//批量删除
			
			"columnlist":baseConfig.base+"api/system/column.json",//数据库 表column列表
			"columndelete":baseConfig.base+"api/demo/ok.json",//删除
			"columnadd":baseConfig.base+"api/demo/ok.json",//新增
			"columnedit":baseConfig.base+"api/demo/ok.json",//编辑
			"columnview":baseConfig.base+"api/system/columnview.json",//详情
			"columndeletebatch":baseConfig.base+"api/demo/ok.json",//批量删除
			
			//TODO 
			"qrcode":baseConfig.base+"api/demo/ok.json",//图纸二维码生成
			"blueprintlist":baseConfig.base+"api/oa/blueprint.json",//图纸二维码生成

			"folderlist":baseConfig.base+"api/document/folder.json",//文件目录结构
			"folderadd":baseConfig.base+"api/demo/ok.json",//文件目录结构
			"folderedit":baseConfig.base+"api/demo/ok.json",//文件目录结构
			"folderdelete":baseConfig.base+"api/demo/ok.json",//文件目录结构
			"folderfilelist":baseConfig.base+"api/document/file.json",//文件列表
			"folderfileedit":baseConfig.base+"api/demo/ok.json",//文件列表
			"folderfileadd":baseConfig.base+"api/demo/ok.json",//文件列表
			
			"multiselAsync":baseConfig.base+"api/process/test.json",
			
			//OA模块 文档管理 二维码生成
			"qrCreate":baseConfig.base+"api/oa/qrCreate.json",//给pdf图纸打上二维码
			"qrQuery":baseConfig.base+"api/oa/qrQuery.json",//当点击重新生成二维码时，查询本接口查询已有的二维码信息
			
			//表单流程 图文框选识别
			"queryrelatefile":baseConfig.base+"api/process/queryrelatefile.json",//查询关联文件接口 上传后查询多张图片
			"picturearearecognition":baseConfig.base+"api/process/picturearearecognition.json",//图片区域识别OCR接口
			"picturerecognition":baseConfig.base+"api/process/picturerecognition.json",//全图片识别OCR接口
			"processrestart":baseConfig.base+"api/process/processrestart.json",//回退至拟办
			
			//内容管理
			"linklist":baseConfig.base+"api/cms/portal_linkurl.json",//链接列表
			"linkdetail":baseConfig.base+"api/content/linkdetail.json",//链接详情
			"linkdelete":baseConfig.base+"api/demo/ok.json",//删除
			"linkdeletebatch":baseConfig.base+"api/demo/ok.json",//删除
			"linkadd":baseConfig.base+"api/demo/ok.json",//新增
			"linkedit":baseConfig.base+"api/demo/ok.json",//编缉
			 
			"shortcutlist":baseConfig.base+"api/content/shortcut.json",//链接列表
			"shortcutview":baseConfig.base+"api/content/shortcutdetail.json",//链接详情
			"shortcutdelete":baseConfig.base+"api/demo/ok.json",//删除
			"shortcutdeletebatch":baseConfig.base+"api/demo/ok.json",//删除
			"shortcutadd":baseConfig.base+"api/demo/ok.json",//新增
			"shortcutedit":baseConfig.base+"api/demo/ok.json",//编缉
			
			"newslist":baseConfig.base+"api/content/news.json",//新闻列表
			"newsview":baseConfig.base+"api/content/newsdetail.json",//新闻详情
			"newsdelete":baseConfig.base+"api/demo/ok.json",//删除
			"newsdeletebatch":baseConfig.base+"api/demo/ok.json",//删除
			"newsadd":baseConfig.base+"api/demo/ok.json",//新增
			"newsedit":baseConfig.base+"api/demo/ok.json",//编缉
			"batchpublish":baseConfig.base+"api/demo/ok.json",//编缉
			"topshow":baseConfig.base+"api/demo/ok.json",//置顶
			
			
			"noticelist":baseConfig.base+"api/content/notice.json",//通知列表
			"noticeview":baseConfig.base+"api/content/noticedetail.json",//通知详情
			"noticedelete":baseConfig.base+"api/demo/ok.json",//删除
			"noticedeletebatch":baseConfig.base+"api/demo/ok.json",//删除
			"noticeadd":baseConfig.base+"api/demo/ok.json",//新增
			"noticeedit":baseConfig.base+"api/demo/ok.json",//编缉
			"noticebatchpublish":baseConfig.base+"api/demo/ok.json",//编缉
			
			"unreadmaillist":baseConfig.base+"api/content/unreadmaillist.json",//未读邮件列表
			"unreadmaildetail":baseConfig.base+"api/content/unreadmaildetail.json",//未读邮件详情
			"notificationlist":baseConfig.base+"api/content/notificationlist.json",//通知列表
			"birthdaylist":baseConfig.base+"api/webindex/birthdaylist.json",//生日祝福列表更多
			
			"meetinfolist":baseConfig.base+"api/content/meetinfo.json",//会议公告列表
			"meetinfoview":baseConfig.base+"api/content/meetinfodetail.json",//会议公告详情
			"meetinfodelete":baseConfig.base+"api/demo/ok.json",//删除
			"meetinfodeletebatch":baseConfig.base+"api/demo/ok.json",//删除
			"meetinfoadd":baseConfig.base+"api/demo/ok.json",//新增
			"meetinfoedit":baseConfig.base+"api/demo/ok.json",//编缉
			"meetinfobatchpublish":baseConfig.base+"api/demo/ok.json",//编缉
			
//			"portallist":baseConfig.base+"api/cms/portal_showframe.json",//首页门户模块列表
			"portalview":baseConfig.base+"api/content/portaldetail.json",//首页门户模块详情
			"portaldelete":baseConfig.base+"api/demo/ok.json",//删除
			"portaldeletebatch":baseConfig.base+"api/demo/ok.json",//删除
			"portaladd":baseConfig.base+"api/demo/ok.json",//新增
			"portaledit":baseConfig.base+"api/demo/ok.json",//编缉
			
			//工作报告
			"reportitemTime":baseConfig.base+"api/report/timetree.json",//时间轴
			"reportitemAdd":baseConfig.base+"api/report/create.json",//新增
			"reportitemQuery":baseConfig.base+"api/report/query.json",//查询
			"reportitemEdit":baseConfig.base+"api/report/edit.json",//修改
			"reportitemDelete":baseConfig.base+"api/report/delete.json",//删除
        },
        template: {
            "header": "template/common/header.html",
            "body": "template/common/body.html",
            "login": "template/page/login/login.html",
            "dashboards": "template/page/dashboards/dashboards.html",
            "process": "template/page/process/process.html",
            "processList": "template/page/process/list.html",
            "processAdd": "template/page/process/add.html",
            "processForms": "template/page/process/forms.html",
            "entrust_main":"template/page/process/entrust/main.html",
            "entrust":"template/page/process/entruts/entrust.html",
            "entrust_list":"template/page/process/entruts/entrust_list.html",
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
        	"deptdetail":"template/page/deptindex/deptdetail.html",
        	"reportindex":"template/page/reportindex/reportindex.html",
    		"projectlist":"template/page/project/projlist.html",//导航的项目
    		"dashMoudleQuery":"template/page/profile/dashboardsSet.html",//个人首页设置
    		
    		//首页更多
    		"unreadmail_more":"template/page/webindex/unreadmail_more.html",//未读邮件
    		"unreadmail_detail":"template/page/webindex/unreadmail_detail.html",//未读邮件详情
    		"birthdaymore":"template/page/webindex/birthday_more.html"//更多生日祝福
    		//流程 2015-8-22
//    		"assessmentProcess":"template/page/process/form/assessmentform.html",//试用考核
//    		"performanceProcess":"template/page/process/form/performanceform.html",//度职工综合绩效评价
    		
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
                                mdboss.Router.navigate('login/' +  mdboss.workno, {
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
                    //Array.prototype.push.apply(getList[n], mdboss.getReadyCommon[n]);
                } else {
                    //getList[n] = mdboss.getReadyCommon[n];
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
                    	mdboss.notifyTips(errorMsg);
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
                                if (loadNum == length && typeof callback == "function"){
                                    callback(mdboss.cache);
                                }
                            },error:function(){
                               mdboss.cache[n][keyName] = eval('({"rows":[]})');
                               mdboss.alert(keyName + " 数据加载出错");
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
//        	 $("#leftMenuContainer").mCustomScrollbar("destroy");
//        	 $("#leftMenuContainer").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false });
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
                    }
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

//    Handlebars.registerHelper('listvalue', function (data, index, param) {
//    	console.log(data);
//    	console.log(index);
//    	console.log(param);
//       var val = "";
//    	if(data){
//    		var len = data.length;
//    		for(var i=0; i<len; i++){
//    			if(i == index){
//    				if(param =="usercode"){
//    					val = data[i].usercode;
//    				}else if(param =="username"){
//    					val = data[i].username;
//    				}else{
//    					val = data[i].code;
//    				}
//    				break;
//    			}
//    		}
//       }
//        return val;
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
		 v1=v1.toString();
	     v1 =  v1.replace(/-/g,"/");
	     var date = new Date(v1);
    	return $.fullCalendar.formatDate(date, "MM/dd HH:mm");
    });
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
    
    Handlebars.registerHelper("mod2", function (index,options) {
        return  index%2==0?options.inverse(this):options.fn(this);
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
    	console.log(val);
    	return val;
    });
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