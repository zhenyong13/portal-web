/**
 * Created by jahon on 15/5/10.
 */

define(function (require, exports, module) {
	var mdboss = require("mdboss");
    var $= require('jquery');
    Util = require('util');
//    require("tree")($);
//	require("tree_excheck")($);

    mdboss.module.profile = function () {};
    mdboss.cache.member = {tempaltes: {}};

    mdboss.Model.member = Backbone.Model.extend({
        url: mdboss.api.members,
        //initialize: function () {
        //    // _.bindAll(this, 'getusers');
        //    console.log('model initialize')
        //},
        getTemplate: function (name) {
            return $.get(mdboss.template[name]);
        },
        getusers: function (req) {
            return this.save( {url: mdboss.api.members, reset: true});
        },
        getUserInfo: function (req) {
        	
        	var usercode = req.usercode;
            var fetchList = [];
//            fetchList.push(this.fetch({url: mdboss.api.userInfo, reset: true}));
//        	console.log("usre info="+fetchList[0]);
//        	
//        	if (!mdboss.cache.member.tempaltes['userInfo']) {
//        		fetchList.push(this.getTemplate('userInfo'));
//        	}
//        	return $.when.apply($, fetchList);
            //TODO
            var commonModel=new mdboss.Model.commonModel();
            commonModel.save({},{url:mdboss.api.userInfo+usercode, success:function(m, data){
            	if(data.rc==1){
            		if (!mdboss.cache.member.tempaltes['userInfo']) {
                		fetchList.push(this.getTemplate('userInfo'));
                	}
                	return $.when.apply($, fetchList);
            	}else{
            		mdboss.error(data.msg);
            	}
            	
            },error:function(){
    			mdboss.error( );
    		}});
        }
    });
    
    
    /* 人员选择 */
	mdboss.Model.selectM = Backbone.Model.extend({
		initialize: function(){
        },
		defaults: {
			id:"",
            username:'',
            usercode: '',
            firstchar: '',
            email: '',
            mtype:''//成员类型 d部门成员 r角色成员 p项目成员 g 群组成员 o其他
        }
	});	
    
    /* 缓存查回来的所有成员 */
	mdboss.Collection.memberAll = Backbone.Collection.extend({
		model:mdboss.Model.selectM,
		initialize : function(){
			this.on('reset',function(){
			});
		},
		comparator: 'id'
	});
	
	
	var membersAll =new mdboss.Collection.memberAll();
	    
    //人员视图
    mdboss.View.member = Backbone.View.extend({
        el: '#mainContainer',
        events: {
            'click .tab': 'switchGroup',
            'click .dept-grouplist-add': 'showGroupAdd',
            'click .js_group_submit': 'hideGroupAdd',//创建群组
            'click .js_group_cancel': 'cancelGroupAdd',//取消创建群组
            "click .highlight":"searchMemberByPingyin",
            "click .add-group-member":"toAddGroupMember",//获限可添加到群组的用户
            "click .show-group-member":"renderGroupUser",//编辑群组用户
            "click input[name=userids]":"addUsersToGroup",//添加用户到群组
            "click #checkAll":"addAllUsersToGroup",//添加用户到群组
            'click .employee-list li': 'renderUserInfo',
        },
        addAllUsersToGroup:function(e){//添加用户到群组
        	//TODO
        //	e.preventDefault();
         	var $this  = $(e.currentTarget);
         	
         	if( $this.prop("checked") ){//添加所有
         		$("input[name=userids]").prop("checked", true);
         		$("input[name=userids]").each(function(){
         			var usercode = $(this).attr("uc");
                 	var username = $(this).val();
         		});
         	}else{//移除 所有
         		$("input[name=userids]").prop("checked", false);
         	}
        },
        addUsersToGroup:function(e){//添加用户到群组
        	//TODO
        	var $this  = $(e.currentTarget);
//        	console.log( $this.prop("checked") );
        	var usercode = $this.attr("uc");
        	var username = $this.val();
        	if( $this.prop("checked") ){//添加
        		//$this.prop("checked", true);
        	}else{//移除
        		//$this.prop("checked", false);
        		//$this.attr("checked", false);
        	}
        	
        	var allSel = true;
			$("input[name=userids]").each(function(){
				if(!$(this).prop("checked")){
					allSel = false;
					return;
				}
			});
			if(allSel){
				$("#checkAll").prop("checked", true);
			}else{
				$("#checkAll").prop("checked", false);
			}
        },
        renderGroupUser:function(e){//查询群组用户
        	 e.preventDefault();
        	var $this  = $(e.currentTarget);
        	var groupcode = $this.attr("groupcode");
        	var treenode = {"propId":"groupcode","id":groupcode};
        	this.renderUsers(treenode);
        },
        renderGroupSelectUsers: function (groupcode) {//选中在群中的用户
            var condition = new Array();
        	condition.push({"key":"groupcode","operate":"EqualTo","v1":groupcode} );
            var commonModel=new mdboss.Model.commonModel();
        	commonModel.save({"usercode":mdboss.usercode, "pageNo":1, pageSize:200,queryCondition:condition}, 
        			{url:mdboss.api.members,success:function (model, data) {
            	
        		if(data.rc == 1){
	        		var tmp = data.data.rows;
	    			for(var i=0; i<tmp.length; i++){
	    				$("input[name=userids][id="+tmp[i].id+"]").prop("checked","true");
	    			}
	    			
	    			var allSel = true;
	    			$("input[name=userids]").each(function(){
	    				if(!$(this).prop("checked")){
	    					allSel = false;
	    					return;
	    				}
	    			});
	    			if(allSel){
	    				$("#checkAll").prop("checked", true);
	    			}
	    			
        		}else{
        			mdboss.error(data.msg);
        		}
            },error:function(){
    			mdboss.error( );
    		}});
        },
        toAddGroupMember:function(e){//到添加群组的人员选择页面
        	var $this  = $(e.currentTarget);
        	$("#showHide").val("true");
        	$("#group-user-checkall").removeClass("hide");
        	$("#group-user-info").removeClass("hide");
        	$("#org-user-info").addClass("hide");
        	
        	var groupcode = $this.attr("groupcode");
        	$("#group-id").val(groupcode);
        	$("#group-name").val($this.attr("groupname"));
        	this.renderUsers();
        	// 选中在群中的用户
        	this.renderGroupSelectUsers(groupcode);
        },
        searchMemberByPingyin:function(e){//按拼音搜索
        	$("#checkAll").prop("checked", false);
        	var $this  = $(e.currentTarget);
			$(".users-list-pinyin .highlight").each(function(){
				$(this).removeClass("active");
			});
			
			$this.addClass("active");
			var pingyin = $this.attr("id");
			$('.employee-list').empty();
			$('.center-more').addClass("hide");
			var hide= 'style=display:none';
			if( $("#showHide").val() == "true" ){
				hide ="";
			}
			var htmlTemplate = require("text!../../../template/page/member/user.html");
			membersAll.each(function(m){
				var id = m.get("id");
				var avatar = m.get("avatar");
				var usercode = m.get("usercode");
				var username = m.get("username");
				var email = m.get("email");
				var userrank = m.get("userrank");
				var mobileno = m.get("mobileno");
				var orgname = m.get("orgname");
				if(avatar != undefined && avatar !=""){
					avatar = baseConfig.base+"download?filecode="+avatar;
				}else{
					avatar = "images/avatar.png";
				}
				var firstchar = m.get("firstchar");
				if(pingyin == firstchar || pingyin=="ALL"){
                    var template = Handlebars.compile(htmlTemplate);
        			$('.employee-list').append(template({"id":id,"avatar":avatar,"username":username,"usercode":usercode,"email":email,
        				"userrank":userrank, "mobileno":mobileno,"orgname":orgname,"hide":hide	
        			}));
				}
			});//end 按拼音过滤
        },
        showGroupAdd:function(){
        	$(".dept-grouplist-add").hide();
        	$("#group-input-text").focus().show();
        	$("#group-input-btn").show();
        },
        cancelGroupAdd:function(){//取消创建群组
        	$(".dept-grouplist-add").show();
        	$("#group-input-text").hide();
        	$("#group-input-btn").hide();
        },
        hideGroupAdd:function(){//创建群组
        	var v_this = this;
        	$(".dept-grouplist-add").show();
        	$("#group-input-text").hide();
        	$("#group-input-btn").hide();
        	
        	if($("#group-input-text").val() != ""){
        		var users = new Array();
    			var createGroup = new mdboss.Model.commonModel({
    				"groupname":$("#group-input-text").val(),   //用户组名称
    				"usercode":mdboss.usercode, "members":users,  "groupdesc":""
    			});
    			createGroup.save({},{url:mdboss.api.createusergroups,success:function(m, data){
    				if(data.rc == "1"){
    					mdboss.notifyTips("创建成功");
    					$("#group-input-text").val("");
    					v_this.renderGroups();
    				}else{
    					
    					
    					
    					mdboss.error(data.msg);
    				}
    			},error:function(){
    				mdboss.error( );
    			}});
        	}//end if 
        },
        initialize: function () {
            _.bindAll(this, 'switchGroup', 'createGroup', 'renderUsers', 'filterUser', 'render');
            this.usershtmlTemplate = require("text!template/page/member/users.html");
            this.pageNo = 1;
            this.render();
        },
        render: function (context) {
            this.renderOrgs();
            this.renderGroups();
        },
        renderGroups:function(){//渲染群组
        	var commonModel=new mdboss.Model.commonModel();
        	commonModel.save({"usercode":mdboss.usercode, "pageNo":1, pageSize:200}, {url:mdboss.api.usergroups,success:function(m,data) {
	            if(data.rc==1){
	            	var template = Handlebars.compile(require("text!../../../template/page/member/group-list.html"));
					 var html = template({"usergroups":data.data.rows}) ;
	                $('#group-list-ul').html(html);
	            }else{
	            	mdboss.error(data.msg);
	            }
            },error:function(){
				mdboss.error( );
			}});
        },
        renderOrgs:function(){//渲染强织结构
        	var v_this = this;
        	var commonModel=new mdboss.Model.commonModel();
        	commonModel.save({"usercode":mdboss.usercode, "type":"all", "pageNo":1,"pageSize":0},
        			{url:mdboss.api.orgs,success:function(model,data) {
        		if(data.rc==1){
	        			// 添加树结构
	   	   			 var setting = {
	                    			data: { simpleData: { enable: true } },
	                    			callback:{  beforeClick:function(treeId,treeNode) { v_this.renderUsers(treeNode);} }
	                    		};
	      			 
	                   var zNodes=new Array();
	               	$.each(data.data.rows,function(index,item){
	               		zNodes.push({"id":item["orgcode"],"pId":item["parentcode"],"name":item["orgname"],"propId":"orgcode"});
	               		if(index == 0){
	               			v_this.renderUsers({"id":item["orgcode"],"pId":item["parentcode"],"name":item["orgname"],"propId":"orgcode"});
	               		}
	               	});
	                  $.fn.zTree.init($("#org-tree-ul-list"), setting, zNodes);
        		}else{
        			mdboss.error(data.msg);
        		}
	    		
            },error:function(){
            	mdboss.error( );
            }});
        },
        /**
         * 渲染用户列表
         * @param e
         */
        renderUsers: function (treenode) {
        	$("#memberLoading").show();
        	var v_this = this;
            membersAll.reset();
            v_this.pageNo = 1;
            $('.employee-list').empty();
            $(".users-list-pinyin .highlight").each(function(){
				$(this).removeClass("active");
			});
            var condition = new Array();
            console.log(treenode);
            if(treenode != undefined){
            	$("#showHide").val("false");
            	$("#group-user-checkall").addClass("hide");
            	$("#group-user-info").addClass("hide");
            	$("#org-user-info").addClass("hide");
            	condition.push({"key":treenode.propId,"operate":"EqualTo","v1":treenode.id } );
            }
//            this.model.getusers({"usercode":mdboss.usercode, "pageNo":1, pageSize:0,queryCondition:condition}).then(function (data) {
            var commonModel=new mdboss.Model.commonModel();
            var hide = $("#showHide").val();
            var hideStyle="";
            if(hide == "false"){
            	hideStyle= 'style=display:none';
            }
        	commonModel.save({"usercode":mdboss.usercode, "pageNo":v_this.pageNo, pageSize:200,queryCondition:condition}, {url:mdboss.api.members,success:function (model, data) {
        		$("#memberLoading").hide();
        		if(data.rc==1){
                	var tmp = data.data.rows;
        			for(var i=0;i< tmp.length; i++){
        				$("#"+tmp[i].firstchar).addClass("highlight");
        				var m = new mdboss.Model.selectM ({
    						id:tmp[i].id, username:tmp[i].username, usercode: tmp[i].usercode,email:tmp[i].email,
    			            firstchar: tmp[i].firstchar,  userrank:tmp[i].userrank,orgname:tmp[i].orgname,
    			            mobileno:tmp[i].mobileno,avatar:tmp[i].avatarcode
    					});
    					membersAll.add(m);
        			}
        			 var template = Handlebars.compile(v_this.usershtmlTemplate);
        			$('.employee-list').append(template({"userList":data.data.rows,"hide":hideStyle}));
        			if(tmp.length == 0 ){
        				$('.employee-list').append('<div class="center-more">暂无数据...</div>');
        			}
        			if(tmp.length==200)
        				v_this.loadNextUsers(treenode);
        		}else{
        			mdboss.error(data.msg);
        		}
        	},error:function(){
            	mdboss.error( );
            }});
        },
        loadNextUsers:function(treenode){//加载剩下的用户信息
        	var v_this = this;
            v_this.pageNo = v_this.pageNo+1;
            var condition = new Array();
            if(treenode != undefined){
            	$("#showHide").val("false");
            	$("#group-user-checkall").addClass("hide");
            	$("#group-user-info").addClass("hide");
            	$("#org-user-info").addClass("hide");
            	condition.push({"key":treenode.propId,"operate":"EqualTo","v1":treenode.id});
            }
            var commonModel=new mdboss.Model.commonModel();
            var hide = $("#showHide").val();
            var hideStyle="";
            if(hide == "false"){
            	hideStyle= 'style=display:none';
            }
        	commonModel.save({"usercode":mdboss.usercode, "pageNo":v_this.pageNo, pageSize:200,queryCondition:condition}, 
        			{url:mdboss.api.members,success:function (model, data) {
        		if(data.rc==1){
                	var tmp = data.data.rows;
        			for(var i=0;i< tmp.length; i++){
        				$("#"+tmp[i].firstchar).addClass("highlight");
        				var m = new mdboss.Model.selectM ({
    						id:tmp[i].id, username:tmp[i].username, usercode: tmp[i].usercode,email:tmp[i].email,
    			            firstchar: tmp[i].firstchar,  userrank:tmp[i].userrank,orgname:tmp[i].orgname,
    			            mobileno:tmp[i].mobileno,avatar:tmp[i].avatarcode
    					});
    					membersAll.add(m);
        			}
        			var template = Handlebars.compile(v_this.usershtmlTemplate);
        			$('.employee-list').append(template({"userList":data.data.rows,"hide":hideStyle}));
        			if(tmp.length == 200 ){
        				v_this.loadNextUsers(treenode);
        			}
        		}else{
        			mdboss.error(data.msg);
        		}
        	},error:function(){
            	mdboss.error( );
            }});
        },//加载剩下的用户信息
        /**
         * 渲染用户信息
         */
        renderUserInfo: function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var $this  = $(e.currentTarget);
            var _this = this;
            var usercode = $this.attr("uc");
 
            //------------------------------------------
            var commonModel=new mdboss.Model.commonModel();//
            commonModel.save({"usercode":usercode},{url:mdboss.api.getUserInfo , success:function(m, data){
            	if(data.rc==1){
                    var template = Handlebars.compile(require("text!template/page/member/userinfo.html"));
                    $('#entitySlider').html(template(data.data)).addClass('animate-toggleR');
                    
                    $('#btn-close').off('click').on('click', function () { _this.closeUserInfo();});
                  
            	}else{
            		mdboss.error(data.msg);	
            	}
            },error:function(){
            	mdboss.error( );
            }});
        },

        /**
         * 关闭用户信息窗口
         */
        closeUserInfo: function () {
            $('#entitySlider').removeClass('animate-toggleR');
        },
        /**
         * 切换【部门】、【群组】
         * @param e
         */
        switchGroup: function (e) {
            e.preventDefault();
            //切换群组
            var $this  = $(e.currentTarget),
            $panel = $('#' + $this.data('tab'));
            $this.addClass('active').siblings().removeClass('active');
            $panel.removeClass('hide').siblings().addClass('hide');
        } ,
        /**
         * 创建群组
         * @param e
         */
        createGroup: function (e) {

        },

        /**
         * 筛选用户
         * @param e
         */
        filterUser: function (e) {

        }
    });//end view 
    
    var memberorg = function (t) {
	    mdboss.getReady({data: [], template: ["userList"]}, function (result) {
	    	mdboss.fillWrap(require("text!../../../template/common/wrap_.html"));
//	    	var template = Handlebars.compile(result.template["userList"]);
//	        var html = template(result.data['members']);
	    	var html = result.template["userList"];
	
	        mdboss.fillPage(html);
	
	        var m = new mdboss.Model.member();
	        var v = new mdboss.View.member({model: m});
	        //var v2 = new mdboss.View.memberUserInfo({model: m});
	
	    });
    };
    module.exports = memberorg;
});