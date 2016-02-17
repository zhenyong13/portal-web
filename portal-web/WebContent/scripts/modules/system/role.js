/**
 * 角色管理
 */
define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     mdboss.View.systemRole = Backbone.View.extend({
         el: '#mainContainer',
         initialize:function(){
        	 this.pageNo=1;
        	 this.pageSize=10;
        	 this.totalPage=5;
        	 this.modulecode="";
        	 this.module_list_html=$("#module-list-template").html();
        	 this.modulename="";
        	 this.moduletype="";
        	 this.parentcode="";
        	 this.targetcode="";
        	 this.targetname="";
        	 this.orderBy="createtime desc";//"rolecode,roletype,rolename"
        	 this.condition=null;
        	 this.render();
         },
         events: {
        	 'click #check-all-role':'checkall',//全选
        	 'click #role-del':'batchdel',//批量删除
        	 'click #role-add':'moduleadd',//新增
        	 'click #role-batch':'rolebatch',//批量修改
        	 'click #role-export':'dataexport',//导出
        	 'click .js_role_edit':'dataedit',////修改
        	 "click .js_role_view":"dataview",
        	 'click .js_role_del':"datadel",
        	 'click .js_role_perm':"jsroleperm",//授权信息
        	 'click .js_user_role':"jsuserrole",//角色所属用户
        	 'change #module_role_type':"search",
        	 'keyup #module_role_code':"filterSearch",//搜索
        	 'keyup #module_role_name':"filterSearch",//搜索
        	 'click #role-flow-list li span.js-check-box i':'checkbox',//checkobx 选中取消
        	 'click .js_search_operate':'searchOrg',//父组织
        	 'click #addGroupMember': 'addGroupMember',//添加成员
        	 'click .remove_user': 'removegroupuser',//删除角色成员
        	 'click .js_sort':'sorting',//排序 
         },
         sorting:function(e){
          	this.orderBy = mdboss.sorting(e, this.orderBy);
          	this.pageNo =1;
          	this.renderData();
         },
         removegroupuser:function(e){//删除角色成员
        	 var $this  = $(e.currentTarget);
        	 var targetusercode = $this.attr("data-code");
        	 mdboss.confirm("确定要删除此成员吗？",function(e){
        		if(e){
           			mdboss.reqsubmit({"usercode":mdboss.usercode,"tid":targetusercode},
           					mdboss.api.roleuserdelete, function(m,res){
           				if(res.rc == 1){
           					mdboss.alert("删除成功！");
           					$this.closest(".file-show").remove();
           				   $("#user-info").mCustomScrollbar("update");
           				}else{
           					mdboss.error(res.msg);
           				}
           			 });
        		 } 
        	 });
         },
         addGroupMember:function(e){//添加群组成员
        	 var v_this = this;
        	 var groupcode =$(e.currentTarget).data("code");
        	 v_this.targetcode = groupcode;
        	 console.log("rolecode=" + groupcode);
 	        seajs.use("selectMan", function () {
 	        	new mdboss.View.memberselectView({"title":"成员设置","callback":v_this.addGroupMam,"pview":v_this});
 	        });
         },
         addGroupMam:function(pview, members){//添加成员
        	 var users = new Array();
        	 if(members && members.length>0){
        		 $.each(members, function(i,item){
        			 users.push({"usercode":item.code,"rolecode":pview.targetcode});
        		 });
        		 mdboss.reqsubmit({"usercode":mdboss.usercode,"records":users},
        				 mdboss.api.roleuserbatchadd, function(m, data){
        			 if(data.rc==1){
        				 mdboss.alert("成员添加成功!");
        				 pview.getgroupusers(pview, pview.targetcode);
        			 }else{
        				 mdboss.error(data.msg);	
        			 }
        		 });
        	 }
         },
         getgroupusers:function(pview, code){//添加成员成功后--获取成员
        	 var commonModel=new mdboss.Model.commonModel();//
        	 var tmpCondition = new Array();
        	 tmpCondition.push({"key":"rolecode", "operate":"EqualTo","v1":code});
             commonModel.save({"usercode":mdboss.usercode, "queryCondition":tmpCondition,"pageNo":1, "pageSize":0},
            		 {url:mdboss.api.roleuserlist, success:function(m, data){
             	if(data.rc==1){
                     var template = Handlebars.compile(require("text!template/page/system/roleuser.html"));
                     $('#entitySlider').html(template({"rolecode":code,"rolename":pview.targetname,"members":data.data.rows,"baseurl":baseConfig.avatar_url})).addClass('animate-toggleR');
                     $("#user-info").mCustomScrollbar("update");
                     $('#btn-close').off('click').on('click', function () { pview.closeUserInfo();});
             	}else{
             		mdboss.error(data.msg);	
             	}
             },error:function(){
             	mdboss.error( );
             }});
         },
         jsuserrole:function(e){//角色所属用户 TODO
        	 var _this = this;
        	 e.preventDefault();
             e.stopImmediatePropagation();
             var $this  = $(e.currentTarget);
             var code = $this.data("tid");
             _this.targetcode = code;
             var name = $this.data("name");
             _this.targetname = name;
             $("#role-flow-list li").removeClass("selected");//
             $this.closest("li").addClass("selected");
             //------------------------------------------
             var commonModel=new mdboss.Model.commonModel();//
             var tmpCondition = new Array();
        	 tmpCondition.push({"key":"rolecode", "operate":"EqualTo","v1":code});
             commonModel.save({"usercode":mdboss.usercode,"queryCondition":tmpCondition,"pageNo":1, "pageSize":0},{url:mdboss.api.roleuserlist, success:function(m, data){
             	if(data.rc==1){
                     var template = Handlebars.compile(require("text!template/page/system/roleuser.html"));
                     $('#entitySlider').html(template({"rolecode":code,"rolename":name,"members":data.data.rows,"baseurl":baseConfig.avatar_url})).addClass('animate-toggleR');
                     $("#user-info").mCustomScrollbar({scrollButtons:{
 						enable:false }, theme: "darkblue",horizontalScroll:false,
                     });
                     $('#btn-close').off('click').on('click', function () { _this.closeUserInfo();});
             	}else{
             		mdboss.error(data.msg);	
             	}
             },error:function(){
             	mdboss.error( );
             }});
        	
         },
         closeUserInfo: function () {// 关闭用户信息窗口
             $('#entitySlider').removeClass('animate-toggleR');
             $("#role-flow-list li").removeClass("selected");//
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
         jsroleperm:function(e){
        	//TODO  授权信息
        	 var v_this = this;
        	 var tid=$(e.currentTarget).data("tid"); 
        	 console.log(tid);
        	 var commonModel = new mdboss.Model.commonModel();
        	 commonModel.save({"usercode":mdboss.usercode, "rolecode":tid},{"url":mdboss.api.rolepermedit,success:function(m,res){
        		 if(res.rc == 1){
        			 seajs.use("rolepermselect", function () {
                		 new  mdboss.View.rolepermselectView({dept:res.data.modules, perms:res.data.perms,"process":res.data.process,
                			 "pview":v_this,"rolecode":tid,"callback":v_this.jsrolepermBack});
                	 });
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 },error:function(m,s){
        		 console.log(s);
        		 mdboss.error();
        	 }});
         },
         jsrolepermBack:function(pview){//搜索父组织
        	 pview.renderData();
         },
         filterSearch:function(e){//搜索
        	 if(e.which == 13){
         		this.modulecode = $("#module_role_code").val();
         		this.modulename = $("#module_role_name").val();
         		 this.pageNo = 1;
         		 this.renderData();
 	         }
         },
         search:function(e){//        	
        	 this.pageNo = 1;
        	 this.moduletype = $("#module_role_type").val();
        	 this.renderData();
         },
         datadel:function(e){ //删除单行记录
        	 var v_this = this;
        	 var tid=$(e.currentTarget).data("tid"); 
        	 var commonModel=new mdboss.Model.commonModel();
        	 mdboss.confirm("确定要删除吗？",function(c){
        		 if(c){
        			 commonModel.save({"usercode":mdboss.usercode,"tid":tid},
        					 {url:mdboss.api.roledelete,success:function(model,res){
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
        	 seajs.use("roleedit", function () {
        		 new  mdboss.View.roleedit({"tid":tid, "title":"角色详情","view":true});
        	 });
         },
         moduleadd:function(){//新增
        	 var v_this = this;
        	 seajs.use("roleedit", function () {
        		 new  mdboss.View.roleedit({"title":"新增角色","renderData":v_this.renderDataBack,"pview":v_this});
        	 });
         },
         rolebatch:function(){
        	 var tids = this.getTids();
        	 if(tids.length >0){
        		 var v_this = this;
        		 seajs.use("roleedit", function () {
        			 new  mdboss.View.roleedit({"tids":tids,"title":"批量修改","renderData":v_this.renderDataBack,"pview":v_this});
        		 });
        	 }else{
        		 mdboss.error("请选择要修改的记录！");
        	 }
         },
         dataedit:function(e){//新增修改记录
        	 var v_this = this;
        	var tid=$(e.currentTarget).data("tid"); 
        	 seajs.use("roleedit", function () {
        		 new  mdboss.View.roleedit({"tid":tid,"title":"编辑角色","renderData":v_this.renderDataBack,"pview":v_this});
        	 });
         },
         renderDataBack:function(pview){
        	 pview.renderData();
         },
         dataexport:function(){//导出
        	v_this=this;
        	seajs.use("sign_export", function () {
        		new mdboss.View.signExport({condition:v_this.condition});
        	 });
         },
         getTids:function(){
        	 var tids=new Array();
        	 $("#role-flow-list").find("li  i.icon-checkbox-checked").each(function(index,item){
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
         	$_checkbox=$("#role-flow-list li span.js-check-box");
         	if($_this.hasClass("icon-checkbox-checked")){
         		$_this.closest("li").removeClass("selected");
         		$_this.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
         		if($("#check-all-role").hasClass("icon-checkbox-checked")){
         			$("#check-all-role").addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
         		}
         	}else{
         		$_this.closest("li").addClass("selected");
         		$_this.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
         		if($_checkbox.find("i").length==$_checkbox.find("i.icon-checkbox-checked").length){
             		$("#check-all-role").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
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
            					 {url:mdboss.api.roledeletebatch,success:function(model,res){
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
        	 $this= $("#check-all-role");
        	 $this.toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
        	 var $li = $("#role-flow-list").find("li");
             var $i = $("#role-flow-list").find("li  i");
             if($this.hasClass("icon-checkbox-checked")){
            	 $i.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	 $li.addClass("selected");
             }else{
            	 $li.removeClass("selected");
            	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
             }
         },
         render:function(){
      	     //角色类型
        	 mdboss.dataselect(this, "module_role_type", "UCP_ROLETYPE");
			 this.renderData();
         },
         renderData:function(){//渲染列表
        	 v_this=this;
        	 var commonModel=new mdboss.Model.commonModel();
        	 $("#check-all-role").removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
        	 //查询条件
        	 var tmpCondition = new Array();
	            if(this.modulecode != ""){
	            	tmpCondition.push({"key":"rolecode","operate":"Like","v1":this.modulecode});
	            }
	            if(this.modulename != ""){
	            	tmpCondition.push({"key":"rolename", "operate":"Like","v1":this.modulename});
	            }
	            if(this.moduletype != ""){
	            	tmpCondition.push({"key":"roletype", "operate":"EqualTo","v1":this.moduletype});
	            }
	            if(this.parentcode != ""){
	            	tmpCondition.push({"key":"orgcode", "operate":"EqualTo","v1":this.parentcode});
	            }
	            v_this.condition = tmpCondition;
        	 $("#submit-loading").show();
        	 $("#role-flow-list").mCustomScrollbar("destroy");
             commonModel.save({ "usercode":mdboss.usercode,"pageNo":this.pageNo, "pageSize":v_this.pageSize,    // 每页10条记录
     			"queryCondition": v_this.condition,"orderBy":this.orderBy},{url:mdboss.api.sysrolelist,success:function(model,res){
     				$("#submit-loading").hide();
     				if(res.rc == 1){
     	            	 var listTemplate = Handlebars.compile(v_this.module_list_html);
     	            	 var listHtml=listTemplate({data:res.data});
     	            	 v_this.$el.find("#role-flow-list").html(listHtml);
     	        	 	
     	            	$("#role-flow-list").mCustomScrollbar({scrollButtons:{
	 						enable:false }, theme: "darkblue",horizontalScroll:false,
	                     });
     	            	v_this.totalPage =parseInt((res.data.total+mdboss.pageSize-1)/v_this.pageSize);
	            	    $("#role_pagination").bs_pagination({ totalPages:v_this.totalPage,currentPage:v_this.pageNo,
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