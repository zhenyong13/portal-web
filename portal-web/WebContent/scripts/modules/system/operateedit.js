define(function (require, exports, module) {
	 var mdboss = require("mdboss");
	 var util =  require("util");
     $      = require("jquery");
     require("scroll");
     require("validVal")($);
     require("select2");
     Dialog = require("dialog");
	
     mdboss.View.operateedit = Backbone.View.extend({
    	 $dialog:"",
         initialize:function(data){
        	 _this=this;
        	 _this.rdata=data;
        	 _this.tid=data.tid;
        	 _this.detail = data.view;
        	 this.roles = new Array();//角色[code]
        	 this.rolelist = new Array();//角色{rolecode:"",rolename:""}
//        	 this.roles.push(1);
        	 _this.modeuledetail_html = require("text!template/page/system/operatedetail.html");
        	 _this.modeuledit_html = require("text!template/page/system/operateedit.html");
        	 _this.modeulbatchedit_html = require("text!template/page/system/operatebatchedit.html");
        	 _this.callback=data.renderData;
        	 _this.height = "491px";
        	 if(_this.rdata.tids){
        		 _this.height = "251px";
        	 }
        	 _this.dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                 }
             }, {"title":data.title ,"width":"850px","height":_this.height,"icon":"iconfont icon-mdliucheng","resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "operatedetail", "post" : { "usercode":mdboss.usercode, "tid":_this.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["operatedetail"];
                 		 		if(_this.detail){//详情
                 		 			var templateA=Handlebars.compile(_this.modeuledetail_html);
                 		 			resData.baseurl= baseConfig.avatar_url;
                 		 			console.log(resData);
                 		 			//2015-10-10 修改分管组织
//                 		 			if(resData.extorgcode && resData.extorgcode.indexOf("{")>0){
//	                 		 			var extorgcode = jQuery.parseJSON(resData.extorgcode);
//	                 		 			var extorgname = "";
//	                 		 			for(var i=0; i<extorgcode.length; i++ ){
//	                 		 				extorgname +=extorgcode[i].name+",";
//	                 		 			}
//	                 		 			resData.extorgcode = extorgname;
//                 		 			}
//                 		 			if(resData.leader && resData.leader.indexOf("{")>0){
//                 		 				resData.userleader = jQuery.parseJSON(resData.leader).name;
//                 		 			}
                 		 			//end
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.modeuledit_html);
                 		 			resData.baseurl= baseConfig.avatar_url;
                 		 			
                 		 			//2015-10-10 修改分管组织
//                 		 			if(resData.extorgcode && resData.extorgcode.indexOf("{")>0){
//                 		 				var extorgcode = jQuery.parseJSON(resData.extorgcode);
//                 		 				var extorgname = "";
//                 		 				for(var i=0; i<extorgcode.length; i++ ){
//                 		 					extorgname +=extorgcode[i].name+",";
//                 		 				}
//                 		 				resData.extorgname = extorgname;
//                 		 			}
//                 		 			if(resData.leader && resData.leader.indexOf("{")>0){
//                 		 				resData.leadercode = jQuery.parseJSON(resData.leader).code;
//                 		 				resData.leaderman = jQuery.parseJSON(resData.leader).name;
//                 		 			}
                 		 			//end
                 		 			var html=template(resData);
//                 		 			 _this.dataselect(resData.userlevel, resData.positionlevel);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			$( "#module_form" ).validVal();
                 		 		}     
//                 		 		showRole(this, this.$el, resData.roles);
	                         } 
	                         else {
	                         	mdboss.error(msg);
	                         }
	                     });
                	 }else{//新增
                		 var template = null;
                		 if(_this.rdata.tids){
                			  template=Handlebars.compile(_this.modeulbatchedit_html);
            		 		 var html=template({});
            		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
                		 }else{
                			 template=Handlebars.compile(_this.modeuledit_html);
            		 		 var html=template({});
            		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
            		 		$( "#module_form" ).validVal();
                		 }
                		 
                	}
             }); 
        	 _this.$el = _this.dialog.$html;
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_dept':'selected_dept',//选择部门
        	 'click .js_search_dept_checkbox':'selected_dept_checkbox',//分管组织
        	 'click .js_select_person':'selected_person',
        	 'click .js_search_role':'selectRole',
        	 "focus #leader_man":'delegateMan',//搜索委托人
        	 "keyup #leader_man":'delegateManKey',//搜索委托人
        	 "click #btn-resetPwd":'resetPwd',//重置密码
        	 "change .js_fileupload_":'filecodeUpload',//文件上传上传
         },
         filecodeUpload:function(e){
        	 var v_this = this;
        	 var $this  = $(e.currentTarget);
        	 var id = $this.attr("id");
        	 var dataid = $this.attr("data-id");
        	 var params = util.toJson($this.attr("data-params"));
        	 var allowExtention = ".png,.gif,.jpg,jpeg";
			  var filepath=$("#"+id).val();
			  var ext=filepath.substring(filepath.lastIndexOf(".")).toLowerCase();
			  if(allowExtention.indexOf(ext)!=-1){
	        	 mdboss.fileupload(id, function(data){
	        		mdboss.alert("上传成功!");
	        		 if(data instanceof Array){
	        			 if(data && data.length){
		        			 $.each(data, function(i, item){
		        				 if(i == 0){
		        					 $("#"+dataid).val(item.id);
		        					 v_this.$el.find("#"+dataid+"img").attr("src", baseConfig.avatar_url+""+item.id);
		        					 return true;
		        				 }
		        			 });
		        		 }
	        		 }else{
	        			 $("#"+dataid).val(data.id);
    					 v_this.$el.find("#"+dataid+"img").attr("src", baseConfig.avatar_url+""+data.id);
	        		 }
	        		 
	        	 },true,params);
			  }else{
				  mdboss.error("上传文件类型不正确!");
			  }
         },
         dataselect:function(positionlevel, userlevel){//下拉列表数据获取 
//        	 mdboss.dataselect(this, "moduletype", "UCP_MODULETYPE",moduletype);
          },
         resetPwd:function(e){
        	 var $this  = $(e.currentTarget);
         	 var tid = $this.data("tid");
        	 mdboss.confirm("确定要重置密码吗?",function(e){
        		 if(e){
        			 var commonModel = new mdboss.Model.commonModel();
                	 commonModel.save({"usercode":mdboss.usercode,"tid":tid},{url:mdboss.api.resetpwd,success:function(m, res){
                		 if(res.rc == 1){
                			 mdboss.alert("密码重置成功!");
                		 }else{
                			 mdboss.error(res.msg);
                		 }
                	 },error:function(){
                		 mdboss.error();
                	 }});
        		 }
        	 });
         },
         delegateManKey:function(e){//回车搜索
         	if(e.which ==13){
         		this.delegateMan(e);
         	}
         },
         delegateBack:function(pview, usercode, name){
        	 pview.$el.find("#userleader").val(usercode);
         },
         delegateMan:function(e){
        	 mdboss.userselect(e, this, this.delegateBack);
         },
         selectRole:function(){//角色选择
        	 new mdboss.View.rolelistView({"roles":this.roles,"pview":this,"parent":this.$el, "callback":this.showRole});
         },
         showRole:function(pview, parent, rls){//角色显示 回调
        	 parent.find(".selected_role_show").html("");
      		 var deptshow=new Array();
      		 for(var i=0;i<rls.length;i++){
      			 var role = rls[i];
      			 deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+role.rolecode+'">');
      			 deptshow.push('<a id="r'+role.rolecode+'"  data-code="'+role.rolecode+'" data-name="'+role.rolename+'">'+role.rolename+'</a> ');
      			 deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
      			 deptshow.push('</span>');
      		 }
      		parent.find(".selected_role_show").append(deptshow.join(''));
         },
         selected_person:function(e){
        	 _this=this;
        	 mdboss.selectedperson({"callbacks":_this.selpersoncallback});
         },
         selpersoncallback:function(data){
    	 	var template=Handlebars.compile($("#sel-personshow-template").html());
    		$(".selected_person_show").html(template({"persons":data}));
         },
         selected_dept_checkbox:function(){//分管组织
        	 _this=this;
        	 v_this=this;
        	 var dept_arr=new Array();
 	        seajs.use("orgs", function () {
 	        	if(_this.$el.find("#extorgcode").val()){
// 	        		var extorgcode = jQuery.parseJSON(_this.$el.find("#extorgcode").val());
//		 			for(var i=0; i<extorgcode.length; i++ ){
//		 				 dept_arr.push(extorgcode[i].code);
//		 			}
 	        		var orglist = _this.$el.find("#extorgcode").val().split(",");
 	        		 for(var i=0; i<orglist.length; i++){
 	        			 dept_arr.push(orglist[i]);
 	        		 }
 	        	}
 	        	new mdboss.View.orgsView({dept:dept_arr,"selectCheckbox":true,
 	        		"callbacks":_this.searchByOrgCheckbox,"pview":v_this,"title":"分管组织"});
 	        });
         },
         searchByOrgCheckbox:function(pview, orglist){//分管组织 回调 
        	 console.log(orglist);
        	 if(orglist){
        		 var  orgcodes = "";
        		 var  orgnames = "";
        		 for(var i=0; i<orglist.length; i++){
        			 orgcodes += orglist[i].code ;
        			 orgnames += orglist[i].name ;
        			 if( (i+1) != orglist.length){
        				 orgcodes +=  "," ;
            			 orgnames +=  "," ;
        			 }
        		 }
        		 pview.$el.find("#extorgname").val(orgnames);
//        		 pview.$el.find("#extorgcode").val(JSON.stringify(orglist));
        		 pview.$el.find("#extorgcode").val(orgcodes);
        	 }
         },
         selected_dept:function(e){
        	 _this=this;
        	 var dept_arr=new Array();
 	        seajs.use("orgs", function () {
 	        	if(_this.$el.find("#parentcode").val() != ""){
 	        		dept_arr.push(_this.$el.find("#parentcode").val());
 	        	}
 	        	new mdboss.View.orgsView({dept:dept_arr,parent:_this.$el,"selectOnly":true,
 	        		"callbacks":_this.searchByOrg,"pview":_this,"title":"组织选择"});
 	        });
         },
         searchByOrg:function(treeNode, parent, pview){
        	 if(treeNode.id =="org--1"){
        		 parent.find("#parentcode").val("");
        		 parent.find("#parentname").val("");
        	 }else{
        		 parent.find("#parentcode").val(treeNode.id);
        		 parent.find("#parentname").val(treeNode.name);
        	 }
         },
         submit:function(e){//提交
        	 _this=this;
        	 var form_data =true;
        	 if(_this.rdata.tids){
        	 }else{
        		 form_data =  $( "#module_form" ).triggerHandler( "submitForm" );
        	 }
 	         if ( form_data ) {
// 	        	 var roles = new Array();
// 	        	$(".selected_role_show .file-show").each(function(i, item){
////	        		 console.log($(item).find("a").data("code") +" -- " + $(item).find("a").data("name"));
//	        		 roles.push($(item).find("a").data("code"));
//	        	 });
 	        	 
	        	 var tid=_this.$el.find("#tid").val();
	        	 var workno=_this.$el.find("#workno").val();
	        	 var usercode=_this.$el.find("#usercode").val();
	        	 var orgcode=_this.$el.find("#parentcode").val();
	        	 var extorgcode=_this.$el.find("#extorgcode").val();//分管组织
	        	 var avatarcode=_this.$el.find("#avatarcode").val();//分管组织
	        	 var signfilecode=_this.$el.find("#signfilecode").val();//分管组织
	        	 var username=_this.$el.find("#username").val();
	        	 var userlevel=_this.$el.find("#userlevel").val();
	        	 var userrank=_this.$el.find("#userrank").val();
	        	 var address=_this.$el.find("#address").val();
	        	 var userdesc=_this.$el.find("#userdesc").val();
	        	 var mobileno=_this.$el.find("#mobileno").val();
	        	 var userleader=_this.$el.find("#userleader").val();
	        	 var email=_this.$el.find("#email").val();
	        	 var pinyin=_this.$el.find("#pinyin").val();
	        	 var positionlevel=_this.$el.find("#positionlevel").val();
	        	 var sex=_this.$el.find("#sex").val();
	        	 
	        	 if(avatarcode);else avatarcode= null; //
	        	 if(signfilecode);else signfilecode= null; //
	        	 if(userleader);else userleader= null; //
	        	 if(positionlevel);else positionlevel= null; //
	        	 if(pinyin);else pinyin= null; //
	        	 if(sex);else sex= null; //
	        	 if(userlevel);else userlevel= null; //
	        	 if(userdesc);else userdesc= null; //
	        	 if(address);else address= null; //
	        	 if(userrank);else userrank= null; //
	        	 if(email);else email= null; //
	        	 if(mobileno);else mobileno= null; //
	        	 if(orgcode);else orgcode= null; //
	        	 if(extorgcode);else extorgcode= null; //
	        	 
	        	 var callback = _this.callback;
	        	 var req={};
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.operateadd;
	        	
	        	 if(_this.rdata.tids){//批量修改
	        		 url =mdboss.api.operatebatchedit;
	        		 req={"usercode":mdboss.usercode};
	        		 req.tids = _this.rdata.tids;
	        		 if(orgcode){
	        			 req.orgcode = orgcode;
	        		 }
	        		 if(positionlevel){
	        			 req.positionlevel = positionlevel;
	        		 }
	        		 if(userlevel){
	        			 req.userlevel = userlevel;
	        		 }
	        		 if(userrank){
	        			 req.userrank = userrank;
	        		 }
	        		 if(sex){
	        			 req.sex = sex;
	        		 }
	        		 if(userleader){
//	        			 req.leader =JSON.stringify( {"code":userleader, "name": _this.$el.find("#leader_man").val() } );
	        			 req.leader = userleader;
	        		 }
	        	 }else{
	        		 var  re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
	      		    if(email && !re.test(email)){
	      		    	$("#email").focus().css("border-color","red");
	      		    	mdboss.error("邮箱模式错误!");
	      		    	return;
	      		    }
	      		    var myreg = /^0?1[3|4|5|8][0-9]\d{8}$/;
	      		    if(mobileno && !myreg.test(mobileno)){
	                	  $("#mobileno").focus().css("border-color","red");mdboss.error("手机号码输入错误!");return;
	                 }
	        		 //"roles":roles,
	        		 req={"usercode":mdboss.usercode, "targetusercode":usercode,
		                     "workno": workno,"username": username,"pinyin":pinyin,"avatarcode":avatarcode,"signfilecode":signfilecode,
		                     "userlevel": userlevel, "userrank": userrank,
		                     "address": address,  "userdesc": userdesc, "email": email, extorgcode:extorgcode,
		                     "mobileno": mobileno, "positionlevel": positionlevel, "sex": sex, "orgcode": orgcode};
	        		 
//	        		 req.leader= JSON.stringify( {"code":userleader, "name": _this.$el.find("#leader_man").val() } );
	        		 req.leader= userleader;
	        	 }
	        	 if(tid){
	        		 url =mdboss.api.operateedit;
	        		 req.tid = tid;
	        	 }
	        	 
	        	 var commonModel=new mdboss.Model.commonModel();
				 commonModel.save(req, {url:url,success:function(model,res){
	        		 if(res.rc==1){
	        			 if(tid || _this.rdata.tids){
	        				 mdboss.notifyTips("修改成功！");
	        			 }else{
	        				 mdboss.notifyTips("新增成功！");
	        			 }
	        			 //回调刷新列表
	        			 var callbackFn = typeof callback == "function" ? callback : function () { };
	        			 callbackFn(_this.rdata.pview);
	        			 _this.cancel();
	        		 }else{
	        			 mdboss.error(res.msg);
	        		 }
	        	 },error:function(){
	        		 mdboss.error();
	        	 }});
 	        }
         },
         cancel:function(){
        	 _this=this;
        	 _this.dialog.close();
 		},
     });
     
});