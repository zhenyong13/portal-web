/**
 * Created by jahon on 15/5/10.
 */

define(function (require, exports, module) {
    var mdboss = require("mdboss");
        require("livebg");
       require("util");
        $= require("jquery");
      var md5 =  require("md5");
      require("dialog");
      require("validVal")($);
    
    mdboss.Model.profile = Backbone.Model.extend({
        url: '',
        initialize: function () {
        },
        aboutMe: function () {
            return "";
        }
    });

    mdboss.View.profile = Backbone.View.extend({
        el: '#mainContainer',
        events: {
             'click #check-all':'checkBoxAll',
             'click #updatePwd':'updatePwd',
             'click #employee-update':'employeeUpdate',
        },
        employeeUpdate:function(){//修改用户信息
			var username = $("#employee-username").val();
        	var email = $("#employee-email").val();
        	var mobile = $("#employee-mobile").val();
        	if(username == ""){
        		$("#employee-username").focus().css("border-color","red");
        		$("#employee-username-").html("请输入姓名"); return;
        	}else{
        		$("#employee-username").css("border-color","#66afe9");
        		$("#employee-username-").html("");
        	}
        	
        	if(email == ""){
        		$("#employee-email").focus().css("border-color","red");
        		$("#employee-email-").html("请输入邮箱");return;
        	}else{
        			var  re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        		    if(re.test(email)){
                		$("#employee-email").css("border-color","#66afe9");
                		$("#employee-email-").html("");
        		    }else{
        		    	$("#employee-email").focus().css("border-color","red");
        		    	$("#employee-email-").html("输入邮箱格式有误!");return;
        		    }
        	}
        	
        	if(mobile == ""){
        		$("#employee-mobile").focus().css("border-color","red");
        		$("#employee-mobile-").html("请输入手机号码");return;
        	}else{
        		 var myreg = /^0?1[3|4|5|8][0-9]\d{8}$/;
                if(!myreg.test(mobile))
                {
                    $("#employee-mobile").focus().css("border-color","red");
                    $("#employee-mobile-").html("请输入有效的手机号码！");return;
                }else{
                	$("#employee-mobile").css("border-color","#66afe9");
                	$("#employee-mobile-").html("");
                }
        		
        	}
        	
        	var sex = $("#employee-sex").val();
        	var officephone = $("#employee-telephone").val();
        	var address = $("#employee-address").val();
        	var userdesc = $("#employee-userdesc").val();
    		var commonModel =  new mdboss.Model.commonModel({
    		 "usercode":mdboss.usercode,
  			 "username":username,
			  "sex":sex,
			  "mobileno":mobile,
			  "officephone":officephone,
			  "email":email,
			  "address":address,
			  "userdesc":userdesc});
    		commonModel.save({},
			  {url: mdboss.api.updateUserById, success:function(model, res){
    			if(res.rc == 1){
    				mdboss.notifyTips("修改成功");
    				commonModel.clear();//修改缓存数据 当前用户的信息
    				commonModel.save({"usercode":mdboss.usercode},
    						  {url: mdboss.api.getMyInfo, success:function(model, res){
    			    			if(res.rc == 1){
    			    				mdboss.cache.data["getMyInfo"]=res.data;
    			    			}else{
    			    				mdboss.error(res.msg);
    			    			}
    			    		},error:function(){
    							mdboss.error();
    						}});
    			}else{
    				mdboss.error(res.msg);
    			}
    		},error:function(){
				mdboss.error();
			}});
        
        },
        updatePwd:function(){//修改密码
        	
        	var form_data = $( "#mCSB_7_container" ).triggerHandler( "submitForm" );
	        if ( form_data ) {
	        	//提交
				var oldPwd = $("#employee-oldPwd").val();
	        	var newPwd = $("#employee-newPwd").val();
	        	var confirmPwd = $("#employee-confirmPwd").val();
	        	if(oldPwd == ""){
	        		//$("#employee-oldPwd").focus();
	        		$("#employee-oldPwd").focus().css("border-color","red");
	        		$("#employee-oldPwd-").html("请输入原密码"); return;
	        	}else{
	        		$("#employee-oldPwd").css("border-color","#66afe9");
	        		$("#employee-oldPwd-").html("");
	        	}
	        	
	        	if(newPwd == ""){
	        		$("#employee-newPwd").focus().css("border-color","red");
	        		$("#employee-newPwd-").html("请输入新密码");return;
	        	}else{
	        		$("#employee-newPwd").css("border-color","#66afe9");
	        		$("#employee-newPwd-").html("");
	        	}
	        	
	        	if(confirmPwd == ""){
	        		$("#employee-confirmPwd").focus().css("border-color","red");
	        		$("#employee-confirmPwd-").html("请输入确认密码");return;
	        	}else{
	        		$("#employee-confirmPwd").css("border-color","#66afe9");
	        		$("#employee-confirmPwd-").html("");
	        	}
	        	
	        	if(confirmPwd != newPwd){
	        		$("#employee-confirmPwd").focus().css("border-color","red");
	        		$("#employee-confirmPwd-").html("两次密码不一致");return;
	        	}else{
	        		$("#employee-confirmPwd").css("border-color","#66afe9");
	        		$("#employee-confirmPwd-").html("");
	        	}
	        	
	        	if(newPwd.length <8){
	        		$("#employee-newPwd").focus().css("border-color","red");
	        		$("#employee-newPwd-").html("最小长度为8");return;
	        	}else{
	        		$("#employee-newPwd").css("border-color","#66afe9");
	        		$("#employee-newPwd-").html("");
	        	}
	        	oldPwd = md5.hex($.trim(oldPwd));//
	        	newPwd = md5.hex($.trim(newPwd));//
	        	confirmPwd = md5.hex($.trim(confirmPwd));//
	    		var commonModel =  new mdboss.Model.commonModel();
	    		commonModel.save({"usercode":mdboss.usercode,
	  			  "oldpassword":oldPwd,
				  "newpassword":newPwd,
				  "confirmpassword":confirmPwd},{url: mdboss.api.chgpwd, success:function(model, res){
	    			if(res.rc == 1){
	    				mdboss.notifyTips("密码修改成功");
	    				$("#employee-oldPwd").val("");
	    		        $("#employee-newPwd").val("");
	    		        $("#employee-confirmPwd").val("");
	    			}else{
	    				mdboss.error(res.msg);
	    			}
	    		},error:function(){
					mdboss.error();
				}});
	        }
        },
        
        initialize: function () {
            this.render();
        },
        render: function (context) {
        	 $( "#mCSB_7_container" ).validVal();
        }
    });
    
    
    //页面对应的数据接口{类型:api}
    var dataSourceMap = {
        "my-profile":{"pageid":"profile","name":"个人资料","api":"getMyInfo"},
        "avatar-setting":{"pageid":"avatar","name":"头像设置","api":"getMyInfo"},
        "update-password":{"pageid":"pwdupdate","name":"密码修改","api":"getMyInfo"}
    };

    var profile = function (t) {
        var type=t?t:"my-profile";
        //加载框框
        mdboss.fillWrap(require("text!../../../template/common/wrap.html"));
        var templateMenu = Handlebars.compile(require("text!../../../template/common/aside/profile_aside.html"));
		var htmlMenu= templateMenu({ "type": type });
		$("#leftMenuContainer").html(htmlMenu);
        if(dataSourceMap[type]){
            var dataApi=dataSourceMap[type]["api"];
            var reqData = [  {   "name":dataApi,
                               "post":{
                                   "usercode":mdboss.usercode,//用户编码
                               },
                               "cache":false} ];
            mdboss.getReady({ data: reqData, template: [dataSourceMap[type]["pageid"],"profileAside"] }, function (result, msg) {
            	if (result) {
                    var template = Handlebars.compile(result.template[dataSourceMap[type]["pageid"]]);
                    var html = template({ pageId: dataSourceMap[type]["pageid"],"title":dataSourceMap[type].name, "type": type, "userInfo": result.data[dataApi]});
                    mdboss.fillPage(html);
                    new mdboss.View.profile();
                } else {
                	mdboss.error(msg);
                }
            });
        }else{
        	if(type=="dash-setting"){
        		seajs.use(["dashsetting"],function(){
        			new  mdboss.View.dashSetting();
        		});
        	}
        	
        	if(type=="sidenav-setting"){
        		seajs.use(["sidenavsettting"],function(){
        			new  mdboss.View.sidenavsettting();
        		});
        	}
        }
    };

    module.exports = profile;
});