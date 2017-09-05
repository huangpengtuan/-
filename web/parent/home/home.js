(function(angular){
	'use strict';
	angular.module('Mhome',[
		'ngRoute'
	])
	.config(['$routeProvider',function($routeProvider){
		$routeProvider.when('/home/',{
			templateUrl:'home/home.html',
			controller:'homeCtl'
		})
	}])
	.controller('homeCtl',[
		'$scope',
		'$location',
		'$routeParams',
		'$route',
		function($scope,$location,$routeParams,$route){
			//地址tabs
			tabsfn('zoneBody','.zoneBody','.zoneBody01','tabItemactive');	
			//是否选择了默认城市
			$scope.ifAreas='';	
			$scope.ifAreasname='';
			$scope.ParentHome={};
			$scope.tecacherCount='';
			$scope.unMessageCount='';
			$scope.parent_follow_area_pinyin='';
		  	$.post("/p/getParentHome",
		    		{},
		        	function(data){		  
				        $scope.ParentHome=data;
				        $scope.tecacherCount=data.content.tecacherCount;
				        $scope.ifAreas=data.content.parent_follow_area;
				        $scope.unMessageCount=data.content.unMessageCount;
				        $scope.parent_follow_area_pinyin=data.content.parent_follow_area_pinyin;
				        if($scope.ifAreas){
				        	 $scope.ifAreasname=data.content.parent_follow_area_name;
				        }else if(!$scope.ifAreas){
				        	$scope.ifAreas='440300';
	        				$scope.ifAreasname='深圳';
	        				$scope.parent_follow_area_pinyin='SHENZHEN';
				        }	
				        $scope.$apply();
		    });
			
			//是否是合伙人
			$scope.goPartner=function(isPartner){
				if(isPartner){
					$location.path('/partner/');
				}else if(!isPartner){
					$location.path('/ApplyPartner/');
				}
			}
			$scope.inderBanner='';
			$.ajax({
				type:"post",
				url:"/cramSchool/getSchoolBannerByCategoryType",
				data:{
					"categoryType":"家长首页",
				},
				datatype:"json",
				success:function(data){	
					$scope.inderBanner=data.object;
					$scope.$apply();
				}
			});						

			$('#head_b_input').focus(function(){
				$('#head_b_img').fadeOut();								
			});
			
			$('#head_b_input').blur(function(){
				$('#head_b_img').fadeIn();
			});	
						
			//等ng-repeat之后再往元素上面绑定事件
			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				//banner
			    var swiper01 = new Swiper('.swiper-container',{
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