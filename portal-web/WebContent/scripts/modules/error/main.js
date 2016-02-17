
define(function (require, exports, module) {
    
    var mdboss = require("mdboss");
    var Livebg = require("livebg");
    var util = require("util");
    var $ = require("jquery");

    var error = function () {
        mdboss.getReady({data:[], template: ["error"] }, function (result) {
        	 $("#header").empty();
            if (result) {
                var template = Handlebars.compile(result["template"]["error"]);
                var html = template({ "title": "404 无法找到页面", "content": window.location.href });
                mdboss.$pageMain.html(html);
            }
        });
    };

    module.exports = error;

});