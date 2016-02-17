/**
 * 补签
 */
define(function (require, exports, module) {
    var mdboss = require("mdboss");
        $      = require("jquery");
	    require("bootstrap");
    	require("pagination");
    	Dialog = require("dialog");
    	require("mCustomScrollbar");
    	require("daterangepicker_moment");
    	require("daterangepicker");
    	require("select2");
    
    	
	 /********************************** 统计 start****************************************************************/
	//签到统计
    mdboss.Model.attendList= Backbone.Model.extend({
        url: mdboss.api.countcheckinnum   
    });
    
    mdboss.Model.statisDetail= Backbone.Model.extend({
        url: mdboss.api.querycheckindetail 
    });
   
    
    mdboss.Model.attendDetail= Backbone.Model.extend({
        url: mdboss.api.querycheckindetail   
    }); 
    
    /**  统计* */
    mdboss.View.statis=Backbone.View.extend({
    	 el: '#j_workflowcenter',
    	 initialize: function (data) {
    		 	this.template=require("text!template/page/attendance/attendstatis.html");
    		 	this.listTemplate=Handlebars.compile(require("text!template/page/attendance/statislist.html"));
    		 	_this=this;
    		 	this.pageNo=1;
    		 	this.pageSize=10;
    		 	this.totalPage=5;
    		 	this.deptModel=data.deptModel;
    		 	this.condition=new Array();
    		 	this.render();
	        },
	        events:{
	        	 "keydown .js_toolkit_search input[type=text]":"search",//搜索
//	        	 "change #statis_depcode":"deptChange",
	        	 'click .js_search_operate':'searchOrg',//父组织
//	        	 "click .js_attendance_search":"deptChange",
	        	 "click .js_statis_detail":"statisDetail",
	        	 "click .js_export":"data_export", //导出
	        	 'click .js_sort':'sorting',//排序 
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
	        deptChange:function(){
	        	var post=this.getSearch();
	        	if(post!=undefined && post.queryCondition.length>0){
	        		var model=new  mdboss.Model.attendList();
	        		this.pageNo = 1;
	        		model.save(post,{success:function(model,response){
	        			if(response.rc==1){
	        				_this.update_list(response);
	        			}else{
	        				mdboss.error(response.msg);
	        			}
	        		},error:function(){
	        			mdboss.error( );
	        		}});
	        	}else{
	        		//mdboss.notifyTips("请填写搜索条件！");
	        		return false;
	        	}
	        },
	        search:function(e){
	        	if(e.keyCode==13){
	        		var post=this.getSearch();
		        	if(post!=undefined && post.queryCondition.length>0){
		        		var model=new  mdboss.Model.attendList();
		        		this.pageNo = 1;
		        		model.save(post,{success:function(model,response){
		        			if(response.rc==1){
		        				_this.update_list(response);
		        			}else{
		        				mdboss.error(response.msg);
		        			}
		        		},error:function(){
		        			mdboss.error( );
		        		}});
		        	}else{
		        		//mdboss.notifyTips("请填写搜索条件！");
		        	}
	        	}
	        	
	        },
	        update_list:function(response){
	        	var v_this = this;
 				var data=response.data;
 				$("#attendList").mCustomScrollbar("destroy");
 	        	if(data){
 	        		$("#attendList").html(this.listTemplate({"data":data}));
 	        		$("#attendList").mCustomScrollbar({scrollButtons:{
 						enable:false }, theme: "darkblue",horizontalScroll:false,
	             	});
 	        		v_this.totalPage =parseInt(( data.total+v_this.pageSize-1)/v_this.pageSize);
 	        		$("#statis_pagination").bs_pagination({ totalPages :v_this.totalPage,currentPage:v_this.pageNo,
 	        			totalRows: data.total,
 	        			onChangePage: function(event, data) {
 	        				v_this.pageNo = data.currentPage;
 	        				v_this.pageSize = data.rowsPerPage;
 	        				v_this.renderData();
             			},	
             			rowsPerPage:v_this.pageSize,
               			showGoToPage: true,
   	       				showRowsPerPage : true,
   	       				showRowsInfo : true,
   	       				showRowsDefaultInfo : true
 	        		});
 				}
	        },
	        render:function(){
//	        	var dept=this.deptModel.attributes.dept;
	        	this.$el.html(this.template);
	        	_this=this;
	        	var model=new  mdboss.Model.attendList();
	        	 $("#submit-loading").show();
	        	model.save({"usercode":mdboss.usercode,//用户编码
        			"pageNo":this.pageNo,// 第一页
        			"pageSize":mdboss.pageSize,// 每页10条记录
        			"queryCondition":[],// 查询条件
        			"orderBy":this.orderBy
        			},{success:function(model,response){
        				 $("#submit-loading").hide();
        				if(response.rc==1){
        					_this.update_list(response);
        				}else{
        					mdboss.error(response.msg);
        				}
        			},error:function(){
        				 $("#submit-loading").hide();
        				mdboss.error( );
        			}});
//	        	$("#statis_depcode").select2({width:'200'});
	        	$('#starttime').datetimepicker({
	        		format: 'yyyy-mm',
	        		autoclose: true,
	        		startView:3,
	        		language: 'zh-CN',
	        		minView:3,
	        	});
	        	$('#endtime').datetimepicker({
	        		format: 'yyyy-mm',
	                autoclose: true,
	                startView:3,
	                language: 'zh-CN',
	                minView:3,
	        	});
	        },
	        renderData:function(){
	        	var post=this.getSearch();
	        	_this=this;
	        	var model=new  mdboss.Model.attendList();
	        	 $("#submit-loading").show();
	        	model.save(post,{success:function(model,response){
	        		 $("#submit-loading").hide();
	        		if(response.rc==1){
	        			_this.update_list(response);
	        		}else{
	        			mdboss.error(response.msg);
	        		}
	        	},error:function(){
	        		 $("#submit-loading").hide();
	        		mdboss.error();
	        	}});
	        },
	        statisDetail:function(e,data){
	        	var usercode;
	        	var username;
	        	var starttime;
	        	var depname;
	        	var depcode;
	        	var dept=this.deptModel.attributes.dept;
	        	if(data!=undefined){
	        		usercode=data.usercode;
	        		username=data.username;
	        		starttime=data.signinmonth;
	        		depname=data.orgname;
	        		depcode=data.orgcode;
	        	}else{
	        		var record=$(e.currentTarget);
		        	 usercode=record.data("usercode");
		        	 username=record.data("username");
		        	 starttime=record.data("signinmonth");
		        	 depname=record.data("orgname");
		        	 depcode=record.data("orgcode");
	        	}
	        	var year="";
	        	var month="";
	        	if(starttime!=""){
	        		var yearmonth=starttime.split("-");
	        		year=yearmonth[0];
	        		month=yearmonth[1]-1;
	        	}
	        	
	        	_this=this;
	        	_this.avatarcode="";
	        	_this.avatarurl=baseConfig.avatar_default;//默认头像
	        	$('#calendar').html("");
	        	$('#calendar').fullCalendar({
	    			header: {
	    				left: '',//prev,next,today
	    				center: 'title,prev,next',
//	    				right: 'prev,next,today'
	    				right: ''
	    			},
	    			year:year,
	    			month:month,
	    			weekMode:"variable",
	    			buttonText:{
	    				today:'跳转到当天'
	    			},
	    			dayClick: function(date, allDay, jsEvent, view) {
	    	        	seajs.use("signin", function () {
	    	   	         	new mdboss.View.applyattach(
	    	   	         			{"usercode":usercode,"workno":usercode,"username":username,"depname":depname,"depcode":depcode});
	    	   	        });
	    			},
	    			editable: false,
	    			events: function(start,end,callback){
	    				 var view = $('#calendar').fullCalendar('getView');
   					  	 var now = view.start;
	    				var startStr = $.fullCalendar.formatDate(now, "yyyy-MM");
//	    				var endStr = $.fullCalendar.formatDate(end, "yyyy-MM");
	    				var statisDetail=new mdboss.Model.statisDetail();
	    				statisDetail.save({
	    					usercode:mdboss.usercode,
	    					queryusercode:usercode,
//	    					queryusername:username,
	    					queryorgcode:depcode,
//	    					queryorgname:depname,
//	    					positionlevel:depname,
	    					signinmonth:startStr},
	    						{success:function(model,response){
	    	    					if(response.rc==1){
	    								if(response.data!=undefined){
	    					        		_this.avatarcode=response.data.avatarcode;
	    					        		if(_this.avatarcode!=undefined&&_this.avatarcode!=""){
	    					        			_this.avatarurl=baseConfig.avatar_url+_this.avatarcode+"&t="+new Date().getTime();
	    					        			$(".user-avatar_statis").attr("src",_this.avatarurl);
	    					        		}
	    					        	}
	    		    	        		if($('#calendar').length > 0){
	    		        					var data=new Array();
	    		        					$.each(response.data.rows,function(index,item){
	    		        						if(item.detail!=undefined && item.detail!=null && item.detail.length>0){
	    		        							$.each(item.detail,function(i,detail){
	    			        							var color="black";
	    			        							if(detail.signintype=="resignin"){
	    			        								color="blue";
	    			        							}
	    			        							
	    			        							var time=detail.signintime.split(" ");
	    			        							var title=time[1]+""+detail.signinaddress;
	    			        							var work={"title":title,"start":detail.signintime,"textColor":color,"backgroundColor":"white","borderColor":"white"};
	    			            						data.push(work);
	    			        						});
	    		        						}else{
	    		        							if(item.datetype == "workday"){
	    		        								var work={"title":"未签到","start":item.signindate,"textColor":"red","backgroundColor":"white","borderColor":"white"};
	    			            						data.push(work);
	    		        							}
	    		        						}
	    		        						
	    		        						
	    		        					});  
	    		        					callback(data);
	    		    	    	    	}
	    	    					}else{
	    	    						mdboss.error(response.msg);
	    	    					}
	    						},error:function(){
	    							mdboss.error( );
	    	        	}});
	    			}
	    		});
	        	
	        	
	        	$(".fc-header-left").html('<div><img class="travel-avatar user-avatar_statis"  src="'+_this.avatarurl+'"></div><span class="fc-header-left-span">'+username+"</span>");
$(".fc-header-right").html(
		'<span class="fc-header-black">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;签到记录&nbsp;&nbsp;<span class="fc-header-blue">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;补签记录&nbsp;<a class="btn btn-sm j_entityslider-toggle js_export "> <i class="icon-pass iconfont">导出</i></a>');
				$("tr td.fc-sat").css('background-color','rgb(252, 232, 232)');//这个是周六的TD
				$("tr td.fc-sun").css('background-color','rgb(252, 232, 232)');//这个是周日的TD
	        	
	        },
	        getSearch:function(){
	        	var v_this=this;
	        	var usercode=$("#usercode").val();
	        	var username=$("#username").val();
	        	var depcode=$("#parentcode").val();
	        	var starttime=$("#starttime").val();
	        	var endtime=$("#endtime").val();
	        	
	        	if(starttime !="" && endtime!=""){
	        		var a = (Date.parse(starttime) - Date.parse(endtime)) ;
	    			if(a>=0){
	    				mdboss.notifyTips("开始月份需小于结束月份！");
	    				return;
	    			}   
	        	}
	        	if( (starttime =="" && endtime!="")||(starttime !="" && endtime=="") ){
	        		mdboss.notifyTips("起止月份不能为空！");
					return;
	        	}
	        	 var tmpCondition = new Array();
	        	if(usercode!=""){
	        		tmpCondition.push({"key":"usercode","operate":"Like","v1":usercode});
	        	}
	        	if(username!=""){
	        		tmpCondition.push({"key":"username","operate":"Like","v1":username});
	        	}
	        	if(depcode!=""){
	        		tmpCondition.push(  {"key":"orgcode","operate":"EqualTo","v1":depcode});
	        	}
	        	if(starttime!=""&&endtime!=""){
	        		tmpCondition.push({"key":"signinmonth","operate":"Between","v1":starttime,"v2":endtime});
	        	}
	        	v_this.condition = tmpCondition;
	        	var post={"usercode":mdboss.usercode,//用户编码
	        			"pageNo":this.pageNo,// 第一页
	        			"pageSize":this.pageSize,// 每页10条记录
	        			"queryCondition":v_this.condition,// 查询条件
	        			"orderBy":this.orderBy
	        			};
	        	return post;
	        }
    });
	    
    /********************************* 统计 end****************************************************************/
    	   
     
});