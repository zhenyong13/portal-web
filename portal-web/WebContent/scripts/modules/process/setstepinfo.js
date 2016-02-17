/**
 * Created by 2goyoung on 2015/5/11.
 */


define(function (require, exports, module) {
    var $ = require("jquery");
    require("bootstrap")($);
    require("backbone");
    require("scroll");
    require("fileinput");
    require("bootbox");
    require("dialog");
    var utils =  require("util");
    require("notify")($);
    require("select2");
    Backbone.emulateJSON = true;
   
    mdboss.View.stepInfo = Backbone.View.extend({
		$dialog:"",
		initialize : function(data) {
			_this=this;
			_this.data=data;
			_this.formlist=data.formlist;
			var dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                    $(this).find(".jscroll").jScrollPane({"autoReinitialise": true});
                }
            }, {"title":"编辑环节信息","width":"800px","height":"600px","icon":"iconfont icon-mdliucheng","resize":function(){
            		$(this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                }}).show(function(){
                	$dialog=this;
                	 var template = Handlebars.compile(require("text!template/page/process/form/stepinfo.html"));
                	 var formcode=_this.data.step.formcode;
                	 var formname="";
                	 $.each(_this.formlist,function(index,item){
                		 if(item.formcode==formcode){
                			 formname=item.formname;
                		 }
                	 });
                	 _this.data.step.formname=formname;
                	 var html = template({step:_this.data.step,baseUrl:baseConfig.base,random:mdboss.getuuid(),formlist:_this.formlist});
                     $($dialog.dialog).find(".loading").removeClass("loading");
                     $(html).appendTo($($dialog.dialog).find(".dialog-content")).fadeIn();
                     $(require("text!template/page/process/form/stepinfotemplate.html")).appendTo($($dialog.dialog).find(".dialog-content"));
                     var commonModel = new mdboss.Model.commonModel();
                     var cur_reddoctype=_this.data.step.reddoctype;
                     var cur_oacachet=_this.data.step.oacachet;
                     $("select").select2({"width":200});
                     //获取红头文件类型
           			 commonModel.save({"usercode":mdboss.usercode,"definition":"#OA_REDDOCTYPE"},{url:mdboss.api.queryProcesstype, success:function(m,res){
           				  var options=new Array();
           				  if(res.rc=="-1"){
           					  mdboss.error("请求接口异常");
           					  return;
           				  }
           				  var tmp = res.data.rows;
           				  
           				  options.push('<option value="">请选择</option>');
           				  for(var i =0; i<tmp.length; i++){
    						  options.push('<option ');
    						  if(cur_reddoctype!=null&&cur_reddoctype.length>0){
    							  $(cur_reddoctype).each(function(j,reddoc){
    		   							 if(tmp[i].dictcode==reddoc.filecode){
    		   								 options.push('selected="selected"');
    		   							 } 
    	    	   					  });
    						  }
    						  
    						  
    						  options.push('value="');
    						  options.push(tmp[i].dictcode);
    						  options.push('">');
    						  options.push(tmp[i].dictname);
    						  options.push('</option>');
    					  }
           				 _this.$el.find("#reddoctype").html(options.join(''));	
           				$("#reddoctype").select2({"width":500});
           				 _this.$el.find(".jscroll").jScrollPane({"autoReinitialise": true});
                         
           			 },error:function(m,res){
           				 mdboss.error("获取红头类型失败");
           			 }});
           			 
           			 commonModel.save({"usercode":mdboss.usercode,"definition":"#OA_CACHET"},{url:mdboss.api.queryProcesstype, success:function(m,res){
          				  var options=new Array();
          				  if(res.rc=="-1"){
         					  mdboss.error("请求接口异常");
         					  return;
         				  }
          				  var tmp = res.data.rows;
          				  for(var i =0; i<tmp.length; i++){
   						  options.push('<option ');
   						  if(cur_oacachet!=null&&cur_oacachet.length>0){
   							$(cur_oacachet).each(function(j,cachet){
      							 if(tmp[i].dictcode==cachet.cachetcode){
      								 options.push('selected="selected"');
      							 } 
      						  });
   						  }
   						  
   						  
   						  options.push('value="');
   						  options.push(tmp[i].dictcode);
   						  options.push('">');
   						  options.push(tmp[i].dictname);
   						  options.push('</option>');
   					  }
          				 _this.$el.find("#oa_cachet").html(options.join(''));
          				 _this.$el.find(".jscroll").jScrollPane({"autoReinitialise": true});
                        $("#oa_cachet").select2({"width":500,"height":10});
          			 },error:function(m,res){
          				 mdboss.error("获取印章列表失败");
          			 }});
                    
        		});
			this.$el = dialog.$html;
			_this.dialog=dialog;
		},
		events:{
			"click .js_form_submit":"form_submit",
			"click .js_form_cancel":"form_cancel",
			"click .js_search_form":"search_form",
			"keyup .js_search":"keysearch",
			"click .js_selected_form":"selected_form",
			"click .js_cancel_selected":"cancel_selected",
			"mouseover .entity-item":"showdel",
			"mouseout .entity-item":"hidedel",
			"click .close":"del_selected"
		},
		keysearch:function(e){
			var $current=$(e.currentTarget);
			var keywords=$current.val();
			var html ="";
			if(keywords!=null&&keywords!=""){
				$(_this.formlist).each(function(index,item){
					if(item.formname.indexOf(keywords)!=-1){
						html += '<p class="employee js_selected_form" data-formcode="'+item.formcode+'" style="width:111px;"><span id="'+item.formcode+'">'+item.formname+'</span></p>';
					}
				});
			}else{
				$(_this.formlist).each(function(index,item){
					html += '<p class="employee js_selected_form" data-formcode="'+item.formcode+'" style="width:111px;"><span id="'+item.formcode+'">'+item.formname+'</span></p>';
				});
			}
			$("#searchList").html(html);
			$("#searchList").show();
			
		},
		del_selected:function(e){
			var $current=$(e.currentTarget);
			$current.parent("span").remove();
		},
		hidedel:function(e){
			var $current=$(e.currentTarget);
			$current.find("button").addClass("hide");
		},
		showdel:function(e){
			var $current=$(e.currentTarget);
			$current.find("button").removeClass("hide");
		},
		selected_form:function(e){
			$(".js_search_form").removeClass("form-select-btn");
			$("#formtips").hide();
			var $current=$(e.currentTarget);
    		var id  = $current.data("formcode");
    		var name  = $current.text();
    		var tm = '<span id="'+id+'" class="entity-item"><a data-value="'+id+'">'+name+'</a><button type="button" class="close hide" title="删除">×</button>&nbsp;</span>';
    		var flag = true;
    		$("#formlist span").each(function(i){
    			var formcode = $(this).attr("id");
    			if(id == formcode){
    				flag = false;
    				return;
    			}
    		});
    		if(flag)
    			$("#formlist").html(tm);	
				$(".js_search").hide();
				$("#searchList").hide();
    	
		},
		cancel_selected:function(){
			
		},
		search_form:function(e){
			$(e.currentTarget).addClass("form-select-btn");
			$(".js_search").show();
        	$(".loading_small").hide();
        	var html ="";
        	$( _this.formlist).each(function(index,item){
        		 html += '<p class="employee js_selected_form" data-formcode="'+item.formcode+'" style="width:111px;"><span id="'+item.formcode+'">'+item.formname+'</span></p>';
        	});
        	$("#searchList").html(html);
        	$("#searchList").show();
		},
		form_submit:function(){//修改 TODO
			///wfs/task/chg
			var p_this = this;
			var stepname=this.$el.find("#stepname").val();
			var stepdesc=this.$el.find("#stepdesc").val();
			var reddoctype=this.$el.find("#reddoctype option:selected");
			var reddocselectedvals=new Array();
			var reddocselectedvalIds=new Array();
			$(reddoctype).each(function(index,item){
				reddocselectedvals.push({"filecode":$(item).val(),"reddocname":$(item).text()});
				reddocselectedvalIds.push($(item).val());
			});
			var seqno=$("#seqno").val();
			if(!utils.isNumber(seqno)){
				mdboss.alert("序号只能为数字!");return;
			}
			var custom=this.$el.find("#custom").val();
			var formcode=this.$el.find("#formcode").val();
			if(formcode==undefined||formcode==""){
				mdboss.alert("处理表单不能为空");
				return false;
			}
			var printform=this.$el.find("#printform").val();
			if(printform==undefined||printform==""){
				mdboss.alert("打印表单不能为空");
				return false;
			}
			
			var selecttype=this.$el.find("input[name=selecttype]:checked").val();//$("#selecttype").val();
			
			//处理意见
			var result={};
			var rname=this.$el.find("#result-name").val();//名称
			var risedit=this.$el.find("input[name=result-isedit]:checked").val()=="true"?true:false;//是否编辑
			var risshow=this.$el.find("input[name=result-isshow]:checked").val()=="true"?true:false;//是否显示
			var risrequire=this.$el.find("input[name=result-isrequire]:checked").val()=="true"?true:false;//是否必填
			
			var canmoveback=this.$el.find("input[name=canmoveback]:checked").val()=="true"?true:false;
			var rvalfrom=this.$el.find("#result-val-from").val();//值来源
			result.name=rname;
			result.editable=risedit;
			result.isshow=risshow;
			result.required=risrequire;
			result.valuesource=rvalfrom;
			//流程意见
			var opinion={};
			var oname=this.$el.find("#opinion-name").val();//名称
			var oisedit=this.$el.find("input[name=opinion-isedit]:checked").val()=="true"?true:false;//是否编辑
			var oisshow=this.$el.find("input[name=opinion-isshow]:checked").val()=="true"?true:false;//是否显示
			var oisrequire=this.$el.find("input[name=opinion-isrequire]:checked").val()=="true"?true:false;//是否必填
			var ovalfrom=this.$el.find("#opinion-val-from").val();//值来源
			opinion.name=oname;
			opinion.editable=oisedit;
			opinion.isshow=oisshow;
			opinion.required=oisrequire;
			opinion.valuesource=ovalfrom;
			
			var maindoctemplate=this.$el.find(".file-show");
			var fileid="";
			var filename="";
			var maindoc="";
			$.each(maindoctemplate,function(i,item){
				fileid=$(item).data("code");
				filename=$(item).data("name");
				maindoc={"fileid":fileid,"filename":filename};
			});
			var oacachet=this.$el.find("#oa_cachet option:selected");
			var selectedvals=new Array();
			var selectedvalIds=new Array();
			$(oacachet).each(function(index,item){
				selectedvals.push({"cachetcode":$(item).val(),"cachetname":$(item).text()});
				selectedvalIds.push($(item).val());
			});
			if(stepname==undefined||stepname==""){
				mdboss.alert("环节名称不能为空");
				return false;
			}
			if(oname==undefined||oname==""){
				mdboss.alert("流程意见名称不能为空");
				return false;
			}
			if(rname==undefined||rname==""){
				mdboss.alert("处理结果名称不能为空");
				return false;
			}
			//下一环节
			var shownextstep=this.$el.find("input[name=nextstep-isshow]:checked").val()=="true"?true:false;
			var post={"usercode":mdboss.usercode,"opinion":opinion,"shownextstep":shownextstep,"result":result,"processcode":_this.data.processcode,"stepcode":_this.data.stepcode,"stepname":stepname,"stepdesc":stepdesc,"seqno":seqno,"formcode":formcode,"selecttype":selecttype,"maindoctmpl":maindoc};
			if(reddocselectedvals!=null&&reddocselectedvals.length>0){
				post.reddoctype=reddocselectedvals;
			}
			if(selectedvals!=null&&selectedvals.length>0){
				post.oacachet=selectedvals;
			}
			post.custom = custom;
			post.printform = printform;
			post.canmoveback = canmoveback;
			
			var commonModel=new mdboss.Model.commonModel();
			commonModel.save(post,{url:mdboss.api.stepchg,success:function(model,response){
				if(response.rc==1){
					mdboss.notifyTips("修改成功！");
//					var $td1=p_this.data.parent.$el.find("#"+post.stepcode).find("td").first();
					var $tr=p_this.data.parent.$el.find("#"+post.stepcode).closest("tr");
					
					$tr.find("td:eq(1) span").text(seqno);
					$tr.find("td:eq(2) span").text(stepname);
					if(shownextstep){
						$tr.find("td:eq(4) span").text("是");
					}else{
						$tr.find("td:eq(4) span").text("否");
					}
					$tr.find("td:eq(5) span").text(stepdesc);
	        		 _this.dialog.close();
	        		 var item= _this.data.parent.activity_arr[_this.data.stepcode];
	        		 item.stepname=stepname;
	        		 item.stepdesc=stepdesc;
	        		 item.selecttype=selecttype;
	        		 item.seqno=seqno;
	        		 item.canmoveback=canmoveback;
	        		 item.printform=printform;
	        		 item.custom=custom;
	        		 item.formcode=formcode;
	        		 item.opinion=opinion;
	        		 item.opinionjson=JSON.stringify(opinion);
	        		 item.result=result;
	        		 item.resultjson=JSON.stringify(result);
	        		 item.shownextstep=shownextstep;
	        		 item.reddoctype=reddoctype;
	        		 item.maindoc=maindoc;
	        		 item.oacachet=selectedvalIds;
	        		 //添加流程意见，处理结果，是否显示下一环节
	        		 _this.data.parent.activity_arr[_this.data.stepcode]=item;
				}else{
					mdboss.error(response.msg);
				}
			},error:function(){
				mdboss.error();
			}});
		},
		form_cancel:function(){
			_this.dialog.close();
		}
	});
    
    
    //批量修改
    mdboss.View.stepInfoEdit = Backbone.View.extend({
		$dialog:"",
		initialize : function(data) {
			_this=this;
			_this.data=data;
			_this.formlist=data.formlist;
			var dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                    $(this).find(".jscroll").jScrollPane();
                }
            }, {"title":"编辑环节信息","width":"800px","height":"600px","icon":"iconfont icon-mdliucheng","resize":function(){
                }}).show(function(){
                	$dialog=this;
                	 var template = Handlebars.compile(require("text!template/page/process/form/stepinfoEdit.html"));
                	  
                	 var html = template({formlist:_this.formlist,random:mdboss.getuuid()});
                     $($dialog.dialog).find(".loading").removeClass("loading");
                     $(html).appendTo($($dialog.dialog).find(".dialog-content")).fadeIn();
                     $(require("text!template/page/process/form/stepinfotemplate.html")).appendTo($($dialog.dialog).find(".dialog-content"));
                     var commonModel = new mdboss.Model.commonModel();
                     //获取红头文件类型
                     $("select").select2({"width":200});
           			 commonModel.save({"usercode":mdboss.usercode,"definition":"#OA_REDDOCTYPE"},{url:mdboss.api.queryProcesstype, success:function(m,res){
           				  var options=new Array();
           				 $("#reddoctype").select2({"width":500});
           				  if(res.rc==-1){
           					  mdboss.error("请求接口异常");
           					  return;
           				  }
           				  var tmp = res.data.rows;
           				  options.push('<option value="">请选择</option>');	
    					  for(var i =0; i<tmp.length; i++){
    						  options.push('<option ');
    						  options.push('value="');
    						  options.push(tmp[i].dictcode);
    						  options.push('">');
    						  options.push(tmp[i].dictname);
    						  options.push('</option>');
    					  }
           				 _this.$el.find("#reddoctype").html(options.join(''));	
           				 _this.$el.find(".jscroll").jScrollPane({"autoReinitialise": true});
           			 },error:function(m,res){
           				 mdboss.error("获取红头类型失败");
           			 }});
           			commonModel.save({"usercode":mdboss.usercode,"definition":"#OA_CACHET"},{url:mdboss.api.queryProcesstype, success:function(m,res){
        				  var options=new Array();
        				  if(res.rc=="-1"){
       					  mdboss.error("请求接口异常");
       					  return;
       				  }
        				  var tmp = res.data.rows;
        				  for(var i =0; i<tmp.length; i++){
 						  options.push('<option ');
 						  options.push('value="');
 						  options.push(tmp[i].dictcode);
 						  options.push('">');
 						  options.push(tmp[i].dictname);
 						  options.push('</option>');
 					  }
        				 _this.$el.find("#oa_cachet").html(options.join(''));
        				 _this.$el.find(".jscroll").jScrollPane({"autoReinitialise": true});
        				 $("#oa_cachet").select2({"width":500,"height":10});
        			 },error:function(m,res){
        				 mdboss.error("获取印章列表失败");
        			 }});
        		});
			this.$el = dialog.$html;
			_this.dialog=dialog;
		},
		events:{
			"click .js_form_submit":"form_submit",
			"click .js_form_cancel":"form_cancel",
			"click .js_search_form":"search_form",
			"keyup .js_search":"keysearch",
			"click .js_selected_form":"selected_form",
			"click .js_cancel_selected":"cancel_selected",
			"mouseover .entity-item":"showdel",
			"mouseout .entity-item":"hidedel",
			"click .close":"del_selected"
		},
		keysearch:function(e){
			var $current=$(e.currentTarget);
			var keywords=$current.val();
			var html ="";
			if(keywords!=null&&keywords!=""){
				$(_this.formlist).each(function(index,item){
					if(item.formname.indexOf(keywords)!=-1){
						html += '<p class="employee js_selected_form" data-formcode="'+item.formcode+'" style="width:111px;"><span id="'+item.formcode+'">'+item.formname+'</span></p>';
					}
				});
			}else{
				$(_this.formlist).each(function(index,item){
					html += '<p class="employee js_selected_form" data-formcode="'+item.formcode+'" style="width:111px;"><span id="'+item.formcode+'">'+item.formname+'</span></p>';
				});
			}
			$("#searchList").html(html);
			$("#searchList").show();
			
		},
		del_selected:function(e){
			var $current=$(e.currentTarget);
			$current.parent("span").remove();
		},
		hidedel:function(e){
			var $current=$(e.currentTarget);
			$current.find("button").addClass("hide");
		},
		showdel:function(e){
			var $current=$(e.currentTarget);
			$current.find("button").removeClass("hide");
		},
		selected_form:function(e){
			$(".js_search_form").removeClass("form-select-btn");
			$("#formtips").hide();
			var $current=$(e.currentTarget);
    		var id  = $current.data("formcode");
    		var name  = $current.text();
    		var tm = '<span id="'+id+'" class="entity-item"><a data-value="'+id+'">'+name+'</a><button type="button" class="close hide" title="删除">×</button>&nbsp;</span>';
    		var flag = true;
    		$("#formlist span").each(function(i){
    			var formcode = $(this).attr("id");
    			if(id == formcode){
    				flag = false;
    				return;
    			}
    		});
    		if(flag)
    			$("#formlist").html(tm);	
				$(".js_search").hide();
				$("#searchList").hide();
    	
		},
		cancel_selected:function(){
			
		},
		search_form:function(e){
			$(e.currentTarget).addClass("form-select-btn");
			$(".js_search").show();
        	$(".loading_small").hide();
        	var html ="";
        	$( _this.formlist).each(function(index,item){
        		 html += '<p class="employee js_selected_form" data-formcode="'+item.formcode+'" style="width:111px;"><span id="'+item.formcode+'">'+item.formname+'</span></p>';
        	});
        	$("#searchList").html(html);
        	$("#searchList").show();
		},
		form_submit:function(){//TODO 批量修改
			///wfs/task/chg
			var a_this = this;
			var formcode=a_this.$el.find("#formcode").val();
			var printform=a_this.$el.find("#printform").val();
			var custom=a_this.$el.find("#custom").val();
			var stepdesc=a_this.$el.find("#stepdesc").val();
			var reddoctype=a_this.$el.find("#reddoctype option:selected");
			var reddocselectedvals=new Array();
			var reddocselectedvalIds=new Array();
			$(reddoctype).each(function(index,item){
				reddocselectedvals.push({"fileid":$(item).val(),"reddocname":$(item).text()});
				reddocselectedvalIds.push($(item).val());
			});
			var maindoctemplate=a_this.$el.find(".file-show");
			var fileid="";
			var filename="";
			$.each(maindoctemplate,function(i,item){
				fileid=$(item).data("code");
				filename=$(item).data("name");
			});
			var oacachet=a_this.$el.find("#oa_cachet option:selected");
			var selectedvals=new Array();
			var selectedvalIds=new Array();
			$(oacachet).each(function(index,item){
				selectedvals.push({"cachetcode":$(item).val(),"cachetname":$(item).text()});
				selectedvalIds.push($(item).val());
			});
			var post={"usercode":mdboss.usercode,"processcode":a_this.data.processcode,"tids":a_this.data.tids,"oacachet":selectedvals,"maindocimpl":{"fileid":fileid,"filename":filename}};
			if(a_this.$el.find("input[name=selecttype]:checked").val()){
				post.selecttype = a_this.$el.find("input[name=selecttype]:checked").val();
			}
			if(printform){
				post.printform=printform;
			}
			if(custom){
				post.custom=custom;
			}
			if(stepdesc){
				post.stepdesc=stepdesc;
			}
			if(reddoctype){
				post.reddoctype=reddocselectedvals;
			}
			
			if(selectedvals!=null&&selectedvals.length>0){
				post.oacachet=selectedvals;
			}
			//处理意见
			var result={};
			var rname=a_this.$el.find("#result-name").val();//名称
			//是否编辑
			if(a_this.$el.find("input[name=result-isedit]:checked").val()){
				result.editable=a_this.$el.find("input[name=result-isedit]:checked").val()=="true"?true:false;
			}
			
			//是否显示
			if(a_this.$el.find("input[name=result-isshow]:checked").val()){
				result.isshow= a_this.$el.find("input[name=result-isshow]:checked").val()=="true"?true:false;;
			}
			
			//是否必填
			if(a_this.$el.find("input[name=result-isrequire]:checked").val()){
				result.required=a_this.$el.find("input[name=result-isrequire]:checked").val()=="true"?true:false;;
			}
			
			var rvalfrom=a_this.$el.find("#result-val-from").val();//值来源
			if(rname)
				result.name=rname;
			if(rvalfrom)
				result.valuesource=rvalfrom;

			var rflag = false;
			$.each(result ,function(key, value){
                rflag = true;
            });
			if(rflag)
				post.result=result;
			//流程意见
			var opinion={};
			var oname=a_this.$el.find("#opinion-name").val();//名称
			//是否编辑
			if(a_this.$el.find("input[name=opinion-isedit]:checked").val()){
				opinion.editable= a_this.$el.find("input[name=opinion-isedit]:checked").val()=="true"?true:false;
			}
			//是否显示
			if(a_this.$el.find("input[name=opinion-isshow]:checked").val()){
				opinion.isshow= a_this.$el.find("input[name=opinion-isshow]:checked").val()=="true"?true:false;
			}
			//是否必填
			if(a_this.$el.find("input[name=opinion-isrequire]:checked").val()){
				opinion.required=a_this.$el.find("input[name=opinion-isrequire]:checked").val()=="true"?true:false;
			}
			
			var ovalfrom=a_this.$el.find("#opinion-val-from").val();//值来源
			if(oname)
				opinion.name=oname;
			if(ovalfrom)
				opinion.valuesource=ovalfrom;
			
			var oflag = false;
			$.each(opinion ,function(key, value){
				oflag = true;
			});
			if(oflag)
				post.opinion=opinion;
			//下一环节
			var shownextstep=a_this.$el.find("input[name=nextstep-isshow]:checked").val();//=="true"?true:false;
			if(shownextstep){
				post.shownextstep= a_this.$el.find("input[name=nextstep-isshow]:checked").val()=="true"?true:false;;
			}
			if( formcode != ""){
				post.formcode = formcode;
			}
			if(a_this.$el.find("input[name=canmoveback]:checked").val()){
				post.canmoveback=a_this.$el.find("input[name=canmoveback]:checked").val()=="true"?true:false;
			}
			
			var commonModel=new mdboss.Model.commonModel();
			commonModel.save(post,{url:mdboss.api.stepchgEdit,
				success:function(model,response){
				if(response.rc==1){
					mdboss.notifyTips("修改成功！");
	        		 a_this.dialog.close();
        			 callback = a_this.data.eidtCallBack;
        			 var callbackFn = typeof callback == "function" ? callback : function () { };
        			 callbackFn(a_this.data.processcode,a_this.data.prethis);
				}else{
					mdboss.error(response.msg);
				}
			},error:function(){
				mdboss.error();
			}});
		},
		form_cancel:function(){
			this.dialog.close();
		}
	});
    
    
});
