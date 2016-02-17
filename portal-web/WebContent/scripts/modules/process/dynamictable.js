/**
 * 动态表格
 */
define(function(require, exports, module) {
	var mdboss = require("mdboss"), 
	$ = require("jquery");
	var util=require("util");
	var accounting=require("accounting");
	var dynamictable={
			"getdata":function(attr){
				var val=attr.value;
				var tablenotedit=false;
				if(!attr.editable){
					tablenotedit=true;
				}
    			var tbodyarr=new Array();
    			var thead={};
    			var sum={};
    			var sumobj={};
    			var hassum;
    			if(attr.custom!=undefined){
    				hassum=attr.custom.hassum;
    			}else{
    				attr.custom={};
    			}
    			if(val.length>0){
    				$(val).each(function(x,v){
    					if(v !=undefined &&v!=null){
    					var labelcol=1;//默认合计列数为1
    					if(v.tbody&&v.tbody.length>0){
    					$(v.tbody).each(function(j,item){
    						var columnshowcount=0;
        					var rowarr=new Array();
        					$(v.thead).each(function(k,title){
        						var titleconfig=title.contentconfig;
        						if(titleconfig==undefined){
        							titleconfig={};
        						}
        						if(titleconfig&&titleconfig.isshow==undefined){
    								titleconfig.isshow=true;
    							}
        						if(tablenotedit){
    								titleconfig.editable=false;
    							}
        						title.contentconfig=titleconfig;
        						var fm=util.setAccounting(accounting,title.custom);
        						if(title.key!="operate_col"){//判断列是否为操作列
        							var val="";
        							if(title.custom&&title.custom.symbol){
        								val=fm.unformat(item[title.key]);
        							}else{
        								val=item[title.key];
        							}
        							if(titleconfig.issequence){
        								val=j+1;
        							}
        							var coldata={"cols":title.cols,"code":title.key,"val":val,"config":titleconfig};
        							if(title.custom){
        								coldata.custom=title.custom;//判断是否有自定义属性
        							}
        							
        							if(title.operators){//判断列是否需要绑定函数
        								coldata.operators=title.operators;
        								coldata.context=JSON.stringify(title.operators[0]);
        								coldata.customstr=JSON.stringify(title.custom);//自定义属性json对象转换为str
        							}
        							rowarr.push(coldata);//数据列数据处理
                					if(hassum){//判断统计列
                						$(hassum.sumcols).each(function(j,col){
                								if(title.key==col.key&&titleconfig.isshow){//相等为统计列
                									if(sum[title.key]){//当前列是否已有统计数据
                										sum[title.key].val+=fm.unformat(item[title.key]);//同一列统计累加
                									}else{
                										//当前列首次统计
                										sum[title.key]={};
                										sum[title.key].val=fm.unformat(item[title.key]);
                										sum[title.key].cols=title.cols;//统计列所占列数
                										sum[title.key].hassum=true;
                										sum[title.key].custom=title.custom;
                										sum[title.key].config=title.contentconfig;
                										if(col.operators&&col.operators.length>0){
                											sum[title.key].operatorstr=JSON.stringify(col.operators[0]);
                										}
                										sum[title.key].operators=col.operators;
                									}
                								}
                						});
                						
                					}
        						}else{
        							$(title.operators).each(function(i,item){
        								item.customstr=JSON.stringify(item.params);
        							});
        							console.log(titleconfig.isshow);
        							rowarr.push({"cols":title.cols,"isoperate":true,config:titleconfig,"operators":title.operators});//操作列数据封装
        						}
        						//判断是否为第一列
        						if(titleconfig.isshow){
            						//不需统计列并且不是第一列
            						if(!sum[title.key]&&columnshowcount!=0){
            							sum[title.key]={};
            							sum[title.key].val="";
            							sum[title.key].cols=title.cols;
            							sum[title.key].hassum=false;
            							sum[title.key].config=title.contentconfig;
            						}
            						if(columnshowcount==0){
            							labelcol=title.cols;
            							columnshowcount=title.cols;
            						}
        						}
        							if(k==0&&!title.contentconfig.isshow){
        								sum[title.key]={};
            							sum[title.key].val="";
            							sum[title.key].cols=title.cols;
            							sum[title.key].config=title.contentconfig;
        						}

        					});
        					tbodyarr.push({"record":rowarr,"recordjson":JSON.stringify(rowarr)});
    					});
    					}
    					thead=v.thead;
    					if(v.tbody&&hassum){
    						sumobj.label={};
    						sumobj.label.name=hassum.name;//页面渲染合计名称
    						sumobj.label.cols=labelcol;
    					}
    					
    					if(v.tbody==undefined||v.tbody.length==0){
    						hassum=attr.custom.hassum;
    						if(hassum){
    							var firstshowcolumncol=0;
    							sumobj.label={};
        						sumobj.label.name=hassum.name;//页面渲染合计名称
        						$.each(thead,function(tk,title){
        							if(title.contentconfig==undefined){
        								title.contentconfig={};
        							}
        							if(title.contentconfig&&title.contentconfig.isshow==undefined){
        								title.contentconfig.isshow=true;
        							}
        							if(title.contentconfig.isshow){
            							 if(!sum[title.key]&&firstshowcolumncol!=0){
                							sum[title.key]={};
                							sum[title.key].val="";
                							sum[title.key].cols=title.cols;
                							sum[title.key].config=title.contentconfig;
                							var ishassum=false;
                							var operators=[];
                							if(hassum.sumcols){
                								$(hassum.sumcols).each(function(sc,sumcol){
                    								if(sumcol.key==title.key){
                    									ishassum=true;
                    									operators=sumcol.operators;
                    								}
                    							});
                							}
                							sum[title.key].hassum=ishassum;
                							if(operators&&operators.length>0){
    											sum[title.key].operatorstr=JSON.stringify(operators[0]);
    										}
    										sum[title.key].operators=operators;
                						}
            							 if(firstshowcolumncol==0){
             								sumobj.label.cols=title.cols;
             								firstshowcolumncol=title.cols;
             							}
        							}
        							if(tk==0&&!title.contentconfig.isshow){
        								sum[title.key]={};
            							sum[title.key].val="";
            							sum[title.key].cols=title.cols;
            							sum[title.key].config=title.contentconfig;
        							}
        							
        						});
        						
        					}else{
        						$.each(thead,function(tk,title){
        							if(title.contentconfig==undefined){
        								title.contentconfig={};
        							}
        							if(title.contentconfig&&title.contentconfig.isshow==undefined){
        								title.contentconfig.isshow=true;
        							}
        						});
        					}
    					}
    					sumobj.sum=sum;//页面渲染合计列对象
    				}
    				});
    			}
    			attr.value[0]={"thead":thead,"tbody":tbodyarr};
    			//判断是否有合计行
    			if(attr.custom.hassum){
    				attr.value[0].sumobj=sumobj;//合计行数据填充
    			}
    			if(attr.custom.ispagination){
    				attr.value[0].ispagination=attr.custom.ispagination;
    			}
    			return attr;
			}
	};
	module.exports=dynamictable;
});