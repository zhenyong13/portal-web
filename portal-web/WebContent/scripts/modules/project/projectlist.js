define(function(require, exports, module) {
	var $ = require("jquery");
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
//	require("tree")($);
	require("daterangepicker_moment");
	require("daterangepicker");
	require("mCustomScrollbar");
	require("projectadd");//项目添加
	
	mdboss.View.projectListView = Backbone.View.extend({
		 el: "#rightMainContainer",
		 initialize: function () {
			 cur_this=this;
			 this.modelshow= "cart";//显示模式
			 var html = require("text!template/page/project/projecthead.html");
			 mdboss.fillPage(html);
			 this.queryprojtype=[];
			 
			 this.queryCondition={};//查询条件
			 this.pageNo= 1;//当前页码
			 this.pageSize= 25;//页码
			 this.currentCount=0; // 当前数量
			 //加载列表数据
			 this.renderlist({}); //列表
			
			var projtype={"post":{"usercode":mdboss.usercode,"definition":"PM_PROJECTCATEGORY"},"url":mdboss.api.queryProcesstype,"ele":"projecttype"};
			this.renderCondition(projtype);//加载项目类型
			var profess={"post":{"usercode":mdboss.usercode},"url":mdboss.api.professlist,"ele":"professlist"};
			this.renderCondition(profess);//加载专业
			
			//加载进度查询条件
			mdboss.dataselect(this, "projectstate", "COMMON_STATE","", "205");
			 $("#start_end_time").daterangepicker({},function(start, end, label) {
				$("#start_time").val(start.format('YYYY-MM-DD HH:mm:ss'));
     			$("#end_time").val(end.format('YYYY-MM-DD HH:mm:ss'));
     				var querycondition={};
     				querycondition.starttime=$("#start_time").val();
     				querycondition.endtime=$("#end_time").val();
     				cur_this.renderlist(querycondition);
			 });
		 },
		 events:{
			 "click #start_end_time":"projectdetail", //项目详情
			 "click .js-addporject":"addproject",
			 "click .js-projectadd":"projectadd",//项目添加
			"click .return-projectlist":"returnprojectlist",//返回项目列表
			"click .filter-item a":"clickQueryItem",//点击筛选条件
			"click .filter-submit":"querySubmit",//筛选查询提交
			"click .filter-cancle":"querycancel",//筛选取消
			"click .js-project-edit":"projectadd",//项目编辑
			"click .return-projectlist":"returnprojectlist",//返回项目列表
			"keyup .filter-input input":"filterCondition",//过滤条件
			"change #projectstate":"querybyProjstate",//查询项目状态
			"keyup #workflow-keywords":"querykeyword",//关键字搜索
			"click .changeModel a":"changeModel",//切换显示方式
		 },
		 changeModel:function(e){//切换显示模式
			 var current=$(e.currentTarget);
			 this.modelshow = current.data("model");
			 current.siblings().removeClass("active");
			 current.addClass("active");
			 this.renderlist();
		 },
		 querykeyword:function(e){
			 var cur_this=this;
			if(e.keyCode==13){
				if($(e.currentTarget).val()!=""){
//					var querycondition={};
//					querycondition.keyword=keyword;
//					querycondition.keywordFields=["projectname","managercode"];
//					cur_this.queryCondition = querycondition;//查询条件
					cur_this.renderlist();
				}
			}
		 },
		 querybyProjstate:function(e){
			 var cur_this=this;
//			 var current=$(e.currentTarget);
//			 var val=current.val();
//			 var querycondition={};
//			 querycondition.starttime=val;
//			 
//			 cur_this.queryCondition = querycondition;//查询条件
			 cur_this.renderlist();
			 
		 },
		 filterCondition:function(e){
			if(e.keyCode==13){
				var current=$(e.currentTarget);
				var entity=current.data("entity");
				var val=current.val();
				if($.trim(val)!=""){
					if(entity=="projecttype"){
						var projtype={"post":{"usercode":mdboss.usercode,"definition":"PM_PROJECTCATEGORY"},"url":mdboss.api.queryProcesstype,"ele":"projecttype"};
						this.renderCondition(projtype);
					}else if(entity=="profess"){
						var profess={"post":{"usercode":mdboss.usercode},"url":mdboss.api.professlist,"ele":"professlist"};
						this.renderCondition(profess);
					}
				}
			}
			
		 },
		 querycancel:function(e){
			 var cur_this=this;
			 $("#projecttype-filter .filter-item a").removeClass("checked");
			 $("#professlist-filter .filter-item a").removeClass("checked");
			 cur_this.querySubmit(e);
		 },
		 querySubmit:function(e){
			 var cur_this=this;
//			 var projectypes=new Array();
//			 var profess=new Array();
//			 var queryCondition=[];
//			 var querycondition={};
//			$("#projecttype-filter .filter-item a.checked").each(function(i,item){
//				projectypes.push($(item).data("code"));
//			}); 
//			$("#professlist-filter .filter-item a.checked").each(function(i,item){
//				profess.push($(item).data("code"));
//			}); 
//			if(projectypes.length>0){
//				queryCondition.push({"key":"projecttype", "operate": "In", "v1":projectypes});
//			}
//			
//			if(profess.length>0){
//				queryCondition.push({"key":"special", "operate": "In", "v1":profess});
//			}
//			querycondition.queryCondition=queryCondition;
//			
//			cur_this.queryCondition = querycondition;//查询条件
			cur_this.renderlist();
			 $("#workflow-filter-dropdown").slideUp(100); 
             $("#workflow-filter").removeClass("open");
		 },
		 clickQueryItem:function(e){
			 var $current=$(e.currentTarget);
			 if($current.hasClass("checked")){
				 $current.removeClass("checked");
			 }else{
				 $current.addClass("checked");
			 }
		 },
		 renderCondition:function(data){//渲染查询条件
//			 var cur_this=this;
			 	var commonModel = new mdboss.Model.commonModel();
	  			commonModel.save(data.post,{url:data.url, 
	  				success:function(m,res){
	  				if(res.rc==1){
	  					var typetemplate=Handlebars.compile($("#"+data.ele+"-template").html());
	  					$("#"+data.ele+"-filter").html(typetemplate({"data":res.data.rows}));
	  				}else{
	  					mdboss.error(res.msg);
	  				}
	  			},error:function(m,res){
	  				mdboss.error();
	  			}});
		 },
		 renderlist:function(querycondition){
			 var querycondition = {};//this.queryCondition;
			 var p_this = this;
			 querycondition.pageNo=1;
			 querycondition.pageSize= this.pageSize;
			 if(!querycondition.orderBy){
				 querycondition.orderBy="category,createtime desc";
			 }
			 var qCondition = new Array();
			 //模糊查询
			 if(p_this.$el.find("#workflow-keywords").val()){
				 querycondition.keyword= p_this.$el.find("#workflow-keywords").val();
				 querycondition.keywordFields=["projectname","managercode"];
			 }
			 //时间查询
			 if($("#start_time").val() && $("#end_time").val()){
//				 querycondition.starttime=$("#start_time").val();
//  				 querycondition.endtime=$("#end_time").val(); planstarttime
				 qCondition.push({"key":"starttime","operate":"Between","v1":$("#start_time").val(),"v2":$("#end_time").val()});//时间
			 }
			 
			 if(p_this.$el.find("#projectstate").val()){
				 qCondition.push({"key":"category", "operate": "EqualTo", "v1":p_this.$el.find("#projectstate").val()});
			 }
			 
			 //下拉查询 条件
			 var projectypes=new Array();
			 var profess=new Array();
			 $("#projecttype-filter .filter-item a.checked").each(function(i,item){
					projectypes.push($(item).data("code"));
			 }); 
				$("#professlist-filter .filter-item a.checked").each(function(i,item){
					profess.push($(item).data("code"));
				}); 
				if(projectypes.length>0){
					qCondition.push({"key":"projecttype", "operate": "In", "v1":projectypes});
				}
				
				if(profess.length>0){
					qCondition.push({"key":"special", "operate": "In", "v1":profess});
				}
				//
				if(qCondition.length>0){
					querycondition.queryCondition=qCondition;
				}
			 
			 
			 querycondition.usercode=mdboss.usercode;
			 
			 p_this.$el.find(".js-projectlist").mCustomScrollbar("destroy");
//			 console.log(querycondition);
			 var commonModel=new mdboss.Model.commonModel();
			 commonModel.save(querycondition,{url:mdboss.api.projectlist,success:function(m,res){
				 if(res.rc==1){
					 var data=res.data.rows;
					 p_this.currentCount = res.data.rows.length;
					 var listtemplate=Handlebars.compile($("#projectlist-template-cart").html());
					 if(p_this.modelshow == "list"){
						 listtemplate=Handlebars.compile($("#projectlist-template-list").html());
					 }
					 p_this.$el.find(".js-projectlist").html(listtemplate({"list":data}));
					 p_this.$el.find(".js-projectlist").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false,callbacks:{
						//回调
						 onTotalScroll:function(){//当滚动条到底时
							 querycondition.pageNo = (p_this.pageNo++);
							 var commonModel=new mdboss.Model.commonModel();
							 commonModel.save(querycondition,{url:mdboss.api.projectlist,success:function(m,res){
								 if(res.rc==1){
									 var data=res.data.rows;
									 if(data==null || data.length==0) return;
									 var listtemplate=Handlebars.compile($("#projectlist-template-cart-more").html());
									 if(p_this.modelshow == "list"){
										 listtemplate=Handlebars.compile($("#projectlist-template-list-more").html());
										 p_this.$el.find("#projectlist").append(listtemplate({"list":data, "count": p_this.currentCount}));
										 p_this.currentCount += res.data.rows.length;
									 }else{
										 p_this.$el.find("#projectcart").append(listtemplate({"list":data}));
									 }
								 }else{
									 mdboss.error(res.msg);
								 }
							 },error:function(m,res){
								 mdboss.error();
							 }});
						 }
					 }  });
				 }else{
					 mdboss.error(res.msg);
				 }
			 },error:function(m,res){
				 mdboss.error();
			 }});
		 },
		 returnprojectlist:function(e){
			 Backbone.history.loadUrl(); 
		 },
		 projectadd:function(e){
			 var $current=$(e.currentTarget);
			 var pobj = $current.closest("dl").data("obj");
			 new mdboss.View.projectaddView(pobj);
		 }
		
	
	});
	
	
});