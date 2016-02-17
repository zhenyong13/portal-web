define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("jScrollPane");
     Dialog = require("dialog");
     
     //模块函数
     exports.qcodeSetting=function(data){
		new mdboss.View.qcodeSetting(data);
     };
     
     mdboss.View.qcodeSetting = Backbone.View.extend({
         initialize:function(data){
        	 t=this;
        	 //传入的参数
        	 t.rdata=data;
        	 t.filecode=data.filecode;
        	 t.qrObj={//每张图的信息集合
        			 "usercode":mdboss.usercode,
        			 "filecode":t.filecode,
        			 "qrcodeinfos":[]
        	 },
        	 t.getPicNum=0,
        	 t.imgOffsetLeft,
        	 t.imgOffsetTop,
        	 t.baseUrl =baseConfig.base;
        	 t.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){
                	 $(t.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true}); 
                 }
             }, {"title":"二维码生成" ,"width":"1000px","height":"550px","icon":"iconfont icon-mdliucheng",
            	 full:true, layer:true,btns: ['min','max','close'],draggable:false,
            	 "resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 var edithtml=require("text!template/page/document/qcodeSetting.html");
                	 dialog.$html.find(".dialog-content").html(edithtml);

                	 var ListParam={
            			 usercode:mdboss.usercode,
            			 filecodes:[{
            				 filecode:t.filecode//源文件编码
    			 		 }]
                	 };
                	 
				 	 var imgListData=new mdboss.Model.commonModel();
				 	 imgListData.save(ListParam,{url:mdboss.api.queryrelatefile,success:function(m,res){
                		 var dataObj=res.data.rows;
                		 var listData=listEle='';
                		 if(dataObj){
	                		 for(key in dataObj){
	                			 if(dataObj[key].filecode&&dataObj[key].filecode==t.filecode){
	                				 listData=dataObj[key].relatefilecode;
	                				 var listLen=listData.length;
	                				 for(val in listData){
	                					 if(listData[val].filecode){
		                					 if(val==0){
		                						 listEle+='<li class="onShow"><img src="'+t.baseUrl+'download?filecode='+listData[val].filecode+'" filecode="'+listData[val].filecode+'" seqno="'+listData[val].seqno+'"/></li>';
		                					 }else{
		                						 listEle+='<li><img src="'+t.baseUrl+'download?filecode='+listData[val].filecode+'" filecode="'+listData[val].filecode+'" seqno="'+listData[val].seqno+'"/></li>';
		                					 }
		                					 
		                					 var imgObj={
		                							"imgfilcode":listData[val].filecode,
		                							"sortorder":listData[val].seqno,
		                							"x":3,//移动块X坐标
		                							"y":17,//移动块Y坐标
		                							"w":65,//移动块宽度
		                							"h":65,//移动块高度
		                		                    "content":{
		                		                        "picno":"",
		                		                        "prjectcode":"",
		                		                        "projectmanager":"",
		                		                        "speciatymanager":"",
		                		                        "description":""
		                		                    }	
		                					 };
		                					 
		                					 t.qrObj.qrcodeinfos[val]=imgObj; 
		                					 
		                					 if(parseInt(val)==listLen-1){
	                						 	t.qrQuery();
		                					 }
	                					 }
	                					 
	                					 
	                				 }
	                			 }
	                		 }
                		 
                		 
                		 dialog.$html.find(".slidePanel ul").empty().append(listEle);
                		 
                		 dialog.$html.find(".slidePanel,#operPanel .inrPanel").jScrollPane();
	                	 t.loadView($(window).width()-470);
	                	 t.imgOffsetLeft=dialog.$html.find("#cropImg img").offset().left;
	                	 t.imgOffsetTop=dialog.$html.find("#cropImg img").offset().top;
	                	 dialog.$html.find("#qrBox").css("display","none").draggable(); 
	                	 setTimeout(function(){
	                		 dialog.$html.find(".slidePanel ul li").eq(0).click();
	                	 },900)
	                	 
	                	 
                		 }
				 	}});
             }); 
        	 this.$el = t.dialog.$html;
         },
         events: {
        	 "click .slidePanel ul li":"changePanel",
        	 'click #Submitqr':'qrCreate',//提交
        	 "click .btnPanelIn":"btnPanelIn",
			 "click .btnPanelOut":"btnPanelOut",
			 "mousedown #qrBox":"qrBoxMove",
			 "change #Xcoord":"qrBoxWHXY",
			 "change #Ycoord":"qrBoxWHXY",
			 "change #Wqr":"qrBoxWHXY",
			 "change #Hqr":"qrBoxWHXY",

			 "change #tCode":"Qrcon",
			 "change #pName":"Qrcon",
			 "change #pMajor":"Qrcon",
			 "change #pManage":"Qrcon",
			 "change #qrTxt":"Qrcon",
			 
			 "click #isCreateQr":"isCreateQr"//是否需要生成二维码 
         },
         qrQuery:function(){
        	var t=this;
        	var qrQuery=new mdboss.Model.commonModel();
        	qrQuery.save(t.qrObj,{url:mdboss.api.qrQuery,success:function(m,res){
 				if(res.rc==1){
 					var requestInfo=res.data.qrcodeinfos;
 					var qrObjInfo=t.qrObj.qrcodeinfos;
 					for(var i=0;i<requestInfo.length;i++){
 						for(var k=0;k<qrObjInfo.length;k++){
 							if(requestInfo[i].imgfilcode==qrObjInfo[k].imgfilcode){
 								qrObjInfo[k].x=requestInfo[i].x;
 								qrObjInfo[k].y=requestInfo[i].y;
 								qrObjInfo[k].w=requestInfo[i].w;
 								qrObjInfo[k].h=requestInfo[i].h;
 								
 								qrObjInfo[k].content.picno=requestInfo[i].content.picno;
 								qrObjInfo[k].content.prjectcode=requestInfo[i].content.prjectcode;
 								qrObjInfo[k].content.projectmanager=requestInfo[i].content.projectmanager;
 								qrObjInfo[k].content.speciatymanager=requestInfo[i].content.speciatymanager;
 								qrObjInfo[k].content.description=requestInfo[i].content.description;
 							}
 						}
 					}
 				}else{
 					m.error(res.msg);
 				}
 		 	}});
         },
	 	 changePanel:function(e){
	 		var t=this;
			var $this=$(e.currentTarget);
			t.getPicNum=$this.index();
			var imgHtml=$(".slidePanel ul li").eq(t.getPicNum).html();
			$this.addClass("onShow").siblings().removeClass("onShow");
			t.dialog.$html.find("#cropImg p").html(imgHtml);
			t.dialog.$html.find("#qrBox").css("display","none");
			
			var qrcodeinfos=t.qrObj.qrcodeinfos[t.getPicNum];
			setTimeout(function(){
				t.doCoordBox(qrcodeinfos.x,qrcodeinfos.y,qrcodeinfos.w,qrcodeinfos.h);
			},500)
		 },
         loadView:function(wid){//wid大图的宽度
				var hei=$(window).height()-65;
				var _height=hei-20;
	        	$(".slidePanel,#operPanel").height(hei);
	        	$("#cropImg").attr("style","width:"+wid+"px;height:"+_height+"px");
		 },
		 btnPanelIn:function(){		
			var t=this;
			$("#operPanel").animate({right:"-250px"},300,function(){
				$("#btnPanel").attr("class","btnPanelOut").find("i").attr("class","icon-angle-left");
				var w_wid=$(window).width()-220;
				t.loadView(w_wid);
			});
		 },
		 btnPanelOut:function(){
			var t=this;
			$("#operPanel").animate({right:"0px"},300,function(){
				$("#btnPanel").attr("class","btnPanelIn").find("i").attr("class","icon-angle-right");
				var w_wid=$(window).width()-470;
				t.loadView(w_wid);
			});
		 },
		 isCreateQr:function(e){
			 var t=this,scope=t.dialog.$html;
			 if($(e.currentTarget).is(':checked')){
				 scope.find("#operPanel input[type=text],#operPanel textarea").removeAttr("disabled");
				 
				 //刷新全局变量qrObj的对应值
				 t.qrObj.qrcodeinfos[t.getPicNum].x=scope.find("#Xcoord").val();
				 t.qrObj.qrcodeinfos[t.getPicNum].y=scope.find("#Ycoord").val();
				 t.qrObj.qrcodeinfos[t.getPicNum].w=scope.find("#Wqr").val();
				 t.qrObj.qrcodeinfos[t.getPicNum].h=scope.find("#Hqr").val();
				 t.qrObj.qrcodeinfos[t.getPicNum].content.picno=scope.find("#tCode").val();
				 t.qrObj.qrcodeinfos[t.getPicNum].content.prjectcode=scope.find("#pName").val();
				 t.qrObj.qrcodeinfos[t.getPicNum].content.projectmanager=scope.find("#pMajor").val();
				 t.qrObj.qrcodeinfos[t.getPicNum].content.speciatymanager=scope.find("#pManage").val();
				 t.qrObj.qrcodeinfos[t.getPicNum].content.description=scope.find("#textarea").val();
			 }else{
				 scope.find("#operPanel input[type=text],#operPanel textarea").attr("disabled","true");
				 
				//刷新全局变量qrObj的对应值(不需要生成二维码的图片将其移动块复位为初始值)
				 t.qrObj.qrcodeinfos[t.getPicNum].x=t.qrObj.qrcodeinfos[t.getPicNum].y=0;
				 t.qrObj.qrcodeinfos[t.getPicNum].w=t.qrObj.qrcodeinfos[t.getPicNum].h=80;
				 t.qrObj.qrcodeinfos[t.getPicNum].content.picno="";
				 t.qrObj.qrcodeinfos[t.getPicNum].content.prjectcode="";
				 t.qrObj.qrcodeinfos[t.getPicNum].content.projectmanager="";
				 t.qrObj.qrcodeinfos[t.getPicNum].content.speciatymanager="";
				 t.qrObj.qrcodeinfos[t.getPicNum].content.description="";
			 }	 
		 },
		 qrBoxWHXY:function(e){
			 var t=this,
			 	 cur_el=$(e.currentTarget),
			 	 curElVal=cur_el.val(),
			 	 reg = new RegExp("^[0-9]*$"),
			 	 imgWidth=t.dialog.$html.find("#cropImg img").width(),
			 	 imgHeight=t.dialog.$html.find("#cropImg img").height(),
			 	 qrboxWidth=t.dialog.$html.find("#qrBox").width()+2,//2为移动块的边框大小
			 	 qrboxHeight=t.dialog.$html.find("#qrBox").height()+2;//2为移动块的边框大小

			 if(cur_el.context.id=="Xcoord"){
				 if(curElVal<0||curElVal>(imgWidth-qrboxWidth)||!reg.test(curElVal)){//限制非法输入
					 curElVal=t.qrObj.qrcodeinfos[t.getPicNum].x;
					 cur_el.val(curElVal);
					 return;
				 }
				 t.qrObj.qrcodeinfos[t.getPicNum].x=curElVal;
			 }
			 
		 	 if(cur_el.context.id=="Ycoord"){
		 		if(curElVal<0||curElVal>(imgHeight-qrboxHeight)||!reg.test(curElVal)){//限制非法输入
					 curElVal=t.qrObj.qrcodeinfos[t.getPicNum].y;
					 cur_el.val(curElVal);
					 return;
				}
		 		t.qrObj.qrcodeinfos[t.getPicNum].y=curElVal;
			 }
		 	 
		 	 if(cur_el.context.id=="Wqr"){
		 		if(curElVal<=5||curElVal>(imgWidth/2)||!reg.test(curElVal)){//限制非法输入
					 curElVal=t.qrObj.qrcodeinfos[t.getPicNum].w;
					 cur_el.val(curElVal);
					 return;
				}
		 		t.qrObj.qrcodeinfos[t.getPicNum].w=curElVal;
			 }
		 	 
		 	 if(cur_el.context.id=="Hqr"){
		 		if(curElVal<=5||curElVal>(imgHeight/2)||!reg.test(curElVal)){//限制非法输入
					 curElVal=t.qrObj.qrcodeinfos[t.getPicNum].h;
					 cur_el.val(curElVal);
					 return;
				}
		 		t.qrObj.qrcodeinfos[t.getPicNum].h=curElVal;
			 }
		 	 
		 	 var qrcodeinfos=t.qrObj.qrcodeinfos[t.getPicNum];
			 t.doCoordBox(qrcodeinfos.x,qrcodeinfos.y,qrcodeinfos.w,qrcodeinfos.h);
		 },
		 Qrcon:function(e){
			 var t=this,
		 		 cur_el=$(e.currentTarget),
	 		     curElVal=cur_el.val();
			 switch (cur_el.context.id){ 
				 case "tCode"://图号
					 t.qrObj.qrcodeinfos[t.getPicNum].content.picno=curElVal;
					 break; 
				 case "pName"://项目名称
					 t.qrObj.qrcodeinfos[t.getPicNum].content.prjectcode=curElVal;
					 break; 
				 case "pMajor"://项目负责人
					 t.qrObj.qrcodeinfos[t.getPicNum].content.projectmanager=curElVal;
					 break;
				 case "pManage"://专业负责人
					 t.qrObj.qrcodeinfos[t.getPicNum].content.speciatymanager=curElVal;
					 break;
				 case "qrTxt"://其它描述
					 console.log("textarea的值:"+curElVal);
					 t.qrObj.qrcodeinfos[t.getPicNum].content.description=curElVal;	
					 break;
			 } 
		 },
		 qrBoxMove:function(e){
			 var t=this,
			     Xqr=t.qrObj.qrcodeinfos[t.getPicNum].x,
			     Yqr=t.qrObj.qrcodeinfos[t.getPicNum].y,
			 	 imgHeight=$(e.currentTarget).closest("#cropImg").find("img").height(),
			 	 qrboxHeight=$(e.currentTarget).height()+2;//2为移动块的边框大小

			 $(e.currentTarget).draggable({
				zIndex: 999,
				containment: '#cropImg img',
				drag: function (event, ui) {
					t.qrObj.qrcodeinfos[t.getPicNum].x=ui.position.left;
					t.qrObj.qrcodeinfos[t.getPicNum].y=imgHeight-ui.position.top-qrboxHeight;
					t.dialog.$html.find("#Xcoord").val(t.qrObj.qrcodeinfos[t.getPicNum].x);
					t.dialog.$html.find("#Ycoord").val(t.qrObj.qrcodeinfos[t.getPicNum].y);
			    }
			 });
		 },
		 doCoordBox:function(X,Y,W,H){//右侧栏其它值变化时处理块位置/大小/内容
			  var t=this,
			  	  scope=t.dialog.$html,
			  	  content=t.qrObj.qrcodeinfos[t.getPicNum].content;
		 	  	  Yqr=scope.find("#cropImg img").height()-Y-scope.find("#qrBox").height()-2,//2为移动块的边框大小
		 	  scope.find("#qrBox").attr("style","left:"+X+"px;top:"+Yqr+"px;width:"+W+"px;height:"+H+"px;").fadeIn(150);
		 	  
		 	  //将对应图片的右侧栏内容填充
		 	  scope.find("#Xcoord").val(t.qrObj.qrcodeinfos[t.getPicNum].x);
		 	  scope.find("#Ycoord").val(t.qrObj.qrcodeinfos[t.getPicNum].y);
		 	  scope.find("#Wqr").val(t.qrObj.qrcodeinfos[t.getPicNum].w);
		 	  scope.find("#Hqr").val(t.qrObj.qrcodeinfos[t.getPicNum].h);
		 	  
		 	  scope.find("#tCode").val(content.picno);
		 	  scope.find("#pName").val(content.prjectcode);
		 	  scope.find("#pMajor").val(content.projectmanager);
		 	  scope.find("#pManage").val(content.speciatymanager);
		 	  scope.find("#qrTxt").val(content.description);
		 },
		 qrCreate:function(e){
        	var t=this;
			var qrCreate=new mdboss.Model.commonModel();
			qrCreate.save(t.qrObj,{url:mdboss.api.qrCreate,success:function(m,res){
				if(res.rc==1){
					mdboss.notifyTips("二维码成功生成！");
					setTimeout(function(){
						t.cancel();
					},1000)
				}else{
					m.error(res.msg);
				}
		 	}});
         },
         cancel:function(){
        	 this.dialog.close();
 		 },
     });
});