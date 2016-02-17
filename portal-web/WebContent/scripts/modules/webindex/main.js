/**
 * portal 页面
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss");
	var $ = require("jquery");
	Dialog = require("dialog");
	require("scroll");

	 mdboss.View.webindex2 = Backbone.View.extend({
		 	el:"#page-wrap",
	        initialize: function () {
	        	mdboss.fillPage(require("text!template/page/webindex/webindex2.html"));
	        	this.render();
	        },
	        events:{
	        	"click .js_newsmorelink":"newsmorelink",
	        	"click .notice-div .nt_ttop":"setTop",
	        	"click .birthday-toggle":"birthdayView"
	        },
	        newsmorelink:function(e){
	        	var href=$(e.currentTarget).data("url");
	        	var newstype=$(".newsTab .newsOn").data("newstype");
	        	window.location.target="_blank";
	        	var url=href.substr(0,href.lastIndexOf("/")+1);
	        	window.location.href=url+newstype;
	        },
	        render:function(){
	        	var reqData={};
	        	var curthis=this;
				mdboss.reqsubmit(reqData, mdboss.api.portal_showframe, function(m, data){		
	    			//加载框框
	    	        $("#mainContainer").css("background","#ffffff");
	    			if (data.rc == 1 ) {
	    				var frame = data.data;
	    				var template = null;
	    				var html ="";
	    				if(frame && frame.rows){
	    					for(var i=0; i<frame.rows.length; i++){
	    						var tmp = frame.rows[i];
	    						if(tmp.sid == "1"){
	    							template = Handlebars.compile($("#leftModule-template").html());
	    							html = template(tmp);
	    							$("#leftModule").append(html);
	    						}else if(tmp.sid == "2"){
	    							template = Handlebars.compile($("#middleModule-template").html());
	    							html = template(tmp);
	    							$("#middleModule").append(html);
	    						}else if(tmp.sid == "3"){
	    							template = Handlebars.compile($("#rightModule-template").html());
	    							html = template(tmp);
	    							$("#rightModule").append(html);
	    							if(tmp.columncode=='birthdaylist'){
	    								$(".tl_birthdaylist .right_more").remove();
	    							}    							
	    						}else{
	    							break;
	    						}
	    					}
	    				}
	    				//载入对应栏目
	    				curthis.loadColumn(frame.rows, frame.modulecode);	
	    			} else {
	    				 mdboss.error(msg);
	    			}
	    		});
	    	
	        },
	        "loadColumn":function(frameList, modulecode){
	    		var frameListLen=frameList.length;
	    		var curthis=this;
	    		for(var i=0; i<frameListLen; i++){
	    			var tmp = frameList[i];
	    			if(tmp){
	    				if(tmp.columnurl)
	    					curthis.renderMoudleData(tmp,i,frameListLen);
	    			}
	    		}
	    	},
	    	"renderMoudleData":function(tmp,i,frameListLen){
	    		var curthis=this;
	    		var reqData = {
	    				  "usercode":mdboss.usercode, //用户编码 
	    				   "orderBy":"publishtime" //根据序号排序
	    				};
	    		
	    		if(tmp.columncode=="synergism"||tmp.columncode=="friendlylink"){//快捷方式
	    			reqData.orderBy="sortorder";
	    		}
	    		
	    		if(tmp.columncode=="meetinglist"){//会议公告
	    			reqData.orderBy="meetdate desc";
	    		}
	    		
	    		if(tmp.columncode=="todoitems"){//代办事项
	    			reqData.orderBy="starttime desc";
	    		}
	    		
	    		if(tmp.columncode=="birthdaylist"){//生日祝福
	    			reqData.orderBy="birthday";
	    		}
	    		
	    		mdboss.reqsubmit(reqData, baseConfig.base+tmp.columnurl, function(m, res){
    				if(res.rc == 1){
    					if($("#"+tmp.templatecode+"-template").html()){
    						template = Handlebars.compile($("#"+tmp.templatecode+"-template").html());
    						var html="";
    						if(tmp.templatecode=="newscenter"){
    							var data=res.data;
    							html = template({"baseurl":baseConfig.base,"columnList":data,"columncode":tmp.columncode});
    						}else{
    							 html = template({"baseurl":baseConfig.base,"columnList":res.data,"columncode":tmp.columncode});
    						}
    						$(".j-"+tmp.columncode).append(html);
    						
    						
    					}
    				}else{
    					$(".j-"+tmp.columncode).append("加载失败....");
    					mdboss.error(res.msg);
    				}
    				

    				$("#meetingBox .mb_container").jScrollPane();
    				curthis.slidePanel();
    				
    				if(i==(frameListLen-1)){//所有模块加载完
    					curthis.resizePanel();
    				}

    				
	    		});
	    	},
	    	"resizePanel":function(){
	    		var t=this;
	    		var mbHeight=$("#meetingBox .mb_innr").height();
	    		(mbHeight>=345)?mbHeight=345:mbHeight=mbHeight;
	    		$("#meetingBox .jspContainer").attr("style","width:252px;height:"+mbHeight+"px;");//用于下面计算
	    		
	    		var jspPane=$(".cooperative-work-div").height();
	    		$("#rightMainContainer .jspContainer").attr("style","");
	    		var windowWid=$(window).width();
	    		var windowHei=$(window).height();
	    		var rightOutter=$("#rightOutter").height();
	    		var jspContainer;
	    		

	    		if(jspPane>=rightOutter){
	    			jspContainer=jspPane;
	    		}else{
	    			jspContainer=rightOutter;	
	    		}
	    		
	    		if(mbHeight<=200){
	    			jspContainer=jspContainer+300;
	    			jspPane=jspPane+300;
	    		}
	    		
	    		if(mbHeight>200&&mbHeight<=300){
	    			jspContainer=jspContainer+50;
	    			jspPane=jspPane+50;
	    		}
	    		
	    		if(mbHeight>300&&mbHeight<=400){
	    			jspPane=jspPane+50;
	    		}


	    		$("#rightMainContainer").children(".jspContainer").attr("style","background:#ddd;height:"+jspContainer+"px");

	    		var rOutWid=windowWid-(windowWid/window.screen.availWidth)*210;//等比缩放#rightOutter左间距
	    		$("#leftModule").height((jspPane>=2500)?jspPane=2500:jspPane=jspPane+200);
	    		$("#rightOutter").attr("style","width:"+((rOutWid<=850)?rOutWid=850:rOutWid=rOutWid)+"px;");
	    		$("#meetingBox .jspContainer").attr("style","width:252px;height:"+mbHeight+"px;");//用于调整最后界面
	    		
	    		t.flink();

	    	},
	    	"slidePanel":function(){//新闻轮播
	    		
	    		var swiper=$("#imageSwiper");
	    		var sWidth =swiper.width(); 
	    		var len = swiper.find("li").length; 
	    		var index = 0;
	    		var picTimer;
	    		var slideBar='';

	    		for(var i=0;i < len; i++) {
	    			slideBar += "<span></span>";
	    		}
	    		swiper.find(".slideBar").html(slideBar);
	    		swiper.find("ul").css("width",sWidth *len);
	    		swiper.find("li").css("width",sWidth);
	    		swiper.find(".slideBar span").mouseenter(function() {
	    			index = $(this).index();
	    			showPics(index);
	    		}).eq(0).trigger("mouseenter");

	    		swiper.find(".preNext").hover(function() {
	    			$(this).stop(true,false).animate({"opacity":"0.5"},300);
	    		},function() {
	    			$(this).stop(true,false).animate({"opacity":"0.2"},300);
	    		});

	    		swiper.find("#swiperPrev").click(function() {
	    			index -= 1;
	    			if(index == -1) {index = len - 1;}
	    			showPics(index);
	    		});

	    		swiper.find("#swiperNext").click(function() {
	    			index += 1;
	    			if(index == len) {index = 0;}
	    			showPics(index);
	    		});

	    		swiper.hover(function() {
	    			clearInterval(picTimer);
	    		},function() {
	    			picTimer = setInterval(function() {
	    				showPics(index);
	    				index++;
	    				if(index == len) {index = 0;}
	    			},3000); 
	    		}).trigger("mouseleave");
	    		
	    		function showPics(index) { 
	    			var nowLeft = -index*sWidth; 
	    			swiper.find("ul").stop(true,false).animate({"left":nowLeft},300); 
	    			swiper.find(".slideBar span").eq(index).addClass("on").siblings().removeClass("on"); 
	    		}	
	    	},
	    	setTop:function(){//portal 通知广告置顶功能暂时屏蔽
	    		var t=this;
	    		var noticeQuery=new mdboss.Model.commonModel();
	    		noticeQuery.save(t.qrObj,{url:mdboss.api.notifytopshow,success:function(m,res){
	 				if(res.rc==1){
	 					t.render();
	 				}else{
	 					m.error(res.msg);
	 				}
	 		 	}});
	    	},
	    	flink:function(){
	    		var t=this;
	    		var flHeight=$(".friendly-link").height();
	    		if(flHeight){
		    		if(flHeight>300){
						$(".friendly-link ul").jScrollPane();
						$(".friendly-link").find(".jspContainer").attr("style","width:170px;height:auto!important;max-height:270px;min-height:270px!important;");
					}
	    		}else{
	    			setTimeout(function(){
	    				t.flink();
	    			},400)
	    		}
	    	},
	    	birthdayView:function(e){
	    		var t=this;
	    		var t_code=$(e.currentTarget).attr("usercode");
	    		t.dialog=new Dialog({
	                 type: "html",  value: '<div class="loading"></div>', 
	                 fillCallback:function(){
	                	 $(t.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true}); 
	                 }
	             }, {"title":"生日祝福语" ,"width":"450px","height":"180px","icon":"iconfont icon-mdliucheng",
	            	 full:false, layer:true,btns: ['min','max','close']}).show(function(){
	            		 var dgg=this;
	                	 var birthdayView=require("text!template/page/webindex/birthdayEvents.html");
	                	 dgg.$html.find(".dialog-content").html(birthdayView);
	                	 
	                	 var oldTextareaCont=dgg.$html.find("#birthdayCont").val();
	                	 
	                	 dgg.$html.find("#birthdayCont").focus(function(){
	                		 var $t=$(this);
	                		 if(oldTextareaCont==$t.val()){
	     	        			$t.val("");
	     	        		}
	                	 })
	                	 
	                	 dgg.$html.find("#birthdayCont").blur(function(){
	                		 var $t=$(this);
	                		 if($t.val()==''){
	                			 $t.val(oldTextareaCont);
	     	        		}
	                	 })
	                	 
	                	 dgg.$html.find("#birthday-submit,#birthday-cancle").click(function(){
	                		 var birthdayCont=$(dgg.dialog).find("#birthdayCont").val();
	                		 
	                		 
	                		 if(this.id=="birthday-submit"){
	                			 if(birthdayCont==''||birthdayCont==oldTextareaCont){
		                			 mdboss.notifyTips("请写下你想向他/她表达的祝福语");
		                			 return;
		                		 }
	                			 var params={
	                					 "usercode":mdboss.usercode,
	                					 "tousers":[t_code],
	                					 "alarmway": $(dgg.dialog).find("input[name='sendWays']:checked").val(),
	                					 "msg":birthdayCont
	                			 }
	                			 var birthday=new mdboss.Model.commonModel();
	                			 birthday.save(params,{url:mdboss.api.birthdayMessage,success:function(m,res){
	             	 				if(res.rc==1){
	             	 					t.render();
	             	 				}else{
	             	 					m.error(res.msg);
	             	 				}
	             	 		 	 }});
	                		 }
	                		 
	                		 $(dgg.dialog).find(".dialog-close").click();
	                	 })
				 });
        	   t.$el = t.dialog.$html;		
		   }
	 });
	//门户portal视图框架布局(左/右)
	var webindex = function(){
		mdboss.fillWrap(require("text!template/common/wrap_.html"));
		 var webindex2=new  mdboss.View.webindex2();
	 };
	module.exports = webindex;
});