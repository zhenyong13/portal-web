define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("datetimepicker");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.meetingeditFunc=function(data){
		new mdboss.View.meetingedit(data);
     };
	
     mdboss.View.meetingedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 //传入的参数
        	 _this.rdata=data;
        	 _this.ueditor=null;
        	 this.filecode="";
        	 //标题
        	 if(data.title == "add"){
        		 this.title="会议室预约";
        		 this.height = "500px";
        	 }else if(data.title == "edit"){
        		 this.title="会议基本资料";
        		 this.height = "580px";
        	 }else if(data.title == "view"){
        		 this.title="资产详情";
        		 this.height = "400px";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改资产";
        		 this.height="250px";
        	 }else{
        		 this.title="";
        		 this.height="230px";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/oa/meeting/view.html");
        	 this.edit_html = require("text!template/page/oa/meeting/edit.html");
        	 this.batchedit_html=require("text!template/page/oa/meeting/batchedit.html");
        	 
        	 _this.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){ $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});   }
             }, {"title":_this.title ,"width":"900px","height":_this.height,"icon":"iconfont icon-mdliucheng",
            	 full:false, layer:true,btns: ['min','max','close'],
            	 "resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.rdata.tid){//编辑
                		 console.log(_this.rdata);
	                	 var reqData = new Array();
	                	 
	                	 if(_this.rdata.bookcode){//点击会议室列表选项
	                		 reqData.push( {"name" : "meetingview", "post" : { "usercode":mdboss.usercode,"queryCondition": // 查询条件
		                		    [{"key":"bookcode","operate":"EqualTo","v1":_this.rdata.bookcode}]},cache:false });
	                	 }else{
	                		 reqData.push( {"name" : "meetingview", "post" : { "usercode":mdboss.usercode, "tid":_this.rdata.tid },cache:false });
	                	 }
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["meetingview"];
                 		 		if(_this.rdata.view){//详情
                 		 			var templateA=Handlebars.compile(_this.view_html);
                 		 			resData.baseurl=baseConfig.avatar_url;
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.edit_html);
                 		 			resData.baseurl=baseConfig.avatar_url;
                 		 			var htmlData=resData.rows[0];
                 		 			var html=template(htmlData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			_this.dataselect(resData.roomcode, resData.looptype, resData.loopperiod, resData.usetimetype);
                 		 			_this.initDate();
                 		 			$( "#module_form" ).validVal();
                 		 		}   
	                         }else {
	                         	mdboss.error(msg);
	                         }
	                     });
                	 }else{
                		 var template=null;
        		 		 if(_this.rdata.tids){//批量修改
        		 			 template=Handlebars.compile(_this.batchedit_html);
        		 			 var html=template({ });
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 _this.dataselect();
	           		 		_this.initDate();
        		 		 }else{//新增
        		 			 template=Handlebars.compile(_this.edit_html);
        		 			 var today = mdboss.getDate("yyyy-MM-dd");
        		 			 var html=template({"bookername":mdboss.getUserinfo().username, "booker":mdboss.usercode,
        		 				"bookdept":mdboss.getUserinfo().orgname, "booktime":today,"perioddatebegin":today,"perioddateend":today});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 _this.dataselect(_this.rdata.roomcode);
	           		 		_this.initDate();
        		 			 $( "#module_form" ).validVal();
        		 		 }
        		 		 // 
                	}
             }); 
        	 this.$el = _this.dialog.$html;
         },
         initDate:function(){
//        	 $(".datetime").datetimepicker({
//	        		format: 'hh:ii',
//	                autoclose: true,
//	                startView:1,
//	                language: 'zh-CN',
//	                timepicker:true,    //关闭时间选项
//	         });
        	 $(".date").datetimepicker({
        		 format: 'yyyy-mm-dd',
                 minView: 2,
                 autoclose: true,
                 language: 'zh-CN',
                 startDate: '+0d'
	         });
         },
         dataselect:function(roomcode, looptype, loopperiod,  period){//下拉列表数据获取
        	 var view = this;
        	 var reqData={"pageNo":1, "pageSize":0};
        	 view.$el.find("#meeting_room").empty();
        	 mdboss.reqsubmit(reqData, mdboss.api.meetingroomlist, function(m, res){
        		 if(res.rc == 1){
        			 var tmp = res.data.rows;
        			 var html='<option value="">请选择</option>';
        			 for(var i=0; i<tmp.length; i++){
        				 if(roomcode == tmp[i].roomcode){
        					 html +='<option value="'+tmp[i].roomcode+'" selected="selected">'+tmp[i].roomname+'</option>';
        				 }else{
        					 html +='<option value="'+tmp[i].roomcode+'">'+tmp[i].roomname+'</option>';
        				 }
        			 }
        			 view.$el.find("#meeting_room").append(html);
        			 view.$el.find("#meeting_room").select2({"width": "200","placeholder": "请选择"});
        		 }
        	 });
        	 
//        	 mdboss.dataselect(this, "circle_time", "OA_RECYCLETYPE",looptype,null, true);
//        	 mdboss.dataselect(this, "time_type", "OA_PERIODTYPE",period ,null, true);
        	 
        	 view.$el.find("#circle_time").select2({"width": '200'});
        	 view.$el.find("#time_type").select2({"width": '200'});

        	 if(looptype == "CyclePeriod"){ // 循环周期 CyclePeriod  //SpecifiedDate  指定指定日期
        		 view.$el.find("#circleDay").show();
        		 view.$el.find("#endtimediv").show();
        	 }
        	 //TimeSlot 时间段 AllDay 全天 
        	 if(loopperiod){
        		 var tmmp = loopperiod.split(",");
        		 
        		 for(var i=0; i<tmmp.length; i++){
        			 view.$el.find("input[name='circledate'][value="+tmmp[i]+"]").prop("checked", true);
        		 }
        	 }
        	 
//        	 var commonModel = new mdboss.Model.commonModel();
//   			commonModel.save({"usercode":mdboss.usercode,"pageNo":1,"pageSize":0},
//   					{url:mdboss.api.meetingroomlist, success:function(m,res){
//   				if(res.rc == 1){
//   					view.$el.find("#meeting_room").empty();
//   					view.$el.find("#meeting_room").append('<option value="">请选择</option>');
//   	            	var tmp = res.data.rows;
//   					  for(var i =0; i<tmp.length; i++){
//   						  var htm ='<option value="'+tmp[i].roomcode+'">'+tmp[i].roomname+'</option>';
//   						  if(roomcode && roomcode == tmp[i].roomcode){
//   							 htm ='<option value="'+tmp[i].roomcode+'" selected="selected">'+tmp[i].roomname+'</option>';
//   						  }
//   						  view.$el.find("#meeting_room").append(htm);
//   					  }
//   					view.$el.find("#meeting_room").select2({"width": '200'});
//   				}else{
//   					mdboss.error(res.msg);
//   				}
//   			},error:function(){
//   				mdboss.error();
//   			}});
        	 
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #meetingback':'back',//退订
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_dept':'selected_dept',//选择部门
        	 "focus #leader_man":'delegateMan',//搜索委托人
        	 "keyup #leader_man":'delegateManKey',//搜索委托人
        	 "click .js_file_view":"file_view",//文件查看 
        	 "change .js_fileupload_":'filecodeUpload',//文件上传上传
        	 "change #circle_time":'circletype',//循环类型
        	 "change #time_type":'timetype',//循环类型
        	 "click .js_search_man":'searchMan',//添加与会人
        	 "click #startProcess":'startProcess',//启动会议通知发文
         },
         searchMan:function(e){
        	 var v_this = this;
 	        seajs.use("selectMan", function () {
 	        	new mdboss.View.memberselectView({"title":"与会成员设置","callback":v_this.addGroupMam,"pview":v_this});
 	        });
         },
         addGroupMam:function(pview , mans){//
//        	 console.log(mans);
        	 var tmp = "";
        	 var tmpname = "";
        	 for(var i=0; i<mans.length; i++){
        		 if(i == mans.length-1){
        			 tmp+=mans[i].code+"";
        			 tmpname+=mans[i].name+"";
        		 }else{
        			 tmp+=mans[i].code+",";
        			 tmpname+=mans[i].name+",";
        		 }
        	 }
        	 pview.$el.find("#meeting_num").val(mans.length);
        	 pview.$el.find("#meeting_man_code").val(tmp);
        	 pview.$el.find("#meeting_man").val(tmpname);
         },
         startProcess:function(e){//发起会议公文
             var processinstcode="33e16781-2356-495f-a2f2-51d7d49b6ea3";//流程实例ID
             new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(_this.dialog).find(".jscroll").jScrollPane({autoReinitialise:true});
                 }
             }, {"title":"发起公文流程【会议通知收文】","width":"963px","height":"562px","layer":false,"icon":"iconfont icon-mdliucheng","resize":function(){
            	 	console.log($(_this).find(".jscroll"));
            	 	$(_this.dialog).find(".jscroll").jScrollPane({autoReinitialise:true});
            	 	
                 }}).show(function(){
                	 _this=this;
                	 seajs.use("startProcessInfo", function () {
                		 var model=new mdboss.Model.processdefLoad();
                		 var viewProcess=new mdboss.View.startProcess({model:model,$el:$(_this.dialog),dialog:_this,id:processinstcode});
                		 viewProcess.render();
                	 });
             });
         },
         circletype:function(e){
        	 var m_this = this;
        	 $this=$(e.currentTarget);
        	 if($this.val() =="CyclePeriod"){//循环周期
        		 m_this.$el.find("#circleDay").show();
        		 m_this.$el.find("#endtimediv").show();
        		 console.log("循环类型");
        		 var day=new Date();
        		 var today=day.getDay();//取当天
        		 m_this.$el.find("#circleDay").find("span:eq("+today+") input").attr("checked", true);//默认选择当天
        		 console.log(today);
        	 }else{
        		 m_this.$el.find("#endtimediv").hide();
        		 m_this.$el.find("#circleDay").hide();
        		 m_this.$el.find("#circleDay").find("span input").removeAttr("checked");
        	 }
         },
         timetype:function(e){//>时间段类型
        	 var m_this = this;
        	 $this=$(e.currentTarget);
        	 if($this.val() =="AllDay"){//全天 
        		 if(m_this.$el.find("#circle_time").val() == "CyclePeriod"){//循环周期   
        			 m_this.$el.find("#circleDay").show();
        		 }//指定日期   oneday
        		 m_this.$el.find("#meeting_start_time").attr("disabled","disabled");
        		 m_this.$el.find("#meeting_end_time").attr("disabled", "disabled");
        		 m_this.$el.find("#meeting_start_time").css("background-color", " #DBDADA;");
        		 m_this.$el.find("#meeting_end_time").css("background-color", " #DBDADA;");
        		 m_this.$el.find("#meeting_start_time").val("08:00");
        		 m_this.$el.find("#meeting_end_time").val("18:00");
        	 }else{// period 
//        		 m_this.$el.find("#circleDay").hide();
        		 m_this.$el.find("#meeting_start_time").attr("disabled",false);
        		 m_this.$el.find("#meeting_end_time").attr("disabled",false);
        		 m_this.$el.find("#meeting_start_time").css("background-color", " #fff;");
        		 m_this.$el.find("#meeting_end_time").css("background-color", " #fff;");
        	 }
         },
         delegateManKey:function(e){//回车搜索
          	if(e.which ==13){
          		this.delegateMan(e);
          	}
          },
          delegateBack:function(pview, usercode, name){
         	 pview.$el.find("#meetingmanager").val(usercode);
          },
          delegateMan:function(e){
         	 mdboss.userselect(e, this, this.delegateBack);
          },
         selected_dept:function(){
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
         file_view:function(e){
         	var filecode=$(e.currentTarget).data("file-id");
         	seajs.use("review", function () {
         		new mdboss.View.fileReview({model:new mdboss.Model.commonModel( 
    	      			 {"filecode":filecode,"baseurl":baseConfig.base}
    	           )});
         	});
         },
         back:function(e){//退订
        	 m_this=this;
        	 var tid=_this.$el.find("#tid").val();
        	 var meetcode=_this.$el.find("#bookcode").val();
        	 var reason=_this.$el.find("#reason").val();//退订原因
        	 var reqData = {"tid":tid};
        	 reqData.bookcode= meetcode;
        	 var callback = m_this.rdata.renderData;
        	 reqData.cancelreason = reason;
        	 if(reason){
        		 mdboss.reqsubmit(reqData, mdboss.api.meetingdelete, function(m, res){
        			 if(res.rc == 1){
        				 mdboss.alert("退订成功!");
        				 //回调刷新列表
        				 var callbackFn = typeof callback == "function" ? callback : function () { };
        				 callbackFn(_this.rdata.pview);
        				 m_this.cancel();
        			 }else{
        				 mdboss.error(res.msg);
        			 }
        		 });
        	 }else{
        		 mdboss.error("请填写退订原因!");
        		 return;
        	 }
         },
         submit:function(e){//提交
        	 _this=this;
        	 var tids = _this.rdata.tids;
        	 var form_data = true;
    		 if(tids){
    		 }else{
    			 form_data = $( "#module_form" ).triggerHandler( "submitForm" );
    		 }
    		 
    		 if(_this.$el.find("#time_type").val());else{
        		 mdboss.error("循环类型不能为空!");
        		 return false;
        	 }
    		 if(_this.$el.find("#time_type").val());else{
        		 mdboss.error("时间段类型不能为空!");
        		 return false;
        	 }
    		 if(_this.$el.find("#meeting_room").val());else{
        		 mdboss.error("会议室不能为空!");
        		 return false;
        	 }
    		 
 	         if ( form_data ) {
	        	 var tid=_this.$el.find("#tid").val();
	        	 var meetcode=_this.$el.find("#meetcode").val();
	        	 var bookcode=_this.$el.find("#bookcode").val();
//	        	 var meetingtopic=_this.$el.find("#meetingtopic").val();
	        	 var meetingname=_this.$el.find("#meetingname").val();//会议室名称
	        	 var parentname=_this.$el.find("#parentname").val();//部门名称
	        	 var parentcode=_this.$el.find("#parentcode").val();//部门编码
	        	 var man=_this.$el.find("#userleader").val();//预定人
	        	 var mancode=_this.$el.find("#userleader").attr("data-code");//预定人编码
	        	 
	        	 var date_time=_this.$el.find("#date_time").val();//预定时间
	        	 var circletype=_this.$el.find("#circle_time").val();//循环类型
	        	 var timetype=_this.$el.find("#time_type").val();//时间段类型
	        	 //判断类型
	        	 var starttime=_this.$el.find("#starttime").val();//开始日期
	        	 var endtime=_this.$el.find("#endtime").val();
	        	 
	        	 var day = "";
	        	 _this.$el.find("input[name='circledate']:checked").each(function(){
	        		 day += $(this).val()+",";
	        	 });

	        	 if(circletype == "CyclePeriod" && day.length==0){//循环周期
	        		 mdboss.error("请选择循环周期");
	        		 return false;
	        	 }
	        	 
	        	 
	        	 //指定日期
	        	 if("SpecifiedDate" == circletype){
	        		 endtime = starttime;
	        	 }
	        	 //日期比较 
	        	 if(!mdboss.compareDate( starttime , endtime )){
	        		 mdboss.error("开始时间大于结束时间!");
	        		 return false;
	        	 }
	        	 
	        	 var meeting_start_time=_this.$el.find("#meeting_start_time").val();//会议时间 开始
	        	 var meeting_end_time=_this.$el.find("#meeting_end_time").val();//会议时间 开始 时间点
	        	 var meeting_room=_this.$el.find("#meeting_room").val();//会议室
	        	 
	        	 var meeting_num=_this.$el.find("#meeting_num").val();//与会人数
	        	 var meeting_man_code=_this.$el.find("#meeting_man_code").val();//与会人
	        	 var meeting_man=_this.$el.find("#meeting_man").val();//与会人
	        	 var meettopic=_this.$el.find("#meettopic").val();//议题
	        	 
	        	 var memo=_this.$el.find("#memo").val();//备注
	        	 
	        	 if(meeting_start_time == meeting_end_time){
	        		 mdboss.error("会议时间填写有误!");
	        		 return false;
	        	 }else{
	        		 
	        		var tp1 =  meeting_start_time.split(":");
	        		 var tp2 = meeting_end_time.split(":");
	        		 if(parseInt(tp2[0]) < parseInt(tp1[0])){
	        			 mdboss.error("会议时间填写有误!");
		        		 return false;
	        		 }
	        		 if(parseInt(tp2[0]) == parseInt(tp1[0]) && parseInt(tp2[1]) < parseInt(tp1[1])){
	        			 mdboss.error("会议时间填写有误!");
	        			 return false;
	        		 }
	        	 }
	        	
	        	
	        	 
	        	 if(meetingname);else meetingname= null; //
	        	 if(meettopic);else meettopic= null; //
	        	 if(endtime);else endtime= null; //
	        	 if(starttime);else starttime= null; //
	        	 if(timetype);else timetype= null; //
	        	 if(mancode);else mancode= null; //
	        	 if(mancode);else mancode= null; //
	        	 if(man);else man= null; //
	        	 if(parentcode);else parentcode= null; //
	        	 if(parentname);else parentname= null; //
	        	 
	        	 if(meeting_man);else meeting_man= null; //
	        	 if(meeting_num);else meeting_num= null; //
	        	 if(meeting_room);else meeting_room= null; //
	        	 
	        	 if(meeting_start_time);else meeting_start_time= null; //
	        	 if(meeting_end_time);else meeting_end_time= null; //
	        	 if(memo);else memo= null; //
	        	 
	        	 var callback = _this.rdata.renderData;
	        	 var req = {};
	        	 if(tids){
	        		 req.usercode= mdboss.usercode;
	        	 }else{
	        		 req={"usercode":mdboss.usercode,"roomcode":meeting_room, "meetcode":meetcode, "bookcode":bookcode,
	        				 "meetname":meetingname,"meettopic":meettopic,
	        				 "booker":mancode, "bookername": man,"bookdept":parentname,"booktime":date_time,"attendnum":meeting_num,
	        				 "memo": memo, "attenders":meeting_man_code,"attendernames":meeting_man,
	        				 "looptype":circletype,"usetimetype":timetype,
	        				 "loopperiod":day,
	        				 "usetimebegin":meeting_start_time,"usetimeend":meeting_end_time,
	        				 "perioddatebegin":starttime,
	        				 "perioddateend":endtime};
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.meetingadd;
	        	 if(tid){
	        		 url =mdboss.api.meetingedit;
	        		 req.tid = tid;
	        	 }else{
//	        		 req.creator = mdboss.usercode;
//    				 req.createtime = mdboss.getDate();
	        	 }
	        	 if(tids){
	        		 req.tids = tids;
	        		 url =mdboss.api.meetingbatchedit;
	        		 if(assesttype)  req.assesttype = assesttype;
	        		 if(isenabled)  req.isenabled = isenabled;
	        		 if(brand)  req.brand = brand;
	        		 if(unit)  req.unit = unit;
	        		 if(specification) req.specification = specification;
	        	 }
	        	 var commonModel=new mdboss.Model.commonModel();
				 commonModel.save(req, {url:url,success:function(model,res){
	        		 if(res.rc==1){
	        			 if(tid){
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
        	 m_this=this;
        	 m_this.dialog.close();
 		},
     });
});