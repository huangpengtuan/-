(function(angular){
	'use strict';
	angular.module('Massess',[
		'ngRoute'
	])
	.config(['$routeProvider',function($routeProvider){
		$routeProvider
		//01初次评价界面
		.when('/assIni/:TID/:CID',{
			templateUrl:'assess/assIni.html',
			controller:'assIniCtl'
		})
		//02评价展示
		.when('/assShow/:TID/:CID',{
			templateUrl:'assess/assShow.html',
			controller:'assShowCtl'
		})
		//03追评
		.when('/assAgain/:TID/:CID',{
			templateUrl:'assess/assAgain.html',
			controller:'assAgainCtl'
		})		
	}])
	//01初次评价界面
	.controller('assIniCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			$scope.currId=$routeParams.CID;
			$scope.teatherId=$routeParams.TID;
			//界面交互js
			var gradeT=document.getElementsByClassName("gradeT");	
			$scope.starD=0;
			for(var i=0; i<gradeT.length;i++){
				gradeT[i].onclick=function(){
					var indexx=$(".gradeT").index($(this));
					for(var i=0; i<gradeT.length;i++){
						$(".gradeT").removeClass("activeG");
						$(".gradeImg").attr('src',"img/icon_score_empty.png"); 

					}
					$(this).addClass("activeG").animate({width:'4rem'},"slow");					
					$(".gradeImg").eq(indexx).attr('src',"img/icon_score.png").animate({width:'3rem'},"slow").animate({width:'2rem'},"slow"); 
					$scope.starD=$(".activeG").attr('data-grade'); 
					$scope.$apply();
				}
			}			
		
			$scope.assSubmit=function(){
				var content=$(".assCText").val();
				var Score=$(".activeG").attr('data-grade');
				$.ajax({
					type:"post",
					url:"/comment/addCommentByCurriculum",
					data:{
						"currId":$scope.currId, //课单id
						"content":content, //评价内容
						"parentScore":Score, //评价分数
					},
					datatype:"json",
					success:function(data){
						if(!data.isSuccess){
							alert(data.msg);
						}else if(data.isSuccess){
							alert("您的评价已成功提交");
							$location.path('/assShow/'+$scope.teatherId+'/'+$scope.currId);
						}
						$scope.$apply();
					}
				});

				
			};
			

		
		
	}])
	//02评价展示
	.controller('assShowCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			$scope.currId=$routeParams.CID;
			$scope.teatherId=$routeParams.TID;
			$scope.comments='';
			$.ajax({
				type:"post",
				url:"/comment/getCommentByParent",
				data:{
					"teacherId":$scope.teatherId, //老师ID
				},
				datatype:"json",
				success:function(data){
					$scope.comments=data.object;
					$scope.$apply()
				}
			});

	}])
	//03追评
	.controller('assAgainCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			$scope.currId=$routeParams.CID;
			$scope.teatherId=$routeParams.TID;
			$scope.comments='';
			$.ajax({
				type:"post",
				url:"/comment/getCommentByParent",
				data:{
					"teacherId":$scope.teatherId, //老师ID
				},
				datatype:"json",
				success:function(data){
					$scope.comments=data.object;
					$scope.$apply()
				}
			});
			
			$scope.assSubmit=function(){
				var content=$(".assCText").val();
				$.ajax({
					type:"post",
					url:"/comment/addContentByCurriculum",						
					data:{
						"currId":$scope.currId, //课单id
						"addContent":content, //评价内容
					},
					datatype:"json",
					success:function(data){
						if(!data.isSuccess){
							alert(data.msg);
						}else if(data.isSuccess){
							alert("您的评价已成功提交");
							$location.path('/assShow/'+$scope.teatherId+'/'+$scope.currId);
						}
						$scope.$apply();
					}
				});


				
			};			



		
	}])
	
	
	
	
	
	
	
	
	
})(angular)