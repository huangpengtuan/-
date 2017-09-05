'use strict'

//简历全局模块
angular.module('myapp', [
		//	模块起名为movieCat，它依赖的模块为:
		//  模块路由
		'ngRoute',
		//消息主页、生成课单、预览课单、发起上课、课次预览、课单详情、发起结课
		'Mnews',
		//我的
		'Mme',
		//vip
		'Mvip',
		//发现
		'MFind',
		//补习班（圆圆版）
		'MStudentShop',
	])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
//			.otherwise({ redirectTo: '/news/' });
	}])

	.controller('dyjjapp', [
		'$scope',
		'$location',
		'$route',
		'$routeParams',
		function($scope, $location, $routeParams, $route) {

			//主页下方导航按钮跳转		
			var bottomtabs = document.getElementsByClassName("bottom-tabs");
			for(var i = 0; i < bottomtabs.length; i++) {
				bottomtabs[i].onclick = function() {
					var index = $(".bottom-tabs").index($(this));
					for(var i = 0; i < bottomtabs.length; i++) {
						$(".bottom-tabs").removeClass("activehome");

					}
					$(this).addClass("activehome");
				}
			}

			//右侧三个按钮焦点的跟随
			//因为watch只能监视$scope的对象成员，所以要把$location给$scope
			$scope.$location = $location;

			$scope.$watch('$location.path()', function(now) {
				if(now.startsWith('/news')) {
					$(".bottom-tabs").removeClass("activehome");
					$('.newsactive').addClass("activehome");
				} else if(now.startsWith('/my')) {
					$(".bottom-tabs").removeClass("activehome");
					$('.myactive').addClass("activehome");
				} else if(now.startsWith('/find')) {
					$(".bottom-tabs").removeClass("activehome");
					$('.findactive').addClass("activehome");
				}
			})

		}

	])