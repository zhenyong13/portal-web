define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("validVal")($);
     require("select2");
     require("mCustomScrollbar");
     Dialog = require("dialog");
     
     //模块函数
     exports.assestseditFunc=function(data){
		new mdboss.View.assestsedit(data);
     };
     
	
     mdboss.View.assestsedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 //传入的参数
        	 _this.rdata=data;
        	 _this.ueditor=null;
        	 this.filecode="";
        	 //标题
        	 if(data.title == "add"){
        		 this.title="新增资产";
        		 this.height = "380px";
        	 }else if(data.title == "edit"){
        		 this.title="编辑资产";
        		 this.height = "390px";
        	 }else if(data.title == "view"){
        		 this.title="资产详情";
        		 this.height = "400px";
        	 }else if(data.title == "batch"){
        		 this.title="批量修改资产";
        		 this.height="250px";
        	 }else{
        		 this.title="";
        		 this.height="230px";
        	 }
        	 //模版页面
        	 this.view_html = require("text!template/page/fund/assests/view.html");
        	 this.edit_html = require("text!template/page/fund/assests/edit.html");
        	 this.batchedit_html=require("text!template/page/fund/assests/batchedit.html");
        	 
        	 _this.dialog=new Dialog({
                 type: "html",  value: '<div class="loading"></div>', 
                 fillCallback:function(){ $(_this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});   }
             }, {"title":_this.title ,"width":"900px","height":_this.height,"icon":"iconfont icon-mdliucheng",
            	 full:false, layer:true,btns: ['min','max','close'],
            	 "resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 if(_this.rdata.tid){//编辑
	                	 var reqData = new Array();
	                	 reqData.push( {"name" : "assestsview", "post" : { "usercode":mdboss.usercode, "tid":_this.rdata.tid },cache:false });
	
	                     mdboss.getReady({ data: reqData , template: [] }, function (result, msg) {
	                         if (result) {
	                        	 var resData = result.data["assestsview"];
                 		 		if(_this.rdata.view){//详情
                 		 			var templateA=Handlebars.compile(_this.view_html);
                 		 			resData.baseurl=baseConfig.avatar_url;
                 		 			var html=templateA(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 		}else{//编辑
                 		 			var template=Handlebars.compile(_this.edit_html);
                 		 			resData.baseurl=baseConfig.avatar_url;
                 		 			var html=template(resData);
                 		 			dialog.$html.find(".dialog-content").html(html).fadeIn();
                 		 			_this.dataselect(resData.assesttype, resData.isenabled);
                 		 			$( "#module_form" ).validVal();
                 		 		}   
	                         } 
	                         else {
	                         	mdboss.error(msg);
	                         }
	                     });
                	 }else{//新增
                		 var template=null;
        		 		 if(_this.rdata.tids){//批量修改
        		 			 template=Handlebars.compile(_this.batchedit_html);
        		 			 var html=template({ });
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 _this.dataselect();
        		 		 }else{
        		 			 template=Handlebars.compile(_this.edit_html);
        		 			 
        		 			var html=template({"creator":mdboss.getUserinfo().username, "createtime":mdboss.getDate()});
	           		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
	           		 		 _this.dataselect();
        		 			 $( "#module_form" ).validVal();
        		 		 }
        		 		 // 
                	}
             }); 
        	 this.$el = _this.dialog.$html;
         },
         dataselect:function(assesttype,  isenabled){//下拉列表数据获取
        	 mdboss.dataselect(this, "assesttype", "CM_ASSETTYPE",assesttype);
        	 mdboss.dataselect(this, "isenabled", "COMMON_STATE",isenabled);
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_dept':'selected_dept',//选择部门
        	 "focus #leader_man":'delegateMan',//搜索委托人
        	 "keyup #leader_man":'delegateManKey',//搜索委托人
        	 "click .js_file_view":"file_view",//文件查看 
        	 "change .js_fileupload_":'filecodeUpload',//文件上传上传
         },
         delegateManKey:function(e){//回车搜索
          	if(e.which ==13){
          		this.delegateMan(e);
          	}
          },
          delegateBack:function(pview, usercode, name){
         	 pview.$el.find("#assestsmanager").val(usercode);
          },
          delegateMan:function(e){
         	 mdboss.userselect(e, this, this.delegateBack);
          },
         filecodeUpload:function(e){
        	 var v_this = this;
        	 var $this  = $(e.currentTarget);
        	 var id = $this.attr("id");
        	 var dataid = $this.attr("data-id");
        	 var allowExtention = ".png,.gif,.jpg,jpeg";
			  var filepath=$("#"+id).val();
			  var ext=filepath.substring(filepath.lastIndexOf(".")).toLowerCase();
			  if(allowExtention.indexOf(ext)!=-1){
	        	 mdboss.fileupload(id, function(data){
	        		mdboss.alert("上传成功!");
	        		 if(data instanceof Array){
	        			 if(data && data.length){
		        			 $.each(data, function(i, item){
		        				 if(i == 0){
		        					 $("#"+dataid).val(item.id);
		        					 v_this.$el.find("#"+dataid+"img").attr("src", baseConfig.avatar_url+""+item.id);
		        					 return true;
		        				 }
		        			 });
		        		 }
	        		 }else{
	        			 $("#"+dataid).val(data.id);
    					 v_this.$el.find("#"+dataid+"img").attr("src", baseConfig.avatar_url+""+data.id);
	        		 }
	        		 
	        	 });
			  }else{
				  mdboss.error("上传文件类型不正确!");
			  }
         },
         selected_dept:function(){
        	 _this=this;
        	 var dept_arr=new Array();
 	         seajs.use("orgs", function () {
 	        	if(_this.$el.find("#parentcode").val() != ""){
 	        		dept_arr.push(_this.$el.find("#parentcode").val());
 	        	}
 	        	new mdboss.View.orgsView({dept:dept_arr,parent:_this.$el,"selectOnly":true,
 	        		"callbacks":_this.searchByOrg,"pview":_this,"title":"组织选择"});
 	        });
         },
         searchByOrg:function(treeNode, parent, pview){
        	 if(treeNode.id =="org--1"){
        		 parent.find("#parentcode").val("");
        		 parent.find("#parentname").val("");
        	 }else{
        		 parent.find("#parentcode").val(treeNode.id);
        		 parent.find("#parentname").val(treeNode.name);
        	 }
         },
         file_view:function(e){
         	var filecode=$(e.currentTarget).data("file-id");
         	seajs.use("review", function () {
         		new mdboss.View.fileReview({model:new mdboss.Model.commonModel( 
    	      			 {"filecode":filecode,"baseurl":baseConfig.base}
    	           )});
         	});
         },
         submit:function(e){//提交
        	 _this=this;
        	 var tids = _this.rdata.tids;
        	 var form_data = true;
    		 if(tids){
    		 }else{
    			 form_data = $( "#module_form" ).triggerHandler( "submitForm" );
    		 }
 	         if ( form_data ) {
	        	 var tid=_this.$el.find("#tid").val();
	        	 var brand=_this.$el.find("#brand").val();
	        	 var assesttype=_this.$el.find("#assesttype").val();
	        	 var model=_this.$el.find("#model").val();
	        	 var unit=_this.$el.find("#unit").val();
	        	 var assestscode=_this.$el.find("#assestcode").val();
	        	 var specification=_this.$el.find("#specification").val();
	        	 var isenabled=_this.$el.find("#isenabled").val();
	        	 var memo=_this.$el.find("#memo").val();
	        	 var serialno=_this.$el.find("#serialno").val();
	        	 var price=_this.$el.find("#price").val();
	        	 var assestname=_this.$el.find("#assestname").val();
	        	 
	        	 if(serialno);else serialno= null; //
	        	 if(assesttype);else assesttype= null; //
	        	 if(brand);else brand= null; //
	        	 if(assestscode);else assestscode= null; //
	        	 if(model);else model= null; //
	        	 if(unit);else unit= null; //
	        	 if(specification);else specification= null; //
	        	 if(isenabled);else isenabled= null; //
	        	 if(memo);else memo= null; //
	        	 if(assestname);else assestname= null; //
	        	 if(price);else price= null; //
	        	 
	        	 var callback = _this.rdata.renderData;
	        	 var req = {};
	        	 if(tids){
	        		 req.usercode= mdboss.usercode;
	        	 }else{
	        		 req={"usercode":mdboss.usercode,"serialno":serialno, "isenabled":isenabled, "model":model,"brand":brand,
	        				 "specification":specification, "unit":unit,"assesttype":assesttype,"price":price,"assestname":assestname,
	        				 "memo": memo,"assestscode": assestscode, };
	        	 }
	        	 
	        	 //新增,修改
	        	 var url = mdboss.api.assestsadd;
	        	 if(tid){
	        		 url =mdboss.api.assestsedit;
	        		 req.tid = tid;
	        	 }else{
//	        		 req.creator = mdboss.usercode;
//    				 req.createtime = mdboss.getDate();
	        	 }
	        	 if(tids){
	        		 req.tids = tids;
	        		 url =mdboss.api.assestsbatchedit;
	        		 if(assesttype)  req.assesttype = assesttype;
	        		 if(isenabled)  req.isenabled = isenabled;
	        		 if(brand)  req.brand = brand;
	        		 if(unit)  req.unit = unit;
	        		 if(specification) req.specification = specification;
	        	 }
	        	 var commonModel=new mdboss.Model.commonModel();
				 commonModel.save(req, {url:url,success:function(model,res){
	        		 if(res.rc==1){
	        			 if(tid){
	        				 mdboss.notifyTips("修改成功！");
	        			 }else{
	        				 mdboss.notifyTips("新增成功！");
	        			 }
	        			 //回调刷新列表
	        			 var callbackFn = typeof callback == "function" ? callback : function () { };
	        			 callbackFn(_this.rdata.pview);
	        			 _this.cancel();
	        		 }else{
	        			 mdboss.error(res.msg);
	        		 }
	        	 },error:function(){
	        		 mdboss.error();
	        	 }});
 	        }
         },
         cancel:function(){
        	 _this=this;
        	 _this.dialog.close();
 		},
     });
});