/**
 * 项目架构配置
 */
define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("mCustomScrollbar");
     var projectroleedit = require("projectroleedit");
     var professconfigedit = require("professconfigedit");
     require("validVal")($);
     Dialog = require("dialog");
     
     
     //对应的el 及架构树  专业数组    ,mamanger:true加选人
     //data{el:"#dfd", profess:[code:,name:,roles:[rolename:,rolecode:]], mamanger:true}
     //项目架构配置
     exports.projecttreeFunc=function(data){
		new mdboss.View.projecttreeView(data);
     };
     
     mdboss.View.projecttreeView = Backbone.View.extend({
         el: '#rightMainContainer',
         initialize:function(data){
        	 this.rdata = data;
        	 if(data){
//         		data.el.append(require("text!template/page/project/config/projecttree.html"));
         	}
        	 
        	 this.manager_info = $("#manager-info-template").html();//项目管理员
//        	 console.log(this.manager_info);
        	 this.model_info_html=$("#architect-info-template").html();//添加项目或角色模版
        	 
        	 this.profess_list_html=$("#profess-list-template").html();//角色
        	 this.profess_info_html=$("#profess-info-template").html();
        	 this.architectlist=[];
        	 this.render();
//        	 if(data.profess){//编辑项目架构
//        		 this.editArchitect(data.profess);
//        	 }
         },
         events: {
//        	 "click .js-save-role":"submitForm", // 提交表单
//        	 "click .js-cancel-role":"cancelForm", // 提交表单
//        	 "click #project_role_list li":"editArchitect", // 编辑角色
        	 
        	 "mouseenter .project-arctect-li":"showEdit", // 显示隐藏 编辑操作
        	 "mouseleave .project-arctect-li":"showEdit", // 
        	 "click .project-operate-profess":"addArchitectProfess", //添加专业
        	 "click .project-operate-role":"addArchitectRole", //添加架构角色
//        	 "keyup input[name=architect]":"architectedit", // 编辑
//        	 "focusout input[name=architect]":"architectedit", // 编辑
        	 
        	 "click .project-operate-op":"architectoperate", // 操作
        	 
        	 "click .architectinfo":"professEdit", // 编辑专业
        	 "focus .architectselect":'architectselect',//搜索专业
        	 "keyup .architectselect":'delegateMan2',//专业填写完成

        	 "click .professinfo":'professEdit',//角色编辑
        	 "focus .roleselect":'professselect',//角色
        	 "keyup .roleselect":'delegateMan2',//角色填写完成
        	 
//        	 "keyup .architectselect":'architectselect',//搜索专业
        	 
        	 "focus .mangerselect":'mangerselect',//搜索管理员
        	 "keyup .mangerselect":'mangerselect',//搜索管理员
//        	 "click .managerinfo":"mangerselectEdit", // 编辑管理员
        	 
//        	 "keyup .roleselect":'professselect',//角色
        	// "click .project-operate-role":'addRole',//搜索专业
//        	 "click .project-arctect-manager":"projectarctectmanager",//标题
        	 "click .js-delete-man":"deleteManager",//删除项目管理员
        	 "mouseenter .managerinfo span":"showdel",//显示删除
        	 "mouseleave .managerinfo span":"hidedel"//隐藏删除
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
         showdel:function(e){
        	$(e.currentTarget).find("button").show(); 
         },
         hidedel:function(e){
         	$(e.currentTarget).find("button").hide(); 
          },
         deleteManager:function(e){//删除项目管理员
        	 $(e.currentTarget).closest("span").remove();
         },
         mangerselect:function(e){////搜索管理员 
        	 var p_this = this;
        	 mdboss.userselect(e, p_this, function(pview, usercode, name){
        		 console.log(name);
        		 var listTemplate = Handlebars.compile(p_this.manager_info);
    			 var listHtml=listTemplate({"usercode":usercode,"username":name });
    			 $(e.currentTarget).closest("li").find(".managerinfo:eq(0)").append(listHtml);
    			 $(e.currentTarget).closest("li").find("input:eq(1)").hide();
        	 },false); 
         },
//         mangerselectEdit:function(e){ //编辑管理员
//        	 var $this = $(e.currentTarget);
//        	 $this.hide();
//        	 $this.closest("li").find("input:eq(1)").show().focus();
//         },
//         projectarctectmanager:function(e){ //
//        	  this.$el.find("#pmanger").show();
//        	  $(e.currentTarget).hide();
//         },
         professEdit:function(e){//专业添加,修改
        	 var $this = $(e.currentTarget);
        	 $this.hide();
        	 $this.closest("li").find("input:eq(0)").show().focus();//.focus();
         },
         addRole:function(e){//添加角色
        	 var tmplate = Handlebars.compile(this.profess_list_html);
        	 $(e.currentTarget).closest("li").before(tmplate({"manager":this.rdata.manager}));
        	 $(e.currentTarget).closest("li").prev().find("input").focus();
         },
         professselect:function(e){//搜索角色
        	 console.log("professselect");
//        	 var d_this=this;
//        	 if(e.type == "keyup" && e.which==13){
//        		 var condtion=new Array();
//        		 condtion.push( {"key":"rolename","operate":"Like","v1":$(e.currentTarget).val()});
//        		 var reqData={"usercode":mdboss.api.usercode,"pageNo":1,"pageSize":10, "queryCondition": condtion,"orderBy":"createtime desc"};
//        		 mdboss.select(e,reqData, mdboss.api.projectrolelist,"professinfo", "rolecode","rolename",d_this.updateRole); 
//        	 }else{
//        		 var reqData={"usercode":mdboss.api.usercode,"pageNo":1,"pageSize":10, "orderBy":"createtime desc"};
//        		 mdboss.select(e,reqData, mdboss.api.projectrolelist,"professinfo", "rolecode","rolename",d_this.updateRole); 
//        	 }
//        	 var $this = $(e.currentTarget);
        	 
        	 
        	 
        	 var uuid = $(e.currentTarget).attr("id");
        	 var left = parseInt($(e.currentTarget).offset().left) +102;
        	 var top = parseInt($(e.currentTarget).offset().top);
        	 
        	 var reqData={"usercode":mdboss.usercode,"pageNo":1,"pageSize":10, "orderBy":"createtime desc"};
        	 mdboss.reqsubmit(reqData, mdboss.api.projectrolelist, function(m, res){
        		 if(res.rc == 1){
        			 var tip = $("#tip-info-template").html();
        			 var tiptepl =Handlebars.compile(tip);//
        			 var html = tiptepl({"data":res.data.rows, "left":left, "top":top,"uuid":uuid});
            		 $("body").append(html);
            		 //选 择角色 
            		 $(".js_select_toggle").click(function(e){//TODO
            			 console.log("role select ");
                    	 var $this = $(e.currentTarget);
                    	 var uuid = $this.data("id");
                    	 if( $.trim($this.text()) == "取消"){
                    		 $("#"+uuid).closest("li").remove();//删除
                    		 $this.parent().parent().remove();
                    	 }else{
                    		 var orgcode = $currt.data("code");//orgcode
                    		 $("#"+uuid).val($.trim($this.text()));
                    		 $("#"+uuid).attr("data-sourcecode", orgcode);//角色编码
                    		 $("#"+uuid).closest("li").find("span:eq(0)").show();
                    		 $("#"+uuid).closest("li").find("span:eq(0)").text($.trim($this.text()));
                    		 $("#"+uuid).hide();
                    		 $this.parent().parent().remove();
                    	 }
            		 });
            		 
            		 //添加项目角色
            		 $(".js_select_add").click(function(e){
            			 console.log("add role");
            			 var $currt = $(e.currentTarget);
            			 $currt.parent().parent().remove();
            			 var uuid = $currt.data("id"); 
            			 projectroleedit.projectroleeditFunc({"title":"add","ok":function(data){
            				 $("#"+uuid).attr("data-sourcecode", data.rolecode);//角色编码
            				 $("#"+uuid).val(data.rolename);//角色名称
            				 $("#"+uuid).closest("li").find("span:eq(0)").text(data.rolename);
            				 $("#"+uuid).hide();
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
         architectselect:function(e){//搜索项目  
        	 var p_this = this;
//        	 var $this = $(e.currentTarget);
        	 $(".tipso_bubble").remove();
        	 var uuid = $(e.currentTarget).attr("id");
        	 var left = parseInt($(e.currentTarget).offset().left) +102;
        	 var top = parseInt($(e.currentTarget).offset().top);
//        	 if(document.body.clientHeight - top < 200){
//        		 top = document.body.clientHeight - top + 300;
//        	 }
        	 var orgtype =  $(e.currentTarget).data("orgtype");
        	 var reqData = {"usercode":mdboss.usercode,"pageNo":1,"pageSize":0, "orderBy":"createtime desc"};
        	 var url = "";
        	 if(orgtype == "p"){//专业
        		 url = mdboss.api.projectprofess;
        	 }else{//角色
            	 url =mdboss.api.projectrolelist;
        	 }
        	 //发送请求
        	 mdboss.reqsubmit(reqData, url, function(m, res){
        		 if(res.rc == 1){
        			 var tip = $("#tip-info-select-template").html();
        			 var tiptepl =Handlebars.compile(tip);//
        			 if(document.body.clientHeight - top < 150){
                		 top -= (res.data.rows.length % 5)*55;
                	 }
        			 var html = tiptepl({"data":res.data.rows, "left":left, "top":top,"uuid":uuid,"orgtype":orgtype});
            		 $("body").append(html);
            		 
            		 //选择
            		 $(".js_select_toggle").click(function(e){
//            			 console.log("select ----");
                    	 var $currt = $(e.currentTarget);
                    	 var uuid = $currt.data("id");
                    	 if( $.trim($currt.text()) == "取消"){
                    		 $("#"+uuid).closest("li").remove();//删除
                    		 $currt.parent().parent().remove();
                    	 }else{
                    		 var orgcode = $currt.data("code");//orgcode
                    		 $("#"+uuid).val($.trim($currt.text()));
                    		 $("#"+uuid).attr("data-sourcecode", orgcode);//角色编码
                    		 $("#"+uuid).closest("li").find("span:eq(0)").show();
                    		 $("#"+uuid).closest("li").find("span:eq(0)").text($.trim($currt.text()));
                    		 $("#"+uuid).hide();
                    		 $currt.parent().parent().remove();
                    		 
                    		 if(orgtype == "p"){//专业 TODO
                    			 var orgcode = $currt.data("code");
//                    			 var queryCondition= new Array();
//                        		 queryCondition.push({"key":"parentcode", "operate":"EqualTo","v1":orgcode});
//                        		 var reqData = {"usercode":mdboss.usercode,"queryCondition": queryCondition,"orderBy":"parentcode,sortorder asc"};
//                    			 mdboss.reqsubmit(reqData, mdboss.api.projectprofessorgs,function(m, res){
//                    				 if(res.rc==1){
//                    					 var tmplate = Handlebars.compile($("#profess-role-list-template").html());
//                    					 $("#"+uuid).closest("li").find(".project-operate-role").closest("li").siblings().remove();;
//                    					 $("#"+uuid).closest("li").find(".project-operate-role").closest("li").before(tmplate({"roles":res.data.rows,"show":false,"manager":p_this.rdata.manager}));
//                    				 }else{
//                    					 mdboss.alert(res.msg);
//                    				 }
//                    			 });
                    			 p_this.rolesBySpecialty(orgcode, uuid);
                    		 }
                    	 }
            		 });//end
            		 
            		//添加项目角色
            		 $(".js_select_add").click(function(e){
            			 console.log("add " + orgtype);
            			 var $currt = $(e.currentTarget);
            			 $currt.parent().parent().remove();
            			 var uuid = $currt.data("id"); 
            			 if(orgtype == "p"){//添加专业 
            				 professconfigedit.professconfigEditFunc({"ok":function(data){
            					 console.log(data);
            					 $("#"+uuid).attr("data-sourcecode", data.specialtycode);//专业编码
            					 $("#"+uuid).val(data.specialtyname);//专业名称
            					 $("#"+uuid).closest("li").find("span:eq(0)").text(data.specialtyname);
            					 $("#"+uuid).hide();
            					 // 加载角色
            					 p_this.rolesBySpecialty(data.specialtycode, uuid);
            				 },"cancel":function(){
            					 console.log("cnacle  lll ");
            					 $("#"+uuid).closest("li").remove();//删除
            				 }});
            			 }else{ //添加角色
            				 projectroleedit.projectroleeditFunc({"title":"add","ok":function(data){
            					 $("#"+uuid).attr("data-sourcecode", data.rolecode);//角色编码
            					 $("#"+uuid).val(data.rolename);//角色名称
            					 $("#"+uuid).closest("li").find("span:eq(0)").text(data.rolename);
            					 $("#"+uuid).hide();
            				 },"cancel":function(){
            					 $("#"+uuid).closest("li").remove();//删除
            				 }});
            			 }
            		 });//end
        		 }else{
        			 mdboss.error(res.msg);
        		 }
        	 });
         },
         rolesBySpecialty:function(orgcode, uuid){//加载专业下的角色
        	 p_this = this;
        	 var queryCondition= new Array();
    		 queryCondition.push({"key":"parentcode", "operate":"EqualTo","v1":orgcode});
    		 var reqData = {"usercode":mdboss.usercode,"queryCondition": queryCondition,"orderBy":"parentcode,sortorder asc"};
			 mdboss.reqsubmit(reqData, mdboss.api.projectprofessorgs,function(m, res){
				 if(res.rc==1){
					 var tmplate = Handlebars.compile($("#profess-role-list-template").html());
					 $("#"+uuid).closest("li").find(".project-operate-role").closest("li").siblings().remove();;
					 $("#"+uuid).closest("li").find(".project-operate-role").closest("li").before(tmplate({"roles":res.data.rows,"show":false,"manager":p_this.rdata.manager}));
				 }else{
					 mdboss.alert(res.msg);
				 }
			 });
         },
         architectoperate:function(e){ // 操作上移下移,删除 展开,收起
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
        	 console.log("经过");
        	 if(e.type == "mouseenter"){
        		 $(e.currentTarget).children(".project-operate-op").show();
        	 }else{
        		 $(e.currentTarget).children(".project-operate-op").hide();
        	 }
         }, 
         addArchitectProfess:function(e){//添加专业
        	 console.log(" addArchitectProfess专业 ");
        	 var p_this = this;
        	 var listTemplate = Handlebars.compile(this.model_info_html);
			 var listHtml=listTemplate({"show":false,"manager":p_this.rdata.manager , "orgtype":"p", "orgcode":mdboss.getuuid()});
        	 $(e.currentTarget).closest("li").before(listHtml);
        	 $(e.currentTarget).closest("li").prev().find("input:eq(0)").focus();//.focus();
         },
         addArchitectRole:function(e){//添加架构角色 
        	 console.log(" addArchitectRole 角色");
        	 var p_this = this;
        	 var listTemplate = Handlebars.compile(this.model_info_html);
			 var listHtml=listTemplate({"show":false,"manager":p_this.rdata.manager, "orgtype":"r" ,"orgcode":mdboss.getuuid()});
        	 $(e.currentTarget).closest("li").before(listHtml);
        	 $(e.currentTarget).closest("li").prev().find("input:eq(0)").focus();
         },
         editArchitectTree:function(param){//编辑项目架构
        	 console.log("isNew="+param.isNew);
        	 console.log(param);
        	 var p_this = this; 
        	 var isEditAll = true;
        	 if( p_this.$el.find("#manager").data("code") != mdboss.usercode){
        		 isEditAll=false;
        	 }
        	 if(param){
    			 var tmp = param.profess;
    			 var profess = new Array();
    			 var ppcode="";
    			 for(var i=0; i<tmp.length; i++){
    				 if(tmp[i].parentcode == "-1"){
    					 //
    					 if(param.isNew || param.isArchitect){
    						 isEditAll = true;
    					 } else{
    						 p_this.$el.find(".project-arctect-manager").attr("data-orgcode",tmp[i].orgcode);
    					 }
    					 p_this.$el.find(".project-arctect-manager").attr("data-sourcecode",tmp[i].sourcecode);
    					 p_this.$el.find(".project-arctect-manager").attr("data-orgname",tmp[i].orgname);
    					 p_this.$el.find(".project-arctect-manager").html(tmp[i].orgname+'<span style="color: #0288ce; margin-left: 10px;" id="showmanager"></span>');
    					 
    					 if(tmp[i].usercodes){
    						 p_this.$el.find("#showmanager").attr("data-code",tmp[i].usercodes[0]);
    						 p_this.$el.find("#showmanager").text(tmp[i].usercodes[0]);
    					 }
    					 ppcode= tmp[i].orgcode;
    					 continue;
    				 }
    				 
    				 //判断是否可编辑
    				 if(isEditAll){
    					 tmp[i].edit = true;
    					 tmp[i].editall = true;
    				 }else{
    					 //判断是否可编辑
    					 if(tmp[i].usercodes){
    						 for(var k=0; k<tmp[i].usercodes.length; k++){
    							 if(tmp[i].usercodes[k] == mdboss.usercode){
    								 tmp[i].edit = true;
    								 break;
    							 }
    						 }
    					 }
    				 }
    				 
    				 
    				 if(tmp[i].parentcode && ppcode == tmp[i].parentcode ){//
    					 var roles = new Array();
    					 tmp[i].roles= roles;
    					 profess.push(tmp[i]);
    				 }else{
    					 $.each(profess,function(k, item){
    						 if(item.orgcode == tmp[i].parentcode){
    							 item.roles.push(tmp[i]);
    						 }
    					 });
    				 }
    			 }//end for
    			 
    			 console.log(profess);
//    			 var defaultNodeTemp=Handlebars.compile($("#architect-defaultNode-template").html());//项目架构默认节点模版
//    			 p_this.$el.find(".project-operate-profess").closest("li").before(defaultNodeTemp);
    			 
    			 var listTemplate = Handlebars.compile($("#architect-info-list-template").html());//专业模版
    			 var listHtml = listTemplate({"professlist":profess,"show":true,"manager":p_this.rdata.manager});

    			 p_this.$el.find(".project-operate-profess").closest("li").before(listHtml);

    			 if(!isEditAll){
    				 p_this.$el.find(".project-operate-profess").closest("li").hide();
//    				 p_this.$el.find(".project-operate-role").hide();
    			 }
        	 }else{
        		 p_this.cancelForm();
        	 }
         },
         
         render:function(){
         },
         cancelForm:function(e){//取消提交
        	 var p_this = this;
        	 p_this.$el.find("#tid").val("");
    		 p_this.$el.find("#architectcode").val("");
    		 p_this.$el.find("#architectname").val("");
//    		 p_this.dataset("", "");
    		 p_this.$el.find(".project-arctect-ul li").each(function(i, item){
    			 if($(item).find(".project-operate-profess").length<1){
    				 $(item).remove();
    			 }
    		 });
         },
         getArchitectData:function(){//获取项目架构树     	 
        	 var p_this = this;
    		 var pfess = new Array();  //项目专业
    		 
//    		 根结点
    		 var psourcecode= p_this.$el.find(".project-arctect-manager").data("sourcecode");
			 var porgcode = p_this.$el.find(".project-arctect-manager").data("orgcode");
			 var porgname = p_this.$el.find(".project-arctect-manager").data("orgname");
			 console.log("porgcode="+porgcode);
    		 var isNew = true;
    		 var sortorder1=1;
    		 if(porgcode) isNew =false; else porgcode=mdboss.getuuid(); 
    		 if(porgname) ; else porgname="项目负责人"; 
    		 var pmanger=new Array();
    		 var code = p_this.$el.find("#showmanager").data("code");
    		 if(code)pmanger.push(code);
    		 pfess.push({"orgname":porgname,"orgcode":porgcode,"parentcode":"-1", "sourcecode":psourcecode,"orglevel":1,"sortorder":1,"orgtype":"a","usercodes":pmanger});
    		
    		 
    		 p_this.$el.find("input[name=architect]").each(function(i, item){
    			 pmanger=new Array();//项目管理员
    			 $(item).closest("li").find(".managerinfo:eq(0)").find(".entity-item").each(function(j, uitem){
    				 pmanger.push($(uitem).attr("data-code"));
    			 });
    			 var orgtype = $(item).data("orgtype");
    			 var orgcode = $(item).data("orgcode");
    			 if(orgcode){if(isNew)orgcode=mdboss.getuuid();}else orgcode = mdboss.getuuid();
    			 pfess.push({"orgname":$(item).val(),"parentcode":porgcode,"orgcode":orgcode,"sourcecode":$(item).data("code"), "usercodes":pmanger,"orglevel":2,"sortorder":sortorder1++,"orgtype":orgtype});
    			
    			 var sortorder2=1;  //角色
    			 $(item).closest("li").find("input[name=profess]").each(function(j, ritem){
    				 pmanger=new Array(); //项目管理员
        			 $(ritem).closest("li").find(".managerinfo:eq(0)").find(".entity-item").each(function(j, uitem){
        				 pmanger.push($(uitem).attr("data-code"));
        			 });
        			 var corgcode = $(ritem).data("orgcode");
        			 if(corgcode){if(isNew)corgcode=mdboss.getuuid();}else corgcode = mdboss.getuuid();
    				 //  角色用户
    				 pfess.push({"orgname":$(ritem).val(),"parentcode":orgcode,"orgcode":corgcode, "sourcecode":$(ritem).data("code"),"orglevel":3,"sortorder":sortorder2++,"orgtype":$(ritem).data("orgtype"),"usercodes":pmanger});
    			 });
    		 });
    		 console.log(pfess);
        	 return pfess;
         },
         renderData:function(profess){//渲染列表
        	 
         }
          
     });
     
});