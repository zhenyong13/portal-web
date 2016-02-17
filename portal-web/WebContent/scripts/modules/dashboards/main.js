define(function(require, exports, module) {
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	require("dragsort");
	var $ = require("jquery");
	require("migrate");
	require("ui-core");
	require("ui-widget");
	require("ui-mouse");
	require("ui-sortable");
	var $page = mdboss.$pageWrap;
	
	//刷新 首页我的待办公文 及下属待办公文 start
//	 $page.on("click", "#refresh_new_process", function(){});//刷新 首页我的待办公文 及下属待办公文 end 
	
	 
	 mdboss.View.dashboards = Backbone.View.extend({
	        el: '#mainContainer',
	        initialize: function () {
	        	_this=this;
		          //调用首页个人设置接口
		            var commonModel=new mdboss.Model.commonModel();
		            commonModel.save({"appcode":"ucp","usercode":mdboss.usercode},{url:mdboss.api.dashMoudleQuery,success:function(model,res){
		            	if(res.rc==1){
		            		$(res.data).each(function(i,item){
//		            			console.log(item);
		            			if(item.isshow){
		            				var sid=item.sid;
		                			var templateid=item.templateid;
		                			var thtml= $("#moudle-template").html();
		                			var template=Handlebars.compile(thtml);
		                			var html=template({"id":item.id,"templateid":templateid,"isshow":item.isshow});
		                			_this.$el.find("#moudle"+sid).append(html);
		                			_this.getmoudlehtml(templateid,item.id);
		            			}
		            			
		            		});
		            	}
		            }});
	        	this.render();
	        },
	        render:function(){
	        	//加载框框
	            $( ".sorts-moudle" ).sortable({
    				connectWith: ".sorts-moudle",
    				items:".portal-col",
    				handle: ".portal-col-head",
    				placeholder: "portlet-placeholder",
    				opacity: 0.5,//拖动的透明度
    			    revert: true,//缓冲效果 
    			    update:function(e,u){
    			    	var sortArr=new Array();
    			    	var sid=$(e.target).data("sid");
    			    	$(e.target).find(".portal-col").each(function(i,item){
    			    		sortArr.push({"sid":sid,"tid":$(item).data("id"),"isshow":$(item).data("isshow"),"sortorder":(i+1)});
    			    	});
    			    	if(sortArr.length>0){
    			    		var saveSort=new mdboss.Model.commonModel();
    			    		saveSort.save({"usercode":mdboss.usercode,"appcode":"ucp","data":sortArr},{url:mdboss.api.dashMoudleUpdate,success:function(m,res){
    			    			if(res.rc==1){
    			    				console.log("更新成功");
    			    			}else{
    			    				console.log(res.msg);
    			    			}
    			    		},error:function(){
    			    			mdboss.error();
    			    		}});
    			    	}
    			    }
    			});
	        },
	        events:{
	        	"click #refresh_new_process":"refreshNewProcess",//刷新待办公文
	        	'click .shortcut .watch':'processWatch',//公文关注-取消
	        	'click .j_portal-col-nav li':'tablechange'
	        },
	        callbacks:function(templateid,data){
	        	_this=this;
	        	_this.$el.find("."+templateid).append(data);
	        },
	        tablechange:function(e){
	        	$this=$(e.currentTarget);
				// tab nav
				if ($this.find(".active").length)
					return;
				$this.parent().find(".active").removeClass("active");
				$this.find("a").addClass("active");
				// tab body
				$this.parents(".j_portal-col").find(".portal-col-body>ul").hide().eq($this.index()).fadeIn();
			
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
	        				v_this.refreshNewProcess();
	        			}else{
	        				mdboss.error(data.msg);
	        			}
	        		},error:function(){
	        			mdboss.error("请求接口失败");
	        		}});
	        	}else{
	        		//取消关注  
	        		var cancelwatch =new mdboss.Model.commonModel({"usercode":mdboss.usercode,"processinstcode":processinstcode,"type":"cancel"});
	        		cancelwatch.save({},{url:mdboss.api.taskWatch,success: function (model,data) {
	        			if(data.rc == "1"){
	        				mdboss.notifyTips("取消关注成功");
	        				v_this.refreshNewProcess();
	        			}else{
	        				mdboss.error(data.msg);
	        			}
	        		},error:function(){
	        			mdboss.error( );
	        		}});
	        	}
	        },//end 关注公文 
	        refreshNewProcess:function(){//刷新待办公文 
	    		$("#workflow-loading-my").removeClass("hide");
	    		 mdboss.getReady({
	    			data : [{ "name" : "queryMyTaskTodo", "post" : { usercode : mdboss.usercode, pageNo : 1, pageSize : 10,  queryCondition : [ ], orderBy : "starttime desc" }, "cache" : false },
	    			{ "name" : "querySuborditnatesTaskTodo", "post" : { usercode : mdboss.usercode, pageNo : 1, pageSize : 10,  queryCondition : [ ], orderBy : "starttime desc" }, "cache" : false
    			}],template : [] }, function(result, msg) {
	    			$("#workflow-loading-my").addClass("hide");
	    			if (result) {
	    				$("#workflow-list li").remove();
	    				var taskTodo = result.data["queryMyTaskTodo"];
	    				var subTaskTodo = result.data["querySuborditnatesTaskTodo"];
	    				if(taskTodo && taskTodo.rows){
	    					var myTaskTodo = taskTodo.rows;
	    					var template_My=Handlebars.compile(require("text!template/page/dashboards/myTask.html"));
	    					var html = template_My(myTaskTodo);
	    					$("#workflow-list").html(html);
	    				}
	    				
	    				$("#sub-workflow-list li").remove();
	    				if(subTaskTodo && subTaskTodo.rows){
	    					var mySubTaskTodo = subTaskTodo.rows;
	    					var template_MySub=Handlebars.compile(require("text!template/page/dashboards/mySubTask.html"));
	    					html = template_MySub(mySubTaskTodo);
	    					$("#sub-workflow-list").html(html);
	    				}
	    			} else {
	    				alert(msg);
	    			}
	    		});
	        },//刷新待办公文
	        getmoudlehtml:function(templateid,tid){
	        	_this=this;
			switch(templateid){
				case "tasks":_this.gettasks(templateid,tid);break;
				case "projs":_this.getprojs(templateid,tid);break;
				case "diarys":_this.getdiarys(templateid,tid);break;
				case "notices":_this.getnotices(templateid,tid);break;
				case "wfs":_this.getwfs(templateid,tid);break;
				case "customers":_this.getcustomers(templateid,tid);break;
				case "documents":_this.getdocuments(templateid,tid);break;
				case "calendar":_this.getcalendar(templateid,tid);break;
			}
		},
		getcalendar:function(templateid,tid){
			_this = this;
			var thtml= $("#calendar-template").html();
			var template=Handlebars.compile(thtml);
			 var html=template({"tid":tid});
			 _this.callbacks(templateid,html);
		},
		getdocuments:function(templateid,tid){
			_this = this;
			var thtml= $("#documents-template").html();
			var template=Handlebars.compile(thtml);
			 var html=template({"tid":tid});
			 _this.callbacks(templateid,html);
		},
		getcustomers:function(templateid,tid){
			_this = this;
			var thtml= $("#customers-template").html();
			var template=Handlebars.compile(thtml);
			 var html=template({"tid":tid});
			 _this.callbacks(templateid,html);
		},
		getnotices:function(templateid,tid){
			_this = this;
			var thtml= $("#notices-template").html();
			var template=Handlebars.compile(thtml);
			var html=template({"tid":tid});
			 _this.callbacks(templateid,html);
		},
		getdiarys:function(templateid,tid){
			_this=this;
			var thtml= $("#diarys-template").html();
			var template=Handlebars.compile(thtml);
			var html=template({"tid":tid});
			_this.callbacks(templateid,html);
		},
		getprojs:function(templateid,tid){
			_this=this;
			var thtml= $("#projects-template").html();
			var template=Handlebars.compile(thtml);
			var html=template({"tid":tid});
			_this.callbacks(templateid,html);
		},
		gettasks:function(templateid,tid){
			_this=this;
			var thtml= $("#tasks-template").html();
			var template=Handlebars.compile(thtml);
			var html=template({"tid":tid});
			_this.callbacks(templateid,html);
		},
		getwfs:function(templateid,tid){
			_this=this;
			var thtml= $("#wfs-template").html();
			 var template=Handlebars.compile(thtml);
			 var html=template({});
			 _this.callbacks(templateid,html);
			 this.refreshNewProcess();
			 
//			var thtml= $("#wfs-template").html();
//			 var template=Handlebars.compile(thtml);
//			 var wfs=new mdboss.Model.commonModel();
//			 var post= {
//					 	usercode : mdboss.usercode,// 用户编码
//					 	taskstatus : "todo",// 任务状态
//						pageNo : 1, // 第一页
//						pageSize : 10 // 每页10条记录
//					};
//			 wfs.save(post,{url:mdboss.api.queryTaskTodo,success:function(model,res){
//				 if(res.rc==1){
//					 var html=template({"taskTodo":res.data});
//					 _this.callbacks(templateid,html);
//				 }else{
//					 mdboss.alert(res.msg);
//				 }
//			 },error:function(){
//				 mdboss.error();
//			 }});
		
		}
	 });
	
	var dashboards = function() {
		 mdboss.fillWrap(require("text!../../../template/common/wrap_.html"));
         mdboss.fillPage(require("text!../../../template/page/dashboards/dashboards.html"));
		 var dashview=new  mdboss.View.dashboards();
        
	};

	module.exports = dashboards;

});