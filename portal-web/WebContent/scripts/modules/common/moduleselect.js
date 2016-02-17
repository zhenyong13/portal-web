/**
 * 模块选择
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss");
	$ = require("jquery");
//	require("tree")($);
//	require("tree_excheck")($);
	Dialog = require("dialog");
//	require("scroll");
	require("mCustomScrollbar");


	//模块选择
	mdboss.View.moduleselectView = Backbone.View.extend({
		$dialog:"",
		initialize : function(data) {
			_this=this;
			_this.data=data.dept;//选中的部门code数组
			_this.rdata=data;//选中的部门code数组
			_this.$parent=data.parent;
			_this.nodesList;
			_this.dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                    $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                }
            }, {"title":"模块选择","width":"660px","height":"450px","icon":"iconfont icon-mdliucheng","resize":function(){
                }}).show(function(){
                	$dialog=this;
                	 mdboss.getReady({data:[{"name":"sysmodulelist","post":{
                     	"usercode":mdboss.usercode,
                     	"type":"all",
                     	"pageNo":1,"pageSize":0,"orderBy":"moduleorder"
                     }}],template:["orgs_select"]},function(result,msg){
                         if(result) {
                             var data=result.data["sysmodulelist"];
                             var template = Handlebars.compile(result.template["orgs_select"]);
                             var html = template({"search_name":"查询模块","submit":true});
                             $($dialog.dialog).find(".loading").removeClass("loading");
                             $(html).appendTo($($dialog.dialog).find(".dialog-content")).fadeIn();
                             
                             var setting = {
//                          			check: {
//                          				enable: true,
//                          				chkboxType:{"Y":"","N":"ps"}
//                          			},
                          			data: {
                          				simpleData: {
                          					enable: true
                          				}
                          			},
                          			callback:{
                          				beforeClick:function(treeId,treeNode) { 
//                          				//回调
                  		        			var callback = _this.rdata.callback;
                  		        			var callbackFn = typeof callback == "function" ? callback : function () { };
                  		        			callbackFn(treeNode, _this.rdata.parent, _this.rdata.pview);
                  		        			$dialog.close();
                          				} ,
                          				/*onCheck:function onCheck(e,treeId,treeNode){
                          		            var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
                          		            nodes=treeObj.getCheckedNodes(true);
                          		        	 $("#selected-depts").html("");
                          		        	for(var i=0;i<nodes.length;i++){
                      		        			console.log(nodes[i].id +"--"+nodes[i].name);
                      		        			$("#parentcode").val(nodes[i].id);
                      		        			$("#parentname").val(nodes[i].name);
                     		        		 }
                      		        		//
                      		        		$dialog.close();
                          				}*/
                          			},
                          			view :{  
                          	            showIcon: true,  
                          	            fontCss:function(treeId,treeNode){
                          	      			return (!!treeNode.highlight) ? {color:"red", "font-weight":"bold"}:{color:"#333", "font-weight":"normal"};  
                          	      		}
                          	        }  
                          			
                          		};
                             var zNodes=new Array();
                             var deptshow=new Array();
                             var modulename="";
                             zNodes.push({"id":"-1","pId":"0","name":"根节点","open":true});
                             if(data.rows!=undefined){
                            		$.each(data.rows,function(index,item){
                                 		var tmp=true;
                                 		if(_this.data!=undefined){
                                 			$.each(_this.data,function(i,dept){
                                     			if(item.modulecode==dept){
                                     				zNodes.push({"id":item.modulecode,"pId":item.parentcode,"name":item.modulename,checked:true});
                                     				modulename = item.modulename;
                                     				deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+item.orgcode+'">');
                                     				deptshow.push('<a id="d'+item.modulecode+'"  data-code="'+item.modulecode+'" data-name="'+item.modulename+'">'+item.modulename+'</a> ');
                                     				deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
                                     				deptshow.push('</span>');
                                     				tmp=false;
                                     			}
                                     		});
                                 		}
                                 		if(tmp){
                                 			zNodes.push({"id":item.modulecode,"pId":item.parentcode,"name":item.modulename});
                                 		}
                                 	});
                            		$("#selected-depts").html(deptshow.join(''));
                             }
                             $.fn.zTree.init($("#treeDemo"), setting, zNodes); 
                             $("#dept-container").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false,  });
                            
                             if(modulename!=""){
                            	 var treeObj = $.fn.zTree.getZTreeObj("treeDemo");  
          				        _this.nodeList = treeObj.getNodesByParamFuzzy("name", modulename);  
          				        if(_this.nodeList && _this.nodeList.length>0){  
          				            _this.updateNodes(true);  
          				        } 
                             }
                            $($dialog.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                         }
                         else{
                        	 mdboss.error(msg);
                         }
                     });
                });
			this.$el = _this.dialog.$html;
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
        	$("#selected-depts .file-show a:first-child").each(function(index,item){
        		deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+$(item).data("code")+'">');
 				deptshow.push('<a id="sl_'+$(item).data("code")+'" did="'+$(item).data("code")+'"   data-name="'+$(item).data("name")+'">'+$(item).data("name")+'</a> ');
 				deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
 				deptshow.push('</span>');
        	});
    		$(".selected_dept_show").html(deptshow.join(''));
    		$(_this.$parent).find(".jscroll").jScrollPane({"autoReinitialise": true});
    		$dialog.close();
        }
	
	});
});