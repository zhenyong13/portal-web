define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     require("select2");
     Dialog = require("dialog");
	
     mdboss.View.demoedit = Backbone.View.extend({
         initialize:function(data){
        	 _this=this;
        	 _this.tid=data.tid;
        	 _this.dialog=new Dialog({
                 type: "html",
                 value: '<div class="loading"></div>',
                 fillCallback:function(){
                     $(this.dialog).find(".jscroll").jScrollPane({"autoReinitialise": true});
                 }
             }, {"title":"修改记录","width":"850px","height":"200px","icon":"iconfont icon-mdliucheng","resize":function(){
                 }}).show(function(){
                	 var dialog=this;
                	 var commonModel=new mdboss.Model.commonModel();
                	 commonModel.save({"tid":_this.tid},{url:mdboss.api.demodetail,success:function(model,res){
                		 	if(res.rc==1){
                		 		 var template=Handlebars.compile(require("text!../../../template/page/demo/edit.html"));
                		 		 var html=template(res.data);
                		 		 dialog.$html.find(".dialog-content").html(html).fadeIn();
                		 		$("select").select2({"width":200});//select2单选
                		 		$("select[multiple]").select2({"width":500});//select2多选
                		 	}else{
                		 		 mdboss.notifyTips("获取数据失败！");
                		 	}
                	 },error:function(){
                		 mdboss.error();
                	 }});
                	
                	 
             }); 
        	 this.$el = _this.dialog.$html;
         },
         events: {
        	 'click #submit':'submit',//提交
        	 'click #cancel':'cancel',//取消
        	 'click .js_search_dept':'selected_dept',//选择部门
        	 'click .js_select_person':'selected_person'
         },
         selected_person:function(e){
        	 _this=this;
        	 mdboss.selectedperson({"callbacks":_this.selpersoncallback});
         },
         selpersoncallback:function(data){
    	 	var template=Handlebars.compile($("#sel-personshow-template").html());
    		$(".selected_person_show").html(template({"persons":data}));
         },
         selected_dept:function(e){
        	 _this=this;
        	 var dept_arr=new Array();
 	        seajs.use("orgs", function () {
 	        	var $seldept=$(".selected_dept_show .file-show a:first-child");
 	        	$seldept.each(function(index,item){
 	         		dept_arr.push($(item).attr("did"));
 	         	});
 	        	new mdboss.View.orgsView({dept:dept_arr,parent:_this.$el});
 	        });
         },
         submit:function(e){
        	 _this=this;
        	 var tid=$("#tid").val();
        	 var name=$("#name").val();
        	 var sex=$("#sex").val();
        	 var commonModel=new mdboss.Model.commonModel();
        	 mdboss.confirm("确定要修改吗？",function(c){
        		 if(c){
        			 commonModel.save({"usercode":mdboss.usercode,"tid":tid,"name":name,"sex":sex},{url:mdboss.api.demobatchdel,success:function(model,res){
                		 if(res.rc==1){
                			 mdboss.notifyTips("修改成功！");
                			 Backbone.history.loadUrl();
                			 _this.cancel();
                		 }else{
                			 mdboss.notifyTips(res.msg);
                		 }
                	 },error:function(){
                		 mdboss.error();
                	 }});
        		 }
        	 })
         },
         cancel:function(){
        	 _this=this;
        	 _this.dialog.close();
 		},
     });
});