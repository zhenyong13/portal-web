/**
 * Created by jahon on 15/5/10.
 */

define(function (require, exports, module) {
	$ = require("jquery");
	Dialog = require("dialog");
	 require("scroll");
	//选择图标
	mdboss.View.iconSelectView = Backbone.View.extend({
		initialize : function(data) {
			_this=this;
			_this.parent=data.parent;
			_this.dialog=new Dialog({
                type: "html",
                value: '<div class="loading"></div>',
                fillCallback:function(){
                	 $(_this.dialog).find(".jscroll").jScrollPane();
                }
            }, {"title":"选择图标","width":"960px","height":"508px","icon":"iconfont icon-mdliucheng","resize":function(){
            	$(_this.dialog).find(".jscroll").jScrollPane();   
            }}).show(function(){
                	$dialog=this;
                	 var template = Handlebars.compile(require("text!../../../template/page/process/form/icon.html"));
        			 var html = template();
                     $($dialog.dialog).find(".loading").removeClass("loading");
                     $(html).appendTo($($dialog.dialog).find(".dialog-content")).fadeIn();
                     $($dialog.dialog).find(".dialog-content").find(".jscroll").jScrollPane();    
                });
			this.$el = _this.dialog.$html;
		},
		events:{
			"click .fa-hover a":"selectico"
		},
		selectico:function(e){
			_this=this;
			var icon=$(e.currentTarget).find("i").attr("class");
//			mdboss.confirm("确定要选择这个图标吗？",function(e){
//				if(e){
					_this.parent.$el.find("#type_class").val(icon);
					if(_this.parent.$el.find("#typeclass"))
					   _this.parent.$el.find("#typeclass").attr("class",icon);
					_this.dialog.close();
//				}
//			});
		}
	});
});