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
	mdboss.Model.showUserType = Backbone.Model.extend({
		initialize: function(){ },  
        defaults: {}
	});
	
	/* 组织结构-部门 */
	mdboss.Model.orgD = Backbone.Model.extend({
		url:mdboss.api.orgs,
		initialize: function(){  },  
        defaults: {  }
	});
	
	/* 组织结构-部门 */
	mdboss.Model.orgDm = Backbone.Model.extend({
		url:mdboss.api.selectMembers,
		initialize: function(){  },  
        defaults: {   }
	});
	
	/* 人员选择 */
	mdboss.Model.selectM = Backbone.Model.extend({
		initialize: function(){ },
		defaults: {
			id:"", username:'',  usercode: '', firstchar: '', email: ''
        }
	});	
	
	/* 缓存查回来的所有成员 */
	mdboss.Collection.memberAll = Backbone.Collection.extend({
		model:mdboss.Model.selectM,
		initialize : function(){ this.on('reset',function(){}); 		},
		comparator: 'id'
	});
	
	var membersAll =new mdboss.Collection.memberAll();
	
	/* 选中的成员集合 */
	mdboss.Collection.selectMC = Backbone.Collection.extend({
		model:mdboss.Model.selectM,
		initialize : function(){
			this.searchFlag =false;
			this.on('reset',function(){ });
		},
		comparator: 'id'
	});
	var memberCol =new mdboss.Collection.selectMC();//当前选中的人
	
	
	//添加选中的
	memberCol.on("add", function(m) {
//		var tmp = '<span id="'+m.get("id")+'" class="entity-item"><a class="form_tag" data-value="'+m.get("usercode")+'">'+m.get("username")+'</a><button style="line-height: 20px;" type="button" id="'+m.get("id")+'" uc="'+m.get("usercode")+'" name="'+m.get("username")+'" class="select_x close hide" title="删除">×</button>&nbsp;</span>';
		var template = Handlebars.compile( $("#user-select-template").html());
		var tmp = template({"usercode":m.get("usercode"),"username":m.get("username"),"li_id":m.get("li_id")});
		
		$('input[name=userids][uc='+m.get("id")+']').prop("checked", true); 
		if( m.get("id") == $("#checkAll").val() ){
			$('input[name=userids]').prop("checked", true); 
			$("#checkAll").prop("checked", true);
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
//			var html = '<span id="'+m.get("id")+'" class="entity-item"><a class="form_tag" data-value="'+m.get("usercode")+'">'+m.get("username")+'</a><button style="line-height: 20px;" type="button" id="'+m.get("id")+'" uc="'+m.get("usercode")+'" name="'+m.get("username")+'" class="select_x close hide" title="删除">×</button>&nbsp;</span>';
			var html = $("#user-select-template").html();
			template = Handlebars.compile(html);
			html = template({"usercode":m.get("usercode"),"username":m.get("username"),"li_id":m.get("li_id")});
			$("#selectedMember").append(html);
		});
		$("input[name=userids][uc='"+m.get("usercode")+"']").prop("checked",false);
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
	mdboss.View.membersView = Backbone.View.extend({
		initialize : function() {
			var v_this = this;
			memberCol.reset();
			orgDefList.reset();
			var dialog = new Dialog({ type : "html", value : '<div class="loading"></div>',
				fillCallback : function() {
					$(this).find(".scrollwrapper").jScrollPane();
				}
			}, {
				"title" : "人员选择", "width" : "1000px", "height" : "500px", "icon" : "iconfont icon-mdliucheng",
				"resize" : function() {
					$(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
				}
			}).show(function() {
				var _this = this;
				v_this.dialog_ = this;
				var html = require("text!template/page/member/selectMember.html");
				if( v_this.model.get("circularize") ){
					html = require("text!template/page/member/selectMemberCircularize.html");
				}
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
					var dataUrl = m.get("dataurl");
//					if( !m.get("load") ){//未加载过
						//m.set("load", true);

					var l = dataUrl.indexOf("=")+1;
					var reqData =eval("("+ dataUrl.substring(l, dataUrl.length) +")" );
					var reqUrl = dataUrl.substring(0, dataUrl.indexOf("?"));
					if(value){
						reqData.keyword = value;
					}
					 
					reqData.usercode=mdboss.usercode;
					 
						$("#org-tree").mCustomScrollbar("destroy");
						$("#org-tree").html('<div class="loading"></div>');
						var commonModel = new mdboss.Model.commonModel();
						commonModel.save(reqData,{url:reqUrl,success:function(model, data){
							if(data.rc == 1){
								var propId = m.get("f_id");
								var propPid = m.get("f_pid");
								var propName = m.get("f_name");
								var dataClass = m.get("dataclass");
								var template_html = '<div id="org-'+propId+'-list"><ul id="tree_'+propId+'" class="ztree""></ul></div>';
				    			$('#org-tree').append(template_html);	            			
				    			// 添加树结构
				    			 var setting = { data: { simpleData: { enable: true } },
				                  			callback:{ 
				                  				beforeClick:function(treeId,treeNode) { v_this.orgMember(treeNode);} 
				                  			},
		                          			 view :{  
		                          	            showIcon: true,  
		                          	            fontCss:function(treeId,treeNode){
		                          	      			return (!!treeNode.highlight) ? {color:"red", "font-weight":"bold"}:{color:"#333", "font-weight":"normal"};  
		                          	      		}
		                          	         } 
				                  		};
				                var zNodes=new Array();
				                var loadMember = true;//是否加载过
				                var tmpItem = null;
				                var selectNodeId = null;  //当前选中的节点 id
				                var treeNode_ = null; //当前选中的节点 
				                if(data.data.rows&&data.data.rows.length>0){
				                	$.each(data.data.rows,function(index,item){
					             		var pId = "";
					             		if(propPid != ""){ pId = item[propPid]; }
					             		var treeNode = {"id":item[propId],"pId":pId,"name":item[propName],"propId":propId,"dataClass":dataClass,"pre":""};
					             		
//					             		console.log( mdboss.getUserinfo().orgcode == item[propId]);
					             		//如果同当前组织的 编码一致则加载,, 否则加载第一个  
					             		if( mdboss.getUserinfo().orgcode == item[propId]){
					             			m.set("first_id",item[propId]);
					             			m.set("first_name",item[propName]);
					             			v_this.orgMember(treeNode);
					             			loadMember = false;
					             			selectNodeId = item[propId];
					             		}
					             		
					             		if(index == 0){
//					             			m.set("first_id",item[propId]);
//					             			m.set("first_name",item[propName]);
//					             			v_this.orgMember(treeNode);
					             			tmpItem = item;
					             			treeNode_ = treeNode;
					             			selectNodeId = item[propId];
					             		}
					             		zNodes.push(treeNode);
					             	});

//					             	console.log(mdboss.getUserinfo().orgcode);
					             	//获取当前用户所在组织 下的成员
					             	if(loadMember){
					             		m.set("first_id",tmpItem[propId]);
				             			m.set("first_name",tmpItem[propName]);
				             			v_this.orgMember(treeNode_);
					             	}
					             	
					             	var treeObj =  $.fn.zTree.init($("#tree_"+propId), setting, zNodes);
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
					                
					                $("#org-tree").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false  });
				                }
				             	
				                if(data.data.rows==undefined || data.data.rows.length==0){
				                	v_this.orgMember(null);
				                	$("#org-tree").html('<div>暂无数据</div>');
				                }
				                
//				                $(".ztree li").each(function(i){
//									$(this).find("a").removeClass("curSelectedNode");
//								});
				                
//				                if(loadMember){
//				                	$(".ztree").each(function(){
//										$(this).find("li").each(function(i){
//											if(i==0){
//												$(this).find("a:first").addClass("curSelectedNode"); return true;
//											}
//										});
//									});
//				                }else{
//				                	treeObj.selectNode(zTree.getNodeByParam("id", 101));
//				                }
								
							
							}else{
								mdboss.error(data.msg);
							}
						},error:function(){
							mdboss.error( );
						}});
//					}else{
//						//加载第一个节点的成员
//						var propId = m.get("f_id");
//						var firstId = m.get("first_id");//第一个节点的ID
//						 
//						if(firstId == ""){
//							v_this.orgMember(null);
//						}else{
//							var dataClass = m.get("dataclass");
//							
//							var firstName = m.get("first_name");//第一个节点的ID
//							v_this.orgMember({"id":firstId,"pId":'',"name":firstName,"propId":propId,"dataClass":dataClass});
//						}
//					}
				}
			});
			
		},//end 加载组织结构
		userItemCard:function(e){//用户卡片
			var $this  = $(e.currentTarget);
			 var usercode = $this.attr("uc");
			 var username = $this.attr("vel");
			 mdboss.usercard(usercode, username);
		},
		events:{
			"click .user-item":"userItemCard",//用户卡片
			"click .org-tree-list":"orgTreeList",
//			"click .highlight":"selectMember",
			"click .e-title-tab li":"changeOrg",
			"click .rolenode":"roleMember",
			"click .groupnode":"groupMember",
			"click .projectnode":"projectMember",
			"click #userList .mCSB_container li":"selectMemberObO",//选人
			"click .highlight":"searchMemberByPingyin",
			"keyup #search_name":"searchMemberBy",
			//"scroll #user-container":"searchMember", //加载用户
			//"scroll .user-container":"searchMember", //加载用户
			"click .center-more":"moreMember", //加载更多
			"click #addUserToGroupButton":"showCreateGroup", //显示创建群组名称
			"click #addConfirmButton":"createGroup", //创建群组
			"click #addCancelButton":"cancelCreateGroup", //取消创建群组
			"mouseover .entity-item":"showSelectDelete", //显示删除X
			"mouseout .entity-item":"hideSelectDelete", //显示删除X
			"click .select_x":"deleteShowSelect",//删除选中的人
			"click .close":"deleteShowSelect",//删除选中的人
			"click #clearSelectedButton":"clearShowSelect",//删除所有选中的人
			"click input[name=userids]":"checkUsers",
			"click #checkAll":"checkUserAll",
			"click .j_user_ok":"submitUsers",//确定
			"click .j_user_cancel":"cancelUser",//取消
			"keypress .js_search_org_class":"changeColor",//大类搜索
			"click .js_icon_search":"icon_search"	
		},
		icon_search:function(e){
			_this=this;
			 var $search_class=_this.$el.find("#search_class");
//			var key="name";
		    var value=$search_class.val();
//		    var classtype=$search_class.attr("classtype");
//		    _this.updateNodes(false,classtype);  
//		    if(value != ""){  
//		        var treeObj = $.fn.zTree.getZTreeObj("tree_"+classtype);  
//		        _this.nodeList = treeObj.getNodesByParamFuzzy(key, value);  
//		        if(_this.nodeList && _this.nodeList.length>0){  
//		            _this.updateNodes(true,classtype);  
//		        }  
//		    }  
		    var clazzName = "";
		    $.each($("#orgs_list li"), function(i, item){
				if($(item).hasClass("active")){
					clazzName = $(item).find("a").text();
					return false;
				}
			});
			_this.orgDefLoadByUrl(clazzName, value);
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
		cancelUser:function(){ //取消
			this.dialog_.close();
		},
		circularize:function(){ //传阅
			var v_this =this;
			var msg = v_this.$el.find("#circularize_msg").val();
			var selectMembers = new Array();
			memberCol.each(function(m){
				selectMembers.push(m.get("usercode"));
			});
			 var req = {"processinstcode":v_this.model.get("processinstcode"),"taskcode":v_this.model.get("taskcode"), "tousers":selectMembers,"msg":msg};
			mdboss.reqsubmit(req, mdboss.api.circularize, function(m, res){
					 if(res.rc==1){
						 memberCol.reset();
						 mdboss.alert("传阅成功!");
					 }else{
						 mdboss.error(res.msg);
					 }
				 });
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
			
			//传阅
			if(v_this.model.get("circularize")){
				v_this.circularize();
			}
			
			//回调方法 -------------------------------------------------
			var callback = v_this.model.get("callbacks");
			console.log("____ccc");
			if(callback != undefined){
				var callbackFn = typeof callback == "function" ? callback : function () { };
				var selectMembers = new Array();
				memberCol.each(function(m){
					selectMembers.push({"code":m.get("usercode"),"name":m.get("username")});
				});
				var ishuiqian=$("#ishuiqian").prop("checked");
				callbackFn(selectMembers,ishuiqian);
			}
			//回调方法 -------------------------------------------------end
			
			//添加选人
			if(v_this.model.get("element")!=undefined){							
				var html=new Array();
				memberCol.each(function(m){
					var tmp = '<span id="'+m.get("id")+'" class="entity-item"><a class="form_tag" data-value="'+m.get("usercode")+'">'+m.get("username")+'</a><button type="button" class="close hide" title="删除">×</button>&nbsp;</span>';
					tmp = '<a id="u_'+m.get("usercode")+'" class="form_tag" uid="'+m.get("usercode")+'" data-name="'+m.get("username")+'">'+m.get("username")+'<button type="button" class="close js_close_dept" title="删除">×</button></a>';
					html.push(tmp);
				});
				v_this.model.get("element").html(html.join(""));
			}
			this.dialog_.close();
		},
		checkUserAll:function(e){
			var $this=$(e.currentTarget);
			 var flag = $this.prop("checked");
			if ( !flag ) { //全不选 
				if($("#searchFlag").val() == "false"){ //未进行搜索查询
				    var username =$this.attr("name");
				    var id =$this.val(); //(org+)code
			        memberCol.remove(new mdboss.Model.selectM({"id":id,"username":username,"usercode":id}));	
				}else{
					//取消已选的人
					$("input[name=userids]:checked").each(function(){
//			        	if($(this).prop("checked")){
//				        	 var id =$(this).attr("id");
							 var usercode = $(this).attr("uc");
							 var username = $(this).val();
							 memberCol.remove(new mdboss.Model.selectM({"id":usercode,"username":username,"usercode":usercode}));	
//			        	}
			        });
				}
				 $("input[name=userids]").prop("checked", flag);
		    } 
			else{  //全选 
				 $("input[name=userids]").prop("checked", flag);
				if($("#searchFlag").val() == "false"){ //未进反搜索查询
					//取消已选的人
					$("input[name=userids]:checked").each(function(){
//			        	if($(this).prop("checked")){
//				        	 var id =$(this).attr("id");
							 var usercode = $(this).attr("uc");
							 var username = $(this).val();
							 memberCol.remove(new mdboss.Model.selectM({"id":usercode,"username":username,"usercode":usercode}));	
//			        	}
			        });
					
			        var username =$this.attr("name");
				    var id =$this.val(); //(org+)code
			        memberCol.add(new mdboss.Model.selectM({"id":id,"username":username,"usercode":id}));	
			        
				}else{ //已进行搜索查询
					$("input[name=userids]:checked").each(function(){
//			        	if($(this).prop("checked")){
//				        	 var id =$(this).attr("id");
							 var usercode = $(this).attr("uc");
							 var username = $(this).val();
							 memberCol.add(new mdboss.Model.selectM({"id":usercode,"username":username,"usercode":usercode}));	
//			        	}
			        });
				}
		    }  
		 
		},
		checkUsers:function(e){//选与不选 

			var $this  = $(e.currentTarget);
			var flag = true;
			
			e.stopPropagation();//阻止模拟点击checkbox事件冒泡
			$this.closest("li").toggleClass("s_on");
			
			$("input[name='userids']").each(function(i){
				if(!$(this).prop("checked")){
					flag=false;
					return;
				}
			});
			
//			console.log("memberCol.searchFlag===="+ $("#searchFlag").val() );
			if(flag){// 全选 
				$("#checkAll").prop("checked", true);
				if($("#searchFlag").val() == "false"){ //未进行搜索
					//取消已选的人
			        $("input[name=userids]").each(function(){
			        	if($(this).prop("checked")){
//				        	 var id =$(this).attr("id");
							 var usercode = $(this).attr("uc");
							 var username = $(this).val();
							 var li_id     =$this.attr("id");
							 memberCol.remove(new mdboss.Model.selectM({"id":usercode,"username":username,"usercode":usercode,"li_id":li_id}));	
			        	}
			        });
			        var username =$("#checkAll").attr("name");
				    var id =$("#checkAll").val(); //(org+)code
				    var li_id     =$this.attr("id");
			        memberCol.add(new mdboss.Model.selectM({"id":id,"username":username,"usercode":$this.val(),"li_id":li_id}));	
				}else{//进行搜索后
					 $("input[name=userids]").each(function(){
			        	if($(this).prop("checked")){
//				        	 var id =$(this).attr("id");
							 var usercode = $(this).attr("uc");
							 var username = $(this).val();
							 var li_id     =$this.attr("id");
							 memberCol.add(new mdboss.Model.selectM({"id":usercode,"username":username,"usercode":usercode,"li_id":li_id}));	
			        	}
			        });
				}
			}else{
				$("#checkAll").prop("checked", false);
				if($("#searchFlag").val() == "false"){ //未进行搜索
					//添加已选的人
			        $("input[name=userids]").each(function(){
			        	if($(this).prop("checked")){
//				        	 var id =$(this).attr("id");
							 var usercode = $(this).attr("uc");
							 var username = $(this).val();
							 var li_id     =$this.attr("id");
							 memberCol.add(new mdboss.Model.selectM({"id":usercode,"username":username,"usercode":usercode,"li_id":li_id}));	
			        	}
			        }); 
					
					var username =$("#checkAll").attr("name");
				    var id =$("#checkAll").val(); //(org+)code
				    var li_id     =$this.attr("id");
			        memberCol.remove(new mdboss.Model.selectM({"id":id,"username":username,"usercode":$this.val(),"li_id":li_id}));
				}else{//进行搜索后
					$("input[name=userids]").each(function(){
			        	if($(this).prop("checked")){
//				        	 var id =$(this).attr("id");
							 var usercode = $(this).attr("uc");
							 var username = $(this).val();
							 var li_id     =$this.attr("id");
							 memberCol.add(new mdboss.Model.selectM({"id":usercode,"username":username,"usercode":usercode,"li_id":li_id}));	
			        	}
			        }); 
				}
			}
			 
//			 var id =$this.attr("id");
			 var usercode = $this.attr("uc");
			 var username = $this.val();
			 var checked = $this.prop("checked");//,true
			 var li_id     =$this.attr("id");
			if(checked == true){
				if( !$("#checkAll").prop("checked") ){
					memberCol.add(new mdboss.Model.selectM({"id":usercode,"username":username,"usercode":usercode,"li_id":li_id}));
				}
			 }else{
				 memberCol.remove(new mdboss.Model.selectM({"id":usercode,"username":username,"usercode":usercode,"li_id":li_id}));
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
		},
		deleteShowSelect:function(e){//删除选中的人
			e.preventDefault();
			var _this=this;
			var $this  = $(e.currentTarget);
			var id = $this.attr("id");
			var name = $this.attr("name");
			var usercode = $this.attr("uc");
			var li_id=$this.attr("li_id");
			
			if(id.indexOf("+")>1){
				$("input[type=checkbox]").prop("checked",false);
			}else{
				$("input[name=userids][id='"+id+"']").prop("checked",false);
			}
			
			$("input[name=userids][id='"+li_id+"']").prop("checked",false).closest("li").removeClass("s_on");
			
			memberCol.remove(new mdboss.Model.selectM({"id":id,"username":name,"usercode":usercode,"li_id":li_id}));	
			var propid=$("#checkAll").attr("propid");
			_this.handleallselected(propid);
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
				mdboss.error( );
			}});
		},
		
		showCreateGroup:function(){//创建群组
			$("#add-group-input-text").show();
			$("#addConfirmButton").removeClass("hide");
			$("#addCancelButton").removeClass("hide");
		},
		//点击选单个人
		selectMemberObO:function(e){//
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
			 }else{		
				 return;
			 }
//			 var id =$this.attr("userid");
			 var usercode = $this.attr("uc");
			 var username = $this.attr("vel");
			 var li_id     =$this.attr("id");
			 memberCol.add(new mdboss.Model.selectM({"id":usercode,"username":username,"usercode":usercode,"li_id":li_id}));
		},
		searchMemberBy:function(e){ //搜索
			
			var v_this = this;
			var $this  = $(e.currentTarget);
			var val = $this.val();
			if(e.which ==13){
				$(".users-list-pinyin .highlight").removeClass('active');
				if( val=="" ){
					mdboss.error("请输入要搜索人内容!");return;
					$("#searchFlag").val(false); 
				}else{
					$("#searchFlag").val(true);
					//进行搜索时
					$("#checkAll").prop("checked",false);
//					$("#ALL").text("全部");
				}
				
				if( val=="" ){
					$("#searchFlag").val(false); 
				}else{
					$("#searchFlag").val(true);
					//进行搜索时
					$("#checkAll").prop("checked",false);
					var username =$("#searchFlag").attr("name");
				    var id =$("#searchFlag").attr("pre")+""+$("#searchFlag").val(); //(org+)code
			        memberCol.remove(new mdboss.Model.selectM({"id":id,"username":username,"usercode":id}));	
				}
				
				$('.center-more').addClass("hide");
	            membersAll.reset();
//				-------------------------
				 $("#userList").mCustomScrollbar("destroy");
				$("#userList").html('<div class="loading"></div>');
	            mdboss.reqsubmit({"usercode":mdboss.usercode, "pageNo":1,"pageSize":0,"keyword":val},mdboss.api.members,function(n,res){
	            	v_this.memberdata(res);
	            	v_this.handleSelected();
	            });
//			}
			/*
				var hide = "";
	            if( $("#chooseModel").val() == "false"){
	            	hide='style=display:none';
	            }
				$("#userList").mCustomScrollbar("destroy");
			    $("#userList").html('<div class="loading"></div>');
			    var tmpp ='<li class="clearfix"><span style="text-align: center; width: 100%;">暂无数据....</span></li>';
			    var flag = true;
			    var deptshow = new Array();
				membersAll.each(function(m){
					var id = m.get("id");
					var avatar = m.get("avatar");
					var usercode = m.get("usercode");
					var username = m.get("username");
					var email = m.get("email");
					var userrank = m.get("userrank");
					var mobileno = m.get("mobileno");
					var orgname = m.get("orgname");
					var pinyin = m.get("pinyin");
					if(username.indexOf(val) != -1 || usercode.indexOf(val)!=-1 || pinyin.indexOf(val)!=-1 ){
						flag = false;
						var tmpl = $("#user-template").html();
	                    var template = Handlebars.compile(tmpl);
//	        			$('.employee-list').append(template({"id":id,"avatarcode":avatar,"username":username,"usercode":usercode,"email":email,
//	        				"userrank":userrank, "mobileno":mobileno,"orgname":orgname,"hide":hide,"baseUrl":baseConfig.base
//	        			}));
	                    deptshow.push(template({"id":id,"avatarcode":avatar,"username":username,"usercode":usercode,"email":email, "userrank":userrank, "mobileno":mobileno,"orgname":orgname,"hide":hide,"baseUrl":baseConfig.base }));
					}
				});
				 if(flag){
					 $("#userList").html(tmpp);
				 }else{
					 $("#userList").html(deptshow.join(""));
				 }
				 $("#userList").mCustomScrollbar({scrollButtons:{
						enable:false }, theme: "darkblue",horizontalScroll:false,
				 });
				 */
				
				memberCol.each(function(m){    				
					var flag = true;
					//添加选中的
					$("input[name=userids]").each(function(){
						if( $(this).attr("uc") == m.get("usercode")){
							$(this).prop("checked", true);
						}else{
							flag = false;
						}
				     });
					if(flag){
						$("#checkAll").prop("checked", true);
					}
				});//end 
			}
		},
		searchMemberByPingyin:function(e){//按拼音搜索
			var v_this = this;
			var $this  = $(e.currentTarget);
			$this.siblings().removeClass('active');
			$this.addClass("active");
			$("#searchFlag").val(true); 
			//进行搜索时
			$("#checkAll").prop("checked",false);
			var pingyin = $this.attr("id");
			console.log(pingyin);
			var tmpCondition = new Array();
			tmpCondition.push({"key":"pinyin","operate":"Startwith","v1": pingyin.toLowerCase()});
			$("#userList").mCustomScrollbar("destroy");
			$("#userList").html('<div class="loading"></div>');
//			+++++++++++++++++++++++
			mdboss.reqsubmit({"usercode":mdboss.usercode, "pageNo":1,"pageSize":0,queryCondition:tmpCondition,"keyword":$("#search_name").val()},mdboss.api.members,function(n,res){
	          	v_this.memberdata(res);
	          	v_this.handleSelected();
          	 
			});
			//-----+++++++++++++++
//			$(".users-list-pinyin .highlight").each(function(){
//				$(this).removeClass("active");
//			});
			
			/*
			$this.addClass("active");
			var pingyin = $this.attr("id");
			if( pingyin=="ALL" ){
				$("#searchFlag").val(false); 
			}else{
				$("#searchFlag").val(true); 
				//进行搜索时
				$("#checkAll").prop("checked",false);
			}
//			$('.employee-list').empty();
//			$('.center-more').addClass("hide");
			var hide = "";
            if( $("#chooseModel").val() == "false"){
            	hide='style=display:none';
            }
            $("#userList").mCustomScrollbar("destroy");
			$("#userList").html('<div class="loading"></div>');
			var flag =true;
			var tmpp ='<li class="clearfix"><span style="text-align: center; width: 100%;">暂无数据....</span></li>';
			 var deptshow=new Array();
			membersAll.each(function(m){
				var id = m.get("id");
				var avatar = m.get("avatar");
				var usercode = m.get("usercode");
				var username = m.get("username");
				var email = m.get("email");
				var userrank = m.get("userrank");
				var mobileno = m.get("mobileno");
				var orgname = m.get("orgname");
				var firstchar = m.get("pinyin");
				
				if(pingyin.toLowerCase() == firstchar || pingyin=="ALL"){
					var tmpl = $("#user-template").html();
					//TODO
					flag = false;
                    var template = Handlebars.compile(tmpl);
//        			$('.employee-list').append(template({"id":id,"avatarcode":avatar,"username":username,"usercode":usercode,"email":email,
//        				"userrank":userrank, "mobileno":mobileno,"orgname":orgname,"hide":hide,"baseUrl":baseConfig.base	
//        			}));
        			
        			deptshow.push(template({"id":id,"avatarcode":avatar,"username":username,"usercode":usercode,"email":email, "userrank":userrank, "mobileno":mobileno,"orgname":orgname,"hide":hide,"baseUrl":baseConfig.base }));
				}
				
				
			});
			if(flag){
				$("#userList").html(tmpp);
			}
			else{
				$("#userList").html(deptshow.join(""));
			}
			 $("#userList").mCustomScrollbar({scrollButtons:{
					enable:false }, theme: "darkblue",horizontalScroll:false,
           });
           */  //end
			memberCol.each(function(m){    				
				var flag = true;
				//添加选中的
				$("input[name=userids]").each(function(){
					if( $(this).attr("uc") == m.get("usercode")){
						$(this).prop("checked", true);
					}else{
						flag = false;
					}
			     });
				if(flag){
					$("#checkAll").prop("checked", true);
				}
			});//end 
			
		},//end 按拼音搜索
		handleSelected:function(){
			memberCol.each(function(m){    				
				var flag = true;
				//添加选中的
				$("input[name=userids]").each(function(){
					if( $(this).attr("uc") == m.get("usercode")){
						$(this).prop("checked", true);
					}else{
						flag = false;
					}
			     });
				if(flag){
					$("#checkAll").prop("checked", true);
				}
			});//end 
		},
		memberdata:function(data){

			if(data.rc == 1){
				membersAll.reset();
				if(data.data!=undefined && data.data.rows!=undefined){
					var tmp = data.data.rows;
	    			//处理加选中状态  
	    			for(var i=0; i<tmp.length; i++){
	    				var t = tmp[i].pinyin;
	    				if(t!=undefined && t!=null&&t.length>0){
	    					t = t.substring(0,1);
//	    					t = t.toUpperCase();
//	    					$("#"+t).addClass("highlight");
	    				}else{
	    					t="#";
	    				}
	    				var m = new mdboss.Model.selectM ({
	    					id:tmp[i].id, username:tmp[i].username, usercode: tmp[i].usercode,
    						email:tmp[i].email,"avatar":tmp[i].avatarcode,"mobileno":tmp[i].mobileno,
    			            pinyin: t,"orgname":tmp[i].orgname,"userrank":tmp[i].userrank,"orgcode":tmp[i].orgcode
	    				});
	    				membersAll.add(m);
	    			}
	    			var tmpl = $("#users-template").html();
	    			if($("#chooseModel").val()=="false"){
	    				tmpl = $("#users-template-2").html();
					}
	                var template = Handlebars.compile(tmpl);
	                $('.employee-list').html(template({"baseUrl":baseConfig.base,"members":data.data.rows}));
	                $("#userList").mCustomScrollbar({scrollButtons:{
 						enable:false }, theme: "darkblue",horizontalScroll:false,
                  });
				}//end if data.dtat.rows undefined		
				else{
					$("#checkAll").addClass("hide");
				}
			}else{
				mdboss.error(data.msg);
			}
		},
		orgMember:function(treeNode){//更改组织结构 
			$(".ztree li").each(function(i){
				$(this).find("a").removeClass("curSelectedNode");
			});
			var v_this = this;
			$("#searchFlag").val(false); 
			membersAll.reset();
			$(".highlight").removeClass("active");
//			$(".highlight").removeClass("highlight");
//			$("#ALL").addClass("highlight");
			$("#search_name").val("");
			if(treeNode == null){
				$("#checkAll").addClass("hide");
				return;
			}
			$("#checkAll").removeClass("hide");
			$("#checkAll").prop("checked", false);
			$("#checkAll").val(treeNode.id);//id值
			$("#checkAll").attr("uc", treeNode.id);//属性名称
			$("#checkAll").attr("propid", treeNode.propId);//属性名称
			$("#checkAll").prop("name", treeNode.name);//名称
			$("#ALL").text(treeNode.name);
			// 加载用户数据
			membersAll.reset();//
//			$("#userList").mCustomScrollbar("destroy");
//			$("#userList").html('<div class="loading"></div>');
			var orgM = new mdboss.Model.orgDm(
					{"usercode":mdboss.usercode,"pcode":treeNode.id,
						"processcode":v_this.model.get("processcode"),"stepcode":v_this.model.get("stepcode")});
			 $("#userList").mCustomScrollbar("destroy");
			$("#userList").html('<div class="loading"></div>');
			orgM.save({},{success:function(model, data){
				v_this.memberdata(data);
				if(data.rc == 1){
					//添加已选的人 到集合中 用于回显 ---------------------------------------------------------
					var selectvalues = v_this.model.get("selectedvalues");
					if( selectvalues!= undefined){
						var svLen = selectvalues.length;
						for(var l=0; l<svLen; l++){
							var sm = new mdboss.Model.selectM({ 
								"id":selectvalues[l].code,
					            "username":selectvalues[l].name,
					            "usercode": selectvalues[l].code
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
	    					if( $(this).attr("uc") == m.get("usercode")){
	    						$(this).prop("checked", true);
	    					}
					     });
//	    				if(tmp&&tmp.length==0){
//							$("#checkAll").addClass("hide");
//						}
	    			});//end 
				}
			},error:function(){
				mdboss.error( );
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
//				$(this).find("a").removeClass("curSelectedNode");
//			});
//			$(".ztree").each(function(){
//				$(this).find("li").each(function(i){
//					if(i==0)
//						$(this).find("a:first").addClass("curSelectedNode");
//				});
//			});
		}
		
	});
});