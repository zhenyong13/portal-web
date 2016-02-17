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
    require("bootbox");
    require("dialog");
    require("validVal")($);
    var mdboss = require("mdboss");
    require("fullcalendar");
    var accounting=require("accounting");
    var dynamictable=require("dynamictable");
    Backbone.emulateJSON = true;
    //{el:el,formdata:formdata}
    mdboss.View.dynamicformView=Backbone.View.extend({
    	initialize:function(options){
    		var template;
    		template=require("text!../../../template/page/process/form/dynamicform.html");
    		this.template=template;
    		this.$el.append(this.template);
    	 	this.formdata=options.formdata;
    		this.data=this.dataparse();
    		this.formpost={};
    		this.tmpsubmitdata={};//处理提交时差异的数据
    		this.tmpsavedata={};//处理保存时差异的数据
    		this.dynamicdata={};
    		this.render();
    	},
    	render:function(){
    		_this=this;
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
    		
    		_this.$el.find( ".processform" ).validVal();
			$('.date').datetimepicker({
                format: 'yyyy-mm-dd',
                minView: 2,
                autoclose: true,
                language: 'zh-CN',
                startDate: '+0d'
            });
           	_this.$el.find("select:visible").select2();
           	_this.$el.find("select[multi=multi]:visible").select2({width:'500'});
           	_this.$el.find(".jscroll").jScrollPane();
    	},
    	dataparse:function(){
    		_this=this;
    		var formdata=_this.formdata;
    		var data=[];
    		for(var key in formdata){
    			var attr=formdata[key];
    			if(data[attr.regionorder]!=undefined){
    				data[attr.regionorder].attrs.push(attr);
    			}else{
    				data[attr.regionorder]={"regionorder":attr.regionorder,"region":attr.region,"attrs":[attr]};
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
    		_this=this;
    		 var template = Handlebars.compile($("#region-template").html());
    		var regionhtml= template(_this.data);
    		var $content=_this.$el.find(".forms-content .jspPane");
			if($content.html()==undefined){
    			$content=_this.$el.find(".forms-content");
    			$content.append(regionhtml);
    		}else{
    			_this.$el.find(".forms-content .jspPane").append(regionhtml);
    		}
    		
    	},
    	attributehtml:function(){
    		_this=this;
    		//attr={"region": "便签", "isshow": true,"itemorder": 17,"name": "公文便签","value": [],"code": "formitem-017","type": "text","required": true,"regionorder": 4,"editable": true,"col":12}
    		$(_this.data).each(function(index,region){
    			if(region!=undefined){
    				var html=new Array();
    				var column=0;
    				var regionlength=region.attrs.length;
        			$(region.attrs).each(function(i,attr){
        				if(_this.isprint){//打印时需要动态调整样式
        					attr.beforecol=false;
            				attr.curcol=false;
            				if(i<regionlength-1){
            					if(column<=12){
                					column+=attr.cols;
                					if(column>12){//当前面的列相加少于12时，前面最后一列需要加宽使相加等12
                						attr.beforewidth=12-(column-attr.cols);//前一列的需要加宽列数
                						column=attr.cols;
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
                					attr.cols+=12-attr.cols;
            					}
            					column=0;
            					attr.curcol=true;//标识当前列不需要右边框
            				}
        				}
        				
        				var templatehtml=_this.getAttributeHtml(attr);
        				if(templatehtml){
        					html.push(templatehtml);
        				}
        			});
        			_this.$el.find(".js_region"+region.regionorder).append(html.join(""));
    			}
    			
    		});
    		_this.$el.find(".jscroll").jScrollPane();
    	},
    	getAttributeHtml:function(attr){
    		_this=this;
    		switch(attr.type){
    		case "text"://文本
    			var template = Handlebars.compile($("#input-template").html());
    			return template(attr);
    		case "date":
    			var template = Handlebars.compile($("#date-template").html());
    			return template(attr);
    		case "radio"://单选按钮
    			var template = Handlebars.compile($("#radio-template").html());
    			attr.random=mdboss.getuuid();//防止多窗口时ID冲突，添加随机数
    			return template(attr);
    		case "checkbox"://多选按钮
    			var template = Handlebars.compile($("#checkbox-template").html());
    			return template(attr);
    		case "select"://下拉
    			var template = Handlebars.compile($("#select-template").html());
    			return template(attr);
    		case "multiselect"://多选
    			var template = Handlebars.compile($("#multiselect-template").html());
    			return template(attr);
    		case "orgpicker"://组织结构
    			var template = Handlebars.compile($("#selectorgs-template").html());
    			return template(attr);
    		case "fileupload"://上传
    			var template = Handlebars.compile($("#fileupload-template").html());
    			attr.baseUrl=baseConfig.avatar_url;
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
    			return template(attr);
    		case "addserialcode"://添加顺序号
    			var template = Handlebars.compile($("#addserialcode-template").html());
    			return template(attr);
    		case "textarea"://多行文本框
    			var template = Handlebars.compile($("#textarea-template").html());
    			return template(attr);
    		case "dealopinion"://处理意见
    			var template = Handlebars.compile($("#dealopinion-template").html());
    			return template(attr);
    		case "tablelist"://tablelist
    			var template = Handlebars.compile($("#tablelist-template").html());
				var data=dynamictable.getdata(attr);
    			return template(data);
    		case "picker":
    				var template = Handlebars.compile($("#picker-template").html());
        			var val=attr.value;
        			attr.customstr=JSON.stringify(attr.custom);
        			return template(attr);
    			
    		}
    	},
    	getSortFun:function(order, sortBy) {
    	    var ordAlpah = (order == 'asc') ? '>' : '<';
    	    var sortFun = new Function('a', 'b', 'return a.' + sortBy + ordAlpah + 'b.' + sortBy + '?1:-1');
    	    return sortFun;
    	},
    	getAttrData:function(attr){
    		_this=this;
    		switch(attr.type){
    		case "text":
    			return _this.formpost[attr.code]=_this.$el.find("#"+attr.code).val();
    		case "date":
    			return _this.formpost[attr.code]=_this.$el.find("#"+attr.code).val();
    		case "radio":
    			return _this.formpost[attr.code]=_this.$el.find("input[name="+attr.code+"]:checked").val();
    		case "checkbox":
    			var checkedvals=new Array();
    			_this.$el.find("input[name="+attr.code+"]:checked").each(function(index,item){
    					checkedvals.push($(this).val());
    				});
    			return _this.formpost[attr.code]=checkedvals;
    		case "select":
    			return _this.formpost[attr.code]=_this.$el.find("#"+attr.code).val();
    		case "multiselect":
    			var selectedvals=new Array();
    			_this.$el.find("#"+attr.code+" option:selected").each(function(index,item){
    				selectedvals.push($(item).val());
               });
    			return _this.formpost[attr.code]=selectedvals;
    		case "orgpicker":
    			var tmpsubmit=new Array();
    			var tmpsave=new Array();
    			_this.$el.find("."+attr.code+"-showorgs .file-show a:first-child").each(function(index,item){
    				var code=$(item).data("id");
    				var name=$(item).data("name");
    				var edit=$(item).data("edit");
    				tmpsubmit.push({"code":code,"name":name,"editable":false});
    				tmpsave.push({"code":code,"name":name,"editable":edit});
    			});
    			_this.tmpsubmitdata[attr.code]=tmpsubmit;
    			_this.tmpsavedata[attr.code]=tmpsave;
    			return;
    		case "fileupload":
    			var tmpsubmit=new Array();
    			var tmpsave=new Array();
    			_this.$el.find("span[data-code="+attr.code+"]").find(".file-show").each(function(index,item){
    				var name=$(item).data("name");
    				var code=$(item).data("code");
    				var isedit=$(item).data("isedit");
    				tmpsubmit.push({"code":code,"name":name,"editable":false});//提交时数据
    				tmpsave.push({"code":code,"name":name,"editable":isedit});//保存时数据
    			});
    			_this.tmpsubmitdata[attr.code]=tmpsubmit;
    			_this.tmpsavedata[attr.code]=tmpsave;
    			return ;
    		case "memo":
    			var tmpsubmit=new Array();
    			var tmpsave=new Array();
    			_this.$el.find("#"+attr.code+"-showmemo li").each(function(index,item){
    				var editable=$(item).data("editable");//是否可编辑
    				var createtime=$(item).data("createtime");//创建时间
    				var avatarcode=$(item).data("avatarcode");//头像code
    				var usercode=$(item).data("usercode");//用户code
    				var username=$(item).data("username");//用户名
    				var content=$(item).find(".meno-value").val();
    				tmpsubmit.push({"editable":false,"content":content,"createtime":createtime,"avatarcode":avatarcode,"usercode":usercode,"username":username});//提交时数据
    				tmpsave.push({"editable":editable,"content":content,"createtime":createtime,"avatarcode":avatarcode,"usercode":usercode,"username":username});//保存时数据
    			});
    			_this.tmpsubmitdata[attr.code]=tmpsubmit;
    			_this.tmpsavedata[attr.code]=tmpsave;
    			return ;
    		case "serial":
    			var vals=attr.value[0];
    			var serialcode=_this.$el.find("#"+vals.serial.code).val();
    			var year=_this.$el.find("#"+vals.year.code).val();
    			var num=_this.$el.find("#"+vals.num.code).val();
    			return _this.formpost[attr.code]={"serial":serialcode,"year":year,"num":num};
    		case "textarea":
    			return _this.formpost[attr.code]=_this.$el.find("#"+attr.code).val();
    		}
    	},
    	getformsdata:function(){
    		_this=this;
    		//attr={"region": "便签", "isshow": true,"itemorder": 17,"name": "公文便签","value": [],"code": "formitem-017","type": "text","required": true,"regionorder": 4,"editable": true,"col":12}
    		$(_this.data).each(function(index,region){
    			if(region!=undefined){
        			$(region.attrs).each(function(i,attr){
        				_this.getAttrData(attr);
        			});
    			}
    		});
    		_this.dynamicdata.formpost=_this.formpost;//基础表单数据
    		_this.dynamicdata.tmpsubmitdata=_this.tmpsubmitdata;//提交操作时差异化的数据
    		_this.dynamicdata.tmpsavedata=_this.tmpsavedata;//保存操作时差异化的数据
    		return _this.dynamicdata;
    	}
    });
    var getdynamicView=function(options){
    	var dynamicView=new mdboss.View.dynamicformView(options);
    	return dynamicView;
    };
    module.exports=getdynamicView;
});
