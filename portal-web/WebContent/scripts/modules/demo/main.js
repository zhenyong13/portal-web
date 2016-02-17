define(function (require, exports, module) {
	 var mdboss = require("mdboss");
     $      = require("jquery");
     require("pagination");
     Dialog = require("dialog");
     
     mdboss.View.demo = Backbone.View.extend({
         el: '#mainContainer',
         initialize:function(){
        	 _this=this;
        	 _this.pageNo=1;
        	 _this.totalPage=5;
        	 _this.condition=null;
        	 _this.render();
         },
         events: {
//        	 'click #query_pagination li':'page',//分页
        	 'click #check-all':'checkall',//全选
        	 'click #batch-del':'batchdel',//批量删除
        	 'click #batch-update':'batchupdate',//批量修改
        	 'click #data-export':'dataexport',//导出
        	 'click .js_edit':'dataedit',
        	 "click .js_view":"dataview",
        	 'click .js_del':"datadel",
        	 'click #flow-list li span.js-check-box i':'checkbox',//checkobx 选中取消
        	 
         },
         datadel:function(e){
        	 var tid=$(e.currentTarget).data("tid"); 
        	 var commonModel=new mdboss.Model.commonModel();
        	 mdboss.confirm("确定要删除吗？",function(c){
        		 if(c){
        			 commonModel.save({"tid":tid},{url:mdboss.api.demobatchdel,success:function(model,res){
             		 	if(res.rc==1){
             		 		mdboss.notifyTips("删除成功！");
             		 	}else{
             		 		mdboss.notifyTips("删除数据失败！");
             		 	}
             	 },error:function(){
             		 mdboss.error();
             	 }});
        	  }
        	});
        	
         },
         dataview:function(e){
        	 var tid=$(e.currentTarget).data("tid"); 
        	 seajs.use("demoview", function () {
        		 new  mdboss.View.demoview({"tid":tid});
        	 });
         },
         dataedit:function(e){
        	var tid=$(e.currentTarget).data("tid"); 
        	 seajs.use("demoedit", function () {
        		 new  mdboss.View.demoedit({"tid":tid});
        	 });
         },
         dataexport:function(){
        	_this=this;
        	seajs.use("sign_export", function () {
        		new mdboss.View.signExport({condition:_this.condition});
        	 });
         },
         getTids:function(){
        	 var tids=new Array();
        	 $("#flow-list").find("li  i.icon-checkbox-checked").each(function(index,item){
        		 tids.push($(item).data("id"));
        	 });
        	 return tids;
         },
         batchupdate:function(){
        	 var tids=_this.getTids();
        	 if(tids.length==0){
        		 mdboss.notifyTips("请选择批量修改的记录！");
        		 return false;
        	 }else{
        		 seajs.use("demobatchedit", function () {
            		 new  mdboss.View.demobatchedit({"tids":tids});
            	 });
        	 }
        	 
         },
         checkbox:function(e){
        	 $_this=$(e.currentTarget);
         	$_checkbox=$("#flow-list li span.js-check-box");
         	if($_this.hasClass("icon-checkbox-checked")){
         		$_this.closest("li").removeClass("selected");
         		$_this.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
         		if($("#check-all").hasClass("icon-checkbox-checked")){
         			$("#check-all").addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
         		}
         	}else{
         		$_this.closest("li").addClass("selected");
         		$_this.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
         		if($_checkbox.find("i").length==$_checkbox.find("i.icon-checkbox-checked").length){
             		$("#check-all").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
             	}
         	} 
         },
         batchdel:function(e){
        	 _this=this;
        	 var delIds=_this.getTids();
        	 if(delIds.length==0){
        		 mdboss.notifyTips("请选择批量修改的记录！");
        		 return false;
        	 }else{
        		 var commonModel=new mdboss.Model.commonModel();
            	 mdboss.confirm("确定要删除吗？",function(c){
            		 if(c){
            			 commonModel.save({"usercode":mdboss.usercode,"tids":delIds},{url:mdboss.api.demobatchdel,success:function(model,res){
                    		 if(res.rc==1){
                    			 mdboss.notifyTips("删除成功！");
                    			 Backbone.history.loadUrl();
                    		 }else{
                    			 mdboss.notifyTips(res.msg);
                    		 }
                    	 },error:function(){
                    		 mdboss.error();
                    	 }});
            		 }
            	 });
        	 }
        	
        	
        	 
         },
         checkall:function(e){
        	 e.preventDefault();
        	 $this= $("#check-all");
        	 $this.toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
        	 var $li = $("#flow-list").find("li");
             var $i = $("#flow-list").find("li  i");
             if($this.hasClass("icon-checkbox-checked")){
            	 $i.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	 $li.addClass("selected");
             }else{
            	 $li.removeClass("selected");
            	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
             }
         },
         render:function(){
        	 _this=this;
        	 var commonModel=new mdboss.Model.commonModel();
             commonModel.save({ "usercode":mdboss.usercode},{url:mdboss.api.demolist,success:function(model,res){
            	 var listTemplate = Handlebars.compile(require("text!../../../template/page/demo/demo.html"));
            	 var listHtml=listTemplate({data:res.data});
            	 _this.$el.find("#flow-list").html(listHtml);
        	 	var data=res.data;
        		if(data.rows.length >0 && _this.pageNo%5==0){
        			_this.totalPage +=5;
        		}
        		if(_this.pageNo ==1){
        			_this.totalPage = 5;
        		}
        		 if(data.rows.length==0){
        			if(_this.totalPage>5)
        				_this.totalPage-=5;
	         	 }
            	 $("#query_pagination").bs_pagination({ totalPages:_this.totalPage,currentPage:_this.pageNo,
            		 onChangePage: function(event, data) {
		         			_this.pageNo = data.currentPage;
		         			_this.render();
          			}
            	 });
             }});
         },
         page:function(e){
        	 var $this  = $(e.currentTarget);
        	 var pageNo = $this.find("a").text();
        	 if(pageNo =="→"){
        		 this.pageNo +=1; 
        	 }else if(pageNo =="←"){
        		 this.pageNo -=1; 
        	 }else{
        		 this.pageNo = pageNo;
        	 }
        	 this.render();
         }
     });
    
	 var project = function (type) {
		 type=type==null?"list":type;
		 if(type=="list"){
			 mdboss.fillWrap(require("text!../../../template/common/wrap.html"));
	         var templateMenu = Handlebars.compile(require("text!../../../template/common/aside/demo.html"));
	    	 var htmlMenu= templateMenu({ "type": type });
	         $("#leftMenuContainer").html(htmlMenu);
	         var rightMenuContainer = require("text!../../../template/page/demo/main.html");
	         mdboss.fillPage(rightMenuContainer);
	         new mdboss.View.demo();
		 }
    	
     };
	 module.exports = project;
});