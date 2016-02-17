/**
 * Created by jahon on 15/5/10.
 */
define(function (require, exports, module) {
    var mdboss = require("mdboss");
        Livebg = require("livebg");
        util   = require("util");
        $      = require("jquery");
        md5 = require("md5");
        Dialog = require("dialog");
    	require("pagination");
    	require("formsFun");
    	require("bootstrap");
    	require("daterangepicker_moment");
    	require("daterangepicker");
    	var workflowlist = require("workflowlist");
    	var formlist = require("workformlist");
    	var formitemlist = require("workformitemlist");
    	var stepinfolist = require("stepinfolist");
    
	var $page = mdboss.$pageWrap;
	
	//右侧菜单的伸缩
    $(document).on("click",".j_leftViewCtrl",function(e){
    	 var $current=$(e.currentTarget);
    	 if($current.hasClass("on")){ //显示
    		 $current.removeClass("on");
    		 $current.attr("title","显示");
    		 $("#j_workflowright").animate({width: "0px"},10);
    	 }else{ //隐藏
    		 $current.addClass("on");
    		 $current.attr("title","隐藏");
    		 $("#j_workflowright").animate({width: "350px"},10);
    	 }
    });
    
	//公文提醒 批量提醒
	 $page.on("click", ".workflow-reminds", function(e) {
		 var $this  = $(e.currentTarget);
	     var processinstcode = $this.attr("vel");
	     var taskcode = $this.data("taskcode");
		 seajs.use(["remind"],function(remind){
			rd =  new mdboss.View.processRemind({model:new mdboss.Model.processRemind({
				"processinstcode":processinstcode,
				"taskcode":taskcode
				})
			});
		 });
	 });
	 //排序
	
     // 鼠标经过出现搜索框
//    $page.on("mouseenter", ".icon-search", function() {
//    	$("#workflow-keywords").css('display','inline-block'); 
//    	$("#workflow-keywords").css('width','98px'); 
//    	$("#workflow-keywords").focus();
//    });
    // 鼠标离开隐藏搜索框
//    $page.on("mouseleave", "#workflow-keywords", function() {
//    	$("#workflow-keywords").css('display','none'); 
//    }); 
  
    //删除公文 start 
    mdboss.Model.deleteProcess= Backbone.Model.extend({
        url: mdboss.api.delete_process      
    });
    
//    $page.on("click",'.delete-process-toggle',function(e){});
    //删除公文 end
    
    
    mdboss.Model.process = Backbone.Model.extend({
        url: '',
        initialize: function () {
        },

        aboutMe: function () {
            return "";
        }
    });

   
    mdboss.View.process = Backbone.View.extend({
        el: '#mainContainer',
        events: {
           // 'click #create-process': 'createProcess',
            'click .watch':'processWatch',//公文关注-取消
            'click .delete-process-toggle':'deleteProcess',//公文删除
            'click .delete-process-share':'deleteShareProcess',//取消共享给我的公文
            'click #check-all':'checkBoxAll',
//            'click #nav_list_process_pagination li':'page',//分页
//            'click #nav_list_process_pagination_sub li':'subPage',//分页
            'keypress .typehead':'filterInput',//获取筛选项
            'keypress #workflow-keywords':'keywords',//排序
            'click #workflow-keywords-search':'keywords',//排序
            'click .orderType':'orderItem',//排序
            'click .filter-item':'filterItemSelect',//选中与取消
        	'click .filter-submit':'filterSubmit',//提交
        	'click .filter-cancle':'filterCancel',//取消
        	'click #workflowTitle':'myworkflow',//我的公文统计
        	'click #deptflowTitle':'deptworkflow',//部门公文统计
        	'click #deanflowTitle':'deanworkflow',//院内公文统计
        },
        deleteShareProcess:function(e){//取消共享给我的公文
        	var v_this = this;
         	var $this  = $(e.currentTarget);
         	var processinstcode = $this.attr("vel");
         	mdboss.reqsubmit({"usercode":mdboss.usercode,"processinstcode":processinstcode},mdboss.api.deleteProcessinstanceSharedtome,function(m,res){
         		if(res.rc == 1){
         			mdboss.alert("删除成功！");
         			v_this.renderData();
         		}else{
         			mdboss.error(res.msg);
         		}
         	});
        },
        deleteProcess:function(e){//删除公文
        	var v_this = this;
         	var $this  = $(e.currentTarget);
         	var processinstcode = $this.attr("vel");
         	mdboss.confirm("您确定要删除吗？",function(c){
         		if(c){
         			var dp = new mdboss.Model.deleteProcess({"usercode":mdboss.usercode,"processinstcode":processinstcode});
             		dp.save({},{success:function(m,d){
             			if(d.rc == "1"){
             				mdboss.notifyTips("删除成功！");
             				v_this.renderData();
             				//$("#tr_id_"+processinstcode).remove();
             			}else{
             				mdboss.error(d.msg);
             			}
             		},error:function(){
             			mdboss.error();
             		}});
         		}
         	});
        
        },//删除公文
        showHide:function(t,f){
        	if(t == "my"){
        		$("#workflowTitle").addClass("active");
        		$("#deptflowTitle").removeClass("active");
        		$("#deanflowTitle").removeClass("active");
        	}else if(t == "dept"){
        		$("#workflowTitle").removeClass("active");
        		$("#deptflowTitle").addClass("active");
        		$("#deanflowTitle").removeClass("active");
        	}else{
        		$("#workflowTitle").removeClass("active");
        		$("#deptflowTitle").removeClass("active");
        		$("#deanflowTitle").addClass("active");
        	}
        	$(".workflowchart-wrap").addClass("hide");
        	$("#"+f).removeClass("hide");
        },
        myworkflow:function(e){//我的公文统计
        	var v_this = this;
        	v_this.showHide("my","myworkflow");
        },
        deptworkflow:function(e){//部门公文统计
        	var v_this = this;
        	v_this.showHide("dept","deptworkflow");//
        	
    		var commonModel = new mdboss.Model.commonModel();
    		commonModel.save({"usercode":mdboss.usercode},
    				{url:mdboss.api.deptProcessCount,success:function(m,response){
    				if(response.rc == 1){
    					var todoName = new Array();
    					var todoValue = new Array();
    					var overdueName = new Array();
    					var overdueValue = new Array();
    					var todo= response.data.todostatisticinfo;
    					//按照taskcount排序
    		            var todoOrder = todo.sort(  function(a, b)
    		                {
    		                    if(a.taskcount < b.taskcount) return 1;
    		                    if(a.taskcount > b.taskcount) return -1;
    		                    return 0;
    		                }
    		            );
    		            $.each(todoOrder, function(index, item)
    		                {
	    		            	todoName.push(item.username);
								todoValue.push(item.taskcount);
    		                }
    		            );
    					var overdue = response.data.overduestatisticinfo;
    					//按照taskcount排序
    		            var overdueOrder = overdue.sort(  function(a, b)
    		                {
    		                    if(a.taskcount < b.taskcount) return 1;
    		                    if(a.taskcount > b.taskcount) return -1;
    		                    return 0;
    		                }
    		            );
    		            $.each(overdueOrder,  function(index, item)
    		                {
        		            	overdueName.push(item.username);
    							overdueValue.push(item.taskcount);
    		                }
    		            );
    		//------------------------------- 部门
    		var myChart = echarts.init(document.getElementById('deptworkflow'));
    					  var option = {
    							legend: {
    				              orient: 'horizontal',
    				              x:'left',
    				              selectedMode:'single',
    				              selected:{
    				                  '逾期公文':false
    				              },
    				              data:['待办公文','逾期公文']  
    				          },
    						tooltip : {  trigger: "item", formatter: "{a} <br/>{b} : {c} ",transitionDuration:1, },
    				        yAxis : [
    				            { show:false,  type : 'value' }
    				        ],
    				        xAxis : [  {
				            	name:"待办公文",
				                type : 'category',
				                show: false,
				                boundaryGap : true,
				                data : todoName
				            }   ],
    				        toolbox: {
    				            show: true,
    				            feature: {
    				                dataView: {show: true, readOnly: false},
    				                restore: {show: true},
    				                saveAsImage: {show: true},
    				            }
    				        },
    				        grid: {
    				        	 borderWidth: 0, x:20, x2:20,  y:80,   y2:10, width:"90%"
    				        },
    				        series : [
    				            {
    				                name:'待办公文',
    				                type:'bar',
    				                barCategoryGap:"40%",
    				                itemStyle : {
    				                    normal: {
    				                        color: function(params) {
    				                            var colorList = [
    				                                '#FFC000','#00B0F0','#92D050','#A6A6A6','#27727B',
    				                                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
    				                                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
    				                            ];
    				                            return colorList[params.dataIndex];
    				                        },
    				                        label: {
    				                            show: true,
    				                            formatter: '{b}\n{c}'
    				                        }
    				                    }
    				                },
    				                data:todoValue
    				            },
    				            {
    				                name:'逾期公文',
    				                type:'bar',
    				                barCategoryGap:"40%",
    				                itemStyle : {
    				                    normal: {
    				                        color: function(params) {
    				                            var colorList = [
    				                                '#FFC000','#00B0F0','#92D050','#A6A6A6','#27727B',
    				                                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
    				                                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
    				                            ];
    				                            return colorList[params.dataIndex];
    				                        },
    				                        label: {
    				                            show: true,
    				                            formatter: '{b}\n{c}'
    				                        }
    				                    }
    				                },
    				                data:overdueValue
    				            
    				            }
    				        ]
    					  };
    				    	                    
    				    myChart.setOption(option);
    				    myChart.on("legendSelected", function (param){
    				        var selected = param.selected;
    				        if (selected['逾期公文']) {
    				        	 option.xAxis[0].data=overdueName;
    				             option.series[0].data =overdueValue;
    				             option.legend.selected= { '逾期公文':true ,"待办公文": false};
    				             myChart.clear();
    				             myChart.setOption(option);
    				        }else{
    				        	option.xAxis[0].data=todoName;
    				            option.series[0].data =todoValue;
    				            option.legend.selected= { '逾期公文':false ,"待办公文": true};
    				            myChart.clear();
    				            myChart.setOption(option);
    				        }
    				    });
    				    
    				    myChart.on("click", function(param){
    				    	//待办公文 
    				    	$.each(todo, function(i, item){
    				    		if(item.username == param.name){
    				    			if(item.isshow == "yes"){//下属待办
    				    				window.location.href ="#process/sub-todo/"+item.usercode;
    				    			}
    				    			if(item.usercode == mdboss.usercode){//我的待办
    				    				window.location.href ="#process/my-todo";//我的待办
    				    			}
    				    		}
    				    	});
    				    	//逾期公文 
    				    	$.each(overdue, function(i, item){
    				    		if(item.username == param.name){
    				    			if(item.isshow == "yes"){//下属逾期
    				    				window.location.href ="#process/sub-todo/"+item.usercode;
    				    			}
    				    			if(item.usercode == mdboss.usercode){//我的逾期
    				    				window.location.href ="#process/my-todo";//我的待办
    				    			}
    				    		}
    				    	});
                        });
    		//-------------------------------
    				}else{
    					mdboss.error(response.msg);
    				}//end if 	
    		},error:function(){
    			mdboss.error( );
    		}});
        },
        deanworkflow:function(e){//院内公文统计
        	var v_this = this;
        	v_this.showHide("dean","deanworkflow");
    		var commonModel = new mdboss.Model.commonModel();
    		commonModel.save({"usercode":mdboss.usercode},
    				{url:mdboss.api.deanProcessCount,success:function(m,response){

        				if(response.rc == 1){
        					var todoName = new Array();
        					var todoValue = new Array();
        					var overdueName = new Array();
        					var overdueValue = new Array();
        					var todo= response.data.todostatisticinfo;
        					//----排序
        					//按照taskcount排序
        		            var sidOrder = todo.sort( function(a, b)
        		                {
        		                    if(a.taskcount < b.taskcount) return -1;
        		                    if(a.taskcount > b.taskcount) return 1;
        		                    return 0;
        		                }
        		            );
        		            $.each(sidOrder,   function(index, item)
        		                {
	        		            	todoName.push(item.orgname);
	    							todoValue.push(item.taskcount);
	    							if(index==0) todoTackCount = item.taskcount;
        		                }
        		            );
        					//----排序
        					var overdue = response.data.overduestatisticinfo;
        					//按照taskcount排序
        		            var overdueOrder = overdue.sort( function(a, b)
        		                {
        		                    if(a.taskcount < b.taskcount) return -1;
        		                    if(a.taskcount > b.taskcount) return 1;
        		                    return 0;
        		                }
        		            );
        		            $.each(overdueOrder,  function(index, item)
        		                {
	        		            	overdueName.push(item.orgname);
	    							overdueValue.push(item.taskcount);
	    							if(index==0) overdueTackCount = item.taskcount;
        		                }
        		            );
        		//-------------------------------
        		var myChart = echarts.init(document.getElementById('deanworkflow'));

        					  var option = {
        							legend: {
        				              orient: 'horizontal',
        				              x:'left',
        				              selectedMode:'single',
        				              selected:{
        				                  '逾期公文':false
        				              },
        				              data:['待办公文','逾期公文']  
        				          },
        						tooltip : {  trigger: "item", formatter: "{a} <br/>{b} : {c} ",transitionDuration:1, },
        				        yAxis : [
        				            {
        				            	name:"待办公文",
        				                type : 'category',
        				                show: false,
        				                boundaryGap : true,
        				                data : (function (){
        				                    return todoName;
        				                })()
        				            } 
        				        ],
        				        xAxis : [  { show:false,  type : 'value' } ],
        				        toolbox: {
        				            show: true,
        				            feature: {
        				                dataView: {show: true, readOnly: false},
        				                restore: {show: true},
        				                saveAsImage: {show: true},
        				            }
        				        },
        				        grid: {
        				        	borderWidth: 0, x:0, x2:10,  y:40,   y2:10, height:"90%",width:"80%"
        				        },
        				        series : [
        				            {
        				                name:'待办公文',
        				                type:'bar',
        				                barCategoryGap:"80%",//80%
        				                itemStyle : {
        				                    normal: {
        				                        color: function(params) {
        				                            var colorList = [
        				                                '#27727B','#A6A6A6','#92D050','#00B0F0','#FFC000',
        				                                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
        				                                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
        				                            ];
        				                            return colorList[params.dataIndex];
        				                        },
        				                        label: {
        				                            show: true,
        				                            position: 'top',//top
        				                            textStyle:{
        				                            	color:['#27727B','#A6A6A6','#92D050','#00B0F0','#FFC000'],
        				                            	align:'left',
        				                            	baseline:"middle"
        				                            },
        				                            formatter: '{b}:{c}'
        				                        }
        				                    }
        				                },
        				                data:todoValue
        				            },
        				            {
        				                name:'逾期公文',
        				                type:'bar',
        				                barCategoryGap:"80%",//80%
        				                itemStyle : {
        				                    normal: {
        				                        color: function(params) {
        				                            var colorList = [
        				                                '#27727B','#A6A6A6','#92D050','#00B0F0','#FFC000',
        				                                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
        				                                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
        				                            ];
        				                            return colorList[params.dataIndex];
        				                        },
        				                        label: {
        				                            show: true,
        				                            position: 'top',//top inside
        				                            textStyle:{
        				                            	color:['#27727B','#A6A6A6','#92D050','#00B0F0','#FFC000'],
        				                            	align:'left',
        				                            	baseline:"middle"
        				                            },
        				                            formatter: '{b}:{c}'
        				                        }
        				                    }
        				                },
        				                data:overdueValue
        				            }
        				        ]
        					  };
        				    	                    
        				    myChart.setOption(option);
        				    myChart.on("legendSelected", function (param){
        				        var selected = param.selected;
        				        if (selected['逾期公文']) {
        				        	 option.xAxis[0].data=overdueName;
        				             option.series[0].data =overdueValue;
        				             option.legend.selected= { '逾期公文':true ,"待办公文": false};
        				             myChart.clear();
        				             myChart.setOption(option);
        				        }else{
        				        	option.xAxis[0].data=todoName;
        				            option.series[0].data =todoValue;
        				            option.legend.selected= { '逾期公文':false ,"待办公文": true};
        				            myChart.clear();
        				            myChart.setOption(option);
        				        }
        				    });
        		//-------------------------------院内公文统计
        				}else{
        					mdboss.error(response.msg);
        				}//end if 	
    				},error:function(){
    	    			mdboss.error();
    	    		}});
        },
        processWatch:function(e){//公文关注-取消 
        	var v_this = this;
        	var $this  = $(e.currentTarget);
        	var processinstcode = $this.attr("data-id");
        	var watched = $this.attr("watched");//true 取消关注, false 关注
        	//关注
        	if(watched == "false"){
        		var processWatch =new mdboss.Model.commonModel({"usercode":mdboss.usercode,"processinstcode":processinstcode,"type":"watched"});
        		processWatch.save({},{url:mdboss.api.taskWatch,success: function (model,data) {
        			if(data.rc == "1"){
        				mdboss.notifyTips("关注成功");
        				v_this.renderData();
        			}else{
        				mdboss.error(data.msg);
        			}
        		},error:function(){
        			mdboss.error();
        		}});
        	}else{
        		//取消关注  
        		var cancelwatch =new mdboss.Model.commonModel({"usercode":mdboss.usercode,"processinstcode":processinstcode,"type":"cancel"});
        		cancelwatch.save({},{url:mdboss.api.taskWatch,success: function (model,data) {
        			if(data.rc == "1"){
        				mdboss.notifyTips("取消关注成功");
        				v_this.renderData();
        			}else{
        				mdboss.error(data.msg);
        			}
        		},error:function(){
        			mdboss.error( );
        		}});
        	}
        
        },
        initialize: function (data) {
        	var v_this =this;
           // _.bindAll(this, 'createProcess', 'render');
        	v_this.rdata=data;
        	Array.prototype.indexOf = function (val) {  
    		    for (var i = 0; i < this.length; i++) {  
    		        if (this[i] == val) {  
    		            return i;  
    		        }  
    		    }  
    		    return -1;  
    		};  
    		Array.prototype.remove = function (val) {  
    		    var index = this.indexOf(val);  
    		    if (index > -1) {  
    		        this.splice(index, 1);  
    		    }  
    		};  
    		
    		//this.el="#mainContainer";
    		this.managers=new Array();//申请人
    		this.comments=new Array();//公文
    		this.projects=new Array();//项目
    		this.tags=new Array();//标签
    		this.orderBy= "";//排序  starter/按发起人排序  starttime/按发起时间排序 createtime/按接收时间排序
    		this.keyword= ""; 
    		this.pageNo= 1; 
    		this.pageSize= 10; 
    		this.subPageSize= 10; 
    		this.subPageNo= 1; 
    		this.totalPage= 5; 
    		this.subTotalPage= 5; 
    		var totalPage =parseInt(( v_this.rdata.totalPages+v_this.pageSize-1)/v_this.pageSize);
        	$("#process_pagination").bs_pagination({
    			totalPages : totalPage,
    			currentPage:1,
     			onChangePage: function(event, data) {
         			v_this.pageNo = data.currentPage;
         			v_this.pageSize = data.rowsPerPage;
         			v_this.renderData("my");
     			},
     			totalRows:v_this.rdata.totalPages,
     			rowsPerPage:v_this.pageSize,
       			showGoToPage: true,
  				showRowsPerPage : true,
  				showRowsInfo : true,
  				showRowsDefaultInfo : true
        	});
        	//
        	if(data.subTotalPages!=0){
        		totalPage =parseInt(( v_this.rdata.subTotalPages+v_this.subPageSize-1)/v_this.subPageSize);
	    		$("#process_pagination_sub").bs_pagination({
	    			totalPages : totalPage, currentPage:1,
	    			onChangePage: function(event, data) {
             			v_this.subPageNo = data.currentPage;
             			v_this.subPageSize = data.rowsPerPage;
             			v_this.renderData("sub");
         			},
         			totalRows:v_this.rdata.subTotalPages,
         			rowsPerPage:v_this.subPageSize,
           			showGoToPage: true,
      				showRowsPerPage : true,
      				showRowsInfo : true,
      				showRowsDefaultInfo : true
	    		}); 
        	}
    		
            this.render();
            this.renderSearch();
        },
        renderData:function(e){// 数据列表
//        	console.log("====render data================================="+e); 
        	var v_this = this;
        	var b = this;
            var type=v_this.rdata.processType;
            var dataApi=dataSourceMap[type]["api"];
            
            var orderBy_ = "starttime desc";
            if(b.orderBy){
            	orderBy_ = b.orderBy ;//+ ",starttime desc");
            }
            if("draft" == type && orderBy_.indexOf("starttime")>=0){
            	orderBy_="createtime desc";
            }
            var startTime = $("#start_time").val();
            var endTime = $("#end_time").val();
            
    		var creator = new Array();;//申请人
    		for(var l=0;l<b.managers.length;l++){ creator.push(b.managers[l]); }
    		var processes = new Array();//公文
    		for(var l=0;l<b.comments.length;l++){ processes.push(b.comments[l]); }
    		var projects =  new Array();//项目
    		for(var l=0;l<b.projects.length;l++){projects.push(b.projects[l]); }
//    		var tags = new Array();//标签
//    		for(var l=0;l<b.tags.length;l++){ tags.push(b.tags[l]); }
    		
    		var condition=new Array();
    		if(startTime!=""&&endTime!=""){
    			condition.push({"key":"starttime","operate":"Between","v1":startTime,"v2":endTime});//接收时间
    		}
    		if("my-finshed" != type){
	    		if(creator.length>0){
	    			condition.push({"key":"starter","operate":"In","v1":creator});//发起人列表
	    		}
    		}
    		if(processes.length>0){
    			condition.push( {"key":"processcode","operate":"In","v1":processes}); //公文列表 
    		}
    		if(projects.length>0){
    			condition.push({"key":"projectcode","operate":"In","v1":projects}); //项目列表
    		}
//    		if(tags>0){
//    			condition.push( {"key":"mytags","operate":"In","v1":tags});//标签列表
//    		}
    		if(b.keyword){
    			condition.push( {"key":"title","operate":"Like","v1":b.keyword});//关键字搜索
    		}
    		if(v_this.rdata.assignee)//下属待办
    			condition.push({"key":"assignee","operate":"EqualTo","v1":v_this.rdata.assignee});//当前处理人
    		//-----------------------------------------------
            var  requrl = [{ "name":dataApi,  "post":{
                usercode:mdboss.usercode, pageNo:b.pageNo,  pageSize:b.pageSize,    
                queryCondition:condition,
                orderBy: orderBy_
            }, "cache":false}] ;
            
            if(type =="my-finshed"){
	          	requrl = [{ "name":dataApi, "post":{"starter":creator,
	                usercode:mdboss.usercode, pageNo:b.pageNo,  pageSize:b.pageSize,    
	                queryCondition:condition, orderBy: orderBy_ 
	            }, "cache":false}] ;
            }
            $("#submit-loading").show();
    		if(type == "all-todo"){
	    		 //默认请求 所有
	             requrl = [{ "name":"queryMyTaskTodo",  "post":{
	                usercode:mdboss.usercode,//用户编码
	                "type":"all",
	                taskstatus:"todo",  pageNo:b.pageNo,  pageSize:b.pageSize,    // 每页10条记录
	                queryCondition:condition, // 查询条件
	                orderBy: orderBy_
	            },
	            "cache":false},
	            { "name":"querySuborditnatesTaskTodo",  "post":{
	                usercode:mdboss.usercode,//用户编码
	                taskstatus:"todo", pageNo:b.pageNo,  pageSize:b.subPageSize,    // 每页10条记录
	                queryCondition: condition,// 查询条件
	                orderBy: orderBy_
	            },
	            "cache":false}
	            ] ;
	            //所有公文 
	            if(e == "my"){
	          	  requrl=  [ {   "name":"queryMyTaskTodo",
	  	                "post":{
	  	                    usercode:mdboss.usercode, pageNo:b.pageNo,   pageSize:b.pageSize,  queryCondition: // 查询条件
	  	                    condition,  orderBy:orderBy_, keyword:"" 
	  	                },  "cache":false} //我的待办
	                 ];
	            }else if(e=="sub"){//下属的分页
	            	 requrl=  [ 
	                   {   "name":"querySuborditnatesTaskTodo",
	                       "post":{ usercode:mdboss.usercode, pageNo:b.subPageNo,  pageSize:b.subPageSize, queryCondition: // 查询条件
	                           condition, orderBy:orderBy_,  keyword:""
	                       }, "cache":false}//下属待办
	                  ];
	            }
    		}
    		//-----------------------------------------------
    		
    		//页面添充及 分页重置
            mdboss.getReady({ data: requrl, template: ["processList","myWatched"] }, function (result, msg) {
                if (result) {
                	$("#submit-loading").hide();
                    if(type=="all-todo"){
                    	if(e=="my"){//我的待办公文
                    	    templateMy= Handlebars.compile(result.template["processList"]);
                        	var html = templateMy({"type":"my-todo","processList":result.data['queryMyTaskTodo'].rows});
                        	$("#flowlist-container").html(html);
//                        	if(v_this.pageNo%5 == 0 && result.data['queryMyTaskTodo'].rows.length>0){
//        	             		v_this.totalPage+=5;
//        		         	 }
//        		         	 if(result.data['queryMyTaskTodo'].rows.length==0){
//        		         		if(v_this.totalPage>5)
//        		         			v_this.totalPage-=5;
//        		         	 }
//        		         	 if(v_this.pageNo ==1){
//        		         		v_this.totalPage =5;
//        		         	 }
        		         	v_this.totalPage =parseInt((result.data['queryMyTaskTodo'].total+v_this.pageSize-1)/v_this.pageSize);
        		         	 if(result.data['queryMyTaskTodo'].rows.length>0)
	            	        	$("#process_pagination").bs_pagination({ totalPages : v_this.totalPage, currentPage:v_this.pageNo,
	            	        		onChangePage: function(event, data) {
	            	        			v_this.pageNo = data.currentPage;
	            	        			v_this.pageSize = data.rowsPerPage;
	            	        			v_this.renderData("my");
	    	             			},
	    	             			totalRows:result.data['queryMyTaskTodo'].total,
	    	             			rowsPerPage:v_this.pageSize,
	    	               			showGoToPage: true,
	    	   	       				showRowsPerPage : true,
	    	   	       				showRowsInfo : true,
	    	   	       				showRowsDefaultInfo : true
	            	        	});
                    	}else if(e == "sub"){//下属待办公文
                    		templateSub= Handlebars.compile(result.template["processList"]);
                        	var html = templateSub({"type":"sub-todo","processList":result.data['querySuborditnatesTaskTodo'].rows});
                        	$("#flowlist-container-sub").html(html);
//                        	if(v_this.subPageNo%5 == 0 && result.data['querySuborditnatesTaskTodo'].rows.length>0){
//        	             		v_this.subTotalPage+=5;
//        		         	 }
//        		         	 if(result.data['querySuborditnatesTaskTodo'].rows.length==0){
//        		         		if(v_this.subTotalPage>5)
//        		         			v_this.subTotalPage-=5;
//        		         	 }
//        		         	 if(v_this.subPageNo ==1){
//        		         		v_this.subTotalPage =5;
//        		         	 }
                        	v_this.subTotalPage =parseInt((result.data['querySuborditnatesTaskTodo'].total+v_this.subPageSize-1)/v_this.subPageSize);
        		         	if(result.data['querySuborditnatesTaskTodo'].rows.length>0)
	                    		$("#process_pagination_sub").bs_pagination({ totalPages : v_this.subTotalPage, currentPage:v_this.subPageNo,
	                    			onChangePage: function(event, data) {
	                    				v_this.subPageNo = data.currentPage;
	                    				v_this.subPageSize = data.rowsPerPage;
	                    				v_this.renderData("sub");
	    	             			},
	    	             			totalRows:result.data['querySuborditnatesTaskTodo'].total,
	    	             			rowsPerPage:v_this.subPageSize,
	    	               			showGoToPage: true,
	    	   	       				showRowsPerPage : true,
	    	   	       				showRowsInfo : true,
	    	   	       				showRowsDefaultInfo : true
	                    		});
                    	}else{ //两者
                    		var templateMy= Handlebars.compile(result.template["processList"]);
                        	var html = templateMy({"type":"my-todo","processList":result.data['queryMyTaskTodo'].rows});
                        	$("#flowlist-container").html(html);
                    		var templateSub= Handlebars.compile(result.template["processList"]);
                        	var html = templateSub({"type":"sub-todo","processList":result.data['querySuborditnatesTaskTodo'].rows});
                        	$("#flowlist-container-sub").html(html);
                        	
                        	//总页数计算
//                        	if(v_this.pageNo%5 == 0 && result.data['queryMyTaskTodo'].rows.length>0){
//        	             		v_this.totalPage+=5;
//        		         	 }
//        		         	 if(result.data['queryMyTaskTodo'].rows.length==0){
//        		         		if(v_this.totalPage>5)
//        		         			v_this.totalPage-=5;
//        		         	 }
//        		         	 if(v_this.pageNo ==1){
//        		         		v_this.totalPage =5;
//        		         	 }
        		         	 //总页数计算
//        		         	if(v_this.subPageNo%5 == 0 && result.data['querySuborditnatesTaskTodo'].rows.length>0){
//        	             		v_this.subTotalPage+=5;
//        		         	 }
//        		         	 if(result.data['querySuborditnatesTaskTodo'].rows.length==0){
//        		         		if(v_this.totalPage>5)
//        		         			v_this.subTotalPage-=5;
//        		         	 }
//        		         	 if(v_this.subPageNo ==1){
//        		         		v_this.subTotalPage =5;
//        		         	 }
                        	v_this.totalPage =parseInt((result.data['queryMyTaskTodo'].total+v_this.pageSize-1)/v_this.pageSize);
                        	v_this.subTotalPage =parseInt((result.data['querySuborditnatesTaskTodo'].total+v_this.subPageSize-1)/v_this.subPageSize);
                    		
                        	$("#process_pagination_sub").bs_pagination({
                    			totalPages : v_this.subTotalPage,
                        		totalRows:result.data['queryMyTaskTodo'].total,
                    			currentPage:v_this.subPageNo,
                    			onChangePage: function(event, data) {
                    				v_this.subPageNo = data.currentPage;
                    				v_this.subPageSize = data.rowsPerPage;
                    				v_this.renderData("sub");
    	             			},
    	             			totalRows:result.data['querySuborditnatesTaskTodo'].total,
    	             			rowsPerPage:v_this.subPageSize,
    	               			showGoToPage: true,
    	   	       				showRowsPerPage : true,
    	   	       				showRowsInfo : true,
    	   	       				showRowsDefaultInfo : true
                    		});
            	        	$("#process_pagination").bs_pagination({
            	    			totalPages : v_this.totalPage,
            	    			currentPage:v_this.pageNo,
            	    			onChangePage: function(event, data) {
                    				v_this.pageNo = data.currentPage;
                    				v_this.pageSize = data.rowsPerPage;
                    				v_this.renderData("my");
    	             			},
    	             			totalRows:result.data['queryMyTaskTodo'].total,
    	             			rowsPerPage:v_this.pageSize,
    	               			showGoToPage: true,
    	   	       				showRowsPerPage : true,
    	   	       				showRowsInfo : true,
    	   	       				showRowsDefaultInfo : true
            	        	});
                    	}
                    }//所有待办公文 
                    
                    if(type == "my-todo" || type == "sub-todo"){
                    	var templateA= Handlebars.compile(result.template["processList"]);
                    	var html = templateA({"type":type,"processList":result.data[dataApi].rows});
                    	$("#flowlist-container").html(html);
//                    	if(v_this.pageNo%5 == 0 && result.data[dataApi].rows.length>0){
//    	             		v_this.totalPage+=5;
//    		         	 }
//    		         	 if(result.data[dataApi].rows.length==0){
//    		         		 if(v_this.totalPage>5)
//    		         			 v_this.totalPage-=5;
//    		         	 }
//    		         	 if(v_this.pageNo ==1){
//    		         		v_this.totalPage =5;
//    		         	 }
                    	v_this.totalPage =parseInt((result.data[dataApi].total+v_this.pageSize-1)/v_this.pageSize);
        	        	$("#process_pagination").bs_pagination({
        	        		totalRows:result.data[dataApi].total,
        	    			totalPages : v_this.totalPage,
        	    			currentPage: v_this.pageNo,
        	    			onChangePage: function(event, data) {
    	             			v_this.pageNo = data.currentPage;
    	             			v_this.pageSize = data.rowsPerPage;
    	             			v_this.renderData("my");
                 			},
	             			rowsPerPage:v_this.pageSize,
	               			showGoToPage: true,
	   	       				showRowsPerPage : true,
	   	       				showRowsInfo : true,
	   	       				showRowsDefaultInfo : true
        	        	});
                    }else{
                    	if(type!="all-todo"){
	                    	var template= Handlebars.compile(result.template["myWatched"]);
	                    	if(type=="mycomplete"){
	                    		template= Handlebars.compile(result.template["processList"]);
                    		}
	                    	var html = template({"type":type,"processList": result.data[dataApi].rows});
//	                    	if(v_this.pageNo%5 == 0 && result.data[dataApi].rows.length>0){
//	    	             		v_this.totalPage+=5;
//	    		         	 }
//	    		         	 if(result.data[dataApi].rows.length==0){
//	    		         		if(v_this.totalPage>5)
//	    		         			v_this.totalPage-=5;
//	    		         	 }
//	    		         	 if(v_this.pageNo ==1){
//	    		         		v_this.totalPage =5;
//	    		         	 }
	                    	v_this.totalPage =parseInt((result.data[dataApi].total+v_this.pageSize-1)/v_this.pageSize);
	                    	$("#flowlist-container").html(html);
            	        	$("#process_pagination").bs_pagination({
            	        		totalRows:result.data[dataApi].total,
            	    			totalPages : v_this.totalPage,
            	    			currentPage: v_this.pageNo,
            	    			onChangePage: function(event, data) {
        	             			v_this.pageNo = data.currentPage;
        	             			v_this.pageSize = data.rowsPerPage;
        	             			v_this.renderData("my");
                     			},
    	             			rowsPerPage:v_this.pageSize,
    	               			showGoToPage: true,
    	   	       				showRowsPerPage : true,
    	   	       				showRowsInfo : true,
    	   	       				showRowsDefaultInfo : true
            	        	});
                    	}
                    }
                } else {
                	$("#submit-loading").hide();
                    mdboss.error(msg);
                }
            });
            //end 
        },
        filterSubmit:function(e){//提交
        	 this.pageNo = 1;
        	 this.subPageNo = 1;
//        	 this.totalPage = 5;
//        	 this.subTotalPage = 5;
        	 this.renderData();
        	 $("#workflow-filter-dropdown").slideUp(100); 
             $("#workflow-filter").removeClass("open");
        },
        filterCancel:function(e){//取消 //取消过滤查询
        	$("#workflow-filter-dropdown").slideUp(100); 
            $("#workflow-filter").removeClass("open");
            v_this.renderData(e);
        },
        keywords:function(e){//关键字搜索
        	var v_this = this;
        	var $this  = $(e.currentTarget);
        	if(e.type == "click"){
        		this.keyword = v_this.$el.find("#workflow-keywords").val();
        		this.pageNo = 1;
    			this.subPageNo = 1;
//    			this.totalPage = 5;
//    			this.subTotalPage = 5;
    			this.renderData();
        	}else{
        		var keyword = $this.val();
            	this.keyword = keyword;
        		if(e.which == 13) {
        			this.pageNo = 1;
        			this.subPageNo = 1;
//        			this.totalPage = 5;
//        			this.subTotalPage = 5;
        			this.renderData();
        		}
        	}
        },
        orderItem:function(e){//排序
        	$(".orderType").each(function(){
				$(this).parent("li").removeClass("active");
			});
        	 var $this  = $(e.currentTarget);
        	 $this.parent("li").addClass("active");
			//starter/按发起人排序  starttime/按发起时间排序 createtime/按接收时间排序
			this.orderBy = $this.attr("data-entity");
			this.pageNo = 1;
			this.subPageNo = 1;
//			this.totalPage = 5;
//        	this.subTotalPage = 5;
	    	this.renderData();
			$(".dropdown-menu-toggle").find(".dropdown-menu").stop(true, true).slideUp(200);
        },
        filterInput:function(e){
        	var b = this;
        	var $this  = $(e.currentTarget);
        	var entity = $this.attr("data-entity");
        	var keyword = $this.val();
           	if(e.which == 13) {
         		if(entity == "employee"){//发起人
         			mdboss.getReady({data:[{"name":"filterStarter","post":{ "usercode":mdboss.usercode, "keyword":keyword  },"cache":false} ],
         				template:[]},function(result,msg){
         					var filterStarter=result.data["filterStarter"].rows;
         					b.renderDataList(filterStarter,"employee");
         				});
         		}else if(entity == "document"){//公文
         			mdboss.getReady({data:[{"name":"filterProcesses","post":{ "usercode":mdboss.usercode, "keyword":keyword },"cache":false} ],
	                    template:[]},function(result,msg){
	                    	 var filterStarter=result.data["filterProcesses"].rows;
	                    	 b.renderDataList(filterStarter,"document");
	                    });
         		}else if(entity == "project"){//项目
         			mdboss.getReady({data:[{"name":"filterProjects","post":{ "usercode":mdboss.usercode, "keyword":keyword },"cache":false} ],
	                    template:[]},function(result,msg){
                    	 var filterStarter=result.data["filterProjects"].rows;
                    	 b.renderDataList(filterStarter,"project");
                    });
         		}else if(entity == "tag"){//标签
         			mdboss.getReady({data:[{"name":"filterTags","post":{ "usercode":mdboss.usercode, "keyword":keyword },"cache":false} ],
	                    template:[]},function(result,msg){
                    	 var filterStarter=result.data["filterTags"].rows;
                    	 b.renderDataList(filterStarter,"tag");
                    });
         		}
         		$this.val("");
         	}
        },
        filterItemSelect:function(e){ //获取筛选条件 
        	//<span class=" filter-item"><a data-entity="123123" title="lee" class="employee-click checked">lee</a></span>
        	 var $this  = $(e.currentTarget);
        	 var d = $this.find("a").attr("data-entity");
        	if($this.find("a").hasClass("checked")) {
        		if($this.find("a").hasClass("employee-click")){
        			this.managers.remove(d);
        		}else if($this.find("a").hasClass("document-click")){
        			this.comments.remove(d);
        		}else if($this.find("a").hasClass("project-click")){
        			this.projects.remove(d);
        		}else if($this.find("a").hasClass("tag-click")){
        			this.tags.remove(d);
        		}
            	$this.find("a").removeClass("checked");
            } else {
            	if($this.find("a").hasClass("employee-click")){
        			this.managers.push(d);
        		}else if($this.find("a").hasClass("document-click")){
        			this.comments.push(d);
        		}else if($this.find("a").hasClass("project-click")){
        			this.projects.push(d);
        		}else if($this.find("a").hasClass("tag-click")){
        			this.tags.push(d);
        		}
            	$this.find("a").addClass("checked");
            }
//        	console.log(this.managers);
//        	console.log(this.projects);
//        	console.log(this.tags);
        },
        renderSearch: function() {
            var b = this;
            b.queryDefaultData("", b.module, function(a) {
            		if(a!=undefined){
            			if(a[0]!=undefined){
            				b.renderDataList(a[0].rows, "employee");
            			}
            			if(a[1]!=undefined){
            				b.renderDataList(a[1].rows, "document");
            			}
            			if(a[2]!=undefined){
            				b.renderDataList(a[2].rows, "project");
            			}
            			if(a[3]!=undefined){
            				b.renderDataList(a[3].rows, "tag");
            			}
            		}
	                $(b.el).find(".loading_large").hide();
	                $(b.el).find("#info-div").show();
	            });
        }, 
        queryDefaultData: function(b, a, c) {
        	// 加载筛选 数据
        	mdboss.getReady({data:[{"name":"filterStarter","post":{
        			"usercode":mdboss.usercode, "keyword":"" //申请人
	            }},
	            {"name":"filterProcesses","post":{
	        		"usercode":mdboss.usercode, "keyword":"" //公文
	            }},
	            {"name":"filterProjects","post":{
	        		"usercode":mdboss.usercode, "keyword":""  //项目
//	            }},
//	            {"name":"filterTags","post":{
//	        		"usercode":mdboss.usercode, "keyword":"" //标签
	            }}
            
        	],
            template:[]},function(result,msg){
            	 var filterStarter=result.data["filterStarter"];
            	 var filterProcesses=result.data["filterProcesses"];
            	 var filterProjects=result.data["filterProjects"];
//            	 var filterTags=result.data["filterTags"]; //标签
            	 
            	 var listData=new Array();
            	 listData.push(filterStarter);
            	 listData.push(filterProcesses);
            	 listData.push(filterProjects);
//                 listData.push(filterTags);
            	 c && c(listData);
            });
        },
        renderDataList: function(b, a) {
            var c = 10 < b.length ? 10 : b.length;
            $("#" + a + "-filter").html("");
            for (var d = "", e = "", h = "", f = "",p = 0; p < c; p++) {
                var q = b[p];
                var id ="";
                var name ="";
               switch(a){
            	   case "employee"  : id ="usercode"; name="username"; break;
            	   case "document"  : id ="processcode"; name="processname"; break;
            	   case "project"  : id ="projectcode"; name="projectname"; break;
            	   case "tag"  : id ="tagcode"; name="tagname"; break;
               }
                if (0 > d.indexOf(q[id])) {
                    d += q[id] + ",";
                    "tag" == a && (e = q.privacy ? "privacy-tag": "common-tag", h = q.privacy ? "我的标签:": "公共标签:");
                    var n = $('<span class="' + e + ' filter-item"><a></a></span>');
                    // f是文本内容
                    f = q[name].replace(/</g, "\x26lt").replace(/>/g, "\x26gt").replace("/[\r\n]/g", " ");
                    n.find("a").html(f).attr("data-entity", q[id]).attr("title", h + f);
                    n.find("a").addClass(a + "-click");
                    $("#" + a + "-filter").append(n);
                }
           }
        },
        render: function (context) {
        	var v_this = this;
        	$(".daterangepicker").remove();
        	$('#start_end_time').daterangepicker({
        	},function(start, end, label) {
        		if(start.format('YYYY-MM-DD HH:mm:ss') != end.format('YYYY-MM-DD HH:mm:ss')){
        			$("#start_time").val(start.format('YYYY-MM-DD HH:mm:ss'));
        			$("#end_time").val(end.format('YYYY-MM-DD HH:mm:ss'));
        		}else{
        			$("#start_time").val("");
        			$("#end_time").val("");
        		}
        		v_this.pageNo = 1;
    			v_this.subPageNo = 1;
    			v_this.renderData();
             });
        },
        checkBoxAll:function(e){
        	 e.preventDefault();
        	 $this= $("#check-all");
        	 $this.toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
        	 var $li = $("#flow-list").find("li");
             var $i = $("#flow-list").find("li .checkbox i");
             if($this.hasClass("icon-checkbox-checked")){
            	 $i.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	 $li.addClass("selected");
             }else{
            	 $li.removeClass("selected");
            	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
            	 
             }
        }
    });
    
    //页面对应的数据接口{类型:api}
    var dataSourceMap = {
    		
        "all-todo":{"name":"全部待办","api":"queryTaskTodo", "type":"all"},
        "my-todo":{"name":"我的待办","api":"queryMyTaskTodo", "type":""},
        "my-finshed":{"name":"我的经办","api":"queryProcessInstanceThroughed", "type":""},
        "mycomplete":{"name":"我的已办","api":"queryProcessInstanceComplete", "type":""},
        "sub-todo":{"name":"下属待办","api":"querySuborditnatesTaskTodo", "type":"all"},
        "watched":{"name":"我关注的公文","api":"queryProcessinstancesWatched", "type":"watched"},
        "share":{"name":"共享给我的公文","api":"queryProcessinstanceSharedtome", "type":"sharedtome"},
        "draft":{"name":"草稿公文","api":"queryProcessinstanceDraft", "type":"draft"},
        "done":{"name":"办结公文","api":"queryProcessinstancesDone", "type":"all"},
        "history":{"name":"历史公文查询","api":"queryProcessinstanceHistory", "type":"all"}
    };
    
    //类型-- 用户编码
    var process = function (t, usercode,modulecode) {
    	var userCode ="";
    	if(usercode != undefined){
    		userCode = usercode;
    	}
        var type=t?t:"all-todo";
        var orderBy_ ="starttime desc";
        if("draft" == type){
        	orderBy_="createtime desc";
        }
        if(dataSourceMap[type]){
            var dataApi=dataSourceMap[type]["api"];
            //-----------------
           //默认请求
           //type : all：我所有可见经办             mine：我的经办     subordinate：下属的经办
           var condition =new Array();
           if(userCode != ""){
        	   condition.push({"key":"assignee","operate":"EqualTo","v1":userCode});//当前处理人
           }
          var  requrl=  [ {   "name":dataApi,
              "post":{ usercode:mdboss.usercode, pageNo:1, pageSize:mdboss.pageSize,    // 每页10条记录
                  queryCondition: condition, orderBy:orderBy_ },  "cache":false},
          { "name":"processCount",  "cache":false }//, 
          ];
          //所有公文 
          if(type == "all-todo"){
        	  requrl=  [ {   "name":"queryMyTaskTodo",
	                "post":{
	                    usercode:mdboss.usercode, pageNo:1, pageSize:mdboss.pageSize,  queryCondition: [ ],  orderBy:orderBy_, keyword:"" 
	                },  "cache":false}, //我的待办
                 { "name":"querySuborditnatesTaskTodo",
                    "post":{ usercode:mdboss.usercode, pageNo:1,  pageSize:mdboss.pageSize, queryCondition:[ ], orderBy:orderBy_,  keyword:""
                    }, "cache":false},//下属待办
                { "name":"processCount", "cache":false }
                ];
          }
            //-----------------
          $("#submit-loading").show();
            mdboss.getReady({ data: requrl , template: ["process","processList","myWatched"] }, function (result, msg) {
            	
            	if (result) {
            		$("#submit-loading").hide();
            		mdboss.setLeftMenu(type,modulecode);
                    if(type=="all-todo"){
                        var templateA = Handlebars.compile(result.template["process"]);
                    	var html = templateA({ pageId: "process",
                    		"title":dataSourceMap[type].name, 
                    		"type": type, 
                    		"listData": result.data['queryMyTaskTodo'],
                    		"suborditnatesTaskTodo": result.data['querySuborditnatesTaskTodo']["rows"],
                    		"subordinatestatinfo":result.data["processCount"]["subordinatestatinfo"] });
                    	mdboss.fillPage(html);
                    	new mdboss.View.process({"totalPages":result.data['queryMyTaskTodo'].total,"subTotalPages":result.data['querySuborditnatesTaskTodo'].total,"processType":type,"assignee":userCode});
                    }else{
                    	var template = Handlebars.compile(result.template["process"]);
                    	var html = template({ pageId: "process",
                    		"title":dataSourceMap[type].name, 
                    		"type": type, "listData": result.data[dataApi],
                    		"subordinatestatinfo":result.data["processCount"]["subordinatestatinfo"] });
                    	mdboss.fillPage(html);
                    	
                    	new mdboss.View.process({"totalPages":result.data[dataApi].total,"subTotalPages":0,"processType":type,"assignee":userCode});
                    }

//-------------------------------------------------统计                 
                    //统计图表
                   var option = {
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ",transitionDuration:1,
                        },
                        xAxis : [
                            {
                                type : 'category',
                                show:false,
                                data : result.data["processCount"]["taskstatinfo"]["name"]
                            }
                        ],
                        yAxis : [ {    show:false,  type : 'value' } ],
                        toolbox: {
                            show: true,
                            feature: {
                                dataView: {show: true, readOnly: false},
                                restore: {show: true},
                                saveAsImage: {show: true}
                            }
                        },
                        grid: {
                        	borderWidth: 0, x:20, x2:10,  y:80,   y2:10, width:"90%"
                        },
                        series : [
                            {
                                name:'公文统计',
                                type:'bar',
                                barCategoryGap:"40%",
                                itemStyle : {
                                    normal: {
                                        color: function(params) {
                                            // build a color map as your need.
                                            var colorList = [
                                                '#FFC000','#00B0F0','#92D050','#A6A6A6','#27727B',
                                                '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                                '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                            ];
                                            return colorList[params.dataIndex];
                                        },
                                        label: {
                                            show: true,
                                            formatter: '{b}\n{c}'
                                        }
                                    }
                                },
                                data:result.data["processCount"]["taskstatinfo"]["value"]
                    }
                        ]
                    };
                    
                    var countChart = echarts.init(document.getElementById('myworkflow'));
                    countChart.setOption(option);
                    countChart.on("click", function(param){
                    	//我的待办","我的已办","我的办结","草稿公文 
                    	if( param.name == "我的待办"){
                    		window.location.href ="#process/my-todo";
                    	}else if( param.name == "我的经办"){
                    		window.location.href ="#process/my-finshed";
                    	}else if( param.name == "我的办结"){
                    		window.location.href ="#process/done"; 
                    	}else{
                    		//( param.name == "草稿公文")
                    		window.location.href ="#process/draft";
                    	}
                    });
//-------------------------------------------------统计
                } else {
                	$("#submit-loading").hide();
                	mdboss.error(msg);
                }
            });
          //TODO 需要判断
            var autoopen=mdboss.getQueryString("autoopen");
            if(autoopen&&autoopen=="true"){
            	var processinstcode=mdboss.getQueryString("processinstcode");
                var taskname=mdboss.getQueryString("taskname");
                var taskcode=mdboss.getQueryString("taskcode");
                var processname=mdboss.getQueryString("processname");
                var usercode=mdboss.getQueryString("usercode");
                var title=mdboss.getQueryString("title");
                mdboss.usercode=usercode;
        		var autoopenprocess=Handlebars.compile(require("text!template/page/process/autoopenprocess.html"));
            	var html=autoopenprocess({"processinstcode":processinstcode,"taskname":taskname,"taskcode":taskcode,"type":type,"processname":processname,"title":title});
            	mdboss.module.showProcess($(html));
        	}
        }else if(t=="forms"){//公文管理 
        	mdboss.setLeftMenu(t,modulecode);
        	var tmpCondition = new Array();
 		   tmpCondition.push({"key":"typeclass","operate":"EqualTo","v1": "process"});
// 		   tmpCondition.push({"key":"typeclass","parentcode":"EqualTo","v1": "-1"});
 		   $("#submit-loading").show();
 			mdboss.reqsubmit({"usercode":mdboss.usercode,"queryCondition":tmpCondition,"orderBy":"parentcode,sortorder","pageNo":1,"pageSize":0},
 					mdboss.api.processtypelist,function(m, res){
 				 $("#submit-loading").hide();
 				if(res.rc == 1){
// 					//构造树结构
 					var tmpPTypes = new Array();//pcode, array
 					var tmp = res.data.rows;
 					var formtype = "";
 					  for(var i =0; i<tmp.length; i++){
 						   if(i==0){
 							  formtype = tmp[i].typecode;
 						   }
 						   if(tmp[i].parentcode == "-1"){
 							   tmpPTypes.push({"id":tmp[i].id,"code":tmp[i].typecode,"iconclass":tmp[i].iconclass,"name":tmp[i].typename,"pcode":tmp[i].parentcode,
 								   "sortorder":tmp[i].sortorder,"status":tmp[i].status,
 								   "values":new Array()});
 						   }else{
 							   $.each(tmpPTypes,function(j, item){
 								   if(item.code == tmp[i].parentcode){
 									   item.values.push(tmp[i]);
 								   }
 							   });
 						   }
 					  }
 					  var template = Handlebars.compile(require("text!template/page/process/forms.html"));
 	                  var html = template({"typelist":tmpPTypes,type:t });
 	                  mdboss.fillPage(html);
 	                 new mdboss.View.formManageView({"processtype":formtype});
 				}else{
 					$("#submit-loading").hide();
 					mdboss.error(res.msg);
 				}
 			});
        	
//            mdboss.getReady({data:[{"name":"processtypelist","post":{  usercode:mdboss.usercode, pageNo:0,  pageSize:0, queryCondition:[],  orderBy:"",  keyword:"" },cache:false}//,
//                                  // {"name" : "getModules", "post" : { "usercode":mdboss.usercode,"modulecode":modulecode },cache:false }
//            ], template: ["processForms","processAside"] }, function (result, msg) {
//            	
//            	if (result) {
//            		mdboss.setLeftMenu(t,modulecode);
//                    var data=result.data["queryProcesseDef"];
//                    var template = Handlebars.compile(result.template["processForms"]);
//                    var html = template({type:t,formsList:data});
//                    mdboss.fillPage(html);
//                    var formView=new mdboss.View.formManageView({el:$("#rightMainContainer")});
//                    formView.render();
//                } else {
//                	mdboss.notifyTips(msg);
//                }
//            });
        }else if(t=="wfsmain"){//表单管理
			 mdboss.setLeftMenu(t, modulecode);
			 seajs.use("wfsmain",function(wfsmain){
	        		wfsmain(t);
	         });
        }else if(t=="deputemain"){//委托管理
			 mdboss.setLeftMenu(t, modulecode,"noscroll");//刷新左侧菜单
           	 seajs.use("deputemain",function(deputeindex){
           		 deputeindex(t);
           	 });
        }else if(t=="workflow"){//流程管理
			 mdboss.setLeftMenu(t, modulecode,"noscroll");//刷新左侧菜单
			 workflowlist.workflowFun();
        }else if(t=="workform"){//流程管理 
			 mdboss.setLeftMenu(t, modulecode,"noscroll");//刷新左侧菜单
			 formlist.workformFun();
        }else if(t=="workformitem"){//流程管理 formitemlist
			 mdboss.setLeftMenu(t, modulecode,"noscroll");//刷新左侧菜单
			 formitemlist.workformitemFun();
        }else if(t=="stepinfo"){//流程管理 formitemlist
			 mdboss.setLeftMenu(t, modulecode,"noscroll");//刷新左侧菜单
			 stepinfolist.stepinfoFun();
        }
    };
    module.exports = process;
});