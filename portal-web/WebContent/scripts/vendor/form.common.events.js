define(function(require, exports, module) {
	$ = require("jquery");
	var mdboss = require("mdboss");
	var accounting=require("accounting");
	var util=require("util");
	require("scroll");
	 require("select2");
	 require("pagination");
	var commonevents={
		"selectorgs":function(options){
				if(options.custom && options.custom.showorgext){//主送,抄送, 院外组织
					seajs.use("deptRoleSelect", function () {
						new mdboss.View.deptroleselectView({dept:options.dept,perms:options.perms,"custom":options.custom, "extdepts":options.extdepts, "before":options.before, callbacks:options.callbacks,selectOnly:options.selectOnly});
					});
				}else{
					seajs.use("orgs", function () {
						new mdboss.View.orgsView({dept:options.dept,"custom":options.custom, "extdepts":options.extdepts, "before":options.before, callbacks:options.callbacks,selectOnly:options.selectOnly});
					});
				}
		},
		"fileupload":function(req){//code为当前表单元素id
			var callbacks=req.callbacks;
			  //上传文件
            $.ajaxFileUpload({
                url:mdboss.api.fileupload,//处理图片脚本
                secureuri :false,
                fileElementId :req.code,//file控件id
                dataType : 'multipart/form-data',
                success : function (data, status){
                    if(data != 'undefined'){
                   	var start=data.indexOf(">");
                   	var end=data.lastIndexOf("<");
                   	var json=eval('(' + data.substring(start+1,end)+ ')');
                   	 if(json!=undefined){
                   		 var html;
                   		 var files=new Array();
                   		 var template=Handlebars.compile($("#fileshow-template").html());
                   		 if(json.length!=undefined){
	                   			 //{baseUrl:xx,files:[{'name':'c.txt','id':'22'}]}
                   			 	$(json).each(function(index,item){
                   			 		files.push({"code":item.id,"name":item.name,"editable":true,"fileperm":req.fileperm,"customstr":JSON.stringify(req.custom)});
                   			 	});
	                   			 html=template({"baseUrl":baseConfig.avatar_url,files:files});
	                   			 callbacks(html);
	                         }else{
	                        	 files.push({"code":json.id,"name":json.name,"editable":true,"fileperm":req.fileperm,"customstr":JSON.stringify(req.custom)});
	                   			 html=template({"baseUrl":baseConfig.avatar_url,files:files});
	                   			 callbacks(html);
	                         }
                   		 mdboss.notifyTips("文件上传成功！");
                    }else{
                   	 mdboss.notifyTips("文件上传失败！");
                    }
                }
               },
                error: function(data, status, e){
                    alert(e);
                }
        });
		},
		"select_person":function(req){
    	 mdboss.selectedperson({"callbacks":req.selpersoncallback,"selectedvalues":req.selectedvalues});
     },
     "calculate_hj":function($tbody,$lastTr){
    	  $lastTr.find("td[data-hassum=true]").each(function(i,v){
			  var index=$(v).index()+1;
			  var total=0.0;
			  var $custom=$(v).data("custom");
			  var fm=util.setAccounting(accounting,$custom);//需要合计的列格式化
			  $tbody.find("tr:not(:last) td:nth-child("+index+") input").each(function(j,item){
				  total+=fm.unformat($(item).val());
			  });
			  $zj=$(v).find("input");
			  var oldValue=fm.unformat($zj.val());
			  $(v).find("span").text(fm.formatMoney(total));
			  $zj.attr("data-oldval",oldValue);//原值
			  $zj.val(total);//更新总计
			  var $operator=$zj.data("operators");//是否需要合并总计
			  var $container=$tbody.closest(".forms-content");
			  if($operator){
				  if($operator.context&&$operator.context.names){
					  $.each($operator.context.names,function(i,name){
						  var $tzj=$container.find("#"+name);
						  if($tzj){
							   fm=util.setAccounting(accounting,$tzj.data("custom"));//获取当前行每列自定义格式化
							   
							   var oldzj=fm.unformat($tzj.val())==""?0:fm.unformat($tzj.val());
							  var newzj=oldzj-oldValue+total;
							  $tzj.val(fm.formatMoney(newzj));  
							  if($tzj.attr("type")=="hidden"){
								  $tzj.prev().text(fm.formatMoney(newzj));
							  }
						  }
						  
					  });
				  }
			  }
			  
		  });
     },
     "tablelist":function($refreshTable,$container,reqdata,dialog){//reqdata={"queryCondition":[],"pkobj":{"pkkey":"","pkvals":["1","2"]},"url":url}
		  var $tableconfig=$refreshTable.data("config");//获取需要刷新table的配置
		  var commonModel=new mdboss.Model.commonModel();
		  var pageNo=reqdata.pageNo;
		  var pageSize=reqdata.pageSize;
		  var orderBy=reqdata.orderBy;
		  var keyword=reqdata.keyword;
     	  commonModel.save({"usercode":mdboss.usercode,"queryCondition":reqdata.queryCondition,"orderBy":orderBy,"keyword":keyword,"pageSize":pageSize,"pageNo":pageNo},{url:reqdata.url,success:function(m, res){
     		  if(res.rc==1){
     			  	var rows=res.data.rows;
     			  	var total=res.data.total;//table填充总记录数
     			  	var pagesize=pageSize;//第页显示
     			  	var pageno=pageNo;//当前第几页
     			  	var totalpage=0;//总页数默认0
     			  	if(total%pagesize==0){
     			  		totalpage=total/pagesize;
     			  	}else{
     			  		totalpage=parseInt(total/pagesize)+1;
     			  	}
     				$tableconfig.value[0].tbody=rows;
     				seajs.use("dynamictable", function (dynamictable) {
     					$tableconfig.customstr=JSON.stringify($tableconfig.custom);
     					$tableconfig.dataconfig=JSON.stringify($tableconfig);
     					var thead=$tableconfig.value[0].thead;
     					var index=0;
     					$(thead).each(function(i,item){
     						var config=item.contentconfig;
     						if(config&&config.ispk){
     							index=i;
     							return;
     						}
     					});
     					
     					var data=dynamictable.getdata($tableconfig);
     					data.ispicker=reqdata.ispicker;
     					var template = Handlebars.compile($("#tablelist-template").html());
        				$container.find("#pickertable").html(template(data));
        				$container.validVal();
        				if(dialog){
        					$(dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
        				}
        				if(reqdata.pkobj&&reqdata.pkobj.pkvals){
        					$(reqdata.pkobj.pkvals).each(function(tr,v){
         						////回显选中checkbox
         						$container.find('#pickertable input[type=checkbox][value='+v+']').click();
         					});
        				}
     					
        				var ispagination=data.value[0].ispagination;//是否分页
        				if(ispagination)
        					$container.find("#table_query_pagination").bs_pagination({ 
        						totalPages:totalpage,
        						currentPage:pageno,
        						totalRows:total,
        						showGoToPage: true,
           	       				showRowsPerPage : true,
           	       				showRowsInfo : true,
           	       				showRowsDefaultInfo : true,
        	            		 onChangePage: function(event, cdata) {
        	            			 reqdata.pageNo=cdata.currentPage;
        	            			 reqdata.pageSize=cdata.rowsPerPage;
        			         		commonevents.tablelist($refreshTable,$container,reqdata);
        	          			}
        	            	 });
                   });
     				
     		  }
     	 }});
     },
     "showrefreshtable":function(obj){
    	 //选择后刷新table
    	 seajs.use("dynamictable",function(dynamictable){
    		var attr=obj.data.tableconfig;
    		var template = Handlebars.compile($("#tablelist-template").html());
 			attr.customstr=JSON.stringify(attr.custom);
 			attr.dataconfig=JSON.stringify(attr);
			var data=dynamictable.getdata(attr);
			var container=obj.data.curcontainer;
			var refreshtable=container.find("#"+obj.data.pickerform.tableid);
			var oldtable=refreshtable.closest("div.control-group");
			if(!obj.isclear){
				oldtable.before(template(data));
				oldtable.remove();
			}else{
				console.log(oldtable.find("tbody"));
				oldtable.find("tbody").html("");
			}
			//刷新表单
			if(obj.data.formrecord){
				commonevents.updateform(obj.data.formrecord,container);//刷新表单
			}
			container.find("#"+obj.data.pickerform.tableid).find("select").select2();
			obj.dialog.close();
    	 });
	},
	"updateform":function(formdata,$container){
		for(var key in formdata){
			var val=formdata[key];
			if(typeof val!="function"){
     			if($container.find("[data-mixtype=multidate-"+key+"]").length>0){
     				$container.find("#"+key).val(val.starttime+"至"+val.endtime);
     				$container.find("#"+key+"-sumday").val(val.sumday);
     			}else{
     				var ele=$container.find("#"+key);
         			if(ele.length>0){
         			var type=ele.attr("type");
         			if(type=="text"){
         				ele.val(val);
         			}else if(type=="hidden"){
         				ele.val(val);
         				ele.prev("[data-type=label]").text(val);
         			}else{
         				//tagName返回为大写
         				if(ele.get(0).tagName=="SELECT"){
             				ele.val(val);
             				ele.change();
             				ele.select2();
         				}else if(ele.get(0).tagName=="SPAN"){
         					if(ele.data("type")=="fileupload"){
         						var template = Handlebars.compile($("#fileshow-template").html());
         						ele.html(template({"files":val,"baseUrl":baseConfig.avatar_url}));
         					}else if(ele.data("type")=="next_handler"){
         						if(val!=""){
         							var template = Handlebars.compile($("#nextperson-show-template").html());
         							console.log({"persons":[val]});
         							ele.html(template({"persons":[val]}));
         							$container.find("input[type=radio][data-name=代理人审批]").click();
         							$container.find("input[type=radio][data-name=代理人审批]").each(function(j,proxyradio){
         								$(proxyradio).next().find("span").removeClass("next-step-unchecked").addClass("next-step-checked");
         							});
         						}
         					}
         				}else if(ele.get(0).tagName=="TABLE"){
         					var lasttable=commonevents.getlasttableconfig(ele);
         					seajs.use("dynamictable",function(dynamictable){
         						var body=lasttable.value[0].tbody;//原数据
         						var head=lasttable.value[0].thead;//表头
         						var pkkey="";
         						var newvalues=[];
         						var attr={};
         						$.each(head,function(i,item){
         							if(item.contentconfig&&item.contentconfig.ispk){
         								pkkey=item.key;
         							}
         						});
         						$(val).each(function(i,newrecord){
         							var isnew=true;
         							$.each(body,function(j,record){
         								if(newrecord[pkkey]==record[pkkey]){
         									newvalues.push(record);
         									isnew=false;
         								}
         							});
         							if(isnew){
         								newvalues.push(newrecord);
         							}
         						});
         						lasttable.value[0].tbody=newvalues;
         						var template = Handlebars.compile($("#tablelist-template").html());
         						lasttable.dataconfig=JSON.stringify(ele.data("config"));
         						var data=dynamictable.getdata(lasttable);
         						console.log(data);
         						ele=ele.closest("div.control-group");
         						ele.before(template(data));
         						ele.remove();
         						//刷新表单时刷新总计
         						if(data&&data.value.length>0&&data.value[0].sumobj){
         							var sum=data.value[0].sumobj.sum;
         							if(sum){
         								for(var key in sum){
         									if(sum[key].operators){
         										$(sum[key].operators).each(function(o,operator){
         												console.log($container.find("."+operator.event));
         												$container.find("."+operator.event).change();
         										});
         									}
         								}
         							}
         						}
         					});
         				}
         				
         			}
     			}
     			
     		}
     		}
		}
		$container.find("table select").select2();
	},
	"showrefreshform":function(obj){
		var common_this=this;
		//需要刷新表单的范围,暂支持刷新text,label,select
		var $container=obj.data.curcontainer;
		if(obj.data.pickerform.troption){
			$container=obj.data.troptionobj;
		}
		var formdata=obj.newrecord;
		commonevents.updateform(formdata,$container);
		obj.dialog.close();
	},
	"getlasttableconfig":function($formtable){//获取最后更新的表格数据及配置
		common_this=this;
		 var $tableconfig=$formtable.data("config");
		 var newrecords=[];
		 var checkdata=[];
		 $formtable.find("tbody tr").each(function(i,v){
			 if($(v).data("type")!="sumcol"){
				 var record=common_this.gettablerecord($formtable,$(v));
				 var recordval={};
				 for(var key in record){
					 recordval[key]=record[key].val;
				 }
				 newrecords.push(recordval);
				 checkdata.push(record);//返回每列配置信息
			 }  
		  });
		  $tableconfig.value[0].tbody=newrecords;
		  $tableconfig.checkdata=checkdata;
		  return $tableconfig;
	},
	"gettablerecord":function($formtable,$tr,simple){//获取指定行的数据
		_this=this;
		 var trindex=$tr.index();
		 var record={};
		 var $tableconfig=$formtable.data("config");
		  $($tableconfig.value).each(function(i,v){
			   $.each(v.thead,function(t,th){
				   if(th.contentconfig){
					   var val=_this.getTableColumnVal(trindex,t,th.contentconfig.type,$formtable);
					   val=$.trim(val);
					   if(th.custom&&th.custom.symbol){
						   var fm=util.setAccounting(accounting,th.custom);
						   val=fm.unformat(val);
					   }
					   if(simple){//返回简单模式
						   record[th.key]=val;
					   }else{
						   record[th.key]={"val":val,"config":th.contentconfig};
					   }
				   }
			  	});
		  });
		  return record;
	},
	"getTableColumnVal":function(tr,td,type,$formtable){//行索引，列索引，元素类型,表格对象
		switch(type){
			case "label":
				return $formtable.find("tbody tr:eq("+tr+") td:eq("+td+")").text();
			case "text":
				return $formtable.find("tbody tr:eq("+tr+") td:eq("+td+") input").val();
			case "select":
				return $formtable.find("tbody tr:eq("+tr+") td:eq("+td+") select").val();
			case "checkbox":
				return $formtable.find("tbody tr:eq("+tr+") td:eq("+td+") input[type=checkbox]").val();
			case "fileupload":
				var tmpsubmit=new Array();
				_dy_this.$el.find("tbody tr:eq("+tr+") td:eq("+td+")").find(".file-show").each(function(index,item){
    				var name=$(item).data("name");
    				var code=$(item).data("code");
    				tmpsubmit.push({"code":code,"name":name});//提交时数据
    			});
				return tmpsubmit;
		}
	}
	};
	module.exports = commonevents;

});