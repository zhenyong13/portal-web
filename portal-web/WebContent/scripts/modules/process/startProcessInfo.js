/**
 * Created by 2goyoung on 2015/5/11.
 */


define(function (require, exports, module) {
    var $ = require("jquery");
    require("bootstrap")($);
    require("upload");
    require("select2");
    require("backbone");
    require("scroll");
    require("fileinput");
    require("datetimepicker");
    require("bootbox");
    var Dialog=require("dialog");
    require("validVal")($);
    var mdboss = require("mdboss");
    require("fullcalendar");
    require("notify")($);
    require("dynamicform");
    require("jqueryui");
    Backbone.emulateJSON = true;
    
    mdboss.View.startProcess=Backbone.View.extend({
    	_this:this,
    	initialize:function(options){
            //加载模版url及下一环节数据
        	this.id=options.id;//流程编码ID
        	this.processdefLoad=options.model;
        	this.$el=options.$el;
        	this.dialog=options.dialog;
        	this.taskcode="";
        	this.taskname="";
        	this.processinstcode=options.id;//流程编码ID
        	this.maindoc=[];
        	this.attaches=[];
        	this.nextstep="";
        	this.nextuser=[];
        	this.sendrelatedep=[];
        	this.selectpersonconfig={};
        	this.memoinfo=[];
        	this.filemapping;
        	this.taskPersons={};
        	this.dynamicdata={};
//        	this.submitFlag = ;//判断表单是否直接提交
    	},
    	render:function(){
    		r_this=this;
    		 var processLoadData;
             var _thisDialog=this.$el;
             this.processdefLoad.save({processcode:r_this.id,usercode:mdboss.usercode},{success:function(model,response){
            	 if(response.rc == 1){
            	 processLoadData=response;
             	if(processLoadData.data.candidatesteps){
             		$(processLoadData.data.candidatesteps).each(function(index,item){
                 		r_this.nextstep=item.transition;
                 	});
             	}
             
             	r_this.candidatesteps=processLoadData.data.candidatesteps;
             	var reqdata=new Array();
             	if(processLoadData.data.showtimeline==undefined){
             		processLoadData.data.showtimeline=true;
             	}
            	if(processLoadData.data.showtimeline){
            		reqdata.push( {"name":"querydoctimeline","post":{
                      	"usercode":mdboss.usercode,         //当前用户标识
                      	"taskcode":"",      //当前环节名称(值为空，是启动环节)
                          "processinstcode":r_this.id,       //流程实例ID（值为空，是启动环节）
                      }});
            	}
            	reqdata.push({"name":"querycommonopinion","post":{
                	"usercode":mdboss.usercode,//当前用户标识
                }});
             	
            	//判断请求模版url
            	var formUrl = processLoadData.data.formurl ; 
            	if("assessmentform" == formUrl || "performanceform"==formUrl){
            		formUrl = "receiveform";
            	}
            	
             	 mdboss.getReady({data:reqdata,template:[formUrl]},function(result,msg){
                      if(result) {
                     	 $content=_thisDialog.find(".dialog-content");
                     	 var $loading=_thisDialog.find(".loading").length?_thisDialog.find(".loading"):$('<div class="loading"></div>').appendTo($content);
                          var commonoption=result.data["querycommonopinion"];
                          var commons=new Array();
                          $.each(commonoption.rows,function(index,item){
                        	  if(index<4){
                        		  var content=item.content;
                        		  commons.push({"title":content.length>3?content.substr(0,3)+"...":content,"content":content});
                        	  }
                          });
                          var processdefLoad=processLoadData;
                          if(processdefLoad.data.candidatesteps){//环节配置
                        	  $.each(processdefLoad.data.candidatesteps,function(index,item){
                        		  r_this.selectpersonconfig=item.selectpersonconfig;
                        	  });
                          }
                         
                          var personProcess={};
                          if(processLoadData.data.showtimeline){
                        	  personProcess=result.data["querydoctimeline"];
                               $.each(personProcess.rows,function(index,item){
                             	  r_this.taskPersons[item.taskcode]=item;
                               });
                          }
                       
                          var date=new Date();
                          var current_date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                          //TODO
                          var template = Handlebars.compile(result.template[formUrl]);
                          var random=Math.floor(Math.random() * ( 100 + 1));
                          var html = template({pageId:r_this.id+random,"myinfo":mdboss.cache.data["getMyInfo"],"taskName":name,commonoption:commons,persons:personProcess,
                        	  showtimeline:processLoadData.data.showtimeline,
                        	  processdefLoad:processdefLoad,currentdate:current_date,baseUrl:baseConfig.avatar_url,"processcode":r_this.id});
                          $(html).appendTo($content);
                          r_this.$el.find( ".processform" ).validVal();
                          $content.find(".add_num_template").hide();
                          $loading.hide();
                          seajs.use("buttons", function () {
                      		 var buttonsView=new mdboss.View.buttonsView({content:$content,processInfo:processdefLoad,processinstcode:r_this.id});
                      		 buttonsView.render();
                           });
                          r_this.orginformdata=jQuery.extend(true,{}, processLoadData.data.formdata);//复制一份在精简模式时使用
                          r_this.printformdata=processLoadData.data.printformdata;
                          r_this.formurl=processLoadData.data.formurl;
                          r_this.processLoadData=processLoadData;
                          r_this.commonoption=commons;
                          seajs.use("dynamicform", function (getdynamicView) {
                        	  r_this.dynamicView=getdynamicView({el:$content,processLoadData:processLoadData,formdata:processLoadData.data.formdata,commonoption:commons,dynamicdata:r_this.dynamicdata,isprint:false,"special":r_this.formurl});
                          });
                          $content.addClass("active").fadeIn();
                          
                          //TODO 判断下一环节的节点数,如果只有一个的时候默认选中
                          if(processdefLoad.data.candidatesteps && processdefLoad.data.candidatesteps.length ==1){
                        	  
                        	  r_this.$el.find("input[name=transition]:first-child").prop("checked", true);
                        	  r_this.$el.find("input[name=transition]:first-child").closest("li").find("span").removeClass("next-step-unchecked").addClass("next-step-checked");
                        	  //下一处理人,只有一个人的时候
                        	  if(processdefLoad.data.candidatesteps[0].handleinfo && processdefLoad.data.candidatesteps[0].handleinfo.nextuser && processdefLoad.data.candidatesteps[0].handleinfo.nextuser.length==1){
                        		  r_this.$el.find(".js_next_user").closest(".js-nexthandlerdiv").hide();
                        		  r_this.rendernextuser(processdefLoad.data.candidatesteps[0].handleinfo.nextuser);
                        	  }
                        	  
                        	  
                        	  //当下环节仅有结束时,屏蔽选择下一处理人
                        	  if(r_this.$el.find(".js_step_sel").length==1&&$.trim(r_this.$el.find(".js_step_sel").text())=="结束"){
                        		  r_this.$el.find(".js_next_user").closest(".js-nexthandlerdiv").hide();
                        	  }
                          }
                          //判断是否有 submit 按钮 有则不验证 opinion
                          if(processdefLoad.data.buttons){
                        	  $.each(processdefLoad.data.buttons, function(i, item){
                        		  if(item == "submit"){
                        			  r_this.$el.find("#read_opinion").show();
                        			  r_this.$el.find("#common_opinion").hide();
//                        			  r_this.issubmit = true;
                        			  return false;
                        		  }
                        	  });
                          }
                          //resize
//                          r_this.$el.find(".dialog-inner").parent().resizable({
//                          	handles:'e'
//                          });
                      }
                      else{
                    	  mdboss.error(msg);
                      }
                  });
             }else{
            		 mdboss.error(response.msg);
            	 }
             },error:function(){
					mdboss.error();
				}});
    	},
    	 events: {
             "click .js_search_dept":"selected_dept",
             "change .js_file_upload":"file_upload",
             "change .js_attach_upload":"attach_upload",
             "change .js_sunxu":"change_sunxu",
             "click .js_next_user":"set_next_user",
             "click .js_addNum":"addNum",
             "click .addmeno":"addmeno",
             "click #form-describe-add":"updateMeno",//修改便签
             "click #delete-meno":"deleteMeno",//修改便签
             "blur #processMeno2":"changeMeno",//修改便签
             "mouseover .forms-body-wrap ul.people-list li img":"personProcess",
             "click .forms-body-wrap ul.people-list li img":"personClickProcess",
             "mouseleave .forms-body-wrap ul.people-list li img":"closePersonDialog",
             "click .js_send":"send",
             "click .js_submit":"submit",
             "click .js_save":"save",
             "click .js_diagram":"diagram",
             "click .js_more_normal":"more_normal",
             "click .js_span_common":"set_optionion",
             "click .js_urgency":"set_urgency",
             "click .js_secret":"set_secret",
             "click .js_step_sel":"step_sel",
             "click .js_close_dept":"del_selected_dept",
             "click .form-category-hd":"form_slideToggle",
             "click .js_del_file":"del_file",
             "click .js_del_attach":"del_attach",
             "change #opinion":"changeOpinion",
             "click .changeModel a":"changeModel",
             "click .js-slide-form":"slide_form",
             
             "mouseenter .hoverTips":"TipsBox",
         	 "mouseout .hoverTips":"TipsBoxHidden"
         },
         TipsBox:function(e){
     		var con=$(e.currentTarget).attr("tips");
     		var TipsBox=$("#TipsBox");
     		var nn=$(e.currentTarget).closest(".jspContainer").offset().top+33;
     		var topNum=$(e.currentTarget).offset().top-nn;
     		console.log(topNum);
     		TipsBox.find("span").html(con)
     		TipsBox.css("top",topNum+"px").fadeIn();
     	},
     	TipsBoxHidden:function(e){
     		$("#TipsBox").fadeOut();
     	},
         closePersonDialog:function(e){
         	e.stopPropagation();
         	this.dialog_person.close();
         },
         personClickProcess:function(e){//TODO
         	var _this=this;
         	var taskcode=$(e.currentTarget).parent().attr("stepcode");
         	seajs.use("queryprocesspart", function () {
        		 var view=new mdboss.View.processPart({data:_this.taskPersons[taskcode],
        			 processinstcode:_this.processinstcode,taskcode:_this.taskcode,targettaskcode:taskcode,layer:true});
        	 });
         },
         slide_form:function(e){
        	 var current=$(e.currentTarget);
         	if(current.hasClass("fa-angle-double-down")){
         		current.removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
         	}else if(current.hasClass("fa-angle-double-up")){
         		current.removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
         	}
         	current.parent().next().slideToggle(1000);
         },
         changeModel:function(e){
        	var init_this=this;
         	var formsbody=init_this.$el.find(".forms-body-wrap");
        	var cur_obj=$(e.currentTarget);
        	var model=cur_obj.data("model");
        	var issimple=false;
        	var formdata;
        	var processLoadData;
        	var commonoption;
        	if(model==1){
        		issimple=true;
        		cur_obj.addClass("active");
        		cur_obj.next().removeClass("active");
        		formsbody.find(".timeline").hide();
        		formdata=jQuery.extend(true,{}, init_this.printformdata);//复制一份在精简模式时使用
        	}else{
        		cur_obj.addClass("active");
        		cur_obj.prev().removeClass("active");
        		formdata=jQuery.extend(true,{}, init_this.orginformdata);//复制一份在普通模式时使用
        		formsbody.find(".timeline").show();
        		formsbody.find(".timeline").find(".jspContainer").css("width","149px");
        	}
         	formsbody.find(".dynamicform").html("");
         	$content=init_this.$el.find(".dialog-content");
         	processLoadData=jQuery.extend(true,{}, init_this.processLoadData);//复制一份
        	commonoption=jQuery.extend(true,{}, init_this.commonoption);//复制一份
         	seajs.use("dynamicform", function (getdynamicView) {
         		init_this.dynamicView=getdynamicView({el:$content,processLoadData:processLoadData,commonoption:commonoption,formdata:formdata,issimple:issimple,isprint:false,"special":init_this.formurl});
              });
         },
         del_attach:function(e){
        	 _this=this;
        	 var $current=$(e.currentTarget);
        	 var fileid=$current.data("fileid");
        	 _this.attaches.splice(jQuery.inArray(fileid,_this.attaches),1);
        	 $current.parent().remove();
         },
         del_file:function(e){
        	 _this=this;
        	 var $current=$(e.currentTarget);
        	 var fileid=$current.data("fileid");
        	 _this.maindoc.splice(jQuery.inArray(fileid, _this.maindoc),1);
        	 $current.parent().remove();
         },
         form_slideToggle:function(e){
        	 $(e.currentTarget).next().slideToggle(1000);
         },
         del_selected_dept:function(e){
        	 var $current=$(e.currentTarget);
        	 $current.parent().remove();
         },
         step_sel:function(e){//选择下一处理人 TODO
        	 var v_this = this;
        	 $(e.currentTarget).closest("ul").find("li").each(function(){
         		var text=$.trim($(this).text());
         		$(this).find("label span ").removeClass("next-step-checked").addClass("next-step-unchecked");
         	});
         	var $current=$(e.currentTarget);
 			$current.removeClass("next-step-unchecked").addClass("next-step-checked");
 			v_this.$el.find("#selected_next_handler").html("");
 			
// 			var transitionname = $.trim($current.text());
 			//下一环节处理人
 			var handleFlag = true;
 			var currentradio=$(e.currentTarget).closest("li").find('input[name=transition]');
			var next_step= currentradio.val();
			var nodename=currentradio.data("name");
			if(nodename=="代理人审批"){
				var template = Handlebars.compile($("#nextperson-show-template").html());
				var $gzdlr=v_this.$el.find("#gzdlr");//工作代理人，配置表单元素需要固定为gzdlr
				var usercode=$gzdlr.data("code");
				var username=$gzdlr.val();
				var orgcode=$gzdlr.data("orgcode");
				if(orgcode==null||orgcode==""){
					mdboss.error("请选择工作代理人");
					return;
				}
				var real_code=orgcode;
				if(usercode!=null&&usercode!=""){
					real_code=real_code+"_"+usercode;
				}
				var val={"code":usercode,"real_code":real_code,"name":username,"editable":false};
				v_this.$el.find("#selected_next_handler").html(template({"persons":[val]}));
			}else{
				if(next_step){
	 				$.each(v_this.candidatesteps,function(index,item){
	 	        		 if(item.transition.transitionid==next_step ){
	 	        			 if(item.handleinfo && item.handleinfo.nextuser ){
	 	        				 // 只有一个人的时候
	 	        				 if( item.handleinfo.nextuser.length==1){
		 	        				 v_this.$el.find(".js_next_user").hide();
		 	        				 v_this.rendernextuser(item.handleinfo.nextuser);
		 	        				 handleFlag = false;
		 	        				// return false;
		 	        			 }
	 	        				//大于等2 个人时
	 	        				if(item.handleinfo && item.handleinfo.nextuser.length>=2){ //>=2 时
		 	        				 v_this.$el.find(".js_next_user").hide();
		 	        				 handleFlag = false;
	     	        				 var selectype=item.selectpersonconfig.selecttype;
	     	        				 var template;
	     	        				 if(selectype=="radio"){
	     	        					template=Handlebars.compile($("#next-user-radio-template").html());
	     	        					var uuid=mdboss.getuuid();
	     	        					var html=template({"users":item.handleinfo.nextuser,"uuid":uuid});
	     	        					v_this.$el.find("#selected_next_handler").html(html);
	     	        				 }else if(selectype=="checkbox"){
	     	        					template=Handlebars.compile($("#next-user-checkbox-template").html());
	     	        					var uuid=mdboss.getuuid();
	     	        					var html=template({"users":item.handleinfo.nextuser,"uuid":uuid});
	     	        					v_this.$el.find("#selected_next_handler").html(html);
	     	        				 }
		 	        			 }
	 	        			 }else{
	 	        				v_this.rendernextuser(item.selectedvalues);
	 	        				return false;
	 	        			 }
	 	        		 }
	 				});
	 			}
			}
 			 
			 if(handleFlag){
				v_this.$el.find(".js_next_user").show();
			 }
			 
			 if($.trim($current.text())=="结束"){ //
				 v_this.$el.find(".js-nexthandlerdiv").slideUp();
				 v_this.$el.find("#common_opinion").hide();
				 v_this.$el.find("#read_opinion").show();
 			}else{
 				v_this.$el.find(".js-nexthandlerdiv").slideDown();
 				v_this.$el.find(".jsopiniondiv").slideDown();
 				v_this.$el.find("#common_opinion").show();
 				v_this.$el.find("#read_opinion").hide();
 			} 
			 
         },
         rendernextuser:function(nextuser){
        	 var v_this = this;
        	 var html=new Array();
        	 $.each(nextuser, function(i, m){
					html.push('<span class="file-show" style="margin-right:3px;">');
					html.push(' <a id="u_'+m.code+'" real_code="'+m.pcode+"_"+m.code+'" uid="'+m.code+'" data-name="'+m.name+'">'+m.name+'</a>');
					//html.push(' <a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
					html.push('</span>');
				});
				v_this.$el.find("#selected_next_handler").html(html.join(""));
         },
         set_urgency:function(e){
        	$(e.currentTarget).closest("ul").find("li").each(function(){
        		var text=$.trim($(this).text());
        		if(text=="紧急"){
        			$(this).find("label span ").removeClass("labelauty-checked").addClass("labelauty-unchecked");
        		}
        		if(text=="急"){
        			$(this).find("label span ").removeClass("labelauty2-checked").addClass("labelauty-unchecked");
        		} 
        		if(text=="一般"){
        			$(this).find("label span ").removeClass("labelauty3-checked").addClass("labelauty-unchecked");
        		}
        	});
        	var $current=$(e.currentTarget);
        	var current=$current.text();
        	if(current=="紧急"){
        		$current.removeClass("labelauty-unchecked").addClass("labelauty-checked");
    		}else if(current=="急"){
    			$current.removeClass("labelauty-unchecked").addClass("labelauty2-checked");
    		}else if(current=="一般"){
				$current.removeClass("labelauty-unchecked").addClass("labelauty3-checked");
    		}
         },
         set_secret:function(e){

         	$(e.currentTarget).closest("ul").find("li").each(function(){
         		var text=$.trim($(this).text());
         		if(text=="商密"){
         			$(this).find("label span ").removeClass("labelauty-checked").addClass("labelauty-unchecked");
         		}
         		if(text=="普通"){
         			$(this).find("label span ").removeClass("labelauty2-checked").addClass("labelauty-unchecked");
         		} 
         	});
         	var $current=$(e.currentTarget);
         	var current=$current.text();
         	if(current=="商密"){
         		$current.removeClass("labelauty-unchecked").addClass("labelauty-checked");
     		}else if(current=="普通"){
     			$current.removeClass("labelauty-unchecked").addClass("labelauty2-checked");
     		}
          
         },
         set_optionion:function(e){
        	 _this=this;
        	 var content=$(e.currentTarget).data("content");
        	 _this.$el.find("#opinion").val(content);
        	 _this.changeOpinion(e);//调用更新意见事件替换处理人
         },
         more_normal:function(){
        	 _this=this;
        	 var dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(this).find(".jscroll").jScrollPane();
                 }
             }, {"title":"选择常用语","width":"500px","height":"350px","icon":"iconfont icon-mdliucheng","resize":function(){
                 }}).show(function(){
                	 _dialog=this;
                 	seajs.use("selectCommonLang", function () {
                 		 var model=new mdboss.Model.commonLangModel();
                 		 var commonModel=new mdboss.Model.commonModel();
                 		 var commonView=new mdboss.View.commonLangView({model:model,commodel:commonModel,dialog:_dialog,parent:_this,callbacks:_this.replaceOpinion});
                 		 commonView.render();
                 	 });
             });
         }
         ,
         selected_dept:function(e){
        	 _this=this;
        	 var dept_arr=new Array();
 	        seajs.use("orgs", function () {
 	        	var $seldept=$(".selected_dept_show .file-show a:first-child");
 	        	$seldept.each(function(index,item){
 	         		dept_arr.push($(item).attr("did"));
 	         	});
 	        	new mdboss.View.orgsView({dept:dept_arr,parent:_this.$el});
 	        });
         },
         set_next_user:function(){
        	 _this=this;
        	 var selectedValues=new Array();
        	 var next_step=_this.$el.find('input[name=transition]:checked').val();
        	 if(next_step==undefined){
        		 mdboss.notifyTips("请选择下一处理环节");
        		 return;
        	 }
        	 _this.$el.find("#selected_next_handler .file-show a:first-child").each(function(index,item){
        		 var pcode=$(item).attr("real_code").split("_")[0];
        		 selectedValues.push({"code":$(item).attr("uid"),"pcode":pcode,"name":$(item).data("name")});
        	 });
        	 
        	 $.each(_this.candidatesteps,function(index,item){
        		 if(item.transition.transitionid==next_step){
//        			 seajs.use("selectMember", function (s) {
//                 		 var data={obj:item.selectpersonconfig.selectitems,
//                 				 "processcode":_this.processinstcode,//
//                 				 "stepcode":next_step,
//                 				 "selecttype":item.selectpersonconfig.selecttype,
//                 				 "element":_this.$el.find("#selected_next_handler"),"selectedvalues":selectedValues};
//                   		 new mdboss.View.membersView({model:new mdboss.Model.showUserType(data)});
//                   	 }); 
        			 
        			 seajs.use("selectHandler", function () {
                 		 var data={
                 				"selectedvalues":selectedValues,
                 				 "obj":item.selectpersonconfig.selectitems,
                 				 "processcode":_this.processinstcode,//
                 				 "transition":next_step,
                 				 "istask":true,
                 				 "selecttype":item.selectpersonconfig.selecttype,
                 				 "element":_this.$el.find("#selected_next_handler"),
                 				"replaceCallbacks":_this.replaceHandler,
                 				"callbackObj":_this//回调函数所在对象
                 		 };
                   		 new mdboss.View.handlerView({model:new mdboss.Model.showHandlerType(data)});
        			 });
        		 }
        	 });
         	
         },
         getNextHandler:function(s_this){
        	 var data=new Array();
        	 s_this.$el.find("#selected_next_handler a").each(function(i,item){
         		if(item){
         			data.push($(item).data("name"));
         		}
         	});
        	 return data;
         	
         },
         replaceOpinion:function(s_this){
        	 console.log(s_this);
        	 var data=s_this.getNextHandler(s_this);
        	 s_this.replaceHandler(s_this,data);  
         },
         changeOpinion:function(e){
        	 var s_this=this;
        	 s_this.replaceOpinion(s_this);
         },
         replaceHandler:function(obj,data){
        	 var str=obj.$el.find("#opinion").val();
        	 mdboss.replacehandler(str,data,obj.updateOpinion,obj);
           },
         updateOpinion:function(data,obj){
          	obj.$el.find("#opinion").val(data); 
         },
         file_upload:function(){
        	 _this=this;
         	   //上传文件
             $.ajaxFileUpload({
                 url:mdboss.api.fileupload,//处理图片脚本
                 secureuri :false,
                 fileElementId :'file_main',//file控件id
                 dataType : 'multipart/form-data',
                 success : function (data, status){
                     if(data != 'undefined'){
                    	var start=data.indexOf(">");
                    	var end=data.lastIndexOf("<");
                    	var json=eval('(' + data.substring(start+1,end)+ ')');
                    	 if(json!=undefined){
                    		 if(json.length!=undefined){
                    			 $(json).each(function(index,item){
                              		_this.maindoc[item.id]={"code":item.id,"editable":true};
                              		var html=new Array();
    								html.push('<span class="file-show" style="margin-left:10px;">');
    								html.push('<a  class="file_view  js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
    								html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="filename_view fa fa-download" target="_blank"></a>');
    								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
    								html.push('</span>');
    		                    	$("#maindoc_file_show").append(html.join(''));
                              		//$("#maindoc_file_show").append('<span style="background-color: #E4E4E4;margin-right: 5px;font-size: 14px;border-radius: 5px;">'+item.name+'<button type="button" data-fileid="'+item.id+'"  class="close_file js_del_file" title="删除">×</button></span>');
                              	});
	                         }else{
	                        	 item=json;
	                        	 _this.maindoc[item.id]={"code":item.id,"editable":true};
	                        	 var html=new Array();
 								html.push('<span class="file-show" style="margin-left:10px;">');
 								html.push('<a  class="filename_view js_file_view" data-file-id="'+item.id+'" >'+item.name+'</a>');
 								html.push('<a  href="'+baseConfig.avatar_url+item.id+'" target="_blank" class="file_view fa fa-download"></a>');
 								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
 								html.push('</span>');
 		                    	$("#maindoc_file_show").append(html.join(''));
	                      		//$("#maindoc_file_show").append('<span style="background-color: #E4E4E4;margin-right: 5px;font-size: 14px;border-radius: 5px;">'+item.name+'<button type="button" data-fileid="'+item.id+'"  class="close_file js_del_file" title="删除">×</button></span>');
	                         }
//                    		 mdboss.notifyTips("文件上传成功！");
                     }else{
                    	 mdboss.notifyTips("文件上传失败！");
                     }
                 }
                },
                 error: function(data, status, e){
                	 mdboss.error(e);
                 }
         });
         },
         attach_upload:function(){
        	 _this=this;
         	 $.ajaxFileUpload({
                  url:mdboss.api.fileupload,//处理图片脚本
                  secureuri :false,
                  fileElementId :'file_attach',//file控件id
                  dataType : 'multipart/form-data',
                  success : function (data, status){
                      if(data != 'undefined'){
                    	  var start=data.indexOf(">");
	                    	var end=data.lastIndexOf("<");
	                    	var json=eval('(' + data.substring(start+1,end)+ ')');
	                    	 if(json!=undefined){
	                    		 if(json.length!=undefined){
	                    			 $(json).each(function(index,item){
	                               		_this.attaches[item.id]={"code":item.id,"editable":true};
		                               	 var html=new Array();
		  								html.push('<span class="file-show" style="margin-left:10px;">');
		  								html.push('<a data-file-id="'+item.id+'" class="filename_view js_file_view">'+item.name+'</a>');
		  								html.push('<a href="'+baseConfig.avatar_url+item.id+'" target="_blank" class="file_view fa fa-download" ></a>');
		  								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
		  								html.push('</span>');
		  								$("#attach_file_show").append(html.join(''));
	                               		//$("#attach_file_show").append('<span style="background-color: #E4E4E4;margin-right: 5px;font-size: 14px;border-radius: 5px;">'+item.name+'<button type="button" data-fileid="'+item.id+'"  class="close_file js_del_attach" title="删除">×</button></span>');
	                               	});
	                               
	                    		 }else{
	                    			 	item=json;
	                    			 	_this.attaches[item.id]={"code":item.id,"editable":true};
	                    			 	var html=new Array();
	                    			 	html.push('<span class="file-show" style="margin-left:10px;">');
		  								html.push('<a  class="filename_view  js_file_view"  data-file-id="'+item.id+'">'+item.name+'</a>');
		  								html.push('<a href="'+baseConfig.avatar_url+item.id+'" target="_blank" class="file_view fa fa-download" ></a>');
		  								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
		  								html.push('</span>');
		  								$("#attach_file_show").append(html.join(''));
	                    			 	//$("#attach_file_show").append('<span style="background-color: #E4E4E4;margin-right: 5px;font-size: 14px;border-radius: 5px;">'+item.name+'<button type="button" data-fileid="'+item.id+'"  class="close_file js_del_attach" title="删除">×</button></span>');
	                    		 }
//	                    		mdboss.notifyTips("文件上传成功！");
	                    	}else{
	                    		mdboss.notifyTips("文件上传失败！");
	                    	}
                      }else{
                    	  mdboss.notifyTips("文件上传失败！"); 
                      }
                  },
                  error: function(data, status, e){
                	  mdboss.error(e);
                  }
          });
         },
         change_sunxu:function(e){
        	 _this=this;
         	var xuhao=$(e.currentTarget).val();
         	var commonModel=new mdboss.Model.commonModel();
	   		commonModel.save({"serialcode":xuhao,"usercode":mdboss.usercode},{url: mdboss.api["queryZihao"],
	   			success:function(model,result){
          	   if(result.rc==1){
          		  var data=result.data.rows;
          		   var options=new Array();
	            	   options.push('<option value="">请选择</option>');
	            	   $.each(data,function(index,item){
	            		   options.push('<option value="'+item.id+'">'+item.num+'</option>');
	            	   });
	            	   _this.$el.find("#zihao").empty();
  		            	_this.$el.find("#zihao").html(options.join(""));
  		            	_this.$el.find("#zihao").select2();
          	   }else{
          		   mdboss.error(result.msg);
          	   }
	   		},error:function(){
				mdboss.error();
			}});
       
         	
         },
         addNum:function(e){
        	 _parent=this.$el;
         	 var dialog=new Dialog({
                  type: "html",
                  value: '<div class="loading"></div>',
                  fillCallback:function(){
                      $(this).find(".scrollwrapper").jScrollPane();
                  }
              }, {"title":"请填写新的字号并确认","width":"300px","height":"160px","icon":"iconfont icon-mdliucheng","resize":function(){
                  }}).show(function(){
                 	 var _this = this;
                 	 $($(".add_num_template").html()).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();

  					$(_this.dialog).find(".loading").removeClass("loading");

  					//点击提交
  					$(_this.dialog).find(".js_add_num_submit").click(function() {
  						//获取字号数据
  						$(_this.dialog).find(".loading")
  						var zihao =  $(_this.dialog).find(".js_zihao_value").val();
  						var commonModel=new mdboss.Model.commonModel();
  				   		commonModel.save({"serialcode":zihao,"usercode":mdboss.usercode},
  				   				{url: mdboss.api["sunxu"],success:function(model,result){
			            	   if(result.rc==1){
			            		   $(_this.dialog).find(".loading").removeClass("loading");
			            		  var options=new Array();
	 			            	   options.push('<option value="'+zihao+'">'+zihao+'</option>');
	 			            	  $(_parent).find(".js_sunxu").append(options.join(","));
	 			            	 $(_parent).find(".js_sunxu").val(zihao);
	 			            	$(_parent).find(".js_sunxu").change();
	 			            	// mdboss.notifyTips("添加字号成功");
	 			            	_this.close();
			            	   }else{
			            		  mdboss.error(result.msg);
			            	   }
  				   		},error:function(){
  							mdboss.error();
  						}});
  						
  						
  						
  					});
  					//点击取消
  					$(".btn-sm").click(function() {
  						_this.close();
  					});
                  });
         },
         deleteMeno:function(e){//删除便签
        	 _this=this;
        	 var $this=$(e.currentTarget);
        	//从数组中删除对应的memoinfo
       	     this.memoinfo.splice(jQuery.inArray($this.closest("li").data("index"),_this.memoinfo),1);
       	     $this.closest("li").remove();
       	     $(".addmeno").removeClass("hide");
       	  	 this.$el.find(".dialog-content").find(".jscroll").jScrollPane();
         },
         changeMeno:function(e){//修改便签
           var $li=$(e.currentTarget).closest("li");
      	   $(".meno-show-1").removeClass("hide");
    	   $(".meno-change-1").addClass("hide");
      	   var content = $(".meno-value").val();
      	   $(".meno-show-1").html(content).attr("title",content);//meno-value
      	   var createtime=$.fullCalendar.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
      	   var memo=this.memoinfo[$li.data("index")];
      	   if(memo){
      		this.memoinfo[$li.data("index")].usercode=mdboss.usercode;
      		this.memoinfo[$li.data("index")].username=mdboss.cache.data["getMyInfo"].username;
      		this.memoinfo[$li.data("index")].content=content;
      		this.memoinfo[$li.data("index")].createtime=createtime;
      		this.memoinfo[$li.data("index")].editable=false;
      	   }
         },
         updateMeno:function(e){//修改便签
      	   $(".meno-show-1").addClass("hide");
      	   $(".meno-change-1").removeClass("hide");
         },
         addmeno:function(e){
        	 _this=this;
        	 seajs.use("meno", function () {
           		 var menoModel=new mdboss.Model.processMeno();
           		 new mdboss.View.processMeno({model:menoModel,el:_this.$el,_parent:_this});
           		
           	 });
        },
        personProcess:function(e){
        	_this=this;
        	var taskcode=$(e.currentTarget).parent().attr("stepcode");
       	 seajs.use("queryprocesspart", function () {
       		 var view=new mdboss.View.processPart({data:_this.taskPersons[taskcode],layer:false,processinstcode:_this.processinstcode});
       		 _this.dialog_person=view.dialog;
       	 });
       },
       send:function(e){
    	 _this=this;
    	 _this.$el.find("#read_opinion").hide();
    	 _this.$el.find(".flowOpinion").slideToggle(1000,function(){
    		 _this.$el.find("#opinion").focus();//给文本框焦点。
       		_this.$el.find(".dialog-content").find(".jscroll").jScrollPane();
       	});

       },
       diagram:function(e){
           var $target=$(e.target);
        	 var id=$target.data("id");
        	 var dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(this).find(".jscroll").jScrollPane();
                 }
             }, {"title":"查看流程图","width":"963px","height":"562px","icon":"iconfont icon-mdliucheng","layer":false,"resize":function(){
            	 $(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
                 }}).show(function(){
                	 _this=this;
                	 seajs.use("preViewDiagram", function () {
                		 var model=new mdboss.Model.preViewDiagramModel();
                		 var diagramView=new mdboss.View.preViewDiagramView({processcode:id,is_edit:false,model:model,$el:$(_this.dialog)});
                		 diagramView.render({"processinstcode":id});
                	 });
                 });
         },
      submit:function(event){
    	  	 var  cur_this=this;
    	      var form_data = cur_this.$el.find(".processform").triggerHandler( "submitForm" );
    	      if ( form_data ) {
    	        	var submitTask=new  mdboss.Model.commonModel();
    	        	var data=cur_this.formdata("submit");
    	        	if(data=="transitionnameNull"){
    	        		mdboss.notifyTips("请选择下一环节");
    	        		return ;
    	        	}
    	        	if(data=="resultNull"){
    	        		mdboss.error("请选择处理意见！");return;
    	        	}
    	        	
    	        	if(data=="nextuserNull"){
    	        		mdboss.notifyTips("请选择下一处理人");
    	        		return;
    	        	}
    	        	
    	          	var tmpsubmitdata=cur_this.dynamicdata.tmpsubmitdata;//提交处理差异化数据
    	          	for(var key in tmpsubmitdata){
                 		var val=tmpsubmitdata[key];
                 		if(typeof val=="object"){
                 			data.formdata[key]=val;
                 		}
                 	}
    	          //校验特殊必填字段
	  	          	var requirename;
	  	          	var checkerror=false;
	  	          	cur_this.$el.find("input[type=hidden][data-required=true]").each(function(c,require){
	  	          		if($(require).val()==""){
	  	          			requirename=$(require).data("name");
	  	          			checkerror=true;
	  	          			return ;
	  	          		}
	  	          	});
	  	          	
	  	          	if(checkerror){
	  	          		mdboss.alert(requirename+"不能为空");
	  	          		return false;
	  	          	}
	  	          	var errordesc="";
	  	          	var checkvalid=false;
	  	          	cur_this.$el.find("input[type=hidden][data-check=true]").each(function(c,require){
	  	          		if($(require).val()!=""){
	  	          			errordesc=$(require).val();
	  	          			checkvalid=true;
	  	          			return ;
	  	          		}
	  	          	});
		  	      	if(checkvalid){
	  	          		mdboss.alert(errordesc);
	  	          		return false;
	  	          	}
    	          	$("#submit-loading-mask").show();//添加遮罩层
    	         	$("#submit-loading").show();
    	         	cur_this.$el.find(".js_submit").attr("disabled", true);
	          		submitTask.save(data,{url:mdboss.api.startTask,success:function(model,response){
//        	        		Backbone.history.loadUrl();
	          			cur_this.$el.find(".js_submit").attr("disabled", false);
	          			console.log("sdf");
	          			$("#submit-loading-mask").hide();
	              		$("#submit-loading").hide();
    	        		if(response.rc == 1){
    	        			mdboss.alert("提交成功!");    	        			
    	        			cur_this.dialog.close();
    	        		}else{
    	        			mdboss.error(response.msg);    	 
    	        		}
    	        	},error:function(){
    	        		cur_this.$el.find(".js_submit").attr("disabled", false);
    	        		$("#submit-loading-mask").hide();
    	          		$("#submit-loading").hide();
    	        		mdboss.error();
    	        	}});
    	          	
    	      }else{
    	    	  mdboss.notifyTips("请填写必填项！");
    	      }
      },
      save:function(e){
    	  var cur_this=this;
    	  var form_data =true;// _this.$el.find(".processform").triggerHandler( "submitForm" );
	      if ( form_data ) {
	    		var saveTask=new mdboss.Model.commonModel();
	          	var data=cur_this.formdata("save");
	          	
	          	var tmpsave=cur_this.dynamicdata.tmpsavedata;//保存时差异化数据
	          	for(var key in tmpsave){
             		var val=tmpsave[key];
             		if(typeof val=="object"){
             			data.formdata[key]=val;
             		}
             	}
	          	
         	$("#submit-loading-mask").show();//添加遮罩层
         	$("#submit-loading").show();
         	cur_this.$el.find(".js_save").attr("disabled", true);
     		saveTask.save(data,{url:mdboss.api.startSaveTask,success:function(model,response){
          		$("#submit-loading-mask").hide();
          		$("#submit-loading").hide();
          		 
          		cur_this.$el.find(".js_save").attr("disabled", false);
          		if(response.rc==1){
          			mdboss.notifyTips("保存成功！");
          		}else{
          			mdboss.error(response.msg);
          		}
          	},error:function(){
          		cur_this.$el.find(".js_save").attr("disabled", false);
          		$("#submit-loading-mask").hide();
          		$("#submit-loading").hide();
          		mdboss.error();
          	}}); 
     		
	      }else{
	    	  mdboss.notifyTips("请填写必填项！");
	      }
      
      },
      formdata:function(type){//表单数据 
    	    cur_this=this;
        	var opinion="";//流程意见
        	if(cur_this.$el.find("#opinion")){
        		opinion = cur_this.$el.find("#opinion").val();//意见
        	}
//        	console.log(opinion);
        	
        	var result="";//审核结果 pass
        	//处理意见
        	if(cur_this.$el.find('input[name=result]').length >0){
        		result = cur_this.$el.find('input[name=result]:checked').val();
        		if(result == undefined || result==""){
        			if(type == "submit"){
        				result ="";
        				return "resultNull";
        			}
        		}
        	}
        	
        	//下一环节处理 
        	var setasfrequence=false;
        	cur_this.nextuser=new Array();
        	
        	
        	//TODO 
        	var transitionname = cur_this.$el.find('input[name=transition]:checked').attr("data-name");
        	if(cur_this.$el.find('input[name=transition]').length>0){//有
        		cur_this.nextstep=cur_this.$el.find('input[name=transition]:checked').val();//下一环节
        		if(transitionname==undefined&&type=="submit"){
        			return "transitionnameNull";
        		}
        		if("结束" != $.trim(transitionname)){
        			cur_this.$el.find("#selected_next_handler .file-show a:first-child").each(function(index,item){
        				var realcode=$(item).attr("real_code").split("_");
        				var pcode=realcode[0];
        				var code=realcode[1]==undefined?"":realcode[1];
        				if(code==""){
        					cur_this.nextuser.push({"pcode":pcode});//下一处理人
        				}else{
        					cur_this.nextuser.push({"code":code,"pcode":pcode});//下一处理人
        				}
        			});
        			var nextuserradio=cur_this.$el.find("input[name=nextuser-radio]:checked");
                 	if(nextuserradio&&nextuserradio.length>0){
                 		var pcode=nextuserradio.data("pcode");
	                 	var code=nextuserradio.data("code");
	                 	var name=nextuserradio.data("name");
	                 	if(code==""){
	                 		cur_this.nextuser.push({"pcode":pcode,"name":name});//下一处理人
                		}else{
                			cur_this.nextuser.push({"code":code,"pcode":pcode,"name":name});//下一处理人
                		}
                 	}
                 	cur_this.$el.find("input[name=nextuser-checkbox]:checked").each(function(i,item){
                 		var pcode=$(item).data("pcode");
	                 	var code=$(item).data("code");
	                 	var name=$(item).data("name");
	                 	if(code==""){
	                 		cur_this.nextuser.push({"pcode":pcode,"name":name});//下一处理人
                		}else{
                			cur_this.nextuser.push({"code":code,"pcode":pcode,"name":name});//下一处理人
                		}
                 	});
            	}
            	
            	if(cur_this.$el.find("#setCommonLang").is(":checked")){
            		setasfrequence=true;
            	}
        	}//end
        	
        	
        	var handleinfo={"opinion":opinion,"transition":cur_this.nextstep,"nextuser":cur_this.nextuser,"result":result,"setasfrequence":setasfrequence};
        	cur_this.dynamicdata=cur_this.dynamicView.getformsdata();
        	var formsdata=cur_this.dynamicdata["formpost"];
        	var data={"usercode":mdboss.usercode,"processcode":cur_this.id,"processformtype":cur_this.processformtype,"handleinfo":handleinfo,"formdata":formsdata};
        	
        	if(transitionname!="结束"){
        		if(cur_this.nextstep==undefined||cur_this.nextstep==""){
    				if(type == "submit"){
    					return "transitionnameNull";
    				}
    			}
    			if(cur_this.nextuser.length==0 && type == "submit"){
    				return "nextuserNull";
    			}
        	}
        	
        	return data;
      }
    	
    });
   
});
