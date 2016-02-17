define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     require("mCustomScrollbar");
     require("mousewheel");
     Dialog = require("dialog");
     
     mdboss.View.systemOperate = Backbone.View.extend({
         el: '#rightMainContainer',
         initialize:function(){
        	 this.pageNo=1;
        	 this.pageSize=10;
        	 this.totalPage=5;
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
        	 'click .js_module_roleperm':"js_role_perm",//授权信息
        	 'click .js_module_role':"js_module_role",//角色信息
//        	 'change #module_type':"search",
        	 "click .btn-resetPwd":'resetPwd',//重置密码
        	 'keyup #module_code':"filterSearch",//搜索
        	 'keyup #module_name':"filterSearch",//搜索
        	 'click #operate-flow-list li span.js-check-box i':'checkbox',//checkobx 选中取消
        	 'click .js_search_operate':'searchOrg',//父组织
        	 'click .js_sort':'sorting',//排序 
         },
          sorting:function(e){
               	this.orderBy = mdboss.sorting(e, this.orderBy);
               	this.pageNo =1;
               	this.renderData();
         },
         js_module_role:function(e){//
        	 var v_this = this;
        	 var $this  = $(e.currentTarget);
         	 var tid = $this.data("tid");
         	 //TODO
         	var tmpCondition = new Array();
         	tmpCondition.push({"key":"usercode", "operate":"EqualTo","v1":tid});
         	mdboss.reqsubmit({"usercode":mdboss.usercode, "pageNo":1,"pageSize":0,"queryCondition":tmpCondition }, mdboss.api.userrole, function(m,res){
//         		console.log(res);
         		if(res.rc == 1){
//         			new mdboss.View.rolelistView({"roles":res.data.roles,"pview":this,"parent":this.$el,"targetusercode":m.get("targetusercode"), "callback":this.showRole});
         			seajs.use("selectRole", function () {
             			 new  mdboss.View.selectRoleView({"roles":res.data.rows,"pview":v_this,"targetusercode":tid, "callback":v_this.showRole});
             		 });
         		}else{
         			mdboss.error(res.msg);
         		}
         	});
         },
         showRole:function(rdata, roles){//分配角色
        	 mdboss.reqsubmit({"usercode":mdboss.usercode,"targetusercode":rdata.targetusercode,"roles":roles},
        		 mdboss.api.userroleadd, function(m,res){
          		if(res.rc == 1){
          			mdboss.alert("处理成功!");
          			rdata.pview.renderData();
          		}else{
          			mdboss.error(res.msg);
          		}
          	} );
         },
         resetPwd:function(e){
        	 var $this  = $(e.currentTarget);
         	 var tid = $this.data("tid");
         	 var targetusercode=$this.data("usercode");
        	 mdboss.confirm("确定要重置密码吗?",function(e){
        		 if(e){
        			 var commonModel = new mdboss.Model.commonModel();
                	 commonModel.save({"usercode":mdboss.usercode,"tid":tid,"targetusercode":targetusercode},{url:mdboss.api.resetpwd,success:function(m, res){
                		 if(res.rc == 1){
                			 mdboss.alert("密码重置成功!");
                		 }else{
                			 mdboss.error(res.msg);
                		 }
                	 },error:function(){
                		 mdboss.error();
                	 }});
        		 }
        	 });
         },
         js_role_perm:function(e){
        	 var v_this = this;
        	 var tid=$(e.currentTarget).data("tid"); 
        	 var commonModel = new mdboss.Model.commonModel();
        	 commonModel.save({"usercode":mdboss.usercode, "targetusercode":tid},{"url":mdboss.api.rolepermlist,success:function(m,res){
        		 if(res.rc == 1){
        			 seajs.use("rolepermselect", function () {
                		 new  mdboss.View.rolepermselectView({dept:res.data.modules, perms:res.data.perms,
                			 "process":res.data.process, "pview":v_this,"selecttype":"radio",
                			 "title":"授权信息","callback":v_this.rolepermback,"rolecode":tid,"showsubmit":true});
                	 });
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 },error:function(){
        		 mdboss.error();
        	 }});
         },
         rolepermback:function(pview){
        	 pview.renderData();
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
        	 if(treeNode.id ==""){
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
        					 {url:mdboss.api.operatedelete,success:function(model,res){
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
        	 seajs.use("operateedit", function () {
        		 new  mdboss.View.operateedit({"tid":tid, "title":"用户详情","view":true});
        	 });
         },
         moduleadd:function(){//新增
        	 var v_this = this;
        	 seajs.use("operateedit", function () {
        		 new  mdboss.View.operateedit({"title":"新增用户","renderData":v_this.renderDataBack,"pview":v_this});
        	 });
         },
         modulebatch:function(){//批量修改
        	 var tids = this.getTids();
        	 if(tids.length >0){
        		 var v_this = this;
        		 seajs.use("operateedit", function () {
        			 new  mdboss.View.operateedit({"tids":tids,"title":"批量修改","renderData":v_this.renderDataBack,"pview":v_this});
        		 });
        	 }else{
        		 mdboss.error("请选择要修改的记录！");
        	 }
         },
         dataedit:function(e){//新增修改记录
        	var v_this = this;
        	var tid=$(e.currentTarget).data("tid"); 
        	 seajs.use("operateedit", function () {
        		 new  mdboss.View.operateedit({"tid":tid,"title":"编辑用户","renderData":v_this.renderDataBack,"pview":v_this});
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
        	 $("#operate-flow-list").find("li  i.icon-checkbox-checked").each(function(index,item){
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
         	$_checkbox=$("#operate-flow-list li span.js-check-box");
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
            					 {url:mdboss.api.operatedeletebatch,success:function(model,res){
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
        	 var $li = $("#operate-flow-list").find("li");
             var $i = $("#operate-flow-list").find("li  i");
             if($this.hasClass("icon-checkbox-checked")){
            	 $i.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	 $li.addClass("selected");
             }else{
            	 $li.removeClass("selected");
            	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
             }
         },
         render:function(){
        	 this.renderData();
         },
         renderData:function(){//渲染列表
        	 v_this=this;
        	 var commonModel=new mdboss.Model.commonModel();        	 
        	 //查询条件
        	 var tmpCondition = new Array();
	            if(this.modulecode != ""){
	            	tmpCondition.push({"key":"workno","operate":"Like","v1":this.modulecode});
	            }
	            if(this.modulename != ""){
	            	tmpCondition.push({"key":"username", "operate":"Like","v1":this.modulename});
	            }
	            if(this.parentcode != ""){
	            	tmpCondition.push({"key":"orgcode", "operate":"EqualTo","v1":this.parentcode});
	            }
	            
	          v_this.condition = tmpCondition;
        	 $("#submit-loading").show();
        	 $("#operate-flow-list").mCustomScrollbar("destroy");
             commonModel.save({ "usercode":mdboss.usercode,"pageNo":v_this.pageNo, "pageSize":v_this.pageSize,    // 每页10条记录
     			"queryCondition": v_this.condition,"orderBy":this.orderBy},{url:mdboss.api.sysoperatelist,success:function(model,res){
     				$("#submit-loading").hide();
     				if(res.rc == 1){
     	            	 var listTemplate = Handlebars.compile(v_this.module_list_html);
     	            	 var listHtml=listTemplate({data:res.data});
     	            	 v_this.$el.find("#operate-flow-list").html(listHtml);
     	            	 
     	            	$("#operate-flow-list").mCustomScrollbar({
     	            		scrollButtons:{ enable:false }, 
	 						theme: "darkblue",
	 						horizontalScroll:false,
	                     });
     	            	 v_this.totalPage =parseInt((res.data.total+mdboss.pageSize-1)/v_this.pageSize);
     	            	 $("#operate_pagination").bs_pagination({ totalPages:v_this.totalPage,currentPage:v_this.pageNo,rowsPerPage:v_this.pageSize,
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
     
     
   //角色选择列表
     mdboss.View.rolelistView = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.rdata=data;
        	 _this.modeuledetail_html = require("text!template/page/system/rolelist.html");
        	 _this.dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                	 _this.$el.find(".jscroll").jScrollPane();
                 }
             }, {"title":"角色选择" ,"width":"750px","height":"500px","icon":"iconfont icon-mdliucheng","resize":function(){
            	 _this.$el.find(".jscroll").jScrollPane();
                 }}).show(function(){
                	 var dialog=this;
                	 $(dialog.dialog).find(".loading").removeClass("loading");
                	 dialog.$html.find(".dialog-content").html(_this.modeuledetail_html).fadeIn();
                	 
                     var commonModel = new mdboss.Model.commonModel();
                     commonModel.save({"usercode":mdboss.usercode},{url:mdboss.api.sysrolelist,success:function(m, res){
                    	 if(res.rc == 1){
                    		 var template=Handlebars.compile($("#role-list-template").html());
                        	 var html=template({"data":res.data.rows});
                        	 $("#role-list").html(html);
                        	 // 回显
                        	 var tmp = _this.rdata.roles;
                        	 if(tmp){
                        		 var len = _this.rdata.roles.length;
                        		 for(var i=0;i<len;i++){
//                        			 console.log(tmp[i]);
//                        			 console.log($("input[name=role_items][value="+tmp[i].rolecode+"]"));
                        			 $("input[name=role_items][value="+tmp[i].rolecode+"]").prop("checked", true);
                        		 }
                        		 _this.permcheck();
                        	 }
                        	dialog.$html.find(".jscroll").jScrollPane();
                        	console.log(dialog.$html.find(".jscroll"));
                    	 }else{
                    		 mdboss.error(res.msg);
                    		 dialog.close();
                    	 }
                     },error:function(){
                    	 mdboss.error();
                    	 dialog.close();
                     }});
             }); 
        	 _this.$el = _this.dialog.$html;
         },
         events: {
        	 'click .js_selected_dept_ok':'submit',//提交
        	 'click .js_selected_dept_cancel':'cancel',//取消
        	 'click #formitemsCheckAll':'checkall',//全选
        	 'click input[name=role_items]':'permcheck',//
 			'click .js_close_perm':'deletePerm',//删除所选的权限
         },
         deletePerm:function(e){
 			_this=this;
 			var $current=$(e.currentTarget);
 			var $parent=$current.parent();
 			$parent.remove();
 			var code = $parent.data("code");
 			$("input[name=role_items][value="+code+"]").prop("checked",false);
 		},
 		permcheck:function(perms){
 			if(perms){
 				for(var i=0; i<perms.length; i++){
 					$("input[name=role_items][value="+perms[i].code+"]").prop("checked",true);
 				}
 			}
 			_this.$el.find("#permselect").html("");
 			var deptshow=new Array();
 			$("input[name=role_items]:checked").each(function(i, item){
 				 var code = $(item).val();
 				 var name = $(item).attr("rn");
 				 deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+code+'">');
      			 deptshow.push('<a id="d'+code+'"  data-code="'+code+'" data-name="'+name+'">'+name+'</a> ');
      			 deptshow.push('<a class="close_file js_close_perm file_remove_file" title="删除">×</a>');
      			 deptshow.push('</span>');
 			});
 			 _this.$el.find("#permselect").html(deptshow.join(''));
 	         $(_this.dialog.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
 		},
         checkall:function(){
        	 $("input[name=role_items]").prop("checked", $("#formitemsCheckAll").prop("checked"));
        	 this.permcheck();
         },
         submit:function(e){//提交
        	 _this=this;
        	 var roles = new Array();
        	 $("input[name=role_items]:checked").each(function(i, item){
        		 roles.push($(item).val());
        	 });
        	 if(roles.length ==0){
        		 _this.dialog.close();
        	 }else{
        		 var commonModel = new mdboss.Model.commonModel();
            	 commonModel.save({"usercode":mdboss.usercode,"targetusercode":_this.rdata.targetusercode,"roles":roles},{url:mdboss.api.userroleadd, success:function(m,res){
              		if(res.rc == 1){
              			mdboss.alert("处理成功!");
              			 _this.dialog.close();
              		}else{
              			mdboss.error(res.msg);
              		}
              	},error:function(){
              		mdboss.error();
              	}});
        	 }
        	
         },
         cancel:function(){
        	 _this=this;
        	 _this.dialog.close();
 		},
     });
     //角色选择列表
     
});