/**
 * 补签 申请
 */
define(function (require, exports, module) {
	
	var $ = require("jquery");
	require("bootstrap")($);
	require("datetimepicker");
	Dialog = require("dialog");
	require("fullcalendar");  
	require("select2");
	require("validVal")($);
    //申请补签
    mdboss.Model.applycheckexact = Backbone.Model.extend({
    	url: mdboss.api.applycheckexact    
    });    
    
    //补签视图 
    mdboss.View.applyattach = Backbone.View.extend({
        events: {
        	'click .js_search_dept':'selected_dept',//选择部门
        	"click .js_commonradio":'companyinside',//地址类型
        	
        	"click .btn-primary":'submitAttachSign',//提交签到申请
        	"click .btn-cancel":'cancelAttachSign',//取消签到申请
        	'change #checkaddress':'otherAddress'//显示其它签到地点
        },
        companyinside:function(e){
        	var s_this = this;
        	 var $this  = $(e.currentTarget).closest("li").find("input");
        	 if($this.val() == "countryinside"){//国内
        		 s_this.$el.find("#signCity_div").show();
        		 s_this.$el.find("#signDept_div").hide();
        		 s_this.$el.find("#othercheckexactaddress_").show();
        		 
        	 }else if($this.val() == "abroad"){//国外
        		 s_this.$el.find("#signCity_div").hide();
        		 s_this.$el.find("#signDept_div").hide();
        		 s_this.$el.find("#othercheckexactaddress_").show();
        		 
        	 }else{//公司内部
        		 s_this.$el.find("#signCity_div").hide();
        		 s_this.$el.find("#othercheckexactaddress_").hide();
        		 s_this.$el.find("#signDept_div").show();
        		 
        	 }
        },
        selected_dept:function(e){
       	 _this=this;
       	 var dept_arr=new Array();
	        seajs.use("orgs", function () {
	        	if(_this.$el.find("#parentcode").val() != ""){
	        		dept_arr.push(_this.$el.find("#parentcode").val());
	        	}
	        	new mdboss.View.orgsView({dept:dept_arr,parent:_this.$el,"selectOnly":true,"queryCondition":true,
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
        otherAddress:function(e){
        	_this=this;
        	var address=$(e.currentTarget).val();
        	if(address==""){
				 $("#othercheckexactaddress_").show();
			 }else{
				 $("#othercheckexactaddress_").hide();
				 $("#othercheckexactaddress").val("");
			 }
        	$(_this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
        },
        initialize: function (data) {
    		this.dept= data.dept;
    		this.usercode=data.usercode;
    		this.workno=data.workno;
    		this.username=data.username;
    		this.depname=data.depname;
    		this.orgcode=data.depcode;
    		this.callbacks=data.callbacks;
    		this.$currentDay=data.$currentDay;
            this.render();
        },
        cancelAttachSign:function(){//取消
        	this.dialog.close();
        },
        submitAttachSign:function(){//提交申请补签
        	_this=this;
        	var form_data = $( ".fill_det_all" ).triggerHandler( "submitForm" );
	        if ( form_data ) {
		    	 
	        	var addresstype = "";
	        	_this.$el.find("input[name='addresstype']:checked").each(function(i,item){
	        		addresstype = $(item).val();
	        	});
	        	
	        	var reqData = {
			    	    "usercode": _this.usercode, 
			    	    "username": _this.username, 
			    	    "orgcode": _this.orgcode, 
			    	    "orgname": _this.depname, 
			    	    "signindate": $("#sign_time").val(), 
			    	    "addresstype": addresstype, 
			    	    "reason": $("#sign_reson").val()
			    	};
	        	
	        	if(addresstype == "countryinside"){//国内
	        		reqData.resignincitycode = _this.$el.find("#resignincityname").val();
	        		reqData.resignincityname = _this.$el.find("#resignincityname").text(); 
	        	}
	        	if(addresstype == "companyinside"){//公司内部
	        		reqData.resigninorgcode= _this.$el.find("#parentcode").val();
	        		reqData.resigninorgname = _this.$el.find("#parentname").val(); 
	        	}else{
	        		reqData.otherplace =  _this.$el.find("#othercheckexactaddress").val();
	        	}
	        	
		    	var apply = new mdboss.Model.applycheckexact(reqData);
		    	apply.save({},{success:function(m, data){
		    		if(data.rc == 1){
		    			mdboss.notifyTips("申请补签成功！");
		    			var callback = _this.callbacks;
		    		    if(callback){
		    		    	var callbackFn = typeof callback == "function" ? callback : function () { };
		    		    	callbackFn();
		    		    }else{
		    		    	$('#calendar').fullCalendar('refetchEvents');
		    		    }
		    			_this.dialog.close();
		    		}else{
		    			mdboss.error("申请补签失败！");
		    		}
		    	},error:function(){
		    		mdboss.error( );
		    	}});
	        }
        },
        render: function () {
        	//补签申请
        	var v_this = this;
        	this.dialog = new Dialog({
				type : "html", value : '<div class="loading"></div>',
				fillCallback : function() {
					$(this).find(".scrollwrapper").jScrollPane();
				}
			}, {
				"title" : "补签申请", "width" : "600px", "height" : "320px","icon" : "iconfont icon-mdliucheng",
				"resize" : function() {
					$(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
				}
			}).show(function(){//
				 var template = Handlebars.compile(require("text!template/page/attendance/attach_sign.html"));
				 var html = template({"usercode":v_this.usercode,"workno":v_this.workno,"username":v_this.username,"depname":v_this.depname});
				 $(html).appendTo($(this.dialog).find(".dialog-content")).fadeIn();
				 $(this.dialog).find(".dialog-content-wrap").attr("style","");
				 $(this.dialog).find(".loading").removeClass("loading");
				 
				 mdboss.dataselect(v_this, "resignincityname", "HR_RESIDENTADDRESS","");
				 
				 $("#sign_time").datetimepicker({
					 	minView: 2,
		                format: 'yyyy-mm-dd',
		                autoclose: true,
		                language: 'zh-CN',
		                fontAwesome:true
		         });
				 
				 $( ".fill_det_all" ).validVal();
			});
        	this.$el = this.dialog.$html;
        }
    });

});