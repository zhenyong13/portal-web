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
    
    	
    	 /********************************** 签到查询 start****************************************************************/
    	  //签到查询
    	    mdboss.Model.signquery= Backbone.Model.extend({
    	        url: mdboss.api.queryrealtimecheckin    
    	    });    
    	    
    	    //视图 签到查询
    	    mdboss.View.signquery = Backbone.View.extend({
    	        el: '#mainContainer',
    	        events: {
    	            'keyup #query_usercode':'filterSearch',//提交搜索
    	        	'keyup #query_username':'filterSearch',//提交
    	        	'keyup #signin_address':'filterSearch',//提交
//    	        	'change #query_deptcode':'changeDept',//提交
    	        	'click #query_search':'filterSubmit',//
    	        	"click .js_export":"data_export",
    	        	'click .js_sort':'sorting',//排序 
    	        	'click .js_search_operate':'searchOrg',//父组织
    	        },
    	        searchOrg:function(){//父组织
    	        	 var v_this = this;
    	        	 seajs.use("orgs", function () {
    	  	        	new mdboss.View.orgsView({parent:v_this.$el,"selectOnly":true,
    	  	        		"callbacks":v_this.searchByOrg,"pview":v_this,"title":"部门选择"});
    	  	        });
    	         },
    	         searchByOrg:function(treeNode, parent, pview){//搜索父组织
    	        	 pview.pageNo = 1;
    	        	 if(treeNode.id ==""){
    	        		 parent.find("#parentname").val("");
    	        		 pview.parentcode = "";
    	        		 pview.orgcode = treeNode.id;
    	        	 }else{
    	        		 pview.parentcode = treeNode.id;
    	        		 parent.find("#parentname").val(treeNode.name);
    	        		 pview.parentcode = treeNode.id;
    	        		 pview.orgcode = treeNode.id;
    	        	 }
    	        	 pview.renderData();
    	         },
    	        sorting:function(e){
    	         	this.orderBy = mdboss.sorting(e, this.orderBy);
    	         	this.pageNo =1;
    	         	this.renderData();
    	        },
    	        initialize: function (data) {
    	    		this.dept= data.dept; 
    	    		this.pageNo= 1; 
    	    		this.pageSize= 10; 
    	    		//搜索条件
    	    		this.usercode="";
    	    		this.username="";
    	    		this.orgcode="";
    	    		this.depname="";
    	    		this.auditstatus="";
//    	    		//审核
    	    		this.orderBy=""; 
    	    		this.checkexactid=""; 
    	    		this.totalPage=5;
    	    		this.condition=new Array();
    	            this.render();
    	        },
    	        data_export:function(){
    	        	_this=this;
    	        	seajs.use("sign_export", function () {
    	        		new mdboss.View.signExport({condition:_this.condition});
               	 });
    	        },
    	        renderData:function(){// 数据列表
    	        	_this=this;
    	        	var startTime = $("#start_time").val();
    	            var endTime = $("#end_time").val();
    	            
    	            var tmpCondition = new Array();
    	            if(this.usercode !=""){
    	            	tmpCondition.push({"key":"usercode","operate":"Like","v1":this.usercode});
    	            }
    	            if(this.username !=""){
    	            	tmpCondition.push({"key":"username", "operate":"Like","v1":"%"+this.username+"%"});
    	            }
    	            if(this.orgcode !=""){
    	            	tmpCondition.push({"key":"orgcode", "operate":"EqualTo","v1":this.orgcode});
    	            }
//    	            if( this.$el.find("#signin_address").val() ){
//    	            	tmpCondition.push({"key":"orgcode", "operate":"EqualTo","v1":this.$el.find("#signin_address").val()});
//    	            }
    	            
    	            if(startTime != "" && endTime != ""){
    	            	tmpCondition.push({"key":"signindate", "operate":"Between","v1":startTime,"v2":endTime});
    	            }
    	            _this.condition = tmpCondition;
    	        	var search = new mdboss.Model.signquery({
    	        			"usercode":mdboss.usercode, "pageNo":_this.pageNo, "pageSize":_this.pageSize,    // 每页10条记录
    	        			"queryCondition": _this.condition,
    	        			"orderBy":_this.orderBy,   "keyword":""       //搜索字段
    	        	 });
    	        	console.log(_this.$el.find("#signin_address").val()  );
    	        	 if( _this.$el.find("#signin_address").val() ){
     	            	 search.set("keyword" , _this.$el.find("#signin_address").val());
     	             }
    	        	
    	        	 $("#submit-loading").show();
    	        	$("#attach_list").mCustomScrollbar("destroy");
    	        	 search.save({},{success:function(model, data){
    	        		 $("#submit-loading").hide();
    	        		 if(data.rc==1){
    	        			 $("#resultlist-loading").addClass("hide");
        	        		 var template = Handlebars.compile(require("text!template/page/attendance/query_list.html"));
        	             	 var html = template(data.data.rows);
        	             	 $("#attach_list").html(html);
        		         	
        	             	$("#attach_list").mCustomScrollbar({scrollButtons:{
    	 						enable:false }, theme: "darkblue",horizontalScroll:false,
        	             	});
        		         	 _this.totalPage =parseInt(( data.data.total+_this.pageSize-1)/_this.pageSize);
        		         	 $("#query_pagination").bs_pagination({ 
        		         		totalRows: data.data.total,
        		         		totalPages : _this.totalPage,
        		         		currentPage:_this.pageNo,
        		         		onChangePage: function(event, data) {
        		         			_this.pageNo = data.currentPage;
        		         			_this.pageSize = data.rowsPerPage;
        		         			_this.renderData();
    	             			},
    	             			rowsPerPage:_this.pageSize,
    	               			showGoToPage: true,
    	   	       				showRowsPerPage : true,
    	   	       				showRowsInfo : true,
    	   	       				showRowsDefaultInfo : true	 
        		         	 });
    	        		 }else{
    	        			 $("#submit-loading").hide();
    	        			 mdboss.error(data.msg);
    	        		 }
    	        		
    	        	 },error:function(){
    	        		 mdboss.error( );
    	        	 }});
    	        },
    	        filterSearch:function(e){
    	        	if(e.which == 13){
    	        		var keyword=$("#middlePageSearch").val();
    	        		this.usercode = $("#query_usercode").val();
    	        		this.username = $("#query_username").val();
    	        		if(keyword == ""){
    	        			mdboss.notifyTips("请输入要搜索的内容"); return;
    	        		}
    	        		this.orgcode = $("#parentcode").val();
    	        		this.pageNo = 1;
    	        		this.renderData();
    	        	}
    	        },
//    	        changeDept:function(e){
//    	        	var $this  = $(e.currentTarget);
//    	        	this.orgcode = $this.val();
//     	        	this.pageNo = 1;
//     	        	this.renderData("s");
//    	        },
    	        filterSubmit:function(e){//提交
//    	        	this.orgcode = $("#query_deptcode").val();
    	        	this.pageNo = 1;
    	        	this.renderData("s");
    	        },
    	        render: function () {
    	        	var v_this = this;
    	        	//添加主要页面
    		    	var template = Handlebars.compile(require("text!template/page/attendance/query_main.html"));
    		     	var html = template({"dept":this.dept});
    		     	$("#j_workflowcenter").html(html);
//    		     	$("#query_deptcode").select2({width:'200'});
    		     	$(".daterangepicker").remove();
    		     	$('#start_end_time').daterangepicker({
    	        	},function(start, end, label) {
//    					var startTime = $("input[name=daterangepicker_start]").val();
//    					var endTime = $("input[name=daterangepicker_end]").val();
//    					if(startTime == endTime){
//    						$("#start_time").val(startTime);
//        					$("#end_time").val(endTime);
//    					}else{
//    						$("#start_time").val(startTime);
//        					$("#end_time").val(endTime);
//    					}
    	        		if(start.format('YYYY-MM-DD HH:mm:ss') != end.format('YYYY-MM-DD HH:mm:ss')){
    	        			$("#start_time").val(start.format('YYYY-MM-DD HH:mm:ss'));
    	        			$("#end_time").val(end.format('YYYY-MM-DD HH:mm:ss'));
    	        		}else{
    	        			$("#start_time").val("");
    	        			$("#end_time").val("");
    	        		}
    					v_this.pageNo = 1;
    					v_this.renderData();
    	            });
    		     	
    		     	this.renderData();
    	        }
    	    });
    	    
    	    /********************************* 补签 end****************************************************************/
});