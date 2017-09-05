(function(angular){
	'use strict';
	angular.module('Mteatherdetails',[
		'ngRoute'
	])
	.config(['$routeProvider',function($routeProvider){
		$routeProvider.when('/teatherdetails/:id',{
			templateUrl:'teatherdetails/teatherdetails.html',
			controller:'teatherdetailsCtl'
		})
	}])
	.controller('teatherdetailsCtl',[
		'$scope',
		'$location',
		'$routeParams',
		'$route',
		function($scope,$location,$routeParams,$route){
			

			
			var tabs1=document.getElementsByClassName("presentation");
			var tabs1data=document.getElementsByClassName("presentation1");
			for(var i=0; i<tabs1.length;i++){
				tabs1[i].onclick=function(){
					var index=$(".presentation").index($(this));
					for(var i=0; i<tabs1.length;i++){
						$(".presentation").removeClass("active");
						$(".tabs1-teatherdata").removeClass("active");
					}
					$(this).addClass("active");					
					$(".tabs1-teatherdata").eq(index).addClass("active");
				}
			}			
			for(var i=0; i<tabs1data.length;i++){
				tabs1data[i].onclick=function(){
					var indexx=$(".presentation1").index($(this));
					for(var i=0; i<tabs1data.length;i++){
						$(".presentation1").removeClass("active");
						$(".presentation11").removeClass("active");
					}
					$(this).addClass("active");					
					$(".presentation11").eq(indexx).addClass("active");
				}
			}
			
//			设计数据
			var id=$routeParams.id;
		
			$scope.city="";
			$scope.memberStar="";
			$scope.name="";
			$scope.experience='';
			$scope.self_description='';
			$scope.avatar='';
			$scope.ranking="";
			$scope.resume='';
			$scope.sex='';
			$scope.education='';
			$scope.teacher_score='';
			$scope.graduate_school='';
			$scope.subjects='';
			$scope.myAreas='';
			$scope.starCount='';
			$scope.isFriend=false;
			
			//红色星
			$scope.redStar="";
			//蓝色星
			$scope.blueStar="";
			//黑色星
			$scope.blackStar="";
			
			
		    	$.ajax({
		    		type:"post",
		    		url:"/p/getTeacherInfo",
		    		data:{
		    			//id
		    			 "teacherId": id,
		    		},
		    		datatype:"json",
		    		success:function(data){	
					
						$scope.city=data.city;						
						$scope.memberStar=data.memberStar;
						$scope.name=data.name;
						$scope.experience=data.experience;
						$scope.self_description=data.self_description;
						if(!$scope.self_description){
							$scope.self_description ="他还没有填写自我描述";
						}
						
						
						$scope.avatar=data.avatar;
						$scope.ranking=data.ranking;
						$scope.resume=data.resume;
						if(!$scope.resume){
							$scope.resume ="他还没有填写过往经历";
						}
	

						
						$scope.sex=data.sex;
						$scope.education=data.education;
						$scope.teacher_score=data.teacher_score;
						$scope.graduate_school=data.graduate_school;
						$scope.subjects=data.subjects;
						
						console.log(data.subjects);
						
						$scope.myAreas=data.myAreas;
						$scope.starCount=data.starCount;
						$scope.isFriend=data.isFriend;
						
						//红色星
						$scope.redStar=[];
						//蓝色星
						$scope.blueStar=[];
						//黑色星
						$scope.blackStar=[];
						
						var starlist=document.getElementsByClassName("media-star");
						for(var i=0;i<data.totalFjStar;i++){
							$scope.redStar.push(i);
							
						}						
						for(var i=0;i<data.totalStar;i++){
							$scope.blueStar.push(i);
							
						}
						for(var i=0;i<(14-data.totalStar-data.totalFjStar);i++){
							$scope.blackStar.push(i);
							
						}	

						$scope.$apply();	
						
		    		}

	        	});

				$scope.AddTeather=function(){
					$.ajax({
						type:"post",
						url:"/p/addFriends",
						data:{
							"teacherId":id,
						},
						datatype:"json",
						success:function(data){
							$scope.isFriend=true;
							$scope.$apply();
						}
					});
				}
				
			//评论区
			var PTNumber=1; //页数
			var PTSize=30;  //页大小
			$scope.asselist='';
			$scope.average='';
			$scope.count='';			
			var order='';
			var getasse=function(){
				$.ajax({
					type:"post",
					url:"/comment/getTeacherCommentByParent",
					data:{
						"teacherId":id, //老师ID
						"pageNumber": 1,//页数
						"pageSize": 30,//页大小
						"order":order,
					},
					datatype:"json",
					success:function(data){
						$scope.asselist=data.object.result.list;
						$scope.average=data.object.average;
						$scope.count=data.object.count;

						$scope.$apply();
						
					}
				});				
			}
			//出进来默认查全部
			getasse();
			//排序
			$scope.getorderass=function(asby){
				order=asby;
				getasse();
			}
			
			
			
			//下拉加载更多
			$(window).bind("scroll", function () {
			    if ($(document).scrollTop() + $(window).height()> $(document).height()+40) {    	
			    	PTSize+20;
	     			$.ajax({
						type:"post",
						url:"/comment/getTeacherCommentByParent",
						data:{
							"teacherId":id, //老师ID
							"pageNumber": PTNumber,//页数
							"pageSize": PTSize,//页大小
							"order":order,
						},
						datatype:"json",
						success:function(data){
							$scope.asselist=data.object.result.list;		
							$scope.$apply();

						}
					});	
	
			    }
			    
			});
		



			
	}])
	
	
})(angular)