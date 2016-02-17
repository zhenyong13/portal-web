define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     require("mCustomScrollbar");
     var meetingroomedit = require("meetingroomedit");
     Dialog = require("dialog");
     
     
     //使用帮助 
     exports.meetingroomFunc=function(){
    	mdboss.fillPage(require("text!template/page/oa/meetingroom/index.html"));
		new mdboss.View.meetingroomView();
     };
     
     mdboss.View.meetingroomView = Backbone.View.extend({
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
        	 'click #module-batch':'modulebatch',//批量修改
        	 'click #module-export':'dataexport',//导出
        	 'click .js_module_edit':'dataedit',////修改
        	 "click .js_module_view":"dataview",
        	 'click .js_module_del':"datadel",
        	 'change #dtype':"filterSearch",
        	 'change #fstatus':"filterSearch",
        	 'change #flevel':"filterSearch",
        	 'keyup #module_code':"filterSearch",//搜索
        	 'keyup #module_name':"filterSearch",//搜索
        	 'keyup #module_capacity':"filterSearch",//搜索
        	 'click #module-flow-list li span.js-check-box i':'checkbox',//checkobx 选中取消
        	 'click .js_search_module':'searchModule',//模块搜索
        	 'click .js_del_answer':'delanswer',//删除反馈信息
        	 'click .js_answer_detail':'jsanswerdetail',//处理编辑
        	 'click .js_search_operate':'searchOrg',//父组织
        	 
        	
        	 'click .js_sort':'sorting',//排序 
         },
         sorting:function(e){
        	this.orderBy = mdboss.sorting(e, this.orderBy);
        	this.pageNo =1;
        	this.renderData();
         },
         searchOrg:function(){//父组织
        	 var v_this = this;
        	 seajs.use("orgs", function () {
  	        	new mdboss.View.orgsView({parent:v_this.$el,"selectOnly":true,
  	        		"callbacks":v_this.searchByOrg,"pview":v_this,"title":"组织选择"});
  	        });
         },
         searchByOrg:function(treeNode, parent, pview){//搜索父组织
        	 pview.pageNo = 1;
        	 if(treeNode.id =="org--1"){
        		 parent.find("#parentname").val("");
        		 pview.parentcode = "";
        	 }else{
        		 pview.parentcode = treeNode.id;
        		 parent.find("#parentname").val(treeNode.name);
        		 pview.parentcode = treeNode.id;
        	 }
        	 pview.renderData();
         },
         modulebatch:function(){//指修改
        	 var tids = this.getTids();
        	 if(tids.length >0){
        		 var v_this = this;
        		 meetingroomedit.meetingroomeditFunc({"tids":tids,"title":"batch","renderData":v_this.renderDataBack,"pview":v_this});
        	 }else{
        		 mdboss.error("请选择要修改的记录！");
        	 }
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
        			 commonModel.save({"usercode":mdboss.usercode,"roomcode":tid},
        					 {url:mdboss.api.meetingroomdelete,success:function(model,res){
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
        	meetingroomedit.meetingroomeditFunc({"tid":tid, "roomcode":tid,"title":"view","view":true});
//        	 
         },
         moduleadd:function(){//新增 
        	 var v_this = this;
        	 meetingroomedit.meetingroomeditFunc({"title":"add","renderData":v_this.renderDataBack,"pview":v_this});
         },
        
         dataedit:function(e){//新增修改记录  
        	var v_this = this;
        	var tid=$(e.currentTarget).data("tid"); 
        	$(e.currentTarget).closest("li").addClass("selected");//
        	meetingroomedit.meetingroomeditFunc({"tid":tid,"roomcode":tid,"title":"edit","renderData":v_this.renderDataBack,"pview":v_this});
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
            		 new mdboss.View.demobatchedit({"roomcode":tids});
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
            					 {url:mdboss.api.meetingroomdeletebatch,success:function(model,res){
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
//        	 mdboss.dataselect(this, "dtype", "CM_ASSETTYPE","","150");
        	 this.renderData( );
         },
         renderData:function(f){//渲染列表
        	 v_this=this;
        	 $("#check-all-module").removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
        	 var commonModel=new mdboss.Model.commonModel();        	 
        	 //查询条件
        	 var tmpCondition = new Array();
	             
	            if(this.modulename){
	            	tmpCondition.push({"key":"roomname", "operate":"Like","v1":this.modulename});
	            }
	            if(this.modulecode){
	            	tmpCondition.push({"key":"roomcode", "operate":"Like","v1":this.modulecode});
	            }
	            if(v_this.$el.find("#module_capacity").val()){
	            	tmpCondition.push({"key":"capacity", "operate":"LessThanOrEqualTo","v1":v_this.$el.find("#module_capacity").val()});
	            }
	            
	         v_this.condition = tmpCondition;
        	 $("#submit-loading").show();
        	 $("#module-flow-list").mCustomScrollbar("destroy");
             commonModel.save({ "usercode":mdboss.usercode,"pageNo":this.pageNo, "pageSize":v_this.pageSize,    // 每页10条记录
     			"queryCondition": v_this.condition,"orderBy":this.orderBy},{url:mdboss.api.meetingroomlist,success:function(model,res){
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