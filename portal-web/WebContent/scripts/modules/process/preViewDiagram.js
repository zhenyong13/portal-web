
define(function(require, exports, module) {
	var mdboss = require("mdboss"), 
	$ = require("jquery");
	require("scroll");
	// 
	mdboss.Model.preViewDiagramModel = Backbone.Model.extend({
		_this:this,
		actionUrl:'',
		url:function(){
			return this.actionUrl;
		},
		initialize : function() {
		},
		fetchDiagram:function(post){
			this.actionUrl=mdboss.api.preDiagram;
			return this.save({"processcode":post.processinstcode,"usercode":mdboss.usercode});
		},
		fetchActivity:function(post){
			this.actionUrl=mdboss.api.activity;
			return this.save({"processcode":post.processinstcode,"usercode":mdboss.usercode});
		}
	});
	mdboss.Model.getStepHandler = Backbone.Model.extend({});
	
	mdboss.View.preViewDiagramView = Backbone.View.extend({
		initialize : function(data) {
			this.models=data.model;
			this.is_edit=data.is_edit;
			this.$el=data.$el;
			this.processcode=data.processcode;
			this.template=Handlebars.compile(require("text!template/page/process/form/preViewFlow.html"));
			this.listenTo(this.models,"sync",this.result);
			this.activity_arr={};
		},
		events:{
			"click .js_set_step_handler":"set_step_handler",
			"click .js_set_step_info":"set_step_info",//修改-
			"mouseover .flowsheet_tab_color i":"updateIcon",
			"mouseout .flowsheet_tab_color i":"resetIcon",
			"click #stepIdAll":"checkAll",//全选 全不选 
			"click .edit-form-item":"formitemsEdit",//批量修改
			"click input[name=step_ids]":"formitemsChange",//批量修改
			"mouseover .flowsheet_tab_color":"colorChangeIn",
			"mouseout .flowsheet_tab_color":"colorChangeOut",
		},
		colorChangeIn:function(e){
			var $current=$(e.currentTarget);
			$current.closest("tr").addClass("process_set_selected");
		},
		colorChangeOut:function(e){
			var $current=$(e.currentTarget);
			if(!$current.find("input[type=checkbox]").prop("checked"))
				$current.closest("tr").removeClass("process_set_selected");
		},
		formitemsChange:function(e){
			var $current=$(e.currentTarget);
			if($current.prop("checked")){
				$current.closest("tr").addClass("process_set_selected");
			}else{
				$current.closest("tr").removeClass("process_set_selected");
			}
		},
		formitemsEdit:function(e){//批量修改
			var tids = new Array();
			this.$el.find("input[name=step_ids]:checked").each(function(){
				tids.push($(this).val());
			});
			if(tids.length ==0){
				mdboss.error("请选择要修改的流程环节!");return;
			}
			_this=this;
			var commonModel=new mdboss.Model.commonModel();
			commonModel.save({"usercode":mdboss.usercode},
					{"url":mdboss.api.formlist,success:function(model,response){
				if(response.rc==1){
					var formlist=null;
					if(response.data!=undefined&&response.data.rows!=undefined){
						formlist=response.data.rows;
					}
					
					var data={"usercode":mdboss.usercode,"prethis":_this,"processcode":_this.processcode,"formlist":formlist,"tids":tids, "eidtCallBack":_this.eidtCallBack};
					 seajs.use("setstepinfo", function () {
						 new mdboss.View.stepInfoEdit(data);
					});
				
				}else{
					mdboss.error(response.msg);
				}
			},error:function(){
    			mdboss.error();
    		}});
		},
		eidtCallBack:function(processinstcode,pre_this){//批量修改回调
			pre_this.$el.find("#stepIdAll").prop("checked", false);
			var commonModel = new mdboss.Model.commonModel();
			commonModel.save({"processcode":processinstcode,"usercode":mdboss.usercode},
					{url:mdboss.api.activity, success:function(m, data){
						if(data.rc == 1){
							var template = Handlebars.compile(require("text!template/page/process/form/preViewFlow_list.html"));
							pre_this.$el.find("#activityList").html(template({activity:data.data}));
//							 pre_this.activitytrack(data);
							 
							 pre_this.activity=data.data;
							 pre_this.activity_arr={};
							 $.each(pre_this.activity,function(index,item){
								var stepcode=item.stepcode;
								pre_this.activity_arr[stepcode]=item;
							});
						}else{
							mdboss.error(data.msg);
						}
					},error: function(){
						mdboss.error();
					}});
		},
		checkAll:function(){//全选 全不选 
			this.$el.find("input[name=step_ids]").prop("checked", this.$el.find("#stepIdAll").prop("checked"));
		},
		updateIcon:function(e){
			var $current=$(e.currentTarget);
			$current.removeClass("fa-1_4x").addClass("fa-1_6x");
		},
		resetIcon:function(e){
			var $current=$(e.currentTarget);
			$current.removeClass("fa-1_6x").addClass("fa-1_4x");
		},
		//指定环节信息编辑
		set_step_info:function(e){
			_this=this;
			var $current=$(e.currentTarget);
			$current.closest("tbody").find("tr").removeClass("process_set_selected");
			$current.closest("tbody").find("tr").find("input[type=checkbox]").prop("checked",false);
			$current.closest("tr").find("input[type=checkbox]").prop("checked",true);
			$current.closest("tr").addClass("process_set_selected");
			var stepcode=$current.data("stepcode");
			var commonModel=new mdboss.Model.commonModel();
			commonModel.save({"usercode":mdboss.usercode},{"url":mdboss.api.formlist,success:function(model,response){
				if(response.rc==1){
					var formlist=null;
					if(response.data!=undefined&&response.data.rows!=undefined){
						formlist=response.data.rows;
					}
					var data={"usercode":mdboss.usercode,"processcode":_this.processcode,"stepcode":stepcode,"step":_this.activity_arr[stepcode],"parent":_this,"formlist":formlist};
					if(data.step.opinionjson){
						data.step.opinion=JSON.parse(data.step.opinionjson);
					}
					if(data.step.resultjson){
						data.step.result=JSON.parse(data.step.resultjson);
					}
					seajs.use("setstepinfo", function () {
						 new mdboss.View.stepInfo(data);
					});
				
				}else{
					mdboss.error(response.msg);
				}
			},error:function(){
    			mdboss.error();
    		}});
			
		},
		set_step_handler:function(e){
			_this=this;
			var $current=$(e.currentTarget);
			$current.closest("tbody").find("tr").removeClass("process_set_selected");
			$current.closest("tbody").find("tr").find("input[type=checkbox]").prop("checked",false);
			$current.closest("tr").find("input[type=checkbox]").prop("checked",true);
			$current.closest("tr").addClass("process_set_selected");
			var stepcode=$current.data("stepcode");
			var data={"usercode":mdboss.usercode,"processcode":_this.processcode,"stepcode":stepcode};
			var setUpHandler=new mdboss.Model.getStepHandler();
			$("#submit-loading").show();
			setUpHandler.save(data,{url:mdboss.api.personconfigload,success:function(model,response){
				 seajs.use("selectHandler", function () {
					 $("#submit-loading").hide();
					 if(response.rc==1){
						 var data=response.data;
						 var selectedvalues=data.selectedvalues;
						 var post={"selectedvalues":selectedvalues,
								 "huiqian":true,obj:data.selectpersonconfig.selectitems,
								 "processcode":_this.processcode,
								 "stepcode":stepcode,
								 "istask":false,
								 "currentorgcode":mdboss.cache.data.getMyInfo.orgcode,
								 "selecttype":data.selectpersonconfig.selecttype,"callbacks":
									 _this.callback
//									 function(selected,huiqian){
//							 _this.callback(selected,huiqian,stepcode);
//						 }
						 ,"element":_this.$el.find("#selected_next_handler")};
	             		new mdboss.View.handlerView({model:new mdboss.Model.showHandlerType(post)});
					 }else{
						 mdboss.error(response.msg);
					 }
             	 }); 
			},error:function(){
				 $("#submit-loading").hide();
    			mdboss.error(error);
    		}});
		},
		callback:function(data,stepcode,processcode){
			var selected=new Array();
			if(data!=undefined){
				$.each(data,function(index,item){
					var tmp=item.real_code.split("_");
					selected.push({pcode:tmp[0],code:tmp[1]});
				});
				var stepModel=new mdboss.Model.getStepHandler();
				var post={"usercode":mdboss.usercode,"stepcode":stepcode,processcode:processcode,"selectedvalues":selected};
				stepModel.save(post,{url:mdboss.api.personconfig,success:function(m,d){
					if(d.rc==1){
						mdboss.notifyTips("设置成功");
					}else{
						mdboss.error(d.msg);
					}
				},error:function(){
	    			mdboss.error( );
	    		}});
			}
		},
		render:function(post){
			this.models.fetchDiagram(post);
			this.models.fetchActivity(post);
			return this;
		},
		result:function(){
			var response=this.models.attributes;
			if(response.rc==1){
				if(response.data&&response.data.filecode){
					this.diagram(response.data);
					this.showhtml();
				}else{
					this.activitytrack(response);
					this.showhtml();
				}
			}else{
				mdboss.error(response.msg);
			}
			
		},
		diagram:function(response){
			this.imgurl=baseConfig.base+"download?filecode="+response.filecode;
		},
		activitytrack:function(response){
			_this=this;
			_this.activity=response.data;
			_this.activity_arr={};
			$.each(_this.activity,function(index,item){
				var stepcode=item.stepcode;
				_this.activity_arr[stepcode]=item;
			});
			
		},
		showhtml:function(){
			_this=this;
			 var _thisDialog=_this.$el;
			 var $content=_thisDialog.find(".dialog-content");
			if(_this.imgurl!=undefined&&_this.activity!=undefined){
				$content.html(_this.template({"activity":_this.activity,"is_edit":_this.is_edit,"imgurl":_this.imgurl}));
				$(".flowsheet_title_img").load(function(){
					$content.find(".jscroll,.scrollwrapper").jScrollPane();
				}).error(function(){
					$content.find(".jscroll,.scrollwrapper").jScrollPane();
				});
			}
		}
	});
});