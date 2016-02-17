/**
 * Created by jahon on 15/3/17.
 */
(function (factory) {
    if (typeof define === 'function') {
        if (define.amd) {
            define(factory);
        } else if (define.cmd) {
            define(function (require, exports, module) {
                return factory();
            });
        }
    } else if (typeof exports === 'object') {
        module.exports = factory;
    } else {
        factory();
    }
})(function () {
    //Factory for build Util

    var Util = {
        test: function () {
            console.log('util test.');
        }

    };

    Util.getType = function (value) {

        if (null === value) {
            return 'null';
        }

        var type = typeof value;
        if ('undefined' === type || 'string' === type) {
            return type;
        }

        var typeString = Object.prototype.toString.call(value);
        switch (typeString) {
            case '[object Arguments]':
                return 'arguments';
            case '[object Array]':
                return 'array';
            case '[object Boolean]':
                return 'boolean';
            case '[object Date]':
                return 'date';
            case '[object Error]':
                return 'error';
            case '[object Function]':
                return 'function';
            case '[object JSON]':
                return 'json';
            case '[object Math]':
                return 'math';
            case '[object Number]':
                return 'number';
            case '[object RegExp]':
                return 'regexp';
            case '[object Object]':
                if (undefined !== value.nodeType) {
                    if (3 == value.nodeType) {
                        return (/\S/).test(value.nodeValue) ? 'textnode' : 'whitespace';
                    } else {
                        return 'element';
                    }
                } else {
                    return 'object';
                }
//            default:
//                return 'unknow';
        }
    };

    Util.loadImage = function (url, callback) {
        if (typeof url == "string") {
            loadImage(url, callback);
        } else if (Util.getType(url) == "array") {
            var num = url.length;
            var hasLoadNum = 0;
            for (var i = 0; i < num; i++) {
                loadImage(url[i], function () {
                    hasLoadNum++;
                    if (hasLoadNum == num) callback();
                });
            }
        }
        else if (Util.getType(url) == "object") {
            var num = 0;
            var hasLoadNum = 0;
            for (var i in url) {
                num++;
            }
            for (var i in url) {
                loadImage(url[i], function () {
                    hasLoadNum++;
                    if (hasLoadNum == num) callback();
                });
            }
        }
        function loadImage(url, callback) {
            var image = new Image();
            image.onload = function () {
                image.onload = null;
                if (typeof callback == "function") {
                    callback(image);
                }
            };
            image.onerror = function () {
                alert("图片加载失败");
            };
            image.src = url;
        }

    };

    Util.unique = function (array) {
        var res = [], hash = {};
        for (var i = 0, elem; (elem = array[i]) != null; i++) {
            if (!hash[elem]) {
                res.push(elem);
                hash[elem] = true;
            }
        }
        return res;
    };

    Util.cache = {
        set: function (obj, key, value) {
            return obj[key] = value;
        },
        get: function (obj, key) {
            return obj[key];
        },
        check: function (obj, key) {
            return !!obj[key];
        }
    };
    Util.calculate=function(record,exp){
    	var express=exp;
    	var val=0;
    	try{
		$(record).each(function(i,item){
				var key=item.code;
				var val=item.val;
				if(val==""){
					val=0;
				}
				var pattern=eval("/@"+key+"/g");
				express=express.replace(pattern,val);
			
		});
		val=eval(express);
    	}catch(e){
			console.log(e);
		}
    	return val;
    };
    Util.setAccounting=function(accounting,options){
    	if(options==undefined){
    		options={};
    	}
    	accounting.settings = {
    			currency: {
    				symbol : options.symbol==undefined?"￥":options.symbol,   // default currency symbol is '$'
    				format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
    				decimal :options.decimal==undefined?".":options.decimal,  // decimal point separator
    				thousand: options.thousand==undefined?"，":options.thousand,  // thousands separator
    				precision : options.precision==undefined?"2":options.precision   // decimal places

    			},
    			number: {
    				precision : options.precision==undefined?"0":options.precision,  // default precision on numbers is 0
    				thousand:  options.thousand==undefined?"，":options.thousand,
    				decimal : options.decimal==undefined?".":options.decimal
    			}
    		};
    	return accounting;
    };
    Util.getsumday=function(firdate,secdate){//两个时间相减保留一位小数
    	 var days=((secdate.getTime() - firdate.getTime())/(24 * 60 * 60 * 1000)).toFixed(1);
    	 var dayandfloat=days.split(".");
    	 console.log(dayandfloat);
    	 if(dayandfloat&&dayandfloat.length>0){
    		 if(parseInt(dayandfloat[1])<=5&&parseInt(dayandfloat[1])>0){
    			 return parseInt(dayandfloat[0])+0.5;
    		 }else if(parseInt(dayandfloat[1])>5){
    			 return (parseInt(dayandfloat[0])+1);
    		 }else{
    			 return parseInt(dayandfloat[0]);
    		 }

    	 }
    };
    /**-----------------------------------------------------------------------------------------------*/

    /** **********************************字符处理********************************* */
    /*
	 * 替换字符串 @str 要处理的字符集 @oldStr 原字符 @newStr 新字符
	 */
    Util.repalce = function(str, oldStr, newStr) {
        var reg = eval("/" + oldStr + "/g");
        return str.replace(reg, newStr);
    };
    
    //判断是否为空串
    Util.isBlank = function(str) {
    	if(str){
    		return true;
    	}else{
    		return false;
    	}
    };
     
    /*
	 * 取左边的指定长度的值 @str 要处理的字符集 @n 长度
	 */
    Util.left = function(str, n) {
        if (str.length > 0) {
            if (n > str.length) n = str.length;
            return str.substring(0, n);
        } else {
            return;
        }
    };
    
    /*
	 * 取右边的指定长度的值 @str 要处理的字符集 @n 长度
	 */
    Util.right = function(str, n) {
        if (str.length > 0) {
            if (n >= str.length) return str;
            return str.substring(str.length - n, n);
        } else {
            return;
        }
    };
    
    /*
	 * Trim:清除两边空格 @str 要处理的字符集
	 */
    Util.trim = function(str) {
        if (typeof str == 'string') return str.replace(/(^\s*)|(\s*$)/g, '');
    };

    /*
	 * LTrim:清除左边的空格 @str 要处理的字符集
	 */
    Util.ltrim = function(str) {
        if (typeof str == 'string') return str.replace(/(^\s*)/g, '');
    };

    /*
	 * RTrim: 清除右边的空格 @str 要处理的字符集
	 */
    Util.rtrim = function(str) {
        if (typeof str == 'string') return str.replace(/(\s*$)/g, '');
    };
    /*
	 * 清除前后的非字符 @str 要处理的字符集
	 */
    Util.strip = function(str) {
        if (typeof str == 'string') return str.replace(/^\s+/, '').replace(/(^\s*)|(\s*$)/g, '');
    };
    /*
	 * 过滤字符里面的HTML标签 @str 要处理的字符集
	 */
    Util.stripTags = function(str) {
        if (typeof str == 'string') return str.replace(/<\/?[^>]+>/gi, '').replace(/(^\s*)|(\s*$)/g, '');
    };
    
    /** *********************************验证类函数********************************* */
    /*
	 * 检测字符长度 @str 字符集 @s 开始长度 @l 结束长度
	 */
    Util.isLen = function(str, s, l) {
        str = trim(str);
        if (str.length > s && str.length < l) {
            return str;
        } else {
            return false;
        }
    };
    
    /*
	 * 是否是数字型数据 @str 字符集
	 */
    Util.isNumber = function(str) {
        if (/^\d+$/.test(str)) {
            return str;
        } else {
            return false;
        }
    };
    /*
	 * 是否是自然数型数据 @str 字符集
	 */
    Util.isInt=function(str) {
        if (/^(\+|-)?\d+$/.test(str)) {
            return str;
        } else {
            return false;
        }
    };
    /*
	 * 是否是中文字符 @str 字符集
	 */
    Util.isChinese = function(str) {
        if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
            return str;
        } else {
            return false;
        }
    };
    
    /* 是否为字母和数字（字符集） */
    Util.isLetters = function(str) {
        if (/^[A-Za-z0-9]+$/.test(str)) {
            return str;
        } else {
            return false;
        }
    };
    
    /* 是否为英文字母（字符集） */
    Util.isLetter = function(str) {
        if (/^[A-Za-z]+$/.test(str)) {
            return true;
        } else {
            return false;
        }
    };
    
    /* 是否为大写字母（字符集） */
    Util.isUpper = function(str) {
        if (/^[A-Z]+$/.test(str)) {
            return true;
        } else {
            return false;
        }
    };
    /* 是否为小写字母（字符集） */
    Util.isLower = function(str) {
        if (/^[a-z]+$/.test(str)) {
            return true;
        } else {
            return false;
        }
    };
    /*
	 * 是否为正确的网址 @str 字符集 TODO
	 */
    Util.isUrl = function(str) {
        var Expression = /http(s)?:////([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/; 
        var objExp = new RegExp(Expression);
        if (str.indexOf("localhost")) {
            str = str.replace("localhost", "127.0.0.1");
        }
        if (objExp.test(str)) {
            return true;
        } else {
            return false;
        }
        //	    var myReg =  /^((http:[/][/])?\w+([.]\w+|[/]\w*)*)?$/;      
        //	    if(myReg.test(str)){return tr;}else{return false;}
    };
    /*
	 * 是否为正确的Email形式 @str 字符集
	 */
    Util.isEmail = function(str) {
        var myReg = /^([-_A-Za-z0-9\.]+)@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
        if (myReg.test(str)) {
            return true;
        } else {
            return false;
        }
    };
    /*
	 * 是否为正确的手机号码 @str 字符集 /^0?1[3|4|5|8][0-9]\d{8}$/
	 */
    Util.isMobile = function(str) {
        var regu = /^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i;
        var re = new RegExp(regu);
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    };
    
    
    /** *********************************对象操作类函数****************************** */
    /* 创建一个DIV对象 */
    Util.createDiv = function(ID, ClassName, SVal, ToDiv) {
        var creatediv = document.createElement('div');
        if (ID != null) creatediv.id = ID;
        creatediv.style.position = 'relative'; // absolute
        if (ClassName != null) creatediv.className = ClassName;
        if ($(ToDiv)) {
            $(ToDiv).appendChild(creatediv);
        } else {
            document.getElementsByTagName('body')[0].appendChild(creatediv);
        }
        setVal(ID, SVal);
        return $(ID);
    };
    
    /* 删除指定DIV对象 */
    Util.deleteDiv = function(objid) {
        try {
            if ($(objid)) {
                var getParent = $(objid).parentNode;
                getParent.removeChild($(objid));
                return tr;
            } else {
                return false;
            }
        } catch(e) {
            return false;
        }
    };
    /*
	 * 获取对象的值 @objid 对象ID
	 */
    Util.getVal = function(objid) {
        if (typeof objid == 'string') {
            var getTagName = $(objid).tagName.toLowerCase();
            if (getTagName == 'input' || getTagName == 'textarea' || getTagName == 'select') {
                return $(objid).val;
            } else if (getTagName == 'div' || getTagName == 'span') {
                return $(objid).innerText;
            }
        } else if (typeof objid == 'object') {
            return objid.val;
        }
    };

    /*
	 * 设置指定对象的值,实现可以直接赋值或清除操作 @objid 对象ID @inserVal 传入值(可选项 Null:清除该ID的值,
	 * 则直接赋值)
	 */
    Util.setVal = function(objid, inserVal) {
        var getTagName = $(objid).tagName.toLowerCase();
        if (inserVal == null) inserVal = '';
        if (getTagName == 'input' || getTagName == 'textarea') {
            $(objid).val = inserVal;
        } else if (getTagName == 'div' || getTagName == 'sapn') {
            $(objid).innerText = inserVal;
        }
    };

    /*
	 * 拷贝对象值到剪贴板 @str 对象值
	 */
    Util.copyCode = function(str) {
        var rng = document.body.createTextRange();
        rng.moveToElementText(str);
        rng.scrollIntoView();
        rng.select();
        rng.execCommand("Copy");
        rng.collapse(false);
    };

    /*
	 * 显示隐藏一个对象 @Objid 对象ID @isshow 具体操作,指定Obj为False : none或者Tr : block (可选)
	 */
    Util.showHide = function(objid, isshow) {
        if (isshow) {
            $(objid).style.display = 'block';
        } else {
            $(objid).style.display = 'none';
        }
    };

    /*
	 * 当前对象是否可见 @objid 对象ID
	 */
    Util.isVisible = function(objid) {
        try {
            if ($(objid).style.display == 'none') {
                return false;
            }
            if ($(objid).style.visibility == 'hidden') {
                return false;
            }
            return true;
        } catch(e) {
            return false;
        }
    };
    
    /** ********************************时间相关操作函数***************************** */
    /* 获取当天日期 yyyy-MM-dd */
    Util.getDateNow = function() {
        var d, y, m, dd;
        d = new Date();
        y = d.getYear();
        m = d.getMonth() + 1;
        dd = d.getDate();
        return y + "-" + m + "-" + dd;
    };

    /*
	 * 获取指定日期后的特定天数的日期值 @toDate 当前指定的日期 @N 要添加的日期数
	 */
    Util.addDays = function(toDate, N) {
        var atomDate = toDate.split('-');
        aDate = new Date(parseInt(atomDate[0], 10), parseInt(atomDate[1], 10) - 1, parseInt(atomDate[2], 10), 6, 0, 0);
        if (!aDate) return "";
        var millis = 86400000 * N;
        aDate = new Date(aDate.getTime() + millis);
        with(aDate) {
            var mm = getMonth() + 1;
            if (mm < 10) {
                mm = '0' + mm;
            }
            var dd = getDate();
            if (dd < 10) {
                dd = '0' + dd;
            }
            return (getFullYear() + '-' + mm + '-' + dd);
        }
    };
    /** ********************************图像相关操作函数***************************** */
    /*
	 * 为单一图像添加鼠标中键放大缩小功能, 批量可以直接用 ResizeImage(指定添加该功能的图片大小:Int) 即可 (该功能只适用于IE)
	 * objid 对象ID
	 */
    Util.zoomFun = function(objid) {
        var obj = $(objid);
        obj.onmousewheel = function() {
            var zoom = parseInt(this.style.zoom, 10) || 100;
            zoom += event.wheelDelta / 12;
            if (zoom > 0) this.style.zoom = zoom + '%';
            return false;
        };
    };

    /*
	 * 重置图片尺寸同时添加放大功能 (该功能只适用于IE) @IntSize 指定图像的大小 如果适合图像大小就添加放大缩小功能
	 */
    Util.resizeImage = function(IntSize) {
        var imgsinlog = document.getElementsByTagName('img');
        for (var j = 0; j < imgsinlog.length; j++) {
            if (imgsinlog[j].width >= IntSize) {
                imgsinlog[j].width = IntSize;
                imgsinlog[j].style.cursor = 'pointer';
                imgsinlog[j].onclick = function() {
                    window.open(this.src);
                };
                if (navigator.userAgent.toLowerCase().indexOf('ie') > -1) {
                    imgsinlog[j].title = '您可以用鼠标中键或者使用Ctrl+鼠标滚轮缩放图片，点击图片可在新窗口打开';
                    imgsinlog[j].onmousewheel = function() {
                        var zoom = parseInt(this.style.zoom, 10) || 100;
                        zoom += event.wheelDelta / 12;
                        if (zoom > 0) this.style.zoom = zoom + '%';
                        return false;
                    };
                } else {
                    imgsinlog[j].title = '点击图片可在新窗口打开';
                }
            }
        }
    };

    /*
	 * 如果图像出现下载不了等异常,显示的错误提示图片 @errimgpath 显示错误提示的图像路径
	 */
    Util.imagesError = function(errimgpath) {
        var imglist = document.getElementsByTagName('img');
        for (var j = 0; j < imglist.length; j++) {
            imglist[j].onerror = function() {
                this.src = errimgpath;
            };
        }
    };

    /*
	 * 显示媒体 @mFile 文件路径 @mFileType 文件类型(可为空,如为Flash,要指定为swf类型) @ObjID 对象ID
	 * @mWidth 显示的对象宽度 @mHeight 显示对象的高度 注: 可以指定对象的ID, 如果ID不存在,会自动创建,追加在Body后面
	 */
    Util.showMedia = function(mFile, mFileType, ObjID, mWidth, mHeight) {
        var mediaStr="";
        switch (mFileType) {
        case "swf":
            mediaStr = "";
            break;
//        default:
//            mediaStr = "";
        }
        var mediaDiv = $(ObjID);
        if (mediaDiv) {
            mediaDiv.innerHTML = mediaStr;
        } else {
            mediaDiv = document.createElement("div");
            mediaDiv.id = ObjID;
            mediaDiv.innerHTML = mediaStr;
            document.getElementsByTagName('body')[0].appendChild(mediaDiv);
        }
        return false;
    };
    
    /** ********************************Cookies操作函数****************************** */
    // 两个参数，一个是cookie的名子，一个是值
    Util.setCookie = function(name, val) {
        var Days = 30; // 此 cookie 将被保存 30 天
        var exp = new Date(); // new Date("December 31,
        // 9998");
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(val) + ";expires=" + exp.toGMTString();
    };
    
    // 取cookies函数
    Util.getCookie = function(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null;
    };
    
    // 删除cookie
    Util.delCookie = function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.GetCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    };
    
    /** ********************************文件加载函数****************************** */
    // 页面必须有head元素,Loadfile("test.js", "js"),Loadfile("javascript.php",
    // "js"),Loadfile("test.css", "css")
    Util.loadfile = function(filename, filetype) {
        var fileref="";
        // 判断文件类型
        switch (filetype) {
        case "js":
            fileref = document.createElement('script');
            fileref.setAttribute("language", "javascript");
            fileref.setAttribute("type", "text/javascript");
            fileref.setAttribute("src", filename);
            break;
        case "css":
            fileref = document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
            break;
//        default:
//            break;
        }
        if (typeof fileref != "undefined" ) document.getElementsByTagName("head")[0].appendChild(fileref);
    };

    /** ********************************页面操作函数****************************** */
    /* 获取指定的URL参数值 */
    Util.reqest = function(name) {
        var Url = document.location.search;
        var Plist = new Array();
        if (Url.indexOf('?') > 0) {
            Plist = Url.substring(1).split('&');
        }
        if (Url.length > 0) {
            for (var i = 0; i < Plist.length; i++) {
                var sVal = Plist[i].split('=');
                if (sVal[0].toUpperCase() == name.toUpperCase()) {
                    return sVal[1];
                    break;
                }
            }
            return;
        }
    };
    
    /* 设为首页，如有参数就设置成参数 */
    Util.setHome = function() {
        var img = new Image();
        img.style.behavior = 'url(#default#homepage)';
        if (arguments.length > 0) {
            img.setHomePage(arguments[0]);
        } else {
            img.setHomePage(location.href);
        }
    };
    
    /* 复制指定URL地址 */
    Util.setCopy = function(str) {
        if (navigator.userAgent.toLowerCase().indexOf('ie') > -1) {
            clipboardData.setData('Text', Msg);
            alert("“" + str + "”\n已经复制到您的剪贴板中！");
        } else {
            alert("不支持剪贴板！");
        }
    };

    /* 加入收藏 */
    Util.addBookmark = function(site, url) {
        if (navigator.userAgent.toLowerCase().indexOf('ie') > -1) {
            window.external.addFavorite(url, site);
        } else if (navigator.userAgent.toLowerCase().indexOf('opera') > -1) {
            alert("请使用Ctrl+T将本页加入收藏夹");
        } else {
            alert("请使用Ctrl+D将本页加入收藏夹");
        }
    };
    
    /* 直接将HTML写到新窗口 */
    Util.popMsg = function(title, msg) {
        var popup = window.open('', 'popDialog', 'height=500,width=400,scrollbars=yes');
        popup.document.write('' + msg + '');
        // popup.document.close();
    };
    
    /* 打开Url指定宽度和高度的窗口 */
    Util.openFrame = function(url, width, height) {
        window.open(url, 'newwin', 'width=' + width + ',height=' + height);
        return false;
    };
    
    /* 禁止浏览器的Javascript错误提示 */
    Util.clearError= function() {
        window.onerror = function() {
            return true;
        };
    };
    
    /* 浏览器相关操作 */
    Util.browser = function(arg) {
        var flg = false;
        var ver = navigator.appVersion;
        var dom = document.getElementById ? tr: false;
        var ie6 = (ver.indexOf("MSIE 6") > -1 && dom) ? tr: false;
        var ie5 = (ver.indexOf("MSIE 5") > -1 && dom) ? tr: false;
        var ie4 = (document.all && !dom) ? 1 : 0;
        var ns5 = (dom && parseInt(ver) >= 5) ? 1 : 0;
        var ns4 = (document.layers && !dom) ? 1 : 0;
        var mac = (ver.indexOf('Mac') > -1) ? 1 : 0;
        var ope = (navigator.userAgent.indexOf('Opera') > -1);
        var ie = (ie6 || ie5 || ie4);
        var ns = (ns4 || ns5);
        switch (arg) {
	        case "ver":
	            flg = ver;
	            break;
	        case "dom":
	            flg = dom;
	            break;
	        case "ie6":
	            flg = ie6;
	            break;
	        case "ie5":
	            flg = ie5;
	            break;
	        case "ie4":
	            flg = ie4;
	            break;
	        case "ns5":
	            flg = ns5;
	            break;
	        case "ns4":
	            flg = ns4;
	            break;
	        case "mac":
	            flg = mac;
	            break;
	        case "ope":
	            flg = ope;
	            break;
	        case "ie":
	            flg = ie;
	            break;
	        case "ns":
	            flg = ns;
	            break;
//	        default:
//	            break;
        }
        return flg;

    };
    
    /* 重新加载Png文件背景 */
    Util.createPng = function() {
        for (var i = 0; i < document.images.length; i++) {
            var img = document.images[i];
            var imgName = img.src.toUpperCase();
            if (imgName.substring(imgName.length - 3, imgName.length) == "PNG") {
                var imgID = (img.id) ? "id='" + img.id + "' ": "";
                var imgClass = (img.className) ? "class='" + img.className + "' ": "";
                var imgTitle = (img.title) ? "title='" + img.title + "' ": "title='" + img.alt + "' ";
                var imgStyle = "display:inline-block;" + img.style.cssText;
                if (img.align == "left") imgStyle = "float:left;" + imgStyle;
                if (img.align == "right") imgStyle = "float:right;" + imgStyle;
                if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle;
                var strNewHTML = "<span " + imgID + imgClass + imgTitle + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";" + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader" + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>";
                img.outerHTML = strNewHTML;
                i = i - 1;
            }
        }
    };
    
    /* Enter事件 */
    Util.isEnter= function() {
        return window.event.KeyCode == 13;
    };
    
    
    
    /* 获取某年的某天是第几周
     * @param {Number} y
     * @param {Number} m
     * @param {Number} d
      * @returns {Number}
    */
    Util.getWeekNumber= function (y, m, d) {
    	var totalDays = 0;
	    now = new Date(y, m-1, d);
	    //var dday = now.getDay();// 当前星期几
	    years = now.getYear();
	    if (years < 1000);
	        years += 1900;
	    var days = new Array(12);
	    days[0] = 31;	    days[2] = 31;    days[3] = 30;	    days[4] = 31;	    days[5] = 30;
	    days[6] = 31;	    days[7] = 31;    days[8] = 30;	    days[9] = 31;	    days[10] = 30;	    days[11] = 31;
	     
	    //判断是否为闰年，针对2月的天数进行计算
	    if (Math.round(now.getYear() / 4) == now.getYear() / 4) {
	        days[1] = 29;
	    } else {
	        days[1] = 28;
	    }
	 
	    if (now.getMonth() == 0) {
	        totalDays = totalDays + now.getDate();
	    } else {
	        var curMonth = now.getMonth();
	        for (var count = 1; count <= curMonth; count++) {
	            totalDays = totalDays + days[count - 1];
	        }
	        totalDays = totalDays + now.getDate();
	    }
	    //totalDays = totalDays - dday;
	    //得到第几周
	    var week = Math.round(totalDays / 7);
	    console.log("week=" +week);
	    return week;
	};
	 Util.getMonthDays= function(myMonth){ 
		var monthStartDate = new Date(nowYear, myMonth, 1); 
		var monthEndDate = new Date(nowYear, myMonth + 1, 1); 
		var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24); 
		return days; 
		};
	
    
    /* 加载事件 */
    Util.onload = function(handler) {
        if (document.all) {
            window.attachEvent('onload', handler);
        } else {
            window.addEventListener('load', handler, false);
        }
    };
    
    /* 判断字符串是否为JSON格式 */
    Util.isJson = function(jsonStr) {
        try{
        	JSON.parse(jsonStr);
        	return true;
        }catch(e){
        	return false;
        }
    };
    
    /* 把字符串转换为json对象,如果入参本身为json对象则返回 */
    Util.toJson = function(jsonStr) {
        try{
        	if (typeof jsonStr == "string" && Util.isJson(jsonStr)){
        		return JSON.parse(jsonStr);
        	}else if (typeof jsonStr == "object"){
        		return jsonStr;
        	}
        }catch(e){
        	//do nothing
        }
        return undefined;
    };
    
    /**-----------------------------------------------------------------------------------------------*/
    return Util;
});


