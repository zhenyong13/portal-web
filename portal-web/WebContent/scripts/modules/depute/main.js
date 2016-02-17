define(function (require, exports, module) {
	var $ = require("jquery");
    var mdboss = require("mdboss");
    require("pagination");
    require("select2");
    require("mCustomScrollbar");
    
    mdboss.View.deputemain = Backbone.View.extend({
        el: '#rightMainContainer',
        initialize: function () {
        	this.pageNo = 1;
        	this.pageSize = 10;
        	this.totalPage = 5;
        	this.delegate = "";
        	this.delegated = "";
        	this.deputetype = "";
        	this.orderBy = "";
        	this.render();
        },
        events: {
        	"click .ret_color_a":"editshowMenu",//编辑
        	 'click .icon-trash':'deleteShow',//删除
        	 'click #module-del':'batchDel',//批量删除
        	 'click #module-batch':'batchUpdate',//批量修改
        	 'click .js-back-depute':'backDepute',//回收所有权限
        	 'click .js-adddepute':'addShow',//新增授权
        	 'click .js_module_view':'showView',//详情
//        	 'keyup #depute_usercode':"filterSearch",//搜索
//        	 'keyup #depute_username':"filterSearch",//搜索
        	 'change #depute_type':'depute_type',
        	 "focus #delegate_man":'delegateMan',//搜索委托人
        	 "focus #delegated_man":'delegateMan',//搜索委托人
        	 "keyup #delegate_man":'delegateMan',//搜索委托人
        	 "keyup #delegated_man":'delegateMan',//搜索委托人
//        	 "mouseleave .typeahead-wrapper":'hidedelegateMan',//隐藏委托人
//        	 "click .delegateman":'delegateMan',//搜索
        	 'click #deputeList li span.js-check-box i':'checkbox',//checkobx 选中取消
        	 'click #check-all-module':'checkall',//全选
        	 'click .js_sort':'sorting',//排序 
        },
        sorting:function(e){
         	this.orderBy = mdboss.sorting(e, this.orderBy);
         	this.pageNo =1;
         	this.renderData();
        },
        checkbox:function(e){
       	     $_this=$(e.currentTarget);
        	$_checkbox=$("#deputeList li span.js-check-box");
        	if($_this.hasClass("icon-checkbox-checked")){
        		$_this.closest("li").removeClass("selected");
        		$_this.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
        		if($("#check-all-module").hasClass("icon-checkbox-checked")){
        			$("#check-all-module").addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
        		}
        	}else{
        		$_this.closest("li").addClass("selected");
        		$_this.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
        		if($_checkbox.find("i").length==$_checkbox.find("i.icon-checkbox-checked").length){
            		$("#check-all-module").addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	}
        	} 
        },
        checkall:function(e){
	       	 e.preventDefault();
	       	 $this= $("#check-all-module");
	       	 $this.toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
	       	 var $li = $("#deputeList").find("li");
	            var $i = $("#deputeList").find("li  i");
	            if($this.hasClass("icon-checkbox-checked")){
	           	 $i.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
	           	 $li.addClass("selected");
	            }else{
	           	 $li.removeClass("selected");
	           	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
	            }
        },
        getTids:function(){
	       	 var tids=new Array();
	       	 $("#deputeList").find("li  i.icon-checkbox-checked").each(function(index,item){
	       		 tids.push($(item).data("id"));
	       	 });
	       	 return tids;
        },
        showView:function(e){//详情
        	var $this  = $(e.currentTarget);
        	var tid = $this.data("tid");
        	seajs.use("deputeedit", function (s) {
	      		 new mdboss.View.showMenuView({"tid":tid,"title":"授权详情","view":true} );
	      	 });
        },
        batchDel:function(){//批量删除
        	v_this=this;
       	 var delIds=v_this.getTids();
       	 if(delIds.length==0){
       		 mdboss.error("请选择批量删除的记录！");
       		 return false;
       	 }else{
       		 var commonModel=new mdboss.Model.commonModel();
           	 mdboss.confirm("确定要删除吗？",function(c){
           		 if(c){
           			 commonModel.save({"usercode":mdboss.usercode,"tids":delIds},
           					 {url:mdboss.api.batchdeleteentrust,success:function(model,res){
                   		 if(res.rc==1){
                   			 mdboss.notifyTips("删除成功！");
                   			 v_this.renderData();
                   		 }else{
                   			 mdboss.error(res.msg);
                   		 }
                   	 },error:function(){
                   		 mdboss.error();
                   	 }});
           		 }
           	 });
       	 }
        },
        batchUpdate:function(){//批量修改
        	var tids = this.getTids();
	       	 if(tids.length >0){
	       		 var v_this = this;
	       		 seajs.use("deputeedit", function () {
	       			 new  mdboss.View.showMenuView({"tids":tids,"title":"批量修改","renderData":v_this.renderDataBack,"pview":v_this});
	       		 });
	       	 }else{
	       		 mdboss.error("请选择要修改的记录！");
	       	 }
        },
        hidedelegateMan:function(){//
        	setTimeout(function(){
        		$("#searchListA").hide();
        		$("#searchListB").hide();
        	},1000);
        },
        delegateManKey:function(e){//回车搜索
        	if(e.which ==13){
        		this.delegateMan(e);
        	}
        },
        delegateBack:function(pview, usercode, name){
        	pview.renderData();
        },
        delegateMan:function(e){
        	 mdboss.userselect(e, this, this.delegateBack);		
        },
        filterSearch:function(e){//搜索
       	 	if(e.which == 13){
        		this.usercode = $("#depute_usercode").val();
        		this.username = $("#depute_username").val();
        		this.pageNo = 1;
        		this.renderData();
	         }
        },
        depute_type:function(e){
        	this.deputetype = $("#depute_type").val();
        	this.pageNo = 1;
        	this.renderData();
        },
        backDepute:function(){//回收所有权限
        	var v_this = this;
        	mdboss.confirm("确定要回收所有权限？",function(e){
        		if(e){
        			var commonModel = new mdboss.Model.commonModel();
                	commonModel.save({"usercode":mdboss.usercode},
                			{url:mdboss.api.backdepute,success:function(m,res){
                				if(res.rc == 1){
                					mdboss.alert("回收成功！");
                					v_this.renderData();
                				}else{
                					mdboss.error(res.msg);
                				}
                	},error:function(){
                		mdboss.error();
                	}});
        		}
        	});
        	
        },
        addShow:function(){//新增授权
        	var v_this = this;
    	    seajs.use("deputeedit", function () {
    		  new mdboss.View.showMenuView( {"pview":v_this,"renderData":v_this.renderDataBack});
    	    });
        },
        render:function(){//渲染页面
        	mdboss.dataselect(this, "depute_type", "COMMON_ISSUETYPE");
        	this.renderData();
        },
        renderDataBack:function(pview){//回调
        	pview.renderData();
        },
        renderData:function(){//渲染列表数据
			 var v_this = this;
			 $("#submit-loading").show();
			 var commonModel = new mdboss.Model.commonModel();
			 var condition = new Array();
			 var delegate = $("#delegate_man").attr("data-code");
			 var delegated = $("#delegated_man").attr("data-code");
			 if(delegate!=""){
				 condition.push({"key":"delegate","operate":"EqualTo","v1":delegate} );
			 }
			 if(delegated!=""){
				 condition.push({"key":"delegated","operate":"EqualTo","v1":delegated} );
			 }
			 if(this.deputetype!=""){
				 condition.push({"key":"bustype","operate":"EqualTo","v1":v_this.deputetype} );
			 }
			 $("#deputeList").mCustomScrollbar("destroy");
			 $("#deputeList").html('<div class="loading"></div>');
			 commonModel.save({
				    "usercode": mdboss.usercode, 
				    "pageNo": v_this.pageNo, 
				    "pageSize": v_this.pageSize, 
				    "queryCondition": condition, 
				    "orderBy": v_this.orderBy,   "keyword": ""
				},{url:mdboss.api.entrust, success:function(m, res){
					$("#submit-loading").hide();
				 if(res.rc == 1){
					 //设置列表 
					 var template_m = Handlebars.compile($("#show-list-template").html());
					 var html = template_m({"showList":res.data.rows});
					 $("#deputeList").html(html);
					 $("#deputeList").mCustomScrollbar({scrollButtons:{
	 						enable:false }, theme: "darkblue",horizontalScroll:false,
	                  });
					 //分页
	             	 v_this.totalPage =parseInt((res.data.total+mdboss.pageSize-1)/v_this.pageSize);
	            	 $("#depute_pagination").bs_pagination({ totalPages:v_this.totalPage,currentPage:v_this.pageNo,
	            		rowsPerPage:v_this.pageSize,
	            		onChangePage: function(event, data) {
	            			v_this.pageNo = data.currentPage;
	            			v_this.pageSize = data.rowsPerPage;
	            			v_this.renderData();
            			},
            			showGoToPage: true,
	       				showRowsPerPage : true,
	       				showRowsInfo : true,
	       				showRowsDefaultInfo : true,
	            	 });
	             	
				 }else{
					 $("#submit-loading").hide();
					 mdboss.error(res.msg);
				 }
			 },error:function(){
					mdboss.error();
			}});
        },
        editshowMenu:function(e){//编辑
        	var v_this = this;
        	var $this  = $(e.currentTarget);
        	var tid = $this.data("tid");
        	seajs.use("deputeedit", function (s) {
	      		 new mdboss.View.showMenuView({"tid":tid,"renderData":v_this.renderDataBack,"pview":v_this} );
	      	 });
        },
        deleteShow:function(e){
        	var $this  = $(e.currentTarget);
        	var tid = $this.data("tid");
        	var v_this = this;
        	mdboss.confirm("你确定要删除吗?",function(e){
        		if(e){
        			var commonModel = new mdboss.Model.commonModel();
        			commonModel.save({"usercode":mdboss.usercode,"tid":tid},
        					{url:mdboss.api.deleteentrust,success:function(m, data){
        				if(data.rc == 1){
        					mdboss.alert("删除成功！");
        					v_this.renderData();
        				}else{
        					mdboss.error(data.msg);
        				}
        			},error:function(){
        				mdboss.error();
        			}});
        		}
        	});
        }
    });
    
    //委托权限
    var deputeindex=function(t){
//        mdboss.getReady({data:[], template: ['deputeindex'] }, function (result, msg) {//
//            if (result) {
            	mdboss.fillPage( require("text!template/page/depute/deputeindex.html"));
                new mdboss.View.deputemain();
//            } else {
//           	 	mdboss.error(msg);
//            }
//        });
    };
    module.exports=deputeindex;
});