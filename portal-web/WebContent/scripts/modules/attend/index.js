/**
 * 签到查询
 */
define(function (require, exports, module) {
    var mdboss = require("mdboss");
        $      = require("jquery");
	    require("bootstrap");
    	require("pagination");
    	require("mCustomScrollbar");
    	Dialog = require("dialog");
    	require("daterangepicker_moment");
    	require("daterangepicker");
    	require("select2");
    	require("traveldetail");
    
    	
    	 /********************************** 人力首页 start****************************************************************/
    	 
    	 //使用帮助 
        exports.attendindexFun=function(){
//	       	mdboss.fillPage(require("text!template/page/system/cachet/index.html"));
	   		new mdboss.View.indexView();
        };
        
    	 
    	    
    	    //视图 签到查询
    	    mdboss.View.indexView = Backbone.View.extend({
    	        el: '#mainContainer',
    	        events: {
    	        	'change #query_deptcode':'changeDept',//提交
    	        	'click #query_search':'filterSubmit',//
    	        	"click .js-traveldetail":'traveldetail',//出差人数统计详情
    	        	'mouseenter .searchorg':'showSearch',//
    	        	'mouseleave .searchorg':'hideSearch',//
    	        	'keyup #workflow-keywords':'filterSubmit',//
    	        	'click .js_sort':'sorting',//排序 
    	        	'click .js_deptstatis':'jsdeptstatis',//部门统计
    	        	'click #toSyncData':'toSyncData',//数据同步操作
    	        },
    	        toSyncData:function(e){//数据同步操作
	        		var reqData={};
	        		mdboss.submit(reqData,mdboss.api.selectcheckinoutIntoalldaysignin,function(res){
	        			if(res.rc ==1){
	        				mdboss.alert("数据同步成功!");
	        			}else{
	        				mdboss.error(res.msg);
	        			}
	        		},true,null);
    	        },
    	        jsdeptstatis:function(e){//部门统计
    	        	var $this  = $(e.currentTarget);
    	        	var orgcode = $this.data("orgcode");
    	        	this.renderMystatic(orgcode);
    	        },
    	        sorting:function(e){
    	        	this.orderBy = mdboss.sorting(e, this.orderBy);
    	         	this.pageNo =1;
    	         	this.renderData("s");
    	        },
    	        traveldetail:function(e){
    	        	var cur_this=this;
    	        	var current=$(e.currentTarget);
    	        	var orgcode=current.data("orgcode");
    	        	var traveltype=current.data("traveltype");
    	        	new  mdboss.View.traveldetail({"orgcode":orgcode,"startday":this.startDay,"endday":this.endDay,"traveltype":traveltype});
    	        },
//    	        showSearch:function(e){
//    	        	this.$el.find("#workflow-keywords").show();
//    	        },
//    	        hideSearch:function(e){
//    	        	this.$el.find("#workflow-keywords").hide();
//    	        },
    	        initialize: function (data) {
    	        	this.startDay=mdboss.getDate("yyyy-MM"+"-01");
    	        	this.endDay=mdboss.getDate("yyyy-MM-dd");
    	            this.render();
    	            this.module_list_html=$("#module-list-template").html();
    	        	this.$el.find("#start_time").val(this.startDay);
    	        	this.$el.find("#end_time").val( this.endDay);
    	        	this.$el.find("#start_end_time").val(this.startDay+ " 至 "+ this.endDay);
    	        	this.orderBy="";
    	        },
    	        renderAllstatic:function(){//全院统计
    	        	var i_this =this;
    	        	var reqData = {};
    	        	reqData.startday=this.startDay;
    	        	reqData.endday=this.endDay;
    	        	mdboss.reqsubmit(reqData, mdboss.api.allinstitutetravelcountinmonth,function(m,res){
    	        		if(res.rc == 1){
    	        			var num = 0;
    	        			if(res.data.travelusernum)  num = res.data.travelusernum;
    	        			var days = 0;
    	        			if(res.data.traveldays) days = res.data.traveldays; 
    	        			i_this.$el.find("#alloutman").text(num+"人");
    	        			i_this.$el.find("#alloutday").text(days+"人");
    	        		}else{
    	        			mdboss.error(res.msg);
    	        		}
    	        	});
    	        },
    	        renderMystatic:function(orgcode){//我部门统计  
    	        	var i_this =this;
    	        	var reqData = {};
    	        	reqData.startday=this.startDay;
    	        	reqData.endday = this.endDay;
    	        	reqData.orgcode = orgcode;
    	        	mdboss.reqsubmit(reqData, mdboss.api.deptravelcountinmonth,function(m,res){
    	        		if(res.rc == 1){
    	        			i_this.$el.find("#myDept").text(res.data.orgname);
    	        			i_this.$el.find("#myDeptDate").text(res.data.startday +" 至 "+res.data.endday);
    	        			var num = 0;
    	        			if(res.data.myorgtravelusernum)  num = res.data.myorgtravelusernum;
    	        			i_this.$el.find("#myDeptNum").text(num);
    	        			var days = 0;
    	        			if(res.data.myorgusertraveldays) days = res.data.myorgusertraveldays; 
    	        			i_this.$el.find("#myDeptDay").text(days);
    	        			
    	        			var num = 0;
    	        			if(res.data.tomyorgtravelusernum)  num = res.data.tomyorgtravelusernum;
    	        			i_this.$el.find("#toMyDeptNum").text(num+"人");
    	        			var days = 0;
    	        			if(res.data.tomyorgusertraveldays) days = res.data.tomyorgusertraveldays; 
    	        			i_this.$el.find("#toMyDeptDay").text(days+"天");
    	        			//
    	        		}else{
    	        			mdboss.error(res.msg);
    	        		}
    	        	});
    	        },
    	        renderData:function(t){// 数据列表
    	        	q_this=this;
    	        	$("#attach_list").mCustomScrollbar("destroy");
    	        	$("#attach_list").empty();
    	        	
    	        	if(t){
    	        	}else{
    	        		this.renderAllstatic();
    	        		if(mdboss.getUserinfo())
    	        			this.renderMystatic(mdboss.getUserinfo().orgcode);
    	        	}
    	            
    	        	var reqData={};
	        		if(this.$el.find("#workflow-keywords").val()){
	        			reqData.orgname= this.$el.find("#workflow-keywords").val();
	        		}
	        		
	        		reqData.startday=this.startDay;
	        		reqData.endday=this.endDay;
	        		
//    	        	reqData.orderBy = q_this.orderBy;
    	        	mdboss.submit(reqData, mdboss.api.querytravelstatistic,function(res){
    	        		if(res.rc == 1){
    	        			var template = Handlebars.compile(q_this.module_list_html);
    	        			var orgtotalusernum= 0;    //部门总人数
    	        			var myorgtravelusernum= 0;   //我部出差人数
    	        			var myorgusertraveldays= 0;   //我部出差天数
    	        			var tomyorgtravelusernum= 0;  //到我部出差人数
    	        			var tomyorgusertraveldays= 0;  //到我部出差天数
    	        			var tmpl = res.data.rows;
    	        			for(var i=0; i<tmpl.length; i++){
    	        				orgtotalusernum += tmpl[i].orgtotalusernum;
    	        				myorgtravelusernum += tmpl[i].myorgtravelusernum;
    	        				myorgusertraveldays += tmpl[i].myorgusertraveldays;
    	        				tomyorgtravelusernum += tmpl[i].tomyorgtravelusernum;
    	        				tomyorgusertraveldays += tmpl[i].tomyorgusertraveldays;
    	        			}
    	        			
    	        			q_this.$el.find("#orgtotalusernum").text(orgtotalusernum);
    	        			q_this.$el.find("#myorgtravelusernum").text(myorgtravelusernum);
    	        			q_this.$el.find("#myorgusertraveldays").text(myorgusertraveldays);
    	        			q_this.$el.find("#tomyorgtravelusernum").text(tomyorgtravelusernum);
    	        			q_this.$el.find("#tomyorgusertraveldays").text(tomyorgusertraveldays);
    	        			
        	             	var html = template({"staticlist":res.data.rows});
        	             	$("#attach_list").html(html);
    	        			$("#attach_list").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false });
    	        		}else{
    	        			mdboss.error(res.msg);
    	        		}
    	        	},true,null);
    	        	
    	        },
    	        filterSubmit:function(e){//提交
    	        	if(e.type =="keyup" ){
    	        		if( e.which ==13){
    	        			if(this.$el.find("#workflow-keywords").val()){
    	        				this.renderData("s" );
    	    	        	}
    	        		}
    	        	}else{
    	        		if(this.$el.find("#workflow-keywords").val()){
	        				this.renderData( "s" );
	    	        	}
    	        	}
    	        },
    	        render: function () {
    	        	var v_this = this;
    	        	//添加主要页面
    		     	$("#j_workflowcenter").html(require("text!template/page/attendance/index.html"));
    		     	$(".daterangepicker").remove();
    		     	$('#start_end_time').daterangepicker({
    	        	},function(start, end, label) { 
    	        		if(start.format('YYYY-MM-DD HH:mm:ss') != end.format('YYYY-MM-DD HH:mm:ss')){
    	        			v_this.startDay=start.format('YYYY-MM-DD');
    	        			v_this.endDay=end.format('YYYY-MM-DD');
    	        		}else{
    	        			return;
    	        		}
    					v_this.renderData();
    	            });
    		     	
    		     	//判断是否显示同步数据 操作
    		     	mdboss.reqsubmit({},mdboss.api.showcheckinoutsynchrooperate,function(m,res){
    		     		if(res.rc == 1){
    		     			if(res.data.show){
    		     				v_this.$el.find("#syncDataShow").show();
    		     				
    		     			}
    		     		}
    		     	});
    		     	
    		     	
    		     	
    		     	$('#syncTime').daterangepicker({
    		     		"showDropdowns": true,
     					"timePicker": true,
     				    "timePicker24Hour": true,
     				    "timePickerIncrement": 1,
     				    "timePickerSeconds": true,
     					locale:{
     						"format":"YYYY-MM-DD HH:mm:ss",
     					}
    		     	},function(start, end, label) { 
    		     	});
    		     	
    		     	this.renderData( );
    	        }
    	    });
    	    
    	    /********************************* 首页 end****************************************************************/
});