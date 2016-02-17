
define(function(require, exports, module) {
	var mdboss = require("mdboss"), 
	$ = require("jquery");
	var util = require("util");
	var dynamictable=require("dynamictable");
	var $page = mdboss.$pageWrap;
	var accounting=require("accounting");
	 require("select2");
	//调用参数
	//{
	//	titlename:"ddd",
	//  updateform:true,
	//  tableconfig:{},//表单中table的数据
	//	pickerform:{
	//	"formcode":"formcode",//根据formcode加载formdata数据
	//	"template":"picker-search-template",//渲染模板ID
	//	"selecttype":"radio",//picker支持单选还是多选
	 //	"querycondition":"",
	//	"tableid":"tablex",//刷新tableid（刷新表单时，此参数不需要配置）
	//	"refreshfun":"showrefreshtable刷新表格/showrefreshform刷新表单元素",//刷新数据(不同刷新配置不一样)
	//  "datamapping":[{"src":"","dest":""}],
	 // "troption":true
	//}}
	mdboss.View.dynamicPicker = Backbone.View.extend({
		initialize : function(data) {
			_this=this;
			_this.data=data;
			_this.uuid=mdboss.getuuid();
			_this.formpost=[];
            var dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                    $(this).find(".jscroll").jScrollPane({"autoReinitialise": true});
                }
            }, {"title":_this.data.titlename,"width":"960px","height":"500px","icon":"iconfont icon-mdliucheng","layer":false,"resize":function(){
                $(this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
             }}).show(function(){
                   var self=this;
                   _this.getformdata(_this.data.pickerform.formcode);
                   $(this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
             });
            _this.dialog=dialog;
            _this.$el=dialog.$html;
		},
		events:{
			"click .js-table-tr-radio-click":"tr_radioclick",//单选行点击事件
			"click .js-table-tr-checkbox-click":"tr_checkboxclick",//多选行点击事件
			"click .js-table-tr-selectapply":"selectapply",//点击选中申请
			"click .js-table-checkbox":"checkboxclick",//点击多选事件
			"change #table-selectedValue":"tableSelectedValue",//多选时选中的数据改变触发
			"click .js-picker-freshtable":"tablerefresh",//点击查询刷新表格数据
			"click .js-table-checkbox-submit":"checkboxsubmit",//点击确定时
			"click .js-cancel":"cancel",//取消
			"click .js-table-checkbox-cancel":"cancel",//取消
			"click .js-table-simpleform-submit":"simpleformsubmit",//简单form提交
			"click a[name=clearbtn]":"searchclear"//搜索条件清楚
		},
		getAttrData:function(attr){
    		_dy_this=this;
    		switch(attr.type){
    		case "text":
    			return _dy_this.formpost[attr.code]=_dy_this.$el.find("#"+attr.code).val();
    		case "ueditor":
    			return _dy_this.formpost[attr.code]= UE.getEditor(attr.code+"_"+_dy_this.uuid).getContent();
    		case "fileupload":
    			var tmpsubmit=new Array();
    			_dy_this.$el.find("span[data-code="+attr.code+"]").find(".file-show").each(function(index,item){
    				var name=$(item).data("name");
    				var code=$(item).data("code");
    				tmpsubmit.push({"code":code,"name":name,"editable":true});//提交时数据
    			});
    			if(attr.required){
    				if(tmpsubmit.length>0){
    					_dy_this.$el.find("#requiredflag"+attr.code).val("1");//标识是否必填
        			}
    			}
    			console.log(tmpsubmit);
    			_dy_this.formpost[attr.code]=tmpsubmit;
    			return ;
    		}
    	
    	},
		simpleformsubmit:function(e){
			s_this=this;
			var newrecord=[];
			for(var key in s_this.formdata){
				s_this.getAttrData(s_this.formdata[key]);
			}
			var datamapping=s_this.data.pickerform.datamapping;
			$(datamapping).each(function(j,item){
				newrecord[item.dest]=s_this.formpost[item.src];
			});
			s_this.newrecord=newrecord;
			//转换数据
			seajs.use("commonevents",function(commonevents){
				//刷新table
				commonevents[s_this.data.pickerform.refreshfun].call(this,s_this);
			});
		},
		selectapply:function(e){
			var v_this=this;
				//获取当前选中的值对象
				var record={};
				var current=$(e.currentTarget);
				var newtbody=new Array();
				var tableconfig=$(current).closest("table").data("config");//获取当前tableconfig
				var head=tableconfig.value[0].thead;
				//获取pk列的主键
				var pkkey="";
				$.each(head,function(index,item){
					if(item.contentconfig&&item.contentconfig.ispk){
						pkkey=item.key;
					}
				});
				//调用接口获取data
				var commonModel = Backbone.Model.extend({});
				var newrecord={};
				record=v_this.getTrColumns(current,head);
				var commonModel=new mdboss.Model.commonModel();
				var url=v_this.data.pickerform.dataurl;
				var datamodel=v_this.data.pickerform.datamodel;
				var pkId=record[datamodel.tid];
				var name=record[datamodel.name];
				var queryCondition=datamodel.queryCondition;
				console.log(pkId);
				var datamapping=v_this.data.pickerform.datamapping;
				if(pkId!=undefined&&pkId!=""){
					var req={"usercode":mdboss.usercode,"tid":pkId,"name":name,"queryCondition":queryCondition};
					commonModel.save(req,{url:baseConfig.base+url,success:function(m,res){
						if(res.rc==1){
							//转换数据
							var recordpkkey="";
							if(datamapping){
								$(datamapping).each(function(j,item){
									newrecord[item.dest]=res.data[item.src];
								});
							}else{
								newrecord=res.data;
							}
							v_this.newrecord=newrecord;
							seajs.use("commonevents",function(commonevents){
								//刷新table
								commonevents[v_this.data.pickerform.refreshfun].call(this,v_this);
							});
						}
					}});
				}else{
					$(datamapping).each(function(j,item){
						newrecord[item.dest]="";
					});
					v_this.newrecord=newrecord;
					seajs.use("commonevents",function(commonevents){
						//刷新table
						commonevents[v_this.data.pickerform.refreshfun].call(this,v_this);
					});
				}
				
				
		},
		searchclear:function(e){
			var $pickersearch=$(e.currentTarget).closest("#pickersearch");
			$pickersearch.find("input[type=text]").val("");
		},
		cancel:function(e){
			v_this=this;
			v_this.dialog.close();
		},
		tableSelectedValue:function(e){
			var $current=$(e.currentTarget);
			var container=$current.closest(".forms-content");
			container.find("td input[type=checkbox]").each(function(i,cb){
				var val=$(cb).attr("value");
				var ischeck=false;
				$current.find("option:selected").each(function(i,option){
					var selectval=$(option).attr("value");
					if(val==selectval){
						ischeck=true;
					}
				});
				if(ischeck){
					$(cb).prop("checked",true);
				}else{
					$(cb).prop("checked",false);
					container.find('#table-selectedValue option[value="'+val+'"]').remove();
					container.find("#table-selectedValue").select2({"width":'100%'});
				}
			});
		},
		checkboxsubmit:function(e){//多选确定提交按钮
			var v_this=this;
			var formtableconfig=v_this.data.tableconfig;//formtable原数据
			var $current=$(e.currentTarget);
			var $container=$current.closest(".forms-content");
			
			seajs.use("commonevents",function(commonevents){
				var newtbody=new Array();
				var tablelist=v_this.data.tableconfig;
				var vals=tablelist.value[0];//原formtable数据
				var thead=vals.thead;
				var tablepkkey="";
				$(thead).each(function(h,col){
					if(col.contentconfig&&col.contentconfig.ispk){
						tablepkkey=col.key;
					}
				});
				var pickername=v_this.data.pickername;//pickercode
				var lastrecord={};
				if(v_this.data.pickerform.template=="picker-list-template"){
					var $checkedobj=$container.find("#table-selectedValue option:selected");//选择对象
					var rowcount=0;
					if($checkedobj){
						rowcount=$checkedobj.length;
					}
					$checkedobj.each(function(i,item){
						//var record=commonevents.gettablerecord($container.find("#pickertable table"),$(item).closest("tr"));//获取最新的当前行的数据
						var record=$(item).data("record");
						var recordpkkey="";
						record[pickername+"_rowcount"]=rowcount;//选择总记录数
						record[pickername+"_index"]=(i+1);//记录索引
						for(key in record){
							if(record[key].config&&record[key].config.ispk){
								recordpkkey=key;
							}
						}
						var isnew=true;
						$(vals.tbody).each(function(trindex,tr){
							if($.trim(tr[tablepkkey])==$.trim(record[recordpkkey].val)){
								var newrecord=v_this.reschange(record,tr);//响应数据转换
								newtbody.push(newrecord);
								isnew=false;
							}
						});
						if(isnew){
							var newrecord=v_this.reschange(record);//响应数据转换
							newtbody.push(newrecord);
						}
						lastrecord=record;//记录最后一条record
						
					});
				}else if(v_this.data.pickerform.template=="picker-xtype-template"){//费用类型处理
					var $checkedobj=$container.find("input[type=checkbox]:checked");//选择对象
					var rowcount=0;
					if($checkedobj){
						rowcount=$checkedobj.length;
					}
					$checkedobj.each(function(i,item){
						var record={"feeitem":{"val":$(item).attr("value")},"feeitemname":{"val":$(item).data("name")}};
						record[pickername+"_rowcount"]=rowcount;//选择总记录数
						record[pickername+"_index"]=(i+1);//记录索引
						var isnew=true;
						$(vals.tbody).each(function(trindex,tr){
							if($.trim(tr[tablepkkey])==$.trim(record.feeitem.val)){
								var newrecord=v_this.reschange(record,tr);//响应数据转换
								newtbody.push(newrecord);
								isnew=false;
							}
						});
						if(isnew){
							var newrecord=v_this.reschange(record);//响应数据转换
							newtbody.push(newrecord);
						}
						
						lastrecord=record;//记录最后一条record
						
					});
				}
				formtableconfig.value[0].tbody=newtbody;//替换原数据
				var datamappingform=v_this.data.pickerform.datamappingform;
				var formrecord={};
				$(datamappingform).each(function(f,dataform){
					formrecord[dataform.dest]=lastrecord[dataform.src];
				});
				v_this.data.formrecord=formrecord;
				//刷新table
				commonevents[v_this.data.pickerform.refreshfun].call(this,v_this);
			});
		},
		reqchange:function(){
			//转换选中{pkkey:"pk",pkvals:["1","2"]}
			var _dyform=this;
			var formtable=_dyform.data.tableconfig;
			var data={};
			if(formtable){//判断回显刷新的table是否存在
				var tablevalue=formtable.value[0];
				var tablehead=tablevalue.thead;
				var pkkey;
				var pkvals=new Array();
				$(tablehead).each(function(h,col){
					if(col.contentconfig&&col.contentconfig.ispk){
						pkkey=col.key;
						$(tablevalue.tbody).each(function(i,record){
							pkvals.push($.trim(record[pkkey]));
						});
						return;
					}
				});
				data.pkkey=pkkey;
				data.pkvals=pkvals;
			}
			return data;
		},
		reschange:function(record,oldrecord){//响应数据转换record[{val:"","config":{}}] config为列配置
			var v_this=this;
			var mapping=v_this.data.pickerform.datamapping;
			if(oldrecord==undefined){
				oldrecord={};
			}
			if(mapping){
				$(mapping).each(function(i,item){
					if(record[item.src]){
						oldrecord[item.dest]=record[item.src].val;
					}
				});
			}
			return oldrecord;
		},
		checkboxclick:function(e){
			e.stopPropagation();//阻止事件冒泡
			var state=$(e.currentTarget).prop("checked");
			var $current=$(e.currentTarget);
			var $container=$current.closest("div.forms-content");
			var pk="";
			var pkname="";
			seajs.use("commonevents",function(commonevents){
			  	var record=commonevents.gettablerecord($current.closest("table"),$current.closest("tr"));//获取最新的当前行的数据
			  	for ( var key in record) {
			  		var item=record[key];//获取主键的id,value
					if(item.config&&item.config.ispk){
						pk=item.val;
					}
					if(item.config&&item.config.ispkname){
			  			pkname=item.val;
			  		}
				}
			  	if(state){
					//添加到多选框
			  		if(!$container.find("#table-selectedValue option[value="+pk+"]").is(":selected")){
			  			var recordJson=JSON.stringify(record);
			  			var html=new Array();
			  			html.push('<option selected="selected" data-record=');
			  			html.push('\''+recordJson+'\'');
			  			html.push('value="');
			  			html.push(pk);
			  			html.push('">');
			  			html.push(pkname);
			  			html.push('</option>');
			  			var option=html.join('');
			  			$(option).appendTo($container.find("#table-selectedValue"));
			  		}
			  		$container.find("#table-selectedValue").select2({"width":'100%'});
			  	}else{
					//清除多选框中对应的值
					$container.find('#table-selectedValue option[value="'+pk+'"]').remove();
					$container.find("#table-selectedValue").select2({"width":'100%'});
				}
			});
			
			
			
		},
		tr_checkboxclick:function(e){//多选事件
			var $current=$(e.currentTarget);
			var $checkbox=$current.find("td input[type=checkbox]");
			$checkbox.click();
		},
		getTrColumns:function(tr,head){//获取当前行的数据
			var record={};
			tr.find("td").each(function(i,item){
				var val="";
				var custom=head[i].custom;
				var symbol=false;
				if(custom&&custom.symbol){
					symbol=true;
				}
				var fm=util.setAccounting(accounting,custom);
				if(head[i].contentconfig){
					var type=head[i].contentconfig.type;
					if(type=="label"){
						if(symbol){
							val=fm.unformat($(item).data("val"));
						}else{
							val=$(item).data("val");
						}
					}else if(type=="text"){
						if(symbol){
							val=fm.unformat($(item).find("input").val());
						}else{
							val=$(item).find("input").val();
						}
					}else if(type=="select"){
						if(symbol){
							val=fm.unformat($(item).find("select").val());
						}else{
							val=$(item).find("select").val();
						}
					}else if(type=="fileupload"){
						var tmpsubmit=new Array();
						$(item).find("[data-type=fileupload]").find(".file-show").each(function(index,item){
		    				var name=$(item).data("name");
		    				var code=$(item).data("code");
		    				var isedit=$(item).data("isedit");
		    				tmpsubmit.push({"code":code,"name":name,"editable":isedit});//提交时数据
		    			});
						console.log(tmpsubmit);
						val=tmpsubmit;
					}
					record[head[i].key]=val;
				}
				
			});
			return record;
		},
		tr_radioclick:function(e){//单选事件
			
			var v_this=this;
				//获取当前选中的值对象
				var record={};
				var current=$(e.currentTarget);
				var newtbody=new Array();
				var tableconfig=$(current).closest("table").data("config");//获取当前tableconfig
				var head=tableconfig.value[0].thead;
				var rerecord=current.data("record");
				v_this.isclear=false;
				if(rerecord){
					$(rerecord).each(function(index,col){
						if(index==0&&col.val=="清空"){
							v_this.isclear=true;
							record[col.code]="";
						}else{
							record[col.code]=col.val;//v_this.getTrColumns(current,head);
						}
					});
				}else{
					v_this.isclear=true;
				}
				
				
				//转换数据
				var datamapping=v_this.data.pickerform.datamapping;
				var datamappingform=v_this.data.pickerform.datamappingform;
				var newrecord={};
				var recordpkkey="";
				var pickername=v_this.data.pickername;
				record[pickername+"_rowcount"]=1;//记录条数
				record[pickername+"_index"]=1;//索引
				var formrecord={};
				if(datamappingform){//判断是否有form映射，如果有就同时刷新表单
					$(datamappingform).each(function(k,fp){
						if(v_this.isclear){
							formrecord[fp.dest]="";
						}else{
							formrecord[fp.dest]=record[fp.src];
						}
					});
				}
				
				$(datamapping).each(function(j,item){
					if(v_this.isclear){
						newrecord[item.dest]="";
					}else{
						newrecord[item.dest]=record[item.src];
					}
				});
				if(v_this.data.updateform){
					//更新表单数据
					v_this.newrecord=newrecord;
				}else{
					//获取需要刷新的表单tableconfig
					var newtableconfig=v_this.data.tableconfig;
					$(newtableconfig.value[0].thead).each(function(i,th){
						if(newrecord[th.key]==undefined){
							newrecord[th.key]="";
						}
					});
					v_this.data.formrecord=formrecord;//刷新table时同刷新表单
					newtableconfig.value[0].tbody.push(newrecord);
				}
			seajs.use("commonevents",function(commonevents){
				//刷新table
				commonevents[_this.data.pickerform.refreshfun].call(this,v_this);
			});
			
			
		},
		tablerefresh:function(e){
			var _dypicker=this;
			var keyword="";
			var $current=$(e.currentTarget);
			  var $container=$current.closest(".forms-content");
			  $cur_custom=$current.data("custom");
			  var queryCondition=new Array();
			  var refreshTableid=$cur_custom.tableid;
			  var pickerQueryCondition=_dypicker.data.pickerform.querycondition;//picker查询条件
			  //console.log(pickerQueryCondition);
			  var $refreshTable=$container.find("#"+refreshTableid);
			  var $tableconfig=$refreshTable.data("config");//获取需要刷新table的配置
			  var $tablequerycondition=$tableconfig.custom.querycondition;
			  var pageSize=$tableconfig.custom.pageSize;
			  if(pageSize==undefined||pageSize==""){
				  pageSize=10;
			  }
			  var pageNo=$tableconfig.custom.pageNo;
			  if(pageNo==undefined||pageNo==""){
				  pageNo=1;
			  }
			  var orderBy=$tableconfig.custom.orderBy;
			   keyword=$tableconfig.custom.keyword;
			   //获取查询条件
				  $container.find("[data-search=true]").each(function(i,item){
					  	var key=$(item).data("code");
					  	var $custom=$(item).data("custom");
					  	var operate=$custom.searchtype;
					  	var val=$(item).val();
					  	if(key=="keyword"){//搜索关键字进行特殊处理
					  		keyword=val;
					  	}else{
					  		queryCondition.push({"key":key,"operate":operate,"v1":val});
					  	}
				  });
			  $($tablequerycondition).each(function(i,item){
				  queryCondition.push(item);
			  });
			  $(pickerQueryCondition).each(function(index,condition){
				  queryCondition.push(condition);
			  });
			  var pkobj={};
			  if(!_dypicker.data.pickerform.troption){
				  //不是行操作时需要用到pk
				  pkobj=_dypicker.reqchange();//formtable主键value  
			  }
			  var ispicker=true;
			  if(_dypicker.ischeckbox){
				  ispicker=false;
			  }
			  seajs.use("commonevents",function(commonevents){
					commonevents.tablelist($refreshTable,$container,{"ispicker":ispicker,"queryCondition":queryCondition,"pageNo":pageNo,"pageSize":pageSize,"orderBy":orderBy,"keyword":keyword,"pkobj":pkobj,"url":baseConfig.base+$cur_custom.queryurl},_dypicker.$el.html);
			  });
		},
		render:function(data){
			_this=this;
			var selecttype=_this.data.pickerform.selecttype;
			var ischeckbox=false;//判断是否为多选
			var issimpleform=false;
			if(selecttype=="checkbox"){
				ischeckbox=true;
			}else if(selecttype=="simpleform"){
				issimpleform=true;
			}
			_this.ischeckbox=ischeckbox;
			var template=Handlebars.compile($("#"+_this.data.pickerform.template).html());
			//table类型的picker
			if(_this.data.pickerform.template=="picker-list-template"){
				_this.$el.find(".dialog-content").html(template({"ischeckbox":ischeckbox,"issimpleform":issimpleform}));
				var searchhtml=new Array();
				var tablehtml=new Array();
				var searchbtncode;
				$(data.search).each(function(i,item){
					if(item.custom.issearchsubmit){//判断元素为查询按钮
						searchbtncode=item.code;
					}
					item.issearch=true;//标识元素为查询元素
					searchhtml.push(_this.getAttributeHtml(item));
				});
				$(data.tables).each(function(i,item){
					item.ischeckbox=ischeckbox;//设置表格为多选
					tablehtml.push(_this.getAttributeHtml(item));
				});
				if(_this.data.troptionobj){
					var $formtable=_this.data.troptionobj.closest("table");
					var head=$formtable.data("config").value[0].thead;
					var currentTrRecord=_this.getTrColumns(_this.data.troptionobj, head);
					//转换数据
					var mapping=_this.data.pickerform.datamapping;
					$(mapping).each(function(i,column){
						for(key in data.simpleformdata){
							var columnobj=data.simpleformdata[key];
							if(columnobj.type=="fileupload"){//对附件类型特殊处理
								columnobj.baseUrl=baseConfig.avatar_url;
							}
							if(columnobj.code==column.src){
								columnobj.value=currentTrRecord[column.dest];
							}
						}
					});
				}
				$(data.simpleformdata).each(function(i,item){
					tablehtml.push(_this.getAttributeHtml(item));
				});
				_this.$el.find("#pickersearch").html(searchhtml.join(''));
				_this.$el.find("#pickertable").html(tablehtml.join(''));
				if(issimpleform){
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
					
				}else{
					$("#"+searchbtncode).click();//首次渲染table时，通过自动点击查询事件
				}
				_this.$el.find(".dialog-content").find("select").select2();
				_this.$el.find(".dialog-content").find("select[multiple]").select2({"width":'100%'});
				
				
				
			}else if(_this.data.pickerform.template=="picker-xtype-template"){//费用类型picker
				
				var custom=data.tables[0].custom;
				_this.$el.find(".dialog-content").html(template({"title":custom.title,"iconclzz":custom.iconclzz}));
				var queryurl="";
				$(data.search).each(function(i,item){
					if(item.custom.issearchsubmit){//判断元素为查询按钮
						queryurl=item.custom.queryurl;
					}
				});
				var queryCondition=custom.querycondition;
				var pickerQueryCondition=_this.data.pickerform.querycondition;//picker查询条件
				$(pickerQueryCondition).each(function(index,condition){
					  queryCondition.push(condition);
				  });
				var commonModel=new mdboss.Model.commonModel();
				commonModel.save({"queryCondition":queryCondition,"usercode":mdboss.usercode},{url:baseConfig.base+queryurl,success:function(m,res){
					if(res.rc==1){
						console.log(res.data);
						var trtemplate=Handlebars.compile($("#picker-xtype-tr-template").html());
						var pkobj=_this.reqchange();//formtable主键value  
						var newdata=[];
						var rowsdata=_this.getxtypeata(res.data.rows);
						for(var key in rowsdata){
							if(rowsdata[key]){
								newdata.push(rowsdata[key]);
							}
						}
						_this.$el.find(".dialog-content #pickertable").html(trtemplate({"xtypes":newdata}));
						//获取数据
						$(pkobj.pkvals).each(function(i,item){
							_this.$el.find("input[type=checkbox][value="+item+"]").prop("checked",true);
						});
						_this.$el.find(".jscroll").jScrollPane({"autoReinitialise": true});
					}
				},error:function(e){
					console.log(e);
				}});
			}
		},
		getxtypeata:function(data){//费用类型数据封装、排序
			c_this=this;
			var xtypelist=[];
			console.log(data);
			$(data).each(function(index,item){
				var feeitem={"feeitem":item.feeitem,"feeitemname":item.feeitemname,"itemorder":item.itemorder};
				var xtypes=xtypelist[item.feetype];
				if(xtypes){
					xtypes.childs.push(feeitem);
				}else{
					xtypelist[item.feetype]={"feetype":item.feetype,"typeorder":item.typeorder,"feetypename":item.feetypename,"childs":[feeitem]};
				}
			});
			xtypelist.sort(c_this.getSortFun("asc","typeorder"));
			$(xtypelist).each(function(i,item){
				if(item){
					item.childs.sort(c_this.getSortFun("asc","itemorder"));
				}
			});
			console.log(xtypelist);
			return xtypelist;
		},
		getAttributeHtml:function(attr){
    		_this=this;
    		switch(attr.type){
    		case "text"://文本
    			var template = Handlebars.compile($("#input-template").html());
    			attr.customstr=JSON.stringify(attr.custom);
    			return template(attr);
    		case "fileupload"://上传
    			var template = Handlebars.compile($("#fileupload-template").html());
    			attr.random=mdboss.getuuid();//防止多窗口时ID冲突，添加随机数
    			return template(attr);
    		case "select"://下拉
    			var template = Handlebars.compile($("#select-template").html());
    			attr.customstr=JSON.stringify(attr.custom);
    			return template(attr);
    		case "orgpicker"://组织结构
    			var template = Handlebars.compile($("#selectorgs-template").html());
    			attr.customstr=JSON.stringify(attr.custom);
    			return template(attr);
    		case "searchbtn"://搜索按钮
    			var template = Handlebars.compile($("#searchbtn-template").html());
    			attr.value=[{"name":attr.name,"code":attr.code}];
    			//attr.value.push({"name":"清除选择","code":"clearbtn"});//额外添加清除选择按钮
    			attr.customstr=JSON.stringify(attr.custom);
    			return template(attr);
    		case "tablelist"://tablelist
    			var template = Handlebars.compile($("#tablelist-template").html());
    			attr.customstr=JSON.stringify(attr.custom);
    			attr.dataconfig=JSON.stringify(attr);
				var data=dynamictable.getdata(attr);
    			data.ispicker=true;
				return template(data);
    		case "ueditor":
    			var script='<script id="{{code}}_{{uuid}}" type="text/plain"></script>';
    			var html=$("#ueditor-template").html();
    			html=html.replace(/@editor@/g,script);
    			var template = Handlebars.compile(html);
    			attr.uuid=_this.uuid;
    			return template(attr);
    		}
    	},
		getformdata:function(formcode){
			_this=this;
			 var commonModel=new mdboss.Model.commonModel();
        	 commonModel.save({"usercode":mdboss.usercode,"formcode":formcode},{
        		 url:mdboss.api["pickerformdata"],success:function(m, res){
	        		 if(res.rc==1){
	        			 _this.formdata=res.data.formdata;
	        			 _this.dataparse(_this.formdata);
	        		 }
        	 }});
		},
		dataparse:function(formdata){
    		_this=this;
    		var data={};
    		for(var key in formdata){
    			var attr=formdata[key];
    				if(attr.custom&&attr.custom.issearchfield){
        				if(data.search!=undefined){
        					data.search.push(attr);
        				}else{
        					data.search=[attr];
        				}
        			}else{
        				if(attr.type=="tablelist"){
        					if(data.tables!=undefined){
            					data.tables.push(attr);
            				}else{
            					data.tables=[attr];
            				}
        				}else{
        					//对于简单表单进行处理
        					if(data.simpleformdata==undefined){
        						data.simpleformdata=[attr];
        					}else{
        						data.simpleformdata.push(attr);
        					}
        				}
        				
        			}
    		}
    		
			if(data.search!=undefined){
				data.search.sort(_this.getSortFun("asc","itemorder"));
			}
			if(data.tables!=undefined){
				data.tables.sort(_this.getSortFun("asc","itemorder"));
			}
    		_this.render(data);
    	},
    	getSortFun:function(order, sortBy) {
    	    var ordAlpah = (order == 'asc') ? '>' : '<';
    	    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
    	    return sortFun;
    	}
	});
});