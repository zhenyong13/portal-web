/**
 * 模块选择
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss");
	$ = require("jquery");
	require("mCustomScrollbar");
//	require("tree")($);
//	require("tree_excheck")($);
	Dialog = require("dialog");
	require("scroll");
	
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
		 
		$("#clean-all-perm_").removeClass("hide");
		$("#permselect").append(tmp);
	});
	
//	移除选 中的
	membersSelected.on("remove", function(m) {
		$("#permselect").empty();
		
		if(this.models.length == 0){
			$("#clean-all-perm_").addClass("hide");
		}
		$("#perm-flow-list").find("li i[data-code="+m.get("id")+"]").removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
		 $("#perm-flow-list").find("li i[data-code="+m.get("id")+"]").closest("li").removeClass("selected");
    		
		this.each(function(m){
			 var template = Handlebars.compile($("#user-select-template").html());
		     var tmp = template({"usercode":m.get("id"),"username":m.get("name")});
			$("#permselect").append(tmp);
		});
	});
	//-------------------------------------------------------------------------------------------------------------------------------


	//模块选择
	mdboss.View.rolepermselectView = Backbone.View.extend({
		initialize : function(data) {
			p_this=this;
			p_this.data=data.dept;//选中的部门code数组
			p_this.rdata=data;//选中的部门code数组
			p_this.$parent=data.parent;
			p_this.nodesList;
			this.pageNo=1;
			this.pageSize=10;
			this.permload = true;
			this.permname="";
			p_this.title="角色授权";
			if(p_this.rdata.title){
				p_this.title = p_this.rdata.title;
			}
			 this.heitht = "520px";
			 if(p_this.rdata.showsubmit){
				 this.heitht ="550px";
			 }
			p_this.dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                    $(p_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                }
            }, {"title":p_this.title,"width":"680px","height":this.heitht,"icon":"iconfont icon-mdliucheng","resize":function(){
                }}).show(function(){
                	$dialog=this;
                	var queryArray = new Array();
                	if(p_this.rdata.showsubmit){//只查看 
                	}else{
                		queryArray.push({"name":"sysmodulelist","post":{"usercode":mdboss.usercode,"type":"all","pageNo":1,"pageSize":0,"orderBy":"parentcode,moduleorder" }});
                	}
                	 mdboss.getReady({data:queryArray,template:[]},function(result,msg){
                         if(result) {
                             var data=result.data["sysmodulelist"];
                             var html = require("text!template/page/common/roleperm_select.html");
                             $($dialog.dialog).find(".loading").removeClass("loading");
                             $(html).appendTo($($dialog.dialog).find(".dialog-content")).fadeIn();
                            
                             var setting = {
                          			data: {
                          				simpleData: {
                          					enable: true
                          				}
                          			},
                          			callback:{
                          				beforeClick:function(treeId,treeNode) { //回调
                  		        			var callback = p_this.rdata.callback;
                  		        			var callbackFn = typeof callback == "function" ? callback : function () { };
                  		        			callbackFn( p_this.rdata,treeNode.id);
                      		        		$dialog.close();
                              			} ,
                          				onCheck:function onCheck(e,treeId,treeNode){
                          					var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
                          		            nodes=treeObj.getCheckedNodes(true);
                          		        	 $("#selected-depts").html("");
                      		        		 var deptshow=new Array();
                      		        		 for(var i=0;i<nodes.length;i++){
                      		        			 deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+nodes[i].id+'">');
                      		        			 deptshow.push('<a id="d'+nodes[i].id+'"  data-code="'+nodes[i].id+'" data-name="'+nodes[i].name+'">'+nodes[i].name+'</a> ');
                      		        			 deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
                      		        			 deptshow.push('</span>');
                      		        		 }
                      		        		 $("#selected-depts").append(deptshow.join(''));
                      		        		 p_this.check();
                          		        	 $(p_this.dialog.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                          				}
                          			},
                          			view :{  
                          	            showIcon: true,  
                          	            fontCss:function(treeId,treeNode){
                          	      			return (!!treeNode.highlight) ? {color:"red", "font-weight":"bold"}:{color:"#333", "font-weight":"normal"};  
                          	      		}
                          	        }  
                          			
                          		};
                             if(p_this.rdata.selecttype && p_this.rdata.selecttype == "radio"){// 单选 
                            	 $("#perm_select_all").hide();
                             }else{
                            	 if(p_this.rdata.showsubmit){
                            		 
                            	 }else{
                            		 setting.check =  {
                            				 enable: true,
                            				 chkboxType:{"Y":"ps","N":"ps"}
                            		 };
                            	 }
                             }
                             
                             var zNodes=new Array();
                             var zNodes_=new Array();
                             var deptshow=new Array();
                             
                             
                             if(p_this.rdata.showsubmit){//只查看
                            	 zNodes.push({"id":"-1","pId":"","name":"根节点","open":true});
                             		if(p_this.data!=undefined){
                             			$.each(p_this.data,function(i,dept){
                                 				zNodes.push({"id":dept.modulecode,"pId":dept.parentcode,"name":dept.modulename});
                                 				tmp=false;
                                 		});
                             		}
                            	$("#selected-depts").html(deptshow.join(''));
                            	
                            	 $(".js_selected_dept_ok").hide();
                               	 $(".e-query").hide();
                               	 $("#perm-flow-list").css("max-height", "300px");
                               	 $("#dept-container").css("max-height", "360px");
                               	 $(".js_selected_dept_cancel").text("关闭");
                             }else{
                            	 if(data.rows!=undefined){
                                	 zNodes.push({"id":"-1","pId":"","name":"根节点","open":true});
                                		$.each(data.rows,function(index,item){
                                     		var tmp=true;
                                     		if(p_this.data!=undefined){
                                     			$.each(p_this.data,function(i,dept){
                                         			if(item.modulecode==dept.modulecode){
                                         				zNodes.push({"id":item.modulecode,"pId":item.parentcode,"name":item.modulename,checked:true});
                                         				zNodes_.push({"id":item.modulecode,"pId":item.parentcode,"name":item.modulename,checked:true});
                                         				modulename = item.modulename;
                                         				deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+item.modulecode+'">');
                                         				deptshow.push('<a id="d'+item.modulecode+'"  data-code="'+item.modulecode+'" data-name="'+item.modulename+'">'+item.modulename+'</a> ');
                                         				deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
                                         				deptshow.push('</span>');
                                         				tmp=false;
                                         			}
                                         		});
                                     			$(".js_clean_all").show();
                                     		}
                                     		if(tmp){
                                     			zNodes.push({"id":item.modulecode,"pId":item.parentcode,"name":item.modulename});
                                     		}
                                     	});
                                		$("#selected-depts").html(deptshow.join(''));
                                 }
                             }
                             
                            var treeobj = $.fn.zTree.init($("#treeDemo"), setting, zNodes); 
                            $.each(zNodes_,function(i,item){//展开有选中的节点
                       		 	var node = treeobj.getNodeByParam("id",item.id,null).getParentNode();
                       		 	treeobj.expandNode(node,true,true,true);
                       	 	});
                             //
                            if(p_this.rdata.showsubmit)
                            	treeobj.expandAll(true);
                            
                             $("#dept-container").mCustomScrollbar({scrollButtons:{
          						enable:false }, theme: "darkblue",horizontalScroll:false,
                             });
                             
                             if(p_this.rdata.showsubmit){//只查看 
                            	 p_this.showperm(p_this.rdata.perms);
                             }else{
                            	 //加载权限列表 及回显
                            	 p_this.showDefaultPerm();
                             }
                             p_this.processShow(p_this.rdata.process); // TODO 暂时隐藏
                            $($dialog.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                         }
                         else{
                        	 mdboss.error(msg);
                         }
                     });
                });
			this.$el = p_this.dialog.$html;
		},
		
		processShow:function(processlist){//流程显示 TODO
			p_this = this;
        	if(p_this.rdata.showsubmit){//只查看 
        		p_this.processTree(processlist);
        	}else{//api.roleprocess
        		mdboss.reqsubmit({"pageNo":1,"pageSize":0,"queryCondition":[{"key":"isenabled","operate":"EqualTo","v1":"enable"}],"orderBy":"processtype,sortorder" }, mdboss.api.workflowlist,function(m, res){
        			if(res.rc == 1){
        				p_this.processTree(res.data.rows);
        			}else{
        				mdboss.error(res.msg);
        			}
        		});
        	}
		},
		
		processTree:function(list){//构造树
			 var setting = {
           			data: { simpleData: { enable: true } },
           			callback:{
           				onCheck:function onCheck(e,treeId,treeNode){
           					var treeObj=$.fn.zTree.getZTreeObj("processTree"),
           		            nodes=treeObj.getCheckedNodes(true);
           		        	 $("#selected-process").html("");
       		        		 var deptshow=new Array();
       		        		 for(var i=0;i<nodes.length;i++){
       		        			 deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+nodes[i].id+'">');
       		        			 deptshow.push('<a id="p'+nodes[i].id+'"  data-code="'+nodes[i].id+'" data-name="'+nodes[i].name+'">'+nodes[i].name+'</a> ');
       		        			 deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
       		        			 deptshow.push('</span>');
       		        		 }
       		        		 $("#selected-process").append(deptshow.join(''));
       		        		 p_this.check();
           		        	 $(p_this.dialog.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
           				}
           			},
           			view :{  
           	            showIcon: true,  
           	            fontCss:function(treeId,treeNode){
           	      			return (!!treeNode.highlight) ? {color:"red", "font-weight":"bold"}:{color:"#333", "font-weight":"normal"};  
           	      		}
           	        }  
           			
           		};
			 if(p_this.rdata.showsubmit){
         	 }else{
         		 console.log("sdf");
         		 setting.check =  {
         				 enable: true,
         				 chkboxType:{"Y":"ps","N":"ps"}
         		 };
         	 }
              
              var zNodes=new Array();
              var zNodes_=new Array();
              var deptshow=new Array();
              
              
              if(p_this.rdata.showsubmit){//只查看
             	 zNodes.push({"id":"-1","pId":"","name":"根节点","open":true});
              		if(p_this.data!=undefined&&list!=undefined){
              			$.each(list,function(i,dept){
              					if(dept.parentcode==null || dept.parentcode =="")
              							dept.parentcode = "-1";
                  				zNodes.push({"id":dept.processcode,"pId":dept.parentcode,"name":dept.processname});
                  				tmp=false;
                  		});
              		}
              }else{
             	 if(list!=undefined){
                 	 zNodes.push({"id":"-1","pId":"","name":"根节点","open":true});
                 		$.each(list,function(index,item){
                      		var tmp=true;
                      		if(item.parentcode==null || item.parentcode =="")
                      			item.parentcode = "-1";
                      		
                      		if( p_this.rdata.process ){
                      			$.each(p_this.rdata.process,function(i,dept){
                          			if(item.processcode==dept.processcode){
                          				zNodes.push({"id":item.processcode,"pId":item.parentcode,"name":item.processname,checked:true});
                          				zNodes_.push({"id":item.processcode,"pId":item.parentcode,"name":item.processname,checked:true});
                          				modulename = item.typename;
                          				deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+item.processcode+'">');
                          				deptshow.push('<a id="d'+item.processcode+'"  data-code="'+item.processcode+'" data-name="'+item.processname+'">'+item.processname+'</a> ');
                          				deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
                          				deptshow.push('</span>');
                          				tmp=false;
                          			}
                          		});
                      			$("#clean-all-process").show();
                      		}
                      		if(tmp){
                      			zNodes.push({"id":item.processcode,"pId":item.parentcode,"name":item.processname});
                      		}
                      	});
                 		$("#selected-process").html(deptshow.join(''));
                  }
              }
              
             var treeobj = $.fn.zTree.init($("#processTree"), setting, zNodes); 
             $.each(zNodes_,function(i,item){//展开有选中的节点
        		 	var node = treeobj.getNodeByParam("id",item.id,null).getParentNode();
        		 	treeobj.expandNode(node,true,true,true);
        	 });
              //
             if(p_this.rdata.showsubmit)
             	treeobj.expandAll(true);
             
              $("#process-container").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false, });
              
		},
		
		showperm:function(perms){//查询所授予的权限
			s_this = this;
			s_this.$el.find("#perm-flow-list").mCustomScrollbar("destroy");
	        s_this.$el.find("#perm-flow-list").html('<div class="loading"></div>');
	         
			if(s_this.rdata.selecttype && s_this.rdata.selecttype =="radio"){
				listTemplate = Handlebars.compile( s_this.$el.find("#roleperm-list-only-template").html());
			}else{
				listTemplate = Handlebars.compile( s_this.$el.find("#roleperm-list-template").html());
			}
        	 var listHtml=listTemplate({data:perms});
        	 s_this.$el.find("#perm-flow-list").html(listHtml);
        	 s_this.$el.find("#perm-flow-list").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false, });
		},
		events:{
			"click .js_selected_dept_ok":"submit_selected_dept",
			"click .js_selected_dept_cancel":"cancel_selected_dept",
			"click .js_close_dept":"del_selected",
			"keydown .js_search_tree":"changeColor",
			"click .js_clean_all":"cleanall",
			"click #clean-all-process":"cleanallprocess",
//			"click #rolemenuTitle":"roleperm1",
//			"click #permmenuTitle":"roleperm2",
			"click #roleMenu h3":"rolepermMenu",
			
			"keyup #module_perm_name":"permsearch",
			"click #module_perm_name_":"permsearch",
			"click #clean-all-perm_":"cleanPerms",
			
			'click #check-all-perm':'checkall',//全选
			'click .js_close_perm':'deletePerm',//删除所选的权限
        	 'click #perm-flow-list li span.js-check-box i':'checkbox',//checkobx 选中取消
        	 'click .j-perm-select':'jpermselect',//checkobx 选择
		},
		jpermselect:function(e){//选择权限 
			var $this  = $(e.currentTarget);
			var p_this = this;
			var callback = p_this.rdata.callback;
			var permcode = $this.data("code");
  			var callbackFn = typeof callback == "function" ? callback : function () { };
  			callbackFn( p_this.rdata,permcode);
  			p_this.dialog.close();
		},
		cleanPerms:function(){//清空所有数据
			membersSelected.reset();
			$this= $("#check-all-perm");
	       	var $li = $("#perm-flow-list").find("li");
            var $i = $("#perm-flow-list").find("li  i");
            $li.removeClass("selected");
            $this.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
          	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
			$("#permselect").empty();
			$("#clean-all-perm_").addClass("hide");
		},
		showSelectPerm:function(data){//数据默认选中
			//回显
//			var s_this = this;
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
						if(m.get("id") == data[i].permcode){
							   $("#perm-flow-list").find("li i[data-code="+data[i].permcode+"]").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
							   $("#perm-flow-list").find("li i[data-code="+data[i].permcode+"]").closest("li").addClass("selected");
				           		allFlag1 = false;
				           		return false; 
							}
					});
				}
				if(allFlag){//全选
					$("#check-all-perm").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
				}
			}
		},
		permsearch:function(e){
			if(e.type =="keyup"){
				if(e.which == 13){
					this.loadpermlist();
				}
			}else{
				this.loadpermlist();
			}
		},
		showDefaultPerm:function(){//回显
			//添加已选 
			var s_this = this;
			if(s_this.rdata.perms && s_this.rdata.perms.length>0){
				var length = s_this.rdata.perms.length;
				var perms = s_this.rdata.perms;
				for(var j=0; j<length ; j++){//roles
	           		membersSelected.add(new mdboss.Model.selectMem({"id":perms[j].permcode,"name":perms[j].permname}));
				}
			}
			s_this.loadpermlist();
		},
		deletePerm:function(e){
			var $this  = $(e.currentTarget);
			var usercode = $this.attr("code");
			var username = $this.attr("value");
			membersSelected.remove(new mdboss.Model.selectMem({"id":usercode,"name":username}));
		},
		
        checkbox:function(e){//选中与取消
       	 	$_this=$(e.currentTarget);
        	$_checkbox=$("#perm-flow-list li span.js-check-box");
        	var code = $_this.data("code");
			var name = $_this.data("name");
        	if($_this.hasClass("icon-checkbox-checked")){
        		$_this.closest("li").removeClass("selected");
        		$_this.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
        		if($("#check-all-perm").hasClass("icon-checkbox-checked")){
        			$("#check-all-perm").addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
        		}
        		membersSelected.remove(new mdboss.Model.selectMem({"id":code,"name":name}));
        	}else{
        		$_this.closest("li").addClass("selected");
        		$_this.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
        		if($_checkbox.find("i").length==$_checkbox.find("i.icon-checkbox-checked").length){
            		$("#check-all-perm").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	}
        		membersSelected.add(new mdboss.Model.selectMem({"id":code,"name":name}));
        	} 
        
        },
        checkall:function(e){
        	e.preventDefault();
	       	 $this= $("#check-all-perm");
	       	 $this.toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
	       	 var $li = $("#perm-flow-list").find("li");
	            var $i = $("#perm-flow-list").find("li  i");
	            if($this.hasClass("icon-checkbox-checked")){
		           	 $i.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
		           	 $li.addClass("selected");
		           	$.each($("#perm-flow-list").find("li i"), function(i, item){
		           		var code = $(item).data("code");
		    			var name = $(item).data("name");
		           		membersSelected.add(new mdboss.Model.selectMem({"id":code,"name":name}));
		           	 });
	            }else{
		           	 $li.removeClass("selected");
		           	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
		           	$.each($("#perm-flow-list").find("li i"), function(i, item){
		           		var code = $(item).data("code");
		    			var name = $(item).data("name");
		           		membersSelected.remove(new mdboss.Model.selectMem({"id":code,"name":name}));
		           	 });
	            }
        },
//		:function(){
//			$("#rolemenuTitle").addClass("active");
//			$("#permmenuTitle").removeClass("active");
//			$("#roleperm_rolemenu").show();
//			$("#roleperm_permmenu").hide();
//		},
//		roleperm2:function(){
//			
//			$("#rolemenuTitle").removeClass("active");
//			$("#permmenuTitle").addClass("active");
//			$("#roleperm_rolemenu").hide();
//			$("#roleperm_permmenu").show();
//		},
		rolepermMenu:function(e){//菜单切换
			var $this = $(e.currentTarget);
			 var id=$(e.currentTarget).attr("id"); 
			 $this.siblings().removeClass("active");
			 $this.addClass("active");
			 $("#roleperm_rolemenu").hide();
			 $("#roleperm_permmenu").hide();
			 $("#roleperm_processmenu").hide();
			 $("#roleperm_"+id).show();
		},
		loadpermlist:function(){
			//渲染列表
       	 s_this=this;
       	 var commonModel=new mdboss.Model.commonModel();       	 
       	 //查询条件
       	 var tmpCondition = new Array();
//	            if(this.modulecode != ""){
//	            	tmpCondition.push({"key":"permcode","operate":"Like","v1":this.modulecode});
//	            }
	            if(this.permname){
	            	tmpCondition.push({"key":"permname", "operate":"Like","v1":this.permname});
	            }
//	            if(this.moduletype != ""){
//	            	tmpCondition.push({"key":"permtype", "operate":"EqualTo","v1":this.moduletype});
//	            }
	           s_this.condition = tmpCondition;
	           
	           s_this.$el.find("#perm-flow-list").mCustomScrollbar("destroy");
	           s_this.$el.find("#perm-flow-list").html('<div class="loading"></div>');
	           commonModel.save({ "usercode":mdboss.usercode,"pageNo":s_this.pageNo, "pageSize":s_this.pageSize,  
    			"queryCondition": s_this.condition,},{url:mdboss.api.syspermlist,success:function(model,res){
    				if(res.rc == 1){
    					var listTemplate = null;
    					if(s_this.rdata.selecttype && s_this.rdata.selecttype =="radio"){
    						listTemplate = Handlebars.compile( s_this.$el.find("#roleperm-list-only-template").html());
    					}else{
    						listTemplate = Handlebars.compile( s_this.$el.find("#roleperm-list-template").html());
    					}
    	            	 var listHtml=listTemplate({data:res.data.rows});
    	            	 s_this.$el.find("#perm-flow-list").html(listHtml);
    	            	 //
    	            	 s_this.$el.find("#perm-flow-list").mCustomScrollbar({scrollButtons:{
    	 						enable:false }, theme: "darkblue",horizontalScroll:false,
    	                 });
    	            	 s_this.showSelectPerm(res.data.rows);
    	            	 s_this.totalPage =parseInt((res.data.total+mdboss.pageSize-1)/s_this.pageSize);
 	            	    $("#permission_pagination").bs_pagination({ totalPages:s_this.totalPage,currentPage:s_this.pageNo,
 	   	            		rowsPerPage:s_this.pageSize,
 	   	            		onChangePage: function(event, data) {
 	   	            			s_this.pageNo = data.currentPage;
 	   	            			s_this.pageSize = data.rowsPerPage;
 	   	            			s_this.loadpermlist();
 	               			},
 	               			totalRows:res.data.total,
 	               			showGoToPage: true,
 	   	       				showRowsPerPage : true,
 	   	       				showRowsInfo : true,
// 	   	       				showRowsDefaultInfo : true,
 	   	            	 });
    				}else{
    					mdboss.error(res.msg);
    				}
    			},error:function(){
    				$("#submit-loading").hide();
    				mdboss.error();
    			}});
		},
		cleanall:function(e){
			p_this=this;
			p_this.$el.find("#selected-depts").html("");
			p_this.$el.find("#clean-all-dept").hide();
			 var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
	            nodes=treeObj.getCheckedNodes(true);
			 for(var i=0;i<nodes.length;i++){
				 nodes[i].checked=false;
				 treeObj.updateNode(nodes[i]);
			 }
		},
		cleanallprocess:function(){
			p_this=this;
			p_this.$el.find("#selected-process").html("");
			 var treeObj=$.fn.zTree.getZTreeObj("processTree"),
	            nodes=treeObj.getCheckedNodes(true);
			 for(var i=0;i<nodes.length;i++){
				 nodes[i].checked=false;
				 treeObj.updateNode(nodes[i]);
			 }
		},
		 changeColor:function(e){
			 var type = $(e.currentTarget).attr("data-type");
			 
			 if(e.keyCode==13){
				 p_this=this;
				    var key="name";
				    var value=$(e.currentTarget).val();
				    p_this.updateNodes(false);  
				    if(value){  
				        var treeObj = $.fn.zTree.getZTreeObj(type);  
				        p_this.nodeList = treeObj.getNodesByParamFuzzy(key, value);  
				        if(p_this.nodeList && p_this.nodeList.length>0){  
				            p_this.updateNodes(true,type);  
				        }  
				    }  
			 }
			
		},
		 updateNodes:function(highlight,type) {  
			 p_this=this;
			 if(type){
				 var treeObj = $.fn.zTree.getZTreeObj(type);  
				    if(p_this.nodeList!=undefined&&p_this.nodeList.length>0){
				        for( var i=0; i<p_this.nodeList.length;  i++) {  
					        p_this.nodeList[i].highlight = highlight;  
					        treeObj.updateNode(p_this.nodeList[i]); //更新选中样式
			               treeObj.expandNode(p_this.nodeList[i], true, true, true);//展开选中
			               treeObj.selectNode(p_this.nodeList[i]);

					    }  
				    }
			 }
		    
		
		},
		cancel_selected_dept:function(e){
//			if(p_this.rdata.callback){
//   				callback = p_this.rdata.callback;
//   				var callbackFn = typeof callback == "function" ? callback : function () { };
//   				callbackFn(p_this.rdata.pview);
//   			 }
			$dialog.close();
		},
		del_selected:function(e){
			p_this=this;
			var $current=$(e.currentTarget);
			var $parent=$current.parent();
			 var treeObj=$.fn.zTree.getZTreeObj("treeDemo");
			var node = treeObj.getNodeByParam("id",$parent.data("code"), null);
			node.checked=false;
			treeObj.updateNode(node);
			$parent.remove();
			p_this.check();
		},
		check:function(){
			if($("#selected-depts a").length>0){
    			$("#clean-all-dept").show();
    		}else{
    			$("#clean-all-dept").hide();
    		}
    		
        },
        submit_selected_dept:function(){
        	p_this=this;
//        	var deptshow=new Array();
        	var modules=new Array();//角色菜单
        	$("#selected-depts .file-show a:first-child").each(function(index,item){
        		if($(item).data("code") !="-1")
        			modules.push($(item).data("code"));
//        		deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+$(item).data("code")+'">');
// 				deptshow.push('<a id="sl_'+$(item).data("code")+'" did="'+$(item).data("code")+'"   data-name="'+$(item).data("name")+'">'+$(item).data("name")+'</a> ');
// 				deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
// 				deptshow.push('</span>');
        	});
        	
        	//流程
        	var process=new Array();
        	$("#selected-process .file-show a:first-child").each(function(index,item){
        		if($(item).data("code") !="-1")
        			process.push($(item).data("code"));
        	});
        	
        	var perms=new Array();//权限
        	$.each(membersSelected.models,function(index, m){
        		if(m.get("id") != "-1")
        			perms.push(m.get("id"));
        	});
        	
        	if(modules.length ==0 && perms.length ==0 && process.length==0){
        		mdboss.error("请选择角色菜单或权限!");return;
        	}
        	
        	var commonModel = new mdboss.Model.commonModel();
	       	 commonModel.save({"usercode":mdboss.usercode, "rolecode":p_this.rdata.rolecode,"modules":modules,"perms":perms,"process":process},
	       			 {url:mdboss.api.rolepermadd,success:function(m,res){
	       		 if(res.rc == 1){
	       			 mdboss.alert("角色授权成功!");
	       			 if(p_this.rdata.callback){
	       				callback = p_this.rdata.callback;
	       				var callbackFn = typeof callback == "function" ? callback : function () { };
	       				callbackFn(p_this.rdata.pview);
	       			 }
	       			 $dialog.close();
	       		 }else{
	       			 mdboss.error(res.msg);
	       		 }
	       	 },error:function(){
	       		 mdboss.error();
	       	 }});
        	
        	
//    		$(p_this.$parent).find(".jscroll").jScrollPane({"autoReinitialise": true});
        }
	
	});
});