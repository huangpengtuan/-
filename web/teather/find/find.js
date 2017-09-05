(function(angular){
	'use strict';
	angular.module('MFind',[
		'ngRoute'
	])
	
	//解决动态加载dom无法获取问题
	.directive('onFinishRender', function ($timeout) {
   		 return {
        restrict: 'A',
        	link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }})	
	
	.config(['$routeProvider',function($routeProvider){
		$routeProvider
		.when('/find/',{
			templateUrl:'find/find.html',
			controller:'findCtl'
		})		
	}])
	.controller('findCtl',[
		'$scope',
		function($scope){

			//界面交互js
			var findtabs=document.getElementsByClassName("findtabs");	
			
			for(var i=0; i<findtabs.length;i++){
				findtabs[i].onclick=function(){
					var indexx=$(".findtabs").index($(this));
					for(var i=0; i<findtabs.length;i++){
						$(".findtabs").removeClass("activeFind");
						$(".findtabs1").removeClass("active");
					}
					$(this).addClass("activeFind");					
					$(".findtabs1").eq(indexx).addClass("active");
				}
			}
			
			$scope.newslist='';
			$scope.inderBanner='';
			$.ajax({
				type:"post",
				url:"/api/mall/index?banner_category_id=1&toutiao_category_id=1",
				data:{},
				datatype:"json",
				success:function(data){	
					$scope.newslist=data.object;
					$scope.inderBanner=data.object.inderBanner;
					$scope.$apply();

				}
			});

			//等ng-repeat之后再往元素上面绑定事件
			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				//左滑
			    var swiper01 = new Swiper('.swiper-container', {
			        pagination: '.swiper-pagination',
			        paginationClickable: true,
			
			        grabCursor : true,
			        touchRatio : 0.5,
					autoplay : 3000,
					loop : true,
				});
	
		
			})


			
	}])
	
	
})(angular)












