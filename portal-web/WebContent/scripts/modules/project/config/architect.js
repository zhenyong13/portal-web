/**
 * 项目架构配置
 */
define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("mCustomScrollbar");
     require("validVal")($);
     Dialog = require("dialog");
     require("projecttree");
     require("tipso");
     
     //项目架构配置
     exports.architectconfigFunc=function(){
    	mdboss.fillPage(require("text!template/page/project/config/architect.html"));
		new mdboss.View.architectconfigView();
     };
     
     mdboss.View.architectconfigView = Backbone.View.extend({
         el: '#rightMainContainer',
         initialize:function(){
        	 this.$el.find("#projectarctect").append(require("text!template/page/project/config/projecttree.html"));
        	 this.projecttree=new mdboss.View.projecttreeView({"manager":false});
        	 this.model_list_html=$("#architect-list-template").html();
        	 this.search="";
        	 this.render();
        	 this.newForm();//构建默认架构
         },
         events: {
        	 "click .js-save-role":"submitForm", // 提交表单
        	 "click .js-cancel-role":"newForm", // 取消表单
        	 "click #module-add":"newForm", // 新增专业清空表单
        	 "click #project_role_list li":"editArchitect", // 编辑项目架构 ==
        	 
        	 "keyup #search_profess":"searchProfess", // 搜索
        	 "click .js_icon_search":"searchProfess", // 搜索
        	 "keyup #architectname":"architecttitle",//标题 
        	 "click #module-del":"deletearchitec",//删除 
        	 
         },
         deletearchitec:function(e){
        	 var r_this = this;
        	 var tid = r_this.$el.find("#tid").val();
        	 mdboss.confirm("您确定要删除?", function(e){
        		 if(e){
        			 mdboss.reqsubmit({"tid":tid}, mdboss.api.projectarchitectdelete, function(m, res){
        				 if(res.rc == 1){
        					 mdboss.alert("删除成功!");
        					 r_this.newForm();
        					 r_this.renderData();
        				 }else{
        					 mdboss.error(res.msg);
        				 }
        			 });
        		 }
        	 });
         },
         searchProfess:function(e){//搜索
        	 var val = this.$el.find("#search_profess").val();
        	 if(val){
        		 if(e.type == "click"){
        			 this.search=val;
        			 this.renderData();
        		 }else{
        			 if(e.which ==13){
        				 this.search=val;
            			 this.renderData();
        			 }
        		 }
        	 }
         },
         architecttitle:function(e){ //架构名称
        	 var vl = $(e.currentTarget).val();
        	 if(vl){
        		 $(".project-arctect-manager").text(vl);
        		 $(".project-arctect-manager").attr("data-orgname",vl);
        	 }else{
        		 $(".project-arctect-manager").text("项目");
        	 }
         },
         
         editArchitect:function(e){//编辑项目架构
        	 var r_this = this;
        	 r_this.cancelForm();
        	 //
        	 $(e.currentTarget).closest("ul").find("a").removeClass("active");
        	 $(e.currentTarget).find("a").addClass("active");
        	 r_this.$el.find(".add-project-newproject").text("编辑项目架构");
        	 r_this.$el.find("#module-del").show();
        	 
        	 var code  =$(e.currentTarget).find("a").data("code"); 
        	 var name  =$(e.currentTarget).find("a").text(); 
        	 var category  =$(e.currentTarget).find("a").data("category"); 
//        	 var orgcode  =$(e.currentTarget).find("a").data("orgcode"); 
        	 var status  =$(e.currentTarget).find("a").data("status"); 
        	 var tid  =$(e.currentTarget).find("a").data("id"); 
			 r_this.$el.find("#tid").val(tid);
			 
    		 r_this.$el.find("#architectcode").val(code);
    		 r_this.$el.find("#architectname").val(name);
    		 r_this.dataset(category, status);
    		 var queryCondition= new Array();
    		 queryCondition.push({"key":"orgcode", "operate":"EqualTo","v1":code});
    		 
    		 mdboss.submit({"queryCondition": queryCondition,"usercode":mdboss.usercode}, mdboss.api.projectarchitectview, function(res){
    			 if(res.rc == 1){
    				 r_this.projecttree.editArchitectTree({"profess":res.data.rows,"isArchitect":true});
    			 }else{
    				 mdboss.error(res.msg);
    			 }
    		 }, true, null);
    		 
         },
         dataset:function(status, category){
        	 mdboss.dataselect(this, "tstatus", "COMMON_STATE",status,"205");
        	 mdboss.dataselect(this, "category", "PM_PROJECTCATEGORY",category,"205");
         },
         render:function(){
        	 $( "#module_form" ).validVal();
        	 this.renderData( );
        	 this.dataset( );
         },
         cancelForm:function(e){//取消提交
        	 var r_this = this;
        	 r_this.$el.find("#tid").val("");
    		 r_this.$el.find("#architectcode").val("");
    		 r_this.$el.find("#architectname").val("");
    		 r_this.$el.find("#module-del").hide();
    		 r_this.$el.find(".add-project-newproject").text("新增项目架构");
    		 r_this.dataset("" );
    		 r_this.$el.find(".project-arctect-ul li").each(function(i, item){
    			 if($(item).find(".project-operate-profess").length<1){
    				 $(item).remove();
    			 }
    		 });
         },
         newForm:function(e){//取消提交
        	 var r_this = this;
        	 r_this.$el.find("#tid").val("");
        	 r_this.$el.find("#module-del").hide();
        	 r_this.$el.find("#architectcode").val("");
        	 r_this.$el.find("#architectname").val("");
        	 r_this.$el.find(".add-project-newproject").text("新增项目架构");
        	 r_this.$el.find("project_profess_list a:gt(0)").removeClass("active");
        	 r_this.dataset("" );
        	 r_this.$el.find(".project-arctect-ul li").each(function(i, item){
        		 if($(item).find(".project-operate-profess").length<1){
        			 $(item).remove();
        		 }
        	 });
        	 var profess=new Array();
        	 var uuid = mdboss.getuuid();
        	 profess.push({ "orgcode": uuid, "orgname": "项目架构", "parentcode": "-1" });//
        	 profess.push({ "orgcode": mdboss.getuuid(), "orgname": "分管院领导", "orgtype":"r", "parentcode": uuid });//
        	 profess.push({ "orgcode": mdboss.getuuid(), "orgname": "分管总工", "orgtype":"r", "parentcode": uuid });//
        	 profess.push({ "orgcode": mdboss.getuuid(), "orgname": "项目助理", "orgtype":"r",  "parentcode": uuid });//
        	 r_this.projecttree.editArchitectTree({"profess":profess,"isArchitect":true});
         },
         submitForm:function(e){//提交
        	 var r_this = this;
        	 form_data = $( "#module_form" ).triggerHandler( "submitForm" );
        	 if(form_data){
        		 var tid = r_this.$el.find("#tid").val();
        		 var architectcode = r_this.$el.find("#architectcode").val();
        		 var category = r_this.$el.find("#category").val();
        		 var tstatus = r_this.$el.find("#tstatus").val();
        		 var architectname = r_this.$el.find("#architectname").val();
        		 var url = mdboss.api.projectarchitectadd;
        		 var reqData={};
        		 if(tid){
        			 url = mdboss.api.projectarchitectedit;
        			 reqData.tid = tid;
        			 reqData.oprtype = "save";
        		 }
        		 
        		 if(architectcode); else architectcode=null;
        		 if(architectname); else architectname=null;
        		 if(category); else category=null;
        		 if(tstatus); else tstatus=null;
        		 
        		 reqData.templatecode=architectcode;
        		 reqData.templatename=architectname;
        		 reqData.category=category;
        		 reqData.status=tstatus;
        		 
        		 var pfess = r_this.projecttree.getArchitectData();
        		 
        		 reqData.orgs = pfess;
        		 mdboss.submit(reqData, url, function(res){
            		 if(res.rc == 1){
            			mdboss.alert("添加成功!");
//            			r_this.$el.find("#project_role_list li:gt(0)").remove();
            			r_this.renderData();
//            			r_this.newForm();
            		 }else{
            			 mdboss.error(res.msg);
            		 }
            	 }, true, null);
        	 }
         },
         renderData:function(){//渲染列表
        	 var r_this = this;
        	 $("#left-role-list").mCustomScrollbar("destroy");
        	 var reqData = {"pageNo":1,"pageSize":0, "orderBy":"createtime desc"};
        	 if(r_this.search){
        		 var keywordFields = new Array();
        		 keywordFields.push("templatecode");
        		 keywordFields.push("templatename");
        		 reqData.keyword = r_this.search;
        		 reqData.keywordFields = keywordFields;
        	 }
        	 
        	 mdboss.submit(reqData, mdboss.api.projectarchitect, function(res){
        		 if(res.rc == 1){
        			 var listTemplate = Handlebars.compile(r_this.model_list_html);
 	            	 var listHtml=listTemplate({data:res.data.rows});
 	            	 var $projarchitect= r_this.$el.find("#project_role_list");
 	            	 $projarchitect.find("li:not(:first)").remove();//删除所有li除新增专业li
 	            	 $projarchitect.append(listHtml);
 	            	 
 	            	 $("#left-role-list").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false  });
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 }, true, null);
         }
          
     });
     
});