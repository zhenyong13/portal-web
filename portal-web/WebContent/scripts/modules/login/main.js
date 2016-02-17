


define(function (require, exports, module) {
    
    var mdboss = require("mdboss");
    var Livebg = require("livebg");
    var util = require("util");
    var $ = require("jquery");
    var md5 = require("md5");

   // var validateCodeUrl=baseConfig.base+"getValidateCode?_="+new Date().getTime();
    //登录模块
    mdboss.Model.login = Backbone.Model.extend({
        url: mdboss.api.login,
        initialize: function () {
            this.on('invalid', function (model, error) {
                loginView.showError(error);
            });
            this.on('request', function () {

            });
            this.on('error', this.error);
        },
        validate: function (attributes) {
            var errors = [];
//           if (attributes.usercode == "") {
//                errors.push({ error: "usercode", info: "用户名不能为空" });
//            }
//
//            if (attributes.password == "") {
//                errors.push({ error: "password", info: "密码不能为空" });
//            }
//
//            if (attributes.validatecode == "") {
//                errors.push({ error: "validatecode", info: "验证码不能为空" });
//            }
//            else if (attributes.validatecode != attributes.servervalidatecode) {
//                errors.push({ error: "validatecode", info: "验证码不正确" });
//            }
//            return errors.length?errors:false;
        },
        error: function (model, xhr) {

        }
    });
    mdboss.Model.myinfo = Backbone.Model.extend({
    	url:mdboss.api.getMyInfo
    });
    mdboss.View.login = Backbone.View.extend({
        el: '.login-panel',
        events: {
            "submit": "login",
            "click #btn-forget":"forget",
            "click #close-forget":"closeforget",
            "click .text": "moveErrorMsg",
            "focus input": "moveErrorMsg",
//            "click .code": "refreshCode"
        },
        initialize: function () {
            _.bindAll(this, 'login', 'verify', 'showError');//, 'refreshCode'
            this.$usercode = $('#u-code');
            this.$pw = $('#u-pw');
//            this.$validatecode = $("#v-code");
            if ($.trim(this.$usercode.val()) == "") {
                this.$usercode.val("").focus();
            } else if (this.$pw.val() == "") {
                this.$pw.focus();
            }

        },
        closeforget:function(){
        	$("#login-form").show();
        	$("#forget_tips").hide();
        },
        forget:function(e){
        	$("#login-form").hide();
        	$("#forget_tips").show();
        },
        login: function (e) {
            $('input:focus').blur();
            e.preventDefault();
            var usercode = $.trim(this.$usercode.val());
            var password = md5.hex($.trim(this.$pw.val()));
//            var validatecode = $.trim(this.$validatecode.val()).toLowerCase();
//            this.model.save({ "usercode": usercode, "password": password, "validatecode": validatecode }, { success: this.verify, error: this.fetchError });
            this.model.save({ "usercode": usercode, "password": password }, { success: this.verify, error: this.fetchError });
        },
        refreshCode: function (e) {
            var self = this;
            var $img = $(e.target);
//            $img.attr("src",validateCodeUrl+"?"+(+new Date()));
            $img.attr("src", baseConfig.base+"getValidateCode?_="+new Date().getTime() );
        },
        showError: function (errorData) {
            var self = this;
            if (!errorData) return;

            $.each(errorData, function (i, n) {
                var $errorEl;
                switch (n.error) {
                    case "usercode":
                        $errorEl = self.$usercode.parent();
                        break;

                    case "password":
                        $errorEl = self.$pw.parent();
                        break;

//                    case "validatecode":
//                        $errorEl = self.$validatecode.parent();
//                        break;
                }

                if (!$errorEl.hasClass("error")) {
                    $errorEl.addClass("error").append('<span class="input-icons iconfont icon-error"></span>').find("input").after('<span class="text">' + n.info + '</span>');
                }
                else if ($errorEl.find(".text").length) {
                    $errorEl.find(".text").html(n.info)
                } else {
                    $errorEl.find("input").after('<span class="text">' + n.info + '</span>');
                }
            });


            if (!this.inAnimate) {
                this.inAnimate = true;
                var marginLeft = parseInt(this.$el.css("marginLeft"));
                for (var i = 1; 3 >= i; i++) {
                    this.$el.animate({ marginLeft: marginLeft - (30 - 10 * i) }, 100);
                    if (i == 3) {
                        this.$el.animate({ marginLeft: marginLeft + 2 * (30 - 10 * i) }, 100, function () {
                            self.inAnimate = false;
                        });
                    } else {
                        this.$el.animate({ marginLeft: marginLeft + 2 * (30 - 10 * i) }, 100);
                    }
                }
            }

        },
        moveErrorMsg: function (e) {
            var $self = $(e.target);
            if ($self.parent().hasClass("error"))
                $self.parent().removeClass("error").find(".text,.input-icons").remove().end().find("input").focus();
        },
        verify: function (model, response) {
            if (response.rc == 1) {
                this.loginSuccess(response.data);
            } else {

                var errors = [];
                if (response.data.loginstate == "1") {
                    errors.push({ error: "usercode", info: response.data.loginmsg });
                }

                if (response.data.loginstate == "2") {
                    errors.push({ error: "password", info: response.data.loginmsg });
                }

                if (response.data.loginstate == "3") {
                	$("#v-code").val("");
                    errors.push({ error: "validatecode", info: response.data.loginmsg });
                }


                this.loginFail(errors);
            }
            model.clear();
        },
        loginSuccess: function (userinfo) {
            //登录成功
            $('#u-pw').val('');
            var usercode= userinfo.usercode;
            $.cookie("usercode", usercode);
            $.cookie("workno", userinfo.workno);
            mdboss.usercode=usercode;
            mdboss.workno=userinfo.workno;
            mdboss.Router.navigate(mdboss.cache["data"].hash, {
                trigger: true
            });
        },
        loginFail: function (message) {
            this.showError(message);
        },
        fetchError: function (model, response) {
            //alert("登录请求出错，请重试或刷新页面")
        }
    });




    var loginView;
    var loginModel = new mdboss.Model.login();

    mdboss.View.loginPage = Backbone.View.extend({
        el: "#page-main",
        pageClass: "page-login",
        initialize: function (data) {
            this.templateData = data && data.templateData ? data.templateData : {};
            var self = this;
            _.bindAll(this, 'render');
            $.when($.ajax(mdboss.template["login"])).done(function (source) {
//                self.templateData["validatecodeurl"] =baseConfig.base+"getValidateCode?_="+new Date().getTime();
                self.render(source);
            });
        },
        render: function (source) {
        	 //mdboss.fillWrap(require("text!../../../template/common/wrap_.html"));
        	 $("#header").empty();
            this.template = Handlebars.compile(source);
            var html = this.template(this.templateData);
            (this.$el).html(html);

            //动画
            util.loadImage(["images/login/bg.jpg", "images/login/panel.png"], function () {
                setTimeout(function () {
                    var bg = new Livebg(".bg", {
                        src: "images/login/bg.jpg", isFixed: false, showFunc: function ($img) {
                            $img.show();
                        }, callback: function () {
                            setTimeout(function () {
                                var $loginPanel = $(".login-panel");
                                var marginTop = parseInt($loginPanel.css("marginTop"));
                                $(".login-panel").show().css({ "opacity": "0", "marginTop": marginTop - 20 + "px" }).animate({ "opacity": "1", "marginTop": marginTop + "px" }, 400, function () {
                                    //执行登录模块
                                    loginView = new mdboss.View.login({model:loginModel});
                                })
                            }, 100)

                        }
                    });
                }, 600)
            });
            return this;
        }
    })
});