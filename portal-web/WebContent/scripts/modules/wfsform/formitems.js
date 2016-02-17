/**
 * 表单项管理
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss"), 
	$ = require("jquery");
	require("scroll");
	require("validVal")($);
	// 表单项管理
	mdboss.Model.formItemsModel = Backbone.Model.extend({
		_this:this,
		actionUrl:'',
		url:function(){
			return this.actionUrl;
		},
		initialize : function() {
		},
		fetchDiagram:function(post){
			this.actionUrl=mdboss.api.preDiagram;
			return this.save({"processcode":post.processinstcode,"usercode":mdboss.usercode},{error:function(){
				mdboss.error();
			}});
		},
		fetchActivity:function(post){
			this.actionUrl=mdboss.api.activity;
			return this.save({"processcode":post.processinstcode,"usercode":mdboss.usercode},{error:function(){
				mdboss.error();
			}});
		}
	});
	mdboss.Model.getStepHandler = Backbone.Model.extend({});
	
	mdboss.View.formItemsView = Backbone.View.extend({
		initialize : function(data) {
			this.models=data.model;
			this.is_edit=data.is_edit;
			this.$el=data.$el;
			this.formdatalist={};
			this.dialog = data.dialog;
			this.formcode=data.formcode;
			this.template=Handlebars.compile(require("text!template/page/wfsform/formitems.html"));
			this.formitem={};
		},
		events:{
			"click .js_set_step_handler":"set_step_handler",
			"click .js_set_step_info":"set_step_info",//编辑表单项
			"click .js_copy_step_info":"jscopystepinfo",//复制表单项
			"click .add-form-item":"addformitem",//添加表单项
			"click .js_set_step_handler":"deleteformitem",//添加表单项
			"click #formitemsCheckAll":"formitemsCheckAll",//全选 /全不选
			"click .edit-form-item":"formitemsEdit",//批量修改
			"click input[name=form_items]":"formitemsChange",//批量修改
			"mouseover .flowsheet_tab_color":"colorChangeIn",
			"mouseout .flowsheet_tab_color":"colorChangeOut",
			"mouseover .flowsheet_tab_color i":"updateIcon",
			"mouseout .flowsheet_tab_color i":"resetIcon"
		},
		jscopystepinfo:function(e){//复制表单//
			var f_this = this ;
			var $current=$(e.currentTarget);
			var itemid = $current.data("id");
			mdboss.confirm("确定要复制吗？", function(s){
				if(s){
					var reqdata ={};					
					if( f_this.formdatalist && f_this.formdatalist.length>0){
						for(var i=0; i<f_this.formdatalist.length; i++){
							if( f_this.formdatalist[i].id == itemid){
								reqdata = f_this.formdatalist[i];
								break;
							}
						}
					}
					reqdata.usercode = mdboss.usercode;
					reqdata.id = undefined;
					mdboss.reqsubmit(reqdata, mdboss.api.duplicateitem, function(m, res){
						if(res.rc == 1){
							mdboss.alert("复制成功！");
							f_this.renderData(f_this.formcode);
						}else{
							mdboss.error(res.msg);
						}
					});
				}
			});
			
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
		formitemsEdit:function(){
			var formItems = new Array();
			this.$el.find("input[name=form_items]:checked").each(function(){
				formItems.push($(this).val());
			});
			if(formItems.length ==0){
				mdboss.error("请选要修改的表单项！"); return;
			}
			//renderData 回调渲染页面
			new mdboss.View.formFormItemEdit({"title":"批量修改表单项","formcode":this.formcode,"formItems":formItems,"pview":this, "renderData":this.renderData});//
		},
		formitemsChange:function(e){//选中与未选中
			var $current=$(e.currentTarget);
			if($current.prop("checked")){
				$current.closest("tr").addClass("process_set_selected");
			}else{
				$current.closest("tr").removeClass("process_set_selected");
			}
		},
		formitemsCheckAll:function(e){
			var $current=$(e.currentTarget);
			this.$el.find("input[name=form_items]").closest("tr").removeClass("process_set_selected");
			this.$el.find("input[name=form_items]").prop("checked",$current.prop("checked"));
			this.$el.find("input[name=form_items]:checked").closest("tr").addClass("process_set_selected");
		},
		updateIcon:function(e){
			var $current=$(e.currentTarget);
			$current.removeClass("fa-1_4x").addClass("fa-1_6x");
		},
		resetIcon:function(e){
			var $current=$(e.currentTarget);
			$current.removeClass("fa-1_6x").addClass("fa-1_4x");
		},
		addformitem:function(){
			new mdboss.View.formFormItem({"title":"新建表单项","formcode":this.formcode,"pview":this, "renderData":this.renderData});//
		},
		deleteformitem:function(e){//删除表单项
			var $this=$(e.currentTarget);
			mdboss.confirm("确定要删除吗?", function(c){
				if(c){
					var formcode=$this.data("formcode");//表单编码
					var itemcode=$this.data("itemcode");//表单项编码
					var commonModel = new mdboss.Model.commonModel();
					commonModel.save({usercode:mdboss.usercode,formcode:formcode,itemcode:itemcode},
							{url:mdboss.api.formitemdel, success:function(m,d ){
						if(d.rc == 1){
							$this.parent().parent().remove();
						}else{
							mdboss.error(d.msg);
						}
					},error:function(){
    					mdboss.error();
    				}});
				}
			});
		},
		//表单项编辑
		set_step_info:function(e){
			var $current=$(e.currentTarget);
			$current.closest("tr").addClass("process_set_selected");
			var formcode=$current.data("formcode");//表单项编码
			var itemcode=$current.data("itemcode");//表单项编码
			new mdboss.View.formFormItem({"title":"编辑表单项" ,"formcode": formcode, "itemcode":itemcode,"pview":this,"renderData":this.renderData});
		},
		renderData:function(pview, formcode){
			var f_this = pview;
			f_this.$el.find("#formitemsCheckAll").prop("checked",false);
			var commonModel=new mdboss.Model.commonModel();
			commonModel.save({"usercode":mdboss.usercode,"formcode":formcode},
					{url:mdboss.api.formitemlist,success:function(model,response){
				if(response.rc==1){//
					 if(response.data!=undefined&&response.data.rows!=undefined){
						 f_this.formdatalist = response.data.rows;
						 var template = Handlebars.compile(require("text!template/page/wfsform/formitem_list.html"));
						 f_this.$el.find("#formitem-list").html(template({data:response.data.rows}));
					 }
				}else{
					mdboss.error(response.msg);
					f_this.dialog.close();
				}
			},error:function(){
				mdboss.error();
			}});
		},
		render:function(post){
			f_this=this;
			var commonModel=new mdboss.Model.commonModel();
			commonModel.save({"usercode":post.usercode,"formcode":post.formcode},{url:mdboss.api.formitemlist,
				success:function(model,response){
				if(response.rc==1){
					 var _thisDialog=f_this.$el;
					 var $content=_thisDialog.find(".dialog-content");
					 if(response.data!=undefined&&response.data.rows!=undefined){
						 f_this.formdatalist = response.data.rows;
						 $content.html(f_this.template({data:response.data.rows}));
						 $content.find(".jscroll,.scrollwrapper").jScrollPane();
					 }
				}else{
					mdboss.error(response.msg);
					post.dialog.close();
				}
			},error:function(){
				mdboss.error();
			}});
			return this;
		}
	});
	
	//_------------------------------------------------------------------------------------------------------------------------------------
	//新建表单项
	mdboss.View.formFormItem = Backbone.View.extend({
		$dialog:"",
		initialize : function(data) {
			i_item=this;
			i_item.data=data;
			this.formcode = data.formcode;
			var dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                    $(this).find(".jscroll").jScrollPane();
                }
            }, {"title":i_item.data.title,"width":"900px","height":"600px","icon":"iconfont icon-mdliucheng","resize":function(){
                }}).show(function(){
                	$dialog=this;
                	 var template = Handlebars.compile(require("text!template/page/wfsform/newFormItem.html"));
                	 //表单类型
                	 var reqData = new Array();
                	 reqData.push({ "name":"queryProcesstype","post":{"usercode":mdboss.usercode,"definition":"WFS_FORMITEM_TYPE"},"cache" : false});
                	 
                	 //查询 表单项详情
                	 if(i_item.data.itemcode){
                		 reqData.push( { "name":"listoneitem","post":{"usercode":mdboss.usercode,"formcode":i_item.data.formcode,"itemcode":i_item.data.itemcode} ,"cache" : false});
                	 }
                	 
                	 mdboss.getReady({data:reqData,template:[]}, function(result, msg){
                	 var queryProcesstype = result.data["queryProcesstype"];
                	 var queryFormItem = result.data["listoneitem"];
                	 
                	 var formItem = null;
                	 if(i_item.data.itemcode){
                		 formItem = queryFormItem.rows[0];
                	 }else{
                		 formItem = { "itemcode":"","defaultvalue":"", "formcode":i_item.data.formcode, "itemname":"", "regionorder":"", "regioncode":"",
        						"itemorder":"", "valuesource":"", "validatorcode":"", };
                	 }
                	 
        			 var html = template({processtype:queryProcesstype, data:formItem});
        			 var commonModel = new mdboss.Model.commonModel();
        			 //数据类型
        			 commonModel.save({"usercode":mdboss.usercode,"definition":"WFS_FORMITEM_DATATYPE"},
        					 {url:mdboss.api.queryProcesstype,success:function(model, res){
        				  if(res.rc == 1){
        					  var tmp = res.data.rows;
        					  for(var i =0; i<tmp.length; i++){
        						  var htm ='<option value="'+tmp[i].dictcode+'">'+tmp[i].dictname+'</option>';
        						  if(i_item.data.itemcode && formItem.datatype == tmp[i].dictcode){
        							  htm ='<option value="'+tmp[i].dictcode+'" selected>'+tmp[i].dictname+'</option>';
        						  }
        						  i_item.$el.find("#data_type").append(htm);
        					  }
        				  }else{
        					  mdboss.error(res.msg);
        				  }
        			 },error:function(){
     					mdboss.error();
     				 }});//数据类型
        			 //取值方式
        			 commonModel.save({"usercode":mdboss.usercode,"definition":"WFS_FORMITEM_VALUETYPE"},
        					 {url:mdboss.api.queryProcesstype,success:function(model, res){
        						 if(res.rc == 1){
        							 var tmp = res.data.rows;
        							 $("#value_type").append('<option value="">请选择</option>');
        							 for(var i =0; i<tmp.length; i++){
        								 var htm ='<option value="'+tmp[i].dictcode+'">'+tmp[i].dictname+'</option>';
        								 if(i_item.data.itemcode && formItem.valuetype == tmp[i].dictcode){
        									 htm ='<option value="'+tmp[i].dictcode+'" selected>'+tmp[i].dictname+'</option>';
        								 }
        								 i_item.$el.find("#value_type").append(htm);
        							 }
	        					 }else{
	        						 mdboss.error(res.msg);
	        					 }
        			 },error:function(){
     					mdboss.error();
     				 }});//取值方式
        			 
                     $($dialog.dialog).find(".loading").removeClass("loading");
                     $(html).appendTo($($dialog.dialog).find(".dialog-content")).fadeIn();
                     $( ".form-category-bd" ).validVal();
        		});
                	
             });
			this.$el = dialog.$html;
		},
		events:{
			"click .js_form_submit":"form_submit",
			"click .js_form_cancel":"form_cancel",
		},
		form_submit:function(){
			i_item=this;
			var form_data = $( ".form-category-bd" ).triggerHandler( "submitForm" );
	        if ( form_data ) {
				var newModel=new mdboss.Model.commonModel();
				var tid=i_item.$el.find("#item_id").val();//表单项
//				var token=i_item.$el.find("#token").val();//token
				var name=i_item.$el.find("#type_name").val();//表单项
				var itemcode=i_item.$el.find("#item_code").val();//表单项code
				var itemcol=i_item.$el.find("#item_col").val();//列宽
				var itemorder=i_item.$el.find("#item_order").val();//项序号
				var regioncode=i_item.$el.find("#region_code").val();//分组
				var formcode=this.formcode;
				var type=i_item.$el.find("#type_").val();
				var datatype=i_item.$el.find("#data_type").val();
				var defaultvalue=i_item.$el.find("#default_value").val();
				var editable=i_item.$el.find("#editable_").val();
				var isshow=i_item.$el.find("#is_show").val();
				var regionorder=i_item.$el.find("#region_order").val();
				var valuetype=i_item.$el.find("#value_type").val();
				var valuesource=i_item.$el.find("#value_source").val();
				var custom=i_item.$el.find("#custom").val();
				var scope=i_item.$el.find("#scope_").val();
				var required=i_item.$el.find("#required_").val();
				var validatorcode=i_item.$el.find("#validator_code").val();
				
				if(name);else name=null;
				if(itemcode);else itemcode=null;
				if(formcode);else formcode=null;
				if(itemorder);else itemorder=null;
				if(regioncode);else regioncode=null;
				if(type);else type=null;
				if(datatype);else datatype=null;
				if(defaultvalue);else defaultvalue=null;
				if(editable);else editable=null;
				if(validatorcode);else validatorcode=null;
				if(required);else required=null;
				if(scope);else scope=null;
				if(custom);else custom=null;
				if(valuesource);else valuesource=null;
				if(valuetype);else valuetype=null;
				if(regionorder);else regionorder=null;
				if(isshow);else isshow=null;
				
				var data={"usercode":mdboss.usercode,
						"itemcode":itemcode,
						"formcode":formcode,
						"cols":itemcol,
						"itemname":name,
						"type":type,
						"datatype":datatype,
						"required":required,
						"defaultvalue":defaultvalue,
						"editable":editable,
						"isshow":isshow,
						"regionorder":regionorder,
						"regioncode":regioncode,
						"itemorder":itemorder,
						"valuetype":valuetype,
						"valuesource":valuesource,
						"scope":scope,
						"validatorcode":validatorcode,
						"custom":custom
						};
					var url = mdboss.api.formitemadd; //添加
					if(tid){
						url = mdboss.api.formitemchg; //编辑
						data.tid = tid;
					}
					$("#submit-loading-mask").show();
					$("#submit-loading").show();
					//var data={"usercode":usercode,"filecode":this.file.id,"filename":this.file.name,"isenabled":isenabled,"processdesc":processdesc,"processtype":processtype};
					newModel.save(data,{url:url ,success:function(model,response){
						$("#submit-loading-mask").hide();
						$("#submit-loading").hide();
						if(response.rc==1){
							if(tid){
								mdboss.notifyTips("编辑成功");
							}else{
								mdboss.notifyTips("新建成功");
							}
							var callbackFn = typeof i_item.data.renderData == "function" ? i_item.data.renderData : function () { };
							callbackFn(i_item.data.pview, formcode);//回调
							$dialog.close();
						}else{
							mdboss.error(response.msg);
						}
					},error:function(){
						$("#submit-loading-mask").hide();
						$("#submit-loading").hide();
						mdboss.error();
					}});
	        }
		},
		form_cancel:function(){
			$dialog.close();
		}
	});
//新建表单项 --------------------------------------- 
	
	
	
	//批量修改表单项 
	mdboss.View.formFormItemEdit = Backbone.View.extend({
		$dialog:"",
		initialize : function(data) {
			e_item=this;
			e_item.data=data;
			this.formcode = data.formcode;
			this.formItems = data.formItems;
			var dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                    $(this).find(".jscroll").jScrollPane();
                }
            }, {"title":e_item.data.title,"width":"900px","height":"450px","icon":"iconfont icon-mdliucheng","resize":function(){
                }}).show(function(){
                	$dialog=this;
                	 var template = Handlebars.compile(require("text!template/page/wfsform/formItemsEdit.html"));
                	 //表单类型
                	 var reqData = new Array();
                	 reqData.push({ "name":"queryProcesstype","post":{"usercode":mdboss.usercode,"definition":"WFS_FORMITEM_TYPE"},"cache" : false});
                	 
                	 //查询 表单项详情
                	 if(e_item.data.itemcode){
                		 reqData.push( { "name":"listoneitem","post":{"usercode":mdboss.usercode,"formcode":e_item.data.formcode,"itemcode":e_item.data.itemcode} ,"cache" : false});
                	 }
                	 
                	 mdboss.getReady({data:reqData,template:[]}, function(result, msg){
                	 var queryProcesstype = result.data["queryProcesstype"];
                	 var queryFormItem = result.data["listoneitem"];
                	 
                	 var formItem = null;
                	 if(e_item.data.itemcode){
                		 formItem = queryFormItem.rows[0];
                	 }else{
                		 formItem = { "itemcode":"","defaultvalue":"", "formcode":"", "itemname":"", "regionorder":"", "regioncode":"",
        						"itemorder":"", "valuesource":"", "validatorcode":"", };
                	 }
                	 
        			 var html = template({processtype:queryProcesstype, data:formItem,"token":new Date().getTime()});
        			 var commonModel = new mdboss.Model.commonModel();
        			 //数据类型
        			 commonModel.save({"usercode":mdboss.usercode,"definition":"WFS_FORMITEM_DATATYPE"},
        					 {url:mdboss.api.queryProcesstype,success:function(model, res){
        				  if(res.rc == 1){
        					  var tmp = res.data.rows;
        					  $("#data_type").append('<option value="">请选择</option>');
        					  for(var i =0; i<tmp.length; i++){
        						  var htm ='<option value="'+tmp[i].dictcode+'">'+tmp[i].dictname+'</option>';
        						  if(e_item.data.itemcode && formItem.datatype == tmp[i].dictcode){
        							  htm ='<option value="'+tmp[i].dictcode+'" selected>'+tmp[i].dictname+'</option>';
        						  }
        						  $("#data_type").append(htm);
        					  }
        				  }else{
        					  mdboss.error(res.msg);
        				  }
        			 },error:function(){
     					mdboss.error();
     				 }});//数据类型
        			 //取值方式
        			 commonModel.save({"usercode":mdboss.usercode,"definition":"WFS_FORMITEM_VALUETYPE"},
        					 {url:mdboss.api.queryProcesstype,success:function(model, res){
        						 if(res.rc == 1){
        							 var tmp = res.data.rows;
        							 $("#value_type").append('<option value="">请选择</option>');
        							 for(var i =0; i<tmp.length; i++){
        								 var htm ='<option value="'+tmp[i].dictcode+'">'+tmp[i].dictname+'</option>';
        								 if(e_item.data.itemcode && formItem.valuetype == tmp[i].dictcode){
        									 htm ='<option value="'+tmp[i].dictcode+'" selected>'+tmp[i].dictname+'</option>';
        								 }
        								 e_item.$el.find("#value_type").append(htm);
        							 }
	        					 }else{
	        						 mdboss.error(res.msg);
	        					 }
        			 },error:function(){
     					mdboss.error();
     				 }});//取值方式
        			 
                     $($dialog.dialog).find(".loading").removeClass("loading");
                     $(html).appendTo($($dialog.dialog).find(".dialog-content")).fadeIn();
                     $( ".form-category-bd" ).validVal();
        		});
                	
             });
			this.$el = dialog.$html;
		},
		events:{
			"click .js_form_submit":"form_submit",
			"click .js_form_cancel":"form_cancel",
		},
		form_submit:function(){
			var ve_item = this;
			var form_data = $( ".form-category-bd" ).triggerHandler( "submitForm" );
	        if ( form_data ) {
				var newModel=new mdboss.Model.commonModel();
				var token=ve_item.$el.find("#token").val();//token
				var formItems=this.formItems;
				
				var type=ve_item.$el.find("#type_").val();
				var datatype=ve_item.$el.find("#data_type").val();
				var defaultvalue=ve_item.$el.find("#default_value").val();
				var editable=ve_item.$el.find("#editable_").val();
				var isshow=ve_item.$el.find("#is_show").val();
				var itemcol=ve_item.$el.find("#item_col").val();//列宽
				var regionorder=ve_item.$el.find("#region_order").val();
				var regioncode=ve_item.$el.find("#region_code").val();//分组
				
				var valuetype=ve_item.$el.find("#value_type").val();
				var valuesource=ve_item.$el.find("#value_source").val();
				var scope=ve_item.$el.find("#scope_").val();
				var required=ve_item.$el.find("#required_").val();
				var validatorcode=ve_item.$el.find("#validator_code").val();
				var custom=ve_item.$el.find("#custom").val();
				var data={"usercode":mdboss.usercode,
						"token":token,
						"tids":formItems,
						};
					if(type !="")  data.type = type;
					if(regionorder !="")  data.regionorder = regionorder;
					if(regioncode !="")  data.regioncode = regioncode;
					if(datatype!="") data.datatype = datatype;
					if(valuetype!="") data.valuetype = valuetype;
					if(valuesource!="") data.valuesource = valuesource;
					if(validatorcode!="") data.validatorcode = validatorcode;
					if(scope!="") data.scope = scope;
					if(isshow!="") data.isshow = isshow;
					if(editable!="") data.editable = editable;
					if(defaultvalue!="") data.defaultvalue = defaultvalue;
					if(required!="") data.required = required;
					if(itemcol!="") data.cols = itemcol;
					if(custom!="") data.custom = custom;
					
					var url = mdboss.api.formitemedit; //批量修改
					
					$("#submit-loading-mask").show();
					$("#submit-loading").show();
					//var data={"usercode":usercode,"filecode":this.file.id,"filename":this.file.name,"isenabled":isenabled,"processdesc":processdesc,"processtype":processtype};
					newModel.save(data,{url:url ,success:function(model,response){
						$("#submit-loading-mask").hide();
						$("#submit-loading").hide();
						if(response.rc==1){
							mdboss.notifyTips("编辑成功");
							var callbackFn = typeof ve_item.data.renderData == "function" ? ve_item.data.renderData : function () { };
							callbackFn(ve_item.data.pview, ve_item.formcode);//回调
							$dialog.close();
						}else{
							mdboss.error(response.msg);
						}
					},error:function(){
						$("#submit-loading-mask").hide();
						$("#submit-loading").hide();
						mdboss.error();
					}});
	        }
		},
		form_cancel:function(){
			$dialog.close();
		}
	});
//批量修改表单项 --------------------------------------- 
});