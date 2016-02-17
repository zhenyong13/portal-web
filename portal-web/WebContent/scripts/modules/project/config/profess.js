/**
 * 专业配置
 */
define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("mCustomScrollbar");
     require("select2");
     var projectroleedit = require("projectroleedit");
     require("validVal")($);
     Dialog = require("dialog");
     
     
     //专业配置
     exports.professconfigFunc=function(){
    	mdboss.fillPage(require("text!template/page/project/config/profess.html"));
		new mdboss.View.professconfigView();
     };
     
     mdboss.View.professconfigView = Backbone.View.extend({
         el: '#rightMainContainer',
         initialize:function(){
        	 this.role_list_html=$("#role-list-template").html();
        	 this.tip_info_template = $("#tip-info-template").html();
        	 this.profess_list_html=$("#profess-list-template").html();
        	 this.profess_info_html=$("#profess-info-template").html();
        	 this.rolelist=[];
        	 this.search="";
        	 this.render();
         },
         events: {
        	 "click .js-save-profess":"submitForm", //专业表单提交
        	 "click .js-cancel-profess":"cancelForm", //专业添加取消清空表单
        	 "click #project_profess_list li":"editProfess", //编辑专业
        	 "click #module-add":"cancelForm", // 新增专业清空表单
        	 "click #module-del":"deleteProfess", // 删除角色
        	 
        	 "keyup #professname":"addProfessName", //专业名称更新同步结构树中的专业名称
        	 "click .project-operate":"addProfess", //添加保存专业
        	 "click .professinfo":"professtoedit", //角色
         
        	 "focus .roleselect":'delegateMan',//角色
        	 "keyup .roleselect":'delegateMan2',//角色填写完成
        	 "mouseenter .project-arctect-li":"showEdit", // 显示隐藏 编辑操作
        	 "mouseleave .project-arctect-li":"showEdit", //添加项目
        	 "click .project-operate-op":"architectoperate", // 操作
        	 "keyup .js_search_org_class":"searchOrgClass", // 搜索
        	 "keyup .js_search_org_class":"searchOrgClass", // 搜索
        	 "click .js_icon_search":"searchOrgClass", // 搜索
        	 
         },
         searchOrgClass:function(e){ //
        	 var val = this.$el.find(".js_search_org_class").val();
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
         deleteProfess:function(e){
        	 var r_this = this;
        	 var tid = r_this.$el.find("#tid").val();
        	 mdboss.confirm("您确定要删除?", function(e){
        		 if(e){
        			 mdboss.reqsubmit({"tid":tid}, mdboss.api.projectprofessdelete, function(m, res){
        				 if(res.rc == 1){
        					 mdboss.alert("删除成功!");
        					 r_this.cancelForm();
        					 r_this.renderData();
        				 }else{
        					 mdboss.error(res.msg);
        				 }
        			 });
        		 }
        	 });
         },
         architectoperate:function(e){ //
        	 var $this = $(e.currentTarget);
        	 var direction = $(e.currentTarget).attr("data-direction");
        	 console.log("direction="+direction);
        	 
        	 switch(direction){
	        	 case "U"://展示专业
	        		 $this.text("展示");
	        		 $this.attr("data-direction","D");
	        		 $this.closest("li").find("ul").slideUp();
	        		 break;
	        	 case "D"://收起专业
	        		 $this.text("收起");
	        		 $this.attr("data-direction","U");
	        		 $this.closest("li").find("ul").slideDown();
	        		 break;
	        	 case "up"://上移
	        		 var objParentTR = $this.closest("li"); 
	    			 var prevTR = objParentTR.prev(); 
	    			 if (prevTR.length > 0) { 
	    				 prevTR.insertAfter(objParentTR); 
	    			 } 
	        		 break;
	        	 case "down"://下移
	        		 var objParentTR =$this.closest("li"); 
	        		 var nextTR = objParentTR.next(); 
	        		 if (nextTR.length > 0) { 
	        			 if(nextTR.find(".project-operate-profess").length<=0)
	        				 nextTR.insertBefore(objParentTR); 
	        		 }
	        		 break;
	        	 case "d"://删除
	        		 $this.closest("li").remove();
	        		 break;
	        	 case "Add"://添加项目负责人
	            	 $this.closest("li").find("input:eq(1)").val("").show();
	        		 break;
        	 }
        	 
         },
         showEdit:function(e){// 显示隐藏 编辑操作
        	 if(e.type == "mouseenter"){
        		 $(e.currentTarget).find(".project-operate-op").show();
        	 }else{
        		 $(e.currentTarget).find(".project-operate-op").hide();
        	 }
         },
         
         delegateMan2:function(e){
        	 $this =  $(e.currentTarget);
        	 var uuid = $(e.currentTarget).attr("id");
        	 if(e.type == "keyup" && e.which==13){
        		 $("."+uuid).remove();
        		 $this.closest("li").find("span:eq(0)").show();
    			 $this.closest("li").find("span:eq(0)").text($this.val());
    			 $this.hide();
        	 }
         },
         delegateMan:function(e){ //
        	 
        	 $(".tipso_bubble").remove();
//        	 var d_this=this;
        	 var $this = $(e.currentTarget);
        	 var uuid = $(e.currentTarget).attr("id");
        	 var left = parseInt($this.offset().left) +102;
        	 var top = parseInt($this.offset().top);
        	 
//        	 if(document.body.clientHeight - top < 200){
//        		 top = document.body.clientHeight - top + 300;
//        	 }
        	 
        	 var reqData={"usercode":mdboss.usercode,"pageNo":1,"pageSize":10, "orderBy":"createtime desc"};
        	 mdboss.reqsubmit(reqData, mdboss.api.projectrolelist, function(m, res){
        		 if(res.rc == 1){
        			 var tip = $("#tip-info-template").html();
        			 var tiptepl =Handlebars.compile(tip);//
        			 if(document.body.clientHeight - top < 150){
                		 top -= (res.data.rows.length % 5)*55;
                	 }
        			 var html = tiptepl({"data":res.data.rows, "left":left, "top":top,"uuid":uuid});
            		 $("body").append(html);
            		 
            		 //选择角色及取消选择
            		 $(".js_select_toggle").click(function(e){
            			 console.log("sdf");
                    	 var $currt = $(e.currentTarget);
                    	 var uuid = $currt.data("id");
                    	 if( $.trim($currt.text()) == "取消"){
                    		 $("#"+uuid).closest("li").remove();//删除
                    		 $currt.parent().parent().remove();
                    	 }else{
                    		 var orgcode = $currt.data("code");//orgcode
                    		 $("#"+uuid).val($.trim($currt.text()));//角色名称
                    		 $("#"+uuid).attr("data-sourcecode", orgcode);//角色编码
                    		 $("#"+uuid).closest("li").find("span:eq(0)").show();
                    		 $("#"+uuid).closest("li").find("span:eq(0)").text($.trim($currt.text()));
                    		 $("#"+uuid).hide();
                    		 $currt.parent().parent().remove();
                    	 }
            		 });
            		 
            		 //添加项目角色
            		 $(".js_select_add").click(function(e){
            			 console.log("df");
            			 var $currt = $(e.currentTarget);
            			 $currt.parent().parent().remove();
            			 var uuid = $currt.data("id"); 
            			 projectroleedit.projectroleeditFunc({"title":"add","ok":function(data){
            				 $("#"+uuid).attr("data-sourcecode", data.rolecode);//角色编码
            				 $("#"+uuid).val(data.rolename);//角色名称
            				 $("#"+uuid).hide();
            				 $("#"+uuid).closest("li").find("span:eq(0)").text(data.rolename);
            			 },"cancel":function(){
            				 $("#"+uuid).closest("li").remove();//删除
            			 }});
            		 });
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 });
        	 
         },
         updateRole:function(data,updateObj){
        	 data=JSON.parse(data);
        	 updateObj.attr("data-sourcecode",data.rolecode);
        	updateObj.attr("data-orgcode","");
        	updateObj.attr("data-orgname",data.rolename);
//        	updateObj.attr("data-orgtype",data.roletype);
        	updateObj.attr("data-orgtype","r");
        	updateObj.attr("data-status",data.status);
        	updateObj.attr("data-orglevel","");
        	updateObj.attr("data-sortorder","");
         },
         professtoedit:function(e){//转为编辑
        	 var $this = $(e.currentTarget);
        	 $this.closest("li").find("span").hide();
        	 $this.closest("li").find("input").show().focus();
         },
         addProfess:function(e){
        	 var templ=Handlebars.compile(this.profess_list_html);
        	 $(e.currentTarget).closest("li").before(templ( {"uuid":mdboss.getuuid() } ));
        	 $(e.currentTarget).closest("li").prev().find("input").focus();
         },
         addProfessName:function(e){
        	 var vl = this.$el.find("#professname").val();
        	 if(vl){
        		 this.$el.find(".project-arctect-manager").text(vl);
        		 this.$el.find(".project-arctect-manager").attr("data-orgname",vl);
        	 }else{
        		 $(".project-arctect-manager").text("专业");
        	 }
         },
         editProfess:function(e){// 
        	 var r_this = this;
        	 var $current=$(e.currentTarget).find("a");
        	 $(e.currentTarget).closest("ul").find("a").removeClass("active");
        	 $current.addClass("active");
        	 r_this.$el.find(".add-project-newproject").text("编辑专业架构");
        	 var specialtycode  =$current.data("specialtycode"); 
        	 var orgcode  =$current.data("orgcode"); 
        	 var specialtyname=$current.data("specialtyname"); 
        	 var specialtytype=$current.data("specialtytype"); 
        	 var specialtylevel=$current.data("specialtylevel"); 
        	 var status=$current.data("status"); 
        	 var tid=$current.data("tid");
        	 r_this.$el.find("#tid").val(tid);
        	 r_this.$el.find("#module-del").show();//显示删除按钮
    		 r_this.$el.find("#professcode").val(specialtycode);
    		 r_this.$el.find("#professname").val(specialtyname);
    		 r_this.$el.find(".project-arctect-manager").text(specialtyname);
    		 r_this.dataset(specialtytype,specialtylevel,status);
    		 
    		 //获取专业架构 
    		 var commonModel=new mdboss.Model.commonModel();
    		 var queryCondition= new Array();
    		 queryCondition.push({"key":"parentcode", "operate":"EqualTo","v1":orgcode});
    		 commonModel.save({"usercode":mdboss.usercode,"queryCondition": queryCondition,"orderBy":"parentcode,sortorder asc"},
    				 {url:mdboss.api.projectprofessorgs,success:function(m,res){
    			 if(res.rc==1){
    				 if(res.data.rows&&res.data.rows.length>0){
    					 for(var i=0; i<res.data.rows.length; i++){
    						 if(res.data.rows[i].parentcode == "-1"){
    							 r_this.$el.find(".project-arctect-manager").text(specialtyname);
    							 r_this.$el.find(".project-arctect-manager").attr("data-sourcecode",specialtycode);
    							 r_this.$el.find(".project-arctect-manager").attr("data-orgcode",res.data.rows[i].orgcode);
    							 r_this.$el.find(".project-arctect-manager").attr("data-orgname",specialtyname);
    							 r_this.$el.find(".project-arctect-manager").attr("data-orgtype","p");
    					         r_this.$el.find(".project-arctect-manager").attr("data-orglevel","1");
    					         r_this.$el.find(".project-arctect-manager").attr("data-sortorder","1");
    							 break;
    						 }
    					 }
        	    		 var listTemplate = Handlebars.compile(r_this.profess_info_html);
	    				 var listHtml=listTemplate({"orgs":res.data.rows});
	    				 var $operateli=r_this.$el.find(".project-operate").closest("li");
	    				 $operateli.closest("ul").find("li:not(:last)").remove();
	    				 $operateli.before(listHtml);
    				 }else{
    					 mdboss.alert("查询数据为空！");
    				 }
    				 
    			 }else{
    				 mdboss.alert(res.msg);
    			 }
    		 },error:function(m,res){
    			 mdboss.error();
    		 }});
        	 
         },
         dataset:function(roletype, professlevel,status){
        	 mdboss.dataselect(this, "professtype", "PM_SPECIALTYTYPE", roletype, "205");
        	 mdboss.dataselect(this, "professlevel", "PM_SPECIALTLEVEL", professlevel, "205");
        	 mdboss.dataselect(this, "professstatus", "COMMON_STATE", status, "205");
         },
         render:function(){
        	 $( "#module_form_p" ).validVal();
        	 this.dataset( );
        	 this.renderData( );
         },
         cancelForm:function(e){//取消提交
        	 if(e){
        		 e.stopPropagation();
        	 }
        	 var r_this = this;
        	 r_this.$el.find(".add-project-newproject").text("新增专业架构");
        	 r_this.$el.find("project_profess_list a:gt(0)").removeClass("active");
        	 r_this.$el.find("#tid").val("");
        	 r_this.$el.find("#module-del").hide();
    		 r_this.$el.find("#professcode").val("");
    		 r_this.$el.find("#professname").val("");
    		 r_this.$el.find(".project-arctect-manager").text("专业");
    		 r_this.dataset("", "","");
    		 r_this.$el.find(".project-arctect-ul li").each(function(i, item){
    			 if($(item).find(".project-operate").length<1){
    				 $(item).remove();
    			 }
    		 });
         },
         submitForm:function(e){//提交
        	 var r_this = this;
        	 form_data = $( "#module_form_p" ).triggerHandler( "submitForm" );
        	 if(form_data){
        		 var professcode = r_this.$el.find("#professcode").val();
        		 var professname = r_this.$el.find("#professname").val();
        		 var professtype = r_this.$el.find("#professtype").val();
        		 var professlevel = r_this.$el.find("#professlevel").val();
        		 var tid= r_this.$el.find("#tid").val();
        		 var url = mdboss.api.projectprofessadd;
        		 var reqData={};
        		 if(professcode){
        			 url = mdboss.api.projectprofessedit;
        		 }
        		 
        		 if(professname); else professname=null;
        		 if(professtype); else professtype=null;
        		 if(professlevel); else professlevel=null;
        		
        		 if(professcode){
        			 reqData.specialtycode=professcode;
        		 }
        		 if(tid){
        			 reqData.tid=tid;
        		 }
        		 reqData.specialtylevel=professlevel;
        		 reqData.specialtyname=professname;
        		 reqData.specialtytype=professtype;
        		 
        		 reqData.usercode=mdboss.usercode;
        		 
        		 var pfess = new Array();
        		 
        		 var psourcecode= r_this.$el.find(".project-arctect-manager").data("sourcecode");
				 var porgcode = r_this.$el.find(".project-arctect-manager").data("orgcode");
				 var porgname = r_this.$el.find(".project-arctect-manager").data("orgname");
//				 r_this.$el.find(".project-arctect-manager").data("orgtype");
//		         r_this.$el.find(".project-arctect-manager").data("orglevel");
//		         r_this.$el.find(".project-arctect-manager").data("sortorder");
		         if(porgcode);else porgcode = mdboss.getuuid();
        		 
        		 pfess.push({"sourcecode":psourcecode,"parentcode":"-1","orgcode":porgcode,"orgname":porgname,"orgtype":"p","status":"1","orglevel":1,"sortorder":1});
        		 r_this.$el.find("li input").each(function(i, item){// 
        			 var orgcode=$(item).data("orgcode");
        			 var sourcecode=$(item).data("sourcecode");
        			 var orgname=$(item).val();
        			 var orgtype="r";
        			 var status=$(item).data("status");
//        			 var orglevel=$(item).data("orglevel");
        			 if(orgcode) ; else orgcode = mdboss.getuuid() ;
        			 pfess.push({"sourcecode":sourcecode,"parentcode":porgcode,"orgcode":orgcode,"orgname":orgname,"orgtype":orgtype,"status":status,"orglevel":2,"sortorder":(i+1)});
        		 });
        		 reqData.orgs=pfess;
        		 mdboss.submit(reqData, url, function(res){
            		 if(res.rc == 1){
            			 if(tid){
            				 mdboss.alert("添加成功!");
            			 }else{
            				 mdboss.alert("添加成功!");
            			 }
//            			r_this.$el.find("#project_profess_list li:gt(0)").remove();
            			r_this.renderData();
//            			r_this.cancelForm();
            		 }else{
            			 mdboss.error(res.msg);
            		 }
            	 }, true, null);
        	 }
         },
         renderData:function(){//渲染列表
        	 var r_this = this;
        	 $("#left-m-list").mCustomScrollbar("destroy");
        	 var reqData = {"pageNo":1,"pageSize":0, "orderBy":"createtime desc"};
//        	 reqData.query
        	 if(r_this.search){
        		 var keywordFields = new Array();
        		 keywordFields.push("specialtycode");
        		 keywordFields.push("specialtyname");
        		 reqData.keyword = r_this.search;
        		 reqData.keywordFields = keywordFields;
        	 }
        	 
        	 mdboss.submit(reqData , mdboss.api.projectprofess, function(res){
        		 if(res.rc == 1){
        			 // 
        			 r_this.rolelist=res.data.rows;
        			 var listTemplate = Handlebars.compile(r_this.role_list_html);
 	            	 var listHtml=listTemplate({data:res.data.rows});
 	            	 var $professlist=r_this.$el.find("#project_profess_list");
// 	            	$professlist.find("li:not(:first)").remove();//删除所有li除新增专业li
 	            	$professlist.html(listHtml);
 	            	 
 	            	 $("#left-m-list").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false  });
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 }, true, null);
         }
          
     });
     
});