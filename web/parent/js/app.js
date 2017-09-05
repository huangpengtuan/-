'use strict'

//简历全局模块
angular.module('myapp',[
//	模块起名为movieCat，它依赖的模块为:
//  模块路由
	'ngRoute',
//  1主页home模块	
	'Mhome',
//2合伙人hehuoren模块
	'Mpartner',			
//3老师详情模块	
	'Mteatherdetails',
//4上门家教模块		
	'Mshangmenjiajiao',	
//5我的模块
	'Mme',
//6消息模块
	'Mnews',
//7vip模块	
	'Mvip',
//8钱包&查看流水&意见反馈&提现记录&星币兑换记录	
	'Mwallet',	
//9补习班
	'MCSchool',
//10发现
	'MFind',
//11评论
	'Massess',

	])

	
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider		
		.otherwise({redirectTo:'/home/'});
	}])

	.controller('dyjjapp',[
		'$scope',
		'$location',
		'$route',
		'$routeParams',
		function($scope,$location,$routeParams,$route){
			$scope.$location = $location;
			$scope.type='';
			

			//主页下方导航按钮跳转		
			var bottomtabs=document.getElementsByClassName("bottom-tabs");

			for(var i=0; i<bottomtabs.length;i++){
				bottomtabs[i].onclick=function(){
					var indexx=$(".bottom-tabs").index($(this));
					for(var i=0; i<bottomtabs.length;i++){
						$(".bottom-tabs").removeClass("activehome");
						$('.bottom-tabs i').removeClass("activehome");
					}
					$(this).addClass("activehome");	
					$('.bottom-tabs i').eq(indexx).removeClass("activehome");
				}
			}			
			
		
			
			
			
			
			
			
			
		}
		
		
	])
