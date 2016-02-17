﻿define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     require("mCustomScrollbar");
     var answer = require("helpansweredit");
     var noticeedit = require("noticeedit");
     Dialog = require("dialog");
     
     //公告
     exports.noticeFunc=function(){
    	mdboss.fillPage(require("text!template/page/content/notice/index.html"));
		new mdboss.View.noticeView();
     };
     
     mdboss.View.noticeView = Backbone.View.extend({
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
        	 'click .js_module_publish':'publishNotice',//发布
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
        	 pview.renderData();
         },
         delegateMan:function(e){
        	 mdboss.userselect(e, this, this.delegateBack);
         },
         
         modulebatch:function(){//批量发布
        	 var tids = this.getTids();
        	 var t_this = this;
        	 mdboss.confirm("确定要发布吗?", function(e){
        		 if(e){
        			 mdboss.reqsubmit({"tids":tids}, mdboss.api.noticebatchpublish, function(m, res){
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
         
         topshowNews:function(e){//置顶-
        	 var t_this=this;
        	 var tid=$(e.currentTarget).data("tid");
        	 var type=$(e.currentTarget).data("type");
        	 var reqData = {};
        	 reqData.tid= tid;
        	 var msg ="置顶成功!";
        	 if(type =="up"){
        		 reqData.topshow = 1;
        	 }else{
        		 reqData.topshow = 0;//取消置顶
        		 msg = "取消置顶成功!";
        	 }
        	 mdboss.reqsubmit(reqData, mdboss.api.noticeedit, function(m, res){
        		 if(res.rc==1){
        			 mdboss.alert(msg);
        			 t_this.renderData();
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 });
         },
         publishNotice:function(e){//发布通知
        	 var tid=$(e.currentTarget).data("tid");
        	 var tids = new Array();
        	 tids.push(tid);
        	 var t_this = this;
        	 mdboss.confirm("确定要发布吗?", function(e){
        		 if(e){
        			 mdboss.reqsubmit({"tids":tids}, mdboss.api.noticebatchpublish, function(m, res){
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
        					 {url:mdboss.api.noticedelete,success:function(model,res){
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
// 			var v_this = this;
        	var tid=$(e.currentTarget).data("tid"); 
        	$(e.currentTarget).closest("li").addClass("selected");//
        	noticeedit.noticeeditFunc({"tid":tid, "title":"view","view":true}); 
         },
         moduleadd:function(){//新增 
        	 var v_this = this;
        	 noticeedit.noticeeditFunc({"title":"add","renderData":v_this.renderDataBack,"pview":v_this}); 
         },
         closeUserInfo:function(){
        	 UE.getEditor('feedbackEditor').destroy();
        	 $('#entitySlider').removeClass('animate-toggleR');
        	 $('#entitySlider').empty();
             $("#module-flow-list li").removeClass("selected");//
         },
         dataedit:function(e){//修改  
        	var v_this = this;
        	var tid=$(e.currentTarget).data("tid"); 
        	var notifycode=$(e.currentTarget).closest("li").attr("notifycode");
        	$(e.currentTarget).closest("li").addClass("selected");//
        	noticeedit.noticeeditFunc({"tid":tid,"title":"edit","notifycode":notifycode,"renderData":v_this.renderDataBack,"pview":v_this}); 
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
            					 {url:mdboss.api.noticedeletebatch,success:function(model,res){
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
//        	 mdboss.dataselect(this, "ftype", "OA_ISSUETYPE","","150");
        	 this.renderData( );
         },
         renderData:function(f){//渲染列表
        	 v_this=this;
        	 $("#check-all-module").removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
        	 var commonModel=new mdboss.Model.commonModel();        	 
        	 //查询条件
        	 var tmpCondition = new Array();
	            if(this.$el.find("#creator").attr("data-code")){
	            	tmpCondition.push({"key":"creator","operate":"EqualTo","v1":this.$el.find("#creator").attr("data-code")});
	            }
	            if(this.modulename){
	            	tmpCondition.push({"key":"title", "operate":"Like","v1":this.modulename});
	            }
	            
	            v_this.condition = tmpCondition;
        	 $("#submit-loading").show();
        	 $("#module-flow-list").mCustomScrollbar("destroy");
             commonModel.save({ "usercode":mdboss.usercode,"pageNo":this.pageNo, "pageSize":v_this.pageSize,    // 每页10条记录
     			"queryCondition": v_this.condition,"orderBy":this.orderBy},{url:mdboss.api.noticelist,success:function(model,res){
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