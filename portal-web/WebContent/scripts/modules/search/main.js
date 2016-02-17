/**
 * 全局搜索
 */
define(function (require, exports, module) {
    var mdboss = require("mdboss");
        $      = require("jquery");
	    require("bootstrap");
    	require("datetimepicker");
    	require("pagination");
	var $page = mdboss.$pageWrap;
    
    //搜索模型
    mdboss.Model.search= Backbone.Model.extend({
        url: mdboss.api.search    
    });    
    
    //视图
    mdboss.View.search = Backbone.View.extend({
        el: '#mainContainer',
        events: {
            'click #check-all':'checkBoxAll',
            'click #nav_list_search_pagination li':'page',//分页
        	'keyup  #middlePageSearch':'filterSubmit',//提交
        	'click .filter-cancle':'filterCancle'//取消
        },
        initialize: function (data) {
    		this.keyword= data.keyword; 
    		this.type= data.type; //类型（全部all 、公文process、项目project、任务task、文档file，可以为空，空时默认为all）
    		this.pageNo= "1"; 
            this.render();
        },
        renderData:function(t){// 数据列表
        	$("#resultlist-loading").removeClass("hide");
        	 var search = new mdboss.Model.search( {"usercode": mdboss.userocde,   "keyword": this.keyword,  "searchtype": this.type, "pageno": this.pageNo });
        	 search.save({},{success:function(model, data){
        		 if(data.rc == 1){

            		 $("#resultlist-loading").addClass("hide");
            		 var template = Handlebars.compile(require("text!../../../template/page/search/list.html"));
                 	 var html = template(data.data.rows);
                 	 $("#search-result-list").html(html);
//                 	 if(data.data.length == 0){
//                 		 $("#no-result").removeClass("hide");
//                 	 }
                 	 if("f" == t){
                 		 //第一次搜索
                 		 $("#search_pagination").bs_pagination({ totalPages : data.total });
                 	 }else if("s" == t){//再次搜索
                 		$("#search_pagination").bs_pagination({ totalPages : data.total, currentPage:1 });
                 	 }
            	 
        		 }else{
        			 mdboss.error(data.msg);
        		 }
        	 },error:function(){
					mdboss.error();
				}});
        },
        page:function(e){//分页
        	 var $this  = $(e.currentTarget);
        	 var pageNo = $this.find("a").text();
        	 this.pageNo = pageNo;
        	 this.renderData("f");
        },
        filterSubmit:function(e){//提交
        	console.log("----------------------------------------------" + e.which);
        	// //类型（全部all 、公文process、项目project、任务task、文档file，可以为空，空时默认为all）
        	if(e.which == 13){
        		var keyword=$("#middlePageSearch").val();
        		if(keyword == ""){
        			mdboss.notifyTips("请输入要搜索的内容"); return;
        		}
        		mdboss.Router.navigate("search/"+this.type+"/"+keyword, {trigger: true});
        	}
//        	 this.pageNo = 1;
//        	 this.keyword = $("#middlePageSearch").val();
//        	 this.renderData("s");
        },
        render: function () {
        	this.renderData("f");
        }
    });
    
    //全局搜索
    var search = function (type,keyword) {
    	if(type == undefined){
    		type = "all";
    	}
    	 console.log("-------keyword-----------"+keyword);
        //-----------------
        mdboss.getReady({ data: [] , template: ["search","searchAside"] }, function (result, msg) {
        	//加载框框
	        mdboss.fillWrap(require("text!../../../template/common/wrap.html"));
	        var templateMenu = Handlebars.compile(require("text!../../../template/common/aside/search.html"));
			 var htmlMenu= templateMenu({ "type": type });
	        $("#leftMenuContainer").html(htmlMenu);
        	if (result) {
            	var template = Handlebars.compile(result.template["search"]);
            	var html = template({ pageId: "search", "keyword":keyword,"type":type});
            	mdboss.fillPage(html);
            	new mdboss.View.search({"keyword":keyword,"type":type});
            } else {
            	mdboss.error(msg);
            }
        });
    };
    module.exports = search;
});