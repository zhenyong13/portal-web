/**
 * Created by 2goyoung on 2015/5/11.
 */


define(function (require, exports, module) {
    var $ = require("jquery");
    require("bootstrap")($);
    require("upload");
    require("backbone");
    require("scroll");
    require("fileinput");
    require("datetimepicker");
    require("bootbox");
    var Dialog=require("dialog");
    require("notify")($);
    require("validVal")($);
    require("select2");
    require("fullcalendar");
    require("jqueryui");
    Backbone.emulateJSON = true;
   
    var processInfo = function (mdboss) {
	   
    	
        var $page = mdboss.$pageWrap;
//        $page.on("click",".forms-body-wrap ul.people-list li",function(){
//        	 $(this).attr("assignee");
//        	 var data={
//        			 "assignee":"002644",         //当前用户标识
//       			    "stepcode":"2601",          //步骤编码，对应任务ID
//       			    "stepname":"拟办",         //环节步骤名称
//       			    "processinstid":"2622",       //流程实例ID
//       			    "processformtype":"院收文" //流程表单类型
//          	};
//        	 seajs.use("queryprocesspart", function () {
//        		 var queryProcess=new mdboss.Model.processPart();
//        		 var view=new mdboss.View.processPart();
//        		 queryProcess.save(data,{success:view.success});
//        	 });
//        });
        //公共mvc模块
        mdboss.Model.processdefLoad = Backbone.Model.extend({
            url: mdboss.api.processdefLoad,
          
        });
        
        //撤回公文 
        mdboss.Model.withdraw = Backbone.Model.extend({
            url: mdboss.api.withdraw,
          
        });
        //终止
        mdboss.Model.terminationProcess= Backbone.Model.extend({
            url: mdboss.api.terminationProcess,
          
        });
      //删除公文 
        mdboss.Model.deleteProcess= Backbone.Model.extend({
            url: mdboss.api.delete_process,
          
        });
        
        mdboss.Model.submitTask = Backbone.Model.extend({
            url: mdboss.api.submitTask,
          
        });
        
        mdboss.Model.saveTask = Backbone.Model.extend({
            url: mdboss.api.saveTask
          
        });
        
        
        mdboss.Model.taskInfo = Backbone.Model.extend({
          
        });
        
        //创建公文
        mdboss.View.creatProcess=Backbone.View.extend({
        	
        	_this:this,
        	taskcode:"",
        	taskname:"",
        	processinstcode:"",
        	maindoc:[],
        	attaches:[],
        	nextstep:"",
        	nextuser:[],
        	sendrelatedep:[],
        	selectpersonconfig:{},
        	memo:"",
            initialize:function(){
            	_this=this;
                _this.dialog=new Dialog({
                    type: "html",
                    value: '<div class="loading"></div>',
                    fillCallback:function(){
                        $(this).find(".scrollwrapper").jScrollPane();
                    }
                }, {"title":"发起公文（流程）","width":"960px","height":"560px","icon":"iconfont icon-mdliucheng","layer":false,"resize":function(){
                    $(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
                    }}).show(function(){
                        var self=this;
                        mdboss.getReady({data:[{"name":"processtypelist","post":{
                        	"usercode":mdboss.usercode, "pageNo":0, "pageSize":0, "queryCondition": 
                    		[
                    		 	  {"key":"typeclass","operate":"EqualTo","v1": "process"},
                    		      {"key":"status","operate":"EqualTo","v1":"enable"}, //启用/停用
                    		],"orderBy":"parentcode,sortorder"
                        }}],template:["processAdd"]},function(result,msg){
                            if(result) {
                            	//构造树结构
            					var tmpPTypes = new Array();//pcode, array
            					var tmp = result.data["processtypelist"]["rows"];
            					var processtype = "";
            					for(var i =0; i<tmp.length; i++){
            							if(i==0){
            								processtype = tmp[i].typecode;
            							}
            						   if(tmp[i].parentcode == "-1"){
            							   tmpPTypes.push({"id":tmp[i].id,"code":tmp[i].typecode,"iconclass":tmp[i].iconclass,"name":tmp[i].typename,
            								   "sortorder":tmp[i].sortorder,"status":tmp[i].status,
            								   "pcode":tmp[i].parentcode,"values":new Array()});
            						   }else{
            							   $.each(tmpPTypes,function(j, item){
            								   if(item.code == tmp[i].parentcode){
            									   item.values.push(tmp[i]);
            								   }
            							   });
            						   }
            					  }
            					  // 
//                                var data=result.data["queryProcesseDef"];
                                var template = Handlebars.compile(result.template["processAdd"]);
                                var html = template({"processtype":tmpPTypes});
                                self.$html.find(".dialog-content").hide().html(html).fadeIn();
                                self.$html.find(".scrollwrapper").jScrollPane();
                                _this.loadprocesslist(processtype);
                            }
                            else{
                            	mdboss.notifyTips(msg);
                            }
                        });
//                        _this.dialog=dialog;
                    });
                _this.$el=_this.dialog.$html;
                
            },
            loadprocesslist:function(processtype){//加载流程 
    		  v_this = this;
    		  var tmpCondition = new Array();
              tmpCondition.push({"key":"processtype","operate":"EqualTo","v1": processtype});
              tmpCondition.push({"key":"isenabled","operate":"EqualTo","v1":"enable"});//TODO
              v_this.$el.find("#processtype_list").html('<div class="loading" style="width: 100%;height: 300px;"></div>');
              mdboss.reqsubmit({"usercode":mdboss.usercode,"queryCondition":tmpCondition,"orderBy":"processtype,sortorder","pageNo":1,"pageSize":0},
            		  mdboss.api.queryworkflow, function(m, res){
            	  v_this.$el.find("#formlist-loading").hide();
            	  if(res.rc == 1){
            		  var template = Handlebars.compile(require("text!template/page/process/addlist.html"));//
    	              var html = template({"processlist":res.data.rows });
    	              v_this.$el.find("#processtype_list").html(html);
            	  }else{
            		  mdboss.error(res.msg);
            	  }
              });
    		},
    		showTab:function(e){//切换tab
    			var v_this = this;
    		   var $target = $(e.currentTarget);
              if(!$target.hasClass("active")){
                  $target.addClass("active").siblings(".active").removeClass("active");
                  var processtype = $target.data("processtype");
                  if($target.data("parentcode") == "-1"){
                	  v_this.$el.find(".second_level").hide();
                	  v_this.$el.find("#type_"+processtype).show();
                	  if(v_this.$el.find("#type_"+processtype).length >0 ){
                		  v_this.$el.find("#type_"+processtype +" ul li:first").addClass("active");
                		  processtype = v_this.$el.find("#type_"+processtype +" ul li:first").data("processtype");
                		  v_this.$el.find(".scrollwrapper").css("margin-top", "50px");
                	  }else{
                		  v_this.$el.find(".scrollwrapper").css("margin-top", "5px");
                	  }
                  }
                  v_this.loadprocesslist(processtype);
              }
    		},
            events: {
                "click .js_formStart":"openForm",
                "click .js_formPreview":"formPreview",
                "click .js_back":"back",
                "click #editOperator":"editOperator",
                "click .toolkit-item-tab":"showTab"//切换tab
                
            },
            toolkitChange:function(e){//delete
                var $target=$(e.currentTarget);
                if(!$target.hasClass("active")){
                    $target.addClass("active").siblings(".active").removeClass("active");
                    var $panel=$target.parents(".toolkit-panel");
                    $panel.find(".form-list-wrap.active").hide().removeClass("active");
                    $panel.find(".form-list-wrap").eq($target.index()).addClass("active").fadeIn();
                }
            
            },      	
            editOperator:function(){
               	$(".typeahead-wrapper1").removeClass("hide");
               	var commonModel=new mdboss.Model.commonModel();
    	   		commonModel.save({},{   url:mdboss.api.members,
                	 success:function(model,data){
                		 if(data.rc==1){

                 			var html = "";
                 			for( m in data.data.rows){
                 				var tmp ="<p class='employee employee1' id="+data.data.rows[m].id+" name='"+data.data.rows[m].username+"'><img class='avatar' src='"+data.data.rows[m].avatar+"'><span>"+data.data.rows[m].username+"</span></p>";
                 				html += tmp;
                 			}
                 			$("#searchList").html(html);
                 			$(".employee1").click(function(){
                 				var id= $(this).attr("id");
                 				var name= $(this).attr("name");
                 				var flag = true;
                 				$(".entity-item1").each(function(){
                 					if($(this).find("a")[0].id == id){
                 						flag = false;
                 						return;
                 					}
                 				});
                 				if(flag){
                 					var tp = "<span class='entity-item entity-item1'><a id='"+id+"' class='usercard-toggle' userid='"+id+"'>"+name+"</a></span>";
 										$(".entity-container1").append(tp);
                 				}
                 				$(".typeahead-wrapper1").addClass("hide");
                 			});
                 	
                		 }else{
                			 mdboss.error(data.msg);
                		 }
                	 },error:function(){
                		mdboss.error();
                	}
               	 });
            } ,
            //公文模版预览
            formPreview: function(e){
            	 var $target=$(e.target);
            	 var id=$target.data("id");
            	 var dialog=new Dialog({
                     type: "html",
                     value: '<div class="loading"></div>',
                     fillCallback:function(){
                         $(this).find(".jscroll").jScrollPane();
                     }
                 }, {"title":"流程图预览","width":"963px","height":"562px","layer":false,"icon":"iconfont icon-mdliucheng","resize":function(){
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
            //跳转到公文创建页面
            openForm:function(e){
            	 var $target=$(e.target);
                 var _this=this;
                 var id=$target.data("id");
                 _this.processinstcode=id;//流程实例ID
                 var curstepname=$target.data("curstepname");
                 var name=$target.data("name");
                 this.dialog=new Dialog({
                     type: "html",
                     value: '<div class="loading"></div>',
                     fillCallback:function(){
                    	 console.log($(_this).find(".jscroll"));
                         $(_this.dialog).find(".jscroll").jScrollPane({autoReinitialise:true});
                     }
                 }, {"title":"发起（流程）【"+name+"-"+curstepname+"】","width":"963px","height":"562px","layer":false,"icon":"iconfont icon-mdliucheng","resize":function(){
                	 	console.log($(_this).find(".jscroll"));
                	 	$(_this.dialog).find(".jscroll").jScrollPane({autoReinitialise:true});
                	 	
                     }}).show(function(){
                    	 _this=this;
                    	 seajs.use("startProcessInfo", function () {
                    		 var model=new mdboss.Model.processdefLoad();
                    		 var viewProcess=new mdboss.View.startProcess({model:model,$el:$(_this.dialog),dialog:_this,id:id});
                    		 viewProcess.render();
                    	 });
                    	 
                     });
            },
            back:function(){
                var $item=this.$el.find(".dialog-item");
                var $active=this.$el.find(".dialog-item.active");
                var index=$item.index($active);
                $item.eq(index).hide().removeClass("active");
                $item.eq(index-1).show().addClass("active").find(".jscroll,.scrollwrapper").jScrollPane();;
            }
        });


        //
        mdboss.View.showProcess=Backbone.View.extend({
        	_this:this,
            initialize:function(data){
            	init_this=this;
            	init_this.data=data;
            	this.taskcode=data.$data!=undefined?data.$data.data("taskcode"):"";
            	this.taskname="";
            	this.maindoc=[];
            	this.attaches=[];
            	this.nextstep="";
            	this.nextuser=[];
            	this.sendrelatedep=[];
            	this.selectpersonconfig={};
            	this.memoinfo=[];
            	this.dataid=data.$data.data("id");
            	this.processinstcode=this.dataid;
            	this.taskPersons={};
//                var id=$target.data("id");
//                var name=$target.data("name");
                var dialog=new Dialog({
                    type: "html",
                    value: '<div class="loading"></div>',
                    fillCallback:function(){
                        $(this).find(".scrollwrapper").jScrollPane({"autoReinitialise": true});

                    }
                }, {"title":"["+data.title+"]","width":"960px","height":"560px","icon":"iconfont icon-mdliucheng","layer":false,"resize":function(){
                    $(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane({"autoReinitialise": true});
                }}).show(function(){
                	var id=init_this.dataid;
                	init_this.dialog=this;
                	var $content=this.dialog.find(".dialog-content");
                	if($("#process"+id+init_this.taskcode).length && !init_this.data.view){
                        //$("#process"+id).fadeIn().addClass("active");
                		 mdboss.alert("任务已被打开");
                		 this.close();
                	}else{
                        var $loading=this.dialog.find(".loading").length?this.dialog.find(".loading"):$('<div class="loading"></div>').appendTo($content);
                        
                        //加载模版url及下一环节数据
                        var taskInfo=new mdboss.Model.taskInfo();//任务处理
                        var processLoadData;
                        var $edata=init_this.data.$data;
                        var taskcode=$edata!=undefined?$edata.data("taskcode"):"";
                        init_this.taskcode=taskcode;//任务号
                        init_this.taskname=$edata!=undefined?$edata.data("taskname"):"";//任务名称
                        init_this.processinstcode=id;//流程实例ID
                        var post={"usercode":mdboss.usercode, "taskcode":taskcode, "processinstcode":id};
                        if(init_this.data.url==mdboss.api.watchsharedone){
                        	post={"usercode":mdboss.usercode, "type":init_this.data.reqtype, "processinstcode":id};
                        }
                        taskInfo.save(post,{url:init_this.data.url,success:function(model,response){
                        	if(response.rc ==1){
                            	processLoadData=response;
                            	init_this.candidatesteps=processLoadData.data.candidatesteps;
                            	if(init_this.candidatesteps){
                            		$.each(processLoadData.data.candidatesteps,function(index,item){
                            			init_this.selectpersonconfig=item.selectpersonconfig;
                                    });
                            	}
                            	//是否显示timeline
                            	var reqdata=new Array();
                            	if(processLoadData.data.showtimeline==undefined){
                             		processLoadData.data.showtimeline=true;
                             	}
                            	if(processLoadData.data.showtimeline||rocessLoadData.data.showtimeline==undefined){//
                            		reqdata.push({"name":"querydoctimeline","post":{
                                     	"usercode":mdboss.usercode,         //当前用户标识
                                     	"taskcode":taskcode,      //当前环节名称(值为空，是启动环节)
                                         "processinstcode":id       //流程实例ID（值为空，是启动环节）
                                     }});
                            	}
                            	
                            	reqdata.push({"name":"activitytrack","post":{
                                 	"usercode":mdboss.usercode,         //当前用户标识
                                     "processinstcode":id       //流程实例ID（值为空，是启动环节）
                                 }});
                            	if(!init_this.data.view){
                            		reqdata.push({"name":"querycommonopinion","post":{
                            			"usercode":mdboss.usercode,//当前用户标识
                            		}});
                            	}
                            	
                            	var formUrl = processLoadData.data.formurl ; 
                            	if("assessmentform" == formUrl || "performanceform"==formUrl){
                            		formUrl = "receiveform";
                            	}
                            	init_this.formurl=formUrl;
                            	
                            	 mdboss.getReady({data:reqdata,template:[formUrl]},function(result,msg){
                                     if(result) {
                                    	 var personProcess={};
                                    	 if(processLoadData.data.showtimeline){
                                    		 personProcess=result.data["querydoctimeline"];
                                             $(personProcess.rows).each(function(index,item){
                                            	 init_this.taskPersons[item.taskcode]=item;
                                             });
                                    	 }
                                    	 var activity=result.data["activitytrack"];
                                    	 
                                         var commonoption=result.data["querycommonopinion"];
                                         var commons=new Array();
                                         $.each(commonoption.rows,function(index,item){
                                       	  if(index<4){
                                       		  var content=item.content;
                                       		  commons.push({"title":content.length>3?content.substr(0,3)+"...":content,"content":content});
                                       	  }
                                         });
                                         var date=new Date();
                                         var current_date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                                         var template = Handlebars.compile(result.template[formUrl]);
                                         var random=mdboss.getuuid();
                                         
                                         var html = template({pageId:id+random,"myinfo":mdboss.cache.data["getMyInfo"],"taskName":name,persons:personProcess,"activity":activity,historyshow:true,showtimeline:processLoadData.data.showtimeline,processdefLoad:processLoadData,currentdate:current_date,baseUrl:baseConfig.avatar_url,"taskcode":init_this.taskcode,"processcode":init_this.processinstcode});
//                                         self.$html.find(".dialog-content").hide().html(html).fadeIn();
//                                         self.$html.find(".scrollwrapper").jScrollPane();
                                         $content.html(html).hide().attr("id","process"+id).addClass("active").fadeIn();
                                         init_this.$el.find(".add_num_template").hide();
                                         $loading.hide();
                                         
                                         if( !init_this.data.view){//非查询表单
                                        	 seajs.use("buttons", function () {
                                        		 var buttonsView=new mdboss.View.buttonsView(
                                        				 {content:$content,processInfo:processLoadData,
                                        					 processinstcode:init_this.processinstcode,"taskcode":init_this.taskcode});
                                        		 buttonsView.render("info");
                                        	 });
                                         }
                                         init_this.orginformdata=jQuery.extend(true,{}, processLoadData.data.formdata);//复制一份在精简模式时使用
                                         init_this.printformdata=processLoadData.data.printformdata;
                                         init_this.formurl=processLoadData.data.formurl;
                                         init_this.processLoadData=processLoadData;
                                         init_this.commonoption=commons;
                                         seajs.use("dynamicform", function (getdynamicView) {
                                        	 init_this.dynamicView=getdynamicView({el:$content,processLoadData:processLoadData,formdata:processLoadData.data.formdata,commonoption:commons,isprint:false,"special":init_this.formurl});
                                         });
                                         //显示历史意见
                                         
                                       //TODO 判断下一环节的节点数,如果只有一个的时候默认选中
                                         if(processLoadData.data.candidatesteps && processLoadData.data.candidatesteps.length ==1){
                                        	 init_this.$el.find("input[name=transition]:first-child").prop("checked", true);
                                        	 init_this.$el.find("input[name=transition]:first-child").closest("li").find("span").removeClass("next-step-unchecked").addClass("next-step-checked");
                                        	 //下一处理人,只有一个人的时候
	                                       	 if(processLoadData.data.candidatesteps[0].handleinfo && processLoadData.data.candidatesteps[0].handleinfo.nextuser && processLoadData.data.candidatesteps[0].handleinfo.nextuser.length==1){
	                                       		init_this.$el.find(".js_next_user").closest(".js-nexthandlerdiv").hide();
	                                       		init_this.rendernextuser(processLoadData.data.candidatesteps[0].handleinfo.nextuser);
	                                       	  }
	                                       	 
		                                      //当下环节仅有结束时,屏蔽选择下一处理人
		                                   	  if(init_this.$el.find(".js_step_sel").length==1&&$.trim(init_this.$el.find(".js_step_sel").text())=="结束"){
		                                   		init_this.$el.find(".js_next_user").closest(".js-nexthandlerdiv").hide();
		                                   	  }
                                        }//end if
                                         
                                       //判断是否有 submit 按钮 有则不验证 opinion
                                        if(processLoadData.data.buttons){
                                       	  $.each(processLoadData.data.buttons, function(i, item){
                                       		  if(item == "submit"){
	                                       		  init_this.$el.find("#read_opinion").show();
	                                       		  init_this.$el.find("#common_opinion").hide();
                                       			  return false;
                                       		  }
                                       	  });
                                         }
                                        //resize
//                                        init_this.$el.find(".dialog-inner").parent().resizable({
//                                        	handles:'e'
//                                        });
                                        
                                        
                                     }
                                     else{
                                    	 mdboss.error(msg);
                                     }
                                 });
                            
                        	}else{
                        		mdboss.error();
                        	}
                        },error:function(){
                        	mdboss.error();
                        }});
                        //---------------------------------------------------------------------------------
                       
                        //--------------------------------------------------------------------------------------
                    }
                    });

                this.$el=dialog.$html;
            },
            events: {
                "mouseenter .forms-body-wrap ul.people-list li img":"personProcess",
                "click .forms-body-wrap ul.people-list li img":"personClickProcess",
                "mouseleave .forms-body-wrap ul.people-list li img":"closePersonDialog",
                "click .js_restart":"restart",
                "click .js_send":"send",
                "click .addmeno":"addmeno",//添加便签
                "click #form-describe-add":"updateMeno",//修改便签
                "click #delete-meno":"deleteMeno",//删除便签
                "blur #processMeno2":"changeMeno",//修改便签
                "click .js_submit":"submit",
                "click .js_read_submit":"submit",
                "click .js_save":"save",
                "click .js_print":"print",
                "click .js_addNum":"addNum",
                "change .js_file_upload":"file_upload",
                "change .js_attach_upload":"attach_upload",
                "change .js_sunxu":"change_sunxu",
                "click .js_next_user":"set_next_user",
                "click .js_search_dept":"selected_dept",
                "click .js_withdraw":"withdraw",
                "click .js_delete":"delete_process",
                "click .js_diagram":"diagram",
                "click .js_remind":"remind",
                "click .js_more_normal":"more_normal",
                "click .js_span_common":"set_optionion",
                "click .js_termination":"termination",
                "click .js_circularize":"circularize",
                "click .js_urgency":"set_urgency",
                "click .js_secret":"set_secret",
                "click .js_step_sel":"step_sel",
                "click .js_watch":"watch",
                "click .js_close_dept":"del_selected_dept",
                "click .form-category-hd":"form_slideToggle",
                "click .js_del_file":"del_file",
                "click .js_del_attach":"del_attach",
                "change input[name=transition]":"checknextstep",
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
            slide_form:function(e){
            	var current=$(e.currentTarget);
            	if(current.hasClass("fa-angle-double-down")){
            		current.removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
            	}else if(current.hasClass("fa-angle-double-up")){
            		current.removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
            	}
            	
            	current.parent().next().slideToggle(1000);
            },
            restart:function(e){
            	_this=this;
            	 var current=$(e.currentTarget);
            	 var processcode=current.data("id");
            	 var taskcode=current.data("taskcode");
            	 var commonModel=new mdboss.Model.commonModel();
            	 commonModel.save({"usercode":mdboss.usercode},{url:mdboss.api.processrestart,success:function(m, res){
            		 if(res.rc==1){
            			 mdboss.notifyTips("回退至拟办人成功！");
            			 _this.dialog.close();
            		 }else{
            			 mdboss.error(res.msg);
            		 }
            	 },error:function(m,res){
            		 mdboss.error("请求接口失败！");
            	 }});
            },
            changeModel:function(e){
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
            		formsbody.find(".timeline").show();
            		formsbody.find(".timeline").find(".jspContainer").css("width","187px");
            		formdata=jQuery.extend(true,{}, init_this.orginformdata);//复制一份在普通模式时使用
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
            	 _this = this;
	           	 var $current=$(e.currentTarget);
	           	 $current.parent().remove();
	           	 //删除下一处理人操作
	           	 if( _this.$el.find("#selected_next_handler .file-show").length == 0 ){//
	           		var next_step=_this.$el.find('input[name=transition]:checked').val();
	           		 if(next_step){
	           			$.each(_this.candidatesteps,function(index,item){
	   	        		 if(item.transition.transitionid==next_step){
	   	        			 //TODO 只有一个人的时候
	   	        			 if(item.handleinfo && item.handleinfo.nextuser){
	   	        				 if( item.handleinfo.nextuser.length==1){
	        	        				_this.$el.find(".js_next_user").hide();
	        	        				_this.rendernextuser(item.handleinfo.nextuser);
	        	        				 handleFlag = false;
	        	        				// return false;
	        	        			 }//else 
	        	        			 if(item.handleinfo.nextuser.length>=2){//大于等于2
	        	        				 _this.$el.find(".js_next_user").hide();
	        	        				 handleFlag = false;
	        	        				 var selectype=item.selectpersonconfig.selecttype;
	        	        				 if(selectype=="radio"){
	        	        					var template=Handlebars.compile($("#next-user-radio-template").html());
	        	        					var uuid=mdboss.getuuid();
	        	        					var html=template({"users":item.handleinfo.nextuser,"uuid":uuid});
	        	        					_this.$el.find("#selected_next_handler").html(html);
	        	        				 }else if(selectype=="checkbox"){
	        	        					var template=Handlebars.compile($("#next-user-checkbox-template").html());
	        	        					var uuid=mdboss.getuuid();
	        	        					var html=template({"users":item.handleinfo.nextuser,"uuid":uuid});
	        	        					_this.$el.find("#selected_next_handler").html(html);
	        	        				 }
	        	        			 }
	   	        			 }else{
	   	        				_this.rendernextuser(item.selectedvalues);
	   	        				return false;
	   	        			 }
	   	        		 }
	   				});
	           		 }
	           	 }
  			// _this.dialog.find(".jscroll").jScrollPane({"autoReinitialise": true});
            },
            watch:function(e){
            	var $this  = $(e.currentTarget);
            	var processinstcode = $this.attr("data-id");
            	var watched = $this.attr("watched");//true 取消关注, false 关注
            	//关注
            	if(watched == "false"){
            		var processWatch =new mdboss.Model.commonModel({"usercode":mdboss.usercode,"processinstcode":processinstcode,"type":"watched"});
            		processWatch.save({},{url:mdboss.api.taskWatch,success: function (model,data) {
            			if(data.rc == "1"){
            				mdboss.notifyTips("关注成功");
            				$this.attr("watched", "true");
            				$this.html('<i class="icon-wrench"></i>取消关注');
            			}else{
            				mdboss.error(data.msg);
            			}
            		},error:function(){
            			mdboss.error();
            		}});
            	}else{
            		//取消关注  
            		var cancelwatch =new  mdboss.Model.commonModel({"usercode":mdboss.usercode,"processinstcode":processinstcode,"type":"cancel"});
            		cancelwatch.save({},{url:mdboss.api.taskWatch,success: function (model,data) {
            			if(data.rc == "1"){
            				mdboss.notifyTips("取消关注成功");
            				$this.attr("watched", "false");
            				$this.html('<i class="icon-star iconfont"></i>关注');
            			}else{
            				mdboss.error(data.msg);
            			}
            		},error:function(){
            			mdboss.error();
            		}});
            	}
            
            },
            step_sel:function(e){
            	_this=this;
            	$(e.currentTarget).closest("ul").find("li").each(function(){
            		var text=$.trim($(this).text());
            		$(this).find("label span ").removeClass("next-step-checked").addClass("next-step-unchecked");
            	});
            	var $current=$(e.currentTarget);
    			$current.removeClass("next-step-unchecked").addClass("next-step-checked");
    			_this.$el.find("#selected_next_handler").html("");
    			
    			var handleFlag = true;
    			//下一环节处理人
    			var currentradio=$(e.currentTarget).closest("li").find('input[name=transition]');
    			var next_step= currentradio.val();
    			var nodename=currentradio.data("name");
    			if(nodename=="代理人审批"){
    				var template = Handlebars.compile($("#nextperson-show-template").html());
    				var $gzdlr=_this.$el.find("#gzdlr");//工作代理人，配置表单元素需要固定为gzdlr
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
					_this.$el.find("#selected_next_handler").html(template({"persons":[val]}));
    			}else{
        			 if(next_step){
        				$.each(_this.candidatesteps,function(index,item){
        	        		 if(item.transition.transitionid==next_step){
        	        			 //TODO 只有一个人的时候
        	        			 if(item.handleinfo && item.handleinfo.nextuser){
        	        				 if( item.handleinfo.nextuser.length==1){
             	        				_this.$el.find(".js_next_user").hide();
             	        				_this.rendernextuser(item.handleinfo.nextuser);
             	        				 handleFlag = false;
             	        				// return false;
             	        			 }//else 
             	        			 if(item.handleinfo.nextuser.length>=2){//大于等于2
             	        				 _this.$el.find(".js_next_user").hide();
             	        				 handleFlag = false;
             	        				 var selectype=item.selectpersonconfig.selecttype;
             	        				 if(selectype=="radio"){
             	        					var template=Handlebars.compile($("#next-user-radio-template").html());
             	        					var uuid=mdboss.getuuid();
             	        					var html=template({"users":item.handleinfo.nextuser,"uuid":uuid});
             	        					_this.$el.find("#selected_next_handler").html(html);
             	        				 }else if(selectype=="checkbox"){
             	        					var template=Handlebars.compile($("#next-user-checkbox-template").html());
             	        					var uuid=mdboss.getuuid();
             	        					var html=template({"users":item.handleinfo.nextuser,"uuid":uuid});
             	        					_this.$el.find("#selected_next_handler").html(html);
             	        				 }
             	        			 }
        	        			 }else{
        	        				_this.rendernextuser(item.selectedvalues);
        	        				return false;
        	        			 }
        	        		 }
        				});
        			}
    			}
     			
    			 if(handleFlag){
    				 _this.$el.find(".js_next_user").show();
    			 }
    			
    			if($.trim($current.text())=="结束"){ //TODO
    				$current.closest(".js-handlediv").next().hide();
    				_this.$el.find(".js-nexthandlerdiv").slideUp();
    				_this.$el.find("#common_opinion").hide();
     				_this.$el.find("#read_opinion").show();
                	
    			}else{
    				$current.closest(".js-handlediv").next().show();
    				_this.$el.find(".js-nexthandlerdiv").slideDown();
    				_this.$el.find("#common_opinion").show();
     				_this.$el.find("#read_opinion").hide();
    			}
            },
            rendernextuser:function(nextuser){//渲染下一处理人
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
            circularize:function(e){
            	_this=this;
//            	seajs.use("circularize", function () {
//            		var model=new mdboss.Model.circularize({"processinstcode":_this.processinstcode,"taskcode":_this.taskcode});
//            		var circularizeView=new mdboss.View.processCircularize({model:model,"el":_this.$el});
//            		circularizeView.render();
//            	});
            	var reqData = {};
            	mdboss.reqsubmit(reqData, mdboss.api.toShare, function(m, data){
            		if(data.rc=="1"){
            			var selectpersonconfig = data.data.selectpersonconfig;
            			var selecttype = selectpersonconfig.selecttype;
            			var selectitems = selectpersonconfig.selectitems;
            			seajs.use("selectMember", function (s) {
            	      		 new mdboss.View.membersView({model:new mdboss.Model.showUserType( 
            	      			 {obj:selectitems, "selecttype":selecttype,
            	      				 "circularize":true, 
            	      				 "processinstcode":_this.processinstcode, 
            	      				 "taskcode":_this.taskcode
            	      			 }
            	           )});
            	      	 });
            		}else{
            			mdboss.error(data.msg);
            		}
            	});
            	//end
            },
            termination:function(e){
            	_this=this;
            	mdboss.confirm("确定要终止吗？",function(param){
            		if(param){
            			var termination=new mdboss.Model.terminationProcess();
            			termination.save({"usercode":mdboss.usercode,"processinstcode":_this.processinstcode,"taskcode":_this.taskcode},
            					{success:function(){
            						mdboss.notifyTips("流程已终止");
            				seajs.use("process", function (process) {
            					_this.dialog.close();
            					Backbone.history.loadUrl();
            					});
            				
            			},error:function(){
                			mdboss.error();
                		}});	
            		}
            		
            	});
            },
            set_optionion:function(e){
            	_this=this;
           	 var content=$(e.currentTarget).data("content");
           	_this.$el.find("#opinion").val(content);
           	_this.$el.find("#readopinion").val(content);
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
            diagram:function(e){
            	_this=this;
             var $target=$(e.target);
           	 var id=$target.data("id");
           	 var title = "流程跟踪";
           	if(_this.data.url == mdboss.api.loaddraft){
           		title = "查看流程图";
           	}
           	 var dialog=new Dialog({
                    type: "html",
                    value: '<div class="loading"></div>',
                    fillCallback:function(){
                        $(this).find(".scrollwrapper").jScrollPane();
                    }
                }, {"title":title,"width":"963px","height":"562px","layer":false,"icon":"iconfont icon-mdliucheng","resize":function(){
                	 $(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
                    }}).show(function(){
	                   	 $dialog=this;
	                   	if(_this.data.url==mdboss.api.loaddraft){
		                   	 seajs.use("preViewDiagram", function () {
		                		 var model=new mdboss.Model.preViewDiagramModel();
		                		 var diagramView=new mdboss.View.preViewDiagramView({processcode:id,is_edit:false,model:model,$el:$($dialog.dialog)});
		                		 diagramView.render({"processinstcode":_this.data.$data.data("processcode")});
		                	 });
		               	 }else{
		               	 	seajs.use("diagram", function () {
		                  		 var model=new mdboss.Model.diagramModel();
		                  		 var diagramView=new mdboss.View.diagramView({model:model,$el:$($dialog.dialog).find(".dialog-content")});
		                  		 diagramView.render({"processinstcode":_this.processinstcode,"usercode":mdboss.usercode});
		                  	 });
		               	 }
                    });
            },
            remind:function(e){
            	var $this  = $(e.currentTarget);
            	var processinstcode = $this.data("id");
            	var taskcode = $this.data("taskcode");
            	 seajs.use(["remind"],function(remind){
         			rd =  new mdboss.View.processRemind({model:new mdboss.Model.processRemind(
         					{"processinstcode":processinstcode,"taskcode":taskcode})});
         		 });
            },
            withdraw:function(){
            	var _this = this;
            	mdboss.confirm("确定要撤回吗？",function(param){
            		if(param){
            			var widthdraw=new mdboss.Model.withdraw();
                		widthdraw.save({"usercode":mdboss.usercode,"processinstcode":_this.processinstcode,"taskcode":_this.taskcode},
                				{success:function(){
                			mdboss.notifyTips("撤回成功"); 
                			Backbone.history.loadUrl();
                		   _this.dialog.close();
               		 },error:function(){
             			mdboss.error();
             		}});	
                		
            		}
            		
            	});
            },
            delete_process:function(){
            	_this=this;
            	mdboss.confirm("确定要删除吗？",function(param){
            		if(param){
            			var del=new mdboss.Model.deleteProcess();
            			del.save({"usercode":mdboss.usercode,"processinstcode":_this.processinstcode},
            					{success:function(){mdboss.notifyTips("删除成功");
            				Backbone.history.loadUrl();
            				_this.dialog.close();
            			},error:function(){
                			mdboss.error();
                		}});	
            		}
            		
            	});
            },
            personProcess:function(e){//TODO
            	var _this=this;
            	var taskcode=$(e.currentTarget).parent().attr("stepcode");
            	seajs.use("queryprocesspart", function () {
           		 var view=new mdboss.View.processPart({data:_this.taskPersons[taskcode],
           			 processinstcode:_this.processinstcode,taskcode:_this.taskPersons[taskcode].taskcode,targettaskcode:taskcode,layer:false});
           		 _this.dialog_person=view.dialog;
           	 });
            },
            personClickProcess:function(e){//TODO
            	var _this=this;
            	var taskcode=$(e.currentTarget).parent().attr("stepcode");
            	seajs.use("queryprocesspart", function () {
           		 var view=new mdboss.View.processPart({data:_this.taskPersons[taskcode],
           			 processinstcode:_this.processinstcode,taskcode:_this.taskPersons[taskcode].taskcode,targettaskcode:taskcode,layer:true});
           	 });
            },
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
           submit:function(e){
        	   var s_this=this;
        	   var $current=$(e.currentTarget);
        	   if($.trim($current.text())=="已阅"){
        		  s_this.$el.find("#isread").attr("data-val","1");
        	   }
        	   var form_data = s_this.$el.find(".processform").triggerHandler( "submitForm" );
//        	   if($current.attr("vel") == "read"){
//        		   form_data = true;
//        	   }// 
      	      if ( form_data ) {
               	var data=s_this.formdata("submit");
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
               	var tmpsubmitdata=s_this.dynamicdata.tmpsubmitdata;//提交处理差异化数据
	          	for(var key in tmpsubmitdata){
             		var val=tmpsubmitdata[key];
             		if(typeof val=="object"){
             			data.formdata[key]=val;
             		}
             	}

	          //校验特殊必填字段
        	   s_this=this;
 	          	var requirename;
 	          	var checkerror=false;
 	          	s_this.$el.find("input[type=hidden][data-required=true]").each(function(c,require){
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
  	          	s_this.$el.find("input[type=hidden][data-check=true]").each(function(c,require){
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
//             	var isread=s_this.$el.find("#isread").data("val");//判断是否显示下一处理人，下一环节
//             	if(!isread){
//             		if(s_this.nextstep==undefined||s_this.nextstep==""){
//                		mdboss.notifyTips("请选择下一处理环节");
//                		return false;
//                	}
//                 	if(s_this.nextuser.length==0){
//                		mdboss.notifyTips("请选择下一处理人");
//                		return false;
//                	}
//             	}
             	$("#submit-loading-mask").show();
             	$("#submit-loading").show();
             	s_this.$el.find(".js_submit").attr("disabled", true);
             	var commonModel=new mdboss.Model.commonModel();
            	if(s_this.data.url==mdboss.api.loaddraft){
             		//点击草稿进入，点击提交
             		commonModel.save(data,{url:mdboss.api.startTask,success:function(model,response){
             			$("#submit-loading-mask").hide();
             			$("#submit-loading").hide();
             			s_this.$el.find(".js_submit").attr("disabled", false);
             			if(response.rc==1){
             				mdboss.notifyTips("流程启动成功");
             				s_this.dialog.close();
             				Backbone.history.loadUrl();
             			}else{
             				mdboss.error(response.msg);
             			}
             		},error:function(){
             			s_this.$el.find(".js_submit").attr("disabled", false);
             			$("#submit-loading-mask").hide();
             			$("#submit-loading").hide();
             			mdboss.error();
             		}});
             	}else{
             		var submitTask=mdboss.api.submitTask;
             		 if($current.attr("vel") == "read"){
             			 submitTask=mdboss.api.processreaded;
             		 } 
//             		if(isread){
//             			 submitTask=mdboss.api.processreaded;
//             		}
             		commonModel.save(data,{url:submitTask,success:function(model,response){
             			if(response.rc==1){
                   			Backbone.history.loadUrl();
                   			s_this.dialog.close();    
                   		}else{
                   			mdboss.error(response.msg);
                   		}
             			s_this.$el.find(".js_submit").attr("disabled", false);
               			$("#submit-loading-mask").hide();
             			$("#submit-loading").hide();
	               	},error:function(){
	               		s_this.$el.find(".js_submit").attr("disabled", false);
	               		$("#submit-loading-mask").hide();
	         			$("#submit-loading").hide();
	         			mdboss.error();
	               	}});
             	}
               
      	      }else{
      	    	 mdboss.notifyTips("请填写必填项！");
      	      }
           
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
          	 
          	 var data="";
          	//区分流程启动和一般任务处理
          	var processcode=_this.data.$data.data("processcode");//流程编码
            	 $.each(_this.candidatesteps,function(index,item){
            		 if(item.transition.transitionid==next_step){
            			 seajs.use("selectHandler", function () {
                     		 var data={
                     				"selectedvalues":selectedValues,
                     				 "obj":item.selectpersonconfig.selectitems,
                     				 "processcode":processcode,//
                     				 "transition":next_step,
                     				 "istask":true,
                     				 "callbackObj":_this,//回调函数所在对象
                     				 "selecttype":item.selectpersonconfig.selecttype,
                     				 "element":_this.$el.find("#selected_next_handler"),
                     				 "replaceCallbacks":_this.replaceOpinion,
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
           updateOpinion:function(data,obj){
          	obj.$el.find("#opinion").val(data); 
           },
           formdata:function(type){
         	  var f_this=this;
         	  	
             	var opinion="";//处理意见
             	if(f_this.$el.find("#opinion")){
             		opinion = f_this.$el.find("#opinion").val();
             	}
             	
             	var result="";//审核结果
            	if(f_this.$el.find('input[name=result]').length>0){
            		result = f_this.$el.find('input[name=result]:checked').val();
            		if(result == undefined || result==""){
            			if(type == "submit"){
            				result ="";
            				return "resultNull";
            			}
            		}
            	}
            	
             	
            	var isread=f_this.$el.find("#isread").data("val");//判断是否显示下一处理人，下一环节
            	if(isread){//已阅
            		if(f_this.$el.find("#readopinion")){
                 		opinion = f_this.$el.find("#readopinion").val();
                 	}
            	}
            	f_this.nextuser=new Array();
            	var setasfrequence=false;
             	//有下一环节
            	if(f_this.$el.find('input[name=transition]').length>0){
            		f_this.nextstep=f_this.$el.find('input[name=transition]:checked').val();//下一环节
            		
            		var transitionname = f_this.$el.find('input[name=transition]:checked').attr("data-name");
            		if(transitionname==undefined&&type=="submit"){
            			return "transitionnameNull";
            		}
            		if("结束" != $.trim(transitionname)){
	                 	f_this.$el.find("#selected_next_handler .file-show a:first-child").each(function(index,item){
	                 		var realcode=$(item).attr("real_code").split("_");
	                		var pcode=realcode[0];
	                		var code=realcode[1]==undefined?"":realcode[1];
	                		var name=$(item).data("name");
	                		if(code==""){
	                			f_this.nextuser.push({"pcode":pcode,"name":name});//下一处理人
	                		}else{
	                			f_this.nextuser.push({"code":code,"pcode":pcode,"name":name});//下一处理人
	                		}
	                 	});
	                 	var nextuserradio=f_this.$el.find("input[name=nextuser-radio]:checked");
	                 	if(nextuserradio&&nextuserradio.length>0){
	                 		var pcode=nextuserradio.data("pcode");
		                 	var code=nextuserradio.data("code");
		                 	var name=nextuserradio.data("name");
		                 	if(code==""){
	                			f_this.nextuser.push({"pcode":pcode,"name":name});//下一处理人
	                		}else{
	                			f_this.nextuser.push({"code":code,"pcode":pcode,"name":name});//下一处理人
	                		}
	                 	}
	                 	f_this.$el.find("input[name=nextuser-checkbox]:checked").each(function(i,item){
	                 		var pcode=$(item).data("pcode");
		                 	var code=$(item).data("code");
		                 	var name=$(item).data("name");
		                 	if(code==""){
	                			f_this.nextuser.push({"pcode":pcode,"name":name});//下一处理人
	                		}else{
	                			f_this.nextuser.push({"code":code,"pcode":pcode,"name":name});//下一处理人
	                		}
	                 	});
	                 	
	                 	
            		}
                 	
                 	if(f_this.$el.find("#setCommonLang").is(":checked")){
                 		setasfrequence=true;
                 	}
            	}
             	
             	var handleinfo={"opinion":opinion,"transition":f_this.nextstep,"nextuser":f_this.nextuser,"result":result,"setasfrequence":setasfrequence};
             	f_this.dynamicdata=f_this.dynamicView.getformsdata();
             	console.log(f_this.dynamicdata);
            	var formsdata=f_this.dynamicdata["formpost"];
             	var data="";
             	if(f_this.data.url==mdboss.api.loaddraft){
             		data={"usercode":mdboss.usercode,"processinstcode":f_this.processinstcode,"processcode":f_this.data.$data.data("processcode"),"processformtype":f_this.processformtype,"handleinfo":handleinfo,"formdata":formsdata};
             	}else{
             		data={"usercode":mdboss.usercode,"taskcode":f_this.taskcode,"processinstcode":f_this.processinstcode,"processformtype":f_this.processformtype,"handleinfo":handleinfo,"formdata":formsdata};
             	}
             	var transtionname=f_this.$el.find('input[name=transition]:checked').data("name");
            	if(type == "submit"){
             		if(!isread&&transtionname!="结束"){
                 		if(f_this.nextstep==undefined||f_this.nextstep==""){
                 			return "transitionnameNull";
                    	}
                     	if(f_this.nextuser.length==0){
                     		return "nextuserNull";
                    	}
                 	}
             	}
             	return data;
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
        								html.push('<a  class="file_view js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
        								html.push('<a  href="'+baseConfig.avatar_url+item.id+'" class="filename_view fa fa-download" target="_blank"></a>');
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
								html.push('<a  class="file_view  js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
								html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="filename_view fa fa-download" target="_blank"></a>');
								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
								html.push('</span>');
		                    	$("#maindoc_file_show").append(html.join(''));
		                    	_this.dialog.find(".jscroll").jScrollPane();
  	                        	 //$("#maindoc_file_show").append('<span style="background-color: #E4E4E4;margin-right: 5px;font-size: 14px;border-radius: 5px;">'+item.name+'<button type="button" data-fileid="'+item.id+'"  class="close_file js_del_file" title="删除">×</button></span>');
  	                         }
                  			 _this.dialog.find(".jscroll").jScrollPane();
//                      		 mdboss.notifyTips("文件上传成功！");
                       }else{
                      	 mdboss.notifyTips("文件上传失败！");
                       }
                   }
                  },
                   error: function(data, status, e){
                	   mdboss.notifyTips(e);
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
 		  								html.push('<a  class="file_view js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
 		  								html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="filename_view fa fa-download" target="_blank"></a>');
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
 		  								html.push('<a class="file_view js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
 		  								html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="filename_view  fa fa-download" target="_blank" ></a>');
 		  								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
 		  								html.push('</span>');
 		  								$("#attach_file_show").append(html.join(''));
  	                    			 	//$("#attach_file_show").append('<span style="background-color: #E4E4E4;margin-right: 5px;font-size: 14px;border-radius: 5px;">'+item.name+'<button type="button" data-fileid="'+item.id+'"  class="close_file js_del_attach" title="删除">×</button></span>');
  	                    		 }
                      			 _this.dialog.find(".jscroll").jScrollPane();
//  	                    		mdboss.notifyTips("文件上传成功！");
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
	   		commonModel.save({"serialcode":xuhao,"usercode":mdboss.usercode},
	   			{ url: mdboss.api["queryZihao"],//接口地址
   	               success:function(model,result) {
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
   	               }
   	           });
           	
           }
           ,
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
    				   		commonModel.save({"serialcode":zihao,"usercode":mdboss.usercode},{url: mdboss.api["sunxu"],success:function(model,result){
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
  			            		  mdboss.notifyTips("添加字号失败");
  			            	   }
  			               
    				   		}});
    					});
    					//点击取消
    					$(".btn-sm").click(function() {
    						_this.close();
    					});
                    });
           }
           ,
           save:function(e){
        	   s_this=this;
        	   //保存操作对表单不校验
        	   var form_data = true;//_this.$el.find(".processform").triggerHandler( "submitForm" );
        	   $("#submit-loading").show();
     	      if ( form_data ) {
     	    		var saveTask=new mdboss.Model.saveTask();
     	           	var submitTask=new  mdboss.Model.submitTask();
     	           	var postdata=s_this.formdata("save");
     	           	var tmpsave=s_this.dynamicdata.tmpsavedata;//保存时差异化数据
	   	          	for(var key in tmpsave){
	                		var val=tmpsave[key];
	                		if(typeof val=="object"){
	                			postdata.formdata[key]=val;
	                		}
	                }
	   	          	
	             	if(s_this.data.url==mdboss.api.loaddraft){
	             		var commonModel=new mdboss.Model.commonModel();
	             		//点击草稿进入，点击保存
	             		commonModel.save(postdata,{url:mdboss.api.startSaveTask,success:function(model,res){
	             			if(res.rc==1){
	             				s_this.$el.find(".dialog-content .loading_button").remove();
	             				mdboss.notifyTips("保存成功！");
	             			}else{
	             				 mdboss.error(res.msg);
	             			}
	             			$("#submit-loading").hide();
	             			
	             		},error:function(){
	    	            	   mdboss.error();
	    	            	   $("#submit-loading").hide();
	    	             }});
	             	}else{
	             		//TODO 添加判断传阅
	             		saveTask.save(postdata,{success:function(model,res){
	             			if(res.rc==1){
	             				mdboss.notifyTips("保存成功！");
	             			}else{
	             				mdboss.error(res.msg);
	             			}
	     	           		
	     	           	},error:function(){
	    	            	   mdboss.error();
	    	             }});
	             	}
	        		
     	      }else{
     	    	 mdboss.notifyTips("请填写必填项！");
     	      }
            
           },
           print:function(e){
        	v_this=this;
        	window.open("#print/"+this.processinstcode+"/"+this.taskcode);
           },
           send:function(e){
        	   _this=this;
        	   var text=$(e.currentTarget).attr("title");
        	   if(text=="已阅"){
        		   _this.$el.find(".js_ishide").hide();
        		   _this.$el.find("#submit-common").hide();
        		   _this.$el.find("#submit-read").show();
        		   _this.$el.find("#read_opinion").show();
        		   _this.$el.find(".js-result-isshow").hide();
        		   _this.$el.find("#common_opinion").hide();
        		   _this.$el.find("#isread").data("val",true);
        	   }else{
        		   _this.$el.find(".js_ishide").show();
        		   _this.$el.find("#submit-common").show();
        		   _this.$el.find("#submit-read").hide();
        		   _this.$el.find("#read_opinion").hide();
        		   _this.$el.find("#common_opinion").show();
        		   
        		   _this.$el.find("#isread").data("val",false);
        	   }
        	   _this.$el.find(".flowOpinion").slideToggle(1000,function(){
        		   _this.$el.find("#opinion").focus();//给文本框焦点。
               		_this.$el.find(".dialog-content").find(".jscroll").jScrollPane({"autoReinitialise": true});
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
             $li.find(".meno-show-1").removeClass("hide");
             $li.find(".meno-change-1").addClass("hide");
        	   var content = $li.find(".meno-value").val();
        	   $li.find(".meno-show-1").html(content).attr("title",content);//meno-value
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
        	   var $current=$(e.currentTarget);
        	   $current.closest("li").find(".meno-show-1").addClass("hide");
        	   $current.closest("li").find(".meno-change-1").removeClass("hide");
        	   $current.next().find("#processMeno2").focus();
           },
           addmeno:function(e){
        	   _this=this;
           	 seajs.use("meno", function () {
           		var menoModel=new mdboss.Model.processMeno();
          		 new mdboss.View.processMeno({model:menoModel,el:_this.$el,_parent:_this});
              		
              	 });
           }
        });

        mdboss.module.creatProcess=function(){
            new mdboss.View.creatProcess();
        };

        mdboss.module.showProcess=function(obj){
        	var current=$(this);
        	if(obj!=undefined){
        		current=obj;
        	}
        	var type=current.data("type");
        	var taskname=current.data("taskname");
        	var titlename=current.attr("title");
        	
        	var title = taskname;
    		if(current.data("processname")){
    			title = current.data("processname")+"-"+(taskname==""?titlename:taskname);
    		}
        	
        	if(type=="watched"){// 关注  "rest/wfs/processinst/view"
        		 new mdboss.View.showProcess({title:title,$data:current,reqtype:"watched",url:mdboss.api.watchsharedone});
        	}else if(type=="share"){//共享 "rest/wfs/processinst/view"
        		 new mdboss.View.showProcess({title:title,$data:current,reqtype:"shared",url:mdboss.api.watchsharedone});
        	}else if(type=="done"){//办结 "rest/wfs/processinst/view"
        		 new mdboss.View.showProcess({title:title,$data:current,reqtype:"complete",url:mdboss.api.watchsharedone});
        	}else if(type=="my-finshed"){// 经办 "rest/wfs/processinst/view"
        		new mdboss.View.showProcess({title:title,$data:current,reqtype:"through",url:mdboss.api.watchsharedone});
        	}else if(type == "history"){
        		new mdboss.View.showProcess({title:title,$data:current,reqtype:"history",url:mdboss.api.watchsharedone});
        	}
        	else if(type=="sub-todo" || type=="mycomplete"){//下属待办， 已办   //"rest/wfs/task/view",
        		new mdboss.View.showProcess({title:title,$data:current,url:mdboss.api.processfinishsubtodo});
        	}else{ //"rest/wfs/task/load"
        		new mdboss.View.showProcess({title:title,$data:current,url:mdboss.api.proecessdefHandle, "view":current.data("view")});////view 查看表单
        	}
        };
        
        mdboss.module.draftProcess=function(){
        	var title=$(this).data("processname");
        	var taskname=$(this).data("taskname");
        	new mdboss.View.showProcess({title:title+"-"+taskname,$data:$(this),url:mdboss.api.loaddraft});
        };
    };

    module.exports = processInfo;
});
