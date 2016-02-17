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
     exports.professconfigEditFunc=function(data){
		new mdboss.View.professeditView(data);
     };
     
     mdboss.View.professeditView = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 //传入的参数
        	 _this.rdata=data;
        	 this.edit_html = require("text!template/page/project/config/professedit.html");
        	 console.log("sdf");
        	 _this.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){ $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});   }
             }, {"title":"新建专业架构" ,"width":"750px","height":"550px","icon":"iconfont icon-mdliucheng",
            	 full:false, layer:true,btns: [],
            	 "resize":function(){}}).show(function(){
                	 var dialog=this;
  		 			 dialog.$html.find(".dialog-content").html(_this.edit_html).fadeIn();
  		 			 
  		        	 _this.tip_info_template = $("#tip-info-role-template").html();
  		        	 _this.profess_list_html=$("#profess-list-template-1").html();
  		        	 _this.profess_info_html=$("#profess-info-template-1").html();
  		        	 
  		        	_this.$el.find("#module_form_p").mCustomScrollbar({scrollButtons:{
	    					enable:false }, theme: "darkblue",horizontalScroll:false,
	            		 });
  		        	 
  		 			_this.$el.find( "#module_form_p" ).validVal();
  		 			_this.render();
             }); 
        	 this.$el = _this.dialog.$html;
         },
         events: {
        	 
        	 "click .js-save-profess":"submitForm", //专业表单提交
        	 "click .js-cancel-profess":"cancelForm", //专业添加取消清空表单
        	 "click #module-add":"cancelForm", // 新增专业清空表单
        	 
        	 "keyup #professname":"addProfessName", //专业名称更新同步结构树中的专业名称
        	 "click .project-operate":"addProfess", //添加保存专业
        	 "click .professinfo":"professtoedit", //角色
         
        	 "focus .roleselect":'delegateMan',//角色
        	 "keyup .roleselect":'delegateMan2',//角色填写完成
        	 "mouseenter .project-arctect-li":"showEdit", // 显示隐藏 编辑操作
        	 "mouseleave .project-arctect-li":"showEdit", //添加项目
        	 "click .project-operate-op":"architectoperate", // 操作
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
        	 
        	 var d_this=this;
        	 var $this = $(e.currentTarget);
        	 var uuid = $(e.currentTarget).attr("id");
        	 var left = parseInt($this.offset().left) +102;
        	 var top = parseInt($this.offset().top);
        	 
        	 var reqData={"usercode":mdboss.usercode,"pageNo":1,"pageSize":10, "orderBy":"createtime desc"};
        	 mdboss.reqsubmit(reqData, mdboss.api.projectrolelist, function(m, res){
        		 if(res.rc == 1){
        			 var tip = $("#tip-info-role-template").html();
        			 var tiptepl =Handlebars.compile(tip);//
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
         dataset:function(roletype, professlevel,status){
        	 mdboss.dataselect(this, "professtype", "PM_SPECIALTYTYPE", roletype, "205");
        	 mdboss.dataselect(this, "professlevel", "PM_SPECIALTLEVEL", professlevel, "205");
        	 mdboss.dataselect(this, "professstatus", "COMMON_STATE", status, "205");
         },
         render:function(){
        	 $( "#module_form_p" ).validVal();
        	 this.dataset( );
         },
         cancelForm:function(e){//取消提交
        	 _this=this;
        	 var callback = _this.rdata.cancel;//取消添加
			 callbackFn = typeof callback == "function" ? callback : function () { };
			 callbackFn();
        	 _this.dialog.close();
         },
         submitForm:function(e){//提交
        	 var r_this = this;
        	 form_data = $( "#module_form_p" ).triggerHandler( "submitForm" );
        	 if(form_data){
        		 var professcode = r_this.$el.find("#professcode").val();
        		 var professname = r_this.$el.find("#professname").val();
        		 var professtype = r_this.$el.find("#professtype").val();
        		 var professlevel = r_this.$el.find("#professlevel").val();
        		 var url = mdboss.api.projectprofessadd;
        		 var reqData={};
        		 
        		 if(professname); else professname=null;
        		 if(professtype); else professtype=null;
        		 if(professlevel); else professlevel=null;
        		
        		 if(professcode){
        			 reqData.specialtycode=professcode;
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
            			mdboss.alert("添加成功!");
            			//添加项目角色
	        			 if(_this.rdata.ok){
	        				 callback = _this.rdata.ok;
	        				 callbackFn = typeof callback == "function" ? callback : function () { };
	        				 callbackFn(res.data);
	        				 _this.dialog.close();
	        			 }
            		 }else{
            			 mdboss.error(res.msg);
            		 }
            	 }, true, null);
        	 }
         }
         
     });
     
     /**------------------------------------------------------------------------------------------*/
});