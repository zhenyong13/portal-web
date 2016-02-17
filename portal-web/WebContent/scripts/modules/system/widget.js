/**
 * 系统组件
 */
define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     require("mousewheel");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.widgetFun=function(){
    	mdboss.fillPage(require("text!template/page/system/widget/widget.html"));
		new mdboss.View.widgetView();
     };
     
     mdboss.View.widgetView = Backbone.View.extend({
         el: '#rightMainContainer',
         initialize:function(){
        	 this.pageNo=1;
        	 this.totalPage=5;
        	 this.pageSize=10;
        	 this.modulecode="";
        	 this.module_list_html=$("#module-list-template").html();
        	 this.modulename="";
        	 this.parentcode="";
        	 this.groupcode="";
        	 this.targetgroupcode="";
        	 this.targetgroupname="";
        	 this.grouptype="";
        	 this.creator="";
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
        	 'change #grouptype':"grouptypeF",
        	 "focus #creator":'delegateMan',//搜索委托人
        	 "keyup #creator":'delegateMan',//搜索委托人
        	 'keyup #module_code':"filterSearch",//搜索
        	 'keyup #module_name':"filterSearch",//搜索
        	 "keyup #group_code":"filterSearch",//搜索
        	 'click #module-flow-list li span.js-check-box i':'checkbox',//checkobx 选中取消
        	 'click #module-flow-list li span.groupinfo': 'renderUserGroup',
        	 'click #addGroupMember': 'addGroupMember',//添加成员
        	 'click .remove_user': 'removegroupuser',//删除组件成员
        	 'click .js_sort':'sorting',//排序 
         },
         sorting:function(e){
          	this.orderBy = mdboss.sorting(e, this.orderBy);
          	this.pageNo =1;
          	this.renderData();
         },
         removegroupuser:function(e){//,//删除组件成员
        	 var $this  = $(e.currentTarget);
        	 var targetusercode = $this.attr("data-code");
        	 mdboss.confirm("确定要删除此成员吗？",function(e){
        		if(e){
        			var commonModel = new mdboss.Model.commonModel();
           			commonModel.save({"usercode":mdboss.usercode,"tid":targetusercode},
           					{url:mdboss.api.widgetsectiondelete, success:function(m,res){
           				if(res.rc == 1){
           					mdboss.alert("删除成功！");
           					$this.closest(".file-show").remove();
           				 $("#user-info").mCustomScrollbar("update");
           				}else{
           					mdboss.error(res.msg);
           				}
           			},error:function(){
           				mdboss.error();
           			}});
        		} 
        	 });
         },
         addGroupMember:function(e){//添加组件成员 TODO
        	 var v_this = this;
        	 var groupcode =$(e.currentTarget).data("code");
        	 v_this.targetgroupcode = groupcode;
// 	        seajs.use("selectMan", function () {
// 	        	new mdboss.View.memberselectView({"title":"成员设置","callback":v_this.addGroupMam,"pview":v_this});
// 	        });
         },
         addGroupMam:function(pview, members){//添加成员 批量
        	 var users = new Array();
        	 if(members && members.length>0){
        		 $.each(members, function(i,item){
        			 users.push({"usercode":item.code,"groupcode":pview.targetgroupcode});
        		 });
        		 mdboss.reqsubmit({"usercode":mdboss.usercode,"records":users},
        				 mdboss.api.widgetsectionbatchadd, function(m, data){
        			 if(data.rc==1){
        				 mdboss.alert("添加成功!");
        				 pview.getgroupusers(pview, pview.targetgroupcode);
        			 }else{
        				 mdboss.error(data.msg);	
        			 }
        		 });
        	 }
         },
         getgroupusers:function(pview, groupcode){//添加组件成员成功后--获取群组成员
        	 var commonModel=new mdboss.Model.commonModel();// TODO
        	 var tmpCondition = new Array();
//        	 tmpCondition.push({"key":"groupcode", "operate":"EqualTo","v1":groupcode});
             commonModel.save({"usercode":mdboss.usercode,
            	 "queryCondition":tmpCondition,"pageNo":1, "pageSize":0},
            		 {url:mdboss.api.widgetsectionlist, success:function(m, data){
             	if(data.rc==1){
                     var template = Handlebars.compile(require("text!template/page/system/widget/widgetsectioninfo.html"));
                     $('#entitySlider').html(template({"code":groupcode,"name":pview.targetgroupname,"members":data.data.rows,"baseurl":baseConfig.avatar_url})).addClass('animate-toggleR');
                     $("#user-info").mCustomScrollbar("update");
                     $('#btn-close').off('click').on('click', function () { pview.closeUserInfo();});
             	}else{
             		mdboss.error(data.msg);	
             	}
             },error:function(){
             	mdboss.error( );
             }});
         },
         renderUserGroup: function (e) {//群组成员信息
             e.preventDefault();
             e.stopImmediatePropagation();
             var $this  = $(e.currentTarget);
             $this =  $this.closest("li");
             $("#module-flow-list li").removeClass("selected");//
             $this.addClass("selected");
             var _this = this;
             var groupcode = $this.attr("code");
            
             var groupname = $this.attr("name");
             var grouptype = $this.attr("type");
             this.targetgroupcode = groupcode;
             this.targetgroupname = groupname;
  
             //------------------------------------------
             var commonModel=new mdboss.Model.commonModel();//
             var tmpCondition = new Array();
//        	 tmpCondition.push({"key":"groupcode", "operate":"EqualTo","v1":groupcode});
             commonModel.save({"usercode":mdboss.usercode,"queryCondition":tmpCondition,"pageNo":1, "pageSize":0},{url:mdboss.api.widgetsectionlist, success:function(m, data){
             	if(data.rc==1){
                     var template = Handlebars.compile(require("text!template/page/system/widget/widgetsectioninfo.html"));
                     $('#entitySlider').html(template({"code":groupcode,"name":groupname,"grouptype":grouptype,"members":data.data.rows,"baseurl":baseConfig.avatar_url})).addClass('animate-toggleR');
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
         /**
          * 关闭用户信息窗口
          */
         closeUserInfo: function () {
             $('#entitySlider').removeClass('animate-toggleR');
             $("#module-flow-list li").removeClass("selected");//TODO
         },
         delegateBack:function(pview, usercode, name){
        	 pview.renderData();
         },
         delegateMan:function(e){
        	 mdboss.userselect(e, this, this.delegateBack);
         },
         grouptypeF:function(){
        	 this.grouptype = $("#grouptype").val();
        	 this.renderData();
         },
         filterSearch:function(e){//搜索
        	 if(e.which == 13){
         		this.modulecode = $("#module_code").val();
         		this.modulename = $("#module_name").val();
         		this.pageNo = 1;
         		this.renderData();
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
        					 {url:mdboss.api.widgetdelete,success:function(model,res){
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
        	 seajs.use("widgetedit", function () {
        		 new  mdboss.View.widgetedit({"tid":tid, "title":"群组详情","view":true});
        	 });
         },
         moduleadd:function(){//新增
        	 var v_this = this;
        	 seajs.use("widgetedit", function () {
        		 new  mdboss.View.widgetedit({"title":"新增组件","renderData":v_this.renderDataBack,"pview":v_this});
        	 });
         },
         modulebatch:function(){//指修改
        	 var tids = this.getTids();
        	 if(tids.length >0){
        		 var v_this = this;
        		 seajs.use("widgetedit", function () {
        			 new  mdboss.View.widgetedit({"tids":tids,"title":"批量修改","renderData":v_this.renderDataBack,"pview":v_this});
        		 });
        	 }else{
        		 mdboss.error("请选择要修改的记录！");
        	 }
         },
         dataedit:function(e){//新增修改记录
        	 var v_this = this;
        	var tid=$(e.currentTarget).data("tid"); 
        	 seajs.use("widgetedit", function () {
        		 new  mdboss.View.widgetedit({"tid":tid,"title":"编辑组件","renderData":v_this.renderDataBack,"pview":v_this});
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
            					 {url:mdboss.api.widgetbatchdelete,success:function(model,res){
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
        	 mdboss.dataselect(this, "grouptype", "UCP_GROUPTYPE");
        	 this.renderData();
         },
         renderData:function(){//渲染列表
        	 v_this=this;
        	 var commonModel=new mdboss.Model.commonModel();        	 
        	 //查询条件
        	 var tmpCondition = new Array();
//	            if(this.modulecode != ""){
//	            	tmpCondition.push({"key":"groupcode","operate":"Like","v1":this.modulecode});
//	            }
	            if(this.modulename ){
	            	tmpCondition.push({"key":"name", "operate":"Like","v1":this.modulename});
	            }
//	            if(this.grouptype != ""){
//	            	tmpCondition.push({"key":"grouptype", "operate":"EqualTo","v1":this.grouptype});
//	            }
//	            var creator = $("#creator").attr("data-code");
//	            if(creator != ""){
//	            	tmpCondition.push({"key":"creator", "operate":"Like","v1": creator});
//	            }
	            v_this.condition = tmpCondition;
        	 $("#submit-loading").show();
        	 $("#module-flow-list").mCustomScrollbar("destroy");
             commonModel.save({ "usercode":mdboss.usercode,"pageNo":v_this.pageNo, "pageSize":v_this.pageSize,    // 每页10条记录
     			"queryCondition": v_this.condition,"orderBy":this.orderBy},{url:mdboss.api.widgetlist,success:function(model,res){
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
     			},error:function(m,res){
     				$("#submit-loading").hide();
     				mdboss.error();
     			}});
         }
     });
     
});