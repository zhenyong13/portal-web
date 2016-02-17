/**
 * 流程实例加载
 * 使用方法
  seajs.use("meno", function () {
      var meno=new mdboss.Model.processMeno();
      new mdboss.View.processMeno(meno);
   });
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss");
	$ = require("jquery");
//	require("tree")($);
//	require("tree_excheck")($);
	require("mCustomScrollbar");
	Dialog = require("dialog");
	require("scroll");
	
	
	mdboss.Model.selectProcess = Backbone.Model.extend({
		initialize: function(){ },
		defaults: {}
	});	
	/* 缓存查回来的所有选中的成员 */
	mdboss.Collection.processSelected = Backbone.Collection.extend({
		initialize : function(){ this.on('reset',function(){}); 		},
		comparator: 'id'
	});
	//选中的人员
	var processSelected =new mdboss.Collection.processSelected();
	

	//相关部门
	mdboss.View.processinstView = Backbone.View.extend({
		$dialog:"",
		initialize : function(data) {
			_this=this;
			_this.rdata=data;
			_this.callback=data.callbacks;
			_this.data=data.dept;//选中的部门{code, name}数组
			_this.$parent=data.parent;
			_this.nodesList;
			var title = "委托事项";
			if(data.title){
				title = data.title;
			}
			_this.dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                    $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                }
            }, {"title":title,"width":"660px","height":"450px","icon":"iconfont icon-mdliucheng","resize":function(){
                }}).show(function(){
                	$dialog=this;
                	 mdboss.getReady({data:[{"name":"processetree","post":{ "usercode":mdboss.usercode }}],template:["orgs_select"]},function(result,msg){
                         if(result) {
                             var data=result.data["processetree"];
                             var template = Handlebars.compile(result.template["orgs_select"]);
                             var html  = template({"search_name":"查询事项"});
                             $($dialog.dialog).find(".loading").removeClass("loading");
                             $(html).appendTo($($dialog.dialog).find(".dialog-content")).fadeIn();
                             
                             var setting = {
                          			check: {
                          				enable: true,
                          				chkboxType:{"Y":"ps","N":"ps"}
                          			},
                          			data: {
                          				simpleData: {
                          					enable: true
                          				}
                          			},
                          			callback:{
                          				onCheck:function onCheck(e,treeId,treeNode){
//                          					console.log(treeNode);
                          					
                          		            var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
                          		            nodes=treeObj.getCheckedNodes(true);
                          		         	processSelected.reset();
                      		        		 for(var i=0;i<nodes.length;i++){
//                      		        			 console.log(nodes[i]);
                      		        			 if(nodes[i].pId && !nodes[i].isParent){//叶子节点
                      		        				 var parentNode = nodes[i].getParentNode(); //其父结点
                      		        				 var pid = parentNode.id;
                      		        				 var pname = parentNode.name;
                      		        				 console.log(parentNode);
                      		        				 
                      		        				 //字节点
                      		        				 var child = parentNode.children;
                      		        				  var checkAll = true; //判断子节点是否全选
                      		        				 for(var j=0; j<child.length; j++){
                      		        					 if(!child[j].checked){
                      		        						checkAll = false;
                      		        					 }
                      		        				 }
                      		        				 
                      		        				if(checkAll){
                      		        					processSelected.add(new mdboss.Model.selectProcess({"id":pid+"_*","name":pname}));
                      		        				}else{
                      		        					for(var j=0; j<child.length; j++){
                      		        						if(child[j].checked){
                          		        						processSelected.add(new mdboss.Model.selectProcess({"id":pid+ '_' +child[j].id,"name":child[j].name}));
                          		        					 }
                         		        				 }
                      		        				}
                      		        				 
                      		        			 }
                      		        		 }
                      		        		
                      		        		$("#selected-depts").html("");
                      		        		var deptshow=new Array();
                      		        		processSelected.each(function(m){
                      		        			deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+m.get("id")+'">');
             		        					 deptshow.push('<a id="d'+m.get("id")+'" data-code="'+m.get("id")+'" data-name="'+m.get("name")+'">'+m.get("name")+'</a> ');
             		        					 deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
             		        					 deptshow.push('</span>');
                      		        		});
                      		        		 $("#selected-depts").append(deptshow.join(''));
                      		        		 _this.check();
                          		        	 $(_this.dialog.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                          				}
                          			},
                          			view :{  
                          	            showIcon: true,  
                          	            fontCss:function(treeId,treeNode){
                          	      			return (!!treeNode.highlight) ? {color:"red", "font-weight":"bold"}:{color:"#333", "font-weight":"normal"};  
                          	      		}
                          	        }  
                          		};
                             
                             var deptshow=new Array();
                             //
                             if(_this.data!=undefined){
                      			$.each(_this.data,function(i,dept){
                      				deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+dept.code+'">');
                      				deptshow.push('<a id="d'+dept.code+'"  data-code="'+dept.code+'" data-name="'+dept.name+'">'+dept.name+'</a> ');
                      				deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
                      				deptshow.push('</span>');
                          		});
                      			$("#selected-depts").html(deptshow.join(''));
                      		}
                             
                             //
                             var zNodes=new Array();
                             if(data.rows!=undefined){
//                            	 zNodes.push({"id":"-1","pId":"0","name":"根结点","open":true});
                            	 	$.each(data.rows, function(index,item){//1
//                            	 		zNodes.push({"id":itm.processtypecode,"pId":"0","name":itm.processtype,"open":true});
//                            	 		$.each(itm.processdefs,function(index,item){//2
                                     		var tmp=true;
                                     		if(_this.data!=undefined){
                                     			$.each(_this.data,function(i,dept){
                                     				var tmpp = dept.code.split("_"); 
                                     				var mp = "";
                                     				if(tmpp[1] =="*"){
                                     					mp = tmpp[0];
                                     				}else{
                                     					mp = tmpp[1];
                                     				}
                                         			if(item.code==mp){
                                         				zNodes.push({"id":item.code,"pId":item.pcode,"name":item.name, checked:true});
                                         				tmp=false;
                                         			}
                                         		});
                                     		}
                                     		
                                     		if(tmp){
                                     			zNodes.push({"id":item.code,"pId":item.pcode,"name":item.name});
//                                     			if(item.pcode){
//                                     				zNodes.push({"id":item.code,"pId":item.pcode,"name":item.name});
//                                     			}
//                                     			else{
//                                     				zNodes.push({"id":item.code,"pId":item.pcode,"name":item.name, open:true});
//                                     			}
                                     		}
//                                     	});
                                		
                            	 	});
                            		
                             }
                              $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                              $("#dept-container").mCustomScrollbar({scrollButtons:{
      	 						enable:false }, theme: "darkblue",horizontalScroll:false,
                              });
                              _this.show_selected();
                              // 
                              $($dialog.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                         }
                         else{
                        	 mdboss.error(msg);
                         }
                     });
                });
			this.$el = _this.dialog.$html;
		},
		show_selected:function(e){//选中已选 的
			_this=this;
			 var treeObj=$.fn.zTree.getZTreeObj("treeDemo");
			$.each(_this.data,function(i,dept){
				var tmpp = dept.code.split("_");  
 				if(tmpp[1] =="*"){
 					var parentNode = treeObj.getNodeByParam("id", tmpp[0], null);
 					 var child = parentNode.children;
    				 for(var j=0; j<child.length; j++){
    					 child[j].checked=true;
    				 }
 					treeObj.updateNode(parentNode);
 				}else{
 				}
      		});
			_this.check();
		},
		events:{
			"click .js_selected_dept_ok":"submit_selected_dept",
			"click .js_selected_dept_cancel":"cancel_selected_dept",
			"click .js_close_dept":"del_selected",
			"keydown .js_search_tree":"changeColor",
			"click .js_clean_all":"cleanall"
		},
		cleanall:function(e){
			_this=this;
			_this.$el.find("#selected-depts").html("");
			_this.$el.find("#clean-all-dept").hide();
			 var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
	            nodes=treeObj.getCheckedNodes(true);
			 for(var i=0;i<nodes.length;i++){
				 nodes[i].checked=false;
				 treeObj.updateNode(nodes[i]);
			 }
		},
		 changeColor:function(e){
			 if(e.keyCode==13){
				 _this=this;
				    var key="name";
				    var value=$(e.currentTarget).val();
				    _this.updateNodes(false);  
				    if(value != ""){  
				        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");  
				        _this.nodeList = treeObj.getNodesByParamFuzzy(key, value);  
				        if(_this.nodeList && _this.nodeList.length>0){  
				            _this.updateNodes(true);  
				        }  
				    }  
			 }
			
		},
		 updateNodes:function(highlight) {  
			 _this=this;
		    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");  
		    if(_this.nodeList!=undefined&&_this.nodeList.length>0){
		        for( var i=0; i<_this.nodeList.length;  i++) {  
			        _this.nodeList[i].highlight = highlight;  
			        treeObj.updateNode(_this.nodeList[i]); //更新选中样式
	               treeObj.expandNode(_this.nodeList[i], true, true, true);//展开选中
	               treeObj.selectNode(_this.nodeList[i]);

			    }  
		    }
		
		},
		cancel_selected_dept:function(e){
			$dialog.close();
		},
		
		del_selected:function(e){
			_this=this;
			var $current=$(e.currentTarget);
			var $parent=$current.parent();
			 var treeObj=$.fn.zTree.getZTreeObj("treeDemo");
			var node = treeObj.getNodeByParam("id",$parent.data("code"), null);
			node.checked=false;
			treeObj.updateNode(node);
			$parent.remove();
			_this.check();
		},
		check:function(){
			if($("#selected-depts a").length>0){
    			$("#clean-all-dept").show();
    		}else{
    			$("#clean-all-dept").hide();
    		}
    		
        },
        submit_selected_dept:function(){
        	_this=this;
        	var deptshow=new Array();
        	_this.$el.find("#selected-depts .file-show a:first-child").each(function(index,item){
        		deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+$(item).data("code")+'">');
 				deptshow.push('<a id="sl_'+$(item).data("code")+'" data-edit="true" data-id="'+$(item).data("code")+'"   data-name="'+$(item).data("name")+'">'+$(item).data("name")+'</a> ');
 				deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
 				deptshow.push('</span>');
        	});
    		_this.callback(deptshow.join(''));
    		$dialog.close();
        }
	
	});
});