/**
 * 人员选择
 * 使用方法
 * new mdboss.View.membersView({model:new mdboss.Model.showType( 
		 {obj:[
		    {"dataclass":"部门","dataurl":"","dataytype":"tree"}],
		    selectedvalues:[{code:'',name:''},{code:'',name:''}],
		    share:processintid,
		    "callbacks":function(){}, "selecttype":"checkbox","element":"#"}
	)});
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss"), 
	$ = require("jquery"), 
	Dialog = require("dialog");
	require("scroll");
	require("mCustomScrollbar");
//	require("tree")($);
//	require("tree_excheck")($);
	
	 /* 创建群组*/
	 mdboss.Model.createUserGroups = Backbone.Model.extend({
		 url:mdboss.api.createmembergroup,
		 initialize: function(){  
		 },  
		 defaults: {  
		 }
	 });
	 
	 /* 获取共享 拉取组织结构的url*/
	 mdboss.Model.shareTask = Backbone.Model.extend({
		 url:mdboss.api.processShare,
		 initialize: function(){  
		 },  
		 defaults: {  
			"usercode":"",    
		    "tousers":[],
		    "processinstcode":"",
		    "taskcode":""  
		 }
	 });
	 
	/* 组织结构-部门 */
	mdboss.Model.showHandlerType = Backbone.Model.extend({
		initialize: function(){ },  
        defaults: {}
	});
	
	/* 组织结构-部门 */
	mdboss.Model.orgD = Backbone.Model.extend({
		url:mdboss.api.orgs,
		initialize: function(){  },  
        defaults: {  }
	});
	
	/* 人员选择 */
	mdboss.Model.selectM = Backbone.Model.extend({
		initialize: function(){ },
		defaults: {
			id:"", username:'',  usercode: '', firstchar: '', email: '',"li_id":""
        }
	});	
	
	/* 选中的成员集合 */
	mdboss.Collection.selectMC = Backbone.Collection.extend({
		model:mdboss.Model.selectM,
		initialize : function(){
			this.searchFlag =false;
			this.on('reset',function(){ });
		},
		comparator: 'real_code'
	});
	var memberCol =new mdboss.Collection.selectMC();//当前选中的人
	//添加选中的
	memberCol.on("add", function(m) {
		var tmp = '<span id="'+m.get("real_code")+'" class="file-show"><a  data-value="'+m.get("usercode")+'">'+m.get("username")+'</a><a  type="button" id="'+m.get("real_code")+'" uc="'+m.get("usercode")+'" name="'+m.get("username")+'" li_id="'+m.get("li_id")+'" class="select_x close_file  file_remove_file" title="删除">×</a>&nbsp;</span>';

		if($("#searchFlag").val() == "false"){//未进行搜索
			var real_code = m.get("real_code");
			var pcode = real_code.split("_")[0];
			if(pcode == $("#checkAll").val()){
				$('input[name=userids][uc='+m.get("usercode")+']').prop("checked", true); 
			}
			if( m.get("id") == $("#checkAll").val()){//是全选
				$('input[name=userids]').prop("checked", true); 
				$("#checkAll").prop("checked", true);
			}
			if(m.get("allcheck")){
				$("input[name=all_check][value="+m.get("id")+"]").click();//回显示勾选全部组织或本组织等等
			}
		}else{
			
		}
		
		$("#addUserToGroupButton").removeClass("hide");
		$("#clearSelectedButton").removeClass("hide");
		$("#selectedMember").append(tmp);
	});
	//	移除选 中的
	memberCol.on("remove", function(m) {
		$("#selectedMember").empty();
		if(this.models.length == 0){
			$("#addUserToGroupButton").addClass("hide");
			$("#clearSelectedButton").addClass("hide");
		}
		this.each(function(m){
			var html = '<span id="'+m.get("real_code")+'" style="margin-left:10px;" class="file-show"><a  data-value="'+m.get("usercode")+'">'+m.get("username")+'</a><a id="'+m.get("real_code")+'" uc="'+m.get("usercode")+'" name="'+m.get("username")+'" li_id="'+m.get("li_id")+'" class="select_x close_file  file_remove_file" title="删除">×</a>&nbsp;</span>';
			$("#selectedMember").append(html);
		});
		if($("input[id=checkAll][uc='"+m.get("usercode")+"']").prop("checked")){
			$("input[id=checkAll][uc='"+m.get("usercode")+"']").click();
			$("input[id=checkAll][uc='"+m.get("usercode")+"']").prop("checked",false);
		}
		
	});
	
	/** -----------------组织结构URL --------------------------------------------------*/
	
	mdboss.Model.orgDef = Backbone.Model.extend({ //
		initialize: function(){ },
		defaults: {
			"dataclass": "部门", 
            "dataurl": "api/member/orgs.json", 
            "f_id": "orgcode", 
            "f_name": "orgname", 
            "f_pid": "parentcode",
            "dataytype": "tree",
            "first_id": "",
            "load":false
        }
	});	
	
	mdboss.Collection.orgDefList = Backbone.Collection.extend({
		model:mdboss.Model.orgDef,
		initialize : function(){ },
		comparator: 'dataclass'
	});
	var orgDefList = new mdboss.Collection.orgDefList();
	/** ----------------组织结构URL ---------------------------------------------------*/
	
	
	// 人员选择
	mdboss.View.handlerView = Backbone.View.extend({
		initialize : function() {
			var v_this = this;
			this.memberAll =[];
			memberCol.reset();
			orgDefList.reset();
			var dialog = new Dialog({ type : "html", value : '<div class="loading"></div>',
				fillCallback : function() {
					$(this).find(".scrollwrapper,.jscroll").jScrollPane({"autoReinitialise": true});
				}
			}, {
				"title" : "人员选择", "width" : "1000px", "height" : "500px", "icon" : "iconfont icon-mdliucheng",
				"resize" : function() {
					$(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane({"autoReinitialise": true});
				}
			}).show(function() {		
				var _this = this;
				v_this.dialog_ = this;
				var html = require("text!template/page/member/selectMember.html");
				$(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
				$(_this.dialog).find(".dialog-content-wrap").attr("style","");
				$(_this.dialog).find(".loading").removeClass("loading");
				
				//判断是否多选 
				if(v_this.model.get("selecttype")=="radio"){ //单选
					$("#group-user-checkall").addClass("hide");
					$("#chooseModel").val("false");
				}else{
					$("#chooseModel").val("true");
				}
				if(v_this.model.get("huiqian")){
					$(".huiqian").show();
				}else{
					$(".highlight").hide();
					$(".select-member-all").hide();
				}
				var currentcode=v_this.model.get("currentorgcode");
				if(currentcode){
					$("#org_current").attr("data-name",currentcode);
				}
				var objList = v_this.model.get("obj");
				//------------添加URL到缓存---------------------------------------
				for(var k=0; k< objList.length; k++){//
					var active = "";
					if(k==0){
						active ="active";
						$("#search_class").attr("classtype",objList[k].fieldmapping.id);//指定搜索大类的标识
					}
					var dataclass = objList[k].dataclass;//部门”，“项目”，“角色”，“群组 ==
					var dataytype = objList[k].dataytype;//
					var dataUrl =   objList[k].dataurl;//
					var fieldMapping = objList[k].fieldmapping;//
					var propId = fieldMapping.id;//id 属性名称
					var org_tmpl = $("#org-template").html();
                    var orgTemplate = Handlebars.compile(org_tmpl);
        			$('.e-title-tab').append(orgTemplate({"active":active,"org_id":propId,"org_name":dataclass}));
        			
					var def = new mdboss.Model.orgDef();
					def.set("dataclass",dataclass);
					def.set("dataurl", baseConfig.base+dataUrl);
					def.set("f_id",fieldMapping.id);//id 属性名称
					def.set("f_name",fieldMapping.name);//name 名称
					def.set("f_pid",fieldMapping.pid);//父节点名称
					def.set("dataytype",dataytype);// 结构
					def.set("load",false);//是否已加载
					
					$("#userSelector-multi").mCustomScrollbar({scrollButtons:{
 						enable:false }, theme: "darkblue",horizontalScroll:false,
					});
					orgDefList.add(def);
					if(k ==0){
						v_this.orgDefLoadByUrl(dataclass);
					}
				}			
				$(_this.dialog).find(".scrollwrapper,.jscroll").jScrollPane({"autoReinitialise": true});
				//--------------添加URL到缓存----------------------------------------
			});
			this.$el = dialog.$html;// 
//			this.$el.on("resizeSroll", "#user-container.scrollwrapper",function(e){
//				console.log("scrollwrapperscrollwrapperscrollwrapper");
//			});
		},
		orgDefLoadByUrl:function(dataclass, value){//拉取组织结构  ; dataclass 部门 群组 .. 	//
			var v_this = this;
			orgDefList.each(function(m){
				if( m.get("dataclass") == dataclass){
//					console.log(dataclass);
					var dataUrl = m.get("dataurl");
					 
					var l = dataUrl.indexOf("=")+1;
					var reqData =eval("("+ dataUrl.substring(l, dataUrl.length) +")" );
					var reqUrl = dataUrl.substring(0, dataUrl.indexOf("?"));
					if(value){
						reqData.keyword = value;
					}
					reqData.usercode=mdboss.usercode;
//					if( !m.get("load") ){//未加载过
						//m.set("load", true);
						$("#org-tree").mCustomScrollbar("destroy");
						$("#org-tree").html('<div class="loading"></div>');
						var commonModel = new mdboss.Model.commonModel();
						commonModel.save(reqData,{url:reqUrl,success:function(model, data){
							if(data.rc == 1){								
//								var hide = "hide";							
//								if($("#tabFlag").val() =="true"){ hide ="";}
							
								var propId = m.get("f_id");
								var propPid = m.get("f_pid");
								var propName = m.get("f_name");
								var dataClass = m.get("dataclass");
								$("#propId").val(propId);
								var template_html = '<div id="org-'+propId+'-list"><ul id="tree_'+propId+'" class="ztree""></ul></div>';
//				    			$('#mCSB_4_container').append(template_html);	            			
				    			$('#org-tree').append(template_html);	            			
				    			// 添加树结构
//				    			 var setting = {
//				    					 data: { simpleData: { enable: true } },
//				                  		 callback:{  
//				                  				beforeClick:function(treeId,treeNode) { v_this.orgMember(treeNode);}
//				    					 },
//	                          			 view :{  
//	                          	            showIcon: true,  
//	                          	            fontCss:function(treeId,treeNode){
//	                          	      			return (!!treeNode.highlight) ? {color:"red", "font-weight":"bold"}:{color:"#333", "font-weight":"normal"};  
//	                          	      		}
//	                          	         }  
//				                  		};
				    			 
				    			 //选择框 
//				    			 if(dataclass != "组织"){
				    				var setting = {
			                          			check: { enable: true, chkboxType:{"Y":"ps","N":"ps"} },
			                          			data: { simpleData: { enable: true } },
			                          			callback:{
			                          				onCheck:function onCheck(e,treeId,treeNode){
//			                          					console.log(treeNode);
			                          					var username =treeNode.name;
			                          					var id =treeNode.id; 
//			                          					console.log(id+"_"+username);
			                          					if(id == "-1"){//全选
			                          						$.each(treeNode.children,function(i, node){
			                          							var username =node.name;
					                          					var id =node.id; 
			                          							if(treeNode.checked){
					                          						memberCol.add(new mdboss.Model.selectM({"id":id,"username":username,"usercode":id,"real_code":id}));	
					                          					}else{
					                          						memberCol.remove(new mdboss.Model.selectM({"id":id,"username":username,"usercode":id,"real_code":id}));	
					                          					}
			                          						});
			                          					}else{//单选
			                          						if(treeNode.checked){
			                          							memberCol.add(new mdboss.Model.selectM({"id":id,"username":username,"usercode":id,"real_code":id}));	
			                          						}else{
			                          							memberCol.remove(new mdboss.Model.selectM({"id":id,"username":username,"usercode":id,"real_code":id}));	
			                          						}
			                          					}
			                          				},
			                          				beforeClick:function(treeId,treeNode){
			                          					v_this.orgMember(treeNode);
			                          				},
			                          			},
			                          			view :{  
			                          	            showIcon: true,  
			                          	            fontCss:function(treeId,treeNode){
			                          	      			return (!!treeNode.highlight) ? {color:"red", "font-weight":"bold"}:{color:"#333", "font-weight":"normal"};  
			                          	      		}
			                          	        }  
			                          			
			                          		}; 
//				    			 }//非组织
				    			 
				                 var zNodes=new Array();
				               
				                 
				                 
				                 if(v_this.model.get("selecttype")=="radio"){
				                	 setting.check={};
			    				}else{
			    					setting.check= { enable: true, chkboxType:{"Y":"ps","N":"ps"} };
			    					if(dataclass != "组织"){
				                		var treeNode = {"id":"-1","pId":"0","name":"全选","propId":propId,"dataClass":dataClass,"open":true};
				                		zNodes.push(treeNode);
					             	 }else{
					             		setting.check ={ enable: true, chkboxType:{"Y":"","N":"ps"} };
					             	 }
			    				}
				                
				                 
				                var loadMember = true; //是否加载过
				                var tmpItem = null;
				                var selectNodeId = null; //当前选中的节点 id
				                var treeNode_ = null;  //当前选中的节点
				                 //构建树
				             	$.each(data.data.rows,function(index,item){
				             		var pId = "";
				             		if(propPid != ""){ pId = item[propPid]; }
				             		var treeNode = {};
				             		
				             		 if(dataclass != "组织"){
				             			treeNode = {"id":item[propId],"pId":"-1","name":item[propName],"propId":propId,"dataClass":dataClass};
					             		$.each(memberCol.models,function(index, m){
					             			if(m.get("id") == item[propId]){//回显勾选 上
						             			treeNode.checked=true; return false;
						             		}
					             		});
				             		 }else{
				             			treeNode = {"id":item[propId],"pId":pId,"name":item[propName],"propId":propId,"dataClass":dataClass};
				             		 }
//				             		 
				             		////如果同当前组织的 编码一致则加载,, 否则加载第一个
				             		if( mdboss.getUserinfo().orgcode == item[propId]){
				             			m.set("first_id",item[propId]);
				             			m.set("first_name",item[propName]);
				             			v_this.orgMember(treeNode);
				             			loadMember = false;
				             			selectNodeId = item[propId];
				             		}
				             		 
				             		if(index == 0){
//				             			m.set("first_id",item[propId]);
//				             			m.set("first_name",item[propName]);
//				             			v_this.orgMember(treeNode);
				             			tmpItem = item;
				             			treeNode_ = treeNode;
				             			selectNodeId = item[propId];
				             		}
				             		zNodes.push(treeNode);
				             	});
				             	
				             	if(loadMember){
				             		m.set("first_id",tmpItem[propId]);
			             			m.set("first_name",tmpItem[propName]);
			             			v_this.orgMember(treeNode_);
				             	}
				             	
				             	var treeObj = $.fn.zTree.init($("#tree_"+propId), setting, zNodes);
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
				                
				             	////// 
				             	$("#org-tree").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false });
				             	
				             	if(data.data.rows==undefined || data.data.rows.length==0){
					                	v_this.orgMember(null);
					            }
				             	
//				             	$(".ztree li").each(function(i){
//									$(this).find("a").removeClass("curSelectedNode");
//								});
//								$(".ztree").each(function(){
//									$(this).find("li").each(function(i){
//										if(i==0)
//											$(this).find("a:first").addClass("curSelectedNode");
//								 	});
//								});//选中第一个元素
							}else{
								mdboss.error(data.msg);
							}
						},error:function(){
							mdboss.error();
						}});
//					}else{
//						//加载第一个节点的成员
//						var propId = m.get("f_id");
//						var dataClass = m.get("dataclass");
////						var propName = m.get("f_name");
//						var firstId = m.get("first_id");//第一个节点的ID
//						var firstName = m.get("first_name");//第一个节点的ID
//						
//						if(firstId == ""){
//							v_this.orgMember(null);
//						}else{
//							v_this.orgMember({"id":firstId,"pId":'',"name":firstName,"propId":propId,"dataClass":dataClass});
//						}
//					}
				}
			});
			
		},//end 加载组织结构
		userItemCard:function(e){//用户卡片
			 e.preventDefault();
			var $this  = $(e.currentTarget);
			 var usercode = $this.attr("uc");
			 var username = $this.attr("vel");
			 mdboss.usercard(usercode, username);
		},
		events:{
			"click .user-item":"userItemCard",
			"click .org-tree-list":"orgTreeList",
			"click .highlight":"selectMember",
			"click .e-title-tab li":"changeOrg",
			"click .rolenode":"roleMember",
			"click .groupnode":"groupMember",
			"click .projectnode":"projectMember",
			"click #userList .mCSB_container li":"selectMemberObO",//选人
			
			"click .highlight":"searchMemberByPingyin",
			"keyup #search_name":"searchMemberBy",
			//"scroll #user-container":"searchMember", //加载用户
			//"scroll .user-container":"searchMember", //加载用户
//			"click .center-more":"moreMember", //加载更多
			"click #addUserToGroupButton":"showCreateGroup", //显示创建群组名称
			"click #addConfirmButton":"createGroup", //创建群组
			"click #addCancelButton":"cancelCreateGroup", //取消创建群组
			"mouseover .entity-item":"showSelectDelete", //显示删除X
			"mouseout .entity-item":"hideSelectDelete", //显示删除X
			"click .select_x":"deleteShowSelect",//删除选中的人
			"click #clearSelectedButton":"clearShowSelect",//删除所有选中的人
	
			"click #checkAll":"checkUserAll",
			"click .j_user_ok":"submitUsers",//确定
			"click .j_user_cancel":"cancelUser",//取消
			"click input[name=all_check]":"allcheck",
			"keypress .js_search_org_class":"changeColor",
			"click .js_icon_search":"icon_search"
		},
		icon_search:function(e){//搜索组织结构 图标 
			_this=this;
			 var $search_class=_this.$el.find("#search_class");
//			var key="name";
		    var value=$search_class.val();
//		    var classtype=$search_class.attr("classtype");
		    var clazzName = "";
			$.each($("#orgs_list li"), function(i, item){
				if($(item).hasClass("active")){
//					console.log($(item).find("a").text());
					clazzName = $(item).find("a").text();
					return false;
				}
			});
			_this.orgDefLoadByUrl(clazzName, value);
		    
//		    _this.updateNodes(false,classtype);  
//		    if(value != ""){  
//		        var treeObj = $.fn.zTree.getZTreeObj("tree_"+classtype);  
//		        _this.nodeList = treeObj.getNodesByParamFuzzy(key, value);  
//		        if(_this.nodeList && _this.nodeList.length>0){  
//		            _this.updateNodes(true,classtype);  
//		        }  
//		    }  
		    $search_class.focus();
		},
		 changeColor:function(e){
			 _this=this;
			 if(e.which==13){
				 _this.icon_search(e);
			 }
		},
		updateNodes:function(highlight,classtype) {  
			 _this=this;
			    var treeObj = $.fn.zTree.getZTreeObj("tree_"+classtype);  
			    if(_this.nodeList!=undefined&&_this.nodeList.length>0){
			        for( var i=0; i<_this.nodeList.length;  i++) {  
				        _this.nodeList[i].highlight = highlight;  
				        treeObj.updateNode(_this.nodeList[i]); //更新选中样式
		               treeObj.expandNode(_this.nodeList[i], true, true, true);//展开选中
		               treeObj.selectNode(_this.nodeList[i]);

				    }  
			    }
			
		},
		allcheck:function(e){
			var $current=$(e.currentTarget);
			var curid=$current.attr("id");
			var curval=$current.val();
			var orgall=$("input[type=checkbox][value=org-all]").prop("checked");
			//当选择全组织时，本组织取消勾选
			if(curid=="org-all"){
				$("#org_current").prop("checked",false);
			}
			//当选择了全部组织，点击选择本组织置为无效
			if(orgall&&curid=="org_current"){
				$current.prop("checked",false);
				return ;
			}
			var name=$current.data("name");
			var alias=$current.data("alias");
			var tmpArr=new Array();
			if($current.prop("checked")){
				memberCol.each(function(item){
					//item.id orgcode-usercode
					//name orgcode
					if(item.id!=undefined&&item.id.indexOf(name)!=-1){
						if(curid!="org_current"){
							tmpArr.push(item);
						}else{
							//判断是本组织
//							var orgcode=item.id.split("_")[0];
//							if(orgcode==name){
//								tmpArr.push(item);
//							}
						}
					}
				});
				//修复当memberCol为空时，checkbox不能隐蔽问题
				var propid=$("#checkAll").attr("propid");//当前显示人员所在的组织大类如：orgcode,rolecode等
				var val=$("#checkAll").val();//当前显示人员所在的组织具本code如org-1
				//判断是否隐藏多选框
				if(propid.indexOf(name)!=-1||val==name){
					$("input[name=userids]").attr("checked",false).hide();
			    	$("input[id=checkAll]").attr("checked",false).hide();
				}
				
				$.each(tmpArr,function(index,item){
					memberCol.remove(item);
				});
				 memberCol.add(new mdboss.Model.selectM({"id":curval,"username":alias,"usercode":curval,"real_code":curval}));
			}else{
				memberCol.remove(new mdboss.Model.selectM({"id":curval}));
				var propid=$("#checkAll").attr("propid");
				var val=$("#checkAll").val();
				if(propid.indexOf(name)!=-1||val==name){
					$("input[name=userids]").show();
			    	$("input[id=checkAll]").show();
				}
			}
			
		
		},
		cancelUser:function(){ //取消
			this.dialog_.close();
		},
		submitUsers:function(e){ //点击确定
			var v_this =this;
			 //"element":"#userSelected",  //要加到的元素
            // "share":"true" // 共享
			if(v_this.model.get("share")!=undefined){
				var users = new Array();
				memberCol.each(function(m){
					users.push(m.get("usercode"));
				});
				var share = new mdboss.Model.shareTask({
					"usercode":mdboss.usercode,    
				    "tousers":users,
				    "processinstcode":v_this.model.get("share"),
				    "taskcode":v_this.model.get("taskcode")
				});
				share.save({},{success:function(m,d){
					if(d.rc == "1"){
						memberCol.reset();
						mdboss.notifyTips("共享成功");
					}else{
						mdboss.error(d.msg);									
					}
				},error:function(){
					mdboss.error();
				}});
			}
			//回调方法 -------------------------------------------------
			var callback = v_this.model.get("callbacks");
			var stepcode = v_this.model.get("stepcode");
			if(callback != undefined){
				var callbackFn = typeof callback == "function" ? callback : function () { };
				var selectMembers = new Array();
				memberCol.each(function(m){
					selectMembers.push({"real_code":m.get("real_code")});
				});
				var allcheck_arr=new Array();
				callbackFn(selectMembers,stepcode,v_this.model.get("processcode"));
			}
			//回调方法 -------------------------------------------------end
			
			//添加选人
			if(v_this.model.get("element")!=undefined){							
				var html=new Array();
				var usernames=new Array();
				memberCol.each(function(m){
					//var tmp = '<span id="'+m.get("id")+'" class="entity-item"><a class="form_tag" data-value="'+m.get("usercode")+'">'+m.get("username")+'</a><button type="button" class="close hide" title="删除">×</button>&nbsp;</span>';
					//tmp = '<a id="u_'+m.get("usercode")+'" class="form_tag" real_code="'+m.get("id")+'" uid="'+m.get("usercode")+'" data-name="'+m.get("username")+'">'+m.get("username")+'<button type="button" class="close js_close_dept" title="删除">×</button></a>';
					html.push('<span class="file-show" style="margin-right:3px;">');
					html.push(' <a id="u_'+m.get("usercode")+'" real_code="'+m.get("id")+'" uid="'+m.get("usercode")+'" data-name="'+m.get("username")+'">'+m.get("username")+'</a>');
					html.push(' <a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
					html.push('</span>');
					usernames.push(m.get("username"));
				});
				v_this.model.get("element").html(html.join(""));
				var replaceCallbacks=v_this.model.get("replaceCallbacks");
				if(replaceCallbacks){
					var replaceHandlercallback = typeof replaceCallbacks == "function" ? replaceCallbacks : function () { };	
					var callbackObj=v_this.model.get("callbackObj");
					replaceHandlercallback(callbackObj);
				}
			}
			this.dialog_.close();
		},
		checkUserAll:function(e){//全选按钮触发
			var $this=$(e.currentTarget);
			 var flag = $this.prop("checked");
			if ( !flag ) { //全不选 
				if($("#searchFlag").val() == "false"){ //未进行搜索查询
				    var username =$this.attr("name");
				    var id =$this.val(); //(org+)code
			        memberCol.remove(new mdboss.Model.selectM({"id":id,"username":username,"usercode":id,"real_code":id}));	
				}else{
					//取消已选的人
					$("input[name=userids]").each(function(){
			        	if($(this).prop("checked")){
//				        	 var id =$("#checkAll").val();//pcode
				        	 var id =$(this).attr("orgcode");//pcode
							 var usercode = $(this).attr("uc");
							 var username = $(this).val();
							 memberCol.remove(new mdboss.Model.selectM({"id":id+"_"+usercode,"username":username,"usercode":usercode,"real_code":id+"_"+usercode}));	
			        	}
			        });
				}
				 $("input[name=userids]").prop("checked", flag);
		    } 
			else{  //全选 
				 $("input[name=userids]").prop("checked", flag);
				if($("#searchFlag").val() == "false"){ //未进反搜索查询
					//取消已选的人
					$("input[name=userids]").each(function(){
			        	if($(this).prop("checked")){
//				        	 var id =$("#checkAll").val();
			        		 var id = $(this).attr("orgcode");
							 var usercode = $(this).attr("uc");
							 var username = $(this).val();
							 memberCol.remove(new mdboss.Model.selectM(
									 {"id":id+"_"+usercode,"username":username,"usercode":usercode,"real_code":id+"_"+usercode}));	
			        	}
			        });
					//选择当前节点
			        var username =$this.attr("name");
				    var id =$this.val(); //(org+)code
			        memberCol.add(new mdboss.Model.selectM({"id":id,"username":username,"usercode":id,"real_code":id}));	
			        
				}else{ //已进行搜索查询
					$("input[name=userids]").each(function(){
			        	if($(this).prop("checked")){
//				        	 var id =$("#checkAll").val();
				        	 var id =$(this).attr("orgcode");
							 var usercode = $(this).attr("uc");
							 var username = $(this).val();
							 memberCol.add(new mdboss.Model.selectM(
									 {"id":id+"_"+usercode,"username":username,"usercode":usercode,"real_code":id+"_"+usercode}));	
			        	}
			        });
				}
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
			memberCol.reset();
			$("input[name=userids]").prop("checked", false);
			$("#selectedMember").empty();
			$("#addUserToGroupButton").addClass("hide");
			$("#clearSelectedButton").addClass("hide");
			$("#userList li").removeClass("s_on");
			this.$el.find("input[type=checkbox]").prop("checked", false);//TODO
			if(v_this.model.get("selecttype")=="radio"){ //单选
			}else{
				$("input[name=userids]").attr("checked",false).show();
		    	$("input[id=checkAll]").attr("checked",false).show();
			}
			var treeObj=$.fn.zTree.getZTreeObj("tree_"+$("#propId").val());			
			treeObj.checkAllNodes(false);
		},
		deleteShowSelect:function(e){//删除选中的人
			e.preventDefault();
			var _this=this;
			var $this  = $(e.currentTarget);
			var id = $this.attr("id");
			var name = $this.attr("name");
			var usercode = $this.attr("uc");
			var li_id=$this.attr("li_id");
			if(id.indexOf("+")>1){//加号判断无意义
				$("input[type=checkbox]").prop("checked",false);	
			}else{
				$("input[name=userids][id='"+id+"']").prop("checked",false);
			}
			
			$("input[name=userids][id='"+li_id+"']").prop("checked",false).closest("li").removeClass("s_on");
			
			memberCol.remove(new mdboss.Model.selectM({"id":id,"username":name,"usercode":usercode,"li_id":li_id}));	
			var propid=$("#checkAll").attr("propid");
			_this.handleallselected(propid);
		},
		cancelCreateGroup:function(){//取消创建群组
			$("#add-group-input-text").hide();
			$("#addConfirmButton").addClass("hide");
			$("#addCancelButton").addClass("hide");
			$("input[name=userids]").prop("checked",false);
		},
		createGroup:function(e){//创建群组
			var users = new Array();
			memberCol.each(function(m){
				//console.log(m.get("usercode").indexOf("+") + "---");
				if(m.get("usercode").indexOf("+") <1)
					users.push({"usercode":m.get("usercode"),"username":m.get("username")});
			});
			if($("#add-group-input-text").val() == ""){
				mdboss.notifyTips("请输入群组名称");
				return ;
			}
			var createGroup = new mdboss.Model.createUserGroups({
				"groupname":$("#add-group-input-text").val(),   //用户组名称
				"usercode":mdboss.usercode, "members":users,  "groupdesc":""
			});
			createGroup.save({},{success:function(m, data){
				if(data.rc == "1"){
					mdboss.notifyTips("创建成功");
					$("#add-group-input-text").hide();
					$("#addConfirmButton").addClass("hide");
					$("#addCancelButton").addClass("hide");
				}else{
					mdboss.error(data.msg);
				}
			},error:function(){
				mdboss.error();
			}});
		},
		
		showCreateGroup:function(){//创建群组
			$("#add-group-input-text").show();
			$("#addConfirmButton").removeClass("hide");
			$("#addCancelButton").removeClass("hide");
		},
		//点击选单个人
		selectMemberObO:function(e){//
		 	 console.log("点击选单个人");
			 e.preventDefault();
			 var $this  = $(e.currentTarget);
			 var flag = true;
			 
			 if($this.has("a.select_show").length>0){//带checkbox的多选
				 $this.toggleClass("s_on");
			 }else{//无checkbox的单选
				 $this.addClass("s_on").siblings().removeClass("s_on");
			 }
			 

			 if($("#chooseModel").val()=="false"){//单选
				 $("#selectedMember").empty();
				 memberCol.reset(); 
			 }
			 var usercode = $this.find(".usercard-toggle").attr("uc");
			 var username = $this.find(".usercard-toggle").attr("vel");
			 var li_id     =$this.attr("id");
			 memberCol.add(new mdboss.Model.selectM({
						"id":$("#checkAll").val()+"_"+usercode,
						"username":username,
						"usercode":usercode,
						"real_code":$("#checkAll").val()+"_"+usercode,
						"li_id":li_id
						}));
			 
		
		},
		memberdata:function(data){
			//
			v_this = this;
			if(data.rc==1){
				if(data.data!=undefined && data.data.rows!=undefined){
					v_this.memberAll = data.data.rows;
					var tmp = data.data.rows;
	    			//处理加选中状态  
//	    			for(var i=0; i<tmp.length; i++){
//	    				var t = tmp[i].pinyin;
//	    				if(t!=undefined && t!=null&&t.length>0){
//	    					t = t.substring(0,1);
//	    					t = t.toUpperCase();
//	    					$("#"+t).addClass("highlight");
//	    				}
//	    				var m = new mdboss.Model.selectM ({
//	    						id:tmp[i].id, username:tmp[i].username, usercode: tmp[i].usercode,
//	    						email:tmp[i].email,"avatar":tmp[i].avatarcode,"mobileno":tmp[i].mobileno,
//	    			            firstchar: t,"orgname":tmp[i].orgname,"userrank":tmp[i].userrank,"orgcode":orgcode
//	    				});
//	    				membersAll.add(m);
//	    			}
	    			var tmpl = $("#users-template").html();
	    			if($("#chooseModel").val()=="false"){
	    				tmpl = $("#users-template-2").html();
					}
	                var template = Handlebars.compile(tmpl);
	                $('.employee-list').html(template({baseUrl:baseConfig.base,"members":data.data.rows}));
	                $("#userList").mCustomScrollbar({scrollButtons:{
 						enable:false }, theme: "darkblue",horizontalScroll:false,
	                }); 
	                
	                if(tmp.length ==0){
	                	$("#checkAll").addClass("hide");
	                }
				}//end if data.data.rows undefined
				else{
					$("#checkAll").addClass("hide");
				}
			}else{
				mdboss.error(data.msg);
			}
		},
		searchMemberBy:function(e){ //搜索
			if(e.which == 13){
				$(".users-list-pinyin .highlight").removeClass('active');
				_this=this;
				var $this  = $(e.currentTarget);
				var val = $this.val();
				//if( val=="" ){
					//mdboss.error("请输入要搜索人内容!");return;
					//$("#searchFlag").val(false); 
			//	}
				//else{
					$("#searchFlag").val(true);
					//进行搜索时
					$("#checkAll").prop("checked",false);
					$("#ALL").text("全部");
	//				var username =$("#searchFlag").attr("name");
	//			    var id =$("#searchFlag").attr("pre")+""+$("#searchFlag").val(); //(org+)code
	//		        memberCol.remove(new mdboss.Model.selectM({"id":id,"username":username,"usercode":id,"real_code":id}));	
				//}
			
//				$('.employee-list').empty();
//			$('.center-more').addClass("hide");
//			var hide = "";
//            if( $("#chooseModel").val() == "false"){
//            	hide='style=display:none';
//            }
//			membersAll.each(function(m){
//				var id = m.get("id");
//				var avatar = m.get("avatar");
//				var usercode = m.get("usercode");
//				var username = m.get("username");
//				var email = m.get("email");
//				var userrank = m.get("userrank");
//				var mobileno = m.get("mobileno");
//				var orgname = m.get("orgname");
//				if(username.indexOf(val) != -1){
//					var tmpl = $("#user-template").html();
//                    var template = Handlebars.compile(tmpl);
//        			$('.employee-list').append(template({"id":id,"avatarcode":avatar,"username":username,"usercode":usercode,"email":email,
//        				"userrank":userrank, "mobileno":mobileno,"orgname":orgname,"hide":hide,"baseUrl":baseConfig.base
//        			}));
//				}
//			});
				$("#userList").mCustomScrollbar("destroy");
				$("#userList").html('<div class="loading"></div>');
				if(v_this.model.get("huiqian")){
					mdboss.reqsubmit({"usercode":mdboss.usercode, "pageNo":1,"pageSize":0,"keyword":val},mdboss.api.members,function(n,res){
		            	v_this.memberdata(res);
		            	v_this.handleSelected();
		            	
		            	//判断是否为全部，是全部，checkbox隐藏
						var treePId=$("#checkAll").attr("propid");
						_this.handleallselected(treePId);
					});
				}else{//搜索本地人员 TODO
					var hide = "";
		            if( $("#chooseModel").val() == "false"){
		            	hide='style=display:none';
		            }
					var tmpl = $("#user-template").html();
					var tmpHtml = new Array();
					setTimeout(function(){
						$.each(_this.memberAll, function(i, item){
							if(item.username.indexOf(val) != -1 || item.workno.indexOf(val) !=-1 || item.pinyin.indexOf(val) != -1){
			                    var template = Handlebars.compile(tmpl);
			                    item.baseUrl=baseConfig.base;
			                    item.hide = hide;
			                    tmpHtml.push(template(item));
							}
						});
						if(tmpHtml.length ==0){
							tmpHtml.push('<li class="clearfix"><span style="text-align: center; width: 100%;">暂无数据....</span></li>');
						}
						$('.employee-list').append(tmpHtml.join(""));
						v_this.handleSelected();
						$("#userList").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false, });
					},100);
				}
				
			
//			memberCol.each(function(m){    				
//				var flag = true;
//				//添加选中的
//				$("input[name=userids]").each(function(){
//					var checkAll =$("#checkAll").val();
//					var orgPcode = m.get("real_code");
//					if(orgPcode!=undefined && orgPcode.split("_")[0] ==checkAll){
//						if( $(this).attr("uc") == m.get("usercode")){
//							$(this).prop("checked", true);
//						}
//					}else{
//						flag = false;
//					}
//			     });
//				if(flag){
//					$("#checkAll").prop("checked", true);
//				}
//			});//end
//				//判断是否为全部，是全部，checkbox隐藏
//				var treePId=$("#checkAll").attr("propid");
//				_this.handleallselected(treePId);
			}
		},
		handleSelected:function(){//处理已选的人员
			var flag = true;
			memberCol.each(function(m){    				
				//添加选中的
				$("input[name=userids]").each(function(){
//					var checkAll =$("#checkAll").val();
					var checkAll =$(this).attr("orgcode");
					var orgPcode = m.get("real_code");
					if(orgPcode!=undefined && orgPcode.split("_")[0] ==checkAll){
						if( $(this).attr("uc") == m.get("usercode")){
							$(this).prop("checked", true);
						}
					}else{
						flag = false;
					}
			     });
			});//end
			if(flag && memberCol.models.length>0){
				$("#checkAll").prop("checked", true);
			}
		},
		handleallselected:function(treePId){
			var flag = false;
			 $("input[name=all_check]:checked").each(function(index,item){
//				 console.log($(item).val());
				if($(item).val()!="org-current"){
					if(treePId.indexOf($(item).data("name"))!=-1){
		           		flag=true;
		           		return;
		           	}
				}else{
					var val=$("#checkAll").val();
					//判断当前组织code是否和本组织code一致
					if(val==$(item).data("name")){
		           		flag=true;
		           		return;
		           	}
				}
			 });
			 if(flag){
				 $("input[name=userids]").attr("checked",false).hide();
        		$("input[id=checkAll]").attr("checked",false).hide();
			 }else{
				 $("input[name=userids]").show();
          		$("input[id=checkAll]").show();
			 }
		},
		searchMemberByPingyin:function(e){//按拼音搜索
			_this=this;
			var $this  = $(e.currentTarget);
//			$(".users-list-pinyin .highlight").each(function(){
//				$(this).removeClass("active");
//			});
			$this.siblings().removeClass('active');
			$this.addClass("active");
			$("#searchFlag").val(true); 
//			//进行搜索时
			$("#checkAll").prop("checked",false);
			var pingyin = $this.attr("id");
//			if( pingyin=="ALL" ){
//				pingyin="";
//				$("#searchFlag").val(false); 
//			}else{
//				$("#searchFlag").val(true); 
//				//进行搜索时
//				$("#checkAll").prop("checked",false);
//			}
			
//			$("#searchFlag").val(true); 
//			$("#checkAll").prop("checked",false);
//			$('.employee-list').empty();
//			$('.center-more').addClass("hide");
//			var hide = "";
//            if( $("#chooseModel").val() == "false"){
//            	hide='style=display:none';
//            }
//			membersAll.each(function(m){
//				var id = m.get("id");
//				var avatar = m.get("avatar");
//				var usercode = m.get("usercode");
//				var username = m.get("username");
//				var email = m.get("email");
//				var userrank = m.get("userrank");
//				var mobileno = m.get("mobileno");
//				var orgname = m.get("orgname");
//				var firstchar = m.get("firstchar");
//				if(pingyin == firstchar || pingyin=="ALL"){
//					var tmpl = $("#user-template").html();
//                    var template = Handlebars.compile(tmpl);
//        			$('.employee-list').append(template({"id":id,"avatarcode":avatar,"username":username,"usercode":usercode,"email":email,
//        				"userrank":userrank, "mobileno":mobileno,"orgname":orgname,"hide":hide,"baseUrl":baseConfig.base	
//        			}));
//				}
//			});
			var tmpCondition = new Array();
//            if(pingyin != ""){
            tmpCondition.push({"key":"pinyin","operate":"Startwith","v1": pingyin.toLowerCase()});
//            }
            $("#userList").mCustomScrollbar("destroy");
			$("#userList").html('<div class="loading"></div>');
			mdboss.reqsubmit({"usercode":mdboss.usercode, "pageNo":1,"pageSize":0,queryCondition:tmpCondition,"keyword":$("#search_name").val()},mdboss.api.members,function(n,res){
            	v_this.memberdata(res);
            	v_this.handleSelected();
            	//判断是否为全部，是全部，checkbox隐藏
            	var treePId=$("#checkAll").attr("propid");
    			_this.handleallselected(treePId);
			});
//			memberCol.each(function(m){    				
//				var flag = true;
//				//添加选中的
//				$("input[name=userids]").each(function(){
//					var checkAll =$("#checkAll").val();
//					var orgPcode = m.get("real_code");
//					if(orgPcode!=undefined && orgPcode.split("_")[0] ==checkAll){
//						if( $(this).attr("uc") == m.get("usercode")){
//							$(this).prop("checked", true);
//						}
//					}else{
//						flag = false;
//					}
//			     });
//				if(flag){
//					$("#checkAll").prop("checked", true);
//				}
//			});//end 
			
			//判断是否为全部，是全部，checkbox隐藏
//			var treePId=$("#checkAll").attr("propid");
//			_this.handleallselected(treePId);
		},//end 按拼音搜索
		orgMember:function(treeNode){//更改组织结构 
			
			$(".ztree li").each(function(i){
				$(this).find("a").removeClass("curSelectedNode");
			});
			
			var v_this = this;
			$("#searchFlag").val(false); 
//			$('.employee-list').empty();
			$(".highlight").removeClass("active");
//			$(".highlight").removeClass("highlight");
//			$("#ALL").addClass("active");
			$("#search_name").val("");
			if(treeNode == null){
				$("#checkAll").addClass("hide");
				return;
			}
//			membersAll.reset();
			$("#checkAll").removeClass("hide");
			$("#checkAll").prop("checked", false);
			$("#checkAll").val(treeNode.id);//id值
			$("#checkAll").attr("uc", treeNode.id);//属性名称
			$("#checkAll").attr("propid", treeNode.propId);//属性名称
			$("#checkAll").prop("name", treeNode.name);//名称
			$("#ALL").text(treeNode.name);
			var treePId=treeNode.propId;
			// 加载用户数据
//			membersAll.reset();
			$("#userList").mCustomScrollbar("destroy");
			$("#userList").html('<div class="loading"></div>');
			var orgM = new mdboss.Model.commonModel( );
			var url =mdboss.api.selectMembers;
			var reqData = {"usercode":mdboss.usercode,"pcode":treeNode.id,
					"processcode":v_this.model.get("processcode"),"stepcode":v_this.model.get("stepcode")};
			if(v_this.model.get("istask")){//是否是任务
				url=mdboss.api.userdata; //transition
				reqData ={"usercode":mdboss.usercode,"pcode":treeNode.id,
						"processcode":v_this.model.get("processcode"),"transition":v_this.model.get("transition")};
			}
			//
			 $("#userList").mCustomScrollbar("destroy");
			$("#userList").html('<div class="loading"></div>');
			orgM.save(reqData,{"url":url,success:function(model, data){
				if(data.rc==1){
					if(data.data!=undefined && data.data.rows!=undefined){
//						var tmp = data.data.rows;
//		    			//处理加选中状态  
//		    			for(var i=0; i<tmp.length; i++){
//		    				var t = tmp[i].pinyin;
//		    				if(t!=undefined && t!=null&&t.length>0){
//		    					t = t.substring(0,1);
//		    					t = t.toUpperCase();
//		    					$("#"+t).addClass("highlight");
//		    				}
//		    				var m = new mdboss.Model.selectM ({
//		    						id:tmp[i].id, username:tmp[i].username, usercode: tmp[i].usercode,
//		    						email:tmp[i].email,"avatar":tmp[i].avatarcode,"mobileno":tmp[i].mobileno,
//		    			            firstchar: t,"orgname":tmp[i].orgname,"userrank":tmp[i].userrank
//		    				});
//		    				membersAll.add(m);
//		    			}
//		    			var tmpl = $("#users-template").html();
//		                var template = Handlebars.compile(tmpl);
//		                $('.employee-list').html(template({baseUrl:baseConfig.base,"members":data.data.rows}));
//		                
						v_this.memberdata(data);
		                
		                v_this.handleallselected(treePId);
		                
		              //添加已选的人 到集合中 用于回显 ---------------------------------------------------------
						var selectvalues = v_this.model.get("selectedvalues");
//						console.log(selectvalues);
						if( selectvalues!= undefined){
							//memberCol.reset();
							var svLen = selectvalues.length;
							for(var l=0; l<svLen; l++){
								var id="";
								var code="";
								var pcode="";
								var allcheck=true;
								var name=selectvalues[l].name;
								if(selectvalues[l].pcode!=undefined){
									pcode=selectvalues[l].pcode;
								}
								if(selectvalues[l].code!=undefined){
									code=selectvalues[l].code;
								}else{
									code="";
								}
								
								id=code==""?pcode:pcode+"_"+code;
								var sm = new mdboss.Model.selectM({ 
									"id":id,
						            "username":name,
						            "usercode": code==""?pcode:code,
						            "pcode": pcode,
						            "real_code":id,
						            "allcheck":allcheck
								});
								memberCol.add(sm);
							}
							v_this.model.set("selectedvalues", null);
						}//end ---------------------------------------------------------------------------
		
		                memberCol.each(function(m){    	
		    				if( treeNode.id == m.get("usercode")){
		    					 $("#checkAll").prop("checked", true);
		    					 $("input[name=userids]").each(function(){
		    				        $(this).prop("checked", true);
		    				     });
		    				}
		    				//添加选中的
		    				$("input[name=userids]").each(function(){
		    					var checkAll =$("#checkAll").val();
		    					var orgPcode = m.get("real_code");
		    					if(orgPcode!=undefined && orgPcode.split("_")[0] ==checkAll){
		    						if( $(this).attr("uc") == m.get("usercode")){
		    							$(this).prop("checked", true);
		    						}
		    					}
						     });
		    			});//end 
//		                if($("#chooseModel").val()=="false"){
//							$(".select_show").hide();
//						}
		                
//		                if(tmp.length ==0){
//		                	$("#checkAll").addClass("hide");
//		                }
					}//end if data.data.rows undefined
					else{
						$("#checkAll").addClass("hide");
					}
				}else{
					mdboss.error(data.msg);
				}
			},error:function(){
				mdboss.error();
			}}); //end 加载用户
		},
		changeOrg:function(e){ // 更改组织结构
			var v_this = this;
			$("#checkAll").prop("checked", false);
			
			e.preventDefault();
			var $this  = $(e.currentTarget);
			$this.siblings().removeClass('active');
			$this.addClass('active');
			var type = $($this.html()).attr('id');
			
			var orgName = $this.text();
			v_this.orgDefLoadByUrl(orgName);
			
			var tmp = type.split("-")[0];
			$("#search_class").attr("classtype",tmp);//设置当前选中分类到搜索框
			$("#search_class").val("");//清空搜索框的值
//			$("#mCSB_4_container").children().addClass('hide');
//			$("#org-"+tmp+"-list").removeClass('hide');
			 
//			$(".ztree li").each(function(i){
//					$(this).find("a").removeClass("curSelectedNode");
//			});
//			$(".ztree").each(function(){
//				$(this).find("li").each(function(i){
//					if(i==0)
//						$(this).find("a:first").addClass("curSelectedNode");
//				});
//			});
		},
//		groupMember:function(e){//加载群组成员
//			
//		},//加载群组成员
		
//		projectMember:function(e){//加载项目成员
//			
//		},//加载项目成员
		
//		roleMember:function(e){//加载角色成员
//			
//		}//加载角色成员
	});
});