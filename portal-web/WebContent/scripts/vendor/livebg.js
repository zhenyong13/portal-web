﻿/*
    name:livebg (动态背景)
    author:2goyoung@gmail.com
    ver.1.2
    update:2014-05-16
*/
; (function (factory) {
    if (typeof define === 'function') {
        if (define.amd) {
            // AMD. Register as an anonymous module.
            define(['jquery','easing'], factory);
        } else if (define.cmd) {
            //seajs/cmd
            define(function (require, exports, module) {
                require('easing');
                return factory(require('jquery'));
            })
        }
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var $ = $;
    var ie = /*@cc_on!@*/!1;

    $.extend($.easing, {
        easeOutExpo: function (x, t, b, c, d) {
            return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
        }
    })

    var orgStyle = {
        wrap: "position:fixed;width:100%;height:100%;left:0;top:0;overflow:hidden;_position:absolute;",
        img: "position:absolute;display:none;",
        imgClone: "position:absolute;visibility:hidden;"
    };
    var className = {
        wrap: "livebg",
        img: "livebg-img",
        imgClone: "livebg-img-clone"
    }
    var followEvent, followTimer = null, throwError, resizeTimer = null;


    //$wrap 设置背景的元素
    //$img 背景图
    //$imgClone 背景图
    //options 配置参数
    //minSzie 图片最小尺寸
    function Livebg(selector, options) {
        var $wrap = this.$wrap = $(selector);
        var opts = this.options = $.extend({}, Livebg.defaults, options);
        var livebg = this;
        throwError = opts.throwError;
        this.autoId = Livebg.autoId++;
        //图片焦点位置 ，转成数字便于计算
        if (!opts.focusVal) {
            var focusValH = { "left": 0, "right": 1 }
            var focusValV = { "top": 0, "bottom": 1 }
            if (!opts.focus.match(' ')) { opts.focus += " center"; }
            var focusList = opts.focus.split(' ');
            opts.focusVal = {};
            if (focusValH[focusList[0]] !== undefined) {
                opts.focusVal.h = focusValH[focusList[0]];
            } else if (focusValH[focusList[1]] !== undefined) {
                opts.focusVal.h = focusValH[focusList[1]];
            } else {
                opts.focusVal.h = 0.5;
            }
            if (focusValV[focusList[0]] !== undefined) {
                opts.focusVal.v = focusValV[focusList[0]];
            } else if (focusValV[focusList[1]] !== undefined) {
                opts.focusVal.v = focusValV[focusList[1]];
            } else {
                opts.focusVal.v = 0.5;
            }
        }


        if ($wrap.length && $wrap.attr('livebg-init') != 'true') {

            $wrap.attr('livebg-init', 'true');
            var $img, $imgClone, miniSize = this.minSize = {}, orgSize = {}, imgSrc = opts.src = opts.src ? opts.src : getElementBgUrl($wrap);
            var $inner = setBgHtml($wrap, imgSrc);
            if (!opts.isFixed) { $inner.css("position", "absolute") }
            $img = this.$img = $inner.find('.' + className.img);
            $imgClone = this.$imgClone = $inner.find('.' + className.imgClone);

            loadImage(imgSrc, function (img) {
                //图片加载完成 处理图片尺寸数据
                orgSize.width = img.width;
                orgSize.height = img.height;
                if (opts.minWidth != "" && opts.minHeight != "") {
                    if (opts.mode) {//纵向优先
                        miniSize.height = opts.minHeight;
                        miniSize.width = setHeight($imgClone, miniSize.height);
                    } else {//横向优先
                        miniSize.width = opts.minWidth;
                        miniSize.height = setWidth($imgClone, miniSize.width);
                    }
                } else if (opts.minWidth != "") {
                    miniSize.width = opts.minWidth;
                    miniSize.height = setWidth($imgClone, miniSize.width);
                } else if (opts.minHeight != "") {
                    miniSize.height = opts.minHeight;
                    miniSize.width = setHeight($imgClone, miniSize.height);
                }


                setLivebg(livebg, false);

                if (opts.follow) {
                    Livebg.prototype.turnOnFollow.call(livebg);
                }

                opts.showFunc.call($wrap, $img, opts);

                if (opts.resizeByWindow) {
                    if (screen.width == $(window).width()) {
                        livebg.maxWidth = true;
                    }
                    $(window).resize(function () {
                        //clearTimeout(resizeTimer);
                        resizeTimer = setTimeout(function () {
                            setLivebg(livebg, true);
                        })

                    });
                }


                opts.callback.call(livebg);
            })
        } else {
            opts.showFunc.call($(this), $(this).find('.' + className.img), opts);
            opts.callback.call(livebg);
        }

    }

    Livebg.autoId = 0;

    //获取图片缩放信息
    //wrapSize、imgSize、miniSize
    Livebg.prototype.getZoomInfo = function (setting) {
        var $wrap = this.$wrap;
        var opts = this.options;
        if (!opts) { alert('元素缺少配置信息'); return; }
        if (!setting) {
            var wrapSize = { "width": $wrap.width(), "height": $wrap.height() };
            var miniSize = this.minSize;
        } else {
            var wrapSize = setting.wrapSize ? setting.wrapSize : { "width": $wrap.width(), "height": $wrap.height() };
            var miniSize = setting.miniSize ? setting.miniSize : this.minSize;
        }

        var $imgClone = this.$imgClone;

        var imgHeight, imgWidth, focusNum = opts.focusVal, paddingH = 0;
        //计算水平方向 图片与容器的边距
        if (this.paddingH === undefined) {
            if (opts.padding.toString().match('%')) {
                var padding = parseInt(wrapSize.width * (parseInt(opts.padding, 10)) * 0.01, 10);
            } else {
                var padding = parseInt(opts.padding, 10);
            }
            if (opts.mode) {
                this.paddingV = padding;
                this.paddingH = 0;
            } else {
                this.paddingH = padding;
                this.paddingV = 0;
            }
        }
        var paddingH = this.paddingH;
        var paddingV = this.paddingV;
        var info = {};
        if (!setting || !setting.imgSize) {
            //没有设置图片尺寸时 根据参数计算图片展示时的尺寸
            if (opts.mode == 0) {
                if (wrapSize.width >= miniSize.width + paddingH * 2) {
                    imgWidth = wrapSize.width + paddingH * 2;
                    imgHeight = setWidth($imgClone, imgWidth);
                    if (wrapSize.height > imgHeight && opts.isFull) {
                        imgHeight = wrapSize.height;
                        imgWidth = setHeight($imgClone, imgHeight);
                    }
                }
                else {
                    if (wrapSize.height <= miniSize.height) {
                        imgHeight = miniSize.height;
                        imgWidth = setHeight($imgClone, imgHeight);
                    }
                    else {
                        if (opts.isFull) {
                            imgHeight = wrapSize.height;
                            imgWidth = setHeight($imgClone, imgHeight);
                        } else {
                            imgWidth = miniSize.width + paddingH * 2;
                            imgHeight = setWidth($imgClone, imgWidth);
                        }
                    }
                }
            } else if (opts.mode == 1) {
                if (wrapSize.height >= miniSize.height + paddingV * 2) {
                    imgHeight = wrapSize.height + paddingV * 2;
                    imgWidth = setHeight($imgClone, imgHeight);
                    if (wrapSize.width > imgWidth && opts.isFull) {
                        imgWidth = wrapSize.width + paddingV * 2;
                        imgHeight = setWidth($imgClone, imgWidth);
                    }
                } else {
                    if (wrapSize.width <= miniSize.width) {
                        imgWidth = miniSize.width + paddingV * 2;
                        imgHeight = setWidth($imgClone, imgWidth);
                    }
                    else {
                        if (opts.isFull) {
                            imgWidth = wrapSize.width;
                            imgHeight = setWidth($imgClone, imgWidth);
                        } else {
                            imgHeight = miniSize.height + paddingV * 2;
                            imgWidth = setHeight($imgClone, imgHeight);
                        }
                    }
                }
            }

        } else {
            //根据设置图片尺寸 计算出图片位置
            if (opts.mode == 0 && setting.imgSize.width) {
                imgWidth = parseInt(setting.imgSize.width, 10);
                imgHeight = setWidth($img, imgWidth);
            } else if (setting.imgSize.height) {
                imgHeight = parseInt(setting.imgSize.height, 10);
                imgWidth = setHeight($img, imgHeight);
            } else {
                imgWidth = parseInt(setting.imgSize.width, 10);
                imgHeight = setWidth($img, imgWidth);
            }

        }
        info.width = imgWidth;
        info.height = imgHeight;
        info.top = (wrapSize.height - imgHeight + paddingV * 2) * focusNum.v - paddingV;
        info.left = (wrapSize.width - imgWidth + paddingH * 2) * focusNum.h - paddingH;
        info.contentWidth = wrapSize.width;
        info.contentHeight = wrapSize.height;
        return info;

    }

    //开启鼠标跟随 follow为跟随的对象 默认为设置背景图的容器
    Livebg.prototype.turnOnFollow = function (follow) {
        if (follow !== undefined) {
            this.options.follow = follow;
        } else {
            this.options.follow = this.options.follow ? this.options.follow : true;
        }
        if (typeof this.options.follow == "boolean") {
            setFollow(this.$wrap, this);
        } else {
            setFollow(this.options.follow, this);
        }
    }

    //关闭鼠标跟随
    Livebg.prototype.turnOffFollow = function () {
        if (typeof this.options.follow == "boolean") {
            setFollow(this.$wrap, this, false);
        } else {
            setFollow(this.options.follow, this, false);
        }
    }

    //获取鼠标在背景容器的位置 要传入事件对象
    Livebg.prototype.getMousePosition = function (e) {
        var positionLeft = getElementLeft(this.$wrap[0]);
        var positionTop = getElementTop(this.$wrap[0]);
        var cursorLeft = e.pageX;
        var cursorTop = e.pageY;
        return { x: cursorLeft - positionLeft, y: cursorTop - positionTop };
    }

    //重置
    Livebg.prototype.reset = function (options) {
        this.$wrap.attr('livebg-init', 'false');
        this.$wrap.find('.' + className.wrap).remove();
        Livebg.call(this, this.$wrap, $.extend({}, this.options, options));
    }

    //初始化结构
    function setBgHtml(element, imgSrc) {
        var $wrap = $(element);
        if ($wrap.css('position') == "static") $wrap.css('position', 'relative');
        if ($wrap.find('.' + className.wrap).length) { $wrap.find('.' + className.wrap).remove(); }
        return $('<div class="' + className.wrap + '" style="' + orgStyle.wrap + '"><img class="' + className.imgClone + '" style="' + orgStyle.imgClone + '" src="' + imgSrc + '" /><img class="' + className.img + '" style="' + orgStyle.img + '" src="' + imgSrc + '" /></div>').prependTo($wrap);
    }

    //加载图片
    function loadImage(url, callback) {
        var image = new Image();
        image.onload = function () {
            image.onload = null;
            if (typeof callback == "function") {
                callback(image);
            }
        }
        image.onerror = function () {
            throwError(1, "图片加载出错");
        }
        image.src = url;
    }

    //获取元素的背景图片地址
    function getElementBgUrl(element) {
        var cssBg = $(element).css('backgroundImage');
        $(element).css('backgroundImage', 'none');
        var imgUrl = cssBg.match(/\"(.*?)\"/) || cssBg.match(/\((.*?)\)/);
        if (!imgUrl) { throwError(0, "获取图片路径出错，此元素没有背景图片"); return false; }
        return imgUrl[1];
    }

    //对图片进行缩放和定位
    function setLivebg(livebg, isAnimate) {
        var $img = livebg.$img, focusNum = livebg.options.focusVal, sizeInfo = Livebg.prototype.getZoomInfo.call(livebg);

        if (livebg.options.mode == 0) {
            setWidth($img, sizeInfo.width);
        } else {
            setHeight($img, sizeInfo.height);
        }

        if (isAnimate) {
            $img.delay(400).animate({ 'marginTop': sizeInfo.top, 'marginLeft': sizeInfo.left }, { duration: 600, queue: false, easing: "easeOutExpo" });
        } else {
            $img.css({ 'marginTop': sizeInfo.top, 'marginLeft': sizeInfo.left });
        }
    }

    //注册鼠标跟随事件（参数turnon为false时，表示移除跟随效果）
    function setFollow($target, livebg, turnon) {

        var dataLiveBg = $target.data('livebg');

        if (typeof turnon == "boolean" && !turnon) {
            try {
                delete dataLiveBg[livebg.autoId];
                $target.data('livebg', dataLiveBg);

            } catch (e) { }

            return;
        }
        //livebg.$img.css('transition','all 0.05s')
        //$($target).unbind('mousemove', followEvent);
        if (!dataLiveBg) {
            $target.bind('mousemove', followEvent);
            function followEvent(e) {
                var _this = this;
                clearTimeout(followTimer);
                followTimer = setTimeout(function () {
                    var livebgs = $(_this).data('livebg')

                    for (var i in livebgs) {
                        var info = Livebg.prototype.getZoomInfo.call(livebgs[i]);
                        var positionLeft = getElementLeft(_this);
                        var positionTop = getElementTop(_this);
                        var cursorLeft = e.pageX;
                        var cursorTop = e.pageY;

                        var relativeLeft = cursorLeft - positionLeft < 0 ? 0 : cursorLeft - positionLeft;
                        var relativeTop = cursorTop - positionTop < 0 ? 0 : cursorTop - positionTop;

                        var endLeft = (info.contentWidth - info.width) * relativeLeft / info.contentWidth;
                        var endTop = (info.contentHeight - info.height) * relativeTop / info.contentHeight;

                        switch (livebgs[i].options.followArrow) {
                            case 0:
                                livebgs[i].$img.delay(400).animate({ marginLeft: endLeft + 'px' }, { duration: 600, queue: false, easing: "easeOutExpo" });
                                break;
                            case 1:
                                livebgs[i].$img.delay(400).animate({ marginTop: endTop + 'px' }, { duration: 600, queue: false, easing: "easeOutExpo" });
                                break;
                            case 2:
                                livebgs[i].$img.delay(400).animate({ marginTop: endTop + 'px', marginLeft: endLeft + 'px' }, { duration: 600, queue: false, easing: "easeOutExpo" });
                                break;
                        }

                    }

                }, 0);
            }
            var dataLiveBg = {};
        }
        dataLiveBg[livebg.autoId] = livebg;
        $target.data('livebg', dataLiveBg);

    }

    //设置图片宽度 并返回图片的高度
    function setWidth($img, width) {
        return $img.css('height', 'auto').width(width).height();
    }
    //设置图片高度 并返回图片的宽度
    function setHeight($img, height) {
        return $img.css('width', 'auto').height(height).width();
    }

    //获取元素 相对于文档的位置
    function getElementLeft(element) {
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    }
    function getElementTop(element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    }

    Livebg.defaults = {
        mode: 0,//图片缩放优先模式 0表示横向优先 1表示纵向优先
        minWidth: 600,//图片最小宽度（根据mode值选择）
        minHeight: "",//图片最小高度（根据mode值选择）
        isFull: true,//是否全屏显示图片
        isFixed: true,//是否采用背景固定
        focus: "center center",//图片焦点位置[top,bottom,left,right,center]
        padding: 0,//图片与容器的负内边距值，（根据mode值来决定方向）
        src: '',//图片路径，可选，不设置时获取css中的background
        follow: false,//开启鼠标跟随
        followArrow: 2,//鼠标跟随的方向，0表示横向 1表示纵向，2表示横向与纵向
        resizeByWindow: true,//当窗口大小发生变化时 更新背景图尺寸
        showFunc: function ($img, opts) {
            $img.fadeIn();
        }, //显示图片的方法
        callback: function () { },//执行完后的回调函数（有些数据在此状态下才能获取）
        throwError: function (lv, msg, code) {
            if (lv == 0) {//开发错误提示
                console.error(msg);
            } else if (lv == 1) {//用户错误提示
                alert(msg);
            }
        }
    }

    return window.Livebg = Livebg;

}));

