define(function(require, exports, module) {
	var $ = require("jquery");
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
//	require("tree")($);
	require("daterangepicker_moment");
	require("daterangepicker");
	require("validVal")($);
//	require("mCustomScrollbar");
	require("select2");
	require("projecttree");
	
	mdboss.View.projectaddView = Backbone.View.extend({
		 el: "#rightMainContainer",
		 initialize: function (data) {
			 this.rdata = data;
			 this.projecttree_template = require("text!template/page/project/config/projecttree.html");
			 mdboss.fillPage(require("text!template/page/project/projectadd.html"));
			 
			 this.$el.find("#project-arctect").append(this.projecttree_template);
//			 var defaultNodeTemp=Handlebars.compile($("#architect-defaultNode-template").html());//项目架构默认节点模版
			 
//			 this.$el.find(".project-operate-profess").closest("li").before(defaultNodeTemp);			 
			 this.projecttree = new mdboss.View.projecttreeView({"manager":true});//初始化时，实例化方法
			
			 //{}
			 this.$el.find("#startendtime").daterangepicker();
			 this.$el.find("select").select2({width:'42%'});
			 this.$el.find( ".forms-content" ).validVal();
			 this.render();
			 this.newForm();
		 },
		 newForm:function(e){//取消提交
        	 var r_this = this;
//        	 r_this.$el.find("#tid").val("");
//        	 r_this.$el.find("#architectcode").val("");
//        	 r_this.$el.find("#architectname").val("");
//        	 r_this.$el.find(".add-project-newproject").text("新增项目架构");
//        	 r_this.$el.find("project_profess_list a:gt(0)").removeClass("active");
//        	 r_this.dataset("" );
//        	 r_this.$el.find(".project-arctect-ul li").each(function(i, item){
//        		 if($(item).find(".project-operate-profess").length<1){
//        			 $(item).remove();
//        		 }
//        	 });
        	 var profess=new Array();
        	 var uuid = mdboss.getuuid();
        	 profess.push({ "orgcode": uuid, "orgname": "项目架构", "parentcode": "-1" });//
        	 profess.push({ "orgcode": mdboss.getuuid(), "orgname": "分管院领导", "orgtype":"r", "parentcode": uuid });//
        	 profess.push({ "orgcode": mdboss.getuuid(), "orgname": "分管总工", "orgtype":"r", "parentcode": uuid });//
        	 profess.push({ "orgcode": mdboss.getuuid(), "orgname": "项目助理", "orgtype":"r",  "parentcode": uuid });//
        	 r_this.projecttree.editArchitectTree({"profess":profess,"isNew":true,"manager":true});
         },
		 render:function(){
			 var project = this.rdata;
			 if(project && project.projectcode){
				 this.$el.find("#tid").val(project.id);
				 this.$el.find("#projectcode").val(project.projectcode);
				 this.$el.find("#name").val(project.projectname);
				 this.$el.find("#manager").attr("data-code",project.managercode);
				 this.$el.find("#manager").val(project.managercode);
				 this.$el.find("#startendtime").val(project.planstarttime+" 至 "+project.planendtime);
				 this.$el.find("#birthplace").val(project.foundplace);
				 this.$el.find("#intro").val(project.description);
				 console.log(project.filecode);
				 if(project.filecode){ //项目图片
					 var fileview = $("#file_view_template").html();//TODO
					 var tiptepl =Handlebars.compile(fileview);//
					 console.log({"baseurl": baseConfig.avatar_url, "filecode": project.filecode});
					 var html = tiptepl( {"baseurl": baseConfig.avatar_url, "filecode": project.filecode});
					 this.$el.find("#feedbackUpload-showfiles").html( html );
					 console.log(html);
				 }
				 
				 this.dataset(project.category, project.projectlevel);
				 this.architectedit(project.projectcode);
			 }else{
				 this.dataset();
			 }
		 },
		 dataset:function(projecttype, level){
			 mdboss.dataselect(this, "projecttype", "PM_PROJECTCATEGORY",projecttype,"205");
			 mdboss.dataselect(this, "level", "#PM_PROJECTPHASE",level,"205");
         },
		 events:{
			 "click #start_end_time":"projectdetail", //项目详情
			 "click .js-addporject":"addproject",
//			"change #manager":"updatemanager",//更新负责人
			
			 "focus #manager":'mangerselect1',//搜索负责人
        	 "keyup #manager":'mangerselect1',//搜索负责人
			
			"change #projecttype":"updateprojecttype",//更新项目类型
			"click .js-saveproject":"saveproject",//保存项目
			
			 "click .js_file_view":"file_view",//文件查看 
        	 "change .js_fileupload_":'filecodeUpload',//文件上传上传
        	 "click .js_del_file":'deletefile',//删除
		 },
		 deletefile:function(e){
			 $(e.currentTarget).closest(".file-show").remove();//删除文件
		 },
		 file_view:function(e){
	         	var filecode=$(e.currentTarget).data("file-id");
	         	seajs.use("review", function () {
	         		new mdboss.View.fileReview({model:new mdboss.Model.commonModel( 
	    	      			 {"filecode":filecode,"baseurl":baseConfig.base}
	    	           )});
	         	});
         },
         filecodeUpload:function(e){
//	        	 var v_this = this;
	        	 var $this  = $(e.currentTarget);
	        	 var id = $this.attr("id");
//	        	 var dataid = $this.attr("data-id");
	        	 var allowExtention = ".png,.gif,.jpg,jpeg";
				  var filepath=$("#"+id).val();
				  var ext=filepath.substring(filepath.lastIndexOf(".")).toLowerCase();
				  if(allowExtention.indexOf(ext)!=-1){
		        	 mdboss.fileupload(id, function(json){
		        		 if(json!=undefined){
	                  		 if(json.length!=undefined){
	                  			 $(json).each(function(index,item){
	                            		var html=new Array();
	    								html.push('<span class="file-show" data-name="'+item.name+'" data-code="'+item.id+'">');
	    								html.push('<a  class="filename_view  js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
	    								html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="file_view fa fa-download" target="_blank"></a>');
	    								html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
	    								html.push('</span>');
	    		                    	$("#feedbackUpload-showfiles").append(html.join(''));
	                            	});
		                         }else{
		                        	 item=json;
		                        	var html=new Array();
									html.push('<span class="file-show" data-name="'+item.name+'" data-code="'+item.id+'">');
									html.push('<a  class="filename_view  js_file_view" data-file-id="'+item.id+'">'+item.name+'</a>');
									html.push('<a href="'+baseConfig.avatar_url+item.id+'" class="file_view fa fa-download" target="_blank"></a>');
									html.push('<a data-fileid="'+item.id+'" class="close_file js_del_file file_remove_file" title="删除">×</a>');
									html.push('</span>');
			                    	$("#feedbackUpload-showfiles").append(html.join(''));
		                    }
	                   }else{
	                  	 mdboss.notifyTips("文件上传失败！");
	                   }
		        	 });
				  }else{
					  mdboss.error("上传文件类型不正确!");
				  }
	         },
		 architectedit:function(projectcode ){//项目编辑 ,获取配置好的架构树
				var proj=this;
				proj.$el.find("#project-arctect").empty();
				
				if(projectcode){
					this.$el.find("#project-arctect").append(this.projecttree_template);

					mdboss.submit({"orgcode":projectcode}, mdboss.api.projectarchitectedit, function(res){
						if(res.rc == 1){
							proj.projecttree.editArchitectTree({"profess":res.data.rows});
						}else{
							mdboss.error(res.msg);
						}
					}, true, null);
				}else{
					return ;
				}
			 },
		 updateprojecttype:function(e){
			var $current=$(e.currentTarget) ;
			var typeId=$current.val();
			var pjthis= this;
			
			this.$el.find("#project-arctect").empty();
			this.$el.find("#project-arctect").append(this.projecttree_template);
//			var defaultNodeTemp=Handlebars.compile($("#architect-defaultNode-template").html());//项目架构默认节点模版
//			this.$el.find(".project-operate-profess").closest("li").before(defaultNodeTemp);

			if(typeId){
				mdboss.submit({"category":typeId}, mdboss.api.projectarchitectview, function(res){
					if(res.rc == 1){
						pjthis.projecttree.editArchitectTree({"profess":res.data.rows,"isNew":true});
					}else{
						mdboss.error(res.msg);
					}
				}, true, null);
			}else{
				this.newForm();
			}
		 },
		 saveproject:function(e){
			var proj_this=this;
			var $container= proj_this.$el;
			var formdata=$container.find( ".forms-content" ).triggerHandler( "submitForm" );
			if(formdata){
				var projecttype=$container.find("#projecttype").val();
				var projectname=$container.find("#name").val();
				var projectmanager=$container.find("#manager").data("code");
				var startendtime=$container.find("#startendtime").val();
				var level=$container.find("#level").val();
				var birthplace=$container.find("#birthplace").val();
				var intro=$container.find("#intro").val();
				var projectcode=$container.find("#projectcode").val();
				var tid=$container.find("#tid").val();
				
				var projectpicture = proj_this.$el.find("#feedbackUpload-showfiles span:eq(0)").data("code"); //项目图片
	        	
				var data={};
				data.usercode=mdboss.usercode;
				if(tid){
					data.tid=tid;
					data.projectcode=projectcode;
				}
				if(projectpicture){
					data.filecode = projectpicture;
				}
				
//				data.oprtype="finish";
				data.category=projecttype;
				data.projectname=projectname;
				data.managercode=projectmanager;
				data.projectlevel=level;
				
				data.foundplace=birthplace;
				data.description=intro;
				
				console.log(startendtime);
				if(startendtime){
					var tmp = startendtime.split("至");
					data.planstarttime=$.trim(tmp[0]);
					data.planendtime=$.trim(tmp[1]);
				}
//				 
				data.orgs = proj_this.projecttree.getArchitectData();
				
				
				mdboss.submit(data,mdboss.api.projectadd,function(res){
					if(res.rc==1){
						 mdboss.alert("添加成功!");
						 Backbone.history.loadUrl();
					 }else{
						 mdboss.error(res.msg);
					 }
				} ,true, null);
			}else{
				mdboss.alert("必选项不能为空！");
				return ;
			}
			
		 },
		 mangerselect1:function(e){////搜索管理员 
        	 var p_this = this;
        	 mdboss.userselect(e, p_this, function(pview, usercode, name){
        		 p_this.$el.find("#showmanager").text(name);
        		 p_this.$el.find("#showmanager").attr("data-code",usercode);
        	 },false); 
         },
//		 updatemanager:function(e){
//			var pa_this=this;
//			var $current=$(e.currentTarget);
//			pa_this.$el.find("#showmanager").text($current.val());
//			pa_this.$el.find("#showmanager").attr("data-code",$current.attr("data-code"));
//		 },
		 projectdetail:function(e){
			alert("projectdetail");
		 }
	
	});

});