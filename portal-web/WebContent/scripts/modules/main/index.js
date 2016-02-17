/**
 * Created by jahon on 15/4/25.
 */


define(function (require, exports, module) {

    var mdboss = require('mdboss');
    var $ = require("jquery");
    require('handlebars');

    var index = {
        test: function () {
            var source = $("#entry-template").html();
            var template = Handlebars.compile(source);

            var data = [
                {
                    title: 'baidu',
                    link: 'http://www.baidu.com'
                },
                {
                    title: 'google',
                    link: 'http://www.google.com.hk'
                }
            ];
            var html = template(data);

            $(html).appendTo($('ul'))

        }
    };

    module.exports = index;
});