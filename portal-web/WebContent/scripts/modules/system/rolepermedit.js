define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     Dialog = require("dialog");
     require("daterangepicker_moment");
 	require("daterangepicker");
 	require("fullcalendar");
	
     mdboss.View.rolepermedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tid=data.tid;
        	 _this.rdata=data;
        	 _this.detail = data.view;
        	 this.modeuledetail_html = require("text!template/page/system/rolepermdetail.html");
        	 this.modeuledit_html = require("text!template/page/system/rolepermedit.html");
        	 this.modeulbatchedit_html = require("text!template/page/system/rolepermbatchedit.html");
        	 _this.callback=data.renderData;
        	 this.height = "290px";
        	 if(_this.rdata.tids){
        		 this.height="200px";
        	 }
        	 _this.dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                 }
             }, {"title":data.title ,"width":"850px","height": this.height,"icon":"iconfont icon-mdliucheng","resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 var sdata= null;
                	 if(_this.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "rolepdetail", "post" : { "usercode":mdboss.usercode, "tid":_this.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["rolepdetail"];
	                        	 sdata = resData;
                 		 		if(_this.detail){//详情
                 		 			var templateA=Handlebars.compile(_this.modeuledetail_html);
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.modeuledit_html);
                 		 			var html=template(resData);
                 		 			 _this.dataselect(resData.rolecode, resData.permcode);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			$( "#module_form" ).validVal();
                 		 		}  
                 		 		_this.dateSet(sdata);
	                         } 
	                         else {
	                         	mdboss.error(msg);
	                         }
	                     });
                	 }else{//新增
                		 var template = null;
                		 if(_this.rdata.tids){
                			 template=Handlebars.compile(_this.modeulbatchedit_html);
            		 		 var html=template({});
            		 		 _this.dataselect();
            		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
                		 }else{
                			 template=Handlebars.compile(_this.modeuledit_html);
            		 		 var html=template({});
            		 		 _this.dataselect();
            		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
            		 		$( "#module_form" ).validVal();
                		 }
                		//
                		 _this.dateSet();
                		 
                	}
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dateSet:function(sdata){
        	 _this = this;
				var now = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
				var enddate =  moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
				if(_this.rdata.tid){
					now = sdata.effecttime;
					enddate = sdata.expiretime;
				}
				
				$("#startTime").val(now);
				$("#endTime").val(enddate);
				$("#effecttime").val(now+" 至 "+enddate);
				//
				$(".daterangepicker").remove();
				$('#effecttime').daterangepicker({
					"showDropdowns": true,
	        	    "timePicker": true,
	        	    "timePicker24Hour": true,
	        	    "timePickerIncrement": 1,
	        	    "timePickerSeconds": true,
	        	    "autoApply": true,
	        	    "opens": "right",
	        	    "drops": "down",
	        	    locale : {
	        	            format: 'YYYY-MM-DD HH:mm:ss',
	        	            separator: ' 至 ',
	        	            applyLabel: '确定',
	        	            cancelLabel: '取消',
	        	            weekLabel: 'W',
	        	            customRangeLabel: 'Custom Range',
	        	            daysOfWeek: moment.weekdaysMin(),
	        	            monthNames: moment.monthsShort(),
	        	            firstDay: moment.localeData().firstDayOfWeek()
	        	        },
	        		minDate: now,
	        		startDate: now,
	                endDate: enddate
	        	},function(start, end, label) {
//					var startTime = $("input[name=daterangepicker_start]").val();
//					var endTime = $("input[name=daterangepicker_end]").val();
//					if(startTime == endTime){
//						$("#startTime").val(startTime);
//						$("#endTime").val(endTime);
//					}else{
//						$("#startTime").val(startTime);
//						$("#endTime").val(endTime);
//					}
	        		if(start.format('YYYY-MM-DD HH:mm:ss') != end.format('YYYY-MM-DD HH:mm:ss')){
	        			$("#startTime").val(start.format('YYYY-MM-DD HH:mm:ss'));
	        			$("#endTime").val(end.format('YYYY-MM-DD HH:mm:ss'));
	        		}else{
//	        			$("#startTime").val(now);
//	        			$("#endTime").val(end);
//	        			$("#startEndTime").val(now+" 至 "+enddate);
	        		}
	            });
         },
         roleSelect:function(){//TODO
        	 
         },
         dataselect:function(rolecode, permcode){//下拉列表数据获取
        	//状态
        	 mdboss.dataselect(this, "status", "COMMON_STATE");
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_role':'selected_dept',//选择部门
        	 'click .js_select_perm':'selected_person',
        	 "click #typeclass":"icon_select",
        	 "click .js_role_perm":"js_role_perm",//菜单,权限
         },
         js_role_perm:function(e){
        	//TODO  授权信息
        	 var v_this = this;
        	 var permcode=$(e.currentTarget).data("permcode"); 
        	 var perms = new Array();
        	 var dept = new Array();
        	 dept.push({"modulecode":permcode,"modulename":""});
        	 perms.push({"permcode":permcode,"permname":""});
			 seajs.use("rolepermselect", function () {
        		 new  mdboss.View.rolepermselectView({dept:dept, perms:perms,"selecttype":"radio",
        			 "pview":v_this,"callback":v_this.jsrolepermBack});
        	 });
         },
         jsrolepermBack:function(rdata, id){//TODO 回调
        	 rdata.pview.$el.find("#permcode").val(id);
         },
         icon_select:function(e){
 			_this=this;
 			$(e.currentTarget).attr("disabled",false);
 			 seajs.use("iconselect", function () {
 				 new mdboss.View.iconSelectView({parent:_this});
 			 });
 		},
         selected_person:function(e){
        	 _this=this;
        	 mdboss.selectedperson({"callbacks":_this.selpersoncallback});
         },
         selpersoncallback:function(data){
    	 	var template=Handlebars.compile($("#sel-personshow-template").html());
    		$(".selected_person_show").html(template({"persons":data}));
         },
         selected_dept:function(e){//角色选择
        	_this=this;
//        	var dept_arr=new Array();
// 	        seajs.use("selectrole", function () {
// 	         	dept_arr.push(_this.$el.find("#rolecode").val());
// 	        	new mdboss.View.moduleselectView({dept:dept_arr,parent:_this.$el,"callback":_this.dataSet,"pview":_this});
// 	        });
 	       seajs.use("selectRole", function () {
			 new  mdboss.View.selectRoleView({"roles":"","pview":_this,"selecttype":"radio", "callback":_this.showRole});
 	       });
         },
         showRole:function(rdata ,rolecode, rolename){
        	 console.log(rolecode);
        	 rdata.pview.$el.find("#rolecode").val(rolecode);
         },
         dataSet:function(treeNode, parent,pview){
        	 parent.find("#rolecode").val(treeNode.id);
        	 parent.find("#rolename").val(treeNode.name);
         },
         submit:function(e){//提交
        	 _this=this;
        	 var form_data = $( "#module_form" ).triggerHandler( "submitForm" );
        	 if(_this.rdata.tids){
        		 form_data = true;
        	 }
 	         if ( form_data ) {
	        	 var tid=$("#tid").val();
	        	 var rolecode=$("#rolecode").val();
	        	 var permcode=$("#permcode").val();
	        	 var status=$("#status").val();
	        	 var permdesc=$("#permdesc").val();
	        	 var startTime =$("#startTime").val();
        		 var endTime =$("#endTime").val();
	        	 
        		 
        		 if(permdesc);else permdesc= null; //
        		 if(status);else status= null; //
        		 if(startTime);else startTime= null; //
        		 if(endTime);else endTime= null; //
        		 
	        	 var callback = _this.callback;
	        	 var req={};
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.rolepadd;
	        	
	        	 if(_this.rdata.tids){
	        		 url =mdboss.api.rolepbatchedit;
	        		 req={"usercode":mdboss.usercode,
		                     "effecttime": startTime,"expiretime": endTime, "status": status};
	        		 req.tids = _this.rdata.tids;
	        	 }else{
	        		 req={"usercode":mdboss.usercode,
		                     "effecttime": startTime,"expiretime": endTime,
		                     "rolecode": rolecode, "permcode": permcode, "status": status, "permdesc": permdesc};
	        	 }
	        	 if(tid){
	        		 req.tid = tid;
	        		 url =mdboss.api.rolepedit;
	        	 }
	        	 var commonModel=new mdboss.Model.commonModel();
				 commonModel.save(req, {url:url,success:function(model,res){
	        		 if(res.rc==1){
	        			 if(tid || _this.rdata.tids){
	        				 mdboss.notifyTips("修改成功！");
	        			 }else{
	        				 mdboss.notifyTips("新增成功！");
	        			 }
	//                			 Backbone.history.loadUrl();
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
        	 _this=this;
        	 _this.dialog.close();
 		},
     });
});