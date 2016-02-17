/**
 * Created by 2goyoung on 2015/5/11.
 */


define(function (require, exports, module) {
    var $ = require("jquery");
    require("bootstrap")($);
    require("backbone");
    require("scroll");
    require("fileinput");
    require("bootbox");
    var Dialog=require("dialog");
    require("notify")($);

    Backbone.emulateJSON = true;
   
    mdboss.View.formManageView = Backbone.View.extend({
    	el:"#rightMainContainer",
    	initialize:function (data) {
    		this.rdata=data;
    		this.processtype="";
    		this.render();
    	},
    	render : function() {
			this.loadprocesslist(this.rdata.processtype);
		},
		showTab:function(e){
			var v_this = this;
		   var $target = $(e.currentTarget);
          if(!$target.hasClass("active")){
              $target.addClass("active").siblings(".active").removeClass("active").find("button").hide();
              $target.find("button").show();
              var processtype = $target.data("processtype");
              if($target.data("parentcode") == "-1"){
            	  $(".show_div_second").hide();
            	  $("#type_"+processtype).show();
            	  if(v_this.$el.find("#type_"+processtype).length >0 ){
            		  v_this.$el.find("#type_"+processtype +" ul li:first").addClass("active").find("button").show();;
            		  processtype = v_this.$el.find("#type_"+processtype +" ul li:first").data("processtype");
            	  }
              }
              v_this.processtype = processtype;
              v_this.loadprocesslist(processtype);
          }
		},
		loadprocesslist:function(processtype){//加载流程 
			v_this = this;
			var tmpCondition = new Array();
//          tmpCondition.push({"key":"typeclass","operate":"EqualTo","v1": "process"});
          tmpCondition.push({"key":"processtype","operate":"EqualTo","v1": processtype});
          v_this.$el.find("#formlist-loading").show();
//          v_this.$el.find(".form-list-wrap").html('<div class="loading" style="width: 100%;height: 300px;"></div>');
          mdboss.reqsubmit({"usercode":mdboss.usercode,"queryCondition":tmpCondition,"orderBy":"processtype,sortorder","pageNo":1,"pageSize":0},
        		  mdboss.api.queryworkflow, function(m, res){
        	  v_this.$el.find("#formlist-loading").hide();
        	  if(res.rc == 1){
        		  var template = Handlebars.compile(require("text!template/page/process/workflowlist.html"));//
	              var html = template({"processlist":res.data.rows });
//	              $.each(res.data.rows ,function(index,item){
//             		 item.formtype=formtype;
//             		 formList[item.formcode]=item;
//             	  });
	              v_this.$el.find(".form-list-wrap").html(html);
        	  }else{
        		  mdboss.error(res.msg);
        	  }
          });
		},
    	events:{
    		"click .js_changeFormStatus":"changeFormStatus",
    		"click .js_editForm":"editForm",//流程编辑
    		"click .js_formPreview":"preview",
    		"click .js_deleteForm":"deleteForm",
    		"mouseenter li.search":"mouseenterSearch",
    		"mouseleave li.search":"mouseleaveSearch",
    		"click .js_buildNewForm":"buildNewForm",
    		"click .js_newcategory":"newcategory",//新建分类
    		"click .js_del_type":"del_type",//删除分类
    		"click .js_edit_type":"edit_type",//删除分类
    		"click .toolkit-item-tab":"showTab",//切换tab
    	
    	},
		del_type:function(e){//删除分类
			var $current=$(e.currentTarget);
			var tid = $current.data("id");
			mdboss.confirm("确定要删除此分类吗？",function(s){
				if(s){
					mdboss.reqsubmit({"usercode":mdboss.usercode, "tid":tid},mdboss.api.delProcesstype, function(m,res){
						if(res.rc == 1){
							mdboss.notifyTips("删除公文分类成功!");
							Backbone.history.loadUrl();
						}else{
							mdboss.error(res.msg);
						}
					});
				}
			});
		},
		edit_type:function(e){//编辑分类
			var $current=$(e.currentTarget);
			var tid = $current.data("id");
			var rdata={};
			rdata.tid = tid;
			rdata.title = "编辑分类";
			rdata.typecode = $current.attr("data-typecode");
			rdata.typename = $current.attr("data-typename");
			rdata.status = $current.attr("data-status");
			rdata.parentcode = $current.attr("data-parentcode");
			rdata.sortorder = $current.attr("data-sortorder");
			rdata.iconclass = $current.attr("data-iconclass");
			if($current.attr("data-iconclass"));else rdata.iconclass=null;
			seajs.use("forms", function () {
    			new mdboss.View.typeNewView(rdata);
    		});
		},
		newcategory:function(){//新建分类
    		seajs.use("forms", function () {
    			new mdboss.View.typeNewView();
    		});
    	},
    	buildNewForm:function(){
    		var currentType=$(".js_formtab").find("li.active").data("processtype");
    		seajs.use("forms", function () {
   	         	new mdboss.View.formNewView({"is_add":true,"window":"部署流程","processtype":currentType,"callbacks": function(){
					v_this.loadprocesslist(v_this.processtype);
				}});//is_add区分是部署还是编辑
   	        });
    	},
    	changeFormStatus:function(e){
            var $this = $(e.currentTarget),
             formId= $this.data("code"),
             status = $this.attr("status"),
             show = "";
            "enable" == status ? show = "启用": "disabled" == status ? show = "停用": "submit" == status && (show = "停用");
            updateStatus = function(a) {
                if(a){
                	seajs.use("forms",function(forms){
                		var formNewModel=new mdboss.Model.formNewModel();
                		var data={"usercode":mdboss.usercode,"processcode":formId,"action":status};
                		formNewModel.updateForm(data,function(model,result){
                            var rc = result.rc;
                            if(rc==1){
                            	var updateShow="";
                                "enable" == status ? (updateShow = "停用",
                                		$this.parents(".js_formListBox").find("#form-title").addClass("js_formtitle"),
                                		$this.parents(".js_formitemsli").removeClass("disabled").addClass("enable"),
                                		$this.parents(".js_formitemsli").find(".icon-lock").hide())
                                		: "disabled" == status && (updateShow = "启用", 
                                				$($this).parents(".js_formListBox").find("#form-title")
                                				.removeAttr("href").removeClass("js_formtitle"), 
                                				$this.parents(".js_formitemsli").removeClass("enable").addClass("disabled"),
                                				$this.parents(".js_formitemsli").find(".icon-lock").show());
                                $this.attr("status", "enable" == status?"disabled":"enable");
                                $this.text(updateShow);
                                mdboss.notifyTips("流程已" + show);
                            }
                       
                        
                		});
                	});
                }
            };
            mdboss.confirm("确定要" + show + "此流程吗？", updateStatus);
        
    	},
    	preview:function(e){
    		_this = this;
    		  var $target = $(e.currentTarget);
        	 var id=$target.data("code");
        	 var name=$target.data("name");
        	 _this.dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(this).find(".jscroll").jScrollPane();
                 }
             }, {"title":'流程【'+name+'】配置',"width":"963px","height":"562px","layer":false,"icon":"iconfont icon-mdliucheng","resize":function(){
            	 $(_this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();   
             }}).show(function(){
                	 _this=this;
                	 seajs.use("preViewDiagram", function () {
                		 var model=new mdboss.Model.preViewDiagramModel();
                		 var diagramView=new mdboss.View.preViewDiagramView({processcode:id,is_edit:true,model:model,$el:$(_this.dialog)});
                		 diagramView.render({"processinstcode":id});
                	 });
                	 
                 });
    	},
    	editForm:function(e){
    		v_this = this;
    		var $current=$(e.currentTarget);
    		seajs.use("forms", function () {
    			var $content=$current.parents(".js_formListBox");
    			var title=$content.find("#form-title").text();//公文名称
    			var processtypecode=$content.find("#form-title").data("processtypecode");//公文类型
    			var describe=$content.find("#form-describe").text();//描述
    			if(describe);else describe=null;
    			var processcode=$current.data("code");//processcode
    			var sortorder=$current.attr("data-sortorder");//processcode
    			if(sortorder);else sortorder=null;
    			var status=$content.find(".js_changeFormStatus").attr("status")=="enable"?"disabled":"enable";//公文状态
    			var data={"processtype":processtypecode,"sortorder":sortorder,"title":title,"describe":describe,"processcode":processcode,"status":status,"is_add":false,"window":"编辑流程信息",
    					"callbacks": function(){
    						v_this.loadprocesslist(v_this.processtype);
    					}};
    			console.log(data);
    			seajs.use("forms", function () {
    				new mdboss.View.formNewView(data);
       	        });
    			
   	        });
    	},
    	deleteForm:function(e){
    		v_this = this;
            var $this = $(e.currentTarget),
            data = {
                "usercode":mdboss.usercode,"processcode": $this.data("code")
            };
            doDelete = function(k) {
                if(k){
                	seajs.use("forms",function(){
                		var formModel=new mdboss.Model.formNewModel();
                		formModel.deleteForm(data,function(model,result) {
                			if(result.rc==1){
                				$this.parents("li").remove();
                            	mdboss.notifyTips("流程删除成功");
//                            	Backbone.history.loadUrl();
                            	 v_this.loadprocesslist(v_this.processtype);
                			}
                        	
                        });
                	});
                } 
            };
            mdboss.confirm("删除后不可恢复,确定删除此流程吗？", doDelete);
    	}
    	
    });

});
