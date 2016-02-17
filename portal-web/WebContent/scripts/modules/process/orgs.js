/**
 * 公文便签新建
 * 使用方法
  seajs.use("meno", function () {
      var meno=new mdboss.Model.processMeno();
      new mdboss.View.processMeno(meno);
   });
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss");
	$ = require("jquery");
	Dialog = require("dialog");
	require("mCustomScrollbar");
	require("scroll");

	//id = orgcode , name=orgname
	mdboss.Model.selectOrg = Backbone.Model.extend({
		initialize: function(){ },
		defaults: {}
	});	
	/* 缓存查回来的所有选中的部门 */
	mdboss.Collection.orgsSelected = Backbone.Collection.extend({
		initialize : function(){ this.on('reset',function(){}); 		},
		comparator: 'id'
	});
	//选中的部门
//	var orgSelected =new mdboss.Collection.orgsSelected();
	var extorgSelected =new mdboss.Collection.orgsSelected();

	//相关部门
	mdboss.View.orgsView = Backbone.View.extend({
		$dialog:"",
		initialize : function(data) {
			_this=this;
			_this.rdata=data;
			_this.callback=data.callbacks;
			_this.data=data.dept;//选中的部门code数组
			_this.selectOnly=data.selectOnly;//是否单选
			_this.$parent=data.parent;
			_this.nodesList;
			var title = "送相关部门";
			var d_height = "440px";
			if(data.title){
				title = data.title;
			}
			if(_this.rdata.custom && _this.rdata.custom.showorgext){
				d_height = "465px";
			}
			_this.dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                    $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                }
            }, {"title":title,"width":"660px","height":d_height,"icon":"iconfont icon-mdliucheng","resize":function(){
                }}).show(function(){
                	$dialog=this;
                	
                	var reqData = { "usercode":mdboss.usercode, "type":"all", "pageNo":1,"pageSize":0 };
     	             if(_this.rdata.queryCondition){
     	            	 var tmpCondition = new Array();
     	            	 tmpCondition.push({"key":"orglevel","operate":"In","v1":["1","2"]});
     	            	reqData.queryCondition = tmpCondition;
     	             }
     	            
     	            if(_this.rdata.custom &&  _this.rdata.custom.queryCondition){//查询条件
     	            		reqData.queryCondition = _this.rdata.custom.queryCondition;
    	             }
     	             extorgSelected.reset();//清空已添加的数据
     	             for(var i=0; _this.rdata.extdepts && i<_this.rdata.extdepts.length; i++ ){
     	            	 extorgSelected.add(new mdboss.Model.selectOrg({"id":_this.rdata.extdepts[i],"code":_this.rdata.extdepts[i]}));
     	             }
                	
                	 mdboss.getReady({data:[{"name":"orgs","post":reqData}],template:["orgs_select"]},function(result,msg){
                         if(result) {
                             var data=result.data["orgs"];
                             var template = Handlebars.compile(result.template["orgs_select"]);
                             var html = "";
                             if(_this.selectOnly){
                            	 html = template({"submit":true});
                             }else{
                            	 html = template({});
                             }
                             $($dialog.dialog).find(".loading").removeClass("loading");
                             $(html).appendTo($($dialog.dialog).find(".dialog-content")).fadeIn();
                             
                             
                             if(_this.rdata.custom && _this.rdata.custom.showorgext){//是否显示- 添加院外单位
             	            		 _this.$el.find("#showorgext").show();
             	             }
                             
                             var setting = {
                          			check: {
                          				enable: true,
                          				chkboxType:{"Y":"","N":"ps"}
                          			},
                          			data: {
                          				simpleData: {
                          					enable: true
                          				}
                          			},
                          			callback:{
                          				onCheck:function onCheck(e,treeId,treeNode){
                          						_this.showcheck(_this.$el.find("#orgextBefore").prop("checked"));
//                          		            var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
//                          		            nodes=treeObj.getCheckedNodes(true);
//                          		        	 $("#selected-depts").html("");
//                      		        		 var deptshow=new Array();
//                      		        		 for(var i=0;i<nodes.length;i++){
//                      		        			 deptshow.push('<span class="file-show" style="margin-right:3px;" data-code="'+nodes[i].id+'">');
//                      		        			 deptshow.push('<a id="d'+nodes[i].id+'"  data-code="'+nodes[i].id+'" data-name="'+nodes[i].name+'">'+nodes[i].name+'</a> ');
//                      		        			 deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
//                      		        			 deptshow.push('</span>');
//                      		        		 }
//                      		        		 $("#selected-depts").append(deptshow.join(''));
//                      		        		 _this.check();
//                          		        	 $(_this.dialog.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                          				}
                          			},
                          			view :{  
                          	            showIcon: true,  
                          	            fontCss:function(treeId,treeNode){
                          	      			return (!!treeNode.highlight) ? {color:"red", "font-weight":"bold"}:{color:"#333", "font-weight":"normal"};  
                          	      		}
                          	        }  
                          			
                          		};
                             // 
                             if(_this.selectOnly){
                            	 setting = {
                               			data: {
                               				simpleData: { enable: true}
                               			},
                               			callback:{
                               				beforeClick:function(treeId,treeNode) { 
                               				//回调
                      		        			var callback = _this.rdata.callbacks;
                      		        			var callbackFn = typeof callback == "function" ? callback : function () { };
                      		        			callbackFn(treeNode, _this.rdata.parent, _this.rdata.pview);
                      		        			$dialog.close();
                              				} ,
                               			},
                               			view :{  
                               	            showIcon: true,  
                               	            fontCss:function(treeId,treeNode){
                               	      			return (!!treeNode.highlight) ? {color:"red", "font-weight":"bold"}:{color:"#333", "font-weight":"normal"};  
                               	      		}
                               	        }  
                               			
                               		};
                             }
                             var zNodes=new Array();
//                             var deptshow=new Array();
                             var orgname = "";
                             if(data.rows!=undefined){
                            	 zNodes.push({"id":"","pId":"","name":"空", "icon":"images/org.png"});
                            		$.each(data.rows,function(index,item){
                                 		var tmp=true;
                                 		if(_this.data!=undefined){
                                 			$.each(_this.data,function(i,dept){
                                     			if(item.orgcode==dept){
//                                     				orgname = item.orgname;
                                     				zNodes.push({"id":item.orgcode,"pId":item.parentcode,"name":item.orgname,checked:true,"icon":"images/orgs.png"});
//                                     				deptshow.push('<span class="file-show" style="margin-right:3px;" data-code="'+item.orgcode+'">');
//                                     				deptshow.push('<a id="d'+item.orgcode+'"  data-code="'+item.orgcode+'" data-name="'+item.orgname+'">'+item.orgname+'</a> ');
//                                     				deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
//                                     				deptshow.push('</span>');
                                     				tmp=false;
                                     			}
                                     		});
                                 		}
                                 		if(tmp){
                                 			if(item.parentcode =="org--1"){
                                 				zNodes.push({"id":item.orgcode,"pId":item.parentcode,"name":item.orgname,"open":true, "icon":"images/orgs.png"});
                                 			}else{
                                 				zNodes.push({"id":item.orgcode,"pId":item.parentcode,"name":item.orgname,"icon":"images/orgs.png"});
                                 			}
                                 		}
                                 	});
//                            		$("#selected-depts").html(deptshow.join(''));
                             }
                              $.fn.zTree.init(_this.$el.find("#treeDemo"), setting, zNodes);
                              //数据回显
                              _this.showcheck(_this.rdata.before);
                              $("#dept-container").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false  });
                              $("#userSelector-multi").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false  });
                              if(_this.selectOnly && orgname!=""){
                            	  var treeObj = $.fn.zTree.getZTreeObj("treeDemo");  
                            	  _this.nodeList = treeObj.getNodesByParamFuzzy("name", orgname);  
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
			"click .js_clean_all":"cleanall", //清空
			"keyup #orgextText":"orgextText",//添加院外单位
			"click #orgextBefore":"orgextBefore",//前面显示
		},
		orgextText:function(e){//添加院外单位
			var o_this = this;
			var $curt =$(e.currentTarget);
			if(e.which == 13){
				var curVal = $curt.val();
				if(curVal){
					var orgexts = curVal.split(";");
					for(var i=0; i<orgexts.length; i++){
						var orgext = $.trim(orgexts[i]);
						if(orgext != "")
							extorgSelected.add(new mdboss.Model.selectOrg({"id":orgext,"code":orgext}));
					}
				}
				if( o_this.$el.find("#orgextBefore").prop("checked") ){//加在前面
					o_this.showcheck(true);
				}else{ //加在后面
					o_this.showcheck(false);
				}
				$curt.val("");
			}
		},
		orgextBefore:function(e){//是否在前面显示
			if($(e.currentTarget).prop("checked")){
				this.showcheck(true);
			}
			else{
				this.showcheck(false);
			}
		},
		showcheck:function(before){
			var o_this = this;
            var html = "";
            var template = Handlebars.compile(require("text!template/page/member/selected.html"));
            var orgext = new Array();
            var org = new Array();
            if(before){
            	//外部 单位
            	extorgSelected.each(function(m){
            		orgext.push({"id":m.get("code"), "name":m.get("code")});
            	});
            	html = template({"nodes": orgext, "orgext":true});
            	o_this.$el.find("#selected-depts").html( html );
            	////本 单位
            	var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
		            nodes=treeObj.getCheckedNodes(true);
        		 for(var i=0;i<nodes.length;i++){
        			 org.push( {"id": nodes[i].id , "name":nodes[i].name }  );
        		 }
        		 html = template({"nodes": org, "orgext":false});
            	$("#selected-depts").append( html );
            }else{
            	
            	 var treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
		            nodes=treeObj.getCheckedNodes(true);
        		 for(var i=0;i<nodes.length;i++){
        			 org.push( {"id": nodes[i].id , "name":nodes[i].name }  );
        		 }
        		 //本单位
        		 html = template({"nodes": org, "orgext":false});
        		 o_this.$el.find("#selected-depts").html( html );
        		//外部 单位
        		 extorgSelected.each(function(m){
             		orgext.push({"id":m.get("code"), "name":m.get("code")});
             	 });
             	 html = template({"nodes": orgext, "orgext":true});
             	 o_this.$el.find("#selected-depts").append( html );
            }
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
			 extorgSelected.reset();
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
			if( $parent.data("code") == $parent.data("name")){
				extorgSelected.remove(new mdboss.Model.selectOrg( {"id":$parent.data("code") }));
			}else{
				var treeObj=$.fn.zTree.getZTreeObj("treeDemo");
				var node = treeObj.getNodeByParam("id",$parent.data("code"), null);
				node.checked=false;
				treeObj.updateNode(node);
			}
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
        	var deptlist=new Array();
        	_this.$el.find("#selected-depts .file-show a:first-child").each(function(index,item){
        		deptlist.push({"code":$(item).data("code"), "name":$(item).data("name")});
        		deptshow.push('<span class="file-show" style="margin-right:3px;position: relative; top: 4px;" data-code="'+$(item).data("code")+'">');
 				if($(item).data("code") == $(item).data("name")){//院外单位
 					deptshow.push('<a id="sl_'+$(item).data("code")+'" data-edit="true" data-id="'+$(item).data("code")+'" data-name="'+$(item).data("name")+'" style="color:green;">'+$(item).data("name")+'</a> ');
 				}else{
 					deptshow.push('<a id="sl_'+$(item).data("code")+'" data-edit="true" data-id="'+$(item).data("code")+'"   data-name="'+$(item).data("name")+'">'+$(item).data("name")+'</a> ');
 				}
 				deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
 				deptshow.push('</span>');
        	});
        	
//        	console.log(_this.callback);
        	if(_this.rdata.selectCheckbox){
        		_this.callback(_this.rdata.pview, deptlist);
        	}else{
        		_this.callback(deptshow.join(''));
        	}
    		$dialog.close();
        }
	
	});
});