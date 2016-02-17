define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     require("mCustomScrollbar");
     var answer = require("helpansweredit");
     var newsedit = require("newsedit");
     Dialog = require("dialog");
     
     //新闻 
     exports.newsFunc=function(){
    	mdboss.fillPage(require("text!template/page/content/news/index.html"));
		new mdboss.View.newslistView();
     };
     
     mdboss.View.newslistView = Backbone.View.extend({
         el: '#rightMainContainer',
         initialize:function(){
        	 this.pageNo=1;
        	 this.totalPage=5;
        	 this.pageSize=10;
        	 this.modulecode="";
        	 this.module_list_html=$("#module-list-template").html();
        	 this.modulename="";
        	 this.parentcode="";
        	 this.issuecode="";
        	 this.title="";
        	 this.condition=null;
        	 this.ueditor=null;
        	 this.orderBy="";
        	 this.render();
         },
         events: {
        	 'click #check-all-module':'checkall',//全选
        	 'click #module-del':'batchdel',//批量删除
        	 'click #module-add':'moduleadd',//新增
        	 'click #module-batch':'modulebatch',//批量发布
        	 'click .js_module_publish':'publishNews',//发布
        	 'click .js_module_top':'topshowNews',//置顶
        	 'click #module-export':'dataexport',//导出
        	 'click .js_module_edit':'dataedit',////修改
        	 "click .js_module_view":"dataview",
        	 'click .js_module_del':"datadel",
        	 'change #ftype':"filterSearch",
        	 'change #fstatus':"filterSearch",
        	 'change #flevel':"filterSearch",
        	 'keyup #module_code':"filterSearch",//搜索
        	 'keyup #module_name':"filterSearch",//搜索
        	 'click #module-flow-list li span.js-check-box i':'checkbox',//checkobx 选中取消
        	 'click .js_search_module':'searchModule',//模块搜索
        	 'click .js_form_submit':'submitfeeback',//提交
        	 'click .js_form_cancel':'closeUserInfo',//取消提交
        	 'click .js_module_feed':'feedbackInfo',//反馈信息
        	 'click #addFeedback':'addFeedback',//添加反馈信息
        	 
//        	 'click .js_feedback_submit':'jsfeedbacksubmit',//添加反馈信息
//        	 'click .js_feedback_cancel':'jsfeedbackcancel',//取消反馈信息
        	 'click .js_del_answer':'delanswer',//删除反馈信息
        	 'click .js_answer_detail':'jsanswerdetail',//处理编辑
        	 
        	 "focus #creator":'delegateMan',//搜索委托人
        	 "keyup #creator":'delegateMan',//搜索委托人
        	 'click .js_sort':'sorting',//排序 
         },
        sorting:function(e){
	       	this.orderBy = mdboss.sorting(e, this.orderBy);
	       	this.pageNo =1;
	       	this.renderData();
        },
         delegateBack:function(pview, usercode, name){
//        	 pview.$el.find("creator").attr("data-code", usercode);
        	 pview.renderData();
         },
         delegateMan:function(e){
        	 mdboss.userselect(e, this, this.delegateBack);
         },
         jsanswerdetail:function(e){////反馈信息详情
        	 var id=$(e.currentTarget).data("tid"); 
        	 answer.answereditFunc({ "title":"edit","pivew":this.$el,"tid":id, "issuecode":this.issuecode, "name":this.title, "renderData":v_this.feedbackInfoFunBack});//
         },
         delanswer:function(e){//删除反馈信息
        	 var id=$(e.currentTarget).data("tid"); 
        	 mdboss.confirm("确定要删除吗?",function(s){
        		 if(s){
        			 mdboss.reqsubmit({"tid":id}, mdboss.api.newsdelete, function(m, res){
        				 if(res.rc == 1){
        					 mdboss.alert("删除成功!");
        					 $(e.currentTarget).closest("div").parent("div").next().remove();
        					 $(e.currentTarget).closest("div").parent("div").remove();
        					 $("#answerNum").text(parseInt($("#answerNum").text())-1);
        					 if( parseInt($("#answerNum").text()) == 0){
        						 templateA=Handlebars.compile($("#feedback-list-template").html());
        		     	 		 html=templateA({"data":res.data});
        		     	 		 $("#feedbackView").html(html);
        					 }
        				 }else{
        					 mdboss.error(res.msg);
        				 }
        			 });
        		 }
        	 });
         },
         addFeedback:function(e){
        	 answer.answereditFunc({ "title":"add","pivew":this.$el, "issuecode":this.issuecode, "name":this.title, "renderData":v_this.feedbackInfoFunBack});//
         },
         
         feedbackInfoFunBack:function(pview, code, title){ //反馈信息  列表
        	 
        	 var tmpCondition = new Array();
	         tmpCondition.push({"key":"issuecode","EqualTo":"Like","v1":code});
        	 mdboss.reqsubmit({"queryCondition":tmpCondition,"pageNo":0,"pageSize":0,"orderBy":"createtime desc"}, mdboss.api.newslist,function(m, res){
        		 if(res.rc == 1){
     	 			
     	 			//数据列表
     	 			templateA=Handlebars.compile($("#feedback-list-template").html());
     	 			html=templateA({"data":res.data});
     	 			$("#feedbackView").html(html);
     	 			
     	 			
     	 			if(res.data.rows && res.data.rows.length){
     	 				$("#answerNum").text(res.data.total);
	     	 			for(var i=0; i<res.data.rows.length; i++){
	     	 				$("#feedback_info_"+res.data.rows[i].id).html($(res.data.rows[i].content));
	     	 			}
     	 			}
     	 			 
     	 			$(".infolist").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false, });
         			
         			$("#feedbacklist").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false });
                    $('#btn-close').off('click').on('click', function () { 
                    	$('#entitySlider').removeClass('animate-toggleR');
                    	$('#entitySlider').empty();
                        $("#module-flow-list li").removeClass("selected");//
                    });
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 });
         },
         
         feedbackInfo:function(e){ //反馈信息  
        	 var code=$(e.currentTarget).data("tid"); 
        	 var title=$(e.currentTarget).data("title"); 
        	 this.title = title;
        	 this.issuecode = code;
        	 this.feedbackInfoFun(code, title);
         },
         feedbackInfoFun:function(code, title){ //反馈信息  列表
        	 var v_this = this;
        	 var tmpCondition = new Array();
	         tmpCondition.push({"key":"issuecode","EqualTo":"Like","v1":code});
        	 mdboss.reqsubmit({"queryCondition":tmpCondition,"pageNo":0,"pageSize":0,"orderBy":"createtime desc"}, mdboss.api.newslist,function(m, res){
        		 if(res.rc == 1){
         			$('#entitySlider').html( require("text!template/page/help/answer/view.html") ).addClass('animate-toggleR');
         			
         			//渲染数据 
         			var templateA=Handlebars.compile($("#feedback-info-template").html());
         			var number = res.data.total;
     	 			var html=templateA({"title":title,"issuecode":code,"number":number});
     	 			$("#feedbackinfo").html(html);
     	 			
     	 			//数据列表
     	 			templateA=Handlebars.compile($("#feedback-list-template").html());
     	 			html=templateA({"data":res.data});
     	 			$("#feedbackView").html(html);
     	 			
     	 			if(res.data.rows && res.data.rows.length){
	     	 			for(var i=0; i<res.data.rows.length; i++){
	     	 				v_this.$el.find("#feedback_info_"+res.data.rows[i].id).html($(res.data.rows[i].content));
	     	 			}
     	 			}
     	 			
     	 			 
     	 			$(".infolist").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false, });
         			
         			$("#feedbacklist").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false });
                    $('#btn-close').off('click').on('click', function () { 
                    	$('#entitySlider').removeClass('animate-toggleR');
                    	$('#entitySlider').empty();
                        $("#module-flow-list li").removeClass("selected");//
                    });
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 });
         },
         
         submitfeeback:function(){//提交反馈
        	 var v_this = this;
        	 var title = v_this.$el.find("#title").val();
        	 var tid = v_this.$el.find("#tid").val();
        	 var content = UE.getEditor('feedbackEditor').getContent();
        	 var url = mdboss.api.newsadd;
        	 if(tid){
        		 url = mdboss.api.newsedit;
        	 }
        	 
        	 var reqdata =  {"usercode":mdboss.usercode};
        	 reqdata.title = title;
        	 reqdata.content = content;
        	 mdboss.submit(reqdata, url, function(res){
        		 if(res.rc == 1){
        			 mdboss.alert("提交成功!");
        			 v_this.renderData();
        			 v_this.closeUserInfo();
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 }, false, null);
         },
         modulebatch:function(){//指修改
        	 var tids = this.getTids();
        	 var t_this = this;
        	 mdboss.confirm("确定要发布吗?", function(e){
        		 if(e){
        			 mdboss.reqsubmit({"tids":tids}, mdboss.api.batchpublish, function(m, res){
                		 if(res.rc==1){
                			 mdboss.alert("发布成功!");
                			 t_this.renderData();
                		 }else{
                			 mdboss.error(res.msg);
                		 }
                	 });
        		 }
        	 });
         },
         
         filterSearch:function(e){//搜索
        	 if(e.type== "change"){
        		 this.pageNo = 1;
    			 this.renderData();
        	 }else{
        		 if(e.which == 13){
        			 this.modulecode = $("#module_code").val();
        			 this.modulename = $("#module_name").val();
        			 this.pageNo = 1;
        			 this.renderData();
        		 }
        	 }
         },
         search:function(treeNode, parent, pview){//  查询父模块      	
        	 pview.pageNo = 1;
        	 pview.parentcode = treeNode.id;
        	 parent.find("#parentname").val(treeNode.name);
        	 pview.renderData();
         },
         datadel:function(e){ //删除单行记录
        	 var v_this = this;
        	 var tid=$(e.currentTarget).data("tid"); 
        	 var commonModel=new mdboss.Model.commonModel();
        	 mdboss.confirm("确定要删除吗？",function(c){
        		 if(c){
        			 commonModel.save({"usercode":mdboss.usercode,"tid":tid},
        					 {url:mdboss.api.newsdelete,success:function(model,res){
             		 	if(res.rc==1){
             		 		mdboss.notifyTips("删除成功！");
             		 		v_this.renderData();
             		 	}else{
             		 		mdboss.error(res.msg);
             		 	}
             	 },error:function(){
             		 mdboss.error();
             	 }});
        	  }
        	});
         },
         dataview:function(e){//查看详情
        	var tid=$(e.currentTarget).data("tid"); 
        	$(e.currentTarget).closest("li").addClass("selected");//
        	newsedit.newseditFunc({"tid":tid, "title":"view","view":true}); 
         },
         moduleadd:function(){//新增 
        	 var v_this = this;
        	 newsedit.newseditFunc({"title":"add","renderData":v_this.renderDataBack,"pview":v_this}); 
         },
         closeUserInfo:function(){
        	 UE.getEditor('feedbackEditor').destroy();
        	 $('#entitySlider').removeClass('animate-toggleR');
        	 $('#entitySlider').empty();
             $("#module-flow-list li").removeClass("selected");//
         },
         topshowNews:function(e){//置顶
        	 var t_this=this;
        	 var type=$(e.currentTarget).data("type");
        	 var reqData = {
        			 usercode:mdboss.usercode,
                	 tid:$(e.currentTarget).data("tid"),
                	 usercode:t_this.usercode
        	 };
        	 
        	 
        	 var msg ="置顶成功!";
        	 if(type =="up"){
        		 reqData.topshow = true;
        	 }else{
        		 reqData.topshow = false;//取消置顶
        		 msg = "取消置顶成功!";
        	 }
        	 mdboss.reqsubmit(reqData, mdboss.api.topshow, function(m, res){
        		 if(res.rc==1){
        			 mdboss.alert(msg);
        			 t_this.renderData();
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 });
         },
         publishNews:function(e){//发布新闻
        	 var tid=$(e.currentTarget).data("tid");
        	 var tids = new Array();
        	 tids.push(tid);
        	 var t_this = this;
        	 mdboss.confirm("确定要发布吗?", function(e){
        		 if(e){
        			 mdboss.reqsubmit({"tids":tids}, mdboss.api.batchpublish, function(m, res){
                		 if(res.rc==1){
                			 mdboss.alert("发布成功!");
                			 t_this.renderData();
                		 }else{
                			 mdboss.error(res.msg);
                		 }
                	 });
        		 }
        	 });
         },
         dataedit:function(e){//新增修改记录  
        	var v_this = this;
        	var tid=$(e.currentTarget).data("tid"); 
        	$(e.currentTarget).closest("li").addClass("selected");//
        	newsedit.newseditFunc({"tid":tid,"title":"edit","renderData":v_this.renderDataBack,"pview":v_this});
         },
         renderDataBack:function(pview){
        	 pview.renderData();
         },
         dataexport:function(){
        	v_this=this;
        	seajs.use("sign_export", function () {
        		new mdboss.View.signExport({condition:v_this.condition});
        	 });
         },
         getTids:function(){
        	 var tids=new Array();
        	 $("#module-flow-list").find("li  i.icon-checkbox-checked").each(function(index,item){
        		 tids.push($(item).data("id"));
        	 });
        	 return tids;
         },
         batchupdate:function(){//
        	 var tids=v_this.getTids();
        	 if(tids.length==0){
        		 mdboss.notifyTips("请选择批量修改的记录！");
        		 return false;
        	 }else{
        		 seajs.use("demobatchedit", function () {
            		 new  mdboss.View.demobatchedit({"tids":tids});
            	 });
        	 }
         },
         checkbox:function(e){
        	 $_this=$(e.currentTarget);
         	$_checkbox=$("#module-flow-list li span.js-check-box");
         	if($_this.hasClass("icon-checkbox-checked")){
         		$_this.closest("li").removeClass("selected");
         		$_this.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
         		if($("#check-all-module").hasClass("icon-checkbox-checked")){
         			$("#check-all-module").addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
         		}
         	}else{
         		$_this.closest("li").addClass("selected");
         		$_this.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
         		if($_checkbox.find("i").length==$_checkbox.find("i.icon-checkbox-checked").length){
             		$("#check-all-module").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
             	}
         	} 
         },
         batchdel:function(e){//批量删除
        	 v_this=this;
        	 var delIds=v_this.getTids();
        	 if(delIds.length==0){
        		 mdboss.error("请选择批量删除的记录！");
        		 return false;
        	 }else{
        		 var commonModel=new mdboss.Model.commonModel();
            	 mdboss.confirm("确定要删除吗？",function(c){
            		 if(c){
            			 commonModel.save({"usercode":mdboss.usercode,"tids":delIds},
            					 {url:mdboss.api.newsdeletebatch,success:function(model,res){
                    		 if(res.rc==1){
                    			 mdboss.notifyTips("删除成功！");
                    			 v_this.renderData();
                    		 }else{
                    			 mdboss.error(res.msg);
                    		 }
                    	 },error:function(){
                    		 mdboss.error();
                    	 }});
            		 }
            	 });
        	 }
         },
         checkall:function(e){
        	 e.preventDefault();
        	 $this= $("#check-all-module");
        	 $this.toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
        	 var $li = $("#module-flow-list").find("li");
             var $i = $("#module-flow-list").find("li  i");
             if($this.hasClass("icon-checkbox-checked")){
            	 $i.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	 $li.addClass("selected");
             }else{
            	 $li.removeClass("selected");
            	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
             }
         },
         render:function(){ 
        	 mdboss.dataselect(this, "ftype", "CMS_NEWSTYPE","","150");
        	 mdboss.dataselect(this, "fstatus", "CMS_NEWSSTATUS","","150");
        	 this.renderData( );
         },
         renderData:function(f){//渲染列表
        	 v_this=this;
        	 $("#check-all-module").removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
        	 var commonModel=new mdboss.Model.commonModel();        	 
        	 //查询条件
        	 var tmpCondition = new Array();
	            if(this.$el.find("#creator").attr("data-code")){
	            	tmpCondition.push({"key":"creator","operate":"EqualTo","v1":v_this.$el.find("#creator").attr("data-code")});
	            }
	            if(this.modulename){
	            	tmpCondition.push({"key":"title", "operate":"Like","v1":v_this.$el.find("#module_name").val()});
	            }
	            if(v_this.$el.find("#ftype").val()){
	            	tmpCondition.push({"key":"newstype", "operate":"EqualTo","v1":v_this.$el.find("#ftype").val()});
	            }
	            if(v_this.$el.find("#fstatus").val()){
	            	tmpCondition.push({"key":"status", "operate":"EqualTo","v1":v_this.$el.find("#fstatus").val()});
	            }
	           
	            v_this.condition = tmpCondition;
        	 $("#submit-loading").show();
        	 $("#module-flow-list").mCustomScrollbar("destroy");
             commonModel.save({ "usercode":mdboss.usercode,"pageNo":this.pageNo, "pageSize":v_this.pageSize,    // 每页10条记录
     			"queryCondition": v_this.condition,"orderBy":this.orderBy},{url:mdboss.api.newslist,success:function(model,res){
     				$("#submit-loading").hide();
     				if(res.rc == 1){
     	            	 var listTemplate = Handlebars.compile(v_this.module_list_html);
     	            	 var listHtml=listTemplate({data:res.data});
     	            	 v_this.$el.find("#module-flow-list").html(listHtml);
     	            	 
 	            		 $("#module-flow-list").mCustomScrollbar({scrollButtons:{
 	    					enable:false }, theme: "darkblue",horizontalScroll:false,
 	            		 });
 	            		 
     	            	 v_this.totalPage =parseInt((res.data.total+mdboss.pageSize-1)/v_this.pageSize);
     	            	 $("#module_pagination").bs_pagination({ totalPages:v_this.totalPage,currentPage:v_this.pageNo,
     	            		rowsPerPage:v_this.pageSize,
     	            		onChangePage: function(event, data) {
     	            			v_this.pageNo = data.currentPage;
     	            			v_this.pageSize = data.rowsPerPage;
     	            			v_this.renderData();
	             			},
	             			totalRows:res.data.total,
	             			showGoToPage: true,
	        				showRowsPerPage : true,
	        				showRowsInfo : true,
	        				showRowsDefaultInfo : true,
     	            	 });
     	            	 
     	            	v_this.usercode=res.data.usercode;
     				}else{
     					mdboss.error(res.msg);
     				}
     			},error:function(){
     				$("#submit-loading").hide();
     				mdboss.error();
     			}});
         }
          
     });
     
});