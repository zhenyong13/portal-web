/**
 * 签到查询
 */
define(function (require, exports, module) {
    var mdboss = require("mdboss");
        $      = require("jquery");
	    require("bootstrap");
    	require("pagination");
    	require("scroll");
    	require("validVal")($);
    	Dialog = require("dialog");
    	require("daterangepicker_moment");
    	require("daterangepicker");
    
    	  //签到查询
    	    mdboss.Model.signExportModel= Backbone.Model.extend({
    	    	
    	    });    
    	    
    	    //视图 签到查询
    	    mdboss.View.signExport = Backbone.View.extend({
    	        el: '#mainContainer',
    	        events: {
    	            "click .js_export_submit":"export_submit",
    	            "click .js_export_cancel":"export_cancel",
    	            "click .js_alloperate":"alloperate",//全选反选导出字段
    	            "click .js_select_filetype a":"select_filetype"
    	        },
    	        select_filetype:function(e){
    	        	$(".js_select_filetype").find("a").removeClass("btn-primary");
    	        	$(e.currentTarget).addClass("btn-primary");
    	        	$(e.currentTarget).next().prop("checked",true);
    	        	var filetype=$("input[name=filetype]:checked").val();
    	        	if(filetype=="txt"){
    	        		$(".js_allexport").show();
    	        		$(".js_startindex").hide();
    	        		$(".js_endindex").hide();
    	        	}else{
    	        		$(".js_allexport").hide();
    	        		$(".js_startindex").show();
    	        		$(".js_endindex").show();
    	        	}
    	        },
    	        initialize: function (data) {
    	        	this.condition=data.condition;
    	            this.render(data.sid);
    	        },
    	        alloperate:function(e){
    	        	$current=$(e.currentTarget);
    	        	var operate=$current.val();
    	        	if($current.prop("checked")){
    	        		$('input[name=fields'+operate+']').prop("checked",true);
    	        	}else{
    	        		$('input[name=fields'+operate+']').prop("checked",false);
    	        	}
    	        },
    	        export_submit:function(){
    	        	_this=this;
    	        	 var form_data = _this.$el.find(".exportform").triggerHandler( "submitForm" );
    	        	 if(form_data){
    	        		var params=new Array();
	    	        	var filetype=$("input:radio[name='filetype']:checked").val() ;
	    	        	var sid = $("#sid").val();
	    	        	$(".table_info").each(function(index,item){
	    	        		var voname=$("#voname"+index).val();
	    	        		var allexport=$("#allexport"+index).prop("checked");
	    	        		var startindex=$("#startindex"+index).val();
	    	        		var endindex=$("#endindex"+index).val();
	    	        		var fields=new Array();
	    	        		console.log($('input[name=fields'+index+']:checked'));
	    	        		$('input[name=fields'+index+']:checked').each(function(index,field){
	    	        			fields.push($(field).val());
	    	        		});
	    	        		var data={
	    	        			"voname":voname,
	    	        			"exportfields":fields,
	    	        			"startindex":startindex,
	    	        			"endindex":endindex,
	    	        			"queryall":allexport
	    	        		};
	    	        		params.push(data);
	    	        	});

	    	        	var req={"sid":sid,"fileType":filetype,queryCondition:_this.condition,voconfigs:params};
	    	        	var exportModel=new mdboss.Model.signExportModel();
	    	        	mdboss.exportFile(req);
	    	        	_this.dialog.close();
    	        	 }
    	        	
    	        },
    	        export_cancel:function(){
    	        	this.dialog.close();
    	        },
    	        render: function (sid) {
    	        	_this=this;
    	        	var dialog=new Dialog({
    	                  type: "html",
    	                  value: '<div class="loading"></div>',
    	                  fillCallback:function(){
    	                      $(this.dialog).find(".jscroll").jScrollPane();
    	                  }
    	              }, {"title":"导出数据","width":"800px","height":"600px","icon":"iconfont icon-mdliucheng","layer":false,"resize":function(){
    	            	  $(this.dialog).find(".jscroll").jScrollPane();
    	              }}).show(function(){
    	                	 var $content=this.dialog.find(".dialog-content");
    	                	 $content.find(".loading").removeClass("loading");
    	  					var exportModel=new mdboss.Model.signExportModel();
    	  					var template = Handlebars.compile(require("text!../../../template/page/attendance/query_export.html"));
    	  					exportModel.save({"usercode":mdboss.usercode,"sid":sid},{url:mdboss.api.queryexport,success:function(model,response){
    	  						if(response.rc==1){
    	  							var html = template(response.data);
        	  						$content.html(html);
        	  						_this.$el.find( ".exportform" ).validVal();
        	  						$content.find(".jscroll").jScrollPane();    
    	  						}else{
    	  							mdboss.error(response.msg);
    	  						}
    	  						
    	  					},error:function(){
    	  						mdboss.error( );
    	  					}});
    	  					
    	                  });
    	        	_this.$el = dialog.$html;
    	        	_this.dialog=dialog;
    	        }
    	    });
    	    
});