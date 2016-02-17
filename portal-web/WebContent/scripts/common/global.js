/**
 * Created by 2goyoung on 2015/5/11.
 */


define(function (require, exports, module) {
    var $ = require("jquery");
    require("bootstrap")($);
    require("backbone");
    require("upload");
    require("scroll");
    require("json");
    require("fileinput");
    require("fullcalendar");
    require("datetimepicker");
    require("bootbox");
    var Dialog=require("dialog");
    require("notify")($);
    require("select2");

    Backbone.emulateJSON = true;
   
    var global = function (mdboss) {
    	
    	//日期比较
    	mdboss.compareDate=function(start, end) {
//    			console.log(start+"="+end);
    		    var arr = start.split("-");
    		    var starttime = new Date(arr[0], arr[1], arr[2]);
    		    var starttimes = starttime.getTime();

    		    var arrs = end.split("-");
    		    var lktime = new Date(arrs[0], arrs[1], arrs[2]);
    		    var lktimes = lktime.getTime();

    		    if (starttimes > lktimes) {
//    		        mdboss.error('开始时间大于离开时间!');
    		        return false;
    		    }
    		    else
    		        return true;
    		};
    	
    	//获取元素的值
    	mdboss.elementValue=function(pview , reqData, id){
       	    reqData[id] = pview.$el.find("#"+id).val() ? pview.$el.find("#"+id).val():null;
        };
    	
    	//下拉选 东西
    	mdboss.select=function(e, reqData, url, ele, code, name,callback){

       	 	var $this  = $(e.currentTarget);
       	 	var oldCode = $this.data("code");
       	 	var oldValue = $this.val();
    		//事件判断 
    		if(e.type == "keyup" || e.type == "keypress" || e.type == "keydown"){
	   			 if(e.which != 13){
	   				 return;
	   			 }
		 	}else{
		 		$this.val("");
		 	}

			$this.closest(".remind-user").find(".loading_small").show();
			$this.closest(".remind-user").find(".userselectlist").empty();
			
			var commonModel=new mdboss.Model.commonModel();
			var condition = new Array();
			if( $this.val()){
				condition.push({"key":"username","operate":"Like","v1":$this.val()});
			}
	   		commonModel.save(reqData ,{url: url, success:function(model,data){
            	if(data.rc == 1){
	            	$this.closest(".remind-user").find(".loading_small").hide();
	            	var html =new Array('<p class="employee" style="width:205px" id="" name=""><span>取消</span></p>');
//	            	var html =new Array( );
	            	var tmp =  data.data.rows;
	            	for(var i=0; i<tmp.length; i++){
	            		 var recordjson=JSON.stringify(tmp[i]);
	            		 html.push('<p class="employee" customstr=');
	            		 html.push('\''+recordjson+'\'');//字符串json转义;
	            		 html.push(' style="width:205px" id="');
	            		 html.push(tmp[i][code]);
	            		 html.push('" name="');
	            		 html.push(tmp[i][name]);
	            		 html.push('">');
	            		 html.push('<span>');
	            		 html.push(tmp[i][name]);
	            		 html.push('</span></p>');
	            	}
	            	$this.closest(".remind-user").find(".userselectlist").show();
	            	$this.closest(".remind-user").find(".userselectlist").append(html.join(''));
        			
	            	$(".employee").click(function(){
	            		var code  = $(this).attr("id");
	            		var name  = $(this).attr("name");
	            		if(code && name){
	            			$this.val(name);
	            			$this.attr("data-code",code);
	            			$this.closest(".remind-user").find(".userselectlist").hide();
	            			$this.closest("li").find("."+ele).show();
	            			$this.closest("li").find("."+ele).text(name);
	            			var customstr=$(this).attr("customstr");
	            			var callbackFn = typeof callback == "function" ? callback : function () { };
	            			callbackFn(customstr,$this.closest("li").find("."+ele));
	            			$this.hide();
	            		}else{
	            			if($.trim($this.closest("li").find("."+ele).text()) != ""){
	            				$this.attr("data-code",oldCode);
		            			$this.closest("li").find("."+ele).text(oldValue);
	            				$this.closest(".remind-user").find(".userselectlist").hide();
		            			$this.closest("li").find("."+ele).show();
		            			$this.val(oldValue);
		            			$this.hide();
	            			}else{
	            				$this.closest("li").remove();
	            			}
	            		}
	            	});
            	}else{
            		mdboss.error(data.msg);
            	}
            },error:function(){
				mdboss.error();
			}});
        
    	};
    	
    	//排序
    	mdboss.sorting=function(e, orderBy){
    		 var col= $(e.currentTarget).data("col"); 
        	 var $this =  $(e.currentTarget);
        	 var tmpOrder = "";
        	 if(orderBy)
        		 tmpOrder = orderBy+",";
        	 var len = tmpOrder.indexOf(col);
        	 if( len != -1){
        		 var reg = "/"+ col+" (desc|asc),?/";
        		 tmpOrder =  tmpOrder.replace(eval(reg), "");
        	 }
        	
        	 //是默认
        	 if($(e.currentTarget).hasClass("sorting")){
        		 tmpOrder = col +" desc,"+tmpOrder;
        		 $this.removeClass("sorting").addClass("sorting_desc");
        	 } 
        	 //是升序
        	 else if($(e.currentTarget).hasClass("sorting_asc")){
        		 tmpOrder =  col +" desc," + tmpOrder;
        		 $this.removeClass("sorting_asc").addClass("sorting_desc");
        	 } 
        	 //是降序
        	 else if($(e.currentTarget).hasClass("sorting_desc")){
        		 tmpOrder =  col +" asc," + tmpOrder;
        		 $this.removeClass("sorting_desc").addClass("sorting_asc");
        	 }
        	 if(tmpOrder.length>1 && tmpOrder.substring(tmpOrder.length-1, tmpOrder.length)==","){
        		 tmpOrder  = tmpOrder.substring(0, tmpOrder.length-1);
        	 }
//        	 console.log("orderBy:"+tmpOrder);
    		return tmpOrder;
    	};
    	
    	//获取当前时间
    	mdboss.getDate=function(format){
    		 var date=new Date();
//             var current_date=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
             var formt = "yyyy-MM-dd HH:mm:ss";
             if(format){
            	 formt = format;
             }
             return $.fullCalendar.formatDate(date, formt);
    	};
    	mdboss.getQueryString=function(name)
    	{
    		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    		var hash=window.location.hash;
    		var params=hash.substr(hash.indexOf("?")+1);
    		var r = params.match(reg);
    		if (r != null)
    			return unescape(r[2]);
    		return null;
    	};
    	//当前用户信息
    	mdboss.getUserinfo=function(){
    		return mdboss.cache.data["getMyInfo"];
    	};
    	
    	/**
    	 * 通用文件上传函数，基于ajaxfileupload组件
    	 * @paramtype:是否以url参数方式提交自定义参数,默认为true
    	 * 			 经测试上传组件存在缺陷，以非url参数的方式提交自定义参数时，后端不能正常获取
    	 * @data:自定义参数，json格式
    	 */
    	mdboss.fileupload=function(fileid, callback,paramtype,data){
    		if (paramtype == undefined){
    			paramtype = true;
    		}
     		  //上传文件
             $.ajaxFileUpload({
                 url: mdboss.api.fileupload,//处理图片脚本
                 secureuri :false,
                 fileElementId :fileid,//file控件id
                 dataType : 'multipart/form-data',
                 data:data,
                 urlparam:paramtype,
                 type:"post",
                 success : function (data, status){
                     if(data != 'undefined'){
                    	var start=data.indexOf(">");
                    	var end=data.lastIndexOf("<");
                    	var json=eval('(' + data.substring(start+1,end)+ ')');
                    	console.log(json );
                    	if(json!=undefined){
                    		console.log(json);
                    		 var callbackFn = typeof callback == "function" ? callback : function () { };
                    		 callbackFn(json);//[{id:,name:}]
                        }else{
                       		mdboss.notifyTips("文件上传失败！");
                        }
                 }
                },
                 error: function(data, status, e){
              	   mdboss.notifyTips(e);
                }
           });
          
    	};
    	
    	/**
    	 * 通过ajax的方式导出文档
    	 * @model 界面参数
    	 * 
    	 */
    	mdboss.exportFile=function(model){
    		var form=$("<form>");//定义一个form表单
        	form.attr("style","display:none");
        	form.attr("target","blank");
        	form.attr("method","post");
        	form.attr("action",mdboss.api.exportsubmit);
        	var input1=$("<input>");
        	input1.attr("type","hidden");
        	input1.attr("name","model");
        	input1.attr("value",JSON.stringify(modal));
        	$("body").append(form);//将表单放置在web中
        	form.append(input1);
        	form.submit();//表单提交
    	};
  	
    	//加载流程及表单分类--树结构
    	mdboss.loadParentType=function(pview,eleid, clazz, pcode){//加载父分类 
			var v_this = pview;
		   var tmpCondition = new Array();
		   tmpCondition.push({"key":"typeclass","operate":"EqualTo","v1": clazz});
			mdboss.reqsubmit({"usercode":mdboss.usercode,"queryCondition":tmpCondition,"orderBy":"parentcode,sortorder","pageNo":1,"pageSize":0},
					mdboss.api.processtypelist,function(m, res){
				if(res.rc == 1){
					//构造树结构
					var tmpPTypes = new Array();//pcode, array
					var tmp = res.data.rows;
					  for(var i =0; i<tmp.length; i++){
						   if(tmp[i].parentcode == "-1"){
							   tmpPTypes.push({"code":tmp[i].typecode,"name":tmp[i].typename,"pcode":tmp[i].parentcode,"values":new Array()});
						   }else{
							   $.each(tmpPTypes,function(j, item){
								   if(item.code == tmp[i].parentcode){
									   item.values.push(tmp[i]);
								   }
							   });
						   }
					  }
					
					v_this.$el.find("#"+eleid).empty();
					v_this.$el.find("#"+eleid).append('<option value="">请选择</option>');
					
					$.each(tmpPTypes,function(i, item){
						//根
						 var htm ='<option value="'+item.code+'">'+item.name+'</option>';
 						  if(pcode && pcode == item.code){
 							 htm ='<option value="'+item.code+'" selected="selected">'+item.name+'</option>';
 						  }
 						 v_this.$el.find("#"+eleid).append(htm);
 						 //子
						  $.each(item.values, function(j, type){
							  var htm ='<option value="'+type.typecode+'">----'+type.typename+'</option>';
	  						  if(pcode && pcode == type.typecode){
	  							 htm ='<option value="'+type.typecode+'" selected="selected">----'+type.typename+'</option>';
	  						  }
	  						  v_this.$el.find("#"+eleid).append(htm);
						  });
					 });
  					v_this.$el.find("#"+eleid).select2({"width": "300"});
				}else{
					mdboss.error(res.msg);
				}
			});
		};
    	
    	
    	//设置左侧菜单--获取头及左侧菜单 TODO
    	mdboss.setLeftMenu=function(type, modulecode,noscroll){
			//加载框框
	    	if(noscroll){
	    		mdboss.fillWrap(require("text!template/common/wrap__.html"));
	    	}else{
	    		mdboss.fillWrap(require("text!template/common/wrap.html"));
	    	}
    		//左侧菜单 
   	   	 	mdboss.getModulesData(type,modulecode);
    	};
    	
    	mdboss.getModulesData=function(type,modulecode){
    		if(mdboss.cache.data["getModules"]){
	   				modules = mdboss.cache.data["getModules"]["rows"];
			       	 for(var i=0; i<modules.length; i++){
			       		 if(modulecode == modules[i].modulecode){
			       			modulelist = modules[i].childs;break;
			       		 }
			       	 }
			       	var templateMenu = Handlebars.compile(require("text!template/common/left_menu.html"));
					 var htmlMenu= templateMenu({ "type": type,"modulelist":modulelist});
			        $("#leftMenuContainer").html(htmlMenu);
			        $("#leftMenuContainer").mCustomScrollbar("destroy");
		        	$("#leftMenuContainer").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false });
		        	
	   			}else{
	   				setTimeout(function(){mdboss.getModulesData(type,modulecode);},100);
	   			}
    	};
    	

    	//提交请求 请求数据, url地址 ，  回调方法， loading 是不加loading效果 /////--元素id/class ,元素是用于防表单重复提交
    	mdboss.submit=function(reqdata, url, callback, loading, elem){
    		var commonModel=new mdboss.Model.commonModel();//
    		if(loading){
    			$("#submit-loading-mask").show();
    			$("#submit-loading").show();
    		}
    		if(elem){
    			$(elem).attr("disabled", "disabled");
    		}
    		reqdata.usercode = mdboss.usercode;
            commonModel.save(reqdata, {url:url, success:function(m,res){
            	$("#submit-loading-mask").hide();
             	$("#submit-loading").hide();
             	if(elem){
        			$(elem).attr("disabled", "");
        		}
             	//回调
            	 var callbackFn = typeof callback == "function" ? callback : function () { };
            	 if( res.rc == 1){
            		 callbackFn(res);
            	 }else{
            		 mdboss.error(res.msg);
            	 }
            },error:function(m,res){
            	if(elem){
        			$(elem).attr("disabled", "");
        		}
            	$("#submit-loading-mask").hide();
             	$("#submit-loading").hide();
            	mdboss.error();
            }});
    	};
    	
    	//提交请求
    	mdboss.reqsubmit=function(reqdata, url, callback){
    		var commonModel=new mdboss.Model.commonModel();//
    		reqdata.usercode = mdboss.usercode;
            commonModel.save(reqdata, {url:url, success:callback,error:function(m,res){
            	mdboss.error();
            }});
    	};
    	
    	//下拉搜索用户
    	mdboss.userselect=function(e, pview, callback,isdynamic, w){
    		var width = "205px";
    		if(w){
    			width = w;
    		}
    		var $this  = $(e.currentTarget);
    		//事件判断 
    		var sid = $this.attr("id");
    		 if(sid){
	       	 }else{
	       		 sid = $this.data("id");
	       	 }
    		 
    		if(e.type == "keyup" || e.type == "keypress" || e.type == "keydown"){
	   			 if(e.which != 13){
	   				 return;
	   			 }
   		 	}else{
   		 		$("#"+sid).val("");
   		 	}

			$this.closest(".remind-user").find(".loading_small").show();
			$this.closest(".remind-user").find(".userselectlist").empty();
			var commonModel=new mdboss.Model.commonModel();
//			var condition = new Array();
//			if($("#"+sid).val()){
//				condition.push({"key":"username","operate":"Like","v1":$("#"+sid).val()});
//			}"queryCondition":condition
	   		commonModel.save( { "usercode":mdboss.usercode, "pageNo":1,  "pageSize":mdboss.pageSize
	                 ,  "orderBy":"orgcode","keywordFields":["usercode","username","workno"],"keyword":$("#"+sid).val()       //搜索字段
	   		   },{url: mdboss.api.members,success:function(model,data){
            	if(data.rc == 1){
	            	$this.closest(".remind-user").find(".loading_small").hide();
	            	var html =new Array('<p class="employee" style="width:'+width+'" id="" name=""><span>取消</span></p>');
	            	var tmp =  data.data.rows;
	            	for(var i=0; i<tmp.length; i++){
	            		var avatar =tmp[i].avatarcode;
	            		var record={};
	            		for(var key in tmp[i]){
	            			record[key]=tmp[i][key];
	            		}
	            		record=JSON.stringify(record);
	            		if(avatar){
	            			avatar=baseConfig.base+"download?filecode="+avatar;
	            		}else{
	            			avatar = "images/avatar.png";
	            		}
	            		 html.push('<p class="employee" data-record=');
	            		 html.push('\''+record+'\'');//字符串json转义
	            		 html.push(' style="width:'+width+'" id="');
	            		 html.push(tmp[i].usercode);
	            		 html.push('" name="');
	            		 html.push(tmp[i].username);
	            		 html.push('"><img class="avatar" src="');
	            		 html.push(avatar);
	            		 html.push('"><span>');
	            		 html.push(tmp[i].username);
	            		 html.push('</span></p>');
	            	}
	            	$this.closest(".remind-user").find(".userselectlist").show();
	            	$this.closest(".remind-user").find(".userselectlist").append(html.join(''));
        			
	            	$(".employee").click(function(){
	            		var userele  = $(this).attr("id");
	            		var name  = $(this).attr("name");
	            		var userdetail=$(this).data("record");
	            		$this.val(name);
	            		$this.change();//更新后触发当前元素更新事件
	            		if(undefined!=userdetail){
	            			$this.attr("data-code",userdetail.usercode);
	            			$this.attr("data-orgcode",userdetail.orgcode);
	            		}
            			$this.closest(".remind-user").find(".userselectlist").hide();
            			//callback
            			var callbackFn = typeof callback == "function" ? callback : function () { };
            			if(isdynamic){
            				callbackFn(pview,userdetail);
            			}else{
            				callbackFn(pview, userele, name);
            			}
	            	});
            	}else{
            		mdboss.error(data.msg);
            	}
            },error:function(){
				mdboss.error();
			}});
    	};//end 下拉搜索用户
    	
    	
    	//下拉列表数据 获取, 当前view ,元素id, 值, 查询条件, 显示宽度
    	mdboss.dataselect=function(view, elementid, definition, value, width, show){
    		if(width==undefined){
    			width = "200"; 
    		}
  			var commonModel = new mdboss.Model.commonModel();
  			commonModel.save({"usercode":mdboss.usercode,"definition":definition},
  					{url:mdboss.api.queryProcesstype, success:function(m,res){
  				if(res.rc == 1){
  					view.$el.find("#"+elementid).empty();
  					if(show){
  						
  					}else{
  						view.$el.find("#"+elementid).append('<option value="">请选择</option>');
  					}
  	            	var tmp = res.data.rows;
  					  for(var i =0; i<tmp.length; i++){
  						  var htm ='<option value="'+tmp[i].dictcode+'">'+tmp[i].dictname+'</option>';
  						  if(value == tmp[i].dictcode){
  							
  							 htm ='<option value="'+tmp[i].dictcode+'" selected="selected">'+tmp[i].dictname+'</option>';
  						  }
  						  view.$el.find("#"+elementid).append(htm);
  					  }
  					view.$el.find("#"+elementid).select2({"width": width});
  				}else{
  					mdboss.error(res.msg);
  				}
  			},error:function(){
  				mdboss.error();
  			}});
	    };

    	//错误提示
    	mdboss.error=function(message){
    		window.bootbox.setLocale("zh_CN");
    		if(message){
    			window.bootbox.alert(message);
    		}else{
    			window.bootbox.alert("接口请求出错！");
    		}
	    };
    	
    	mdboss.notifyTips=function(message){
	    	mdboss.alert(message);
	    };
	    
	    mdboss.confirm=function(message,callback){
	    	bootbox.setLocale("zh_CN");
	    	bootbox.confirm({  
	            buttons: {   cancel: {   label: '取消'  } ,
	                confirm: {   label: '确认'  }
	            },  
	            message: message,  
	            callback: callback  
	         });  
	    };
	    
	    mdboss.alert=function(message){
	    	window.bootbox.setLocale("zh_CN");
	    	window.bootbox.alert(message);
	    	window.setTimeout(function(){
	    	    bootbox.hideAll();
	    	}, 1000);
	    };
	    
	    mdboss.getuuid=function(){
	    	    var s = [];
	    	    var hexDigits = "0123456789abcdef";
	    	    for (var i = 0; i < 36; i++) {
	    	        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	    	    }
	    	    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	    	    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	    	    s[8] = s[13] = s[18] = s[23] = "-";
	    	 
	    	    var uuid = s.join("");
	    	    return uuid;
	    };
        var $page = mdboss.$pageWrap;

        //选人通用
        mdboss.selectedperson=function(req){
        	var commonModel = new mdboss.Model.commonModel({
        		"usercode":mdboss.usercode
        	});
        	
        	commonModel.save({},{url:mdboss.api.toShare,success:function(m, data){
        		if(data.rc=="1"){
        			var selectpersonconfig = data.data.selectpersonconfig;
        			var selecttype = selectpersonconfig.selecttype;
        			var selectitems = selectpersonconfig.selectitems;
        			seajs.use("selectMember", function (s) {
        	      		 new mdboss.View.membersView({model:new mdboss.Model.showUserType( 
        	      			 {obj:selectitems,"selectedvalues":req.selectedvalues, "selecttype":selecttype,"callbacks":req.callbacks}
        	           )});
        	      		
        	      	 });
        		}else{
        			mdboss.error("加载共享人信息失败！");
        		}
        	},error:function(){
        		mdboss.error();
        	}});
       
    	};
    	
        var timer,userPanelTimer;
        // 弹出筛选框
        $page.on("mouseenter", "#workflow-filter", function(b) {
            var g = $(this).attr("data-toggle");
   		b = setTimeout(function() { $(g).slideDown("fast");},300);
   		$(this).data("showTimer", b);
   		$(this).addClass("open");
        }).on("mouseleave", "#workflow-filter",  function(a) {
        	a = $(this).attr("data-toggle");
            var c = $(this).data("showTimer");
            c && clearTimeout(c);
             $(this).removeData("showTimer");
             $(a).slideUp(100); 
             $(this).removeClass("open");
        });
        /*header Events*/
        $(document).on("click",".js_close_dept",function(e){
        	 var $current=$(e.currentTarget);
        	 $current.parent().remove();
        });
        //左侧菜单的伸缩
        $(document).on("click",".j_rightViewCtrl",function(e){
        	 var $current=$(e.currentTarget);
        	 if($current.hasClass("on")){ //隐藏
        		 $current.removeClass("on");
        		 $current.attr("title","隐藏");
        		 $current.animate({"margin-left":"185px"});
        		 $("#leftMenuContainer").animate({"width": "210px"});
        		 $("#rightMainContainer").animate({"left": "210px"});
        		 $("#leftMenuContainer ul").show(500);
        	 }else{ //显示
        		 $current.addClass("on");
        		 $current.attr("title","显示");
        		 $current.animate({"margin-left":"5px"});
        		 $("#rightMainContainer").animate({"left": "20px"});
        		 $("#leftMenuContainer").animate({"width": "0px"});
        		 $("#leftMenuContainer ul").hide(500);
        	 }
        });
        
        mdboss.checkNavmoreShow=function(){
        	var navheight = $(".navigation .nav").height();
        	if(navheight>50){
        		$("#nav-switcher").removeClass("hide");
        	}else{
        		$("#nav-switcher").addClass("hide");
        	}	
        };
        $(window).on("resize",function(){
        	mdboss.checkNavmoreShow();
        });
//        $page.on("mouseenter",".keyword_search",function(e){
//        	 var $current=$(e.currentTarget);
//        	 var input=$current.find("input");
//        	 input.show().animate({width:"120px"},200,function(){
//        		 input.focus().attr("placeholder",input.next().attr("title"));
//        	 });
//        }).on("mouseleave",".keyword_search ",function(e){
//	       	 var $current=$(e.currentTarget);
//	       	var input=$current.find("input");
//	       	input.removeAttr("placeholder").blur().animate({width:"20px"},200,function(){input.hide();});
//        });
        
        $page.on("click",".js_close_dept",function(){
        	$(this).parent().remove();
        });

		// on click
		$(document).delegate('.lcs_switch:not(.lcs_disabled)', 'click tap', function(e) {
			if( $(this).hasClass('lcs_on') ) {
				if( !$(this).hasClass('lcs_radio_switch') ) {
					mdboss.lcs_off(e);
				}
			} else {
				mdboss.lcs_on(e);	
			}
		});
		

		
		mdboss.lcs_on=function(e) {
            var $wrap = $(e.currentTarget).parents('.lcs_wrap');
			var $input = $wrap.find('input');
			
			$wrap.find('input').click();
			$wrap.find('.lcs_switch').removeClass('lcs_off').addClass('lcs_on');
			
			return true;
        };
        mdboss.lcs_off=function(e){
        	$(e.currentTarget).each(function() {
                var $wrap = $(this).parents('.lcs_wrap');
                $wrap.find('input').click();
				$wrap.find('.lcs_switch').removeClass('lcs_on').addClass('lcs_off');
            });
			
			return true;
        };
		
        
        $page.on("mouseenter", "#user-panel", function () {
            var $this = $(this);
            userPanelTimer = setTimeout(function () {
                $this.addClass("open");
                $this.find(".dropdown-user").stop(true, true).slideDown();
            },200);
            
        }).on("mouseleave", "#user-panel", function () {
            clearTimeout(userPanelTimer);
            $(this).removeClass("open");
            $(this).find(".dropdown-user").stop(true, true).slideUp();
        });
        
        $page.on("mouseover",".js_more_router",function(e){
        	var tengxunmore=$(this).find(".tengxun-more-channels");
        	if(tengxunmore.length>0){
        		$(this).closest(".nav-wrap").css("height","85px");
        		tengxunmore.show();
        	}
		 }).on("mouseout",".js_more_router",function(e){
			var tengxunmore=$(this).find(".tengxun-more-channels");
			if(tengxunmore.length>0){
				$(this).closest(".nav-wrap").css("height","48px");
				tengxunmore.hide(); 
			}
		 });
        //为选中的栏目加背景色
        $page.on("click",".js_more_router",function(e){
        	$(this).find(".router").addClass("active");
        	$(this).siblings().find(".router").removeClass('active');
        });
        
        $page.on("mouseenter",".user-tab li",function(){
        	var $self=$(this);
        	if( $(this).attr("data-items") == "user_org"){
        		 var commonModel=new mdboss.Model.commonModel();
        		 commonModel.save({"usercode":mdboss.usercode,
        			 "type":"flat",    //查询类型
        			 "pageNo":1,       // 第一页
        			 "pageSize":20,    // 每页10条记录	 
        		 	},
        		 	{url:baseConfig.base+"rest/ucp/org/"+mdboss.cache.data.getMyInfo.orgcode+"/members",success:function(m, data){
        			
        			 if(data.rc==1){
        				 var html=new Array();
        				 $.each(data.data.rows, function(i, item){
        					 if(item.avatarcode!="" && item.avatarcode!=null){
        						 item.avatarcode = baseConfig.base+"download?filecode="+item.avatarcode;
     		   				}else{
     		   					item.avatarcode="images/avatar.png";
     		   				}
        					 var li = '<li class="user-item j_clickhide" user-id="'+item.usercode+'" title="'+item.username+'"><a class="fl router user-item-cart" ><img src="'+item.avatarcode+'" class="avatar"><em class="ellipsis">'+item.username+'</em></a></li>';
        					 html.push(li);
        				 });
        				 if(html.length>0){
        					 $("#user_org").html(html.join(""));
        				 }
        			 }else{
        				 mdboss.error(data.msg);
        			 }
        		 },error:function(){
        			 mdboss.error();
        		 }});
        	}else if( $(this).attr("data-items") == "user_follow"){
	       		 var commonModel=new mdboss.Model.commonModel();
	    		 commonModel.save({"usercode":mdboss.usercode},
    		 	{url:mdboss.api.getMyFollower,success:function(m, data){
    			 if(data.rc==1){
    				 var html=new Array();
    				 $.each(data.data.rows, function(i, item){
    					 if(item.avatarcode!="" && item.avatarcode!=null){
    						 item.avatarcode = baseConfig.base+"download?filecode="+item.avatarcode;
 		   				}else{
 		   					item.avatarcode="images/avatar.png";
 		   				}
    					 var li = '<li class="user-item j_clickhide" user-id="'+item.usercode+'" title="'+item.username+'"><a class="fl router user-item-cart" ><img src="'+item.avatarcode+'" class="avatar"><em class="ellipsis">'+item.username+'</em></a></li>';
    					 html.push(li);
    				 });
    				 if(html.length>0){
    					 $("#user_follow").html(html.join(""));
    				 }
    			 }else{
    				 mdboss.error(data.msg);
    			 }
    		 },error:function(){
    			 mdboss.error();
    		 }});
    	}else  if( $(this).attr("data-items") == "user_mysub"){
       		 var commonModel=new mdboss.Model.commonModel();
    		 commonModel.save({"usercode":mdboss.usercode},
    		 	{url:mdboss.api.getMySubordinate,success:function(m, data){
    			 if(data.rc==1){
    				 var html=new Array();
    				 $.each(data.data.rows, function(i, item){
    					 if(item.avatarcode!="" && item.avatarcode!=null){
    						 item.avatarcode = baseConfig.base+"download?filecode="+item.avatarcode;
 		   				}else{
 		   					item.avatarcode="images/avatar.png";
 		   				}
    					 var li = '<li class="user-item j_clickhide" user-id="'+item.usercode+'" title="'+item.username+'"><a class="fl router user-item-cart" ><img src="'+item.avatarcode+'" class="avatar"><em class="ellipsis">'+item.username+'</em></a></li>';
    					 html.push(li);
    				 });
    				 if(html.length>0){
    					 $("#user_mysub").html(html.join(""));
    				 }
    			 }else{
    				 mdboss.error(data.msg);
    			 }
    		 },error:function(){
    			 mdboss.error();
    		 }});
    	}
            setTimeout(function(){
                $self.addClass("active").siblings(".active").removeClass("active");
                $("#"+$self.data("items")).show().siblings().hide();
            },200);

        });

//        $page.on("click","#navigation .router",function(){
//            mdboss.Router.navigate($(this).attr("href"), {
//                trigger: true
//            });
//            return false;
//        });
        
        
        //下拉菜单
        $page.on("mouseenter", ".dropdown-menu-toggle", function () {
            var $this = $(this);
            timer = setTimeout(function () { 
                $this.find(".dropdown-menu").stop(true, true).slideDown();
            },0);
        }).on("mouseleave", ".dropdown-menu-toggle", function () {
        	var cur=$(this);
        	cur.find(".dropdown-menu").stop(true, true).slideUp(0);
        	
        });
        
        $page.on("mouseenter", "#nav-switcher", function (e) {
        	$(e.currentTarget).addClass("active");
        	$(e.currentTarget).closest("ul").parent().css("height","auto");
        }).on("mouseleave", "ul.j_pageActive", function (e) {
        	$(e.currentTarget).find("#nav-switcher").removeClass("active");
        	$(e.currentTarget).parent().css("height","48px");
        });
        
        
        //全局搜索
        $page.on("click", "#searchTopIcon", function (e) {
        	 var keyword = $("#searchTop").val();
        	 if(keyword == ""){
     			mdboss.notifyTips("请输入要搜索的内容"); return;
     		}
        	 mdboss.Router.navigate('search/all/' + keyword, { trigger: true });
        });
        //登出
        $page.on("click", "#logout", function () {
        	mdboss.logout();
        });

//        $page.on("click",".toolkit-item-tab",function(){
//        	console.log("");
//            var $target=$(this);
//            if(!$target.hasClass("active")){
//                $target.addClass("active").siblings(".active").removeClass("active").find("button").hide();
//                $target.find("button").show();
//                var $panel=$target.parents(".toolkit-panel");
//                $panel.find(".form-list-wrap.active").hide().removeClass("active");
//                $panel.find(".form-list-wrap").eq($target.index()).addClass("active").fadeIn();
//            }
//        });

        /*Link Events*/
        $page.on("click","[data-href]",function(){
            var url=$(this).data("href");
            mdboss.Router.navigate(url, {
                trigger: true
            });
        });
        $page.on("click","[data-module]",function(){
            mdboss.module[$(this).data("module")].call(this);
        });
        
        $page.on("click","#flow-list li span.checkbox i",function(){
        	$_this=$(this);
        	$_checkbox=$("#flow-list li span.checkbox");
        	if($_this.hasClass("icon-checkbox-checked")){
        		$_this.closest("li").removeClass("selected");
        		$_this.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
        		if($("#check-all").hasClass("icon-checkbox-checked")){
        			$("#check-all").addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
        		}
        	}else{
        		$_this.closest("li").addClass("selected");
        		$_this.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
        		if($_checkbox.find("i").length==$_checkbox.find("i.icon-checkbox-checked").length){
            		$("#check-all").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	}
        	}
        });
       
        
        //--------------------共享--start----------------------------------------------------------------
        /* 跳转到共享 窗口-拉取组织结构的URL */
    	mdboss.Model.toShare = Backbone.Model.extend({
    		url:mdboss.api.toShare,
    		initialize: function(){  
    	    },  
    	    defaults: { "usercode":mdboss.usercode,"processinstcode":"","taskcode":""
            },  
            aboutMe: function(){  
                return "";  
            }  
    	});
        //共享
        $page.on("click",'.shortcut .share',function(e){
        	var $this  = $(e.currentTarget);
        	var processinstcode = $this.data("id");
        	console.log("processinstcode="+processinstcode);
        	var taskcode = $this.data("taskcode");
        	console.log("taskcode="+taskcode);
//        	var processcode = $this.data("processcode");
        	
        	var toShare = new mdboss.Model.toShare({
        		"usercode":mdboss.usercode,    
//        	    "processinstcode":processinstcode,
//        	    "taskcode":taskcode
        		"pcode":"",
        		"processcode":"",
        		"stepcode":""
        	});
        	
        	toShare.save({},{success:function(m, data){
        		if(data.rc=="1"){
        			var selectpersonconfig = data.data.selectpersonconfig;
        			var selecttype = selectpersonconfig.selecttype;
        			var selectitems = selectpersonconfig.selectitems;
//        			[{“dataclass”:”部门”,
//    				“dataurl”:”部门数据获取URL”,
    //"fieldmapping":{"id":"数据集中对应ID的属性名","name":"名称","pid":"父节点id，非树结构为空"},
//    				“dataytype”:”tree”}]
        			//console.log(selectitems); 测试用
        			
//        			var selectvalues = new Array();
//        			selectvalues.push({"code":"org-002","name":"部门一"});
//        			selectvalues.push({"code":"","name":"jahon-1","pcode":"org-0102"});
//        			selectvalues.push({"code":"11111","name":"jahon-1","pcode":"org-0102"});
//        			selectvalues.push({"code":"11112","name":"jahon-2","pcode":"org-0102"});

//        			seajs.use("selectHandler", function (s) {
        			seajs.use("selectMember", function (s) {
        	      		 new mdboss.View.membersView({model:new mdboss.Model.showUserType( 
        	      			 {obj:selectitems, "selecttype":selecttype,
//        	      				"selectedvalues":selectvalues, 
//        	      				 "callbacks":shareCallBack,
        	      				 "share":processinstcode,
        	      				 "taskcode":taskcode}
        	           )});
        	      		
        	      	 });
        		}else{
        			mdboss.error("加载共享人信息失败！");
        		}
        	},error:function(){
        		mdboss.error();
        	}});
       });
//        function shareCallBack(d){
//        	console.log(d);
//        }
        //--------------------共享-end-----------------------------------------------------------------
  
        //--------------------公文提醒-end-----------------------------------------------------------------
	   	 $page.on("click", ".remind-toggle", function(e) {
	   		 var $this  = $(e.currentTarget);
	   	     var processinstcode = $this.attr("vel");
	   	     var taskcode = $this.data("taskcode");
	   		 seajs.use(["remind"],function(remind){
	   			rd =  new mdboss.View.processRemind({model:new mdboss.Model.processRemind({
	   				"processinstcode":processinstcode,
	   				"taskcode":taskcode
	   				})
	   			});
	   		 });
	   	 });
	   	 //--------------------公文提醒-end-----------------------------------------------------------------
	   	 //--------------------修改密码-start---------------------------------------------------------------
	   	$page.on("click", ".pwd-toggle", function(e) {
	   		dialog = new Dialog({
				type : "html",
				value : '<div class="loading"></div>',
				fillCallback : function() {
					$(this).find(".scrollwrapper").jScrollPane();
				}
			}, {
				"title" : "修改密码",	"width" : "400px", "height" : "300px",	"icon" : "iconfont icon-mdliucheng",
				"resize" : function() {
					$(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
				}
			}).show(function() {		
				var _this = this;
				 var template = Handlebars.compile(require("text!../../template/page/profile/update_password.html"));
				 var html = template();
				 $(html).appendTo($(this.dialog).find(".dialog-content")).fadeIn();
				 $(this.dialog).find(".dialog-content-wrap").attr("style","");
				 $(this.dialog).find(".loading").removeClass("loading");
				 
				 //提交
				 $("#pwd-btn-update").click(function(){//提交
					 var oldPwd = $("#employee-oldPwd").val();
                 	var newPwd = $("#employee-newPwd").val();
                 	var confirmPwd = $("#employee-confirmPwd").val();
                 	if(oldPwd == ""){
                 		//$("#employee-oldPwd").focus();
                 		$("#employee-oldPwd").focus().css("border-color","red");
                 		$("#employee-oldPwd-").html("请输入原密码"); return;
                 	}else{
                 		$("#employee-oldPwd-").html("");
                 		$("#employee-oldPwd").focus().css("border-color","#66afe9");
                 	}
                 	if(newPwd == ""){
                 		$("#employee-newPwd").focus().css("border-color","red");
                 		$("#employee-newPwd-").html("请输入新密码");return;
                 	}else{
                 		$("#employee-newPwd-").html("");
                 		$("#employee-newPwd").css("border-color","#66afe9");
                 	}
                 	
                 	if(confirmPwd == ""){
                 		$("#employee-confirmPwd").focus().css("border-color","red");
                 		$("#employee-confirmPwd-").html("请输入确认密码");return;
                 	}else{
                 		$("#employee-confirmPwd").css("border-color","#66afe9");
                 		$("#employee-confirmPwd-").html("");
                 	}
                 	if(confirmPwd != newPwd){
                 		$("#employee-newPwd").focus().css("border-color","red");
                 		$("#employee-newPwd-").html("两次密码不一致");
                 		return;
                 	}else{
                 		$("#employee-newPwd").css("border-color","#66afe9");
                 		$("#employee-newPwd-").html("");
                 	}
                 	
                 	if(newPwd.length <8){
                 		$("#employee-newPwd").focus().css("border-color","red");
                 		$("#employee-newPwd-").html("最小长度为8");
                 		return;
                 	}else{
                 		$("#employee-newPwd-").html("");
                 		$("#employee-newPwd").css("border-color","#66afe9");
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
             				_this.close();
             			}else{
             				mdboss.error(res.msg);
             			}
             		},error:function(){
             			mdboss.error();
             		}});
             	 });
             	
				 //取消
             	$("#pwd-btn-cancel").click(function(){
             		_this.close();
             	});
			});//end dialog
	   	});
	   	 //--------------------修改密码-end-----------------------------------------------------------------
	   
	   	//--------------------用户卡片-end-----------------------------------------------------------------
	   	$page.on("click", ".user-item", function(e) {
		   	 e.preventDefault();
			 var $this  = $(e.currentTarget);
			 var usercode = $this.attr("user-id");
			 var username = $this.attr("title");
	   		 mdboss.usercard(usercode, username);
	   	});
	   	
	   	//用户卡片
	   mdboss.usercard = function(usercode, username){//
	   		new Dialog({ type: "html", value: '<div class="loading"></div>',fillCallback : function() {
				$(this).find(".scrollwrapper").jScrollPane();
			} }, {"title":username+"的卡片信息","width":"600px","height":"390px"}).show(function(){
				var _this = this;
				
				var commonModel =  new mdboss.Model.commonModel();
		   		commonModel.save({"usercode":usercode},{url:mdboss.api.userCard,success:function(model,data){
		   			if(data.rc == 1){
		   				var template = Handlebars.compile(require("text!template/page/member/usercard.html"));
		   				if(data.data.data!=undefined && data.data.data.rows!=undefined && data.data.data.rows.length>0){
		   					if(data.data.data.rows[0].avatarcode!="" && data.data.data.rows[0].avatarcode!=null){
		   						data.data.data.rows[0].avatarcode = baseConfig.base+"download?filecode="+data.data.data.rows[0].avatarcode;
		   					}else{
		   						data.data.data.rows[0].avatarcode="images/avatar.png";
		   					}
		   					
		   					var html = template({"userinfo":data.data.data.rows[0],"userstatis":data.data});
		   					$(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
		   					$(_this.dialog).find(".dialog-content-wrap").attr("style","");
		   					$(_this.dialog).find(".loading").removeClass("loading");
		   					$("#sub_process").click(function(){
		   						_this.close();
		   						window.location.href = $(this).data("href");
		   					});
		   				}else{
		   					mdboss.notifyTips("获取【"+username+"】的卡片信息失败！");
		   					_this.close();
		   				}
		   			}else{
		   				mdboss.error("获取【"+username+"】的卡片信息失败！");
		   				_this.close();
		   			}
		   		},error:function(){
		   			mdboss.error();
		   		}});
			});
	   	};
	   	//用户卡片信息
	   	
	   	//左侧菜单 下拉 menu-head
		 $page.on("click", ".menu-head", function(e) {
	   		 var $this  = $(e.currentTarget);
	   	      if($this.closest("li").find("ul").length>0){
	   	    	  if($this.attr("data-dir") == 'down'){
	   	    		 $this.closest("li").find("ul").slideUp("fast");
	   	    		 $this.attr("data-dir","up");
	   	    	  }else{
	   	    		$this.closest("li").find("ul").slideDown("fast");
	   	    		$this.attr("data-dir","down");
	   	    	  }
	   	      }
	   	 });
        
		 
		 /**
		  * 替换处理意见中的处理人
		  * str 原数据
		  * data为替换数据
		  * callback回调函数
		  * obj回调函数所在对象
		  */
		 mdboss.replacehandler=function(str,data,callback,obj){
			 if(str){
				 var pattern=/\{[^\{\}]*\}/g;//替换所有匹配
				 if(data&&data.length>0){
					 str=str.replace(pattern,data.join(""));
					  var callbackFn = typeof callback == "function" ? callback : function () { };	
					  callbackFn(str,obj); 
				 }
				  
			 }
		 };
    };
    
    module.exports = global;
});
