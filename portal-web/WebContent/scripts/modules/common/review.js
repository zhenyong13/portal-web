/**
 * 文件预览
 * 使用方法
 * seajs.use("review",function(r){
        		 new mdboss.View.fileReview({model:new mdboss.Model.commonModel( 
//    	      			 {"filecode":baseConfig.avatar_url + "doc/test.doc"}
    	      			 {"filecode": ""}
    	           )});
        	});
 */
define(function (require, exports, module) {
    var mdboss = require("mdboss");
        $      = require("jquery");
    	Dialog = require("dialog");
//    	require("select2");
    	require("media");
    	require("Jcrop");
    	require("scroll");
    	
    /********************************** 文件预览 start****************************************************************/
	//视图 文件预览
	mdboss.View.fileReview = Backbone.View.extend({
				el : '#mainContainer',
				initialize : function() {
					this.baseUrl = "";
					this.render();
					this.jcrop_api;//图片截屏
					this.posArea={};//存放框选文本坐标区域
					this.isRespond=false;//是否可以提交并请求图文识别接口
					this.language="SimplifiedChinese";//默认选择简体中文识别语言
					this.typeCrop=null;
					
					
				},
				events:{
//					"click #templateName":"setRedHead",
					"click .js-copy-to-element":"copyToElement",//复制内容到某个字段
					"click #allImgCrop":"allImgCrop",//全文识别
					"click #startImgCrop":"startImgCrop",//框选文本
					"click #endImgCrop":"endImgCrop",//提交并识别框选文本
					"click .btnPanelIn":"btnPanelIn",
					"click .btnPanelOut":"btnPanelOut",
					"click .slidePanel ul li":"changePanel",
					"click .lanbox p a":"lanSelect",//选择识别语言
					"click .formIpt p a":"copyToForm"//复制到表单
				},
				copyToElement:function(e){
					var $this  = $(e.currentTarget);
					var eleid = $this.data("id");
					$("#"+eleid).val("哈哈"); //TODO 获取截取部门的文字内容
				},
//				setRedHead:function(e){//红头设置
//					var $this  = $(e.currentTarget);
//					var mdcode = $this.val();
//					this.renderData(mdcode);
//				},
//				renderSelect:function(){//获取红头模版
//					 var tmpCondition = new Array();
//			         tmpCondition.push({"key":"redheadname", "operate":"Like","v1":this.modulename});
//					mdboss.reqsubmit({"pageNo":1, "pageSize":0, "queryCondition":tmpCondition}, mdboss.api.redheadlist, function(m,res){
//						if(res.rc == 1){
//							var tmp = new Array();
//							var datar = res.data.rows;
////							for(var i=0; res.data.rows && i< res.data.rows.length; i++){
////								tmp.push('<option value="'+datar[i].filecode+'">'+datar[i].reddocname+'</option>');
////							}
////							$("#templateName").html(tmp.join(""));
//							
////							$("#templateName").select2({"width": "200","z-index":"1000"});
//						}else{
//							mdboss.error(res.msg);
//						}
//					});
//				},
//				renderData:function(mdcode){
//					var _this =this;
////					$.get(baseUrl+"vendor/pageoffice/fileReview.jsp?filecode="+filecode+"&md="+mdcode, function(html){
//					 $.get(_this.baseUrl+"redirect.jsp?filecode="+_this.filecode+"&md="+mdcode, function(html){
//						 $(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
//						 $(_this.dialog).find(".dialog-content-wrap").attr("style","");
//						 $(_this.dialog).find(".loading").removeClass("loading");
//						 _this.renderSelect();
//					 });
//				},
				render : function() {
		        	//文件预览
		        	var v_this = this;
		        	var filecode = v_this.model.get("filecode");//
		        	var reddoctype=v_this.model.get("reddoctype");
		        	var taskcode=v_this.model.get("taskcode");//任务编码 
		        	var processcode=v_this.model.get("processcode");//流程实例id
		        	var suffix=v_this.model.get("suffix");//文件后缀
		        	var fileperm=v_this.model.get("fileperm");//文件权限
		        	var baseUrl = v_this.model.get("baseurl");
		        	v_this.filecode = filecode;
		        	v_this.processcode =processcode;
		        	v_this.baseUrl = baseUrl;
		        	if(suffix == "jpg" || suffix == "png"|| suffix == "tiff"|| suffix == "jpeg"||suffix == "bmp"){//图片或TIFF文件
		        		v_this.renderFile();
		        	}else if(suffix == "pdf"){//pdf 文件

		        		new Dialog({
							type : "html", 
							value : '<div class="loading"></div>',
							fillCallback : function() {
								$(this).find(".scrollwrapper").jScrollPane();
							}
						}, {
							"title" : "文件预览", "width" : "900px", "height" : "600px","icon" : "iconfont icon-mdliucheng",
							full:true,
							btns: ['min','max','close'],
							layer:false,
							draggable:false,
							"resize" : function() {
								$(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
							}
						}).show(function(){							
							 var _this = this;
							 
							 $.get("fileReview.jsp?filecode="+filecode+"&fileperm="+fileperm+"&reddoctype="+reddoctype+"&filetype=pdf&taskcode="+taskcode, function(html){
								 $(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
								 $(_this.dialog).find(".dialog-content-wrap").attr("style","");
								 $(_this.dialog).find(".loading").removeClass("loading");
								 $(_this.dialog).find(".dialog-content").jScrollPane();
								 
								 $(_this.dialog).find(".imgRecognize").click(function(){
									 v_this.renderFile();
									 $(_this.dialog).find(".dialog-close").click();
								 })
							 });	 
						});
		        	}else{ 
		        		$.get(baseUrl+"vendor/pageoffice/redirect.jsp?filecode="+filecode+"&fileperm="+fileperm+"&reddoctype="+reddoctype+"&taskcode="+taskcode, function(html){
		        			$(html).appendTo(v_this.$el);
		        		});
		        	}
				},
				renderFile : function() {//文件预览 TODO
		        	var v_this = this;
		        	var filecode = v_this.model.get("filecode");
		        	var baseUrl =  v_this.model.get("baseurl");
		        	var suffix=v_this.model.get("suffix");//文件后缀
		        	var processcode=v_this.model.get("processcode");
		        	
		        	console.log("filecode="+filecode+"===suffix:"+suffix);
		        	
		        	v_this.textareaHeight();
		        	v_this.dialog = new Dialog({
						type : "html", 
						value : '<div class="loading"></div>',
						fillCallback : function() {
							$(v_this.dialog).find(".scrollwrapper").jScrollPane();
						}
					}, {
						"title" : "图片识别操作", "width" : "900px", "height" : "600px","icon" : "iconfont icon-mdliucheng",
						full:true,	btns: ['close'], layer:false,draggable:false,
						"resize" : function() {
							$(this.dialog).find(".scrollwrapper,.jscroll").jScrollPane();
						}
					}).show(function(){//
						 var template = Handlebars.compile(require("text!template/page/common/review.html"));
						 var html = template({"filecode":filecode, "baseUrl":baseUrl, "suffix":suffix});
						 var _this = this;
						 $(html).appendTo($(_this.dialog).find(".dialog-content")).fadeIn();
						 $(_this.dialog).find(".dialog-content-wrap").attr("style","");
						 $(_this.dialog).find(".loading").removeClass("loading");
						 $('#tranTxt').autoHeight();
						 
						 if(suffix == "tiff"){//tiff格式图片后端需处理成jpg格式
							 var ListParam={};
							 var nFiles={};
							 nFiles.filecode=filecode;
						 	 ListParam.usercode=mdboss.usercode;
						 	 ListParam.filecodes=[nFiles];
			
						 	 var imgListData=new mdboss.Model.commonModel();
						 	 imgListData.save(ListParam,{url:mdboss.api.queryrelatefile,success:function(m,res){
		                		 var dataObj=res.data.rows;
		                		 var listData=listEle='';
		                		 if(dataObj){
			                		 for(key in dataObj){
			                			 if(dataObj[key].filecode&&dataObj[key].filecode==filecode){
			                				 listData=dataObj[key].relatefilecode;
			                				 for(val in listData){
			                					 if(listData[val].filecode){
				                					 if(val==0){
				                						 listEle+='<li class="onShow"><img src="'+baseUrl+'download?filecode='+listData[val].filecode+'" filecode="'+listData[val].filecode+'" seqno="'+listData[val].seqno+'"/></li>';
				                					 }else{
				                						 listEle+='<li><img src="'+baseUrl+'download?filecode='+listData[val].filecode+'" filecode="'+listData[val].filecode+'" seqno="'+listData[val].seqno+'"/></li>';
				                					 } 
			                					 }
			                				 }
			                			 }
			                		 }
		                		 }
		                		 
		                		 _this.$html.find(".slidePanel ul").empty().append(listEle);
		                		 $(".slidePanel,#operPanel .inrPanel").jScrollPane();
		                		 
		                		 var w_wid=$(window).width()-470;
								 v_this.loadView(w_wid);//初始化载入首次图片
								 $(".slidePanel ul li.onShow").click();
		                	 }});
						 }else{
							 _this.$html.find(".slidePanel ul").empty().append('<li class="onShow"><img src="'+baseUrl+'download?filecode='+filecode+'" filecode="'+filecode+'" seqno="1"/></li>');
	                		 $(".slidePanel,#operPanel .inrPanel").jScrollPane();
	                		 var w_wid=$(window).width()-470;
							 v_this.loadView(w_wid);//初始化载入首次图片
							 $(".slidePanel ul li.onShow").click();
						 }
	                	 
	                	 
					 	 //查询数据 复制到的标签
	                	 var formData=new mdboss.Model.commonModel();
	                	 formData.save({"usercode":mdboss.usercode,"processcode":processcode},{url:mdboss.api.processdefLoad,success:function(m,res){
	                		 var formIpt='';
	                		 if(res.data.formdata){
		                		 for(key in res.data.formdata){
		                			 if(res.data.formdata[key].type=="text"||res.data.formdata[key].type=="textarea"){
		                				 if(res.data.formdata[key].name){
		                					 formIpt+='<a class="btn btn-sm js-copy-to-element" data-id="'+key+'">'+res.data.formdata[key].name+'</a>';
		                				 }
		                			 }
		                		 }
	                		 }
	                		 
	                		 $(".formIpt p").empty().append(formIpt);
	                	 }});
	 
					});
		        	this.$el = v_this.dialog.$html;
		        	
		        	v_this.delegateEvents();//Model渲染清空Events，需重新触发绑定Events,不能删，否则events绑定的事件失效
				},
				loadView:function(wid){//wid大图的宽度
					var hei=$(window).height()-70;
					var _height=hei-20;
					console.log(this);

		        	$(".slidePanel,.inrPanel,#operPanel").height(hei);
		        	$("#cropImg").attr("style","width:"+wid+"px;height:"+_height+"px");
				},
				allImgCrop:function(e){
					var _this=this;
					_this.isRespond=true;
					_this.typeCrop=0;
					$(e.currentTarget).addClass("readOn").siblings(".btn").removeClass("readOn");
				},
				startImgCrop:function(e){
					  var _this=this;
					  _this.isRespond=true;
					  _this.typeCrop=1;	
					  $(e.currentTarget).addClass("readOn").siblings(".btn").removeClass("readOn");
			
					  $('#cropImg img').Jcrop({
					    onChange: showCoords,
					    onSelect: showCoords
					  }, function(){
						  _this.jcrop_api = this;
					  });
					  
					  $('#coords').on('change','input',function(e){
					    var x1 = $('#x1').val(),x2 = $('#x2').val(),y1 = $('#y1').val(),y2 = $('#y2').val();
					    _this.jcrop_api.setSelect([x1, y1, x2, y2]);
					  });
	  
					function showCoords(c){
					  _this.posArea.X1=c.x;
					  _this.posArea.Y1=c.y;
					  _this.posArea.X2=c.x2;
					  _this.posArea.Y2=c.y2;
					};
				},
				endImgCrop:function(e){
					
					if(!this.isRespond){
						new Dialog({},{
							"title" : "提示框",
							"width" : "310px", 
							"height" : "100px",
							btns: ['close'], 
							draggable:false
						}).show(function(){
							this.$html.find(".dialog-content").html("<div style='background:#fff;width:100%;text-align:center;padding:15px 0;font:14px/26px microsoft yahei;'>至少选择一种识别操作</div>");
						});
						
						return;
					}

					if(!this.posArea.X1&&this.typeCrop==1){
						new Dialog({},{
							"title" : "提示框",
							"width" : "310px", 
							"height" : "100px",
							btns: ['close'], 
							draggable:false
						}).show(function(){
							this.$html.find(".dialog-content").html("<div style='background:#fff;width:100%;text-align:center;padding:15px 0;font:14px/26px microsoft yahei;'>亲，您还没框选文本呢</div>");
						});
						
						return;
					}
					
					
					this.isRespond=false;

					var param={};
					var picObj={};
					var commonModel=new mdboss.Model.commonModel();
					param.usercode=mdboss.usercode;
					picObj.language=this.language;
					picObj.seqno=$("#cropImg img").attr("seqno");
					picObj.filecode=$("#cropImg img").attr("filecode");
					
					if(this.typeCrop==1){
						this.jcrop_api.destroy();
						picObj.x1=this.posArea.X1;
						picObj.y1=this.posArea.Y1;
						picObj.x2=this.posArea.X2;
						picObj.y2=this.posArea.Y2;
					}
					param.picturerecognition=[picObj];
					

					//框选文本识别
					if(this.typeCrop==1){
	               	    commonModel.save(param,{url:mdboss.api.picturearearecognition,success:function(m,res){
	               	        $("#tranTxt").val(res.data.rows[0].outputstring);
	               	    }});
					}
               	    
               	    //全文识别
					if(this.typeCrop==0){
	            	    commonModel.save(param,{url:mdboss.api.picturerecognition,success:function(m,res){
	            	        $("#tranTxt").val(res.data.rows[0].outputstring);
	            	    }});
					}
					
					this.posArea={};//重置框选坐标区域
					this.typeCrop=null;	
					$(e.currentTarget).closest(".boxView").find("btn").removeClass("readOn");
				},
				btnPanelIn:function(){		
					var _this=this;
					$("#operPanel").animate({right:"-250px"},300,function(){
						$("#btnPanel").attr("class","btnPanelOut").find("i").attr("class","icon-angle-left");
						var w_wid=$(window).width()-220;
						_this.loadView(w_wid);
					});
				},
				btnPanelOut:function(){
					var _this=this;
					$("#operPanel").animate({right:"0px"},300,function(){
						$("#btnPanel").attr("class","btnPanelIn").find("i").attr("class","icon-angle-right");
						var w_wid=$(window).width()-470;
						_this.loadView(w_wid);
					});
				},
				changePanel:function(e){
					var $this  = $(e.currentTarget);
					var index=$this.index();
					var imgHtml=$(".slidePanel ul li").eq(index).html();
					$this.addClass("onShow").siblings().removeClass("onShow");
					$("#cropImg").html(imgHtml);
					
				},
				textareaHeight:function(){//textarea高度自适应拓展方法
					$.fn.autoHeight = function(){
						function autoHeight(elem){
							elem.style.height = 'auto';
							elem.scrollTop = 0; //防抖动
							elem.style.height = elem.scrollHeight + 'px';
						}
						
						this.each(function(){
							autoHeight(this);
							$(this).on('keyup', function(){
								autoHeight(this);
							});
						});

					};
				},
				lanSelect:function(e){
					var $this = $(e.currentTarget);
					$this.addClass("onLan").siblings().removeClass("onLan");
					this.language=$this.data("language");
				},
				copyToForm:function(e){
					var $this = $(e.currentTarget);
					var id=$this.data("id");
					var transContent=$("#tranTxt").val();
					if(transContent==''){
						new Dialog({},{
							"title" : "提示框",
							"width" : "310px", 
							"height" : "100px",
							btns: ['close'], 
							draggable:false
						}).show(function(){
							this.$html.find(".dialog-content").html("<div style='background:#fff;width:100%;text-align:center;padding:15px 0;font:14px/26px microsoft yahei;'>亲，识别文本还是空的！</div>");
						});
						
						return;
					}
					$("#"+id).val(transContent);
				}
			});

	/********************************* 文件预览 end****************************************************************/
});