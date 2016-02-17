define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     require("mCustomScrollbar");
     require("tipso");
     var meetingroomedit = require("meetingroomedit");
     var meetingedit = require("meetingedit");
     Dialog = require("dialog");
     
     
     //使用帮助 
     exports.meetingFunc=function(){
    	mdboss.fillPage(require("text!template/page/oa/meeting/index.html"));
		new mdboss.View.meetingView();
     };
     
     mdboss.View.meetingView = Backbone.View.extend({
         el: '#rightMainContainer',
         initialize:function(){
        	 this.pageNo=1;
        	 this.totalPage=5;
        	 this.pageSize=10;
        	 this.modulecode="";
        	 this.module_list_html=$("#module-list-template").html();
        	 this.modulename="";
        	 this.parentcode="";
        	 this.issuecode="";
        	 this.title="";
        	 this.condition=null;
        	 this.ueditor=null;
        	 this.orderBy="";
        	 this.render();
         },
         events: {
        	 'click #check-all-module':'checkall',//全选
        	 'click #module-del':'batchdel',//批量删除
        	 'click #module-add':'moduleadd',//新增
        	 'dblclick .js_add_date_room':'dateRoom',//新增//双击
        	 
        	 'click #module-batch':'modulebatch',//批量修改
        	 'click #module-export':'dataexport',//导出
        	 'click .js_module_edit':'dataedit',////修改
        	 "click .js_module_view":"dataview",
        	 'click .js_module_del':"datadel",
        	 'change #meetingcode':"filterSearch",
        	 'keyup #meeting_name':"filterSearch",//搜索
//        	 'keyup #module_name':"filterSearch",//搜索
        	 'click .js_search_meeting':"searchMeeting",//搜索
        	 'click #module-flow-list li span.js-check-box i':'checkbox',//checkobx 选中取消
        	 'click .js_search_module':'searchModule',//模块搜索
        	 'click .js_del_answer':'delanswer',//删除反馈信息
        	 'click .js_answer_detail':'jsanswerdetail',//处理编辑
        	 'click .js_search_operate':'searchOrg',//父组织
        	 'click .js_roominfo':'jsroominfo',//会议室信息
        	 'click .js_meetinfo':'dataedit',//会议信息
        	 
        	 'click .js_sort':'sorting',//排序 
         },
         jsroominfo:function(e){//
        	 var roomcode=$(e.currentTarget).data("code"); 
         	$(e.currentTarget).closest("li").addClass("selected");//         	 
         	meetingroomedit.meetingroomeditFunc({"tid":roomcode, "roomcode":roomcode, "title":"view","view":true});
         },
         sorting:function(e){
        	this.orderBy = mdboss.sorting(e, this.orderBy);
        	this.pageNo =1;
        	this.renderData();
         },
         searchOrg:function(){//父组织
        	 var v_this = this;
        	 seajs.use("orgs", function () {
  	        	new mdboss.View.orgsView({parent:v_this.$el,"selectOnly":true,
  	        		"callbacks":v_this.searchByOrg,"pview":v_this,"title":"组织选择"});
  	        });
         },
         searchByOrg:function(treeNode, parent, pview){//搜索父组织
        	 pview.pageNo = 1;
        	 if(treeNode.id =="org--1"){
        		 parent.find("#parentname").val("");
        		 pview.parentcode = "";
        	 }else{
        		 pview.parentcode = treeNode.id;
        		 parent.find("#parentname").val(treeNode.name);
        		 pview.parentcode = treeNode.id;
        	 }
        	 pview.renderData();
         },
         modulebatch:function(){//指修改
        	 var tids = this.getTids();
        	 if(tids.length >0){
        		 var v_this = this;
        		 meetingedit.meetingeditFunc({"tids":tids,"title":"batch","renderData":v_this.renderDataBack,"pview":v_this});
        	 }else{
        		 mdboss.error("请选择要修改的记录！");
        	 }
         },
         searchMeeting:function(){
			 this.pageNo = 1;
			 this.renderData();
         },
         filterSearch:function(e){//搜索
        	 if(e.type== "change"){
        		 this.pageNo = 1;
    			 this.renderData();
        	 }else{
        		 if(e.which == 13){
        			 this.modulecode = $("#module_code").val();
        			 this.modulename = $("#module_name").val();
        			 this.pageNo = 1;
        			 this.renderData();
        		 }
        	 }
         },
         search:function(treeNode, parent, pview){//  查询父模块      	
        	 pview.pageNo = 1;
        	 pview.parentcode = treeNode.id;
        	 parent.find("#parentname").val(treeNode.name);
        	 pview.renderData();
         },
         datadel:function(e){ //删除单行记录
        	 var v_this = this;
        	 var tid=$(e.currentTarget).data("tid"); 
        	 var commonModel=new mdboss.Model.commonModel();
        	 mdboss.confirm("确定要删除吗？",function(c){
        		 if(c){
        			 commonModel.save({"usercode":mdboss.usercode,"tid":tid},
        					 {url:mdboss.api.meetingdelete,success:function(model,res){
             		 	if(res.rc==1){
             		 		mdboss.notifyTips("删除成功！");
             		 		v_this.renderData();
             		 	}else{
             		 		mdboss.error(res.msg);
             		 	}
             	 },error:function(){
             		 mdboss.error();
             	 }});
        	  }
        	});
         },
         dataview:function(e){//查看详情
        	var tid=$(e.currentTarget).data("tid"); 
        	$(e.currentTarget).closest("li").addClass("selected");//
        	meetingedit.meetingeditFunc({"tid":tid, "title":"view","view":true});
//        	 
         },
         moduleadd:function(){//新增 
        	 var v_this = this;
        	 meetingedit.meetingeditFunc({"title":"add","renderData":v_this.renderDataBack,"pview":v_this});
         },
         dateRoom:function(e){//新增 
        	 
        	 var v_this = this;
         	 var roomcode=$(e.currentTarget).data("code");
         	 console.log(roomcode);
        	 meetingedit.meetingeditFunc({"title":"add","renderData":v_this.renderDataBack,"pview":v_this, "roomcode":roomcode});
         },
         dataedit:function(e){//新增修改记录  
        	var v_this = this;
        	var tid=$(e.currentTarget).data("tid"); 
        	$(e.currentTarget).closest("li").addClass("selected");
        	 var bookcode=$(e.currentTarget).data("bookcode");
        	meetingedit.meetingeditFunc({"tid":tid,"bookcode":bookcode,"title":"edit","renderData":v_this.renderDataBack,"pview":v_this});
         },
         renderDataBack:function(pview){
        	 pview.renderData();
         },
         dataexport:function(){
        	v_this=this;
        	seajs.use("sign_export", function () {
        		new mdboss.View.signExport({condition:v_this.condition});
        	 });
         },
         getTids:function(){
        	 var tids=new Array();
        	 $("#module-flow-list").find("li  i.icon-checkbox-checked").each(function(index,item){
        		 tids.push($(item).data("id"));
        	 });
        	 return tids;
         },
         batchupdate:function(){//
        	 var tids=v_this.getTids();
        	 if(tids.length==0){
        		 mdboss.notifyTips("请选择批量修改的记录！");
        		 return false;
        	 }else{
        		 seajs.use("demobatchedit", function () {
            		 new  mdboss.View.demobatchedit({"tids":tids});
            	 });
        	 }
         },
         checkbox:function(e){
        	 $_this=$(e.currentTarget);
         	$_checkbox=$("#module-flow-list li span.js-check-box");
         	if($_this.hasClass("icon-checkbox-checked")){
         		$_this.closest("li").removeClass("selected");
         		$_this.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
         		if($("#check-all-module").hasClass("icon-checkbox-checked")){
         			$("#check-all-module").addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
         		}
         	}else{
         		$_this.closest("li").addClass("selected");
         		$_this.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
         		if($_checkbox.find("i").length==$_checkbox.find("i.icon-checkbox-checked").length){
             		$("#check-all-module").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
             	}
         	} 
         },
         batchdel:function(e){//批量删除
        	 v_this=this;
        	 var delIds=v_this.getTids();
        	 if(delIds.length==0){
        		 mdboss.error("请选择批量删除的记录！");
        		 return false;
        	 }else{
        		 var commonModel=new mdboss.Model.commonModel();
            	 mdboss.confirm("确定要删除吗？",function(c){
            		 if(c){
            			 commonModel.save({"usercode":mdboss.usercode,"tids":delIds},
            					 {url:mdboss.api.meetingdeletebatch,success:function(model,res){
                    		 if(res.rc==1){
                    			 mdboss.notifyTips("删除成功！");
                    			 v_this.renderData();
                    		 }else{
                    			 mdboss.error(res.msg);
                    		 }
                    	 },error:function(){
                    		 mdboss.error();
                    	 }});
            		 }
            	 });
        	 }
         },
         checkall:function(e){
        	 e.preventDefault();
        	 $this= $("#check-all-module");
        	 $this.toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
        	 var $li = $("#module-flow-list").find("li");
             var $i = $("#module-flow-list").find("li  i");
             if($this.hasClass("icon-checkbox-checked")){
            	 $i.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	 $li.addClass("selected");
             }else{
            	 $li.removeClass("selected");
            	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
             }
         },
         render:function(){
        	 var m_this = this;
//        	 mdboss.dataselect(this, "meetingcode", "#OA_MEETINGROOM","","200");
        	 $(".date").val(mdboss.getDate("yyyy-MM-dd"));
        	 this.renderData( );
        	 $(".date").datetimepicker({
        		 format: 'yyyy-mm-dd',
                 minView: 2,
                 autoclose: true,
                 language: 'zh-CN'
	         });
        	 var reqData={"pageNo":1, "pageSize":0};
        	 mdboss.reqsubmit(reqData, mdboss.api.meetingroomlist, function(m, res){
        		 if(res.rc == 1){
        			 var tmp = res.data.rows;
        			 var html='<option value="">请选择</option>';
        			 for(var i=0; i<tmp.length; i++){
        				 html +='<option value="'+tmp[i].roomcode+'">'+tmp[i].roomname+'</option>';
        			 }
        			 m_this.$el.find("#meetingcode").append(html);
        			 m_this.$el.find("#meetingcode").select2({"width": "200"});
        		 }
        	 });
        	 
         },
         checkMeeting:function(data){////判断今天是否预定了会议室  TODO
        	 if(data){
        		 var resData = new Array();
        		 var today =  $("#module_date").val();
        		 var curDate = $("#module_date").val();
//        		 console.log(today);
        		 var arr = curDate.split("-");
        		 var starttime = new Date(arr[0], arr[1]-1, arr[2]);
        		 var day = starttime.getDay();
        		 for(var i=0; i< data.length; i++){
        			 var tmp = data[i];
        			 //是否是 循环周期
        			 if("CyclePeriod" == tmp.looptype){//循环周期
        				 //当天在 预定时间范围内
        				 if( mdboss.compareDate(tmp.perioddatebegin,today) &&  mdboss.compareDate(  today, tmp.perioddateend) ){
//        					 console.log(tmp.loopperiod +"---" + day);
        					 //loopperiod
        					 var loopperiod = tmp.loopperiod;
        					//Mon,Tue,Wed,Thu,Fri,Sat,Sun
        					 switch(day){
        					 	case 0:  if(loopperiod.indexOf("Sun") >=0 ) resData.push(tmp);
        					 		break;
        					 	case 1: if(loopperiod.indexOf("Mon") >=0 ) resData.push(tmp);
        					 		break;
        					 	case 2: if(loopperiod.indexOf("Tue") >=0 ) resData.push(tmp);
        					 		break;
        					 	case 3: if(loopperiod.indexOf("Wed") >=0 ) resData.push(tmp);
        					 		break;
        					 	case 4: if(loopperiod.indexOf("Thu") >=0 ) resData.push(tmp);
        					 		break;
        					 	case 5: if(loopperiod.indexOf("Fri") >=0 ) resData.push(tmp);
        					 		break;
        					 	case 6: if(loopperiod.indexOf("Sat") >=0 ) resData.push(tmp);
        					 		break;
        					 }
        				 }
        			 }else if("SpecifiedDate" == tmp.looptype){
        				 if( mdboss.compareDate(tmp.perioddatebegin,today) &&  mdboss.compareDate(  today, tmp.perioddateend) ){
        					 resData.push(tmp);
        				 }
        			 }else{
        				 resData.push(tmp);
        			 }
        		 }
        		 return resData;
        	 }else{
        		 return null;
        	 }
         },
         renderData:function(){//渲染列表
        	 v_this=this;
        	 $("#check-all-module").removeClass("icon-checkbox-checked").addClass("icon-checkbox-unchecked");
        	 var commonModel=new mdboss.Model.commonModel();        	 
        	 //查询条件
        	 var tmpCondition = new Array();
	             
	            if(this.modulename){
	            	tmpCondition.push({"key":"roomname", "operate":"Like","v1":this.modulename});
	            }
	            if(v_this.$el.find("#module_date").val()){
	            	tmpCondition.push({"key":"meetingdate", "operate":"EqualTo","v1":v_this.$el.find("#module_date").val()});
	            }
	            if(v_this.$el.find("#meetingcode").val()){
	            	tmpCondition.push({"key":"roomcode", "operate":"EqualTo","v1":v_this.$el.find("#meetingcode").val()});
	            }
	            if(v_this.$el.find("#meeting_name").val()){
	            	tmpCondition.push({"key":"meetname", "operate":"Like","v1":v_this.$el.find("#meeting_name").val()});
	            }
	            
//	            console.log("sdf");
	         v_this.condition = tmpCondition;
        	 $("#submit-loading").show();
        	 $("#module-flow-list").mCustomScrollbar("destroy");
             commonModel.save({ "usercode":mdboss.usercode,"pageNo":this.pageNo, "pageSize":v_this.pageSize,    // 每页10条记录
     			"queryCondition": v_this.condition,"orderBy":this.orderBy},{url:mdboss.api.meetinglist,success:function(model,res){
     				$("#submit-loading").hide();
     				if(res.rc == 1){
     	            	 var listTemplate = Handlebars.compile(v_this.module_list_html);
     	            	 var arrData =  v_this.removeRepeatData(res.data.rows);//会议室列表json重构
     	            	 console.log(arrData);
     	            	 var listHtml=listTemplate(arrData);
     	            	 
     	            	
     	            	 v_this.$el.find("#module-flow-list").html(listHtml);
 	            		 $("#module-flow-list").mCustomScrollbar({scrollButtons:{ enable:false }, theme: "darkblue",horizontalScroll:false  });
 	            		 $('.tipsoinfo').tipso({ useTitle: false });//
 	            		 
     	            	/* v_this.totalPage =parseInt((res.data.total+mdboss.pageSize-1)/v_this.pageSize);
     	            	 $("#module_pagination").bs_pagination({ totalPages:v_this.totalPage,currentPage:v_this.pageNo,
     	            		rowsPerPage:v_this.pageSize,
     	            		onChangePage: function(event, data) {
     	            			v_this.pageNo = data.currentPage;
     	            			v_this.pageSize = data.rowsPerPage;
     	            			v_this.renderData();
	             			},
	             			totalRows:res.data.total,
	             			showGoToPage: true,
	        				showRowsPerPage : true,
	        				showRowsInfo : true,
	        				showRowsDefaultInfo : true,
     	            	 });*/
     				}else{
     					mdboss.error(res.msg);
     				}
     			},error:function(){
     				$("#submit-loading").hide();
     				mdboss.error();
     			}});
         },
         removeRepeatData:function(arr){//会议室列表数据重构      	
        	var intRows=[];
        	var preArr=[];
        	var aa=[];
        	 
        	for(var i=0;i<arr.length;i++){
        		intRows.push(arr[i].roomcode);
        	}
            
        	//筛选种类，并排重
    		for(var n=0;n<intRows.length;n++){
    			if(preArr.indexOf(intRows[n])==-1){
    				preArr.push(intRows[n]);
    			}
    		}
    		
    		//构建aa数据
    		for(var m=0;m<arr.length;m++){
    			for(key in preArr){
    				if(preArr[key]===arr[m].roomcode){
    					aa[key]={"roomcode":preArr[key],"roomname":arr[m].roomname,"rows":[]};
    				}
    			}
    		}
    		
    		//组装aa的rows
    		for(var r=0;r<arr.length;r++){
    			for(key in preArr){
    				if(preArr[key]===arr[r].roomcode){
    					aa[key].rows.push(arr[r]);
    				}
    			}
    		}
    		
    		return aa;
         }
          
     });
     
});