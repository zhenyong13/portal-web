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
    require("daterangepicker_moment");
	require("daterangepicker");
    require("bootbox");
    require("dialog");
    var util = require("util");
    require("validVal")($);
    var mdboss = require("mdboss");
    require("fullcalendar");
    var accounting=require("accounting");
    var dynamictable=require("dynamictable");
    var commonevents=require("commonevents");
    Backbone.emulateJSON = true;
    //{el:el,formdata:formdata}
    mdboss.View.dynamicformView=Backbone.View.extend({
    	initialize:function(options){
    		debugger;
    		this.rdata = options;
    		this.uuid=mdboss.getuuid();
    		var template;
    		//特殊表单处理
    		this.specialdataList=[];//特殊的数据
    		this.specialdata={};//特殊的数据
    		this.special=false;//是否有特殊模版
    		if(options.isprint){
    			template=require("text!../../../template/page/process/form/dynamicformprint.html");
    		}else if(options.issimple){
    			template=require("text!../../../template/page/process/form/dynamicformsimple.html");
    		}else{
    			template=require("text!../../../template/page/process/form/dynamicform.html");
    		}
    		//-----------------------------------------------
    		//-----------------------------------------------
    		this.template=template;
    		this.formdata=options.formdata;
    		this.data=this.dataparse();
    		this.isprint=options.isprint;
    		this.issimple=options.issimple;
    		if(!this.special){//判断不是特殊表单
    			if(options.isprint){
        			this.$el.html(this.template);
        		}else{
        			this.$el.find(".dynamicform").append(this.template);
        		}
    		}
    		
    		this.formpost={};
    		this.tmpsubmitdata={};//处理提交时差异的数据
    		this.tmpsavedata={};//处理保存时差异的数据
    		this.dynamicdata={};
    		this.render();
    	},
    	/**------------------------人员部门选择---------------------------------------------------------------------*/
    	events:{
    		"click .j_dept_select":"deptSelect",//部门选择
    		"focus #username":"userSelect",//人员选择
    		"keyup #username":"userSelect",//人员选择
    	},
    	deptSelect:function(e){//部门选择
    		var _this=this;
       	    var dept_arr=new Array();
	        seajs.use("orgs", function () {
	        	if(_this.$el.find("#deptcode").val() != ""){
	        		dept_arr.push(_this.$el.find("#deptcode").val());
	        	}
	        	new mdboss.View.orgsView({dept:dept_arr,parent:_this.$el,"selectOnly":true,
	        		"callbacks":_this.searchByOrg,"pview":_this,"title":"组织选择"});
	        });
    	},
    	searchByOrg:function(treeNode, parent, pview){//TODO
	   		 parent.find("#orgcode").val(treeNode.id);
	       	 parent.find("#orgname").val(treeNode.name);
        },
    	delegateBack:function(pview, usercode, name){//人员选择 回调
    		pview.$el.find("#usercode").val(usercode);
        },
        userSelect:function(e){ //人员选择
       	   mdboss.userselect(e, this, this.delegateBack);
        },
        /**------------------------人员部门选择---------------------------------------------------------------------*/
    	render:function(){
    		var _this=this;
    		debugger;
    		if(_this.special){//渲染特殊页面 模版数据 //TODO
    			if(!_this.isprint){//非打印
	        		var templateSpecial =_this.specialformtemplate();
	        		if(_this.rdata.processLoadData!=undefined&&_this.rdata.processLoadData.data!=undefined){
	    				var buttons=_this.rdata.processLoadData.data.buttons;
	    				$.each(buttons,function(index,item){
	    					switch(item){
	    					case "readed":_this.rdata.processLoadData.data.shownextstep=false;break;
	    					}
	    				});
	    			}
	        		var dynamictemplate=require("text!../../../template/page/process/form/dynamicform.html");
	        		var shtml = templateSpecial({"formData":_this.specialdata,"random":mdboss.getuuid(),"processdefLoad":_this.rdata.processLoadData});
	        		var $content=_this.$el.find(".forms-content .jspPane");
	    			if($content.html()==undefined){
	        			$content=_this.$el.find(".forms-content .dynamicform");
	        			$content.append(shtml);
	        		}else{
	        			_this.$el.find(".forms-content .dynamicform").append(shtml);
	        		}
	    			_this.$el.find(".forms-content .dynamicform").append(dynamictemplate);
    			}else{//打印
    				var templateSpecialPrint =_this.specialformprinttemplate();
	        		var shtml = templateSpecialPrint({"formData":_this.specialdata,"baseUrl":baseConfig.avatar_url});
	        		_this.$el.html(shtml);
    			}
    		}else{
    			_this.regionhtml();
        		_this.attributehtml();
        		if(_this.isprint){
        			$(".print-border[beforecol=true]").each(function(i,item){
        				var width=$(item).attr("beforewidth");
        				var $prev=$(item).prev();
        				var newwidth=parseInt($prev.data("col"))+parseInt(width);
        				
        				$prev.removeClass("col-"+$prev.data("col")).addClass("col-"+newwidth).css("border-right","0px");
        			});
            		$(".print-border[curcol=true]").css("border-right","0px");
            		
            		
        		}
    		}//end
    		
    		
    		
    		_this.$el.find( ".processform" ).validVal();
    		_this.$el.find("[data-ueditor]").each(function(i,uedit){
				var content=$(uedit).data("content");
				var editor=new UE.getEditor($(uedit).data("ueditor"),{
	                 	 initialFrameWidth :'100%',//设置编辑器宽度
	                 	 initialFrameHeight:200,//设置编辑器高度
	                 	 scaleEnabled:true
            	 });
				editor.addListener("ready", function () {
					editor.setContent(content);
     			});
				
			});
    		//日期只选年
    		_this.$el.find('.dateyear').datetimepicker({
                format: 'yyyy',
                startView:4,
                minView: 4,
                autoclose: true,
                language: 'zh-CN',
                startDate: '+0d'
            }).on('changeDate', function(ev){
            	$(this).focus().blur();//处理选择时间后，输入框边框还是红色问题
            });
    		_this.$el.find('.datemonth').datetimepicker({
    			startView:3,
                format: 'yyyy-mm',
                minView:3,
                autoclose: true,
                language: 'zh-CN'
            }).on('changeDate', function(ev){
            	$(this).focus().blur();//处理选择时间后，输入框边框还是红色问题
            });
    		_this.$el.find('.datebefore').datetimepicker({
    			minView: 2,
                format: 'yyyy-mm-dd',
                autoclose: true,
                language: 'zh-CN',
                fontAwesome:true
            }).on('changeDate', function(ev){
            	$(this).focus().blur();//处理选择时间后，输入框边框还是红色问题
            });
    		_this.$el.find('.date').datetimepicker({
                format: 'yyyy-mm-dd',
                minView: 2,
                autoclose: true,
                todayBtn: true,
                language: 'zh-CN',
                startDate: '+0d'
            }).on('changeDate', function(ev){
            	$(this).focus().blur();//处理选择时间后，输入框边框还是红色问题
            });
    		_this.$el.find('.datetime').datetimepicker({
                format: 'yyyy-mm-dd hh:mm:ss',
                minView: 1,
                autoclose: true,
                language: 'zh-CN',
                startDate: '+0d'
            }).on('changeDate', function(ev){
            	$(this).focus().blur();//处理选择时间后，输入框边框还是红色问题
            });
    		
    		_this.$el.find('.datem').datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                autoclose: true,
                language: 'zh-CN',
                startDate: '+0d'
            }).on('changeDate', function(ev){
            	$(this).focus().blur();//处理选择时间后，输入框边框还是红色问题
            });
    		
    		_this.$el.find('.time').datetimepicker({
                format: 'hh:mm:ss',
                minView: 1,
                autoclose: true,
                language: 'zh-CN',
                startDate: '+0d'
            }).on('changeDate', function(ev){
            	$(this).focus().blur();//处理选择时间后，输入框边框还是红色问题
            });;
           	_this.$el.find("select:visible").select2({width:'55%'});
        	_this.$el.find("div.serialcode select:visible").select2();
           	_this.$el.find("select[multi=multi]:visible").select2({width:'80%'});
        	_this.$el.find("select[multi=multi][data-async=true]:visible").select2({
        		templateResult:function(repo){
        			    return repo.text;
        		},
        		ajax: {
        			  delay: 250,
        			  url: function (params) {
        			    return mdboss.api.multiselAsync;
        			  },
        			  data: function (params) {
        			    var queryParameters ={keyword:params.term,"usercode":mdboss.usercode};
        			    return queryParameters;
        			  },
        			  processResults: function (data) {
        				  var rows=new Array();
        				  if(data.data.value){
        					  $(data.data.value).each(function(i,item){
        						  rows.push({"id":item.code,"text":item.name});
        					  });
        				  }
        				  return {
        			      results: rows
        			    };
        			  },
        			  transport: function (params, success, failure) {
        				  var itemcode="";
        				  if(params.url){
        					  var arr=params.url.split("=");
        					  if(arr.length==2){
        						  itemcode=arr[1];
        					  }
        				  };
        				 var commonModel=new mdboss.Model.commonModel();
        				 params.data.itemcode=itemcode;
        				 params.url=mdboss.api.multiselAsync;
        				 commonModel.save(params.data,{url:params.url,success:function(m,res){
        					 success(res);
        				 },error:function(m,res){
        					 failure(res);
        				 }});
        			  }
        			}
        	});
        	
        	_this.$el.find("select.js_serialcode:visible").select2({
        		templateResult:function(repo){
        			    return repo.text;
        		},
        		ajax: {
        			  delay: 250,
        			  url: function (params) {
        			    return mdboss.api.querySericode;
        			  },
        			  data: function (params) {
        			    var queryParameters ={keyword:params.term,"usercode":mdboss.usercode};
        			    return queryParameters;
        			  },
        			  processResults: function (data) {
        				  var rows=new Array();
        				  if(data.data){
        					  $(data.data).each(function(i,item){
        						  rows.push({"id":item.code,"text":item.name});
        					  });
        				  }
        				  return {
        			      results: rows
        			    };
        			  },
        			  transport: function (params, success, failure) {
        				  if(params.url){
        					  var arr=params.url.split("=");
        					  if(arr.length==2){
        						  itemcode=arr[1];
        					  }
        				  };
        				 var commonModel=new mdboss.Model.commonModel();
        				 params.url=mdboss.api.querySericode;
        				 params.data.serialcode=params.data.keyword;
        				 delete params.data.keyword;//删除JSON中keyword字段
        				 commonModel.save(params.data,{url:params.url,success:function(m,res){
        					 success(res);
        				 },error:function(m,res){
        					 failure(res);
        				 }});
        			  }
        			}
        	});
        	
        	$('.multidatem').daterangepicker({
        		"timePicker":true,
    			locale : {
    	            format: 'YYYY-MM-DD a',
    	            separator: ' 至 ',
    	            applyLabel: '确定',
    	            cancelLabel: '取消',
    	            weekLabel: 'W',
    	            customRangeLabel: 'Custom Range',
    	            daysOfWeek: moment.weekdaysMin(),
    	            monthNames: moment.monthsShort(),
    	            firstDay: moment.localeData().firstDayOfWeek()
    	        }
        	},function(start,end,label){
        		var currentId=$(this.element).attr("id");
        		$("#"+currentId+"-sumday").val(util.getsumday(start._d,end._d));
        	});
        	$('.multidatetime').daterangepicker({
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
    	        }
        	},function(start,end,label){
        		var currentId=$(this.element).attr("id");
        		$("#"+currentId+"-sumday").val(util.getsumday(start._d,end._d));
        	});
        	$('.multidatem').daterangepicker({
    			"showDropdowns": true,
        	    "timePicker": true,
        	    "timePicker24Hour": true,
        	    "timePickerIncrement": 1,
        	    "timePickerSeconds": true,
        	    "autoApply": true,
        	    "opens": "right",
        	    "drops": "down",	
    			locale : {
    	            format: 'YYYY-MM-DD HH:mm',
    	            separator: ' 至 ',
    	            applyLabel: '确定',
    	            cancelLabel: '取消',
    	            weekLabel: 'W',
    	            customRangeLabel: 'Custom Range',
    	            daysOfWeek: moment.weekdaysMin(),
    	            monthNames: moment.monthsShort(),
    	            firstDay: moment.localeData().firstDayOfWeek()
    	        }
        	},function(start,end,label){
        		var currentId=$(this.element).attr("id");
        		$("#"+currentId+"-sumday").val(util.getsumday(start._d,end._d));
        	});
        	$('.multidate').daterangepicker({
        	},function(start,end,label){
        		var currentId=$(this.element).attr("id");
        		$("#"+currentId+"-sumday").val(util.getsumday(start._d,end._d));
        	});
           	_this.$el.find(".jscroll").jScrollPane();
    	},
    	specialformtemplate:function(){//获取表单模板
    		var cur_this=this;
    		switch (cur_this.rdata.special) {
			case "assessmentform":
				return Handlebars.compile(require("text!template/page/process/form/assessment.html"));
			case "performanceform":
				return Handlebars.compile(require("text!template/page/process/form/performance.html"));
			default:
				break;
			}
    	},
    	specialformprinttemplate:function(){//获取打印表单模板
    		var cur_this=this;
    		switch (cur_this.rdata.special) {
				case "assessmentform":
					return Handlebars.compile(require("text!template/page/process/print/assessment.html"));
				case "performanceform":
					return Handlebars.compile(require("text!template/page/process/print/performance.html"));
				default:
					break;
			}
    	},
    	dataparse:function(){
    		var _this=this;
    		var formdata=_this.formdata;
    		var data=[];
    		for(var key in formdata){
    			var attr=formdata[key];
//    			console.log(attr.regionorder+"_"+attr.region);
    			if(attr.region && attr.region =="special"){//分组 特殊分组 TODO
//    				_this.specialdata[attr.code].push( attr );
    				_this.special = true;
    				_this.specialdataList.push(attr);
    				_this.specialdata[attr.code]= attr;
    			}else{
    				//判断是否为特殊字段
    				if(data[attr.regionorder]!=undefined){
    						data[attr.regionorder].attrs.push(attr);
    				}else{
    					data[attr.regionorder]={"regionorder":attr.regionorder,isshow:false,"region":attr.region,"attrs":[attr]};
    				}
    				if(attr.isshow){
						data[attr.regionorder].isshow=true;
					}
    			}
    		}
    		data.sort(_this.getSortFun("asc","regionorder"));
    		for(var i=0;i<data.length;i++){
    			if(data[i]!=undefined){
    				data[i].attrs.sort(_this.getSortFun("asc","itemorder"));
    			}
    		}
    		return data;
    	},
    	regionhtml:function(){//生成regionhtml
    		var _this=this;
    		 var template = Handlebars.compile($("#region-template").html());
    		var regionhtml= template(_this.data);
    		var $content=_this.$el.find(".forms-content .jspPane");
			if($content.html()==undefined){
    			$content=_this.$el.find(".forms-content .dynamicform");
    			$content.append(regionhtml);
    		}else{
    			_this.$el.find(".forms-content .dynamicform").append(regionhtml);
    		}
    		
    	},
    	attributehtml:function(){//动太渲染html
    		var _this=this;
    		//attr={"region": "便签", "isshow": true,"itemorder": 17,"name": "公文便签","value": [],"code": "formitem-017","type": "text","required": true,"regionorder": 4,"editable": true,"col":12}
    		$(_this.data).each(function(index,region){
//    			console.log(region);
    			if(region!=undefined){
    				var html=new Array();
    				var column=0;
    				var regionlength=region.attrs.length;
    				var handleAttrs=[];
    				var beforeKey="";
        			$(region.attrs).each(function(i,attr){
        				
        				if(_this.isprint||_this.issimple){//打印时需要动态调整样式
        					if(attr.type!="printform_title"){//打印title不加入表格计算
        						attr.beforecol=false;
                				attr.curcol=false;
                				if(i<regionlength-1){
                					if(column<=12){
                    					column+=attr.cols;
                    					if(column>12){//当前面的列相加少于12时，前面最后一列需要加宽使相加等12
                    						attr.beforewidth=12-(column-attr.cols);//前一列的需要加宽列数
                    						column=attr.cols;
                    						if(beforeKey!=""){
                        						var beforeAttr=handleAttrs[beforeKey];
                        						beforeAttr.cols=beforeAttr.cols+attr.beforewidth;
                        						beforeAttr.curcol=true;
                    							handleAttrs[beforeKey]=beforeAttr;
                    						}
                        					attr.beforecol=true;//标识前一列不需要右边框
                    					}else if(column==12){//相加等12标识当前列为最后一列
                    						column=0;
                        					attr.curcol=true;//标识当前列不需要右边框
                    					}
                    					
                    				}
                				}else{
                					//判断为区域最后一列时
                					column+=attr.cols;
                					if(column<12){//判断之前列相加小于12，加宽当前列的宽度，使相加等于12
                						attr.cols+=12-column;
                					}else if(column>12){//判断之前列相加大于12,标识之前一列需要处理，同时对当前列加宽，使等于12
                						attr.beforewidth=12-(column-attr.cols);//前一列的需要加宽列数
                    					attr.beforecol=true;//标识前一列不需要右边框
                    					if(beforeKey!=""){
                    						var beforeAttr=handleAttrs[beforeKey];
                    						beforeAttr.cols=beforeAttr.cols+attr.beforewidth;
                    						beforeAttr.curcol=true;
                							handleAttrs[beforeKey]=beforeAttr;
                						}
                    					attr.cols+=12-attr.cols;
                					}
                					column=0;
                					attr.curcol=true;//标识当前列不需要右边框
                				}
            				}
        					
            				beforeKey=attr.code+"_";//防止key为数字时数组顺序混乱
            				handleAttrs[attr.code+"_"]=attr;
        				}else{
        					handleAttrs[attr.code+"_"]=attr;
        				}
        			});
        			for(var key in handleAttrs){
        				if(typeof handleAttrs[key] !="function"){
        					var templatehtml=_this.getAttributeHtml(handleAttrs[key]);
            				if(templatehtml){
            					html.push(templatehtml);
            				}
        				}
        				
        			}
        			_this.$el.find(".js_region"+region.regionorder).append(html.join(""));
    			}
    			
    		});
    		_this.$el.find(".jscroll").jScrollPane();
    	},
    	getAttributeHtml:function(attr){
    		var _this=this;
    		if($.trim(attr.name)!=""&&$.trim(attr.name).length>0){
    			attr.name=attr.name+"：";
    		}
    		switch(attr.type){
    		case "label"://文本
    			var template = Handlebars.compile($("#label-template").html());
    			return template(attr);
    		case "title"://文本
    			var template = Handlebars.compile($("#title-template").html());
    			return template(attr);
    		case "text"://文本
    			var template = Handlebars.compile($("#input-template").html());
    			attr.customstr=JSON.stringify(attr.custom);
    			return template(attr);
    		case "date":
    			var template = Handlebars.compile($("#date-template").html());
    			return template(attr);
    		case "radio"://单选按钮
    			var template = Handlebars.compile($("#radio-template").html());
    			attr.random=mdboss.getuuid();//防止多窗口时ID冲突，添加随机数
    			if(attr.custom==undefined){
    				attr.custom={};
    				attr.custom.isstyle=true;
    				attr.custom.isnewline=false;
    			}
    			if(attr.custom.eventparams){
    				attr.custom.eventparamsstr=JSON.stringify(attr.custom.eventparams);
    			}
    			//必选时默认设置
    			if(attr.required){
    				var hasvalue=false;
    				$(attr.value).each(function(i,item){
    					if(item.selected){
    						hasvalue=true;
    						return;
    					}
    				});
    				if(!hasvalue){
    					$(attr.value).each(function(i,item){
    						if(item.name==attr.custom.selectedname){
    							item.selected=true;
    						}
    					});
    				}
    			}
    			return template(attr);
    		case "checkbox"://多选按钮
    			var template = Handlebars.compile($("#checkbox-template").html());
    			attr.random=mdboss.getuuid();//防止多窗口时ID冲突，添加随机数
    			if(!attr.custom){
    				attr.custom={};
    			}
    			return template(attr);
    		case "select"://下拉
    			var template = Handlebars.compile($("#select-template").html());
    			return template(attr);
    		case "multiselect"://多选
    			var template = Handlebars.compile($("#multiselect-template").html());
    			attr.url=mdboss.api.multiselAsync+"?itemcode="+attr.code;
    			if(attr.custom==undefined){
    				attr.custom={};
    				attr.custom.isasync=false;
    			}
    			return template(attr);
    		case "orgpicker"://组织结构
    			var template = Handlebars.compile($("#selectorgs-template").html());
    			if(attr.custom){
    				attr.customstr=JSON.stringify(attr.custom);
    			}else{
    				attr.customstr="";
    			}
    			return template(attr);
    		case "fileupload"://上传
    			var template = Handlebars.compile($("#fileupload-template").html());
    			attr.baseUrl=baseConfig.avatar_url;
    			if(attr.custom!=null){
    				attr.customstr=JSON.stringify(attr.custom);
    			}
    			attr.random=mdboss.getuuid();//防止多窗口时ID冲突，添加随机数
    			return template(attr);
    		case "memo"://便签
    			if(!_this.isprint){
    				var template = Handlebars.compile($("#memoshow-template").html());
        			attr.baseUrl=baseConfig.avatar_url;
    				return template(attr);
    			}else{
    				return ;
    			}
    		case "serial"://顺序号
    			var template = Handlebars.compile($("#serialcode-template").html());
    			attr.url=mdboss.api.querySericode+"?itemcode="+attr.value[0].serial.code;
    			if(attr.custom==undefined){
    				attr.custom={};
    				attr.custom.isasync=false;
    			}
    			return template(attr);
    		case "textarea"://多行文本框
    			var template = Handlebars.compile($("#textarea-template").html());
    			return template(attr);
    		case "dealopinion"://处理意见
    			var template = Handlebars.compile($("#dealopinion-template").html());
    			$(attr.value).each(function(i,item){
    				if(item.signfilecode){
    					item.signfile=baseConfig.avatar_url+item.signfilecode;
        			}
    			});
    			
    			return template(attr);
    		case "tablelist"://tablelist
    			var template = Handlebars.compile($("#tablelist-template").html());
				var data=dynamictable.getdata(attr);
				attr.dataconfig=JSON.stringify(data);
				attr.baseUrl=baseConfig.avatar_url;
				return template(data);
    		case "picker":
    				var template = Handlebars.compile($("#picker-template").html());
        			attr.value=[{"code":attr.code,"name":attr.name}];
        			if(attr.custom==undefined){
        				attr.custom={};
        			}
        			attr.custom.pickername=attr.code;//pickername
        			attr.customstr=JSON.stringify(attr.custom);
        			return template(attr);
    		case "btn":
				var template = Handlebars.compile($("#btn-template").html());
				var name=attr.name;
				var float="right";
				if(attr.custom){
					name=attr.custom.pickerlabel;//按钮名称
					float=attr.custom.pickerfloat;//浮动方向
				}
				attr.value=[{"code":attr.code,"name":name,"float":float}];
    			attr.customstr=JSON.stringify(attr.custom);
    			return template(attr);
    		case "multidate":
    			var template = Handlebars.compile($("#multidate-template").html());
    			
    			var newvalue={};
    			var oldvalue=attr.value[0];
    			if(oldvalue&&oldvalue.starttime&&oldvalue.endtime){
    				var multidate=oldvalue.starttime.value+"至"+oldvalue.endtime.value;
        			newvalue={"multidate":multidate};
        			if(oldvalue.sumday){
        				var sumday=oldvalue.sumday.value;
        				newvalue.sumday=sumday;
        				newvalue.issumday=true;
        			}
    			}
    			attr.value[0]=newvalue;
    			attr.mixtype="multidate-"+attr.code;
    			return template(attr);
    		case "simpleselectperson":
    			var template = Handlebars.compile($("#simpleselectperson-template").html());
    			attr.customstr=JSON.stringify(attr.custom);
    			return template(attr);
    		case "selectperson":
    			var template = Handlebars.compile($("#selectperon-template").html());
    			return template(attr);
    		case "ueditor":
    			var script='<script id="{{code}}_{{uuid}}" type="text/plain"></script>';
    			var html=$("#ueditor-template").html();
    			html=html.replace(/@editor@/g,script);
    			var template = Handlebars.compile(html);
    			attr.uuid=_this.uuid;
    			if(attr.value[0]){
    				var value=attr.value[0].code;
    				attr.value=value;
    			}
    			return template(attr);
    		case "taskhandle":
    			var html=$("#taskhandle-template").html();
    			var template = Handlebars.compile(html);
    			//判断是否显示下一处理人及下一环节
    			if(_this.rdata.processLoadData!=undefined&&_this.rdata.processLoadData.data!=undefined){
    				var buttons=_this.rdata.processLoadData.data.buttons;
    				$.each(buttons,function(index,item){
    					switch(item){
    					case "readed":_this.rdata.processLoadData.data.shownextstep=false;break;
    					}
    				});
    			}
    			if(attr.isshow){
    				if(!_this.rdata.isprint&&_this.rdata.processLoadData.data.opinion==null){
    					_this.rdata.processLoadData.data.opinion={};
    					_this.rdata.processLoadData.data.opinion.isshow=true;
    				}
    			}
    			var random=mdboss.getuuid();
    			return template({attr:attr,"processdefLoad":_this.rdata.processLoadData,"random":random,"commonoption":_this.rdata.commonoption});
    		case "printform_title":
				//特殊处理标题
    			if(attr.value!=null&&attr.value.length>0){
    				$("#printform_title").html(attr.value[0].code);
    			}
    			return;
    		};
    	},
    	getSortFun:function(order, sortBy) {
    	    var ordAlpah = (order == 'asc') ? '>' : '<';
    	    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
    	    return sortFun;
    	},
    	getAttrData:function(attr){
    		var _dy_this=this;
    		switch(attr.type){
    		case "label":
    			return _dy_this.formpost[attr.code]=_dy_this.$el.find("#"+attr.code).val();
    		case "text":
    			return _dy_this.formpost[attr.code]=_dy_this.$el.find("#"+attr.code).val();
    		case "simpleselectperson":
    			return _dy_this.formpost[attr.code]={"code":_dy_this.$el.find("#"+attr.code).data("code"),"name":_dy_this.$el.find("#"+attr.code).val()};
    		case "selectperson":
    			var selectedvalues=new Array();
    			_dy_this.$el.find("."+attr.code+"-showperson .file-show a:first-child").each(function(i,item){
  				  var code=$(item).data("id");
  				  var name=$(item).data("name");
  				  selectedvalues.push({"code":code,"name":name});
    			});
    			_dy_this.formpost[attr.code]=selectedvalues;
    			if(attr.required){
    				if(selectedvalues.length>0){
    					_dy_this.$el.find("#requiredflag"+attr.code).val("1");//标识是否必填
        			}
    			}
    			return ;
    		case "date":
    			return _dy_this.formpost[attr.code]=_dy_this.$el.find("#"+attr.code).val();
    		case "radio":
    			var val=_dy_this.$el.find("input[name="+attr.code+"]:checked").val();
    			_dy_this.formpost[attr.code]=val;
    			if(attr.required){
    				if(val!=undefined&&val!=""){
    					_dy_this.$el.find("#requiredflag"+attr.code).val("1");//标识是否必填
    				}
    			}
    			return ;
    		case "checkbox":
    			var checkedvals=new Array();
    			_dy_this.$el.find("input[name="+attr.code+"]:checked").each(function(index,item){
    					checkedvals.push($(this).val());
    				});
    			if(attr.required){
    				if(checkedvals.length>0){
    					_dy_this.$el.find("#requiredflag"+attr.code).val("1");//标识是否必填
        			}
    			}
    			return _dy_this.formpost[attr.code]=checkedvals;
    		case "select":
    			return _dy_this.formpost[attr.code]=_dy_this.$el.find("#"+attr.code).val();
    		case "multiselect":
    			var selectedvals=new Array();
    			_dy_this.$el.find("#"+attr.code+" option:selected").each(function(index,item){
    				selectedvals.push($(item).val());
               });
    			return _dy_this.formpost[attr.code]=selectedvals;
    		case "orgpicker":
    			var tmpsubmit=new Array();
    			var tmpsave=new Array();
    			_dy_this.$el.find("."+attr.code+"-showorgs .file-show a:first-child").each(function(index,item){
    				var code=$(item).data("id");
    				var name=$(item).data("name");
    				var edit=$(item).data("edit");
    				tmpsubmit.push({"code":code,"name":name,"editable":false});
    				tmpsave.push({"code":code,"name":name,"editable":edit});
    			});
    			if(attr.required){
    				if(tmpsubmit.length>0){
    					_dy_this.$el.find("#requiredflag"+attr.code).val("1");//标识是否必填
        			}
    			}
    			_dy_this.tmpsubmitdata[attr.code]=tmpsubmit;
    			_dy_this.tmpsavedata[attr.code]=tmpsave;
    			return;
    		case "fileupload":
    			var tmpsubmit=new Array();
    			var tmpsave=new Array();
    			_dy_this.$el.find("span[data-code="+attr.code+"]").find(".file-show").each(function(index,item){
    				var name=$(item).data("name");
    				var code=$(item).data("code");
    				var isedit=$(item).data("isedit");
    				var fileperm=$(item).data("file-perm");
    				var custom=$(item).data("customstr");
    				if(custom==null||custom==""){
    					custom={};
    				}
    				var operpermstr=$(item).data("operperm");
    				if(operpermstr!=null&&operpermstr!=""){
    					var operperm=operpermstr.split(",");
    					custom.operperm=operperm;
    				}
    				tmpsubmit.push({"code":code,"name":name,"editable":false,"fileperm":fileperm,"operperm":custom.operperm});//提交时数据
    				tmpsave.push({"code":code,"name":name,"editable":isedit,"fileperm":fileperm,"operperm":["v","r","d"]});//保存时数据
    			});
    			if(attr.required){
    				if(tmpsubmit.length>0){
    					_dy_this.$el.find("#requiredflag"+attr.code).val("1");//标识是否必填
        			}
    			}
    			
    			_dy_this.tmpsubmitdata[attr.code]=tmpsubmit;
    			_dy_this.tmpsavedata[attr.code]=tmpsave;
    			return ;
    		case "memo":
    			var tmpsubmit=new Array();
    			var tmpsave=new Array();
    			_dy_this.$el.find("#"+attr.code+"-showmemo li").each(function(index,item){
    				var editable=$(item).data("editable");//是否可编辑
    				var createtime=$(item).data("createtime");//创建时间
    				var avatarcode=$(item).data("avatarcode");//头像code
    				var usercode=$(item).data("usercode");//用户code
    				var username=$(item).data("username");//用户名
    				var content=$(item).find(".meno-value").val();
    				tmpsubmit.push({"editable":false,"content":content,"createtime":createtime,"avatarcode":avatarcode,"usercode":usercode,"username":username});//提交时数据
    				tmpsave.push({"editable":editable,"content":content,"createtime":createtime,"avatarcode":avatarcode,"usercode":usercode,"username":username});//保存时数据
    			});
    			if(attr.required){
    				if(tmpsubmit.length>0){
    					_dy_this.$el.find("#requiredflag"+attr.code).val("1");//标识是否必填
        			}
    			}
    			_dy_this.tmpsubmitdata[attr.code]=tmpsubmit;
    			_dy_this.tmpsavedata[attr.code]=tmpsave;
    			return ;
    		case "serial":
    			var vals=attr.value[0];
    			var serialcode=_dy_this.$el.find("#"+vals.serial.code).val();
    			var year=_dy_this.$el.find("#"+vals.year.code).val();
    			var num=_dy_this.$el.find("#"+vals.num.code).val();
    			if(attr.required){
    				if($.trim(serialcode)!=null&&$.trim(serialcode)!=""){
    					_dy_this.$el.find("#requiredflag"+attr.code).val("1");//标识是否必填
        			}
    			}
    			return _dy_this.formpost[attr.code]={"serial":serialcode,"year":year,"num":num};
    		case "textarea":
    			return _dy_this.formpost[attr.code]=_dy_this.$el.find("#"+attr.code).val();
    		case "tablelist"://tablelist
    			var $tableconfig=commonevents.getlasttableconfig(_dy_this.$el.find("#"+attr.code));//获取最新的table配置数据
    			
    			var required=true;
    			$($tableconfig.checkdata).each(function(i,item){
    				var j=0;
    				for(var key in item){
    					var config=item[key].config;
        				if(config){
        					if(config.required){
        						if(item[key].val==null||item[key].val==""){
        							required=false;
        							var name=$tableconfig.value[0].thead[j].name;
        							_dy_this.$el.find("#requiredflag"+attr.code).attr("data-name",name);
        							return;
        						}
        					}
        					if(item[key].val!=""&&item[key].val!=null){
        						if(config.isnum){
        							if(isNaN($.trim(item[key].val))){
        								var name=$tableconfig.value[0].thead[j].name;
        								_dy_this.$el.find("#checkerror"+attr.code).val(name+"必须是数字");
        								return;
        							}
        						}
        					}
        				}
        				j++;
    				}
    				
    			});
    			
    			if(required){//判断表格中指定单元格是否为必填
    				_dy_this.$el.find("#requiredflag"+attr.code).val("1");//标识是否必填
    			}
    			if(attr.required){//判断表格记录是否为必填
    				if($tableconfig.value[0].tbody&&$tableconfig.value[0].tbody.length>0){
    					if(required){//判断表格中指定单元格是否为必填
    	    				_dy_this.$el.find("#requiredflag"+attr.code).val("1");//标识是否必填
    	    			}
        			}
    			}
    			return _dy_this.formpost[attr.code]=$tableconfig.value[0].tbody;
    		case "picker":
    			return _dy_this.formpost[attr.code]=[];
    		case "btn":
    			return _dy_this.formpost[attr.code]=[];
    		case "multidate":
    			var multidate=_dy_this.$el.find("#"+attr.code).val();
    			var date=[];
    			var startdate;
    			var enddate;
    			if(multidate!=undefined&&multidate!=""){
    				date=multidate.split("至");	
    				startdate=date[0];//开始时间
    				enddate=date[1];//结束时间
    			}
    			var sumday=_dy_this.$el.find("#"+attr.code+"-sumday").val();
    			return _dy_this.formpost[attr.code]={"starttime":startdate,"endtime":enddate,"sumday":sumday};
    		case "ueditor":
    			if(UE.getEditor(attr.code+"_"+_dy_this.uuid)){
    				return _dy_this.formpost[attr.code]= UE.getEditor(attr.code+"_"+_dy_this.uuid).getContent();
    			}else{
    				return _dy_this.formpost[attr.code]=_dy_this.$el.find("#"+attr.code).val();
    			}
    		}
    	},
    	checkfactortable:function(){//特殊表单数据处理
    		var dy_this=this;
    		$(dy_this.specialdataList).each(function(i,attr){
				dy_this.getAttrData(attr);
			});
    		dy_this.specialDataHandle();//特殊数据处理
    	},
    	specialDataHandle:function(){
    		var cur_this=this;
    		switch (cur_this.rdata.special) {
				case "assessmentform":
					cur_this.performance();
					break;
				case "performanceform":
					cur_this.performance();
					break;
				default:
					break;
			}
    	},
    	performance:function(){
    		var _dy_this=this;
//			用户信息
			var usercode =_dy_this.$el.find("#usercode").val();
			var username =_dy_this.$el.find("#username").val();
//			部门信息
			var orgcode = _dy_this.$el.find("#orgcode").val();
			var orgname = _dy_this.$el.find("#orgname").val();
			_dy_this.formpost['checkuser']={"usercode":usercode,"username":username};
			_dy_this.formpost['org']={"orgcode":orgcode,"orgname":orgname};
			//考核要素  
			var factor = new Array();
//			_dy_this.$el.find("#checkfactortable tbody tr").each(function(i, item){
//				var tmpFac = {};
//				$(item).find("td").each(function(j, item2){
//					if(j == 0){
////						console.log($(item2).text());
//						if($(item2).text())
//							tmpFac.factorname = $(item2).text();
//					}else if(j ==1){
//						if($(item2).find("textarea").length>0){
//							tmpFac.explain = $(item2).find("textarea").val();
//						}else{
//							tmpFac.explain = $(item2).find("span").text();
//						}
//					}
//				});
//					//直接评价
//					if( $(item).find("select[name=directleaderopinion]").length>0 ){
////						console.log("sdfsdfdsf");
//						var tpp = new Array();
////						$(item).find("select[name=directleaderopinion] option").each(function(k, item3){
//						$(item).find("select[name=directleaderopinion] option:selected").each(function(k, item3){
////							console.log( $(item3).val() );
//							if( $(item3).val() ){
////								tpp.push({"name":$(item3).val(),"value":$(item3).attr("selected")=="selected"?true:false});
//								tpp.push({"name":$(item3).text(),"value":$(item3).val()});
//							}
//						});
//						tmpFac.directleaderopinion = tpp;
//					}
//					//间接评价
//				   if( $(item).find("select[name=indirectleaderopinion]").length>0 ){
//						var tpp = new Array();
//						$(item).find("select[name=indirectleaderopinion] option:selected").each(function(k, item3){
//							if( $(item3).val() ){
////								tpp.push({"name":$(item3).val(),"value":$(item3).attr("selected")=="selected"?true:false });
//								tpp.push({"name":$(item3).text(),"value":$(item3).val()});
//							}
//						});
//						tmpFac.indirectleaderopinion = tpp;
//					}
//				 //评价结果
//				   if( $(item).find("select[name=opinionresult]").length>0){
//						var tpp = new Array();
//						$(item).find("select[name=opinionresult] option:selected").each(function(k, item3){
//							if($(item3).val() !="" ){
////								tpp.push({"name":$(item3).val(),"value":$(item3).attr("selected") =="selected"?true:false});
//								tpp.push({"name":$(item3).text(),"value":$(item3).val()});
//							}
//						});
//						tmpFac.opinionresult = tpp;
//					}
//				factor.push(tmpFac);
//			});
			//_dy_this.formpost['checkfactortable']=factor;
    	},
    	getformsdata:function(){//获取表单数据
    		var dy_this=this;
    		//attr={"region": "便签", "isshow": true,"itemorder": 17,"name": "公文便签","value": [],"code": "formitem-017","type": "text","required": true,"regionorder": 4,"editable": true,"col":12}
    		if(dy_this.special){//获取静态表单数据
    			dy_this.checkfactortable();    			
    		}else{//动态表单
    			$(dy_this.data).each(function(index,region){
        			if(region!=undefined){
            			$(region.attrs).each(function(i,attr){
            				dy_this.getAttrData(attr);
            			});
        			}
        		});
    		}
    		dy_this.dynamicdata.formpost=dy_this.formpost;//基础表单数据
    		dy_this.dynamicdata.tmpsubmitdata=dy_this.tmpsubmitdata;//提交操作时差异化的数据
    		dy_this.dynamicdata.tmpsavedata=dy_this.tmpsavedata;//保存操作时差异化的数据
    		return dy_this.dynamicdata;
    	}
    });
    var getdynamicView=function(options){
    	var dynamicView=new mdboss.View.dynamicformView(options);
    	return dynamicView;
    };
    module.exports=getdynamicView;
});
