/**
 * 角色选择-
 *  var selectMembers = new Array({code:usercode, name:username}); 
 * 使用方法 传参说明  {title:标题,selecttype:radio/单选（默认多选）,callback:回调方法 function(pview,selectMembers){},
 * pview:上一个view(this)
 * }
 * 
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss"), 
	$ = require("jquery"), 
	Dialog = require("dialog");
	require("scroll");
	require("pagination");
	require("mCustomScrollbar");
//	require("tree")($);
//	require("tree_excheck")($);
	
	//id = usercode , name=usercode
	mdboss.Model.selectMem = Backbone.Model.extend({
		initialize: function(){ },
		defaults: {}
	});	
	/* 缓存查回来的所有选中的成员 */
	mdboss.Collection.membersSelected = Backbone.Collection.extend({
		initialize : function(){ this.on('reset',function(){}); 		},
		comparator: 'id'
	});
	//选中的人员
	var membersSelected =new mdboss.Collection.membersSelected();
	
	//添加选中的用户
	membersSelected.on("add", function(m) {
        var template = Handlebars.compile($("#user-select-template").html());
        var tmp = template({"usercode":m.get("id"),"username":m.get("name")});
		$("#clearSelectedButton").removeClass("hide");
		$("#selectedMember").append(tmp);
	});
	
//	移除选 中的
	membersSelected.on("remove", function(m) {
		$("#selectedMember").empty();
		
		if(this.models.length == 0){
			$("#clearSelectedButton").addClass("hide");
		}
		$("#role-flow-list").find("li i[data-code="+m.get("id")+"]").removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
		 $("#role-flow-list").find("li i[data-code="+m.get("id")+"]").closest("li").removeClass("selected");
    		
		this.each(function(m){
			 var template = Handlebars.compile($("#user-select-template").html());
		     var tmp = template({"usercode":m.get("id"),"username":m.get("name")});
			$("#selectedMember").append(tmp);
		});
	});
	
	/** ----------------组织结构URL ---------------------------------------------------*/
	
	// 角色选择
	mdboss.View.selectRoleView = Backbone.View.extend({
		initialize : function(data) {
			var v_this = this;
			membersSelected.reset();
			this.rdata = data;
			this.pageSize = 10;
			this.pageNo = 1;
			this.orgcode="";//组织编辑
			this.rolename="";//组织名称
			v_this.title = "分配角色";
			if(data && data.title){
				v_this.title = data.title;
			}
			v_this.dialog = new Dialog({ type : "html", value : '<div class="loading"></div>',
				fillCallback : function() {
					$(v_this.dialog).find(".scrollwrapper").jScrollPane();
				}
			}, {
				"title" : v_this.title, "width" : "950px", "height" : "500px", "icon" : "iconfont icon-mdliucheng",
				"resize" : function() {
					$(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
				}
			}).show(function() {		
				var _this = this;
				v_this.dialog_ = this;
				var html = require("text!template/page/common/selectRole.html");
				$(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
				$(_this.dialog).find(".dialog-content-wrap").attr("style","");
				$(_this.dialog).find(".loading").removeClass("loading");
				 
				if(v_this.rdata.selecttype && v_this.rdata.selecttype == "radio"){
           		 	$("#selectAll").hide();
           	 	}
				//加载组织结构
				v_this.orgDefLoadByUrl();
				v_this.showDefaultRole();//回显
//				v_this.renderDataRole("");
			});
			this.$el = v_this.dialog.$html;// 
		},
		roleLoadByUrl:function(treenode){
			this.rolename="";
			$("#search_name").val("");
			this.renderDataRole(treenode.id);
		},
		showDefaultRole:function(){//显示 已选 的
			//添加已选 
			var v_this = this;
			if(v_this.rdata.roles && v_this.rdata.roles.length>0){
				var length = v_this.rdata.roles.length;
				var roles = v_this.rdata.roles;
				for(var j=0; j<length ; j++){//roles
	           		membersSelected.add(new mdboss.Model.selectMem({"id":roles[j].rolecode,"name":roles[j].rolename}));
				}
			}
			v_this.renderDataRole("");
		},
		showSelectRole:function(data){//回显
			var r_this = this;
			if(data && data.length>0){
				var len = data.length;
				var allFlag = true;
				var allFlag1 = true;
				for(var i=0; i<len ; i++){//data
					if(allFlag1 && i>0 && allFlag){
						allFlag = false;
					}
					allFlag1 = true;
					$.each(membersSelected.models,function(index, m){
						if(m.get("id") == data[i].rolecode){
								r_this.$el.find("#role-flow-list").find("li i[data-code="+data[i].rolecode+"]").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
								r_this.$el.find("#role-flow-list").find("li i[data-code="+data[i].rolecode+"]").closest("li").addClass("selected");
				           		allFlag1 = false;
				           		return false; 
							}
					});
				}
				if(allFlag){//全选
					r_this.$el.find("#check-all-role").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
				}
			}
		},
		renderDataRole :function(orgcode){//获取角色列表
			//渲染列表
       	 v_this=this;
       	 this.orgcode = orgcode;
       	 var commonModel=new mdboss.Model.commonModel();
       	 $("#check-all-role").removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
       	 //查询条件
       	 var tmpCondition = new Array();
	            if($("#search_name").val() != ""){
	            	tmpCondition.push({"key":"rolename", "operate":"Like","v1":$("#search_name").val()});
	            }
	            if(this.orgcode){
	            	tmpCondition.push({"key":"orgcode", "operate":"EqualTo","v1":this.orgcode});
	            }
	            v_this.condition = tmpCondition;
	           $("#submit-loading").show();
	           $("#role-flow-list").mCustomScrollbar("destroy");
			   $("#role-flow-list").html('<div class="loading"></div>');
            commonModel.save({ "usercode":mdboss.usercode,"pageNo":this.pageNo, "pageSize":v_this.pageSize,    // 每页10条记录
    			"queryCondition": v_this.condition,"orderBy":"createtime desc,rolecode,roletype,rolename"},{url:mdboss.api.sysrolelist,success:function(model,res){
    				$("#submit-loading").hide();
    				if(res.rc == 1){
    	            	 var listTemplate = Handlebars.compile($("#role-list-template").html());
    	            	 if(v_this.rdata.selecttype && v_this.rdata.selecttype == "radio"){
    	            		 listTemplate = Handlebars.compile($("#role-list-only-template").html());
    	            	 }
    	            	 var listHtml=listTemplate({data:res.data});
    	            	 v_this.$el.find("#role-flow-list").html(listHtml);
    	            	 v_this.showSelectRole(res.data.rows);//回显
    	            	 $("#role-flow-list").mCustomScrollbar({scrollButtons:{
    	 						enable:false }, theme: "darkblue",horizontalScroll:false,
    	                  });
    	            	v_this.totalPage =parseInt((res.data.total+mdboss.pageSize-1)/v_this.pageSize);
	            	    $("#role_pagination").bs_pagination({ totalPages:v_this.totalPage,currentPage:v_this.pageNo,
	   	            		rowsPerPage:v_this.pageSize,
	   	            		onChangePage: function(event, data) {
	   	            			v_this.pageNo = data.currentPage;
	   	            			v_this.pageSize = data.rowsPerPage;
	   	            			v_this.renderDataRole(v_this.orgcode);
	               			},
	               			totalRows:res.data.total,
	               			showGoToPage: true,
	   	       				showRowsPerPage : true,
	   	       				showRowsInfo : true,
//	   	       				showRowsDefaultInfo : true,
	   	            	 });
    				}else{
    					mdboss.error(res.msg);
    				}
    			},error:function(){
    				$("#submit-loading").hide();
    				mdboss.error();
    			}});
		},
		orgDefLoadByUrl:function(){//拉取组织结构  ;
			var v_this = this;
			//未加载过
			var commonModel = new mdboss.Model.commonModel();
			commonModel.save({"usercode":mdboss.usercode,"type":"all","pageNo":1},{url:mdboss.api.orgs ,success:function(model, data){
				if(data.rc == 1){
					var template_html = '<div id="org-org-list"><ul id="tree_org" class="ztree""></ul></div>';
	    			$('#org-tree').append(template_html);	            			
	    			// 添加树结构
	    			 var setting = { data: { simpleData: { enable: true } },
	                  			callback:{ 
	                  				beforeClick:function(treeId,treeNode) { 
	                  					v_this.pageNo=1;
	                  					v_this.roleLoadByUrl(treeNode);} 
	                  			},
                      			 view :{  
                      	            showIcon: true,  
                      	            fontCss:function(treeId,treeNode){
                      	      			return (!!treeNode.highlight) ? {color:"red", "font-weight":"bold"}:{color:"#333", "font-weight":"normal"};  
                      	      		}
                      	         } 
	                  		};
	                 var zNodes=new Array();
	                zNodes.push({"id":"org--1","pId":"","name":"根节点","open":true,"icon":"images/orgs.png"});
	             	$.each(data.data.rows,function(index,item){
	             		var treeNode = {"id":item.orgcode,"pId":item.parentcode,"name":item.orgname,"icon":"images/org.png"};
	             		zNodes.push(treeNode);
	             	});
	                $.fn.zTree.init($("#tree_org"), setting, zNodes);
	                $("#org-tree").mCustomScrollbar({scrollButtons:{
 						enable:false }, theme: "darkblue",horizontalScroll:false,
                    });
	                if(data.data.rows==undefined || data.data.rows.length==0){
	                	mdboss.error("加载组织结构失败！");
	                	v_this.dialog_.close();
	                }
				}else{
					mdboss.error(data.msg);
					v_this.dialog_.close();
				}
			},error:function(){
				mdboss.error( );
				v_this.dialog_.close();
			}});
		},//end 加载组织结构
		events:{
			"keyup #search_name":"searchMemberBy",
			"click #search_name_by":"searchMemberBy",
			"click .j_select_one":"selectOne",//单选
			
			"mouseover .entity-item":"showSelectDelete", //显示删除X
			"mouseout .entity-item":"hideSelectDelete", //隐藏删除X
			"click #clearSelectedButton":"clearShowSelect",//删除所有选中的人
			"click .j_user_ok":"submitUsers",//确定
			"click .j_user_cancel":"cancelUser",//取消
			"keypress .js_search_org_class":"changeColor",//大类搜索
			"click .js_icon_search":"icon_search"	,
			
			"click .remove_user":"removeSelectMan",//删除所选的人
			
			'click #check-all-role':'checkall',//全选
			'click #role-flow-list li span.js-check-box i':'checkbox',//checkobx 选中取消
		},
		clearShowSelect:function(){//删除所有选中的人
			membersSelected.reset();
			$this= $("#check-all-role");
	       	var $li = $("#role-flow-list").find("li");
            var $i = $("#role-flow-list").find("li  i");
            $li.removeClass("selected");
            $this.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
          	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
			$("#selectedMember").empty();
			$("#clearSelectedButton").addClass("hide");
			$("#userList li").removeClass("s_on");
		},
		checkbox:function(e){//选中取消
       	 	$_this=$(e.currentTarget);
        	$_checkbox=$("#role-flow-list li span.js-check-box");
        	var code = $_this.data("code");
			var name = $_this.data("name");
        	if($_this.hasClass("icon-checkbox-checked")){
        		$_this.closest("li").removeClass("selected");
        		$_this.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
        		if($("#check-all-role").hasClass("icon-checkbox-checked")){
        			$("#check-all-role").addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
        		}
        		membersSelected.remove(new mdboss.Model.selectMem({"id":code,"name":name}));
        	}else{
        		$_this.closest("li").addClass("selected");
        		$_this.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
        		if($_checkbox.find("i").length==$_checkbox.find("i.icon-checkbox-checked").length){
            		$("#check-all-role").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	}
        		membersSelected.add(new mdboss.Model.selectMem({"id":code,"name":name}));
        	} 
        },
		checkall:function(e){//全选
	       	e.preventDefault();
	       	$this= $("#check-all-role");
	       	$this.toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
	       	var $li = $("#role-flow-list").find("li");
            var $i = $("#role-flow-list").find("li  i");
            if($this.hasClass("icon-checkbox-checked")){
	           	 $i.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
	           	 $li.addClass("selected");
	           	 $.each($("#role-flow-list").find("li i"), function(i, item){
	           		var code = $(item).data("code");
	    			var name = $(item).data("name");
	           		membersSelected.add(new mdboss.Model.selectMem({"id":code,"name":name}));
	           	 });
            }else{
	           	 $li.removeClass("selected");
	           	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
	           	$.each($("#role-flow-list").find("li i"), function(i, item){
	           		var code = $(item).data("code");
	    			var name = $(item).data("name");
	           		membersSelected.remove(new mdboss.Model.selectMem({"id":code,"name":name}));
	           	 });
            }
        },
		removeSelectMan: function(e){//删除所选的人
			var $this  = $(e.currentTarget);
			var usercode = $this.attr("code");
			var username = $this.attr("value");
			membersSelected.remove(new mdboss.Model.selectMem({"id":usercode,"name":username}));
		},
		icon_search:function(e){//搜索组织
			 _this=this;
		    var key="name";
		    var value=$(e.currentTarget).val();
		    _this.updateNodes(false);  
		    if(value != ""){  
		        var treeObj = $.fn.zTree.getZTreeObj("tree_org");  
		        _this.nodeList = treeObj.getNodesByParamFuzzy(key, value);  
		        if(_this.nodeList && _this.nodeList.length>0){  
		            _this.updateNodes(true);  
		        }  
		    }  
		    $search_class.focus();
		},
		changeColor:function(e){////搜索组织
			 _this=this;
			 if(e.which==13){
				 _this.icon_search(e);
			 }
		},
		updateNodes:function(highlight,classtype) {  //搜索组织
			 _this=this;
			    var treeObj = $.fn.zTree.getZTreeObj("tree_org");  
			    if(_this.nodeList!=undefined&&_this.nodeList.length>0){
			        for( var i=0; i<_this.nodeList.length;  i++) {  
				        _this.nodeList[i].highlight = highlight;  
				        treeObj.updateNode(_this.nodeList[i]); //更新选中样式
		               treeObj.expandNode(_this.nodeList[i], true, true, true);//展开选中
		               treeObj.selectNode(_this.nodeList[i]);

				    }  
			    }
		},
		cancelUser:function(){ //取消
			membersSelected.reset();
			this.dialog_.close();
		},
		selectOne:function(e){//单选 TODO
			var $this  = $(e.currentTarget);
			var rolecode = $this.data("code");
			var rolename = $this.data("name");
			
			var v_this =this;
			//回调方法 -------------------------------------------------
			if(v_this.rdata && v_this.rdata.callback){
				var callback = v_this.rdata.callback;
				var callbackFn = typeof callback == "function" ? callback : function () { };
				callbackFn(v_this.rdata, rolecode, rolename);
			}
			//回调方法 -------------------------------------------------end
			this.dialog_.close();
		},
		submitUsers:function(e){ //点击确定 TODO
			var v_this =this;
			//回调方法 -------------------------------------------------
			if(v_this.rdata && v_this.rdata.callback){
				var callback = v_this.rdata.callback;
				var callbackFn = typeof callback == "function" ? callback : function () { };
				var selectMembers = new Array();
				membersSelected.each(function(m){
//					selectMembers.push({"code":m.get("id"),"name":m.get("name")});
					selectMembers.push(m.get("id"));
				});
				if(selectMembers.length==0){
					mdboss.error("请选择要分配的角色!");
					return;
				}
				callbackFn(v_this.rdata, selectMembers);
			}
			//回调方法 -------------------------------------------------end
			this.dialog_.close();
		},
		showSelectDelete:function(e){//显示删除X
			 e.preventDefault();
			 var $this  = $(e.currentTarget);
			 $this.find("button").removeClass("hide");
		},
		hideSelectDelete:function(e){//隐藏删除X
			e.preventDefault();
			 var $this  = $(e.currentTarget);
			 $this.find("button").addClass("hide");
		},
		searchMemberBy:function(e){ //搜索 按用户名称搜索
			var v_this = this;
			var $this  = $(e.currentTarget);
			var val = $this.val();
			if(val == ""){
				//mdboss.error("请输入您要搜索的内容!");
				return;
			}
			if(e.type == "keyup"){
				if(e.which == 13){
					v_this.rolename = val;
					v_this.pageNo=1;
					v_this.renderDataRole("");
				}
			}else{
				v_this.pageNo=1;
				v_this.rolename = val;
				v_this.renderDataRole("");
			}
		},
	});
	
});