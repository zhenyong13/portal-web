define(function(require, exports, module) {
	var $ = require("jquery");
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	require("daterangepicker_moment");
	require("daterangepicker");

	mdboss.View.professListView = Backbone.View.extend({
		 el: "#rightMainContainer",
		 initialize: function () {
			 var html = require("text!template/page/project/professionalhead.html");
			 mdboss.fillPage(html);
			 //加载列表数据
			 this.renderlist({});
			 this.currentCount=0; // 当前数量
			 this.pageNo=1; // 当前数量
			 this.pageSize=20; // 当前数量
			 var projtype={"post":{"usercode":mdboss.usercode,"definition":"PM_PROJECTCATEGORY"},"url":mdboss.api.queryProcesstype,"ele":"projecttype"};
			 this.renderCondition(projtype);
			 var profess={"post":{"usercode":mdboss.usercode},"url":mdboss.api.professlist,"ele":"professlist"};
			 this.renderCondition(profess);
			 //加载进度查询条件
			 mdboss.dataselect(this, "projectstate", "COMMON_STATE","", "205");
			 var cur_this=this;
			 $("#start_end_time").daterangepicker({},function(start, end, label) {
					$("#start_time").val(start.format('YYYY-MM-DD HH:mm:ss'));
	     			$("#end_time").val(end.format('YYYY-MM-DD HH:mm:ss'));
	     			var querycondition={"starttime":$("#start_time").val(),"endtime":$("#end_time").val()};
	     			cur_this.renderlist(querycondition);
		     });
		 },
		 events:{
			 "click .js-professional-title":"js_professional_title",//收缩
			 "click .goal-item":"professdetail", //专业详情
			 "click .js-projectadd":"projectadd",//专业添加
			 "click .filter-submit":"querySubmit",//筛选查询提交
			 "click .filter-cancle":"querycancel",//筛选取消
			 "keyup .filter-input input":"filterCondition",//过滤条件
			 "click .filter-item a":"clickQueryItem",//点击筛选条件
			 "change #projectstate":"querybyProjstate",//查询项目状态
			 "keyup #workflow-keywords":"querykeyword",//关键字搜索
			  "click .changeModel a":"changeModel",//切换显示方式
		 },
		 changeModel:function(e){
			 var current=$(e.currentTarget);
			 this.modelshow = current.data("model");
			 current.siblings().removeClass("active");
			 current.addClass("active");
			 this.renderlist({});
		 },
		 querykeyword:function(e){
			 var cur_this=this;
				if(e.keyCode==13){
					var current=$(e.currentTarget);
					var keyword=current.val();
					if(keyword!=""){
						var querycondition={};
						querycondition.keyword=keyword;
						querycondition.keywordFields=["projectname"];
						cur_this.renderlist(querycondition);
					}
				}
			 },
		 querybyProjstate:function(e){
			 var cur_this=this;
			 var current=$(e.currentTarget);
			 var val=current.val();
			 var querycondition={};
			 querycondition.starttime=val;
			 cur_this.renderlist(querycondition);
			 
		 },
		 clickQueryItem:function(e){
			 var $current=$(e.currentTarget);
			 if($current.hasClass("checked")){
				 $current.removeClass("checked");
			 }else{
				 $current.addClass("checked");
			 }
		 },
		 renderCondition:function(data){
			 var cur_this=this;
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
				 var projectypes=new Array();
				 var profess=new Array();
				 var queryCondition=[];
				 var querycondition={};
				$("#projecttype-filter .filter-item a.checked").each(function(i,item){
					console.log($(item).data("code"));
					projectypes.push($(item).data("code"));
				}); 
				$("#professlist-filter .filter-item a.checked").each(function(i,item){
					profess.push($(item).data("code"));
				}); 
				if(projectypes.length>0){
					queryCondition.push({"key":"projecttype", "operate": "In", "v1":projectypes});
				}
				
				if(profess.length>0){
					queryCondition.push({"key":"special", "operate": "In", "v1":profess});
				}
				querycondition.queryCondition=queryCondition;
				cur_this.renderlist(querycondition);
				 $("#workflow-filter-dropdown").slideUp(100); 
	             $("#workflow-filter").removeClass("open");
			 },
		 renderlist:function(querycondition){
//			 var querycondition ={};
			 var cur_this=this;
			 querycondition.pageNo=1;
			 querycondition.pageSize= this.pageSize;
			 querycondition.pageNo= 1;
			  
			 if(!querycondition.orderBy){
				 querycondition.orderBy="specialtytype,createtime desc";
			 }
			 
			 var qCondition = new Array();
			 //模糊查询
			 if(cur_this.$el.find("#workflow-keywords").val()){
				 querycondition.keyword= cur_this.$el.find("#workflow-keywords").val();
				 querycondition.keywordFields=["specialtcode","specialtyname","managercode"];
			 }
			 
			 //时间查询
			 if($("#start_time").val() && $("#end_time").val()){
				 qCondition.push({"key":"starttime","operate":"Between","v1":$("#start_time").val(),"v2":$("#end_time").val()});//时间
			 }
			 
			 if(cur_this.$el.find("#projectstate").val()){
				 qCondition.push({"key":"specialtytype", "operate": "EqualTo", "v1":cur_this.$el.find("#projectstate").val()});
			 }
			 //-------------
			 //
			 if(qCondition.length>0){
				querycondition.queryCondition=qCondition;
			 } 
			 cur_this.$el.find(".professprojList").mCustomScrollbar("destroy");
			 querycondition.usercode=mdboss.usercode;
			 var commonModel=new mdboss.Model.commonModel();
			 commonModel.save(querycondition,{url:mdboss.api.professlist,success:function(m,res){
				 console.log(res.rc);
				 if(res.rc==1){
					 var data=res.data.rows;
					 cur_this.currentCount = res.data.rows.length;
					 var newdata=cur_this.dataparse(data);
					 var listtemplate=Handlebars.compile($("#professprojlist-template-cart").html());  //卡片展示
					 if(cur_this.modelshow == "list"){
						 listtemplate=Handlebars.compile($("#professlist-template-list").html()); //列表展示
					 }
					 $("#professprojList").html(listtemplate({"projects":newdata}));
					 //
					 cur_this.$el.find(".js-professlist").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false,callbacks:{
							//回调 --- 
							 onTotalScroll:function(){//当滚动条到底时
								 querycondition.pageNo = (cur_this.pageNo++);
								 var commonModel=new mdboss.Model.commonModel();
								 commonModel.save(querycondition,{url:mdboss.api.professlist,success:function(m,res){
									 if(res.rc==1){
										 var data=res.data.rows;
										 if(data== null || data.length==0){
											 return ;
										 }
										 var newdata=cur_this.dataparse(data); //数据解析
										 var listtemplate=Handlebars.compile($("#professprojlist-template-cart").html()); //卡片展示
										 if(cur_this.modelshow == "list"){
											 listtemplate=Handlebars.compile($("#professlist-template-list").html());//列表 展示
										 }
										 cur_this.$el.find("#professprojList").append( listtemplate({"projects":newdata}) );
									 }else{
										 mdboss.error(res.msg);
									 }
								 },error:function(m,res){
									 mdboss.error();
								 }});
							 }
						 }  
					 });
					 
					 //
				 }else{
					 mdboss.error(res.msg);
				 }
			 },error:function(m,res){
				 mdboss.error();
			 }});
		 },
		 dataparse:function(data){ //数据解析 
			var formatdata=[];
			var newdata=[];
			$(data).each(function(index,item){
				var projcode=item.projectcode;
				var proj=formatdata[projcode];
				if(proj){
					formatdata[projcode].professlist.push(item);
				}else{
					formatdata[projcode]={"projectcode":item.projectcode,"projectname":item.projectname,"professlist":[item]};
				}
			});
			for(var key in formatdata){
				if(typeof formatdata[key]!="function"){
					newdata.push(formatdata[key]);
				}
			}
			return newdata;
		 },
		 projectadd:function(e){
			 new mdboss.View.professaddView();
		 },
		 professdetail:function(e){
			 new mdboss.View.professdetailView();
		 },
		 js_professional_title:function(e){
			var current=$(e.currentTarget);
			var ss= current.find(".js_ss").html();
			if(ss=="收缩"){
				current.find(".js_ss").html("展开");
			}else{
				current.find(".js_ss").html("收缩");
			}
			current.next().slideToggle(500);
		}
	
	});
	
});