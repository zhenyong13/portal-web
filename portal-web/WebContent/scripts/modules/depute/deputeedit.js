/**
 * 授权菜单管理
 * 使用方法
 * 
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss"), 
	$ = require("jquery"), 
	Dialog = require("dialog");
	require("daterangepicker_moment");
	require("daterangepicker");
	require("select2");
	require("fullcalendar");
	
	 
	// 权限选择
	mdboss.View.showMenuView = Backbone.View.extend({
		initialize : function(data) {
			var v_this = this;
			this.rdata = data;
			this.height = "280px";
			if(data.tids){
				this.height ="150px";
			}
			var dialog = new Dialog({ type : "html", value : '<div class="loading"></div>',
				fillCallback : function() {
					$(this).find(".scrollwrapper").jScrollPane();
				}
			}, {
				"title" : "委托权限设置", "width" : "810px", "height" : this.height, "icon" : "iconfont icon-mdliucheng",
				"resize" : function() {
					$(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
				}
			}).show(function() {		
				var _this = this;
				v_this.dialog_ = this;
				var reqData = new Array();
				if(v_this.rdata.tid)
					reqData.push({ "name":"entrustdetail","post":{"usercode":mdboss.usercode,"tid":v_this.rdata.tid},"cache" : false});
		    	
				if(v_this.rdata.tid){//编辑
					mdboss.getReady({data:reqData, template: [] }, function (result, msg) {//
			            if (result) {
			            	var sdata = null;
			            	var template =null;
			            	if(v_this.rdata.view){
			            		template = Handlebars.compile(require("text!template/page/depute/deputedetail.html"));
			            	}else{
			            		template = Handlebars.compile(require("text!template/page/depute/deputeedit.html"));
			            	}
			            		
							var html = "";
							if(v_this.rdata.tid){
								sdata = result.data["entrustdetail"];
								sdata.current_username = mdboss.cache.data["getMyInfo"].username;
								html = template(sdata);
							}else{
								html = template({"current_username":mdboss.cache.data["getMyInfo"].username});
							}
							
							$(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
							$(_this.dialog).find(".dialog-content-wrap").attr("style","");
							$(_this.dialog).find(".loading").removeClass("loading");
							v_this.dataselect(sdata.bustype);
							v_this.dateSet(sdata);
//							TODO 委托事项
							
							if(sdata.busitem){
								var tmplist = eval(sdata.busitem); 
								var deptshow=new Array();
								$.each(tmplist,function(index,item){
									deptshow.push('<span class="file-show" style="margin-left:10px;" data-code="'+item.code+'">');
									deptshow.push('<a id="sl_'+item.code+'" data-edit="true" data-id="'+sdata.buscode+"_"+item.code+'" data-name="'+item.name+'">'+item.name+'</a> ');
									deptshow.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
									deptshow.push('</span>');
								});
								$(".selected_inst_show").html(deptshow.join(""));
							}
							//
			            } else {
			           	 	mdboss.error(msg);
			            }
			        });
            	}else{//新增 批量修改
            		var template = null;
            		if(v_this.rdata.tids){
            			template = Handlebars.compile(require("text!template/page/depute/deputebatchedit.html"));
						var html  = template({"current_username":mdboss.cache.data["getMyInfo"].username});
						$(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
						$(_this.dialog).find(".dialog-content-wrap").attr("style","");
						$(_this.dialog).find(".loading").removeClass("loading");
            		}else{
            			template = Handlebars.compile(require("text!template/page/depute/deputeedit.html"));
						var html = template({"current_username":mdboss.cache.data["getMyInfo"].username});
						$(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
						$(_this.dialog).find(".dialog-content-wrap").attr("style","");
						$(_this.dialog).find(".loading").removeClass("loading");
						v_this.dataselect();
            		}
            		v_this.dateSet();
            	}
			});
			this.$el = dialog.$html;// 
		},
		events:{
			"click #pwdd-btn-cancel":"cancelShow",//取消
			"click #doRightNow":"doRightNow",//全部事项
			"click #pwdd-btn-update":"submitShow",//提交
			"click .js_search_man":"selectMan",//提交
			 "focus #delegate_man_":'delegateMan',//搜索委托人
        	 "keyup #delegate_man_":'delegateMan',//搜索委托人
        	 "click .js_search_inst":'js_search_inst',//搜索
		},
		doRightNow:function(e){//
			console.log($(e.currentTarget).prop("checked") );
			if( $(e.currentTarget).prop("checked")){
				this.$el.find("#deputeAll").hide();
			}else{
				this.$el.find("#deputeAll").show();
			}
		},
		dateSet:function(sdata){
			var v_this = this;
			var now = moment().startOf('day').format('YYYY-MM-DD');
			var enddate =  moment().endOf('day').format('YYYY-MM-DD');
			if(v_this.rdata.tid){
				now = sdata.starttime;
				enddate = sdata.endtime;
			}
			$("#startTime").val(now);
			$("#endTime").val(enddate);
			$("#startEndTime").val(now+" 至 "+enddate);
			$(".daterangepicker").remove();
			$('#startEndTime').daterangepicker({
        	    "autoApply": true,
        	    "opens": "right",
        	    "drops": "down",
        	    locale : {
        	            format: 'YYYY-MM-DD',
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
        		if(start.format('YYYY-MM-DD') != end.format('YYYY-MM-DD')){
        			$("#startTime").val(start.format('YYYY-MM-DD'));
        			$("#endTime").val(end.format('YYYY-MM-DD'));
        		}else{
//        			$("#startTime").val(now);
//        			$("#endTime").val(end);
//        			$("#startEndTime").val(now+" 至 "+enddate);
        		}
            });
		},
		dataselect:function(bustype){
			//事项类型
			mdboss.dataselect(this, "deputeType", "COMMON_ISSUETYPE",bustype);
		},
		js_search_inst:function(){//TODO
 	        
 	       _this=this;
 	       var dept_arr=new Array();
	        seajs.use("processinst", function () {
	        	var $seldept=$(".selected_inst_show .file-show a:first-child");
	        	$seldept.each(function(index,item){
	         		dept_arr.push({"code":$(item).data("id"),"name":$(item).data("name")});
	         	});
	        	new mdboss.View.processinstView({dept:dept_arr,parent:_this.$el,"callbacks":_this.selpersoncallback});
	        });
		},
		selpersoncallback:function(data){
    		$(".selected_inst_show").html(data);
         },
		delegateManKey:function(e){//回车搜索
        	if(e.which ==13){
        		this.delegateMan(e);
        	}
        },
        delegateBack:function(pview, usercode, name){
//        	pview.renderData();
        },
        delegateMan:function(e){
        	mdboss.userselect(e, this, this.delegateBack);	 
        },
		submitShow:function(){//提交 
			var v_this =this;
			var callback = v_this.rdata.renderData;
			var tid = v_this.rdata.tid;
			
//			var depute_man = $("#depute_man").val();//被委托人
			var depute_code = $("#delegate_man_").attr("data-code");//被委托人
			var deputeType = $("#deputeType").val();//事项类型
			var doRightNow = $("#doRightNow").prop("checked");//全部事项
			
//			var deputeItems = new Array();
        	var $seldept=$(".selected_inst_show .file-show a:first-child");
        	var busitem ={};
        	var busCode =new Array();
        	$seldept.each(function(index,item){
        		var id = $(item).data("id");
        		var name = $(item).data("name");
        		var pcode = id.split("_")[0];
        		var code = id.split("_")[1];
        		var items = null;
        		console.log(pcode+"_" +code);
        		if(busitem[pcode]){
        			items = busitem[pcode];// busitem.pcode;
        		}else{
        			busCode.push(pcode);
        			items = new Array();
        			busitem[pcode] = items;
        		}
        		console.log("items="+items);
        		items.push({"code":code, "name":name});
//        		deputeItems.push($(item).data("id"));
         	});
        	console.log(busitem);
			var startTime = $("#startTime").val();//开始时间
			var endTime = $("#endTime").val();//结束时间
			
			var reqData ={"usercode":mdboss.usercode};
			var url = mdboss.api.entrustadd;
			if(tid){
				reqData.tid = v_this.rdata.tid;
				url = mdboss.api.entrustedit;
			}
			
			if(v_this.rdata.tids){
				url = mdboss.api.entrustbatchedit;
				reqData.tids = v_this.rdata.tids;//事项类型
				reqData.starttime = startTime;//事项
				reqData.endtime = endTime;//事项
			}else{
				
				if(depute_code == ""){
					mdboss.error("被委托人不能为空！");return;
				}
				if(deputeType == ""){
					mdboss.error("委托类型不能为空！");return;
				}
				
				if(doRightNow){//全部事项
//					startTime =  $.fullCalendar.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss");
					reqData.bustype = deputeType;//事项类型
//					reqData.buscode = item;//事项编码 TODO
//					reqData.busitem = busitem[item];//事项
					reqData.starttime = startTime;//事项
					reqData.endtime = endTime;//事项
					reqData.delegate = mdboss.usercode;//委托人
					reqData.delegated = depute_code;//被委托人
				}else{
					if(busitem.length == 0){
						mdboss.error("委托事项不能为空！");return;
					}
					
					var createBatch = new Array();
					$.each(busCode, function(i, item){
						var reqBatchData ={};
						reqBatchData.bustype = deputeType;//事项类型
						reqBatchData.buscode = item;//事项编码 TODO
						reqBatchData.busitem = busitem[item];//事项
						reqBatchData.starttime = startTime;//事项
						reqBatchData.endtime = endTime;//事项
						reqBatchData.delegate = mdboss.usercode;//委托人
						reqBatchData.delegated = depute_code;//被委托人
						createBatch.push(reqBatchData);
					});
					console.log(createBatch);
					reqData.batch = createBatch;
				}
//				reqData.tid = tid;
			}
			
			var commonModel = new mdboss.Model.commonModel();
			commonModel.save(reqData,{url:url,success:function(m,res){
				if(res.rc == 1){
					if(tid || v_this.rdata.tids){
						mdboss.alert("修改成功！");
					}else{
						mdboss.alert("添加成功！");
					}
					v_this.dialog_.close();
					var callbackFn = typeof callback == "function" ? callback : function () { };
					 callbackFn(v_this.rdata.pview);
				}else{
					mdboss.error(res.msg);
				}
			},error:function(){
				mdboss.error();
			}});
		},
		cancelShow:function(){ //取消
			this.dialog_.close();
		},
	});
});