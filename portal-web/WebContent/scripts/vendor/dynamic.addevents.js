define(function(require, exports, module) {
	var $ = require("jquery");
	var util = require("util");
	var accounting=require("accounting");
	require("scroll");
	var dynamicformevents=function(mdboss){
			//通用组件处理-绑定事件--选择部门
			 $(document).on("click",".js_common_selectorgs",function(e){
				 var $current=$(e.currentTarget);
				 var code=$current.data("code");
				 var $custom=$current.data("custom");
				 var depts=new Array();
				 var roles=new Array();
				 var extdepts=new Array();//院外单位
				 var before = false;//是否在前面显示 院外音位
				 $current.parent().find("."+code+"-showorgs .file-show a:first-child").each(function(dindex,dept){
					if($(dept).data("id") == $(dept).data("name")){//院外单位
						if(dindex ==0){
							before = true;
						}
						extdepts.push($(dept).data("id")); 
					}else{
						var code=$(dept).data("id");
						var name=$(dept).data("name");
						if(code.substring(0,5)=="role-"){
							roles.push({"permcode":code,"permname":name});
						}else{
							depts.push(code); 
						}
					}
				 });
				 var selecttype=$custom.selecttype;
				 var selectOnly=false;
				 if(selecttype=="radio"){
					 selectOnly=true;
				 }
		     	var $container=$(e.currentTarget).parents(".forms-content");
					seajs.use("commonevents",function(commonevents){
						commonevents.selectorgs({dept:depts,perms:roles, "custom":$custom,"extdepts":extdepts, "before":before,callbacks:function(dataobj,parent,prview){
							var data=new Array();
							if(dataobj.id){
								var item=dataobj;
								data.push('<span class="file-show" style="margin-right:3px;position: relative; top: 4px;" data-code="'+item.id+'">');
								data.push('<a id="sl_'+item.id+'" data-edit="true" data-id="'+item.id+'" data-name="'+item.name+'">'+item.name+'</a> ');
								data.push('<a class="close_file js_close_dept file_remove_file" title="删除">×</a>');
								data.push('</span>');
								data=data.join("");
							}else{
								data=dataobj;
							}
							$container.find("."+code+"-showorgs").html(data);
							$container.closest(".jscroll").jScrollPane();
						},selectOnly:selectOnly});
					});
			});
			 var simpleselectuser=function(e){
				  var $container=$(e.currentTarget).closest(".forms-content");
				  var $current=$(e.currentTarget);
				  var $custom=$current.data("custom");
				  var $newrecord={};
				  mdboss.userselect(e,$container,function(pre,user){
						  if($custom){
							  if($custom.datamapping){
								  if($custom.datamapping.length>0){
									  $.each($custom.datamapping,function(i,mapping){
										  if(user){
											  if(mapping.dest=="selected_next_handler"){//选人时如果需要同时更新下一处理人，做特殊处理
												  var real_code=user.orgcode;
												  if(user.usercode!=""){
													  real_code+="_"+user.usercode;
												  }
												  $newrecord[mapping.dest]={"code":user.usercode,"real_code":real_code,"name":user.username,"editable":false};
											  }else{
												  $newrecord[mapping.dest]=user[mapping.src]; 
											  }
										  }else{
											  $newrecord[mapping.dest]=""; 
										  }
									  });
								  }else{
									  if(user){
										  $newrecord=user;
									  }else{
										  $newrecord={};
									  }
								  }
							  }
						  }
					  seajs.use("commonevents",function(commonevents){
						  commonevents.updateform($newrecord,$container);
					  });
				  },true);
			  };
			//通用组件处理-绑定事件--删除选择部门
			 $(document).on("click",".js_common_delselectorgs",function(e){
		       	 var $current=$(e.currentTarget);
		       	 $current.parent().remove();
			 });
			 $(document).on("click",".js_file_view", function(e){
	            	var filecode=$(e.currentTarget).data("file-id");
	            	var reddoctype=$(e.currentTarget).data("reddoctype");
	            	var taskcode = $(e.currentTarget).closest(".process-forms").find("#cur_process_taskcode").val();//任务编码
	            	var processcode = $(e.currentTarget).closest(".process-forms").find("#cur_process_code").val();//流程实例Id
	            	//console.log("taskcode=" + taskcode);
	            	
	            	var filename = $(e.currentTarget).text();
	            	var suffix = $(e.currentTarget).data("file-suffix");//文件后缀
	            	var fileperm = $(e.currentTarget).data("file-perm");//文件后缀
	            	//console.log("suffix=" + suffix);
	            	//console.log("filename=" + filename);
	            	if (suffix == undefined || suffix.length == 0){
	            		if(filename.length >0){
		            		suffix = $.trim(filename).substring(filename.lastIndexOf(".")+1);
		            	}
	            	}
	            	
	            	//console.log("suffix=" + suffix);
	            	if(fileperm==undefined||fileperm==null||fileperm==""){
	            		fileperm="readonly";
	            	}
	            	seajs.use("review", function () {
	            		new mdboss.View.fileReview({model:new mdboss.Model.commonModel( 
	       	      			 {"filecode":filecode,"reddoctype":reddoctype,"baseurl":baseConfig.base,"taskcode":taskcode,"suffix":suffix,"fileperm":fileperm,"processcode":processcode}
	       	           )});
	            	});
	            });
			
			//通用组件处理-绑定事件--删除选择人员
			 $(document).on("click",".js_common_delperson",function(e){
		       	 var $current=$(e.currentTarget);
		       	 $current.parent().remove();
			 });
			 //上传附件
			 $(document).on("change",".js_fileupload",function(e){
				 var $current=$(e.currentTarget);
				 var $container=$current.parents(".forms-content");
				 var code=$current.attr("id");//获取code
				 var fileperm=$current.data("fileperm");
				 var custom=$current.data("customstr");
				 if(fileperm==undefined||fileperm==""){
					 fileperm="readonly";
				 }
				 seajs.use("commonevents",function(commonevents){
						commonevents.fileupload({callbacks:function(data){
							$container.find("#"+code+"-showfiles").append(data);
							$container.closest(".jscroll").jScrollPane();
						},"code":code,"fileperm":fileperm,"custom":custom});
						
				 });
				 
			 });
			 
			 //添加便签
			 $(document).on("click",".js_addmemo",function(e){
				 _this=this;
				 var $currentEl=$(e.currentTarget).closest(".forms-content");
	        	 seajs.use("meno", function () {
	           		 var menoModel=new mdboss.Model.processMeno();
	           		 new mdboss.View.processMeno({model:menoModel,callbacks:function(res){
	           			 //添加到页面、隐藏添加按钮
	           			 var template = Handlebars.compile($("#meno-template").html());
	           			 res.baseUrl=baseConfig.avatar_url;
	                     var html = template(res);
	                     $currentEl.find(".js_memolist").append(html);
	                     $currentEl.find(".js_addmemo").hide();
	                     $currentEl.closest(".jscroll").jScrollPane();
	           		 }});
	           		
	           	 }); 
			 });
			 //修改便签
			 $(document).on("click",".js_changestate",function(e){//修改便签
				 var $this=$(e.currentTarget);
				 var editable=$this.closest("li").data("editable");
				 if(editable){
					 $this.addClass("hide");
					 $this.next().removeClass("hide").find("textarea").focus();
				 }
				
		     });
			 //光标离开编辑区域
			 $(document).on("blur",".js_updatememo textarea",function(e){
				   var $li=$(e.currentTarget).closest("li");
		      	   $li.find(".js_changestate").removeClass("hide");
		      	   $li.find(".js_updatememo").addClass("hide");
		      	   var content = $li.find(".js_updatememo textarea").val();
		      	   $li.find(".js_changestate").html(content).attr("title",content);//meno-value
			 });
			 //删除便签
			 $(document).on("click",".js_deletememo",function(e){
	        	 _this=this;
	        	 var $currentEl=$(e.currentTarget).closest(".forms-content");
	        	 var $this=$(e.currentTarget);
	       	     $this.closest("li").remove();
	       	  $currentEl.find(".js_addmemo").show();
		 });
		  //通用单选（红、橙、蓝）
		  $(document).on("click",".js_commonradio",function(e){
			  $(e.currentTarget).closest("ul").find("li").each(function(){
	        		var clzz=$.trim($(this).find(" span.js_commonradio").data("clzz"));
	        		if(clzz=="labelauty-checked"){
	        			$(this).find("label span ").removeClass("labelauty-checked").addClass("labelauty-unchecked");
	        		}else if(clzz=="labelauty2-checked"){
	        			$(this).find("label span ").removeClass("labelauty2-checked").addClass("labelauty-unchecked");
	        		}else if(clzz=="labelauty3-checked"){
	        			$(this).find("label span ").removeClass("labelauty3-checked").addClass("labelauty-unchecked");
	        		}else if(clzz=="labelauty4-checked"){
	        			$(this).find("label span ").removeClass("labelauty4-checked").addClass("labelauty-unchecked");
	        		}
	        	});
	        	var $current=$(e.currentTarget);
	        	var current=$current.data("clzz");
	        	if(current=="labelauty-checked"){
	        		$current.removeClass("labelauty-unchecked").addClass("labelauty-checked");
	    		}else if(current=="labelauty2-checked"){
	    			$current.removeClass("labelauty-unchecked").addClass("labelauty2-checked");
	    		}else if(current=="labelauty3-checked"){
					$current.removeClass("labelauty-unchecked").addClass("labelauty3-checked");
	    		}else if(current=="labelauty4-checked"){
					$current.removeClass("labelauty-unchecked").addClass("labelauty4-checked");
	    		} 
		  });
		  
		  $(document).on("click",".js_commoncheckbox",function(e){
	        	var $current=$(e.currentTarget);
	        	var current=$current.data("clzz");
	        	var checkedclzz="labelauty-checkbox-checked";
	        	var uncheckedclzz="labelauty-unchecked";
	        	if(current==checkedclzz){//选中
	        		$current.removeClass(checkedclzz).addClass(uncheckedclzz);
	        		$current.data("clzz",uncheckedclzz);
	    		}else{//非选中
	    			$current.removeClass(uncheckedclzz).addClass(checkedclzz);
	    			$current.data("clzz",checkedclzz);
	    		}
		  });
		  //顺序号切换获取字号
		  $(document).on("change",".js_serialcode",function(e){
			  var $currentEl=$(e.currentTarget).closest(".forms-content");
	         	var serialcode=$(e.currentTarget).val();
	         	if(serialcode==""){
	         		var options=new Array();
	            	   options.push('<option value="">请选择</option>');
	         		var $serialnum=$currentEl.find(".js_serialnum");
	            	   $serialnum.empty();
	            	   $serialnum.html(options.join(""));
	            	   $serialnum.select2();
	            	   return ;
	         	}
	         	var commonModel=new mdboss.Model.commonModel();
		   		commonModel.save({"serialcode":serialcode,"usercode":mdboss.usercode},{url: mdboss.api["queryZihao"],success:function(model,result){
	          	   if(result.rc==1){
	          		  var data=result.data.rows;
	          		   var options=new Array();
		            	   $.each(data,function(index,item){
		            		   options.push('<option value="'+item.id+'">'+item.num+'</option>');
		            	   });
		            	   var $serialnum=$currentEl.find(".js_serialnum");
		            	   $serialnum.empty();
		            	   $serialnum.html(options.join(""));
		            	   $serialnum.select2();
	          	   }
	             
		   		}});
	       
	         	
	         
		  });
		  //添加字号
		  $(document).on("click",".js_addserialcode",function(e){
			  var $currentEl=$(e.currentTarget).closest(".forms-content");
			  seajs.use("serialcode", function () {
				  new mdboss.View.serialcode({callbacks:function(res){
					  $currentEl.find(".js_serialcode").append('<option value="'+res.serialcode+'">'+res.serialcode+'</option>').val(res.serialcode).change();
				  }});
	          });
		  });
		  //选人控件绑定事件
		  $(document).on("click",".js_selectperson",function(e){
			  var $current=$(e.currentTarget);
			  var code=$current.data("id");
			  var $container=$current.parents(".forms-content");
			  var selectedvalues=new Array();
			  $container.find("."+code+"-showperson .file-show a:first-child").each(function(i,item){
				  var code=$(item).data("id");
				  var name=$(item).data("name");
				  selectedvalues.push({"code":code,"name":name});
			  });
			  console.log(selectedvalues);
			  var code=$current.data("id");//获取code
			  seajs.use("commonevents",function(commonevents){
					commonevents.select_person({"selpersoncallback":function(data){
						var template = Handlebars.compile($("#selectperon-show-template").html());
						$container.find("."+code+"-showperson").html(template({"persons":data}));
					},"selectedvalues":selectedvalues});
			 });
		  });
		  $(document).on("click",".js_del_file",function(e){
	           	 var $current=$(e.currentTarget);
	           	 $current.parent().remove();
		  });
		  
		  //表单通用计算，指定字段修改时，需要同步更新
		  $(document).on("blur",".js-calculate-chg",function(e){
			  var $current=$(e.currentTarget);
			  var $container=$current.closest(".forms-content");
			  if($current.attr("context")!=""){
				  var context=JSON.parse($current.attr("context"));
				  var curobj=[];
				  var $tr=$current.closest("tr");
				  var $custom=$current.data("custom");
				  if($custom.symbol){
					  var fm=util.setAccounting(accounting,$custom);//当前修改的金额格式化
					  var curval=fm.formatMoney(fm.unformat($current.val()));
					  $current.val(curval);
				  }else{
					  if(isNaN($current.val())){//判断非数字，焦点锁定，边框设置为红色
						mdboss.notifyTips("请输入数字");
						$current[0].focus();
						return false;
					  }else{
						  $current.css("border","");//清除边框
						  $current.val($current.val());//如果未标识为金额格式，不需要格式化
					  }
				  }
				 
				  
				  $tr.find("[data-id]").each(function(i,item){
					   $custom=$(item).data("custom");
					   fm=util.setAccounting(accounting,$custom);//获取当前行每列自定义格式化
					  curobj.push({"code":$(item).data("id"),"val":fm.unformat($(item).val())});
				  });
				  var sum=util.calculate(curobj,context.expression);
				  $(context.context.names).each(function(j,name){
					  var $input= $tr.find('input[data-id="'+name+'"]');
					  var $custom=$input.data("custom");
					  var fm=util.setAccounting(accounting,$custom);//小计金额格式化
					  $input.val(fm.formatMoney(sum));
					  var index=$input.closest("td").index()+1;
					  var total=0;
					  $current.closest("tbody").find("tr:not(:last) td:nth-child("+index+") input").each(function(i,v){
						  total+=fm.unformat($(v).val());
					  });
					  //总计格式化同小计与一列
					  var lasttr=$current.closest("tbody").find("tr:last");
					  if(lasttr.data("type")=="sumcol"){
						  var $totalcol= lasttr.find("td:nth-child("+index+")");
						  $totalcol.find("span").text(fm.formatMoney(total));
						  var $zj= $totalcol.find("input");
						  var oldValue=$zj.val();
						  $zj.attr("data-oldval",oldValue);//原值
						  $zj.val(total);//更新总计
						  var $operator=$zj.data("operators");//是否需要合并总计
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
					  }
					 
				  });
			  }
			  
		  });
		  //表单通用添加一行
		  $(document).on("click",".js-btn-addtr",function(e){
			  var $current=$(e.currentTarget);
			  var $custom=$current.data("custom");
			  
			  var tableid=$custom.tableid;
			  $container=$current.closest(".forms-content");
			  var $table=$container.find("#"+tableid);
			  var $tbody=$table.find("tbody");
			  var $tableconfig=$table.data("config");
			  var thead=$tableconfig.value[0].thead;
			  var template=Handlebars.compile($("#addtr-template").html());
			  $(thead).each(function(i,item){
				 
					 item.config=item.contentconfig;
					 if(item.config&&item.config.issequence){
						 item.val=$table.find("tr").length-1;
						 console.log(item.val);
					 }
					 item.customstr=JSON.stringify(item.custom);
					 if(item.key!="operate_col"){
						 if(item.operators){
								item.context=JSON.stringify(item.operators[0]);
						}
					 }else{
						 if(item.operators){
							 $(item.operators).each(function(o,operator){
								 operator.customstr=JSON.stringify(operator.params);
							 });
						 } 
					 }
					
			  });
			  var lasttr=$table.find("tr:last");
			  var html=template({"thead":thead});
			  if(lasttr.data("type")!="sumcol"){
				$(html).appendTo($tbody);
			  }else{
				  lasttr.before(html);  
			  }
			  
			  $table.find("select").select2({"height":20});
			  $table.validVal();
		  });
		  //表单通用计算删除当前行
		  $(document).on("click",".js-calculate-del",function(e){
			  var $current=$(e.currentTarget);
			  //重新合计
			  $tbody=$current.closest("tbody");
			  //删除当前行
			  $current.closest("tr").remove();
			  //获取最后一行
			  $lastTr=$tbody.find("tr:last");
			  //统计需要统计的列
			  seajs.use("commonevents",function(commonevents){
					commonevents.calculate_hj($tbody,$lastTr);
			 });
		  });
		  $(document).on("change",".js-calculate-hj",function(e){
			  var $current=$(e.currentTarget);
			  var $custom=$current.data("custom");
			  if($custom.symbol){//当前操作列是否需要格式化
				  var fm=util.setAccounting(accounting,$custom);//当前修改的金额格式化
				  var curval=fm.formatMoney(fm.unformat($current.val()));
				  $current.val(curval);
			  }
			  //重新合计
			  $tbody=$current.closest("tbody");
			  //获取最后一行
			  $lastTr=$tbody.find("tr:last");
			  //统计需要统计的列
			  seajs.use("commonevents",function(commonevents){
					commonevents.calculate_hj($tbody,$lastTr);
			 });
		  });
		  
		  $(document).on("change",".js-calculate-zj",function(e){
			  var $current=$(e.currentTarget);
			  var $custom=$current.data("custom");
			  var fm=util.setAccounting(accounting,$custom);//当前修改的金额格式化
			  var $container=$current.closest(".forms-content");
			  var $operator=$current.data("operators");
			  var oldval=fm.unformat($current.data("oldval"));
			  var curval=fm.unformat($current.val());
			  if($operator){
				  if($operator.context&&$operator.context.names){
					  $.each($operator.context.names,function(i,name){
						  var $zj=$container.find("#"+name);
						  var $custom=$zj.data("custom");
						  fm=util.setAccounting(accounting,$custom);//当前修改的金额格式化
						  if($zj){
							  var oldzj=fm.unformat($zj.val())==""?0:fm.unformat($zj.val());
							  if(oldzj==0){
								  $zj.val(fm.formatMoney(curval));
							  }else{
								  $zj.val(fm.formatMoney(oldzj-oldval+curval));  
							  }
						  }
						  
					  });
				  }
			  }
			  
		  });
	
		  $(document).on("click",".js-open-picker",function(e){
			  var $current=$(e.currentTarget);
			  //TODO  获取当前行tr数据
			  var $custom=$current.data("custom");
			  $custom.titlename=$current.data("title");
			  if($custom.pickerform.troption){
				  var $tr=$current.closest("tr");
				  $custom.troptionobj=$tr;
			  }
			  $custom.curcontainer=$current.parents(".forms-content");
			  //根据pickerform中的tableID区分刷新table,还是表单
			  if($custom.pickerform.tableid){
				  var $formtable=$("#"+$custom.pickerform.tableid);//table对象
				 
				  //获取表单配置信息
				  seajs.use("commonevents",function(commonevents){
					  	var $tableconfig=commonevents.getlasttableconfig($formtable);//获取最新的table配置数据
						$custom.tableconfig=$tableconfig;//刷新table时，需要更新table中对应的数据
						seajs.use("dynamicpicker",function(){
								new mdboss.View.dynamicPicker($custom);
						 });
				 });
			  }else{
				  //判断如果更新表单数据时
				  $custom.updateform=true;
					seajs.use("dynamicpicker",function(){
							new mdboss.View.dynamicPicker($custom);
					 });
			  }
			  
		  });
		  
		  $(document).on("focus",".js-simpleselectperson",function(e){
			  simpleselectuser(e);
		  });
		
		  $(document).on("keyup",".js-simpleselectperson",function(e){
			  if(e.which==13){
				  simpleselectuser(e);
			  }
		  });
		  $(document).on("click",".js_selectperson_radio",function(e){
	          	$(e.currentTarget).closest("ul").find("li").each(function(){
	          		var text=$.trim($(this).text());
	          		$(this).find("label span ").removeClass("next-step-checked").addClass("next-step-unchecked");
	          	});
	          	var $current=$(e.currentTarget);
	  			$current.removeClass("next-step-unchecked").addClass("next-step-checked");
	          }
		  );
		  $(document).on("click",".js_radio_selected",function(e){
			 var $current=$(e.currentTarget);
			 var $curcontainer=$current.parents(".forms-content");
			 var selectedval=$current.data("text");
			 var params=$current.data("params");
			 $(params).each(function(i,item){
				if(item.seltext==selectedval){
					$(item.attrs).each(function(j,attr){
						if(attr.isshow!=undefined){
							if(attr.isshow){
								$curcontainer.find("#"+attr.attr).show();
							}else{
								$curcontainer.find("#"+attr.attr).hide();
							}
						}
						if(attr.isedit!=undefined){
							if(attr.isedit){
								$curcontainer.find("#"+attr.attr).removeAttr("readonly");;
							}else{
								$curcontainer.find("#"+attr.attr).attr("readonly","readonly");
							}
						}
					});
				}
			 });
		  });
		
	};
	
	 module.exports = dynamicformevents;
});