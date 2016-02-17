/**
 * Created by jahon on 15/3/16.
 */

seajs.config({
    alias: {
        //js标准库
        'es5-shim': '{public}/{spm_modules}/es5-shim/4.0.5/es5-shim.min.js',
        'json': '{public}/{spm_modules}/json2/1.0.0/index.js',
        'json2': '{public}/{spm_modules}/json2/jquery.json-2.4.js',
        'jquery': '{public}/{spm_modules}/jquery/1.10.1/jquery.js',
        'migrate': '{public}/{spm_modules}/jquery/1.10.1/jquery-migrate.min.js',
        'bootstrap':'{public}/{spm_modules}/bootstrap/bootstrap-3.3.4/js/bootstrap.min.js',
        'pagination':'{public}/{spm_modules}/bootstrap/jquery.bs_pagination.min.js',
        'underscore': '{public}/{spm_modules}/underscore/1.6.0/underscore-min.js',
        'handlebars': '{public}/{spm_modules}/handlebars/2.0.0/dist/handlebars.js',
        'moment': '{public}/{spm_modules}/moment/2.10.2/min/moment.min.js',
        'backbone': '{public}/{spm_modules}/backbone/1.1.2/backbone-min.js',
        'md5': '{public}/{spm_modules}/md5/md5.js',
        'datetimepicker': '{public}/{vendor}/bootstrap-datetimepicker.min.js',
        'notify':'{public}/{vendor}/bootstrap-notify.js',
        'bootbox':'{public}/vendor/bootbox.js',
        'uploadify':'{public}/{spm_modules}/uploadify/jquery.uploadify.min.js',
        'uploadifyswf':'{public}/{spm_modules}/uploadify/uploadify.swf',
        'daterangepicker':'{public}/{vendor}/daterangepicker/daterangepicker.js',
        'daterangepicker_moment':'{public}/{vendor}/daterangepicker/moment.js',
        'media':'{public}/{vendor}/media/jquery.media.js',
       
        //js插件
        'livequery': '{public}/{vendor}/jquery.livequery.min.js',
        'livebg': '{public}/{vendor}/livebg.js',
        'easing': '{public}/{vendor}/easing.js',
        'cookie': '{public}/{vendor}/cookie.js',
        'dialog': '{public}/{vendor}/dialog.js',
        'scroll': '{public}/{vendor}/jscrollpane.js',
        'mousewheel': '{public}/{vendor}/mousewheel.js',
        'fileinput': '{public}/{vendor}/fileinput.js',
        'upload':'{public}/{vendor}/ajaxfileupload.js',
        "seajstext":'{public}/{vendor}/seajs-text.js',
        "tree":'{public}/{vendor}/ztree/jquery.ztree.core-3.5.js',
        "tree_excheck":'{public}/{vendor}/ztree/jquery.ztree.excheck-3.5.min.js',
        "tree_exedit":'{public}/{vendor}/ztree/jquery.ztree.exedit-3.5.js',
        "select2":'{public}/{vendor}/select2.min.js',
        "fullcalendar":'{public}/{vendor}/calendar/fullcalendar.js',
        "validVal":'{public}/{vendor}/jquery.validVal.js',
        "flux":'{public}/{vendor}/flux.min.js',
        "cycle":'{public}/{vendor}/jquery.cycle.all.min.js',
        "commonevents":'{public}/{vendor}/form.common.events.js',//动态表单通用组件js
        "dynamicaddevents":'{public}/{vendor}/dynamic.addevents.js',//动态表单事件绑定js
        "dragsort":'{public}/{vendor}/dragsort/jquery.dragsort-0.5.1.js',//拖动排序
        'ui-core':'{public}/{vendor}/drag/core.js',
        'ui-widget':'{public}/{vendor}/drag/widget.js',
        'ui-mouse':'{public}/{vendor}/drag/mouse.js',
        'ui-sortable':'{public}/{vendor}/drag/sortable.js',
        'mCustomScrollbar':'{public}/{vendor}/scroll/jquery.mCustomScrollbar.concat.min.js',
        'accounting':'{public}/{vendor}/accounting/accounting.min.js',
        'tipso':'{public}/{vendor}/tipso/tipso.min.js',//提示信息框
        'imgareaselect':'{public}/{vendor}/imgareaselect/jquery.imgareaselect.min.js',//图片选择,剪切
        'jqueryui':'{public}/{vendor}/jqueryui/jquery-ui.min.js',//jqueryui
        'Jcrop':'{public}/{vendor}/imgareaselect/jquery.Jcrop.min.js',//图像裁剪插件
        'jqueryform':'{public}/{vendor}/jquery.form.js',//表单处理
        
        //自定义模块
        'util': '{public}/common/util.js',
        'global': '{public}/common/global.js',
        'main': '{public}/{modules}/main/index.js',
        'login': '{public}/{modules}/login/main.js',
        'dashboards': '{public}/{modules}/dashboards/main.js',
        'process': '{public}/{modules}/process/main.js',
        'orgs': '{public}/{modules}/process/orgs.js',
        'forms':'{public}/{modules}/process/forms.js',
        'formsFun': '{public}/{modules}/process/formsFun.js',
        'iconselect':'{public}/{modules}/process/iconselect.js',
        'processInfo': '{public}/{modules}/process/process_info.js',
        'startProcessInfo': '{public}/{modules}/process/startProcessInfo.js',
        'dynamicform': '{public}/{modules}/process/dynamicform.js',//动态表单生成js
        'dynamictable': '{public}/{modules}/process/dynamictable.js',//动态表生成js
        'dynamicpicker': '{public}/{modules}/process/dynamicpicker.js',//动态picker生成js
        'serialcode':'{public}/{modules}/process/serialcode.js',//通用添加顺序号
        'buttons': '{public}/{modules}/process/formsButtons.js',
        "print":"{public}/{modules}/process/print.js",
        "diagram":"{public}/{modules}/process/diagram.js",
        "entrust":"{public}/{modules}/process/entrust.js",
        "selectCommonLang":"{public}/{modules}/process/selectCommonLang.js",
        "preViewDiagram":"{public}/{modules}/process/preViewDiagram.js",
        'error': '{public}/{modules}/error/main.js',
        'demo': '{public}/{modules}/demo/main.js',
        'attend': '{public}/{modules}/attend/main.js',//
        'traveldetail': '{public}/{modules}/attend/travel_detail.js',//出差人员详情
        'member': '{public}/{modules}/member/main.js',
        'profile': '{public}/{modules}/profile/profile_main.js',
        'dashsetting':'{public}/{modules}/profile/dashsetting.js',
        'sidenavsettting':'{public}/{modules}/profile/sidenavsettting.js',
        'circularize':'{public}/{modules}/process/circularize.js',
        'attendindex':'{public}/{modules}/attend/index.js',
        'signin':'{public}/{modules}/attend/signin.js',
        'resign':'{public}/{modules}/attend/resign.js',//补签
        'travel':'{public}/{modules}/attend/travel.js',//差旅
        'statis':'{public}/{modules}/attend/statis.js',//统计
        'sign':'{public}/{modules}/attend/sign.js',//签到查询
        'workday': '{public}/{modules}/attend/workday.js',//工作日定义
        'sign_export':'{public}/{modules}/attend/sign_export.js',//考勤数据导出
        'review':'{public}/{modules}/common/review.js',//文件预览
        'deptRoleSelect':'{public}/{modules}/common/deptRoleSelect.js',//部门,角色,院外单位, 主送

        'queryprocesspart': '{public}/{modules}/process/queryprocesspart.js',
        'meno': '{public}/{modules}/process/meno.js',
        'remind': '{public}/{modules}/process/remind.js',
        'selectMember': '{public}/{modules}/member/selectMember.js',
        'selectMan': '{public}/{modules}/common/selectMan.js',//根据组织选人
        'selectRole': '{public}/{modules}/common/selectRole.js',//根据组织选角色
        'selectHandler': '{public}/{modules}/process/selectHandler.js',
        'setstepinfo':'{public}/{modules}/process/setstepinfo.js',
        'feed': '{public}/{modules}/feed/main.js',
        'search': '{public}/{modules}/search/main.js',
        'wfsmain': '{public}/{modules}/wfsform/main.js',//表单管理 
        'wfsforms': '{public}/{modules}/wfsform/forms.js',//表单管理 
        'wfsitems':'{public}/{modules}/wfsform/formitems.js',//表单项
        'deputemain':'{public}/{modules}/depute/main.js',//委托授权管理
        'deputeedit':'{public}/{modules}/depute/deputeedit.js',//委托授权管理
        'processinst':'{public}/{modules}/common/processinst.js',//委托事项
        'dirselect':'{public}/{modules}/common/dirselect.js',//文件目录
        
        //门户
        'webindex':'{public}/{modules}/webindex/main.js',
        'bigevents':'{public}/{modules}/webindex/bigevents.js',
//        'newslist':'{public}/{modules}/webindex/newslist.js',
        'newsmore':'{public}/{modules}/webindex/newsmore.js',
        'newsdetail':'{public}/{modules}/webindex/newsdetail.js',
        
        'noticemore':'{public}/{modules}/webindex/noticemore.js',//公告列表
        'noticedetail':'{public}/{modules}/webindex/noticedetail.js',//公告详情
        'meetingmore':'{public}/{modules}/webindex/meetingmore.js',//会议列表
        'meetingdetail':'{public}/{modules}/webindex/meetingdetail.js',//会议详情
        
        'moreSn':'{public}/{modules}/webindex/moreSn.js',
        'projindex':'{public}/{modules}/projindex/main.js',
        'projdetail':'{public}/{modules}/projindex/projdetail.js',
        'deptindex':'{public}/{modules}/deptindex/main.js',
        'deptdetail':'{public}/{modules}/deptindex/deptdetail.js',
        'reportindex':'{public}/{modules}/reportindex/main.js',
        
        
        'project':'{public}/{modules}/project/main.js',//导航的项目 2015-09-01
        'projectlist':'{public}/{modules}/project/projectlist.js',//项目列表 2015-09-02
        'projectadd':'{public}/{modules}/project/projectadd.js',//项目添加 2015-09-02
        'professlist':'{public}/{modules}/project/professlist.js',//专业列表 2015-09-02
        'projectdetail':'{public}/{modules}/project/projectdetail.js',//项目详情 2015-09-02
        'professdetail':'{public}/{modules}/project/professdetail.js',//专业详情 2015-09-02
        'architectconfig':'{public}/{modules}/project/config/architect.js',//项目架构配置
        'professconfig':'{public}/{modules}/project/config/profess.js',//专业配置
        'professconfigedit':'{public}/{modules}/project/config/professedit.js',//专业配置-新增
        'roleconfig':'{public}/{modules}/project/config/role.js',//项目角色配置
        'projectroleedit':'{public}/{modules}/project/config/roleedit.js',//项目角色配置
        'members':'{public}/{modules}/project/config/members/members.js',//项目成员
        'membersedit':'{public}/{modules}/project/config/members/membersedit.js',//编辑项目成员
        
        'projectphase':'{public}/{modules}/project/config/phase.js',//项目阶段
        'projectphaseedit':'{public}/{modules}/project/config/phaseedit.js',//项目阶段
        'projecttree':'{public}/{modules}/project/config/projecttree.js',//项目架构树
        
        //系统管理
        'system':'{public}/{modules}/system/main.js',
        'systemmodule':'{public}/{modules}/system/module.js',//模块管理
        "moduleedit":'{public}/{modules}/system/moduleedit.js',//模块编辑 --
        'systempermission':'{public}/{modules}/system/permission.js',//权限管理
        "permissionedit":'{public}/{modules}/system/permissionedit.js',//权限编辑
        'systemorg':'{public}/{modules}/system/org.js',//组织管理
        "orgedit":'{public}/{modules}/system/orgedit.js',//组织编辑
        'systemrole':'{public}/{modules}/system/role.js',//角色管理
        "roleedit":'{public}/{modules}/system/roleedit.js',//角色编辑
        'systemoperate':'{public}/{modules}/system/operate.js',//操作员管理
        "operateedit":'{public}/{modules}/system/operateedit.js',//操作员编辑
        'systemparam':'{public}/{modules}/system/param.js',//参数管理
        "paramedit":'{public}/{modules}/system/paramedit.js',//参数编辑
        'systemdict':'{public}/{modules}/system/dict.js',//字典管理
        "dictedit":'{public}/{modules}/system/dictedit.js',//字典编辑
        'systemroleperm':'{public}/{modules}/system/roleperm.js',//角色授权
        "rolepermedit":'{public}/{modules}/system/rolepermedit.js',//角色授权编辑
        'systemgroup':'{public}/{modules}/system/group.js',//群组管理
        "groupedit":'{public}/{modules}/system/groupedit.js',//字典编辑
        'systemtable':'{public}/{modules}/system/table.js',//数据库表管理
        "tableedit":'{public}/{modules}/system/tableedit.js',// 编辑
        'systemcolumn':'{public}/{modules}/system/column.js',//数据库 表-列表管理
        "columnedit":'{public}/{modules}/system/columnedit.js',//编辑
        
        "systemcachet":'{public}/{modules}/system/cachet.js',//公章管理
        "cachetedit":'{public}/{modules}/system/cachetedit.js',//公章管理编辑
        "systemredhead":'{public}/{modules}/system/redhead.js',//红头模版管理
        "redheadedit":'{public}/{modules}/system/redheadedit.js',//红头模版编辑
        
        'workflowlist':'{public}/{modules}/process/query/workflow.js',//流程管理 TODO
        "workflowedit":'{public}/{modules}/process/query/workflowedit.js',//流程编辑
        'workformlist':'{public}/{modules}/process/query/workform.js',//表单管理
        "workformedit":'{public}/{modules}/process/query/workformedit.js',//表单编辑
        'workformitemlist':'{public}/{modules}/process/query/workformitem.js',//表单项管理
        "workformitemedit":'{public}/{modules}/process/query/workformitemedit.js',//表单项编辑
        'stepinfolist':'{public}/{modules}/process/query/stepinfo.js',//环节管理
        "stepinfoedit":'{public}/{modules}/process/query/stepinfoedit.js',//环节编辑
        
        'widgetlist':'{public}/{modules}/system/widget.js',//组件管理
        "widgetedit":'{public}/{modules}/system/widgetedit.js',//组件编辑
        
        'feetypelist':'{public}/{modules}/system/feetype.js',//费用类型
        "feetypeedit":'{public}/{modules}/system/feetypeedit.js',//费用类型编辑
        
        "moduleselect":'{public}/{modules}/common/moduleselect.js',//父模块选择
        "rolepermselect":'{public}/{modules}/common/rolepermselect.js',//父模块选择
        
        //帮助2015-08-26
        "help":'{public}/{modules}/help/main.js',//帮助模块主函数
        "helpfeedback":'{public}/{modules}/help/feedback.js',//问题
        "helpfeedbackedit":'{public}/{modules}/help/feedbackedit.js',//问题编辑
        "helpansweredit":'{public}/{modules}/help/answeredit.js',//反馈编辑
        "helpapply":'{public}/{modules}/help/apply.js',//使用帮助
        "helpapplyedit":'{public}/{modules}/help/applyedit.js',//使用帮助编辑

        //帮助2015-08-26
        "fund":'{public}/{modules}/fund/main.js',//帮助模块主函数
        "funddevice":'{public}/{modules}/fund/device.js',//问题
        "deviceedit":'{public}/{modules}/fund/deviceedit.js',//问题编辑
        "fundassests":'{public}/{modules}/fund/assests.js',//反馈编辑
        "assestsedit":'{public}/{modules}/fund/assestsedit.js',//反馈编辑
        
        //OA
        "oa":'{public}/{modules}/oa/main.js',//OA模块主函数
        "meeting":'{public}/{modules}/oa/meeting.js',//会议室预定
        "meetingedit":'{public}/{modules}/oa/meetingedit.js',//会议室预定 编辑
        "meetingroom":'{public}/{modules}/oa/meetingroom.js',//会议室预定
        "meetingroomedit":'{public}/{modules}/oa/meetingroomedit.js',//会议室预定 编辑
        "serial":'{public}/{modules}/oa/serial.js',//字号
        "serialedit":'{public}/{modules}/oa/serialedit.js',//字号 编辑
        "documents":'{public}/{modules}/document/documents.js',//文档管理
        "qcodeSetting":'{public}/{modules}/document/qcodeSetting.js',//二维码生成管理
//        "documentsedit":'{public}/{modules}/oa/documentsedit.js',//字号 编辑
        //报告
        "report":'{public}/{modules}/report/main.js',//报告模块主函数
        "textedit":'{public}/{modules}/common/textedit.js',//文本编辑器
       
        //项目
        'demo':'{public}/{modules}/demo/main.js',
        "demobatchedit":'{public}/{modules}/demo/batchedit.js',
        "demoedit":'{public}/{modules}/demo/edit.js',
        "demoview":'{public}/{modules}/demo/view.js',
        
        //内容管理
        "content":'{public}/{modules}/content/main.js',//内容管理主函数
        "news":'{public}/{modules}/content/news.js',//新闻
        "newsedit":'{public}/{modules}/content/newsedit.js',//新闻编辑
        "work":'{public}/{modules}/content/work.js',//协同办公
        "workedit":'{public}/{modules}/content/workedit.js',//协同办公编辑
        "notice":'{public}/{modules}/content/notice.js',//公告
        "noticeedit":'{public}/{modules}/content/noticeedit.js',//公告编辑
        "meetinfo":'{public}/{modules}/content/meetinfo.js',//会议公告
        "meetinfoedit":'{public}/{modules}/content/meetinfoedit.js',//会议公告编辑
        "link":'{public}/{modules}/content/link.js',//链接管理
        "linkedit":'{public}/{modules}/content/linkedit.js',//链接编辑
        "portal":'{public}/{modules}/content/portal.js',//门户页面排版管理
        "portaledit":'{public}/{modules}/content/portaledit.js',//门户页面排版编辑
        "business":'{public}/{modules}/content/business.js',//业务指引管理
        "businessedit":'{public}/{modules}/content/businessedit.js',//业务指引编辑
       
        'unreadmail':'{public}/{modules}/webindex/unreadmail.js',//未读邮件更多
        'unreadmaildetail':'{public}/{modules}/webindex/unreadmaildetail.js',//未读邮件详情
        "birthday":'{public}/{modules}/webindex/birthdaymore.js',
        
//        'mdboss': '{public}/common/mdboss.js'
       'mdboss': '{public}/test.js' 

    },
    preload: [
        'jquery',
        'handlebars',
        'util',
        'underscore',
        'bootstrap',
        'seajstext',
        'notify',
        'daterangepicker_moment',
        Function.prototype.bind ? '' : 'es5-shim',
        this.JSON ? '' : 'json'
    ],
    debug: 2,
    // 变量配置
    vars: {
        'public': 'scripts',
        'spm_modules': 'spm_modules',
        'modules': 'modules',
        'vendor': 'vendor'  
    },
    map: [
          [ /^(.*\.(?:css|js|html))(.*)$/i, '$1?_='+new Date().getTime() ]
          ],
    base: './',
    charset: 'utf-8',
    timeout: 20000
});


//seajs.use(['underscore']);
baseConfig = {
	  base: 'http://localhost:8080/portal/'
//    base: 'http://localhost/portal-web/'

};
baseConfig.avatar_url=baseConfig.base+"download?filecode=";//头像地址
baseConfig.avatar_default="images/avatar.png";//用户默认头像