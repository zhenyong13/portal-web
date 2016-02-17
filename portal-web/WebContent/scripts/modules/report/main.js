define(function (require, exports, module) {
	var mdboss = require("mdboss");
	var $ = require("jquery");
	require("mCustomScrollbar");
	require("select2");
	require("datetimepicker");
	var textedit = require("textedit");
	var util = require("util");
	require("scroll");
	require("upload");
	
	//type 区分当前和 还是下一周期的 (cur next)
	mdboss.Model.reportItem = Backbone.Model.extend({
		initialize: function(){ },
		defaults: {}
	});	
	//  集合
	mdboss.Collection.reportItems = Backbone.Collection.extend({
		initialize : function(){  },
		comparator: 'id'
	});
	 
	
	var reportItems = new mdboss.Collection.reportItems();
    /** ***************************报告******************************************************* */

	mdboss.View.reportView = Backbone.View.extend({
        el: '#rightMainContainer',
        initialize:function(){
        	var t=this;
        	t.currentItem = {}; //当前事项
        	t.nextItem = {}; //当前事项
        	t.curDate = new Date();
        	t.currentType = "week";//当前选择类型  week / month
        	
        	t.currentYear =  t.curDate.getFullYear();//当前年
        	t.currentMonth = t.curDate.getMonth()+1; //当前月 0-11
        	t.currentDate =  t.curDate.getDate() - t.curDate.getDay()+1; //当前日 1-31
        	t.currentWeek =  util.getWeekNumber(t.currentYear , t.currentMonth, t.curDate.getDate())-3;//当前周
        	t.form="";
        	t.to="";
        	
        	//取到用户信息后再去渲染页面
        	if(mdboss.cache.data["getMyInfo"]){
        		t.username=mdboss.cache.data["getMyInfo"].username;
        		t.render();
        	}else{
        		mdboss.submit({}, mdboss.api.getMyInfo, function(res){
        			if(res.rc == 1){
	        			t.username=res.data.username;
	        			t.render();
        			}else{
        				mdboss.error(res.msg);
        			}
        		});
        	}	
        },   
        render:function(){
        	this.getTimeLineTree();//加载时间线,并刷新数据
        	this.getMySubMember();//获取我的下属 
        	$(".reports-left").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false });
        	this.$el.find(".jscroll").jScrollPane();
        	$(require("text!template/page/process/form/stepinfotemplate.html")).appendTo(this.$el.find(".reports-right"));
        },
        reportItemData:function(){//获取报告事项 
        	console.log("查询数据");
        	var cur = this;
        	console.log(this);
        	cur.reportItemHead();//头信息
        	cur.$el.find("#curweekplan table tbody").empty();
        	cur.$el.find("#nextweekplan table tbody").empty();

        	var params={
				"year":cur.currentYear,//年
				"quarter":(cur.transReport(cur.currentType)=="QuarterReport")?cur.quarter:"",//非季度类型,该字段为空
				"month":(cur.transReport(cur.currentType)=="WeekReport"||cur.transReport(cur.currentType)=="MonthReport")?cur.currentMonth:"",//非周、月报类型,该字段为空
				"week":(cur.transReport(cur.currentType)=="WeekReport")?cur.currentWeek:"" ,//非周类型,该字段为空
				"reporttype":cur.transReport(cur.currentType),//报告类型
        	};
        	
        	mdboss.submit(params, mdboss.api.reportitemQuery, function(res){
        		if(res.rc == 1){
        			//类型
        			cur.planDataInfo("curweekplan",  res.data.rows);//本月/本周工作日报
        			cur.planDataInfo("nextweekplan", res.data.rows);//下月/下周工作日报
        			var temp = res.data.rows;
        			for(var i=0; i<temp.length; i++){
        				var model = reportItems.get(temp[i].id);
        		    	if(model == null){//创建数据模型
        		    		 model = new mdboss.Model.reportItem({"id": temp[i].id,  "type" : "cur"});//next
        		    		 reportItems.add(model);
        		    	 }
        		    	 model.set("worktask", temp[i].worktask);
        		    	 model.set("workresult", temp[i].workresult);
        		    	 model.set("workprogress", temp[i].workprogress);
        		    	 model.set("nofinishreason", temp[i].nofinishreason);
        			}
        			cur.initEvent();
        		}else{
        			mdboss.error(res.msg);
        		}
        	}, true);
        },
        reportItemHead: function(e){
        	var cur = this;
        	var template=Handlebars.compile($("#report-work-head").html());
	    	if(this.currentType == "week"){
	    		var reportTitle = cur.username + "的第"+cur.currentWeek+"周的工作报告";
	    		cur.$el.find(".reports-head").html(template({"week":cur.currentWeek,"from":cur.from,"to":cur.to, "reportTitle":reportTitle}));
	    		cur.$el.find("#current-item").html("本周工作成效");
	    		cur.$el.find("#next-item").html("下周工作计划");
	    	}else if(this.currentType == "month" ){
	    		var reportTitle = cur.username + cur.currentYear+"年"+cur.currentMonth+"月的工作报告";
		    	cur.$el.find(".reports-head").html(template({"currentType":cur.currentType, "reportTitle":reportTitle}));
		    	cur.$el.find("#current-item").html("本月工作成效");
		    	cur.$el.find("#next-item").html("下月工作计划");
	    	}else{
	    		
	    	}
        },
        initEvent:function(e){
        	 $("select").select2();
   	    	 this.$el.find('.date').datetimepicker({
   	                format: 'yyyy-mm-dd', minView: 2, autoclose: true, todayBtn: true,
   	                language: 'zh-CN', startDate: '+0d'
   	            }).on('changeDate', function(ev){
   	            	$(this).focus().blur();//处理选择时间后，输入框边框还是红色问题
   	         });
        },
        getMySubMember:function(e){//获取我的下属 
        	var r_this =this; 
        	r_this.$el.find(".member-list").mCustomScrollbar("destroy");
        	
        	mdboss.reqsubmit({}, mdboss.api.getMySubordinate, function(m, res){
        		if(res.rc ==1){
        			if(res.data.rows.length > 0){
        				var listTemplate = Handlebars.compile(r_this.$el.find("#my_sub_member").html());
     	            	 var listHtml=listTemplate({submembers:res.data.rows, "baseurl":baseConfig.avatar_url});
     	            	 r_this.$el.find(".member-list").html(listHtml);
     	            	 r_this.$el.find(".member-list").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false });
        			}else{
        				r_this.$el.find(".reports-right").css("right","10px");
        				r_this.$el.find(".member-layer").remove();
        			}
        		}else{
        			mdboss.error(res.msg);
        		}
        	});
        },
        queryMySubordinate:function(e){//搜索我的下属
	    	var t =this; 
        	t.$el.find(".member-list").mCustomScrollbar("destroy");
        	var subordinatename=$(e.currentTarget).val();
        	if(e.which == 13){
	        	mdboss.reqsubmit({"subordinatename":subordinatename}, mdboss.api.queryMySubordinate, function(m, res){
	        		if(res.rc ==1){
	        			if(res.data.rows.length > 0){
	        				var listTemplate = Handlebars.compile(t.$el.find("#my_sub_member").html());
	     	            	 var listHtml=listTemplate({submembers:res.data.rows, "baseurl":baseConfig.avatar_url});
	     	            	 t.$el.find(".member-list").html(listHtml);
	     	            	 t.$el.find(".member-list").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false });
	        			}else{
	        				t.$el.find(".reports-right").css("right","10px");
	        				t.$el.find(".member-layer").remove();
	        			}
	        		}else{
	        			mdboss.error(res.msg);
	        		}
	        	});
        	}
        },
        events: {
        	'click .season .time-circle':'seasonReport',//展示季 年中 年报 
        	'click .month .time-circle':'openMonth',//展示月  及月报
        	'click .j_weekreport':'getWorkReport',//展示周报,填写
        	"click .timetree-weeklist .time-circle":'getWorkReport',//周报
        	"click .timetree-weeklist .time-circle":'getWorkReport',//周报
        	
        	"click .js-add-plan":"addplan",//添加计划,成就
        	"click .js-plan-save":"planSave",//保存计划,成就
        	"click .dropdown-menu li":"getTimeLineTree",
        	"click #prev":'prevReport',//上周 /月
        	"click #current":'currentReport',//本周 /月
        	"click #next":'nextReport',//下周 /月
        	"click #maxWindow":'maxWindow',//最大化窗口 / 最小
        	"focus .js_select_man":'delegateMan',//负责人
       	 	"keyup .js_select_man":'delegateMan',//负责人
       	 	
       	 	"click .js_textedit":'textedit',//文本编辑器
       	 	"click .js_module_del":'delReportItem',//删除事项
  
       	 	"keyup .queryMySubordinate":"queryMySubordinate"//我的下属搜索
	     },
	     delReportItem:function(e){  //删除事项
	    	 var target = $(e.currentTarget);
	    	 var id = target.data("id");
	    	 mdboss.confirm("确定要删除吗?", function(e){
	    		 if(e){
	    			 target.closest("tr").remove();
	    			 reportItems.remove(id);
	    			 mdboss.reqsubmit({"tid":id}, mdboss.api.reportitemDelete, function(m, res){
	    	    		 if(res.rc == 1){
	    	    			 mdboss.alert("成功删除!");
	    	    		 }else{
	    	    			 mdboss.error(res.msg);
	    	    		 }
	    	    	 });
	    			 
	    		 }
	    	 });
	     },
	     textedit:function(e){ //富文本编辑
	    	 var target = $(e.currentTarget);
	    	 var id = target.data("id");
	    	 var name = target.data("name");
	    	 var title = "";
	    	 switch( name ){
	    	 	case "worktask": title = "工作任务编辑"; break;
	    	 	case "workresult": title = "结果定义编辑"; break;
	    	 	case "workprogress": title = "完成进度编辑"; break;
	    	 	case "nofinishreason": title="未完成原因及解决措施编辑"; break;
	    	 }
	    	 //nextweekplan curweekplan 
	    	 var type = "next";
	    	 if(target.closest("#curweekplan")){//
	    		 type = "cur";
	    	 }
	    	 
	    	 //事项中某元素的内容获取操作
	    	 var model = reportItems.get(id);
	    	 var content = "";
	    	 if(model == null){//创建数据模型
	    		 model = new mdboss.Model.reportItem({"id": id,  "type" : type});
	    		 reportItems.add(model);
	    	 }else{
	    		content = model.get(name)==undefined ? "" : model.get(name); 
	    	 }
	    	 
	    	 textedit.texteditFunc({"title":title,"content":content, "callback":function(content){
	    		 model.set(name , content);
	    	 }});
	     },
         delegateMan:function(e){ //选人
        	 mdboss.userselect(e, this, function(pview, usercode, name){}, false,"75px");
         },
	    maxWindow:function(e){//最大化窗口 / 最小
	    	 var cur_obj=$(e.currentTarget);
	    	 if( cur_obj.find("i").hasClass("fa-arrows-alt")){
	    		 cur_obj.attr("title", "还原");
	    		 this.$el.find(".reports-right").css("left","15px");
	    		 cur_obj.find("i").removeClass("fa-arrows-alt");
	    		 cur_obj.find("i").addClass("fa-compress");
	    	 }else{
	    		 cur_obj.attr("title", "最大化");
	    		 this.$el.find(".reports-right").css("left","248px");
	    		 cur_obj.find("i").addClass("fa-arrows-alt");
	    		 cur_obj.find("i").removeClass("fa-compress");
	    	 }
	     },
	     prevReport:function(e){//上周 /月  
	    	 var t=this;
	    	 console.log("上周 /月 ");
	    	 if(t.currentType == "week"){//周
	    		 t.currentWeek-=1;
	    		 t.currentMonth=Math.ceil(t.currentWeek / 4);
	    		 t.getTimeLineTree();
	    	 }else{//月
	    		 if(t.currentMonth<=1){//限制时间轴在本年内
	    			 t.currentMonth=1;//超出本年度月份,重设回本年最小的月份
	    			 t;
	    		 }else{
	    			 t.currentMonth -=1;
	    			 t.currentDate =1;
	    			 t.getTimeLineTree();
	    		 }
	    	 } 
	     },
	     currentReport:function(e){//本周 /月
	    	 var t=this;
	    	 t.currentYear =  t.curDate.getFullYear();//当前年
	    	 t.currentMonth = t.curDate.getMonth()+1; //当前月 0-11
	    	 t.currentDate =  t.curDate.getDate() - t.curDate.getDay()+1; //当前日 1-31
	    	 t.currentWeek =  util.getWeekNumber(t.currentYear, t.currentMonth, t.currentDate)-3;//当前周
	    	 
	    	 if(t.currentType == "week"){//周
	    		 t.weekReport();
	    	 }else{//月
	    		
	    	 }
	    	 t.getTimeLineTree();
	     },
	     nextReport:function(e){//下周 /月
	    	 var t=this;
	    	 console.log("下周 /月");
	    	 if(t.currentType == "week"){//周
	    		 t.currentWeek+=1;
	    		 t.currentMonth=Math.ceil(t.currentWeek / 4);
	    		 t.getTimeLineTree();
	    	 }else{//月
	    		 if(t.currentMonth>=12 ){//限制时间轴在本年内
	    			 t.currentMonth =12;//超出本年度月份,重设回本年最大的月份
    				 return ;
	    		 }else{
	    			 t.currentMonth +=1;
	    			 t.currentDate =1;
		    		 t.getTimeLineTree();
	    		 } 
	    	 }
	     },
	     getTimeLineTree:function(e){//时间线初始化定义及更新
	    	 var cur=this;
	    	 var year=new Date().getFullYear();
	    	 if(e){
	    		 year=$.trim($(e.currentTarget).find("a").text());
	    		 cur.$el.find("#curYear").text(year);
	        	 $(e.currentTarget).closest(".dropdown-menu").hide();
	    	 }
	    	 cur.getMonthWeek(cur.currentYear,cur.currentMonth,cur.currentWeek);
        	 cur.reportItemData();
	     },
	     weekReport:function(){
	    	 console.log("week report ..");
	     },
	     planSave:function(e){//保存
	    	 var cur = this;
	    	 var plan=$(e.currentTarget).data("plan");
	    	 var formData = null;
	    	 var params = {};
	    	 if(plan =="curweekplan"){//本周||本月  表单数据
	    		 formData = this.getReqData("curweekplan", "cur");
	    		 params.summary=cur.$el.find("#summary").val();//心得总结
	    		 params.attachment="";//附件
	    	 }else{//下周/下月 表单数据
	    		 formData = this.getReqData("curweekplan", "next");
	    	 }
	   
			params.year=cur.currentYear;//年
			params.quarter=(cur.transReport(cur.currentType)=="QuarterReport")?cur.quarter:"";//非季度类型,该字段为空
			params.month=(cur.transReport(cur.currentType)=="WeekReport"||cur.transReport(cur.currentType)=="MonthReport")?cur.currentMonth:"";//非周、月报类型,该字段为空
			params.week=(cur.transReport(cur.currentType)=="WeekReport")?cur.currentWeek:"";//非周类型,该字段为空
			params.reporttype=cur.transReport(cur.currentType);//报告类型
			
			params.rows=formData;//列表数据
 
	    	 //发送保存请求
	    	 mdboss.reqsubmit(params, mdboss.api.reportitemEdit, function(m, res){
	    		 if(res.rc == 1){
	    			 mdboss.alert("保存成功!");
	    		 }else{
	    			 mdboss.error(res.msg);
	    		 }
	    	 });
	     },
	     getReqData:function(id){
	    	 var array = new Array();
	    	 $("#"+id+ " table tbody tr").each(function(i,tr){
	    		 var data = {};
	    		 var trId = $(tr).data("id");
	    		 var model = reportItems.get(trId);
	    		 
	    		 data.worktask = model.get("worktask");
	    		 data.workresult = model.get("workresult");
	    		 data.workprogress = model.get("workprogress");
	    		 data.workprogress = model.get("workprogress");
	    		 data.nofinishreason = model.get("nofinishreason");
	    		 
	    		 $(tr).find("td").each(function(j, td){
	    			 switch( j ){
	    			 	case 1:
		    				 data.worktype = $(td).find("#worktype").val();
		    				 break;
	    			 	case 2:
//	    			 		data.worktask = $(td).find("#worktask").val();
	    			 		break;
	    			 	case 3://
	    			 		data.worklevel = $(td).find("#worklevel").val();
	    			 		break;
	    			 	case 4://负责人
	    			 		data.manager = { "code":$(td).find("#creator"+trId).data("code"), "name":$(td).find("#creator"+trId).val() };//principal
	    			 		break;
	    			 	case 5://协办人
	    			 		data.assist = { "code":$(td).find("#assist"+trId).data("code"), "name":$(td).find("#assist"+trId).val() };;
	    			 		break;
	    			 	case 6://结果定义
//	    			 		data.workresult = $(td).find("#workresult").val();
	    			 		break;
	    			 	case 7://计划完成时间
	    			 		data.planfinish = $(td).find("#planfinish").val();
	    			 		break;
	    			 	case 8://实际完成时间
	    			 		data.currentfinish = $(td).find("#currentfinish").val();
	    			 		break;
	    			 	case 9://状态
	    			 		data.workstate = $(td).find("#workstate").val();
	    			 		break;
	    			 	case 10://进度
//	    			 		data.workprogress = $(td).find("#workprogress").val();
	    			 		break;
	    			 	case 11://未完成及解决措施
//	    			 		data.nofinishreason = $(td).find("#nofinishreason").val();
	    			 		break;
	    			 	default:;
	    			 }
	    		 });
	    		 array.push(data);
	    	 });
	    	 console.log(array[0]);
	    	 return array;
	     },
	     addplan:function(e){
	    	 var cur=this;
	    	 var weekplan=$(e.currentTarget).data("plan");
	    	 var datalist = new Array();
	    	 datalist.push({"id":mdboss.getuuid() ,"seqno":$("#"+weekplan).find("table tbody tr").length+1});
	    	 cur.planDataInfo(weekplan, datalist);
	    	 cur.initEvent(e);
	     },
	     planDataInfo: function(itemtype, data ){
	    	  var template = Handlebars.compile( this.$el.find("#tr-template").html() );
	          var tmp = template({"data":data});
	          this.$el.find("#"+itemtype).find("table tbody").append(tmp);
	     },
	     
	     seasonReport:function(e){//季 年中 年终
	    	 console.log("季 年中 年终");
	    	 var cur=this;
	    	 var cur_obj=$(e.currentTarget);
	    	 var whichSeason=cur_obj.closest(".timetree-head").find(".time-text").text();
	    	 cur_obj.closest(".timetree-head").addClass("active");
	    	 this.currentType = "season";//报 season halfyear endyear
	    	 var summaryTitle="";
	    	 var template=Handlebars.compile($("#report-work-otherhead").html());
	    	 var reportTitle = cur.username + "的"+whichSeason+"工作报告";
	    	

	    	 switch(whichSeason){
	  			case "第一季度":
	  				cur.currentMonth=3;
	  				cur.quarter=1;
	  				summaryTitle="本季度";
	  				cur.currentType="QuarterReport";//报告类型  季度
	  				break;
	  			case cur.currentYear+"年中":
	  				cur.currentMonth=6;
	  				cur.quarter=2;
	  				summaryTitle="年中";
	  				cur.currentType="MidYearReport";//报告类型  年中
	  				break;
	  			case "第三季度":
	  				cur.currentMonth=9;
	  				cur.quarter=3;
	  				summaryTitle="本季度";
	  				cur.currentType="QuarterReport";//报告类型  季度
	  				break;
	  			case cur.currentYear+"年终":
	  				cur.currentMonth=12;
	  				cur.quarter=4;
	  				summaryTitle="本年度";
	  				cur.currentType="YearReport";//报告类型  年终
	  				break;
	  			default:
	  				break;
  			 }
	    	 
	
    		 cur.$el.find(".reports-head").html(template({"reportTitle":reportTitle}));
    		 cur.$el.find("#current-item").html(whichSeason+"工作成效");
    		 
    		 cur.$el.find("#nextweekplan").closest(".reports-input").remove();//非周、月类型,无下一季度、下一年度等
    		 
	    	 
	    	 cur.$el.find(".summaryTitle").html(summaryTitle+"总结心得");
	    	 this.reportItemData();
	     },
	     getWorkReport:function(e){////选择时间轴周节点
	    	console.log("周报");
	    	var t=this;
	    	var $Target=$(e.currentTarget);
	    	t.currentType ="week";
	    	t.$el.find(".summaryTitle").html("本周总结心得");
	    	t.$el.find(".reports-timetree .active").each(function(i,item){
	    		$(item).removeClass("active");
	    	});
	    	$Target.closest("li").addClass("active");
	    	t.from = $Target.closest("li").data("from");
	    	t.to = $Target.closest("li").data("to");
	    	t.currentWeek = $Target.closest("li").data("week");
	    	t.currentMonth =Math.ceil(t.currentWeek / 4);
	    	t.currentDate = parseInt(t.from.split("-")[1]);
	    	t.reportItemData();
	     },
	     openMonth:function(e){//选择时间轴月节点
	    	 this.currentType = "month";//月报
	    	 var cur=this;
	    	 var cur_obj=$(e.currentTarget);
	    	 var month = cur_obj.data("month");//当前月
	    	 this.currentMonth =  month;
	    	 cur.$el.find(".reports-timetree .active").each(function(i,item){
	    		$(item).removeClass("active");
	    	 });
	    	 cur_obj.closest(".month").addClass("active");
	    	 var oid=cur.$el.find(".reports-timetree .timetree-weeklist:visible").attr("id");
	    	 var id=$(e.currentTarget).closest("div.timetree-month").find(".timetree-weeklist").attr("id");
	    	 if(oid!=id){
	    		 cur.$el.find(".reports-timetree .timetree-weeklist:visible").slideToggle();
	    	 }
	    	 $(e.currentTarget).closest("div.timetree-month").find(".timetree-weeklist").slideToggle();	 
	    	 
	    	 cur.$el.find(".summaryTitle").html("本月总结心得");
	    	 cur.reportItemData();
	     },
	     getMonthWeek:function(year, cmonth, cweek){
	    	 var cur = this;
	    	 cur.$el.find("#curYear,#curYearDrop").text(year);
	    	 var timeTreeQuery=new mdboss.Model.commonModel();
    		 mdboss.reqsubmit({"usercode":mdboss.usercode,"year":year}, mdboss.api.reportitemTime, function(m,res){	
	    		 if(res.rc=="1"){
	    			var dataRows=res.data.rows;
	    			for(var m=0;m<dataRows.length;m++){
	    				if(dataRows[m].type=="month"){//月份节点对象
	    					dataRows[m].ismonth=true;
	    					if(dataRows[m].value == cmonth){//初始化选择当月节点
		    					dataRows[m].active = true;
			     			}
	    					
	    					//重组时间轴‘周’对象
		    				var curMntWeeks=dataRows[m].weeks;		
		    				for(var i=0;i<curMntWeeks.length;i++){
		    					var weeksObj={};
		    					weeksObj.val=curMntWeeks[i].currentweet;//第几周
	    						if(curMntWeeks[i]){//过滤非月份的时间轴数据,如年中,季度
	    							weeksObj.from=dataRows[m].value+"-"+curMntWeeks[i].week.split(",")[0];
	    							weeksObj.to=dataRows[m].value+"-"+curMntWeeks[i].week.split(",")[6];		    							
	    							//轮询到当前周时,时间轴数据节点做当前标记
	    							(curMntWeeks[i].currentweet==cur.currentWeek)?weeksObj.iscurrent=true:weeksObj.iscurrent=false;
	    							dataRows[m].weeks[i]=weeksObj;
	    						}
		    				}
	    				}else if(dataRows[m].type=="quarter"){//季度节点对象
	    					dataRows[m].ismonth=false;
	    					switch(dataRows[m].value){
		    					case 1:
		    						dataRows[m].desc="第一季度";
		    						break;
		    					case 2:
		    						dataRows[m].desc="第二季度";
		    						break;
		    					case 3:
		    						dataRows[m].desc="第三季度";
		    						break;
		    					case 4:
		    						dataRows[m].desc="第四季度";
		    						break;
	    					}
	    					
	    				}else if(dataRows[m].type=="midyear"){//年中节点对象
	    					dataRows[m].ismonth=false;
	    					dataRows[m].desc=year+"年中";
	    				}else{//年终节点对象
	    					dataRows[m].ismonth=false;
	    					dataRows[m].desc=year+"年终";
	    				}	
	    	     	}
	    			
	    			console.log(dataRows);

	   	    	 	var treeTem=Handlebars.compile($("#timeline-template").html());     
	           	 	cur.$el.find(".reports-timetree").html(treeTem({"months":dataRows}));
	    		 }else{
	    			 m.error(res.msg);
	    		 }
    		 });
	     },
	     transReport:function(obj){//工作报告类型转化成接口需要的字段类型
	    	var reportType="";
        	switch(obj){
	  			case "week":
	  				reportType="WeekReport";
	  				break;
	  			case "month":
	  				reportType="MonthReport"
	  				break;
	  			case "season":
	  				reportType="QuarterReport"
	  				break;
	  			default:
	  				reportType=obj;
	  				break;
			 }
        	return reportType;
	     }
    });
	
	
    var report = function (modulecode, type,monthorweek,val) {
    	mdboss.setLeftMenu(type, modulecode, "noscroll");//刷新左侧菜单
    	mdboss.fillPage(require("text!template/page/workreport/index.html"));
    	new mdboss.View.reportView();
    };
    module.exports = report;

});