/**
 * Created by jahon on 15/5/10.
 */

define(function (require, exports, module) {
    var mdboss = require("mdboss");
        $= require("jquery");
        require("migrate");
    	require("ui-core");
    	require("ui-widget");
    	require("ui-mouse");
    	require("ui-sortable");

    mdboss.View.sidenavsettting = Backbone.View.extend({
        el: '#rightMainContainer',
        events: {
             'click input[type=checkbox]':'updateState',
             "click #resetsetting":'resetsetting'
        },
        resetsetting:function(e){
        	var saveSort=new mdboss.Model.commonModel();
        	saveSort.save({"usercode":mdboss.usercode},{url:mdboss.api.snMoudleReset,success:function(model,res){
        		if(res.rc==1){
        			mdboss.alert("更新成功");
        			Backbone.history.loadUrl();
        		}else{
        			mdboss.alert(res.msg);
        		}
        	},error:function(){
        		mdboss.error();
        	}})
        },
        updateState:function(e){
        	$this=$(e.currentTarget);
        	$tr=$this.closest("tr");
        	var tid=$tr.data("tid");
        	var isshow=false;
        	if($this.prop("checked")){
        		isshow=true;
        	}
        	var sortorder=$tr.data("order");
    		var saveSort=new mdboss.Model.commonModel();
    		saveSort.save({"usercode":mdboss.usercode,"data":[{"isshow":isshow,"sortorder":sortorder,"tid":tid}]},{url:mdboss.api.snMoudleUpdate,success:function(m,res){
    			if(res.rc==1){
    				console.log("更新成功");
    			}else{
    				console.log(res.msg);
    			}
    		},error:function(){
    			mdboss.error();
    		}});
        	
        },
        initialize: function () {
    		var thtml=require("text!../../../template/page/profile/sidenav-setting.html");
    		mdboss.fillPage(thtml);
    		var template=Handlebars.compile($("#moudle-template").html());
    		var commonModel =  new mdboss.Model.commonModel();
    		commonModel.save({"usercode":mdboss.usercode,"appcode":"ucp"},{url:mdboss.api.snMoudleQuery,success:function(model,res){
    			if(res.rc==1){
    				var html=template(res.data);
    				$("#moudlelist").html(html);
    				  $( ".dashset-table" ).sortable({
    	    				items:".dashset-tr",
    	    				placeholder: "dashset-placeholder",
    	    				opacity: 0.5,//拖动的透明度
    	    			    revert: true,//缓冲效果 
    	    			    update:function(e,u){
    	    			    	var sortArr=new Array();
    	    			    	$(e.target).find(".dashset-tr").each(function(i,item){
    	    			    		var isshow=false;
    	    			        	if($(item).find("input[type=checkbox]").prop("checked")){
    	    			        		isshow=true;
    	    			        	}
    	    			    		sortArr.push({"sid":$(item).data("sid"),"isshow":isshow,"tid":$(item).data("tid"),"sortorder":(i+1)});
    	    			    	});
    	    			    	if(sortArr.length>0){
    	    			    		var saveSort=new mdboss.Model.commonModel();
    	    			    		saveSort.save({"usercode":mdboss.usercode,"appcode":"ucp","data":sortArr},{url:mdboss.api.snMoudleUpdate,success:function(m,res){
    	    			    			if(res.rc==1){
    	    			    				console.log("更新成功");
    	    			    			}else{
    	    			    				mdboss.alert(res.msg);
    	    			    			}
    	    			    		},error:function(){
    	    			    			mdboss.error();
    	    			    		}});
    	    			    	}
    	    			    }
    	    			});
    			}else{
    				mdboss.alert(res.msg);
    			}
    		},error:function(){
    			mdboss.error("请求接口失败");
    		}});
    	
        }
       
    });
});