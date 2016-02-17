/**
 * 人员选择-
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
	require("mCustomScrollbar");
	
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
//		console.log(m);
        var template = Handlebars.compile($("#user-select-template").html());
        var tmp = template({"usercode":m.get("id"),"username":m.get("name"),"li_id":m.get("li_id")});
		 
		$("#addUserToGroupButton").removeClass("hide");
		$("#clearSelectedButton").removeClass("hide");
		$("#selectedMember").append(tmp);
	});
	
//	移除选 中的
	membersSelected.on("remove", function(m) {
		$("#selectedMember").empty();
		if(this.models.length == 0){
			$("#addUserToGroupButton").addClass("hide");
			$("#clearSelectedButton").addClass("hide");
		}
		this.each(function(m){
			 var template = Handlebars.compile($("#user-select-template").html());
		     var tmp = template({"usercode":m.get("id"),"username":m.get("name"),"li_id":m.get("li_id")});
			$("#selectedMember").append(tmp);
		});
	});
	
	/** ----------------组织结构URL ---------------------------------------------------*/
	
	// 人员选择
	mdboss.View.memberselectView = Backbone.View.extend({
		initialize : function(data) {
			var v_this = this;
			this.rdata = data;
			membersSelected.reset();
			v_this.title = "人员选择";
			if(data && data.title){
				v_this.title = data.title;
			}
			v_this.dialog = new Dialog({ type : "html", value : '<div class="loading"></div>',
				fillCallback : function() {
					$(v_this.dialog).find(".scrollwrapper").jScrollPane();
				}
			}, {
				"title" : v_this.title, "width" : "1000px", "height" : "500px", "icon" : "iconfont icon-mdliucheng",
				"resize" : function() {
					$(v_this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
				}
			}).show(function() {		
				var _this = this;
//				v_this.dialog_ = this;
				var html = require("text!template/page/member/selectMan.html");
				$(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
				$(_this.dialog).find(".dialog-content-wrap").attr("style","");
				$(_this.dialog).find(".loading").removeClass("loading");

				if(v_this.rdata && v_this.rdata.selecttype =="radio"){//单选
    				$("#checkAll").addClass("hide");
    			}
				$("#userSelector-multi").mCustomScrollbar({scrollButtons:{
						enable:false }, theme: "darkblue",horizontalScroll:false,
				});
				//加载组织结构
				v_this.orgDefLoadByUrl();
			});
			this.$el = v_this.dialog.$html;// 
		},
		orgDefLoadByUrl:function(value){//拉取组织结构  ;
			var v_this = this;
			//未加载过
			$("#org-tree").mCustomScrollbar("destroy");
			$("#org-tree").html('<div class="loading"></div>');
			var commonModel = new mdboss.Model.commonModel();
			commonModel.save({"usercode":mdboss.usercode,"type":"all","pageNo":1,"pageSize":0, "keywork":value},
					{url:mdboss.api.orgs, success:function(model, data){
				if(data.rc == 1){
					var template_html = '<div id="org-org-list"><ul id="tree_org" class="ztree""></ul></div>';
	    			$('#org-tree').append(template_html);	            			
	    			// 添加树结构
	    			 var setting = { data: { simpleData: { enable: true } },
	                  			callback:{ 
	                  				beforeClick:function(treeId,treeNode) { 
	                  					v_this.orgMember(treeNode);} 
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
	             	
	                 var loadMember = true;//是否加载过
		             var selectNodeId = null;
		             var treeNode_ = null;
		             
	                 $.each(data.data.rows,function(index,item){
	             		var treeNode = {"id":item.orgcode,"pId":item.parentcode,"name":item.orgname,"icon":"images/orgs.png"};
	             		
	             		//如果同当前组织的 编码一致则加载,, 否则加载第一个
	             		if( mdboss.getUserinfo().orgcode == item.orgcode){
	             			v_this.orgMember(treeNode);
	             			loadMember = false;
	             			selectNodeId = item.orgcode;
	             		}
	             		if(index == 0){
//	             			v_this.orgMember(treeNode);
	             			treeNode_ = treeNode;
	             			selectNodeId = item.orgcode;
	             		}
	             		zNodes.push(treeNode);
	             	});
	                 
	                 if(loadMember){
	             			v_this.orgMember(treeNode_);
		             }
	                 
	               var treeObj = $.fn.zTree.init($("#tree_org"), setting, zNodes);
	               treeObj.selectNode(treeObj.getNodeByParam("id", selectNodeId));//设置默认选中的节点
	               
	                if(value){
	             		var nodeList = treeObj.getNodesByParamFuzzy("name", value);  
	             		if(nodeList && nodeList.length>0){  
	        			   for( var i=0; i<nodeList.length;  i++) {  
	        				        nodeList[i].highlight = true; 
	        				        treeObj.updateNode(nodeList[i]); //更新选中样式
	        		               treeObj.expandNode(nodeList[i], true, true, true);//展开选中
	        		               treeObj.selectNode(nodeList[i]);
	        			    }
	             		}  
	             	}
	                
	                $("#org-tree").mCustomScrollbar({scrollButtons:{
 						enable:false }, theme: "darkblue",horizontalScroll:false,
	                });
	                
	                if(data.data.rows==undefined || data.data.rows.length==0){
	                	mdboss.error("加载组织结构失败！");
	                	v_this.dialog_.close();
	                }
	                //选中第一个节点
//					$(".ztree").each(function(){
//						$(this).find("li").each(function(i){
//							if(i==0){
//								$(this).find("a:first").addClass("curSelectedNode");
//							}
//						});
//					});
				}else{
					mdboss.error(data.msg);
					v_this.dialog_.close();
				}
			},error:function(){
				mdboss.error( );
				v_this.dialog_.close();
			}});
		},//end 加载组织结构
		userItemCard:function(e){//用户卡片
			var $this  = $(e.currentTarget);
			 var usercode = $this.attr("uc");
			 var username = $this.attr("vel");
			 mdboss.usercard(usercode, username);
		},
		events:{
			"click .user-item":"userItemCard",
			"click .highlight":"searchMemberByPingyin",//
			"keyup #search_name":"searchMemberBy",
			"click #search_name_by":"searchMemberBy",
			
			"click #addUserToGroupButton":"showCreateGroup", //显示创建群组名称
			"click #addConfirmButton":"createGroup", //创建群组
			"click #addCancelButton":"cancelCreateGroup", //取消创建群组
			"mouseover .entity-item":"showSelectDelete", //显示删除X
			"mouseout .entity-item":"hideSelectDelete", //隐藏删除X
			"click #clearSelectedButton":"clearShowSelect",//删除所有选中的人
			"click #employee-list .mCSB_container li":"selectMemberObO",//选人
			"click input[name=userids]":"checkUsers",//选人及取消选人
			"click #checkAll":"checkUserAll",//全选/全不选
			"click .j_user_ok":"submitUsers",//确定
			"click .j_user_cancel":"cancelUser",//取消
			"keypress .js_search_org_class":"changeColor",//大类搜索
			"click .js_icon_search":"icon_search"	,
			
			"click .remove_user":"removeSelectMan",//删除所选的人
			"click .selectone":"selectone",//单选
		},
		selectone:function(e){//单选
			var $this  = $(e.currentTarget);
			var usercode = $this.attr("code");
			var username = $this.attr("value");
			membersSelected.reset();
			$("#selectedMember").empty();
			membersSelected.add(new mdboss.Model.selectMem({"id":usercode,"name":username}));
		},
		removeSelectMan: function(e){//删除所选的人
			e.preventDefault();
			var $this  = $(e.currentTarget);
			var usercode = $this.attr("code");
			var username = $this.attr("value");
			var li_id=$this.attr("li_id");
			
			$("input[name=userids][id='"+li_id+"']").prop("checked",false).closest("li").removeClass("s_on");
			
			membersSelected.remove(new mdboss.Model.selectMem({"id":usercode,"name":username,"li_id":li_id}));
		},
		icon_search:function(e){//搜索组织
			 _this=this;
//		    var key="name";
		    var value=$(e.currentTarget).val();
		    _this.orgDefLoadByUrl(value);
//		    _this.updateNodes(false);  
//		    if(value != ""){  
//		        var treeObj = $.fn.zTree.getZTreeObj("tree_org");  
//		        _this.nodeList = treeObj.getNodesByParamFuzzy(key, value);  
//		        if(_this.nodeList && _this.nodeList.length>0){  
//		            _this.updateNodes(true);  
//		        }  
//		    }  
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
			this.dialog.close();
		},
		submitUsers:function(e){ //点击确定
			var v_this =this;
			//回调方法 -------------------------------------------------
			if(v_this.rdata && v_this.rdata.callback){
				var callback = v_this.rdata.callback;
				var callbackFn = typeof callback == "function" ? callback : function () { };
				var selectMembers = new Array();
				membersSelected.each(function(m){
					selectMembers.push({"code":m.get("id"),"name":m.get("name")});
				});
				if(selectMembers.length==0){
					mdboss.error("请选择成员!");
					return;
				}
				callbackFn(v_this.rdata.pview, selectMembers);
			}
			//回调方法 -------------------------------------------------end
			this.dialog.close();
		},
		checkUserAll:function(e){//全选 \全不选
			$("input[name=userids]").each(function(){
				var usercode = $(this).attr("code");
				var username = $(this).attr("value");
				if($("#checkAll").prop("checked")){//全选
					membersSelected.add(new mdboss.Model.selectMem({"id":usercode,"name":username}));
				}else{//全不选
					membersSelected.remove(new mdboss.Model.selectMem({"id":usercode,"name":username}));
				}
				$(this).prop("checked",  $("#checkAll").prop("checked"));
			});
		},
		selectMemberObO:function(e){
			 console.log("点击选单个人2");
			 e.preventDefault();
			 var $this  = $(e.currentTarget);
			 
			 if($this.has("a.select_show").length>0){//带checkbox的多选
				 $this.find("a.select_show input[type='checkbox']").trigger("click");
			 }else{//无checkbox的单选
				 $this.addClass("s_on").siblings().removeClass("s_on");
			 }
			 

			 if($("#chooseModel").val()=="false"){//单选
				 $("#selectedMember").empty();
				 memberCol.reset(); 
			 }
		},
		checkUsers:function(e){//选人及取消选人 ---多选
			var $this  = $(e.currentTarget);
			console.log($this);
			var usercode = $this.attr("code");
			var username = $this.attr("value");
			var li_id     =$this.attr("id");
			
			e.stopPropagation();//阻止模拟点击checkbox事件冒泡
			$this.closest("li").toggleClass("s_on");
			
			
			if($this.prop("checked")){
				var flag = true;
				$("input[name='userids']").each(function(i){//判断是否全选了
					if(!$(this).prop("checked")){
						flag=false;
					}
				});
				if(flag){
					$("#checkAll").prop("checked", true);
				}
				
				membersSelected.add(new mdboss.Model.selectMem({"id":usercode,"name":username,"li_id":li_id}));
			}else{
				membersSelected.remove(new mdboss.Model.selectMem({"id":usercode,"name":username,"li_id":li_id}));
				$("#checkAll").prop("checked", false);
			}
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
		clearShowSelect:function(){//删除所有选中的人
			membersSelected.reset();
			$("input[name=userids]").prop("checked", false);
			$("#selectedMember").empty();
			$("#addUserToGroupButton").addClass("hide");
			$("#clearSelectedButton").addClass("hide");
			$("#userList li").removeClass("s_on");
		},
		cancelCreateGroup:function(){//取消创建群组
			$("#add-group-input-text").hide();
			$("#addConfirmButton").addClass("hide");
			$("#addCancelButton").addClass("hide");
			$("input[name=userids]").prop("checked",false);
		},
		createGroup:function(e){//创建群组
			var users = new Array();
			membersSelected.each(function(m){
				//console.log(m.get("usercode").indexOf("+") + "---");
//				if(m.get("usercode").indexOf("+") <1)
					users.push({"usercode":m.get("usercode"),"username":m.get("username")});
			});
			if($("#add-group-input-text").val() == ""){
				mdboss.error("请输入群组名称");
				return ;
			}
			var createGroup = new mdboss.Model.commonModel({
				"groupname":$("#add-group-input-text").val(),   //用户组名称
				"usercode":mdboss.usercode, "members":users,  "groupdesc":""
			});
			createGroup.save({},{url:mdboss.api.createmembergroup, success:function(m, data){
				if(data.rc == "1"){
					mdboss.notifyTips("创建成功");
					$("#add-group-input-text").hide();
					$("#addConfirmButton").addClass("hide");
					$("#addCancelButton").addClass("hide");
				}else{
					mdboss.error(data.msg);
				}
			},error:function(){
				mdboss.error( );
			}});
		},
		
		showCreateGroup:function(){//创建群组
			$("#add-group-input-text").show();
			$("#addConfirmButton").removeClass("hide");
			$("#addCancelButton").removeClass("hide");
		},
		searchMemberBy:function(e){ //搜索 按用户名称搜索
			var v_this = this;
			var $this  = $(e.currentTarget);
			var val = $this.val();
			if(val =="")return;
			if(e.type == "keyup"){
				if(e.which == 13){
					v_this.orgMember({"name":"全部","username":val});
				}
			}else{
				v_this.orgMember({"name":"全部","username":val});
			}
		},
		searchMemberByPingyin:function(e){
			var v_this = this;
			var $this  = $(e.currentTarget);
			$this.siblings().removeClass('active');
			$this.addClass("active");

//			$("#checkAll").prop("checked",false);
			$("#searchFlag").val(true); 
			var pingyin = $this.attr("id");
			v_this.orgMember({"name":"全部","pinyin":pingyin});
		},// 按拼音搜索
		orgMember:function(treeNode){//更改组织结构 
			var v_this = this;
//			$(".highlight").removeClass("highlight");
//			$("#ALL").addClass("highlight");
			$("#checkAll").prop("checked",false);
			if(treeNode == null){
				$("#checkAll").addClass("hide");
				return;
			}
			$("#ALL").text(treeNode.name);
			// 加载用户数据
			var reqData = {"usercode":mdboss.usercode,"pageNo":1, "pageSize":0};
			 var tmpCondition = new Array();
			if(treeNode && treeNode.id){
				$("#search_name").val("");
				$(".highlight").removeClass("active");
				tmpCondition.push({"key":"orgcode", "operate":"EqualTo","v1": treeNode.id});
			}else{
				if(treeNode && treeNode.username){
					$(".highlight").removeClass("active");
					reqData.keyword= treeNode.username;
				}else{
					if(treeNode.pinyin){
						tmpCondition.push({"key":"pinyin", "operate":"Startwith","v1": treeNode.pinyin.toLowerCase()});
						reqData.keyword= $("#search_name").val();
					}
				}
			}
			reqData.queryCondition = tmpCondition;
			$("#employee-list").mCustomScrollbar("destroy");
			$("#employee-list").html('<div class="loading"></div>');
			var commonModel = new mdboss.Model.commonModel();
			commonModel.save(reqData,{url:mdboss.api.members, success:function(model, data){
				if(data.rc == 1){
					if(data.data!=undefined && data.data.rows!=undefined){
//						var tmp = data.data.rows;
//		    			//处理加选中状态  
//		    			for(var i=0; i<tmp.length; i++){//拼音
//		    				var pinyin = tmp[i].pinyin;
//		    				if(pinyin && pinyin.length>0){
//		    					$("#"+pinyin.substring(0,1).toUpperCase()).addClass("highlight");
//		    				}
//		    			}
		    			//
		    			var tmpl = $("#users-template").html();//多选 
		    			if(v_this.rdata && v_this.rdata.selecttype =="radio"){
		    				tmpl = $("#users-template-2").html();//单选
		    			}
		                var template = Handlebars.compile(tmpl);
		                $('#employee-list').html(template({"baseUrl":baseConfig.base,"members":data.data.rows}));
		                $("#employee-list").mCustomScrollbar({scrollButtons:{
	 						enable:false }, theme: "darkblue",horizontalScroll:false,
	                  });
					}//end if data.dtat.rows undefined		
					else{
						
					}
				}else{
					mdboss.error(data.msg);
				}
			},error:function(){
				mdboss.error();
			}}); //end 加载用户
		},
	});
});