define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //	链接管理
     exports.linkFun=function(){
    	mdboss.fillPage(require("text!template/page/content/link/index.html"));
		new mdboss.View.linkModule();
     };
     
     mdboss.View.linkModule = Backbone.View.extend({
         el: '#rightMainContainer',
         initialize:function(){
        	 this.pageNo=1;
        	 this.totalPage=5;
        	 this.pageSize=10;
        	 this.modulecode="";
        	 this.module_list_html=$("#module-list-template").html();
        	 this.modulename="";
        	 this.parentcode="";
        	 this.orderBy="";
        	 this.condition=null;
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
        	 
        	 'keyup #module_name':"filterSearch",//搜索
        	 'click #module-flow-list li span.js-check-box i':'checkbox',//checkobx 选中取消
        	 'click .js_search_module':'searchModule',//链接搜索
        	 'click .js_sort':'sorting',//排序 
         },
         sorting:function(e){
          	this.orderBy = mdboss.sorting(e, this.orderBy);
          	this.pageNo =1;
          	this.renderData();
         },
         modulebatch:function(){//指修改
        	 var tids = this.getTids();
        	 if(tids.length >0){
        		 var v_this = this;
        		 seajs.use("linkedit", function () {
        			 new  mdboss.View.linkedit({"tids":tids,"title":"批量修改","renderData":v_this.renderDataBack,"pview":v_this});
        		 });
        	 }else{
        		 mdboss.error("请选择要修改的记录！");
        	 }
         },
         searchModule:function(){
        	 _this=this;
        	 var dept_arr=new Array();
 	        seajs.use("moduleselect", function () {
 	        	new mdboss.View.moduleselectView({dept:dept_arr,parent:_this.$el,"callback":_this.search,"pview":_this});
 	        });
         },
         filterSearch:function(e){//搜索
        	 if(e.which == 13){
         		this.pageNo = 1;
         		this.renderData();
 	         }
         },
         search:function(){//  查询父链接      	
        	 this.pageNo = 1;
        	 this.renderData();
         },
         datadel:function(e){ //删除单行记录
        	 var v_this = this;
        	 var tid=$(e.currentTarget).data("tid"); 
        	 var commonModel=new mdboss.Model.commonModel();
        	 mdboss.confirm("确定要删除吗？",function(c){
        		 if(c){
        			 commonModel.save({"usercode":mdboss.usercode,"tid":tid},
        					 {url:mdboss.api.linkdelete,success:function(model,res){
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
        	 seajs.use("linkedit", function () {
        		 new  mdboss.View.linkedit({"tid":tid, "title":"链接详情","view":true});
        	 });
         },
         moduleadd:function(){//新增
        	 var v_this = this;
        	 seajs.use("linkedit", function () {
        		 new  mdboss.View.linkedit({"title":"新增链接","renderData":v_this.renderDataBack,"pview":v_this});
        	 });
         },
         dataedit:function(e){//新增修改记录
        	 var v_this = this;
        	var tid=$(e.currentTarget).data("tid"); 
        	 seajs.use("linkedit", function () {
        		 new  mdboss.View.linkedit({"tid":tid,"title":"编辑链接","renderData":v_this.renderDataBack,"pview":v_this});
        	 });
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
            					 {url:mdboss.api.linkdeletebatch,success:function(model,res){
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
        	 mdboss.dataselect(this, "db_name", "$UCP_DB","");
        	 mdboss.dataselect(this, "table_name", "#UCP_TABLE","");
        	 this.renderData();
         },
         renderData:function(f){//渲染列表
        	 v_this=this;
        	 $("#check-all-module").removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
        	 var commonModel=new mdboss.Model.commonModel();        	 
        	 //查询条件
        	 var tmpCondition = new Array();
        	 if(v_this.$el.find("#module_name").val()){
        		 tmpCondition.push({"key":"name","operate":"Like","v1":v_this.$el.find("#module_name").val()});
        	 }
	             
	         v_this.condition = tmpCondition;
        	 $("#submit-loading").show();
        	 $("#module-flow-list").mCustomScrollbar("destroy");
             commonModel.save({ "usercode":mdboss.usercode,"pageNo":this.pageNo, "pageSize":v_this.pageSize,    // 每页10条记录
     			"queryCondition": v_this.condition,"orderBy":this.orderBy},{url:mdboss.api.linklist,success:function(model,res){
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