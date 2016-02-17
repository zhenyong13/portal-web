/**
 * 公文提醒
 * 使用方法
  seajs.use("meno", function () {
      var meno=new mdboss.Model.processMeno();
      new mdboss.View.processMeno(meno);
   });
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss"), 
	$ = require("jquery");
	require("selectMan");
	var $page = mdboss.$pageWrap;
    
	/* 公文传阅*/
	mdboss.Model.circularize = Backbone.Model.extend({
		url:mdboss.api.circularize,
		initialize: function(){ 
			
        }
	});
	
	// 公文提醒
	mdboss.View.processCircularize = Backbone.View.extend({
		initialize : function(data) {
			this.model=data.model;
			//this.template=require("text!template/page/process/form/circularize.html");
			//var template=this.template;
			$("#circularize-div").remove();
			data.el.append(require("text!template/page/process/form/circularize.html"));
			this.$el=$("#circularize-div");
		},
		events:{
			"click .js_circularize_submit":"circularize_submit",
			"click .js_circularize_cancle":"cancle",
			"click .js_employee_circularize":"search",
			"click .typeahead-search":"search",
			'keypress .control-input':'keywords',//排序
			"click .employee":"employee",
			"mouseover .entity-item ":"showDel",
			"mouseout .entity-item":"hideDel",
			"click .close":"e_delete"
		},
		showDel:function(e){
			$(e.currentTarget).find("button").removeClass("hide");
		},
		hideDel:function(e){
			$(e.currentTarget).find("button").addClass("hide");
		},
		e_delete:function(e){
			$(e.currentTarget).parent("span").remove();
		},
		employee:function(e){
    		_this=this;
			var id  = $(e.currentTarget).attr("id");
    		var name  =$(e.currentTarget).attr("name");
    		var tm = '<span id="'+id+'" class="entity-item"><a data-value="'+id+'">'+name+'</a><button type="button" class="close hide" title="删除">×</button>&nbsp;</span>';
    		
    		var flag = true;
    		_this.$el.find("#circularizelist span").each(function(i){
    			var usercode = $(this).attr("id");
    			if(id == usercode){
    				flag = false;
    				return;
    			}
    		});
    		if(flag)
    			_this.$el.find("#circularizelist").append(tm);
    		
    		_this.$el.find(".typeahead-wrapper").addClass("hide");
		}
		,
		render:function(){
			return this;
		}
		,
		circularize_submit:function(){
			var circularizeTextarea = $("#circularize-textarea").val();//提醒内容 
			 //其他人
			 var otherMember = new Array();
			$("#circularizelist span a:first-child").each(function(){
					var code=$(this).data("id");
					otherMember.push(code);
			});
			if(otherMember.length==0){
				mdboss.alert("请选择传阅人");
				return false;
			}
			this.model.set({"tousers":otherMember,"msg":circularizeTextarea, "usercode":mdboss.usercode});
			this.model.save({},{success:function(m,data){
				if(data.rc == "1"){
					mdboss.notifyTips("传阅成功 ！");
				}else{
					mdboss.error(data.msg);
				}
			},error:function(){
				mdboss.error( );
			}});
			 $("#circularize-div").remove();
		 
		},
		cancle:function(){
			 $("#circularize-div").remove();
		},
		search:function(e){
			var s_this=this;
			//new mdboss.View.memberselectView({pview:s_this,"callback":s_this.selectPerson});
			var processcode=s_this.model.get("processinstcode");
			var data={"usercode":mdboss.usercode,"processcode":processcode};
			var commonModel=new mdboss.Model.commonModel();
			commonModel.save(data,{url:mdboss.api.personconfigload,success:function(model,response){
				 seajs.use("selectMember", function () {
					 if(response.rc==1){
						 var data=response.data;
						 var selectedvalues=data.selectedvalues;
						 var post={"selectedvalues":selectedvalues,
								 obj:data.selectpersonconfig.selectitems,
								 "processcode":processcode,
								 "currentorgcode":mdboss.cache.data.getMyInfo.orgcode,
								 "selecttype":data.selectpersonconfig.selecttype
								 ,"callbacks":function(data){
								var template = Handlebars.compile($("#selectperon-show-template").html());
								s_this.$el.find("#circularizelist").html(template({"persons":data}));
							}};
						 new mdboss.View.membersView({model:new mdboss.Model.showUserType(post)});
					 }else{
						 mdboss.error(response.msg);
					 }
             	 }); 
			},error:function(){
    			mdboss.error(error);
    		}});
		},
		selectPerson:function(view,members){
			var s_this=view;
			var template=Handlebars.compile($("#selectperson-template").html());
			s_this.$el.find("#circularizelist").html(template({"members":members}));
		}
	});
});