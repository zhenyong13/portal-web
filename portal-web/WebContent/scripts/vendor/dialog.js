//author:zhangguoyong@revenco.com
(function (factory) {
    if (typeof define === 'function') {
        if (define.amd) {
            // AMD. Register as an anonymous module.
            define(['jquery'], factory);
        } else if (define.cmd) {
            define(function (require) {
                return factory(require("jquery"));
            });
        }
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    var IE = (function () {
        var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');
        while (
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
            all[0]
        );
        return v > 4 ? v : false;
    })();
    var isIE6 = IE == 6 ? true : false;
    var Dialog = function (content, options) {
        /// <summary>
        /// 创建窗口会话对象
        /// </summary>
        /// <param name="content">指定窗口类型(type)和内容(content)</param>
        /// <param name="options">窗口属性</param>
        var options = $.extend({}, Dialog.defaults, options);
        var contentType = this.contentType = content === undefined ? 'html' : content.type;
        this.fixed = options.fixed;
        this.positionMode = options.fixed && !isIE6 ? 'fixed' : 'absolute';
        this.width = options.width;
        this.height = options.height;
        this.position = options.position;
        this.resize=options.resize;
        this.title=options.title;
        var self = this;

        Dialog._zIndex++;
        if (options.id) {
            this.id = options.id;
        }
        else {
            this.id = 'dialog-' + Dialog._count;
        }
        var setHtml = function (content) {

            if ((options.layer == true || options.layer == 'true') && $('.dialog-cover').length == 0) {
                Dialog.creatLayer().appendTo($(options.target));
                self.coverId = 'dialog-cover-' + Dialog._count;
            }

            var btnsHtml = (function () {
                var min = '', max = '', close = '';
                $.each(options.btns, function (i, n) {
                    if (n == "close") {
                        close = '<i class="dialog-close" style="right:12px"></i>';
                        options.close = true;
                    } else if (n == "max") {
                    	if(options.layer == false){
                    		max = '<i class="dialog-resize" style="right:38px"></i>';
                            options.max = true;
                    	}
                        
                    } else if (n == "min") {
                    	if(options.layer == false){
                    		min = '<i class="dialog-min" style="right:68px"></i>';
                    		options.min = true;
                    	}
                    }
                })
                return min + max + close;
            })();

            var dialogHtml = ['<div id="' + self.id + '" class="sp-dialog ' + (options.full && options.full != 'false' ? 'full-screen' : '') + '" style="position:' + self.positionMode + ';z-index:' + Dialog._zIndex + ';' + (options.full && options.full != 'false' ? 'width:100%;height:100%;' : 'width:' + options.width + ';height:' + options.height + ';') + '">',
                                            '<div class="dialog-inner">',
                                                '<div class="dialog-bar">',
                                                    '<h2 class="dialog-title"><div class=" sp-title"><i class="dialog-icon '+options.icon+'"></i><span class="text-wrap "><span class="inner"><span class="text">' + options.title + '</span></span></span></div></h2>',
                                                    '<div class="dialog-btn">',
                                                        btnsHtml,
                                                    '</div>',
                                                    '<div class="shadow"></div>',
                                                '</div>',
                                                '<div class="dialog-content-wrap">',
                                                    '<div class="dialog-content dialog-' + contentType + '">',
                                                        content,
                                                    '</div>',
                                                '</div>',
                                            '</div>',
                                        '</div>'].join('');

            var $dialog = $(dialogHtml).css({ 'opacity': 0 }).appendTo($(options.target));
            if (options.height == "auto") {
                var height = $dialog.find('.dialog-bar')[0].offsetHeight + $dialog.find('.dialog-content-wrap')[0].offsetHeight;
                $dialog.height(height);
            }
            
            if(!options.layer ){
            	//窗口大小调整
            	$( "#"+self.id ).resizable({
            		handles: "n, e, s, w, ne, se, sw, nw",
            		resize:function( event, ui ){
//            			console.log(ui.size.width);//840
            			if(ui.size.width <600){
            				$( "#"+self.id ).css("width", 600);
            			}
            		},
            		stop:function( event, ui ){ //停止 
            			$( "#"+self.id ).find(".dialog-content-wrap").css("height", ui.size.height-40);
            			if( parseInt($("#"+self.id ).css('top')) + parseInt($("#"+self.id ).css('margin-top')) <0){
            				$("#"+self.id ).css('top', -parseInt($("#"+self.id).css('margin-top') ));
            			}
            		}
            	});
            }
            
            return $dialog;

        };

        this.dialog=setHtml("");
        Dialog.prototype.updateContent.call(this,{contentType:contentType,contentValue:content.value,postData:content.postData,fillCallback:content.fillCallback,fillBefore:content.fillBefore});


        this.$html = $(this.dialog);

        if (options.full) {
            $(window).resize(function () {
                clearTimeout(self.resizeTimer);
                self.resizeTimer = setTimeout(function () {
                    self.fullScreen(false);
                }, 100);
            });
        }
        //处理ie6
        if (isIE6) {
            //self.getPadding();
            //$(this.dialog).width(parseInt(options.width) + this.hPadding).height(parseInt(options.height) + this.vPadding);
            var iframe = '<iframe width="100%" height="100%" style="position:absolute;top:0;left:0;scrolling:no;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" frameborder="0" src=""></iframe>';
            $(iframe).prependTo(this.dialog);
        }
        //自动关闭
        if (options.autoClose) {
            setTimeout(function () { self.close(); }, parseInt(options.autoClose));
        }
        //绑定事件
        if (options.close) {
            $(this.dialog).find('.dialog-close').bind('click', function () {
                self.close();
            });
        }
        if (options.min) {
            $(this.dialog).find('.dialog-min').bind('click', function () {
                self.min();
            });
        }
        if (options.max) {
            //--双击标题栏窗口缩小或放大
            $(this.dialog).find('.dialog-title').bind('dblclick', function () {
                if ($(self.dialog).hasClass('full-screen')) {
                    self.normalScreen();
                } else {
                    self.fullScreen();
                }
            })[0].onselectstart = function () {
                //--不让标题栏被选择
                return false;
            };

            $(this.dialog).find('.dialog-resize').bind('click', function () {
                if ($(self.dialog).hasClass('full-screen')) {
                    self.normalScreen();
                } else {
                    self.fullScreen();
                }
            });
        }

        //--鼠标按下与松开
        $(this.dialog).bind('mousedown', function () {
            Dialog._zIndex++;
            $(self.dialog).css('zIndex', Dialog._zIndex + 200);
        }).bind('mouseup', function () {
            $(self.dialog).css('zIndex', Dialog._zIndex);
        });

        //--拖动事件
        if (options.draggable == true && options.draggable != "false") {
            var mouse = { x: 0, y: 0 };
            $(self.dialog).find('.dialog-title').css('cursor', 'move');
            $(this.dialog).find('.dialog-title').bind('mousedown', function (event) {
                var e = window.event || event;
                
                var xx = event.originalEvent.x || event.originalEvent.layerX || 0; 
                var yy = event.originalEvent.y || event.originalEvent.layerY || 0; 
                
                mouse.x = e.clientX;
                mouse.y = e.clientY;
                $(document).bind('mousemove', moveDialog);
                $(self.dialog).css('zIndex', ++Dialog._zIndex);
                return false;
            });
            $(document).mouseup(function (event) {
                $(document).unbind('mousemove', moveDialog);
            });

            var cssTop = 0;
            //移动对话框
            function moveDialog(event) {
                var e = window.event || event;
                var top = parseInt($(self.dialog).css('top')) + (e.clientY - mouse.y);
                var leftl = parseInt($(self.dialog).css('left')) + (e.clientX - mouse.x);
                //ie7 jquery 1.9.1计算出错
                //var top = parseInt($(self.dialog).position().top) + (e.clientY - mouse.y);
                //var left = parseInt($(self.dialog).position().left) + (e.clientX - mouse.x);
				 
                if( parseInt($(self.dialog).css('top')) + parseInt($(self.dialog).css('margin-top')) <0){
                	top = -parseInt($(self.dialog).css('margin-top'));
                }
                
                $(self.dialog).css({ top: top, left: leftl });
                //最大化时移动 窗口还原
                if ($(self.dialog).hasClass('full-screen')) {
                	self.normalScreen();
//                    var dialogSize = self.normalScreen();
//                    var winWidth = $(window).width();
//                    var left = e.clientX - dialogSize.width * 0.5;
//                    var ratio = e.clientX / winWidth;
//                    if (left < 0) {
//                        left = 0;
//                    }
//                    else if (e.clientX + dialogSize.width * 0.5 > winWidth) {
//                        left = winWidth - dialogSize.width;
//                    }
//                    self.setPosition(left, e.clientY - mouse.y);
                }
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            };
        }

        $('.dialog-cover').css('zIndex', Dialog._zIndex);

        Dialog._zIndex++;
        Dialog._count++;

        return this;
    }

    Dialog.creatLayer=function() {
        this.coverId = 'dialog-cover-' + Dialog._count;
        var $layer;
        if (isIE6) {
            $layer = $('<div id="' + this.coverId + '" class="dialog-cover" style="display:none;z-index:' + Dialog._zIndex + ';width:expression(eval(document.documentElement.clientWidth));height:expression(eval(document.documentElement.clientHeight));"><iframe width="100%" height="100%" style="position:absolute;top:0;left:0;scrolling:no;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" frameborder="0" src=""></iframe></div>');
        }
        else {
            $layer = $('<div id="' + this.coverId + '" class="dialog-cover" style="display:none;z-index:' + Dialog._zIndex + ';"></div>');
        }
        return $layer;
    }

    Dialog._zIndex = 2000;
    Dialog._count = 1;

    //设置内容区高度
    Dialog.prototype.setContentHeight = function () {
        var $contentWrap = $(this.dialog).find('.dialog-content-wrap');
        if (this.tHeight === undefined) {
            var $dialogTitle = $(this.dialog).find('.dialog-bar');
            this.tHeight = $dialogTitle.height() + parseInt($dialogTitle.css('borderTopWidth') == "medium" ? 0 : $dialogTitle.css('borderTopWidth')) + parseInt($dialogTitle.css('borderBottomWidth') == "medium" ? 0 : $dialogTitle.css('borderBottomWidth'));
        }
        $contentWrap.height($(this.dialog).height() - this.tHeight);
    }
    //设置会话框位置，参数x为x轴上的偏移值，参数y为y轴上的偏移值，参数为空时，将会话框居中
    Dialog.prototype.setPosition = function (x, y) {
        var self = this;
        if (arguments.length == 0) {
            //弹出层是否移动过
            //alert($(this.dialog).css('top'))
            //if ($(this.dialog).css('top') == "auto" && !$(this.dialog).hasClass('full-screen')) {
            if (!$(this.dialog).hasClass('full-screen')) {
                if (typeof this.position == "string" && this.position == "middle") {
                    var marginTop = (function () {
                        if (self.fixed) {
                            if (!isIE6) {
                                return $(self.dialog).height() / 2;
                            }
                            else {
                                var height = $(self.dialog).height() / 2;
                                return 'expression(eval(document.documentElement.scrollTop-' + height + '))';
                            }
                        }
                        else {
                            return $(self.dialog).height() / 2 - $(window).scrollTop();
                        }
                    })();
                    if (typeof marginTop == "string") {
                        $(this.dialog).css({
                            'top': '50%',
                            'left': '50%',
                            'marginLeft': -$(this.dialog).width() / 2 + 'px'
                        });
                        var style = $(this.dialog).attr('style') + ';margin-top:' + marginTop + ';'; 
                        $(this.dialog).attr('style', style);
                    } else {
                        $(this.dialog).css({
                            'top': '50%',
                            'left': '50%',
                            'marginTop': -marginTop + 'px',
                            'marginLeft': -$(this.dialog).width() / 2 + 'px'
                        });
                    }

                } else {
                    $(this.dialog).css(this.position);
                }

            } else {
                $(this.dialog).css({ 'top': 0 + 'px', 'left': 0 + 'px', 'margin': 0 });
            }
        }
        else {
            $(this.dialog).css({ 'top': y + 'px', 'left': x + 'px', 'margin': 0 });
        }
    }
    //最大化会话框
    Dialog.prototype.fullScreen = function (isRecord) {//isRecord 是否保存当前窗口样式
        var self = this;
        this.resizeTimer;
        var winWidth = $(window).width();
        var winHeight = $(window).height();
        if (isRecord === undefined || isRecord)
            this.recordCss = $(this.dialog).attr('style');//记录全屏前窗口样式，用于还原
        $(this.dialog).css({ 'top': 0, 'left': 0, 'width': '100%', 'height': '100%', 'margin': 0 }).addClass('full-screen');
        $(window).resize(function () {
            clearTimeout(self.resizeTimer);
            self.resizeTimer = setTimeout(function () {
                self.fullScreen(false);
            }, 100);
        });
        if (this.height != "auto") { this.setContentHeight(); }

        this.resize();
        return { 'width': winWidth, 'height': winHeight }
    }
    //还原窗口大小
    Dialog.prototype.normalScreen = function () {
        clearTimeout(this.resizeTimer);
        $(window).unbind('resize');
        if (this.recordCss === undefined) {
            $(this.dialog).css({ 'width': this.width, 'height': this.height, 'left': '50%', 'top': '50%', 'marginTop': -parseInt(this.height, 10) / 2 + 'px', 'marginLeft': -parseInt(this.width, 10) / 2 + 'px' }).removeClass('full-screen');
        }
        else {
            $(this.dialog).attr('style', this.recordCss).removeClass('full-screen');
        }
        if (this.height != "auto") { this.setContentHeight(); }
        this.resize();
        return { 'width': $(this.dialog).width(), 'height': $(this.dialog).height() }
    }
    //显示会话框，返回对话框对象
    Dialog.prototype.show = function (callback) {
        var self = this;
        this.setPosition();
        var marginTop = parseInt($(this.dialog).css('marginTop'), 10);
        if (this.coverId) {
            $('#' + this.coverId).show();
        }
        if (this.height != "auto") { this.setContentHeight(); }
        if (marginTop == 0 || marginTop == 'auto') {
            this.inMiddle = false;
            var top = parseInt($(this.dialog).css('top'), 10);
            $(this.dialog).css('top', top - 30).animate({ 'top': top, 'opacity': '1' }, 200, function () {
                if (self.contentType == "iframe") { self.dialog.find(".dialog-content").html(self.contentHtml) }
                if (callback !== undefined) { callback.call(self); }
            });
        }
        else {
            this.inMiddle = true;
            $(this.dialog).css('marginTop', marginTop - 30).animate({ 'marginTop': marginTop, 'opacity': '1' }, 200, function () {
                if (self.contentType == "iframe") { self.dialog.find(".dialog-content").html(self.contentHtml) }
                if (callback !== undefined) { callback.call(self); }
            });
        }
        //tools_bar
        $("#tools_bar").append('<span id="t_'+this.id+'" style="cursor: pointer;background-color:#1898C5;color:#fff;" class="btn btn-default btn-sm">'+this.title+'</span>');
        if( $("#tools_bar span").length>0){
        	$("#tools_bar").show();
        }
        $("#t_"+this.id).bind('click', function () {
        	$(self.dialog).css('zIndex', ++Dialog._zIndex);
        	if($(self.dialog).css("display")=="none"){
        		if (self.inMiddle) {
                    $(self.dialog).animate({ 'marginTop': parseInt($(self.dialog).css('marginTop'), 10)-24, 'opacity': '1' }, 100,function(){
                    	$(self.dialog).show();
                    });
                }
                else {
                	 $(self.dialog).animate({ 'top': parseInt($(self.dialog).css('top'), 10)-24, 'opacity': '1' }, 100,function(){
                		 $(self.dialog).show();
                	 });
                }
        	}
        	
        });
        //if(this.height)
        return this;
    }
    //关闭对话框，返回对话框对象
    Dialog.prototype.close = function () {
        var self = this;
        var closeDialog = function () {

            if (self.coverId) {
                $('#' + self.coverId).fadeOut(function () {
                    $(this).remove();
                });
            }
            if (self.inMiddle) {

                $(self.dialog).animate({ 'marginTop': parseInt($(self.dialog).css('marginTop'), 10) - 14, 'opacity': '0' }, 400, function () {
                    var d = $(self.dialog).remove();
                    setCoverIndex();
                    return d;
                });
            }
            else {
                $(self.dialog).animate({ 'top': parseInt($(self.dialog).css('top'), 10) - 14, 'opacity': '0' }, 400, function () {
                    var d = $(self.dialog).remove();
                    setCoverIndex();
                    return d;
                });
            }
            //删除工具栏
            $("#t_"+self.id).remove();
            if( $("#tools_bar span").length==0){
            	$("#tools_bar").hide();
            }


        }

        if (this.beforeCloseFun === undefined) {
            closeDialog();
        }
        else {
            if (this.beforeCloseFun() == true) {
                closeDialog();

            }
        }
    }
    //最小化对话框
    Dialog.prototype.min = function () {
        var self = this;
        $('#' + self.coverId).fadeOut();
        if (self.inMiddle) {
            $(self.dialog).animate({ 'marginTop': parseInt($(self.dialog).css('marginTop'), 10) + 24, 'opacity': '0' }, 400,function(){
            	$(self.dialog).hide();
            });
        }
        else {
        	 $(self.dialog).animate({ 'top': parseInt($(self.dialog).css('top'), 10) + 24, 'opacity': '0' }, 400,function(){
        		 $(self.dialog).hide();
        	 });
        }
        return this;
    }
    //隐藏对话框，返回对话框对象
    Dialog.prototype.hide = function () {
        var self = this;
        $('#' + self.coverId).fadeOut();
        if (self.inMiddle) {
            $(self.dialog).animate({ 'marginTop': parseInt($(self.dialog).css('marginTop'), 10) + 24, 'opacity': '0' }, 400);
        }
        else {
            $(self.dialog).animate({ 'top': parseInt($(self.dialog).css('top'), 10) + 24, 'opacity': '0' }, 400);
        }
        return this;
    }
    //窗口关闭前触发函数，fun为函数，此方法会阻止窗口关闭
    Dialog.prototype.beforeClose = function (fun) {
        if (fun === undefined) {
            this.beforeCloseFun = function () { return 1; }
        }
        else {
            this.beforeCloseFun = fun;
        }
    }

    //更新窗口内容 obj{contentType:"",contentvalue:"",postData:"",fillCallback:"","fillBefore":""}
    Dialog.prototype.updateContent = function (obj) {
        var contentType=obj.contentType,contentValue=obj.contentValue,postData=obj.postData,fillCallback=obj.fillCallback,fillBefore=obj.fillBefore;
        var self=this;
        switch (contentType) {
            case 'iframe': {
                var contentHtml =this.contentHtml= '<iframe src="' + contentValue + '" width="100%" height="100%;" frameborder="no" border="0" marginwidth="0" marginheight="0"  allowtransparency="yes"></iframe>';
                if(typeof fillBefore=="function"){
                    fillBefore.call(self.dialog,contentHtml);
                }
                $(self.dialog).find('.dialog-content').html(contentHtml);
                //处理由于iframe造成拖动卡的问题
                var $iframeFix;
                var self = this;
                $(self.dialog).find('.dialog-title').bind('mousedown', function (event) {
                    $iframeFix = $('<div class="dialog-iframe-fix"></div>').appendTo($(self.dialog).find('.dialog-content'));
                });
                $(document).mouseup(function (event) {
                    if ($iframeFix) {
                        $iframeFix.remove();
                        $iframeFix = null;
                    }

                });
                if(typeof fillCallback=="function"){
                    fillCallback.call(self.dialog,contentHtml);
                }
                break;
            }
            case 'ajax': {
                var contentHtml = this.contentHtml = '<div class="loading"></div>';
                $(self.dialog).find('.dialog-content').html(contentHtml);
                $.ajax({
                    url: contentValue,
                    data: postData,
                    success: function (contentHtml) {
                        setTimeout(function(){
                            if(typeof fillBefore=="function"){
                                fillBefore.call(self.dialog,contentHtml);
                            }
                            $(self.dialog).find('.dialog-content').hide().html(contentHtml).fadeIn();
                            if(typeof fillCallback=="function"){
                                fillCallback.call(self.dialog,contentHtml);
                            }
                        },1000);

                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        if (textStatus == "timeout") { var textStatus = "请求超时,请重新打开窗口" }
                        $(self.dialog).find('.dialog-content').html(textStatus);
                    }
                });
                break;
            }
           // default:
            case 'html': {
                var contentHtml = contentValue;
                if(typeof fillBefore=="function"){
                    fillBefore.call(self.dialog,contentHtml);
                }
                $(self.dialog).find('.dialog-content').html(contentHtml);
                if(typeof fillCallback=="function"){
                    fillCallback.call(self.dialog,contentHtml);
                }
                break;
            }
        }
    }

    var setCoverIndex = function () {
        var maxIndex = 0;
        $('.sp-dialog').each(function () {
            if ($(this).css("zIndex") > maxIndex) {
                maxIndex = $(this).css("zIndex");
            }
        });
        $('.dialog-cover').css('zIndex', maxIndex);
    }

    /**
    * 打开警告提示框
    * String {msg} 文字信息
    * Object {options} 
    *      options.okBtnText 按钮的文字，默认为确定
    *      options.okCallback 点击按钮的回调函数，this指向窗口对象，你可以通过this.$html来获取窗口的html内容
    */

    function MsgPanel(msg, options) {//options [okBtnText,okCallback]
        var text = '确&nbsp;&nbsp;&nbsp;定', iconClass, _this = this;
        if (options !== undefined) {
            text = options.okBtnText ? options.okBtnText : text;
            this.okCallback = options.okCallback ? options.okCallback : '';
        }
        switch (MsgPanel.style) {
            case "alert": iconClass = "i-alert"; break;
            case "success": iconClass = "i-success"; break;
            case "tips": iconClass = "i-tips"; break;
            case "error": iconClass = "i-error"; break;
        }
        var msgbox = '<div class="sp-alert sp-panel-info">' +
                                '<div class="inner">' +
                                    '<i data-icon="' + iconClass + '" class="msgpanel-icon ' + iconClass + '"></i>' +
                                    '<table><tr><td class="msg">' + msg + '</td></tr></table>' +
                                '</div>' +
                                '<div class="bottons">' +
                                    '<button class="sp-btn ok-btn">' + text + '</button>' +
                                '</div>' +
                            '</div>';

        this.panel = new Dialog({ 'type': 'html', 'value': msgbox }, {
            'title': '信息提示',
            'width': '440px',
            'height': 'auto',
            'layer': 'true'
        });
        this.$html = this.panel.$html;

        this.$html.find('.ok-btn').bind('click', function () {
            _this.panel.close();
            if (typeof _this.okCallback == 'function') { _this.okCallback.call(_this.panel); }
        })

        _this.panel.show()

    }

    /**
    * 打开警告提示框
    * String {style} 窗口类型["alert","success","tips","error"]
    * Object {options} 
    *      options.text 提示文字
    *      options.okBtnText 按钮的文字，默认为确定
    *      options.okCallback 点击按钮的回调函数，this指向窗口对象，你可以通过this.$html来获取窗口的html内容
    */
    MsgPanel.prototype.changeStyle = function (style, options) {
        var iconClass;
        switch (style) {
            case "alert": iconClass = "i-alert"; break;
            case "success": iconClass = "i-success"; break;
            case "tips": iconClass = "i-tips"; break;
            case "error": iconClass = "i-error"; break;
        }


        //change icon
        var $icon = this.$html.find('.msgpanel-icon');
        $icon.hide().removeClass($icon.data('icon')).addClass(iconClass).data('icon', iconClass).fadeIn();
        //change text
        if (options.text) {
            this.$html.find('.msg').html(options.text);
        }
        //change text
        if (options.okBtnText) {
            this.$html.find('.sp-button-text .text').html(options.okBtnText);
        }
        this.$html.find('.sp-button').focus();
        //change callback
        if (typeof options.okCallback == "function") {
            this.okCallback = options.okCallback;
        }
    }
    MsgPanel.style = "alert";

    Dialog.alert = function (msg, options) {
        MsgPanel.style = "alert";
        return new MsgPanel(msg, options);
    }

    Dialog.tipsPanel = function (msg, options) {
        MsgPanel.style = "tips";
        return new MsgPanel(msg, options);
    }

    Dialog.successPanel = function (msg, options) {
        MsgPanel.style = "success";
        return new MsgPanel(msg, options);
    }

    Dialog.errorPanel = function (msg, options) {
        MsgPanel.style = "error";
        return new MsgPanel(msg, options);
    }

    Dialog.showLoading = function (text) {
        var t = text === undefined ? "" : text;
        Dialog.creatLayer().appendTo($("body"));
        $('<div class="sp-loading-bar"><div class="loading-text">'+t+'</div></div>').appendTo($("body"));
    }

    Dialog.hideLoading = function (text) {
        $(".sp-loading-bar,.dialog-cover").remove();
    }
    
    /**
    * 打开信息确认框
    * String {msg} 文字信息
    * Object {options} 
    *      options.okBtnText 确认按钮的文字，默认为确定
    *      options.cancelBtnText 取消按钮的文字，默认为取消
    *      options.okCallback 点击确认按钮的回调函数，this指向窗口对象，你可以通过this.$html来获取窗口的html内容
    *      options.cancelCallback 点击取消按钮的回调函数，this指向窗口对象，你可以通过this.$html来获取窗口的html内容
    */
    Dialog.confrim = function (msg, options) {
        var okText = '确&nbsp;&nbsp;&nbsp;定', cancelText = '取&nbsp;&nbsp;&nbsp;消', okCallback, cancelCallback;
        if (options !== undefined) {
            okText = options.okBtnText ? options.okBtnText : okText;
            cancelText == options.cancelBtnText ? options.cancelBtnText : cancelText;
            okCallback = options.okCallback ? options.okCallback : '';
            cancelCallback = options.cancelCallback ? options.cancelCallback : '';
        }
        var msgbox = '<div class="sp-alert sp-panel-info">' +
                                '<div class="inner">' +
                                    '<i class="i-confrim msgpanel-icon"></i>' +
                                    '<table><tr><td class="msg">' + msg + '</td></tr></table>' +
                                '</div>' +
                                '<div class="bottons">' +
                                '<button class="cancel-btn sp-btn gray">' + cancelText + '</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                                    '<button class="ok-btn sp-btn" >' + okText + '</button>' +
                                     
	                            '</div>' +
                            '</div>';


        var confrimDialog = new Dialog({ 'type': 'html', 'value': msgbox }, {
            'title': '信息提示',
            'width': '484px',
            'height': 'auto',
            'layer': 'true'
        });

        confrimDialog.$html.find('.ok-btn').bind('click', function () {
            confrimDialog.close();
            if (typeof okCallback == 'function') { okCallback.call(confrimDialog); }
        })
        confrimDialog.$html.find('.cancel-btn').bind('click', function () {
            confrimDialog.close();
            if (typeof cancelCallback == 'function') { cancelCallback.call(confrimDialog); }
        })
        confrimDialog.show();
    }

    Dialog.defaults = {
        title: "&nbsp;",                 //标题文本
        width: '260px',                 //内容框宽度大小，默认为260px
        height: 'auto',                //内容框高度大小，默认为auto
        full: false,                        //是否全屏打开
        target: 'body',                 //添加到目标中
        btns: ['min','max','close'],  //是否显示最小化最大化按钮 'min','max',
        icon:"",
        layer: true,                    //是否有遮盖层
        draggable: true,            // 是否移动 
        autoClose: 0,                //自动关闭时间，单位ms，0 代表不自动关闭
        id: false,                       //窗口id值，没有设置时，由系统自动生成
        fixed: true,                     //对话框固定定位
        position: "middle",          //默认对话框位置 {"left":'10px','top':'10px'}
        resize:function(){}         //窗口大小改变时回调
    }

    return Dialog;

}))
