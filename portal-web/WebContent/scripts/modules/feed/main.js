/**
 * Created by jahon on 15/5/10.
 */

define(function (require, exports, module) {
    var mdboss = require("mdboss");
    require("util");
    $=require("jquery");
    require("dialog");


    mdboss.Model.process = Backbone.Model.extend({
        url: '',
        initialize: function () {
        } 
    });


    mdboss.View.process = Backbone.View.extend({
        el: '#mainContainer',
        events: {
            'click #check-all':'checkBoxAll'
        },
        initialize: function () {
            this.render();
        },
        render: function (context) {
            var template = _.template('hello: <%= name %>');
            //$(this.el).html(template(context));
        },
        checkBoxAll:function(e){
        	 e.preventDefault();
        	 $this= $("#check-all");
        	 $this.toggleClass("icon-checkbox-checked").toggleClass("icon-checkbox-unchecked");
        	 var $li = $("#flow-list").find("li");
             var $i = $("#flow-list").find("li .checkbox i");
             if($this.hasClass("icon-checkbox-checked")){
            	 $i.addClass("icon-checkbox-checked").removeClass("icon-checkbox-unchecked");
            	 $li.addClass("selected");
             }else{
            	 $li.removeClass("selected");
            	 $i.addClass("icon-checkbox-unchecked").removeClass("icon-checkbox-checked");
             }
        }
    });
    //页面对应的数据接口{类型:api}
    var dataSourceMap = {
        "newitem":{"name":"未读事项","api":"newItems","main":"feedItem", "template":"unreadItem"},
        "notify":{"name":"提醒","api":"newItems","main":"feed", "template":"feedList"}
    };

    var feed = function (t) {

        var type=t?t:"newitem";

        if(dataSourceMap[type]){
            var dataApi=dataSourceMap[type]["api"];
            var template =dataSourceMap[type]["template"];
            var main =dataSourceMap[type]["main"];
            mdboss.getReady({ data: [
                {   "name":dataApi,
                    "post":{
                        assignee:mdboss.usercode,//用户编码
                        taskstatus:"",//任务状态
                        pageNo:1,       // 第一页
                        pageSize:10,    // 每页10条记录
                        queryCondition: // 查询条件
                            [

                            ],
                        orderBy:"",//排序
                        keyword:""       //搜索字段
                    },
                    "cache":false}
            ], template: [main, template, "feedAside"] }, function (result, msg) {
            	//加载框框
    	        mdboss.fillWrap(require("text!../../../template/common/wrap.html"));
    	        var templateMenu = Handlebars.compile(require("text!../../../template/common/aside/feed.html"));
    			 var htmlMenu= templateMenu({ "type": type });
    	        $("#leftMenuContainer").html(htmlMenu);
            	if (result) {
                	//TODO
                    var template = Handlebars.compile(result.template[main]);
                    var html = template({ pageId: main,"title":dataSourceMap[type].name, "type": type, "listData": result.data[dataApi] });
                    mdboss.fillPage(html);
                    new mdboss.View.process();
                } else {
                    alert(msg);
                }
            });
        }
    };
    module.exports = feed;
});