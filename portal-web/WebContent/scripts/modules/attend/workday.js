/**
 * 全局搜索
 */
define(function (require, exports, module) {
    var mdboss = require("mdboss");
        $      = require("jquery");
	    require("bootstrap");
	    require("fullcalendar");
    	require("datetimepicker");
    	
    	require("pagination");
    	Dialog = require("dialog");
    	require("validVal")($);
    
    	mdboss.Model.workday= Backbone.Model.extend({
        });
    
    //视图 补签记录
    mdboss.View.workday = Backbone.View.extend({
        el: '#mainContainer',
        events: {
        	'click #workday_set':'workdaySet'//设置工作日及时间 
        },
        workdaySet:function(){
        	var form_data = $("#workday-set" ).triggerHandler( "submitForm" );
	        if ( form_data ) {
	        	var year = $("#year").val();
	        	var start_time = $("#start_time").val();
	        	var end_time = $("#end_time").val();
	        	
	        	if(start_time == ""){
	        		mdboss.notifyTips("上班时间不能为空!");return ;
	        	}
	        	if(end_time == ""){
	        		mdboss.notifyTips("下班时间不能为空!");return ;
	        	}
	        	
	        	var workday = new mdboss.Model.workday({
	        		"usercode": mdboss.usercode, 
	        	    "year": year, 
	        	    "startworktime": start_time, 
	        	    "endworktime": end_time
	        	});
	        	workday.save({},{url: mdboss.api.setupworkday, success:function(m,data){
	        		if(data.rc == 1){
	        			mdboss.notifyTips("工作日设置成功!");
	        			$('#calendar').fullCalendar('refetchEvents');
	        		}else{
	        			mdboss.error(data.msg);
	        		}
	        	},error:function(){
	        		mdboss.error( );
	        	}});
	        }
        },
        workdayUpdate:function(d){ //工作日修改
        	var form_data = $( ".fill_det_all" ).triggerHandler( "submitForm" );
	        if ( form_data ) {
	        	var start_time = $("#work_start_time").val();
	        	var end_time = $("#work_end_time").val();
	        	
	        	if("holiday" == $("#daytype").val()){
	        		if("" == $("#jieriname").val()){
	        			mdboss.notifyTips("请选择节日名称!");return ;
	            	}
	        	}
	        	
	        	var workday = new mdboss.Model.workday({
	        		"usercode": mdboss.usercode, 
	        	    "daytime": $("#dateStr").val(), 
	        	    "daytype": $("#daytype").val(), 
	        	    "dayname": $("#jieriname").val(), 
	        	    "startworktime": start_time, 
	        	    "endworktime": end_time
	        	});
	        	workday.save({},{url: mdboss.api.setupworktime, success:function(m,data){
	        		if(data.rc == 1){
	        			mdboss.notifyTips("工作时间设置成功!");
	        			d.close();
	        			$('#calendar').fullCalendar('refetchEvents');
	        		}else{
	        			mdboss.error(data.msg);
	        		}
	        	},error:function(){
	        		mdboss.error( );
	        	}});
	        }
        },
        toWorkdayUpdate:function(date, allDay, jsEvent, view){ //到修改工作日页面
        	var v_this = this;
        	var dateStr = $.fullCalendar.formatDate(date, "yyyy-MM-dd");
        	
			this.dialog = new Dialog({
				type : "html", value : '<div class="loading"></div>',
				fillCallback : function() {
					$(this).find(".scrollwrapper").jScrollPane();
				}
			}, {
				"title" : "工作时间修改", "width" : "642px", "height" : "240px","icon" : "iconfont icon-mdliucheng",
				"resize" : function() {
					$(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
				}
			}).show(function(){
				var _this = this;
				 var template = Handlebars.compile(require("text!../../../template/page/attendance/workday_update.html"));
				 var html = template({"dateStr":dateStr});
				 $(html).appendTo($(this.dialog).find(".dialog-content")).fadeIn();
				 $(this.dialog).find(".dialog-content-wrap").attr("style","");
				 $(this.dialog).find(".loading").removeClass("loading");
				  
				 
				 $("#daytype").change(function(){
					 if($(this).val()=="holiday"){
						 $("#othercheckexactaddress_").show();
						 $("#work_time").hide();
						 $("#work_kong").show();
						 $("#work_start_time").val("");
						 $("#work_end_time").val("");
					 }else if( $(this).val()=="weekend" ){
						 $("#othercheckexactaddress_").hide();
						 $("#work_time").hide();
						 $("#work_start_time").val("");
						 $("#work_end_time").val("");
						 $("#work_kong").show();
					 }else{
						 $("#othercheckexactaddress_").hide();
						 $("#work_time").show();
						 $("#work_kong").hide();
					 }
				 });
				 $("#work_start_time").datetimepicker({
		        		format: 'hh:ii',
		                autoclose: true,
		                startView:1,
		                language: 'zh-CN',
		                timepicker:true,    //关闭时间选项
		         });
				 $("#work_end_time").datetimepicker({
					 format: 'hh:ii',
					 autoclose: true,
					 startView:1,
					 language: 'zh-CN',
					 timepicker:true,    //关闭时间选项
				 });
				 
				 $(".btn-primary").click(function(){
					 v_this.workdayUpdate(_this);
				 });
				 $(".btn-cancel").click(function(){
					 _this.close();
				 });
				 $( ".fill_det_all" ).validVal();
			});
        },
        initialize: function (data) {
            this.render();
        },
        render: function () {
        	var v_this = this;
        	//添加主要页面
	    	 var template = Handlebars.compile(require("text!../../../template/page/attendance/workday_set_main.html"));
	     	 var html = template();
	     	 $("#j_workflowcenter").html(html); 
	     	
	     	 $('#start_time').datetimepicker({
	     		 format: 'hh:ii',
	     		 autoclose: true,
	     		 startView:1,
	     		 language: 'zh-CN',
	     	 });
	     	 
	     	$('#end_time').datetimepicker({
        		format: 'hh:ii',
                autoclose: true,
                startView:1,
                language: 'zh-CN',
        	});

	    	if($('#calendar').length > 0){
	    		$('#calendar').fullCalendar({
	    			header: {
	    				left: '',//
	    				center: 'title,prev,next' , right: ''//'month,agendaWeek,agendaDay'
	    			},
	    			disableDragging:true,
	    			weekMode:"variable",
	    			buttonText:{
	    				today:'跳转到当天'
	    			},
	    			dayClick: function(date, allDay, jsEvent, view) {
	    				v_this.toWorkdayUpdate(date, allDay, jsEvent, view);
	    			},
	    			editable: false,
//	    			events: "api/calendar/json.json"
    				events: function(start,end, callback) {
    					  var view = $('#calendar').fullCalendar('getView');
    					  var now = view.start;
    					  var dateStr = $.fullCalendar.formatDate(now, "yyyy-MM-dd");
    					 var tmp =  dateStr.split("-");
    					  var year = tmp[0];
    					  var month = tmp[1];
    					  var workday = new mdboss.Model.workday();
    					  workday.save({
    						  "usercode":mdboss.usercode,   //当前操作用户ID
    						   "year": year,
    						   "month":month,
    					  },{url:mdboss.api.queryworkday,success:function(m, data){
    						  if(data.rc==1){

        						  var eventServer =[];
        					      $(data.data.rows).each(function(i, item) {
        					          var color="#ffffff";//背景和边框颜色
        					          var backgroundColor="#ffffff";
        					          var  borderColor= "#ffffff";
        					          var title="";
        					          var rendering=""; //是否有背景
//        					          var color="#360";//背景和边框颜色
        					          var textColor ="#000";
        					          if($(this).attr('daytype') == "holiday"){//节日jieri
        					        	  textColor="red";
        					        	  title= $(this).attr("dayname");
        								  color='#f5f5f5';
        								  backgroundColor:"#f5f5f5";
            					          borderColor:"#f5f5f5";
        					          }else if($(this).attr('daytype') == "weekend"){//节假日
        					        	  textColor="green";
        					        	  title ="周末";
        					        	  color="#f5f5f5";
        					        	  backgroundColor:"#f5f5f5";
          					              borderColor:"#f5f5f5";
        					        	  $("tr td.fc-sat").css('background-color','rgb(252, 232, 232)');//这个是周六的TD
        					        	  $("tr td.fc-sun").css('background-color','rgb(252, 232, 232)');//这个是周日的TD
        					          }else{
        					        	  
        					        	  eventServer.push({
      	    					            start:$(this).attr('daytime')+" 00:00:01",
      	    					            title:"工作日",
      	    					            textColor:"#000000",
      	    					            backgroundColor:backgroundColor,
      	    					            borderColor:borderColor,
      	    					            rendering:rendering,
      	    					            color:color
      	    					          });
        					        	  //workday
        					        	  backgroundColor="#ffffff";
        					              borderColor="#ffffff";
        					        	  textColor="blue",
        					        	  title= $(this).attr("startworktime")  +"-" + $(this).attr("endworktime");
        					          }
        					          eventServer.push({
        					            start:$(this).attr('daytime')+" 09:00:00",
        					            title:title,
        					            textColor:textColor,
        					            backgroundColor:backgroundColor,
        					            borderColor:borderColor,
        					            rendering:rendering,
        					            color:color
        					          });
        					      });
        					      callback(eventServer);
        					  
    						  }else{
    							  mdboss.error(data.msg);
    						  }
    					  },error:function(){
    						  mdboss.error( );
    					  }});
    				},
	    		});
	    		$(".fc-header-right").html(
	    		'<span class="fc-header-black">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;工作日&nbsp;&nbsp;<span class="fc-header-blue">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;工作时间&nbsp;<span class="fc-header-green">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;周末&nbsp;<span class="fc-header-red">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;节日&nbsp;');
	    		$("tr td.fc-sat").css('background-color','rgb(252, 232, 232)');//这个是周六的TD
				$("tr td.fc-sun").css('background-color','rgb(252, 232, 232)');//这个是周日的TD
	    	}
	    	 $("#workday-set").validVal();
        }
    });
});