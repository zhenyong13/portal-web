/**
 * 表单管理 
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss");
	$ = require("jquery");

	// 视图 补签记录
	mdboss.View.processBiaodan = Backbone.View.extend({
		el : '#rightMainContainer',
		events : {
			'click .js_newcategory' : 'newCategory',//新建分类
			'click .js_buildNewForm' : 'newForm',//新建表单
			'mouseenter .icon-search' : 'showSearch',//显示搜索框
			'mouseleave .icon-search' : 'hideSearch',//隐藏搜索框
			'keyup #companyformsearch-keywords' : 'searchForm',//搜索表单
			"click .js_del_type":"del_type",//删除分类
			"click .js_edit_type":"edit_type",//编辑分类
			"click .js_changeFormStatus":"changeFormStatus",
    		"click .js_editForm":"editForm",//编辑
    		"click .js_copyForm":"copyForm",//复制
    		"click .js_formPreview":"formItems",//表单项列表
    		"click .js_deleteForm":"deleteForm",//删除表单
    		"click .toolkit-item-tab":"showTab",//切换tab
//    		"mouseenter .toolkit-item-tab":"showEdit",//显示编辑删除操作
//    		"mouseleave .toolkit-item-tab":"hideEdit",//隐藏编辑删除操作
		},
		hideEdit:function(e){
			 var $target = $(e.currentTarget);
	           $target.find("button").hide();
		},
		showEdit:function(e){
		   var $target = $(e.currentTarget);
           $target.find("button").show();
		},
		showTab:function(e){
			var v_this = this;
		   var $target = $(e.currentTarget);
          if(!$target.hasClass("active")){
              $target.addClass("active").siblings(".active").removeClass("active").find("button").hide();
              $target.find("button").show();
              var typeCode = $target.data("formtype");
              if($target.data("parentcode") == "-1"){
            	  $(".show_div_second").hide();
            	  $("#type_"+typeCode).show();
            	  if(v_this.$el.find("#type_"+typeCode).length >0 ){
            		  v_this.$el.find("#type_"+typeCode +" ul li:first").addClass("active").find("button").show();
            		  typeCode = v_this.$el.find("#type_"+typeCode +" ul li:first").data("formtype");
            	  }
              }
              v_this.typeCode=typeCode;
              v_this.loadformlist(typeCode);
              
              //TODO 加载数据
//              var $panel=$target.parents(".toolkit-panel");
//              $panel.find(".form-list-wrap.active").hide().removeClass("active");
//              $panel.find(".form-list-wrap").eq($target.index()).addClass("active").fadeIn();
          }
		},
		loadformlist:function(formtype){//加载表单 TODO
			v_this = this;
			var tmpCondition = new Array();
//          tmpCondition.push({"key":"typeclass","operate":"EqualTo","v1": "process"});
          tmpCondition.push({"key":"formtype","operate":"EqualTo","v1": formtype});
          v_this.$el.find("#formlist-loading").show();
//          v_this.$el.find(".form-list-wrap").html('<div class="loading"></div>');
          mdboss.reqsubmit({"usercode":mdboss.usercode,"queryCondition":tmpCondition,"orderBy":"formtype,sortorder","pageNo":1,"pageSize":0},
        		  mdboss.api.queryworkform, function(m, res){
        	  v_this.$el.find("#formlist-loading").hide();
        	  if(res.rc == 1){
        		  var template = Handlebars.compile(require("text!template/page/wfsform/formlist.html"));//
	              var html = template({"formlist":res.data.rows });
	              $.each(res.data.rows ,function(index,item){
             		 item.formtype=formtype;
             		 formList[item.formcode]=item;
             	  });
	              v_this.$el.find(".form-list-wrap").html(html);
        	  }else{
        		  mdboss.error(res.msg);
        	  }
          });
		},
		changeFormStatus:function(e){
			v_this = this;
            var $this = $(e.currentTarget),
             formId= $this.data("code"),
             status = $this.attr("status"),
             show = "";
            "enable" == status ? show = "启用": "disabled" == status ? show = "停用": "submit" == status && (show = "停用");
            updateStatus = function(a) {
                if(a){
            		var commonModel=new mdboss.Model.commonModel();
            		var data={"usercode":mdboss.usercode,"formcode":formId,"isenabled":status};
            		commonModel.save(data,{url:mdboss.api.formchgstate, success:function(model,result){
                        var rc = result.rc;
                        if(rc==1){
                            mdboss.notifyTips("表单已" + show);
//                            Backbone.history.loadUrl();
                            v_this.loadformlist(v_this.typeCode);
                        }else{
                        	 mdboss.error(result.msg);
                        }
            		},error:function(){
            			 mdboss.error();
            		}});
                }
            };
            mdboss.confirm("确定要" + show + "此表单吗？", updateStatus);
        
    	},
    	formItems:function(e){//表单项列表
    		  var $target = $(e.currentTarget);
        	 var id=$target.data("code");
        	 var name=$target.data("name");
        	 var dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(this).find(".jscroll").jScrollPane();
                 }
             }, {"title":'表单【'+name+'】配置',"width":"970px","height":"600px","layer":false,"icon":"iconfont icon-mdliucheng","resize":function(){
            	 $(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();   
             }}).show(function(){
                	 _this=this;
                	 seajs.use("wfsitems", function () {
                		 var model=new mdboss.Model.formItemsModel();
                		 var diagramView=new mdboss.View.formItemsView({formcode:id,is_edit:true,model:model,$el:$(_this.dialog),"dialog":_this});
                		 diagramView.render({"usercode":mdboss.usercode,"formcode":id,"dialog":_this});
                	 });
                	 
                 });
    	},
    	editForm:function(e){
    		v_this = this;
    		var $current=$(e.currentTarget);
    		seajs.use("wfsforms", function () {
    			var content=formList[$current.data("id")];
    			var formname=content.formname;//form名称
    			var typecode=content.formtype;//表单类型
    			var formdesc=content.formdesc;//form描述
    			var formcode=content.formcode;//formcode
    			var status=content.isenabled;//公文状态
    			var sortorder=content.sortorder;//序号
    			var url=content.url;//formurl
    			var data={"formtype":typecode,formcode:formcode,"isenabled":status,"sortorder":sortorder,"formname":formname,url:url,"formdesc":formdesc,"status":status,"is_add":false,"window":"编辑表单信息",
    					"callbacks":function(){
    						v_this.loadformlist(v_this.typeCode);
    					}};
    			new mdboss.View.WfsFormView(data);
   	        });
    	},
    	copyForm:function(e){
    		v_this = this;
    		var $current=$(e.currentTarget);
    		seajs.use("wfsforms", function () {
    			var content=formList[$current.data("id")];
    			var formname=content.formname;//form名称
    			var typecode=content.formtype;//表单类型
    			var formdesc=content.formdesc;//form描述
    			var formcode=content.formcode;//formcode
    			var status=content.isenabled;//公文状态
    			var url=content.url;//formurl
    			var data={"formtype":typecode,formcode:formcode,"isenabled":status,"formname":formname,url:url,"formdesc":formdesc,"status":status,"is_add":false,"is_copy":true,"window":"复制表单信息",
    					"callbacks":function(){
    						v_this.loadformlist(v_this.typeCode);
    					}};
    			new mdboss.View.WfsFormView(data);
   	        });
    	},
    	deleteForm:function(e){//删除表单
    		v_this = this;
            var $this = $(e.currentTarget),
//            num = null,
//            num = "delete-personalform" == $this.attr("id") ?$this.parents(".js_personalformlist") : $this.parents(".js_cloudformlist"),
            ///{"usercode":"","processcode":""}
            data = {
                "usercode":mdboss.usercode,"formcode": $this.data("id")
            };
            doDelete = function(k) {
                if(k){
                	seajs.use("wfsforms",function(){
                		var formModel=new mdboss.Model.WfsFormModel();
                		formModel.deleteForm(data,function(model,result) {
                			if(result.rc==1){
                				$this.parents("li").remove();
                            	mdboss.notifyTips("表单删除成功");
//                            	Backbone.history.loadUrl();
        						v_this.loadformlist(v_this.typeCode);
                			}
                        	
                        });
                	});
                } 
            };
            mdboss.confirm("删除后不可恢复,确定删除此表单吗？", doDelete);
    	} 	,
		del_type:function(e){//删除表单分类 
			var $current=$(e.currentTarget);
			var tid = $current.data("id");
			mdboss.confirm("确定要删除此分类吗？",function(s){
				if(s){
					mdboss.reqsubmit({"usercode":mdboss.usercode, "tid":tid},mdboss.api.formdeltype, function(m,res){
						if(res.rc == 1){
							mdboss.notifyTips("删除表单分类成功!");
							Backbone.history.loadUrl();
						}else{
							mdboss.error(res.msg);
						}
					});
				}
			});
			
//			var $current=$(e.currentTarget);
//			var $current_type=$current.closest("li");
//			var typecode=$current_type.data("formtype");
//			var usercode=mdboss.usercode;
//			seajs.use("wfsforms", function () {
//				var model=new mdboss.Model.commonModel();
//				mdboss.confirm("确定要删除此分类吗？",function(s){
//					if(s){
//						model.save({"usercode":usercode,"formtype":typecode},
//								{url:mdboss.api.formdeltype,success:function(model,response){
//							if(response.rc==1){
//								mdboss.notifyTips("删除表单分类成功");
//								Backbone.history.loadUrl();
//							}else{
//								mdboss.error(response.msg);
//							}
//						},error:function(){
//	            			 mdboss.error();
//	            		}});
//					}
//				});
//				
//    		});
		},//end 删除分类
		hideSearch:function(e){
//			$(".js_searchkeyword").val("");
//			$(".js_searchkeyword").hide();
		},
		showSearch:function(){//显示搜索框
//			$(".js_searchkeyword").show();
		},
		searchForm:function(e){
			if(e.which == 13){
				
			}
		},
		newForm:function(e){//新建表单
			v_this = this;
			var currentType=$(".js_formtab").find("li.active").data("formtype");
			seajs.use("wfsforms", function () {
   	         	new mdboss.View.WfsFormView({"is_add":true,"window":"新建表单","processtype":currentType,"callbacks": function(){
					v_this.loadformlist(v_this.typeCode);
				}});//is_add区分是部署还是编辑
   	        });
		},
		edit_type:function(e){//编辑分类
			var $current=$(e.currentTarget);
			var tid = $current.data("id");
			var rdata={};
			rdata.tid = tid;
			rdata.title = "编辑分类";
			rdata.typecode = $current.attr("data-typecode");
			rdata.parentcode = $current.attr("data-parentcode");
			rdata.typename = $current.attr("data-typename");
			rdata.status = $current.attr("data-status");
			rdata.sortorder = $current.attr("data-sortorder");
			rdata.iconclass = $current.attr("data-iconclass");
			seajs.use("wfsforms", function () {
    			new mdboss.View.WfsFormTypeView(rdata);
    		});
		},
		newCategory:function(e){//新建分类
			seajs.use("wfsforms", function () {
    			new mdboss.View.WfsFormTypeView();
    		});
		},
		initialize : function(data ) {
			this.rdata=data;
			this.typeCode="";
			this.render();
		},
		render : function() {
			this.loadformlist(this.rdata.formtype);
		}
	});
	
	var formList={};
	
	//
	loadParentType=function(clazz){//加载父分类 
	   var tmpCondition = new Array();
	   tmpCondition.push({"key":"typeclass","operate":"EqualTo","v1": clazz});
	   $("#submit-loading").show();
		mdboss.reqsubmit({"usercode":mdboss.usercode,"queryCondition":tmpCondition,"orderBy":"parentcode,sortorder","pageNo":1,"pageSize":0},
				mdboss.api.processtypelist,function(m, res){
			 $("#submit-loading").hide();
			if(res.rc == 1){
				//构造树结构
				var tmpPTypes = new Array();//pcode, array
				var tmp = res.data.rows;
				  for(var i =0; i<tmp.length; i++){
					   if(tmp[i].parentcode == "-1"){
						   tmpPTypes.push({"id":tmp[i].id,"code":tmp[i].typecode,"name":tmp[i].typename,"pcode":tmp[i].parentcode,"values":new Array()});
					   }else{
						   $.each(tmpPTypes,function(j, item){
							   if(item.code == tmp[i].parentcode){
								   item.values.push(tmp[i]);
							   }
						   });
					   }
				  }
				  return tmpPTypes;
			}else{
				$("#submit-loading").hide();
				mdboss.error(res.msg);
			}
		});
	};
	
	
	
	//表单初始化
	 var biaodan = function (t) {
		 
		 var tmpCondition = new Array();
		   tmpCondition.push({"key":"typeclass","operate":"EqualTo","v1": "form"});
//		   tmpCondition.push({"key":"typeclass","parentcode":"EqualTo","v1": "-1"});
			mdboss.reqsubmit({"usercode":mdboss.usercode,"queryCondition":tmpCondition,"orderBy":"parentcode,sortorder","pageNo":1,"pageSize":0},
					mdboss.api.processtypelist,function(m, res){
				if(res.rc == 1){
//					//构造树结构
					var tmpPTypes = new Array();//pcode, array
					var tmp = res.data.rows;
					var formtype = "";
					  for(var i =0; i<tmp.length; i++){
						   if(i==0){
							  formtype = tmp[i].typecode;
						   }
						   if(tmp[i].parentcode == "-1"){
							   tmpPTypes.push({"id":tmp[i].id,"code":tmp[i].typecode,"iconclass":tmp[i].iconclass,"name":tmp[i].typename,
								   "sortorder":tmp[i].sortorder,"status":tmp[i].status,
								   "pcode":tmp[i].parentcode,"values":new Array()});
						   }else{
							   $.each(tmpPTypes,function(j, item){
								   if(item.code == tmp[i].parentcode){
									   item.values.push(tmp[i]);
								   }
							   });
						   }
					  }
					  var template = Handlebars.compile(require("text!template/page/wfsform/index.html"));//
	                  var html = template({"typelist":tmpPTypes,type:t });
	                  mdboss.fillPage(html);
	                 new mdboss.View.processBiaodan({"formtype":formtype});
				}else{
					mdboss.error(res.msg);
				}
			});
		 
	 };
	 
	 module.exports = biaodan;
});