define(function(require, exports, module) {
	var mdboss = require("mdboss");
	require("livebg");
	require("util");
	require("swiper");
	var $ = require("jquery");
	
	mdboss.View.departmentView = Backbone.View.extend({
		 el: '#mainContainer',
		 initialize: function (data) {
			 this.render();
			 this.orgcode = data.orgcode;
		 },
		 events:{
			 "click .world_bumen_span":'changeDept',
		 },
		 changeDept:function(e){
			console.log("change dept "); 
			var $this=$(e.currentTarget);
			$this.siblings().removeClass("active");
			$this.addClass("active");
			var orgcode = $this.data("orgcode");
			console.log(orgcode);
			this.renderFrame(orgcode);
		 },
		 render:function(){
			 //获取第一个部门的信息
			 this.renderFrame(this.orgcode);
		 },
		 renderFrame:function(orgcode){ //加载框架
			 var v_this = this;
			 var commonModel = new mdboss.Model.commonModel();
			 commonModel.save({usercode:mdboss.usercode, modulecode:'model-00002' },
					 {url:mdboss.api.portal_showframe,success:function(m,res){
				 if(res.rc == 1){
					    var template = Handlebars.compile($("#dept-frame-template").html());
						var html = template({"frameList":res.data.rows});
						$("#columnList").html(html);
						v_this.renderColumn(res.data.rows);
				 }else{
					 mdboss.error(res.msg);
				 }
			 },error:function(){
     			mdboss.error( );
     		}});//end 加载框架
		 },
		 renderColumn:function(frameList){ //加载栏目

				for(var i=0; i<frameList.length; i++){
					var tmp = frameList[i];
					if(tmp){
						var commonModel = new mdboss.Model.commonModel();
						commonModel.save({"usercode":mdboss.usercode,"modulecode":"","columncode":tmp.columncode,"showing":tmp.showpicture},
							{url:mdboss.api.portal_showcolumn,success:function(model,res){
								if(res.rc == 1){
									var template = Handlebars.compile($("#dept-frame-list-template").html());
									var html = template(
											{"showimg":model.get('showing'),"baseurl":baseConfig.avatar_url,"imgList":res.data.pictureinfo,"columnList":res.data.rows});
									$("#column_"+model.get('columncode')).html(html);
									//
//									new Swiper("#column_"+model.get('columncode')+" .swiper-container", {
//								        pagination: "#column_"+model.get('columncode')+" .swiper-pagination",
//								        paginationClickable: true,
//								        spaceBetween: 30,
//								        centeredSlides: true,
//								        autoplay: 4000,
//								        autoplayDisableOnInteraction: false,
//								        effect : 'fade'
//									});
								}else{
									mdboss.error(res.msg);
								}
							},error:function(){
			        			mdboss.error( );
			        		}});//end save
					}//end if 
				}//end for
		 }
	});
	
	
	var deptindex = function() {
		//TODO加载部门信息
		mdboss.getReady({
			data:[
			      {"name":"orgs","post":{
				usercode:mdboss.usercode,
				 },cache:false}
			      ],
			template : ["deptindex"]
		}, function(result, msg) {
			//加载框框
	        mdboss.fillWrap(require("text!template/common/wrap_.html"));
	        $("#mainContainer").css("background","#fff");
			if (result) {
				mdboss.fillPage(result.template["deptindex"] );
				var data = result.data['orgs'];
				var template = Handlebars.compile($("#dept-list-template").html());
				var html = template({"orgList":data.rows});
				$(".world_bumen_span").after(html);
				if(data.rows.length>0)
					new mdboss.View.departmentView({"orgcode":data.rows[0].orgcode});
			} else {
				 mdboss.error(msg);
			}
		});
	};

	module.exports = deptindex;

});