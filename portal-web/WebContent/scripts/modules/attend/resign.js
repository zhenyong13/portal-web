/**
 * 补签
 */
define(function (require, exports, module) {
    var mdboss = require("mdboss");
        $      = require("jquery");
	    require("bootstrap");
    	require("pagination");
    	Dialog = require("dialog");
    	require("daterangepicker_moment");
    	require("daterangepicker");
    	require("select2");
    	require("mCustomScrollbar");
    
    	
    	 /********************************** 补签 start****************************************************************/
    	  //补签记录
    	    mdboss.Model.attach= Backbone.Model.extend({
    	        url: mdboss.api.querycheckexact    
    	    });    
    	    //提交审核
    	    mdboss.Model.audit= Backbone.Model.extend({
    	    	url: mdboss.api.auditcheckexact    
    	    });    
    	    //删除申请补签
    	    mdboss.Model.deleteapply= Backbone.Model.extend({
    	    	url: mdboss.api.deleteapplycheckexact    
    	    });    
    	    //申请补签
    	    mdboss.Model.applycheckexact = Backbone.Model.extend({
    	    	url: mdboss.api.applycheckexact    
    	    });    
    	    //申请补签
    	    mdboss.Model.signOrg = Backbone.Model.extend({
    	    	url: mdboss.api.orgs    
    	    });
    	    
    	    //视图 补签记录
    	    mdboss.View.attach = Backbone.View.extend({
    	        el: '#mainContainer',
    	        events: {
    	            'keyup #resign_usercode':'filterSearch',//提交搜索
    	        	'keyup #resign_username':'filterSearch',//提交
//    	        	'change #resign_deptcode':'filterSubmit',//提交
    	        	'click .auditstatus':'filterCheckbox',//提交
    	        	'click #resign_search':'filterSubmit',//
    	        	'click .toaudit':'toAudit',//审批
    	        	'click .delete_exact':'deleteExact',//删除申请
    	        	'click #attachSign':'attachSign',//补签申请
    	        	"click .js_export":"data_export", //导出
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
   	        	 }else{
   	        		 parent.find("#parentname").val(treeNode.name);
   	        	 }
   	        	 pview.$el.find("#parentcode").val(treeNode.id);
   	        	 pview.orgcode = treeNode.id;
   	        	 pview.renderData();
   	         },
    	        sorting:function(e){
    	         	this.orderBy = mdboss.sorting(e, this.orderBy);
    	         	this.pageNo =1;
    	         	this.renderData();
    	        },
    	        data_export:function(){
    	        	_this=this;
    	        	seajs.use("sign_export", function () {
    	        		new mdboss.View.signExport({condition:_this.condition});
               	 });
    	        },
    	        initialize: function (data) {
    	    		this.pageNo= 1; 
    	    		this.pageSize= 10; 
    	    		this.totalPage= 5; 
    	    		//搜索条件
    	    		this.usercode="";
    	    		this.username="";
    	    		this.orgcode="";
    	    		this.depname="";
    	    		this.auditstatus="";
//    	    		//审核
    	    		this.checkexactid="";
    	    		this.orderBy="";
    	    		this.condition=new Array();
    	            this.render();
    	        },
    	        submitAttachSign:function(d){//提交申请补签
    	        	var v_this = this;
    	        	if($("#sign_reson").val() == ""){
    	        		mdboss.notifyTips("请填写补签原因！");return;
    	        	}
    	        	if($("#sign_time").val() == ""){
    	        		mdboss.notifyTips("请填写补签时间！");return;
    	        	}
    	        	if($("#checkaddress").val() == ""){
    	        		if($("#othercheckexactaddress").val() == ""){
    	        			mdboss.notifyTips("请填写补签地点！");return;
    	        		}
    	        	}
    	        	var apply = new mdboss.Model.applycheckexact({
    	        	    "usercode": mdboss.usercode, 
    	        	    "username": mdboss.cache.data["getMyInfo"].username, 
    	        	    "orgcode": mdboss.cache.data["getMyInfo"].orgcode, 
    	        	    "orgname": mdboss.cache.data["getMyInfo"].orgname, 
    	        	    "resignindate": $("#sign_time").val(), 
    	        	    "resignintype": $("#sign_type").val(), 
    	        	    "resigninorgcode": $("#checkaddress").val(), 
    	        	    "otherplace": $("#othercheckexactaddress").val(), 
    	        	    "reson": $("#sign_reson").val()
    	        	});
    	        	apply.save({},{success:function(m, data){
    	        		if(data.rc == 1){
    	        			mdboss.notifyTips("申请补签成功！");
    	        			v_this.renderData("f");
    	        			d.close();
    	        		}else{
    	        			mdboss.error("申请补签失败！");
    	        		}
    	        	},error:function(){
    	        		mdboss.error();
    	        	}});
    	        },
    	        attachSign:function(e){
    	        	var _this=this;
    	        	seajs.use("signin", function () {
	        			new mdboss.View.applyattach({
    	   	         		"usercode":mdboss.usercode,
    	   	         		"username":mdboss.cache.data.getMyInfo.username,
    	   	         		"depname":mdboss.cache.data.getMyInfo.orgname,
    	   	         		"depcode":mdboss.cache.data.getMyInfo.orgcode,
    	   	         		"workno":mdboss.cache.data.getMyInfo.workno,
    	   	         		"callbacks":_this.renderData
    	   	         	});
    	   	        });
    	        },
    	        
    	        deleteExact:function(e){//删除申请
    	        	var v_this =this;
    	        	var $this  = $(e.currentTarget);
    	        	var id = $this.attr("vel");
    	        	 mdboss.confirm("你确定要删除吗?", function(c){
    	        		 if(c){
	    	        		var deleteA = new mdboss.Model.deleteapply({ "usercode":mdboss.usercode, "resigninid":id, });
	    	             	deleteA.save({}, {success:function(m, data){
	    	             		if(data.rc == 1){
	    	             			mdboss.notifyTips("删除成功！");
	    	             			this.pageNo = 1;
	    	             			v_this.renderData("f");
	    	             		}else{
	    	             			mdboss.error(data.msg);
	    	             		}
	    	             	},error:function(){
	    	             		mdboss.error( );
	    	             	}});
    	        		 }
    	        	 });
    	        },
    	        submitAudit:function(d){
    	        	var v_this = this;
    	        	if($("#auditopinion").val() == ""){
    	        		mdboss.notifyTips("请输入审核意见！");
    	        		return;
    	        	}
    	        	var auditstate=  $("input[name=auditstate]:checked").val();
    	        	var audit = new  mdboss.Model.audit({
    	        		 "usercode": mdboss.usercode,  "resigninid": this.checkexactid, 
    	        		    "auditopinion": $("#auditopinion").val(), 
    	        		    "auditstate": auditstate
    	        	});
    	        	audit.save({},{success:function(m, data){
    	        		if(data.rc == 1){
    	        			mdboss.notifyTips("审核完成");
    	        			v_this.renderData("f");
    	        			d.close();
    	        		}else{
    	        			mdboss.error("审核失败");
    	        		}
    	        	},error:function(){
    	        		mdboss.error( );
    	        	}});
    	        },
    	        toAudit:function(e){//审核
    	        	var v_this = this;
    	        	var $this  = $(e.currentTarget);
    	        	var id = $this.attr("vel");
    	        	this.checkexactid=id;
    	        	this.dialog = new Dialog({
    					type : "html", value : '<div class="loading"></div>',
    					fillCallback : function() {
    						$(this).find(".scrollwrapper").jScrollPane();
    					}
    				}, {
    					"title" : "补签审核", "width" : "442px", "height" : "240px","icon" : "iconfont icon-mdliucheng",
    					"resize" : function() {
    						$(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
    					}
    				}).show(function(){
    					var _this = this;
    					 var template = Handlebars.compile(require("text!../../../template/page/attendance/retroactive_approval.html"));
    					 var html = template();
    					 $(html).appendTo($(this.dialog).find(".dialog-content")).fadeIn();
    					 $(this.dialog).find(".dialog-content-wrap").attr("style","");
    					 $(this.dialog).find(".loading").removeClass("loading");
    					 
    					 $(".btn-primary").click(function(){
    						 v_this.submitAudit(_this);
    					 });
    					 
    					 $(".js_urgency").click(function(e){
    		    	        	$(e.currentTarget).closest("ul").find("li").each(function(){
    		    	        		var text=$.trim($(this).text());
    		    	        		if(text=="通过"){
    		    	        			$(this).find("label span ").removeClass("labelauty-checked").addClass("labelauty-unchecked");
    		    	        		}
    		    	        		if(text=="不通过"){
    		    	        			$(this).find("label span ").removeClass("labelauty2-checked").addClass("labelauty-unchecked");
    		    	        		} 
    		    	        	});
    		    	        	
    		    	        	var $current=$(e.currentTarget);
    		    	        	var current=$current.text();
    		    	        	if(current=="通过"){
    		    	        		$current.removeClass("labelauty-unchecked").addClass("labelauty-checked");
    		    	    		}else if(current=="不通过"){
    		    	    			$current.removeClass("labelauty-unchecked").addClass("labelauty2-checked");
    		    	    		}
    					 });
    				});
    	        },
    	        renderData:function(t){// 数据列表
    	        	var v_this =this;
    	        	var startTime = $("#start_time").val();
    	            var endTime = $("#end_time").val();
    	            var tmpCondition = new Array();
    	            if(this.usercode != ""){
    	            	tmpCondition.push({"key":"usercode","operate":"EqualTo","v1":this.usercode});
    	            }
    	            if(this.username != ""){
    	            	tmpCondition.push({"key":"orgname", "operate":"EqualTo","v1":this.username});
    	            }
    	            if(this.orgcode != ""){
    	            	tmpCondition.push({"key":"orgcode", "operate":"EqualTo","v1":this.orgcode});
    	            }
    	            if(startTime != "" && endTime != ""){
    	            	tmpCondition.push({"key":"resignintime", "operate":"Between","v1":startTime,"v2":endTime});
    	            }
    	            if(this.auditstatus != ""){
    	            	tmpCondition.push({"key":"auditstatus", "operate":"EqualTo","v1":this.auditstatus});
    	            }
    	            v_this.condition = tmpCondition;
    	        	var search = new mdboss.Model.attach({
    	        			"usercode":mdboss.usercode, 
    	        			"pageNo":v_this.pageNo, 
    	        			"pageSize":v_this.pageSize,    // 每页10条记录
    	        			"queryCondition": v_this.condition,
    	        			"orderBy":v_this.orderBy, 
    	        			"keyword":""       //搜索字段
    	        	 });
    	        	$("#submit-loading").show();
    	        	$("#attach_list").mCustomScrollbar("destroy");
    	        	 search.save({},{success:function(model, data){
    	        		 $("#resultlist-loading").addClass("hide");
    	        		 $("#submit-loading").hide();
    	        		 if(data.rc==1){
    	        			 var template = Handlebars.compile(require("text!template/page/attendance/attach_list.html"));
        	             	 var html = template(data.data.rows);
        	             	 $("#attach_list").html(html);
        	             	 
        	             	$("#attach_list").mCustomScrollbar({scrollButtons:{
         						enable:false }, theme: "darkblue",horizontalScroll:false,
        	             	});
        		         	$("#attach_pagination").empty();
        		         	v_this.totalPage =parseInt(( data.data.total+v_this.pageSize-1)/v_this.pageSize);
    	             		$("#attach_pagination").bs_pagination({ totalPages : v_this.totalPage, currentPage:v_this.pageNo,
    	             			totalRows: data.data.total,
    	             			onChangePage: function(event, data) {
    	             				v_this.pageSize = data.rowsPerPage;
    	             				v_this.pageNo = data.currentPage;
    	             				v_this.renderData("f");
    	             			},
		             			rowsPerPage:v_this.pageSize,
		               			showGoToPage: true,
		   	       				showRowsPerPage : true,
		   	       				showRowsInfo : true,
		   	       				showRowsDefaultInfo : true,	
    	             		});
    	        		 }else{
    	        			 mdboss.error(data.msg);
    	        		 }
    	        	 },error:function(){
    	        		 $("#submit-loading").hide();
    	        		 mdboss.error( );
    	        	 }});
    	        },
    	        filterCheckbox:function(e){
    	        	var $this  = $(e.currentTarget);
    	        	var flag = true;
    	        	if($this.hasClass("icon-checkbox-checked")){
    	        		flag = false;
    	    		}
    	        	$(".auditstatus").each(function(){
    	        		if($(this).hasClass("icon-checkbox-checked")){
    	        			$(this).removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
    	        		}
    	        	});
    	        	var auditstatus = $this.attr("vel");
    	        	if(flag){
    	        		$this.removeClass("icon-checkbox-unchecked").addClass("icon-checkbox-checked");
    	        	}else{
    	        		$this.removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
    	        		auditstatus="";
    	        	}
    		       	 this.pageNo = 1;
    		       	 this.auditstatus = auditstatus;
    		       	 this.renderData("s");
    	        },
    	        filterSearch:function(e){
    	        	if(e.which == 13){
    	        		var keyword=$("#middlePageSearch").val();
    	        		this.usercode = $("#usercode").val();
    	        		this.username = $("#username").val();
    	        		if(keyword == ""){
    	        			mdboss.notifyTips("请输入要搜索的内容"); return;
    	        		}
    	        		this.orgcode = $("#parentcode").val();
    	        		this.pageNo = 1;
    	        		this.renderData("s");
    	        	}
    	        },
    	        filterSubmit:function(e){//提交
    	        	this.orgcode = $("#parentcode").val();
    	        	this.usercode = $("#resign_usercode").val();
    	        	this.username = $("#resign_username").val();
    	        	this.pageNo = 1;
    	        	this.renderData("s");
    	        },
    	        render: function () {
    	        	var v_this = this;
    	        	//添加主要页面
    		    	var template = Handlebars.compile(require("text!template/page/attendance/attach_main.html"));
    		     	var html = template({"dept":this.dept});
    		     	$("#j_workflowcenter").html(html);
//    		     	$("#resign_deptcode").select2({width:'200'});
    		     	$(".daterangepicker").remove();
    		     	$('#start_end_time').daterangepicker({
    	        	},function(start, end, label) {
//    					var startTime = $("input[name=daterangepicker_start]").val();
//    					var endTime = $("input[name=daterangepicker_end]").val();
//    					if(startTime == endTime){
//    						$("#start_time").val(startTime+" 00:00:01");
//        					$("#end_time").val(endTime+" 23:59:59");
//    					}else{
//    						$("#start_time").val(startTime+" 00:00:01");
//        					$("#end_time").val(endTime+" 23:59:59");
//    					}
    					
    					if(start.format('YYYY-MM-DD HH:mm:ss') != end.format('YYYY-MM-DD HH:mm:ss')){
    	        			$("#start_time").val(start.format('YYYY-MM-DD HH:mm:ss'));
    	        			$("#end_time").val(end.format('YYYY-MM-DD HH:mm:ss'));
    	        		}else{
    	        			$("#start_time").val("");
    	        			$("#end_time").val("");
    	        		}
    					v_this.pageNo = 1;
    					v_this.renderData("f");
    	            });
    		     	this.renderData("f");
    	        }
    	    });
    	    
    	    /********************************* 补签 end****************************************************************/
    	   
     
});