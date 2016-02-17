define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     mdboss.View.systemOrg = Backbone.View.extend({
         el: '#rightMainContainer',
         initialize:function(){
        	 this.pageNo=1;
        	 this.totalPage=5;
        	 this.pageSize=10;
        	 this.modulecode="";
        	 this.module_list_html=$("#module-list-template").html();
        	 this.modulename="";
        	 this.moduletype="";
        	 this.parentcode="";
        	 this.orderBy="";//updatetime desc,orglevel,orgtype
        	 this.condition=null;
        	 this.render();
         },
         events: {
        	 'click #check-all-org':'checkall',//全选
        	 'click #org-del':'batchdel',//批量删除
        	 'click #org-add':'moduleadd',//新增
        	 'click #module-batch':'modulebatch',//批量修改
        	 'click #org-export':'dataexport',//导出
        	 'click .js_org_edit':'dataedit',////修改
        	 "click .js_org_view":"dataview",
        	 'click .js_org_del':"datadel",
        	 'keyup #module_org_code':"filterSearch",//搜索
        	 'click .js_search_org':"searchOrg",//父组织
        	 "change #module_org_type":"orgTypeSearch",
        	 'keyup #module_org_name':"filterSearch",//搜索
        	 'click #org-flow-list li span.js-check-box i':'checkbox',//checkobx 选中取消
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
         orgTypeSearch:function(){
        	 this.moduletype = $("#module_org_type").val();
        	 this.pageNo = 1;
        	 this.renderData();
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
         filterSearch:function(e){//搜索
        	 if(e.which == 13){
         		this.modulecode = $("#module_org_code").val();
         		this.modulename = $("#module_org_name").val();
         		 this.pageNo = 1;
         		 this.renderData();
 	         }
         },
         datadel:function(e){ //删除单行记录
        	 var v_this = this;
        	 var tid=$(e.currentTarget).data("tid"); 
        	 var commonModel=new mdboss.Model.commonModel();
        	 mdboss.confirm("确定要删除吗？",function(c){
        		 if(c){
        			 commonModel.save({"usercode":mdboss.usercode,"tid":tid},
        					 {url:mdboss.api.orgdelete,success:function(model,res){
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
         dataview:function(e){
        	 var tid=$(e.currentTarget).data("tid"); 
        	 seajs.use("orgedit", function () {
        		 new  mdboss.View.orgedit({"tid":tid, "title":"组织详情","view":true});
        	 });
         },
         moduleadd:function(){//新增
        	 var v_this = this;
        	 seajs.use("orgedit", function () {
        		 new  mdboss.View.orgedit({"title":"新增组织","renderData":v_this.renderDataBack,"pview":v_this});
        	 });
         },
         renderDataBack:function(pview){
        	 pview.renderData();
         },
         modulebatch:function(){//批量修改
        	 var tids = this.getTids();
        	 if(tids.length >0){
        		 var v_this = this;
        		 seajs.use("orgedit", function () {
        			 new  mdboss.View.orgedit({"tids":tids,"title":"批量修改","renderData":v_this.renderDataBack,"pview":v_this});
        		 });
        	 }else{
        		 mdboss.error("请选择要修改的记录！");
        	 }
         },
         dataedit:function(e){//新增修改记录
        	 var v_this = this;
        	var tid=$(e.currentTarget).data("tid"); 
        	 seajs.use("orgedit", function () {
        		 new  mdboss.View.orgedit({"tid":tid,"title":"编辑组织","renderData":v_this.renderDataBack,"pview":v_this});
        	 });
         },
         dataexport:function(){//导出
        	v_this=this;
        	seajs.use("sign_export", function () {
        		new mdboss.View.signExport({condition:v_this.condition});
        	 });
         },
         getTids:function(){
        	 var tids=new Array();
        	 $("#org-flow-list").find("li  i.icon-checkbox-checked").each(function(index,item){
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
         	$_checkbox=$("#org-flow-list li span.js-check-box");
         	if($_this.hasClass("icon-checkbox-checked")){
         		$_this.closest("li").removeClass("selected");
         		$_this.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
         		if($("#check-all-org").hasClass("icon-checkbox-checked")){
         			$("#check-all-org").addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
         		}
         	}else{
         		$_this.closest("li").addClass("selected");
         		$_this.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
         		if($_checkbox.find("i").length==$_checkbox.find("i.icon-checkbox-checked").length){
             		$("#check-all-org").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
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
            					 {url:mdboss.api.orgdeletebatch,success:function(model,res){
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
        	 $this= $("#check-all-org");
        	 $this.toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
        	 var $li = $("#org-flow-list").find("li");
             var $i = $("#org-flow-list").find("li  i");
             if($this.hasClass("icon-checkbox-checked")){
            	 $i.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	 $li.addClass("selected");
             }else{
            	 $li.removeClass("selected");
            	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
             }
         },
         render:function(){
        	 //组织类型
        	 mdboss.dataselect(this, "module_org_type", "UCP_ORGTYPE");
        	 this.renderData();
         },
         renderData:function(){//渲染列表
        	 v_this=this;
        	 $("#check-all-org").removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
        	 var commonModel=new mdboss.Model.commonModel();
        	 
        	 //查询条件
        	 var tmpCondition = new Array();
	            if(this.modulecode != ""){
	            	tmpCondition.push({"key":"orgcode","operate":"Like","v1":this.modulecode});
	            }
	            if(this.modulename != ""){
	            	tmpCondition.push({"key":"orgname", "operate":"Like","v1":this.modulename});
	            }
	            if(this.moduletype != ""){
	            	tmpCondition.push({"key":"orgtype", "operate":"EqualTo","v1":this.moduletype});
	            }
	            if(this.parentcode != ""){
	            	tmpCondition.push({"key":"parentcode", "operate":"EqualTo","v1":this.parentcode});
	            }
	            v_this.condition = tmpCondition;
        	 $("#submit-loading").show();
        	 $("#org-flow-list").mCustomScrollbar("destroy");
             commonModel.save({ "usercode":mdboss.usercode,"pageNo":this.pageNo, "pageSize":v_this.pageSize,    // 每页10条记录
     			"queryCondition": v_this.condition,"orderBy":this.orderBy},{url:mdboss.api.sysorglist,success:function(model,res){
     				$("#submit-loading").hide();
     				if(res.rc == 1){
     	            	 var listTemplate = Handlebars.compile(v_this.module_list_html);
     	            	 var listHtml=listTemplate({data:res.data});
     	            	 v_this.$el.find("#org-flow-list").html(listHtml);
     	        	 	
     	            	$("#org-flow-list").mCustomScrollbar({scrollButtons:{
	 						enable:false }, theme: "darkblue",horizontalScroll:false,
	                     });
     	            	v_this.totalPage =parseInt((res.data.total+mdboss.pageSize-1)/v_this.pageSize);
   	            	    $("#org_pagination").bs_pagination({ totalPages:v_this.totalPage,currentPage:v_this.pageNo,
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