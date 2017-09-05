(function(angular){
	'use strict';
	angular.module('Mnews',[
		'ngRoute'
	])
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
		//01消息主页
		.when('/news/',{
			templateUrl:'news/news.html',
			controller:'newsCtl'
		})
		//02消息界面进入的课单详情
		.when('/kedanDetails/:ID',{
			templateUrl:'kedan/kedanDetails.html',
			controller:'kedanDetailsCtl'
		})
		//03消息界面进入的查看课次
		.when('/SeeClass/:ID',{
			templateUrl:'kedan/SeeClass.html',
			controller:'SeeClassCtl'
		})
		//04消息界面进入的查看课次再进入课次详细
		.when('/SCDetail/:ID',{
			templateUrl:'kedan/SeeClassDetails.html',
			controller:'SCDetailCtl'
		})		
		//05协商中止课单
		.when('/StopClass/:ID',{
			templateUrl:'kedan/StopClass.html',
			controller:'StopClassCtl'
		})		
		//06动态主页面
		.when('/dynamic/:State',{
			templateUrl:'news/dynamic.html',
			controller:'dynamicCtl'
		})
		//补习班----------------------
		//07查看全部课次
		.when('/AllClassDe/:ID',{
			templateUrl:'news/AllClassDe.html',
			controller:'AllClassDeCtl'
		})
		//08课次详情--状态01--上课中
		.when('/LDetai01/:ID',{
			templateUrl:'news/LessonsDetails01.html',
			controller:'LDetai01Ctl'
		})		
		//09课次详情--状态03--已结课
		.when('/LDetai03/:ID',{
			templateUrl:'news/LessonsDetails03.html',
			controller:'LDetai03Ctl'
		})
		//10补习班课单详情
		.when('/SingleClassDetail/:ID',{
			templateUrl:'news/SingleClassDetail.html',
			controller:'SingleClassDetailCtl'
		})

	}])
	
	
	//01消息主页控制器
	.controller('newsCtl',[
		'$scope',
		'$route',
		'$routeParams',
		'$location',
		function($scope,$route,$routeParams,$location){
			var PTNumber=1; //页数
			var PTSize=30;  //页大小
			
			
			//界面交互js
			var newstabs=document.getElementsByClassName("newstabs");	
			
			for(var i=0; i<newstabs.length;i++){
				newstabs[i].onclick=function(){
					var indexx=$(".newstabs").index($(this));
					for(var i=0; i<newstabs.length;i++){
						$(".newstabs").removeClass("active");
						$(".newstabs1").removeClass("active");
					}
					$(this).addClass("active");					
					$(".newstabs1").eq(indexx).addClass("active");
				}
			}			


			//获取消息数量
			$scope.newslist=0;
			$.ajax({
				type:"post",
				url:"/c/chat",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.newslist=data;
					$scope.$apply();
					
				}
			});

			//家长获取老师列表
			$scope.teatherlist='';
			$.ajax({
				type:"post",
				url:"/p/getFriendsByParent",
				data:{
					"pageNumber": 1,//页数
					"pageSize": 30,//页大小
				},
				datatype:"json",
				success:function(data){
					$scope.teatherlist=data.list;		
					$scope.$apply();
					
				}
			});		
			
			//下拉加载更多
			$(window).bind("scroll", function () {
			    if ($(document).scrollTop() + $(window).height()> $(document).height()+40) {    	
			    	PTSize+20;
	     			$.ajax({
						type:"post",
						url:"/p/getFriendsByParent",
						data:{
							"pageNumber": PTNumber,//页数
							"pageSize": PTSize,//页大小
						},
						datatype:"json",
						success:function(data){
							$scope.teatherlist=data.list;		
							$scope.$apply();

						}
					});	
	
			    }
			    
			});
			
			
			//课单展开关闭
			$scope.$on('ngRepeatFinished', function( ngRepeatFinishedEvent ) {				
				var SingleOnOff=document.getElementsByClassName("SingleClass-right");			
				for(var i=0; i<SingleOnOff.length;i++){
					var a=1;
					SingleOnOff[i].onclick=function(){
						a++;
						var indexx=$(".SingleClass-right").index($(this));
						for(var i=0; i<SingleOnOff.length;i++){
							$(".SingleDetails").slideUp("fast");							
							$(".onoroff-open").addClass("opentxt");
							$(".onoroff-Close").removeClass("opentxt");
							$('.showorhide').removeClass("showorhide-active");
						}
						if(a%2==0){
							$(".SingleDetails").eq(indexx).stop(true, false).slideToggle("slow");							
							$(".onoroff-open").eq(indexx).toggleClass("opentxt");
							$(".onoroff-Close").eq(indexx).toggleClass("opentxt");						
							$('.showorhide').eq(indexx).toggleClass("showorhide-active");							
						}


					}
				}	

			})
			
			
			//课单列表
			$scope.kedanlist='';

			$scope.kedanshow=function(id){
				var TeatherID=id;
				$.ajax({
				type:"post",
				url:"/c/curriculum/getCurriculumList",
				data:{
					"pageNumber": 1, //查询页数
    				"pageSize": 999, //页大小 //以上信息为必填
					"targetId": TeatherID,  //家长id
				},
				datatype:'json',
				success:function(data){
						$scope.kedanlist=data.content.list;
						$scope.$apply();

					}							
				});				

				
			}				
			
			//同意对方协商中止课单状态
			$scope.stateChange=function(id,state){
				var kedanID=id;
				var states=state;
				$.ajax({
					type:"post",
					url:"/c/curriculum/updateCurriculumState",
					data:{
						"currId": kedanID,//课单ID
						"stateCode":states,//状态编码，见下表
					},
					datatype:"json",
					success:function(data){
						window.location.reload(); 
					}
				});

			}
			//拒绝支付
			$scope.refuse=function(id){
				var kedanID=id;
				$.ajax({
					type:"post",
					url:"/c/curriculum/refuseCurriculum",
					data:{
						"currId": kedanID,//课单ID
					},
					datatype:"json",
					success:function(data){
						window.location.reload(); 
					}
				});
			
				
			}
			//评论
			$scope.assess=function(tid,cid,iss,issadd){
				var teatherID=tid;
				var kedanID=cid;
				if(iss == 0){
					$location.path('/assIni/'+teatherID+'/'+kedanID);

				}else if(iss == 1 && issadd == 0){
					$location.path('/assAgain/'+teatherID+'/'+kedanID);
				
				}
	
			}		

	
			
	}])
	
	
	
	
	//02课单详情控制器
	.controller('kedanDetailsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var currId=$routeParams.ID;
			$scope.typeText='';
			$scope.studentName='';
			$scope.subjectText='';
			$scope.grade='';
			$scope.hour_subsidy='';
			$scope.total_hours='';
			$scope.frequency='';
			$scope.placeText='';
			$scope.address='';
			$scope.order_amount='';
			$scope.penaltyAmount='';
			$scope.in_time='';
			$scope.memo='';
			$scope.state='';
			$scope.currId=currId;
			

			$.ajax({
				type:"post",
				url:"/c/curriculum/getCurriculumInfo",
				data:{
					"currId":currId,
				},
				datatype:"json",
				success:function(data){
					$scope.typeText=data.object.typeText;
					$scope.studentName=data.object.student_name;
					$scope.subjectText=data.object.subjectText;
					$scope.grade=data.object.grade;
					$scope.hour_subsidy=data.object.hour_subsidy;
					$scope.total_hours=data.object.total_hours;
					$scope.frequency=data.object.frequency;
					$scope.placeText=data.object.placeText;
					$scope.address=data.object.address;
					$scope.order_amount=data.object.order_amount;
					$scope.penaltyAmount=data.object.penaltyAmount;
					$scope.in_time=data.object.in_time;
					$scope.memo=data.object.memo;
					$scope.state=data.object.state;
					$scope.$apply();
				}
			});
			
			//强制中止课单
			$scope.stateChange=function(state){
				var states=state;
				$.ajax({
					type:"post",
					url:"/c/curriculum/updateCurriculumState",
					data:{
						"currId": currId,//课单ID
						"stateCode":states,//状态编码，见下表
					},
					datatype:"json",
					success:function(data){
						$location.path('/dynamic/'+1);					
						$scope.$apply();
					}
				});
			
				
			}


			
	
	}])	
	
	
	
	//03消息界面进入的查看课次控制器
	.controller('SeeClassCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var currId=$routeParams.ID;
			$scope.keciList='';	
			$.ajax({
				type:"post",
				url:"/c/curriculumClass/getClassListBycurr",
				data:{
					"currId": currId,//课单ID
				},
				datatype:"json",
				success:function(data){
					$scope.keciList=data.object;
					$scope.$apply();
				}
			});							
			$scope.responseClass=function(classId,state){
				var states=state;
				var classId=classId;
				$.ajax({
					type:"post",
					url:"/c/curriculumClass/parentCheckClass",
					data:{
						"classId":classId,//课次ID  
						"state":states,//状态参数 3:确认结课 4:拒绝结课
					},
					datatype:"json",
					success:function(data){						
						if(state == 3){
							alert("您已同意该课次");
						}else if(state == 4){
							alert("您拒绝了该课次");
						}
						window.location.reload(); 
						$scope.$apply();
					}
				});					

			}
						
			
			
	}])

	//04消息界面进入的查看课次再进入课次详情控制器
	.controller('SCDetailCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var classId=$routeParams.ID;
			
			$.ajax({
				type:"post",
				url:"/c/curriculumClass/getClassInfo",
				data:{
					"classId":classId,//课次ID  
				},
				datatype:"json",
				success:function(data){						
					$scope.kecis=data.object;					

					$scope.$apply();
				}
			});			
			



			
			
			
	}])
	
	
	
	//05协商中止课单
	.controller('StopClassCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var currId=$routeParams.ID;
			$scope.submitResure=function(){
				var resure=$("textarea").val();
				if(resure){
					$.ajax({
						type:"post",
						url:"/c/curriculum/updateCurriculumState",
						data:{
							"currId": currId,//课单ID
							"stateCode":14,//状态编码，见下表
							"stopReason":resure,//协商中止原因
						},
						datatype:"json",
						success:function(data){
							alert("协商请求已发送，请耐心等待老师回复");
							$location.path('/dynamic/'+1);
							$scope.$apply();
						}
					});
				}else{
					alert("请填写您中止的原因")
				}							
			}

	}])
	
	//06动态主页面
	.controller('dynamicCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//进入状态
			var state1234=$routeParams.State;
			var CDtabs=document.getElementsByClassName('DY-tabs');			
			for(var i=0; i<CDtabs.length;i++){				
				for(var i=0; i<CDtabs.length;i++){
					$('.DY-tabs').removeClass('SCactive');
					$('.DY-tabs01').removeClass("active");
				}
				$('.DY-tabs').eq(state1234).addClass('SCactive');					
				$('.DY-tabs01').eq(state1234).addClass("active");
				
			}
			//顶部tabs js
			tabsfn('DY-tabs','.DY-tabs','.DY-tabs01','SCactive');
			
			//01老师功能tab页--------------------------------------
			var PTNumber=1; //页数
			var PTSize=30;  //页大小
			//家长获取老师列表
			$scope.teatherlist='';
			$.ajax({
				type:"post",
				url:"/p/getFriendsByParent",
				data:{
					"pageNumber": 1,//页数
					"pageSize": 30,//页大小
				},
				datatype:"json",
				success:function(data){
					$scope.teatherlist=data.list;
					
					$scope.$apply();
					
				}
			});		
			
			//下拉加载更多
			$(window).bind("scroll", function () {
			    if ($(document).scrollTop() + $(window).height()== $(document).height()) {    	
			    	PTSize+=20;
	     			$.ajax({
						type:"post",
						url:"/p/getFriendsByParent",
						data:{
							"pageNumber": PTNumber,//页数
							"pageSize": PTSize,//页大小
						},
						datatype:"json",
						success:function(data){
							$scope.teatherlist=data.list;		
							$scope.$apply();

						}
					});	
	
			    }
			    
			});
			
			
			//课单展开关闭
			$scope.$on('ngRepeatFinished', function( ngRepeatFinishedEvent ) {				
				var SingleOnOff=document.getElementsByClassName("SingleClass-right");			
				for(var i=0; i<SingleOnOff.length;i++){
					var a=1;
					SingleOnOff[i].onclick=function(){
						a++;
						var indexx=$(".SingleClass-right").index($(this));
						for(var i=0; i<SingleOnOff.length;i++){
							$(".SingleDetails").slideUp("fast");							
							$(".onoroff-open").addClass("opentxt");
							$(".onoroff-Close").removeClass("opentxt");
							$('.showorhide').removeClass("showorhide-active");
						}
						if(a%2==0){
							$(".SingleDetails").eq(indexx).stop(true, false).slideToggle("slow");							
							$(".onoroff-open").eq(indexx).toggleClass("opentxt");
							$(".onoroff-Close").eq(indexx).toggleClass("opentxt");						
							$('.showorhide').eq(indexx).toggleClass("showorhide-active");							
						}


					}
				}	

			})
			//课单列表
			$scope.kedanlist='';
			$scope.kedanshow=function(id){
				var TeatherID=id;
				$.ajax({
				type:"post",
				url:"/c/curriculum/getCurriculumList",
				data:{
					"pageNumber": 1, //查询页数
    				"pageSize": 999, //页大小 //以上信息为必填
					"targetId": TeatherID,  //家长id
				},
				datatype:'json',
				success:function(data){
						$scope.kedanlist=data.content.list;
						$scope.$apply();
					}							
				});					
			}				
			//同意对方协商中止课单状态
			$scope.stateChange=function(id,state){
				var kedanID=id;
				var states=state;
				$.ajax({
					type:"post",
					url:"/c/curriculum/updateCurriculumState",
					data:{
						"currId": kedanID,//课单ID
						"stateCode":states,//状态编码，见下表
					},
					datatype:"json",
					success:function(data){
						$location.path('/dynamic/'+1);
					}
				});

			}
			//拒绝支付
			$scope.refuse=function(id){
				var kedanID=id;
				$.ajax({
					type:"post",
					url:"/c/curriculum/refuseCurriculum",
					data:{
						"currId": kedanID,//课单ID
					},
					datatype:"json",
					success:function(data){
						$location.path('/dynamic/'+1); 
					}
				});
			}
			//评论
			$scope.assess=function(tid,cid,iss,issadd){
				var teatherID=tid;
				var kedanID=cid;
				if(iss == 0){
					$location.path('/assIni/'+teatherID+'/'+kedanID);

				}else if(iss == 1 && issadd == 0){
					$location.path('/assAgain/'+teatherID+'/'+kedanID);	
				}
			}
			
		//02大小班tab页------------------------------------
			$scope.CourseList='';
			//01点击获取课程内容
			$.ajax({
				type:"post",
				url:"/orderItem/getCourseListByParent",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.CourseList=data.object;
					$scope.CourseListlength=$scope.CourseList.length;	
					$scope.$apply();
				}
			});
			
			//02点击跳转课次详情
			$scope.getCourseDetail=function(Cstate,CID){
				//Cstate课次状态，CID课次ID
				if(Cstate == 0 || Cstate == 1){
					$location.path('/LDetai01/'+CID);
				}else if(Cstate == 2 || Cstate == 3){
					$location.path('/LDetai03/'+CID);
				}

			}
			

			
		//03消息tab页------------------------------------
			//获取消息数量
			$scope.newslist=0;
			$.ajax({
				type:"post",
				url:"/c/chat",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.newslist=data;
					$scope.$apply();
					
				}
			});
			
			
			
			
			
			
			
			
	}])	
	//07全部课次详情（可以全部课次）
	.controller('AllClassDeCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var orderItemId=$routeParams.ID;   //子订单ID
			$scope.goback=function(){
				$location.path('/dynamic/'+2);
			}
			//膜态框消失
			$scope.cancelForceStop=function(){
				$('.HandleState04').fadeOut();
			}
			//提交拒绝结课理由
			$scope.SubmitRReason=function(Lid){
				//Lid要结课的ID
				var lessonID=localStorage.getItem('LID');				
				var RReason=$('#RRReason').val();
				$.ajax({
					type:"post",
					url:"/cramLessonItem/rejectCourse",
					data:{
						"cramLessonItemId":lessonID,  //课次ID
						"reason":RReason,   //拒绝理由
					},
					datatype:"json",
					success:function(data){
						alert(data.msg);
						$('.HandleState04').fadeOut();
						$scope.$apply();
					}
				});
				
				
			}
			//拒绝结课膜态框展示
			$scope.RefuseRefund=function(Lid){
				$('.HandleState04').fadeIn();
				localStorage.setItem("LID",Lid);
			}
			//同意结课膜态框展示
			$scope.confirmLesson=function(Lid){
				$.ajax({
					type:"post",
					url:"/cramLessonItem/confirmCourse",
					data:{
						"cramLessonItemId":Lid,  //课次ID
					},
					datatype:"json",
					success:function(data){
						alert(data.msg);
						$.ajax({
							type:"post",
							url:"/cramLessonItem/getLessonItemListByParent",
							data:{
								"orderItemId":orderItemId,  //子订单ID
							},
							datatype:"json",
							success:function(data){
								$scope.LessonItemList=data.object;
								$scope.LessonItemListlength=$scope.LessonItemList.length;
								$scope.$apply();
							}
						});						
						$scope.$apply();
					}
				});				
			}

			//获取课次列表
			$scope.LessonItemList='';
			$scope.LessonItemListlength='';
			$.ajax({
				type:"post",
				url:"/cramLessonItem/getLessonItemListByParent",
				data:{
					"orderItemId":orderItemId,  //子订单ID
				},
				datatype:"json",
				success:function(data){
					$scope.LessonItemList=data.object;
					$scope.LessonItemListlength=$scope.LessonItemList.length;
					$scope.$apply();					
				}
			});
			
			//点击跳转课次详情
			$scope.getCourseDetail=function(Cstate,CID){
				//Cstate课次状态，CID课次ID
				if(Cstate == 0 || Cstate == 1){
					$location.path('/LDetai01/'+CID);
				}else if(Cstate == 2 || Cstate == 3){
					$location.path('/LDetai03/'+CID);
				}

			}


	}])	
	//08课次详情--状态01--上课中
	.controller('LDetai01Ctl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var cramLessonItemId=$routeParams.ID;   //课次ID
			$scope.goback=function(courserId){
				$location.path('/AllClassDe/'+courserId);
			}
			//获取界面数据
			$scope.cramLessonDetail='';
			$.ajax({
				type:"post",
				url:"/cramLessonItem/getLessonItemByParent",
				data:{
					"cramLessonItemId":cramLessonItemId,  //课次ID
				},
				datatype:"json",
				success:function(data){					
					$scope.cramLessonDetail=data.object;
					console.log(data);
					$scope.$apply();					
				}
			});			



	}])	
	//09课次详情--状态03--已结课
	.controller('LDetai03Ctl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var cramLessonItemId=$routeParams.ID;   //课次ID
			$scope.goback=function(courserId){
				$location.path('/AllClassDe/'+courserId);
			}
			//获取界面数据
			$scope.cramLessonDetail='';
			$.ajax({
				type:"post",
				url:"/cramLessonItem/getLessonItemByParent",
				data:{
					"cramLessonItemId":cramLessonItemId,  //课次ID
				},
				datatype:"json",
				success:function(data){
					$scope.cramLessonDetail=data.object;
					$scope.$apply();					
				}
			});



	}])		
	
	//10补习班课单详情
	.controller('SingleClassDetailCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var orderItemId=$routeParams.ID;   //子订单ID
			$scope.goback=function(){
				$location.path('/dynamic/'+2);
			}
			$scope.orderIDetail='';
			$.ajax({
				type:"post",
				url:"/orderItem/getCourseInfoByOrderItem",
				data:{
					"orderItemId":orderItemId,  //子订单ID
				},
				datatype:"json",
				success:function(data){
					$scope.orderIDetail=data.object;
					$scope.$apply();					
				}
			});


	}])	
	
	
})(angular)