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
	var $page = mdboss.$pageWrap;
    
	/* 公文提醒 */
	mdboss.Model.processRemind = Backbone.Model.extend({
		url:mdboss.api.remind,
		initialize: function(){  
        },  
        defaults: {  
        	"processinstcode":""
        }
	});

	// 公文提醒
	mdboss.View.processRemind = Backbone.View.extend({
		initialize : function(data) {
			var v_this = this;
			this.x=data.x;
			this.y=data.y;
			$.get("template/page/process/form/remind.html",function(html){
				$("body").append(html);
				
				var commonModel = new mdboss.Model.commonModel();
				commonModel.save({"usercode":mdboss.usercode,"definition":"COMMON_ALARMWAY"},
						{url:mdboss.api.queryProcesstype , success:function(m,res){
							if(res.rc==1){
								var tmp = res.data.rows;
	        					  for(var i =0; i<tmp.length; i++){
	        						  var htm ='<option value="'+tmp[i].dictcode+'">'+tmp[i].dictname+'</option>';
	        						  $("#alarmway").append(htm);
	        					  }
							}else{
								mdboss.error(res.msg);
							}
				},error:function(){
					mdboss.error();
				}});
				//公文提醒
				 //提交
				 $("#remind-submit").click(function() {
					var remindTextarea = $("#remind-textarea").val();//提醒内容 
					if(remindTextarea==""){
						mdboss.notifyTips("请输入提醒内容                      ");return;
					}
					 //其他人
					 var otherMember = new Array();
					$(".entity-item").each(function(){
							otherMember.push($(this).attr("id"));
					});
					if($("#currentmanager").prop("checked")){//当前办理人
						otherMember.push("assignee");
					}
					if($("#allmanager").prop("checked")){//所有办理人
						otherMember.push("processusers");
					}
					if($("#creater").prop("checked")){//创建人
						otherMember.push("sender");
					}
					if(otherMember.length==0){
						mdboss.notifyTips("请选择要提醒的人");return;
					}
					
					var remind = new mdboss.Model.processRemind({
						"usercode":mdboss.usercode,        
						"taskcode":v_this.model.get("taskcode")+"",        
					    "processinstcode":v_this.model.get("processinstcode"),   
					    "msg":remindTextarea,      
					    "tousers":otherMember,
					    "alarmway":$("#alarmway").val()
					});
					remind.save({},{success:function(m,data){
						if(data.rc == "1"){
							mdboss.notifyTips("提醒成功！");
						}else{
							mdboss.error(data.msg);
						}
					},error:function(){
						mdboss.error();
					}});
					 $("#remind-div").remove();
				 });//end 提交
				 
				 //
				 $("#remind-cancle").click(function() {
					 $("#remind-div").remove();
				 });//end  取消
				 
				//选 人处理-----------------------------------------------------------------------------------------
				 $(".control-input").bind("keypress",function(e){
					 console.log(e.which);
					 if(e.which == 13){
						 v_this.search();
					 }
				 });
				 //添加 ---搜索
				 $(".control-btn, .typeahead-search").click(function(e) {
					 v_this.search();
				 });//end /
					//选 人处理-----------------------------------------------------------------------------------------
			});//end $.get
		},
		events:{
		},
		search:function(){

			$(".typeahead-wrapper").removeClass("hide");
			$(".loading_small").show();
			$("#searchList").empty();
			var commonModel=new mdboss.Model.commonModel();
	   		commonModel.save( {
	            	"usercode":mdboss.usercode, "pageNo":1,  "pageSize":10,  "queryCondition": // 查询条件
	                [
	                   {"key":"username","operate":"Like","v1":$(".control-input").val()} //用户名称
	                ],  "orderBy":"pinyin",  "keyword":""       //搜索字段
	            },{url: mdboss.api.members,success:function(model,data){
	            	if(data.rc == 1){


		            	$(".loading_small").hide();
		            	var html ="";
		            	var tmp =  data.data.rows;
		            	for(var i=0; i<tmp.length; i++){
		            		var avatar =tmp[i].avatarcode;
		            		if(avatar){
		            			avatar=baseConfig.base+"download?filecode="+avatar;
		            		}else{
		            			avatar = "images/avatar.png";
		            		}
		            		 html += '<p class="employee" id="'+tmp[i].usercode+'" name="'+tmp[i].username+'"><img class="avatar" src="'+avatar+'"><span>'+tmp[i].username+'</span></p>';
		            	}
		            	$("#searchList").append(html);
		            	
		            	$(".employee").click(function(){
		            		var id  = $(this).attr("id");
		            		var name  = $(this).attr("name");
		            		var tm = '<span id="'+id+'" class="entity-item"><a data-value="'+id+'">'+name+'</a><button type="button" class="close hide" title="删除">×</button>&nbsp;</span>';
		            		var flag = true;
		            		$("#remindlist span").each(function(i){
		            			var usercode = $(this).attr("id");
		            			if(id == usercode){
		            				flag = false;
		            				return;
		            			}
		            		});
		            		if(flag)
		            			$("#remindlist").append(tm);	
		            		
		            		//显示删除按钮
			   				 $(".entity-item").mouseover(function(e) {
			   					 $(this).find("button").removeClass("hide");
			   				 }).mouseout(function(){
			   					 $(this).find("button").addClass("hide");
			   				 });//end //显示删除按钮
			   				 
			   				//删除
			   				 $(".close").click(function(e) {
			   					 $(this).parent("span").remove();
			   				 });//end //删除
			   				$(".control-input").val("");
			   				$(".typeahead-wrapper").addClass("hide");
		            	});
	            	}else{
	            		mdboss.error(data.msg);
	            	}
	            },error:function(){
					mdboss.error();
				}});
		}
	});
});