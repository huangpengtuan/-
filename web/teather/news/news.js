(function(angular){
	'use strict';
	angular.module('Mnews',[
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
		//01消息主页
		.when('/news/:ID',{
			templateUrl:'news/news.html',
			controller:'newsCtl'
		})
		//02生成课单
		.when('/kedanBegin/:ID',{
			templateUrl:'kedan/kedanBegin.html',
			controller:'kedanBeginCtl'
		})
		//03预览课单
		.when('/kedanPreview/',{
			templateUrl:'kedan/kedanPreview.html',
			controller:'KDPreviewCtl'
		})		
		
		//04发起上课
		.when('/RequestClass/:ID',{
			templateUrl:'kedan/RequestClass.html',
			controller:'RequestClassCtl'
		})
		//05课次预览
		.when('/RCPreview/:ID',{
			templateUrl:'kedan/RequestClassPreview.html',
			controller:'RCPreviewCtl'
		})		
		//06消息界面进入的课单详情
		.when('/kedanDetails/:ID',{
			templateUrl:'kedan/kedanDetails.html',
			controller:'kedanDetailsCtl'
		})
		//07消息界面进入的查看课次
		.when('/SeeClass/:ID',{
			templateUrl:'kedan/SeeClass.html',
			controller:'SeeClassCtl'
		})	
		//08消息界面进入的查看课次再进入课次详细
		.when('/SCDetail/:ID',{
			templateUrl:'kedan/SeeClassDetails.html',
			controller:'SCDetailCtl'
		})	
		//09发起结课
		.when('/CEnd/:ID',{
			templateUrl:'kedan/ClassEnd.html',
			controller:'CEndCtl'
		})	
		//10结课报告
		.when('/CEndPre/:ID',{
			templateUrl:'kedan/ClassEndPreview.html',
			controller:'CEndPreCtl'
		})	
		//11协商中止课单
		.when('/StopClass/:ID',{
			templateUrl:'kedan/StopClass.html',
			controller:'StopClassCtl'
		})
		//补习班----------------------
		//12开始上课
		.when('/BeginClass/:ID',{
			templateUrl:'news/BeginClass.html',
			controller:'BeginClassCtl'
		})
		//13发起上课预览
		.when('/ensureClass/:ID',{
			templateUrl:'news/ensureClass.html',
			controller:'ensureClassCtl'
		})				
		//查看全部课次（可以查看全部课次）
		.when('/AllClassDe/:ID',{
			templateUrl:'news/AllClassDe.html',
			controller:'AllClassDeCtl'
		})				
		//15发起结课
		.when('/GLessons/:CID/:LID',{
			templateUrl:'news/GuitarLessons.html',
			controller:'GLessonsCtl'
		})
		//16发起结课前预览
		.when('/PreLessons/:CID/:LID',{
			templateUrl:'news/PreLessons.html',
			controller:'PreLessonsCtl'
		})		
		//17课次详情--状态01--上课中
		.when('/LDetai01/:ID',{
			templateUrl:'news/LessonsDetails01.html',
			controller:'LDetai01Ctl'
		})
		//18课次详情--状态02--待结课
		.when('/LDetai02/:ID',{
			templateUrl:'news/LessonsDetails02.html',
			controller:'LDetai02Ctl'
		})	
		//19课次详情--状态03--已结课
		.when('/LDetai03/:ID',{
			templateUrl:'news/LessonsDetails03.html',
			controller:'LDetai03Ctl'
		})	
		//20补习班课单详情
		.when('/SingleClassDetail/:ID',{
			templateUrl:'news/SingleClassDetail.html',
			controller:'SingleClassDetailCtl'
		})		
		
		
		
	}])

	//01消息主页控制器
	.controller('newsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){										
			var PTNumber=1; //页数
			var PTSize=30;  //页大小			
			//02界面交互js
			tabsfn('newstabs','.newstabs','.newstabs1','yewuactive');
		//一：消息==========================================================	
			//03获取消息数量
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
		//二：一对一==========================================================		
			//04展开按钮的显隐控制&&家长获取老师列表
			$scope.zhankai='';
			$scope.Parentlist='';
			$.ajax({
				type:"post",
				url:"/t/getFriendsByTeacher",
				data:{
					"pageNumber": 1,//页数
					"pageSize": 30,//页大小
				},
				datatype:"json",
				success:function(data){
					$scope.Parentlist=data.list;
					$scope.$apply();
					
				}
			});
			$scope.goWhere=function(id){
				var ParentID=id;
				localStorage.setItem("ParentID",ParentID);	
				$.ajax({
				type:"post",
				url:"/c/curriculum/getCurriculumDraft",
				data:{
					"parentId": ParentID,  //家长id
				},
				datatype:'json',
				success:function(data){						
						//没有草稿
						$location.path('/kedanBegin/'+ParentID);					
						$scope.$apply();				
					}	
					
				});								
			}
			//课单列表
			$scope.kedanlist='';
			$scope.kedanshow=function(id){
				var ParentID=id;
				$.ajax({
				type:"post",
				url:"/c/curriculum/getCurriculumList",
				data:{
					"pageNumber": 1, //查询页数
					"pageSize": 100, //页大小 //以上信息为必填
					"targetId": ParentID,  //家长id
				},
				datatype:'json',
				success:function(data){
						$scope.kedanlist=data.content.list;
						$scope.$apply();
	
					}							
				});							
			}			

		//三：大小班==========================================================
			//01获取大小班列表
			$scope.LessionList=[];
			$scope.getmyLessons=function(){
				$('.spinner').fadeIn();
				pageNumber=1;
				$.ajax({
				type:"post",
				url:"/cramLesson/getLessonListByTeacher",
				data:{
					"pageNumber": 1, //查询页数
					"pageSize": pageSize, //页大小 
				},
				datatype:'json',
				success:function(data){
						$scope.LessionList=data.object.list;
						$('.spinner').fadeOut();	
						$scope.$apply();	
					}							
				});
			    //02定时器8秒自动加载	
			    setInterval(function(){
			    	pageNumber++;			    
					$.ajax({					
						type:"post",
						url:"/cramLesson/getLessonListByTeacher",
						data:{
							'pageNumber':210,   //页数
							'pageSize':pageSize,    //页大小
						},
						datatype:"json",
						success:function(data){	
							$scope.LessionList=$scope.LessionList.concat(data.object.list);
							$scope.$apply();								
						}
					})		    	
			    },8000);				
				
			}


		//公共==========================================================			-
			$scope.$on('ngRepeatFinished', function( ngRepeatFinishedEvent ) {
				//01课单展开关闭
				var SingleOnOff=document.getElementsByClassName("showorhide");			
				for(var i=0; i<SingleOnOff.length;i++){
					var a=1;
					SingleOnOff[i].onclick=function(){
						a++;
						var indexx=$(".showorhide").index($(this));
							for(var i=0; i<SingleOnOff.length;i++){
								$(".SingleDetails").slideUp("fast");
								$(".onoroff-open").addClass("opentxt");
								$(".onoroff-Close").removeClass("opentxt");
								$(".Billing").removeClass("Billinghide");
								$('.showorhide').removeClass("showorhide-active");						
							}
							if(a%2==0){
								$(".SingleDetails").eq(indexx).stop(true, false).slideToggle("slow");						
								$(".onoroff-open").eq(indexx).toggleClass("opentxt");
								$(".onoroff-Close").eq(indexx).toggleClass("opentxt");
								$(".Billing").eq(indexx).toggleClass("Billinghide");
								$('.showorhide').eq(indexx).toggleClass("showorhide-active");
							}
	
					}
				}
				
				//02各个界面返回动态页面状态
				var state012=$routeParams.ID;
				var CDtabs=document.getElementsByClassName('newstabs');			
				for(var i=0; i<CDtabs.length;i++){				
					for(var i=0; i<CDtabs.length;i++){
						$('.newstabs').removeClass('yewuactive');
						$('.newstabs1').removeClass("active");
					}
					$('.newstabs').eq(state012).addClass('yewuactive');					
					$('.newstabs1').eq(state012).addClass("active");
					if(state012 == 2){
						$scope.getmyLessons();
					}
				}				
				
		
			})		
	
			//03下拉加载更多
			$(window).bind("scroll", function () {
			    if ($(document).scrollTop() + $(window).height()== $(document).height()) {    	
			    	$('.spinner').fadeIn();
			    	//0301一对一获取家长列表
			    	PTSize+20;
	     			$.ajax({
						type:"post",
						url:"/t/getFriendsByTeacher",
						data:{
							"pageNumber": PTNumber,//页数
							"pageSize": PTSize,//页大小
						},
						datatype:"json",
						success:function(data){						
							$scope.Parentlist=data.list;
							$('.spinner').fadeOut();
							$scope.$apply();
						}
					});	
					
					//0302大小班获取课次表
			    	pageNumber++;			    
					$.ajax({					
						type:"post",
						url:"/cramLesson/getLessonListByTeacher",
						data:{
							'pageNumber':pageNumber,   //页数
							'pageSize':pageSize,    //页大小
						},
						datatype:"json",
						success:function(data){	
							$scope.LessionList=$scope.LessionList.concat(data.object.list);
							$('.spinner').fadeOut();
							$scope.$apply();								
						}
					})

			    }
			    
			});
	


			
	}])
	
	
	
	
	//02发起课单控制器
	.controller('kedanBeginCtl',[
		'$scope',
		function($scope){
	
			//预览数据
			
			$scope.kedanStart=function(){
				var KDdata=$("form").serializeArray();

				localStorage.setItem("type",KDdata[0].value);
				localStorage.setItem("studentName",KDdata[1].value);
				localStorage.setItem("subjectId",KDdata[2].value);
				localStorage.setItem("grade",KDdata[3].value);
				localStorage.setItem("hourSubsidy",KDdata[4].value);
				localStorage.setItem("totalHours",KDdata[5].value);
				localStorage.setItem("frequency",KDdata[6].value);
				localStorage.setItem("place",KDdata[7].value);
				localStorage.setItem("address",KDdata[8].value);
				localStorage.setItem("penalty",KDdata[9].value);
				localStorage.setItem("memo",KDdata[10].value);

			}		
	}])
	
	//03预览课单控制器
	.controller('KDPreviewCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var ParentID = window.localStorage.getItem("ParentID");

            var type=window.localStorage.getItem("type");
            $scope.type='';
            if(type == 1){
            	$scope.type='常规课程';
            }

			$scope.studentName=window.localStorage.getItem("studentName");
			var subjectId=window.localStorage.getItem("subjectId");
			$scope.subjectId='';
        	if(subjectId == 2){
            	$scope.subjectId='小学/全科';
            }else if(subjectId == 3){
            	$scope.subjectId='小学/语文';
            }else if(subjectId == 4){
            	$scope.subjectId='小学/数学';
            }else if(subjectId == 5){
            	$scope.subjectId='小学/英语';
            }else if(subjectId == 7){
            	$scope.subjectId='初中/全科';
            }else if(subjectId == 8){
            	$scope.subjectId='初中/语文';
            }else if(subjectId == 9){
            	$scope.subjectId='初中/数学';
            }else if(subjectId == 10){
            	$scope.subjectId='初中/英语';
            }else if(subjectId == 11){
            	$scope.subjectId='初中/物理';
            }else if(subjectId == 12){
            	$scope.subjectId='初中/地理';
            }else if(subjectId == 13){
            	$scope.subjectId='初中/生物';
            }else if(subjectId == 14){
            	$scope.subjectId='初中/化学';
            }else if(subjectId == 15){
            	$scope.subjectId='初中/历史';
            }else if(subjectId == 16){
            	$scope.subjectId='初中/政治';
            }else if(subjectId == 18){
            	$scope.subjectId='高中/全科';
            }else if(subjectId == 19){
            	$scope.subjectId='高中/语文';
            }else if(subjectId == 20){
            	$scope.subjectId='高中/数学';
            }else if(subjectId == 21){
            	$scope.subjectId='高中/英语';
            }else if(subjectId == 22){
            	$scope.subjectId='高中/物理';
            }else if(subjectId == 23){
            	$scope.subjectId='高中/地理';
            }else if(subjectId == 24){
            	$scope.subjectId='高中/生物';
            }else if(subjectId == 25){
            	$scope.subjectId='高中/化学';
            }else if(subjectId == 26){
            	$scope.subjectId='高中/历史';
            }else if(subjectId == 27){
            	$scope.subjectId='高中/政治';
            }
			
			$scope.grade=window.localStorage.getItem("grade");			
			$scope.hourSubsidy=window.localStorage.getItem("hourSubsidy");
			$scope.totalHours=window.localStorage.getItem("totalHours");
			$scope.frequency=window.localStorage.getItem("frequency");
			
			//地点
			var place=window.localStorage.getItem("place");
			$scope.place='';
			if(place == 1){
				$scope.place='学生家中';
			}else if(place == 2){
				$scope.place='老师家中';
			}else if(place == 3){
				$scope.place='双方约定地点';
			}
			
			//订单总金额
			$scope.totalMoney=$scope.hourSubsidy * $scope.totalHours;  
			
			$scope.address=window.localStorage.getItem("address");
			
			//违约金
			
			var penalty=window.localStorage.getItem("penalty");	
			$scope.weiyuejin='';
			
			if(penalty){
				$scope.weiyuejin=penalty*$scope.totalMoney/100;
			}else{
				$scope.weiyuejin=0;
			}					
			$scope.memo=window.localStorage.getItem("memo");			
			$scope.time=new Date().getTime();
			$scope.goback=function(){
				$location.path('/kedanBegin/'+ParentID);
			}
			$scope.OKStart=function(){			
				$.ajax({
					type:"post",
					url:"/c/curriculum/creatCurriculum",
					data:{
						"c.target_id": ParentID,//家长id (传入上个页面中选中的家长ID)
						"c.type":type,//课程类型 1:常规课程/2:试课课程(参考下面需求，当前只能选择常规课程,传递数字1给后台)
						"c.student_name":$scope.studentName,//学生姓名
						"c.subject_id":subjectId,//课程ID，ID与课程对应关系同教室列表中一致
						"c.grade":$scope.grade,//年级(参考需求，"1.4请选择年级" ,直接传文字到后台)
						"c.hour_subsidy":$scope.hourSubsidy,//课时费，传递老师填写的金额，控制只能输入数字
						"c.total_hours":$scope.totalHours,//总课时，老师输入的数字，控制用户只允许输入数字
						"c.frequency":$scope.frequency,//预计上课次数。要求同上
						"c.place":place,//上课地点 (1:学生家中/2:老师家中/3:双方约定地点) 用户选择，传递数字到后台						
						"c.address":$scope.address,//选择区域后的详细地址，用户填写。（关于地址的这三项用户如何选择及填写可以和需求方沟通页面实现方式）
						"c.penalty":penalty,//违约金（参考需求 "1.9 订单违约金" 传递选择的百分比整数给后台，无的话传0，20%传20数字到后台）
						"c.memo":$scope.memo,//课单详细说明
					},
					datatype:'json',
					success:function(data){
						alert("课单发送成功，等待家长确认。");
						$location.path('/news/'+1);	
						$scope.$apply();
					}
				});				
			}
	
	}])	
	
	
	
	//04发起课次(上课)控制器
	.controller('RequestClassCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			$scope.currId=$routeParams.ID;
			$scope.surplusHouer='';
			$.ajax({
					type:"post",
					url:"/c/curriculum/getCurriculumInfo",
					data:{
						"currId": $scope.currId,//课单ID
					},
					datatype:"json",
					success:function(data){					
						$scope.surplusHouer=data.object.surplusHouer;
						$scope.$apply();
						
					}
				});
			 
			 
			 $scope.startClass=function(){
			 	var classlists=$("form").serializeArray(); 
			 	localStorage.setItem("classHour",classlists[0].value);
			 	localStorage.setItem("appDate",classlists[1].value);
			 	localStorage.setItem("TimeStard",classlists[2].value);
			 	localStorage.setItem("TimeEnd",classlists[3].value);
			 	localStorage.setItem("place",classlists[4].value);
			 	localStorage.setItem("address",classlists[5].value);
			 	localStorage.setItem("plan",classlists[6].value);							
			 }
	
	}])	
	
	
	//05生成课次预览控制器
	.controller('RCPreviewCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			$scope.currId=$routeParams.ID;			
			$scope.classHour=window.localStorage.getItem("classHour");
			$scope.appDate=window.localStorage.getItem("appDate");
			$scope.TimeStard=window.localStorage.getItem("TimeStard");
			$scope.TimeEnd=window.localStorage.getItem("TimeEnd");
			var placestate=window.localStorage.getItem("place");
			$scope.place='';
			if(placestate == 1){
				$scope.place='学生家中';
			}else if(placestate == 2){
				$scope.place='老师家中';
			}else if(placestate == 3){
				$scope.place='双方约定地点';
			}						
			$scope.address=window.localStorage.getItem("address");
			$scope.plan=window.localStorage.getItem("plan");
			$scope.time=new Date().getTime();
			
			$scope.submitClass=function(){
				$.ajax({
					type:"post",
					url:"/c/curriculumClass/saveClass",
					data:{
						"currId": $scope.currId,//课单ID
						"c.class_hour":$scope.classHour,//预计上课时长 整数
						"c.class_begin_date":$scope.appDate,//上课日期
						"c.class_begin_time":$scope.TimeStard,//开课时间
						"c.class_over_time":$scope.TimeEnd,//结课时间
						"c.place":placestate,//上课地点 (1:学生家中/2:老师家中/3:双方约定地点) 
						"c.address":$scope.address,//详细地址
						"c.plan":$scope.plan,//课程规划
					},
					datatype:"json",
					success:function(data){
						alert("课次已成功发送")
						$location.path('/SeeClass/'+$scope.currId);	
						$scope.$apply();

					}
				});				
			}


	}])	
	
	//06消息界面进入的课单详情控制器
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
						$location.path('/news/'+1);					

						$scope.$apply();
					}
				});

			}

			
			
	
	}])	
	
	
	//07消息界面进入的查看课次控制器
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
					console.log(data);
					$scope.$apply();
				}
			});	
			
			$scope.Report=function(id,report){
				var classId=id;
				var reports=report;
				console.log(classId);
				console.log(reports);
				if(reports){
					$location.path('/CEndPre/'+classId);	

				}else{
					$location.path('/CEnd/'+classId);	
					
				}
				
				
			}
			
			
			

	
	}])		
	
	//08消息界面进入的查看课次再进入课次详情控制器
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
					"classId": classId,//课次ID
				},
				datatype:"json",
				success:function(data){
					$scope.kecis=data.object;					

					$scope.$apply();
				}
			});
			//删除课次
			$scope.cancelClass=function(kedanID){
				var currId=kedanID;
				$.ajax({
					type:"post",
					url:"/c/curriculumClass/cancelClass",
					data:{
						"classId": classId,//课次ID
					},
					datatype:"json",
					success:function(data){				
						$location.path('/SeeClass/'+currId);	
						$scope.$apply();
					}
				});				

			}
			
			
			
	}])
	
	
	
	
	//09发起结课
	.controller('CEndCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			$scope.classId=$routeParams.ID;
			$scope.class_hour='';
			$.ajax({
					type:"post",
					url:"/c/curriculumClass/getClassInfo",
					data:{
						"classId": $scope.classId,//课单ID
					},
					datatype:"json",
					success:function(data){					
						$scope.class_hour=data.object.class_hour;
						$scope.$apply();
						
					}
				});			

			$scope.SCEnd=function(){
			 	var SCReport=$("form").serializeArray(); 
			 	localStorage.setItem("CHour",SCReport[0].value);
			 	localStorage.setItem("appDate1",SCReport[1].value);
			 	localStorage.setItem("TimeStard1",SCReport[2].value);
			 	localStorage.setItem("TimeEnd1",SCReport[3].value);
			 	localStorage.setItem("report",SCReport[4].value);							
			 }			
			
			

			
			
			
	}])		
	
	//10(预览)结课报告
	.controller('CEndPreCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			$scope.classId=$routeParams.ID;	
			
			
			$scope.CHour='';
			$scope.appDate1='';
			$scope.TimeStard1='';
			$scope.TimeEnd1='';			
			$scope.report='';			
			$scope.plan='';
			$scope.totalMN='';
			$scope.currId='';
			
			$.ajax({
				type:"post",
				url:"/c/curriculumClass/getClassInfo",
				data:{
					"classId": $scope.classId,//课次ID
				},
				datatype:"json",
				success:function(data){
				
					if(data.object.report){
						$scope.CHour=data.object.class_hour;
						$scope.appDate1=data.object.class_begin_date;
						$scope.TimeStard1=data.object.class_begin_time;
						$scope.TimeEnd1=data.object.class_over_time;			
						$scope.report=data.object.report;						
					}else if(!data.object.report){
						$scope.CHour=window.localStorage.getItem("CHour");
						$scope.appDate1=window.localStorage.getItem("appDate1");
						$scope.TimeStard1=window.localStorage.getItem("TimeStard1");
						$scope.TimeEnd1=window.localStorage.getItem("TimeEnd1");			
						$scope.report=window.localStorage.getItem("report");
					}										
					$scope.currId=data.object.curriculum_id;
					$scope.totalMN=$scope.CHour*data.object.hourSubsidy;
					$scope.plan=data.object.plan;
					$scope.currId=data.object.curriculum_id;					
					$scope.$apply();					
				}
			});	
			//生成结课报告
			$scope.CreateReport=function(currId){
				var currId=currId;
				$.ajax({
					type:"post",
					url:"/c/curriculumClass/reportClass",
					data:{
						"classId": $scope.classId,//课次ID
						"c.class_hour":$scope.CHour,//上课时长 整数
						"c.class_begin_date":$scope.appDate1,//上课日期
						"c.class_begin_time":$scope.TimeStard1,//开课时间
						"c.class_over_time":$scope.TimeEnd1,//结课时间
						"c.report":$scope.report,//课程报告
					},
					datatype:"json",
					success:function(data){
						alert("结课报告已发送，请耐心等待家长确认");
						$location.path('/SeeClass/'+currId);						
						$scope.$apply();
					}
				});					
			}
			
			
			
	}])	
	

	//11协商中止课单
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
							"stateCode":11,//状态编码，见下表
							"stopReason":resure,//协商中止原因
						},
						datatype:"json",
						success:function(data){
							alert("协商请求已发送，请耐心等待家长回复");	
							$location.path('/news/'+1);
							$scope.$apply();
						}
					});
				}else{
					alert("请填写您中止的原因");
				}

			}

	}])	
	
	//补习班开始------------------------------------------
	//12补习班开始上课(创建课次)
	.controller('BeginClassCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var courseId=$routeParams.ID;   //课程ID
			//进来默认读取缓存数据
			$scope.order_items=localStorage.getItem('order_items');
			$scope.items_number=localStorage.getItem('items_number').replace(/[^0-9]/ig,"");
			$scope.attend_class_hour=localStorage.getItem('attend_class_hour');
			$scope.course_date=localStorage.getItem('course_date');
			$scope.course_time=localStorage.getItem('course_time');
			$scope.over_time=localStorage.getItem('over_time');
			$scope.address=localStorage.getItem('address');
			$scope.plan=localStorage.getItem('plan');			
			
			
			//点击选择学生
			$scope.studentlist='';
			
			$scope.Sestudents=function(){
				$('#BeginClass').fadeOut();
				//获取可选学生列表
				$.ajax({
					type:"post",
					url:"/cramLesson/findStudentInfos",
					data:{
						"courseId": courseId,//课单ID
					},
					datatype:"json",
					success:function(data){
						$scope.studentlist=data.object;
						$scope.$apply();
					}
				});
				$('#Sestudents').fadeIn();
			}
			//取消选择完学生后膜态框消失
			$scope.cancelSelect=function(){
				$('#Sestudents').fadeOut();
				$('#BeginClass').fadeIn();
			}
			$scope.ensureSelect=function(){
				$('#Sestudents').fadeOut();			
				$('#sele-students').val($('.Ses-tabs-L').html());
				$('#BeginClass').fadeIn();
			}
			//选择全部学生事件	
			
			$scope.checkmountStu=0;     //选择的人数
			$scope.SeAllStudents=function(){
				if($('.BC-checkAll').hasClass('checksActiveAll')){
					$('.BC-checkAll').removeClass('checksActiveAll');
					$('.BC-check01').removeClass('checksActive');
					$('.BC-listTop').removeClass('BC-active');
					$scope.checkmountStu=0;
					studentsIDList=[];
				}else if(!$('.BC-checkAll').hasClass('checksActiveAll')){
					$('.BC-checkAll').addClass('checksActiveAll');
					$('.BC-check01').addClass('checksActive');
					$('.BC-listTop').addClass('BC-active');
					$scope.checkmountStu=$('.checksActive').length;	
			  		var SeStu01=document.getElementsByClassName("BC-check01");			
					for(var i=0; i<SeStu01.length;i++){						
						//构造学生ID列表
						studentsIDList.push($('.BC-check01').eq(i).attr('data-studentID'));
					}						
				}
			}
			//单个学生点击事件
			var studentsIDList=[];
			//ng-repeat之后再绑定事件--课单展开关闭
			$scope.$on('ngRepeatFinished', function( ngRepeatFinishedEvent ) {				
				var SeStu=document.getElementsByClassName("BC-check01");			
				for(var i=0; i<SeStu.length;i++){
					SeStu[i].onclick=function(){				
						var indexx=$(".BC-check01").index($(this));
						$(this).toggleClass('checksActive');
						$('.BC-listTop').eq(indexx).toggleClass('BC-active');
						$scope.checkmountStu=$('.checksActive').length;
						//构造学生ID列表
						studentsIDList.push($(this).attr('data-studentID'));
						$scope.$apply();
					}
				}					
		
			})			

			//生成课次--跳到课次预览界面
			$scope.generateLessons=function(){
				var LessonsText=$('#BC-data').serializeArray();
				
				localStorage.setItem('order_items',studentsIDList);
				localStorage.setItem('items_number',LessonsText[0].value);
				localStorage.setItem('attend_class_hour',LessonsText[1].value);
				localStorage.setItem('course_date',LessonsText[2].value);
				localStorage.setItem('course_time',LessonsText[3].value);
				localStorage.setItem('over_time',LessonsText[4].value);
				localStorage.setItem('address',LessonsText[5].value);
				localStorage.setItem('plan',LessonsText[6].value);
				$location.path('/ensureClass/'+courseId);
			}

	}])		
	
	//13预览补习班课单
	.controller('ensureClassCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			$scope.courseId=$routeParams.ID;   //课程ID

			$scope.order_items=localStorage.getItem('order_items').toString();
			$scope.items_number=localStorage.getItem('items_number').replace(/[^0-9]/ig,"");
			$scope.attend_class_hour=localStorage.getItem('attend_class_hour');
			$scope.course_date=localStorage.getItem('course_date');
			$scope.course_time=localStorage.getItem('course_time');
			$scope.over_time=localStorage.getItem('over_time');
			$scope.address=localStorage.getItem('address');
			$scope.plan=localStorage.getItem('plan');

			$scope.submitClass=function(){
				$.ajax({
					type:"post",
					url:"/cramLesson/createLesson",
					data:{
						"le.courser_id":$scope.courseId,  //所发布课次所属课程ID
						"le.order_items":$scope.order_items,  //通过查询指定课程名下学员，选中的学院student_id
						"le.attend_class_hour":$scope.attend_class_hour, //上课时长小时数
						"le.course_date":$scope.course_date,  //上课日期
						"le.course_time":$scope.course_time,  //开始时间
						"le.over_time":$scope.over_time,   //结束时间
						"le.address":$scope.address,//上课地址
						"le.plan":$scope.plan,//课程规划
					},
					datatype:"json",
					success:function(data){
						alert(data.msg);
						$location.path('/AllClassDe/'+$scope.courseId);
						$scope.$apply();
					}
				});
										
			}




	}])		
	
	//14查看全部课次（可以看全部课次）
	.controller('AllClassDeCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var courseId=$routeParams.ID;
			
			//进来清结课界面的缓存
			localStorage.setItem('items_number','');
			localStorage.setItem('attend_class_hour','');
			localStorage.setItem('course_date','');
			localStorage.setItem('course_time','');
			localStorage.setItem('over_time','');
			localStorage.setItem('report','');

			$scope.goback=function(){
				$location.path('/news/'+2);
			}
			//进来默认获取全部课次
			$scope.lessonchildsList='';
			$.ajax({
				type:"post",
				url:"/cramLesson/getLessonListByCourse",
				data:{
					"courseId": courseId,//课程ID
				},
				datatype:"json",
				success:function(data){
					$scope.lessonchildsList=data.object;			
					$scope.$apply();
				}
			});
			//查看课次详情
			$scope.goLessonchildDetail=function(state,id){
				if(state == 0){
					$location.path('/LDetai01/'+id);
				}else if(state == 1){
					$location.path('/LDetai02/'+id);
				}else if(state == 2){
					$location.path('/LDetai03/'+id);
				}
			}
	}])		
	
	//15发起结课
	.controller('GLessonsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var courseId=$routeParams.CID;
			var lessonId=$routeParams.LID;
			$scope.goback=function(){
				window.history.back();
			}
			//进来读取缓存
			$scope.order_items=localStorage.getItem('order_items').toString();
			$scope.items_number=localStorage.getItem('items_number');
			$scope.course_time=localStorage.getItem('course_time');
			$scope.over_time=localStorage.getItem('over_time');
			$scope.plan=localStorage.getItem('report');
			
			//点击选择学生
			$scope.studentlist='';
			$scope.Sestudents=function(){
				$('.GuitarLessons').fadeOut();
				//获取可选学生列表
				$.ajax({
					type:"post",
					url:"/cramLesson/findStudentInfos",
					data:{
						"courseId": courseId,//课单ID
					},
					datatype:"json",
					success:function(data){
						$scope.studentlist=data.object;
						$scope.$apply();
					}
				});								
				$('#Sestudents').fadeIn();
			}
			//取消选择完学生后膜态框消失
			$scope.cancelSelect=function(){
				$('#Sestudents').fadeOut();
				$('.GuitarLessons').fadeIn();
			}
			$scope.ensureSelect=function(){
				$('#Sestudents').fadeOut();				
				$('#sele-students').val($('.Ses-tabs-L').html());
				$('.GuitarLessons').fadeIn();
			}
			//选择全部学生事件			
			$scope.checkmountStu=0;     //选择的人数
			$scope.SeAllStudents=function(){
				if($('.BC-checkAll').hasClass('checksActiveAll')){
					$('.BC-checkAll').removeClass('checksActiveAll');
					$('.BC-check01').removeClass('checksActive');
					$('.BC-listTop').removeClass('BC-active');
					$scope.checkmountStu=0;
					studentsIDList=[];
				}else if(!$('.BC-checkAll').hasClass('checksActiveAll')){
					$('.BC-checkAll').addClass('checksActiveAll');
					$('.BC-check01').addClass('checksActive');
					$('.BC-listTop').addClass('BC-active');
					$scope.checkmountStu=$('.checksActive').length;	
					var SeStu01=document.getElementsByClassName("BC-check01");			
					for(var i=0; i<SeStu01.length;i++){						
						//构造学生ID列表
						studentsIDList.push($('.BC-check01').eq(i).attr('data-studentID'));
					}
				}
			}
	
			//单个学生点击事件
			var studentsIDList=[];
			//ng-repeat之后再绑定事件--课单展开关闭
			$scope.$on('ngRepeatFinished', function( ngRepeatFinishedEvent ) {				
				var SeStu=document.getElementsByClassName("BC-check01");			
				for(var i=0; i<SeStu.length;i++){
					SeStu[i].onclick=function(){				
						var indexx=$(".BC-check01").index($(this));
						$(this).toggleClass('checksActive');
						$('.BC-listTop').eq(indexx).toggleClass('BC-active');
						$scope.checkmountStu=$('.checksActive').length;
						//构造学生ID列表
						studentsIDList.push($(this).attr('data-studentID'));
						$scope.$apply();
					}
				}					
		
			})	

			$scope.PreReport=function(){
				var LessonsText=$('#BC-data').serializeArray();
				
				localStorage.setItem('order_items',studentsIDList);
				
				localStorage.setItem('items_number',LessonsText[0].value);
				localStorage.setItem('attend_class_hour',LessonsText[1].value);
				localStorage.setItem('course_date',LessonsText[2].value);
				localStorage.setItem('course_time',LessonsText[3].value);
				localStorage.setItem('over_time',LessonsText[4].value);
				localStorage.setItem('report',LessonsText[5].value);
				
				$location.path('/PreLessons/'+courseId+'/'+lessonId);

			}



	}])	
	
	//16发起结课前预览
	.controller('PreLessonsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var courseId=$routeParams.CID;
			var lessonId=$routeParams.LID;
			$scope.goback=function(){
				window.history.back();
			}

			$scope.order_items=localStorage.getItem('order_items').toString();
			$scope.items_number=localStorage.getItem('items_number').replace(/[^0-9]/ig,"");
			$scope.attend_class_hour=localStorage.getItem('attend_class_hour');
			$scope.course_date=localStorage.getItem('course_date');
			$scope.course_time=localStorage.getItem('course_time');
			$scope.over_time=localStorage.getItem('over_time');
			$scope.report=localStorage.getItem('report');
						
			//获取课次详情
			$scope.lessonPlan='';  //课程规划
			$.ajax({
				type:"post",
				url:"/cramLesson/getLessons",
				data:{
					"cramLessonsId": lessonId,//课单ID
				},
				datatype:"json",
				success:function(data){
					$scope.lessonPlan=data.object.plan;
					$scope.$apply();
				}
			});

			$scope.CreateReport=function(){
				$.ajax({
					type:"post",
					url:"/cramLesson/sponsorFinishClass",
					data:{
						"cramLessonId": lessonId,//课单ID
						'le.order_items':$scope.order_items,//所选中的学员ID
						'le.attend_class_hour':$scope.attend_class_hour,//实际时长
						'le.course_date':$scope.course_date,//上课日期
						'le.course_time':$scope.course_time,//上课时间
						'le.over_time':$scope.over_time,//结课时间
						'le.report':$scope.report ,//课程报告
					},
					datatype:"json",
					success:function(data){
						alert(data.msg);
						if(data.isSuccess){
							$location.path('/AllClassDe/'+courseId);
						}						
						$scope.$apply();
					}
				});				
				
				
			}




	}])		
	
	//17课次详情--状态01--上课中
	.controller('LDetai01Ctl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var cramLessonsId=$routeParams.ID;
			$scope.goback=function(courserId){
				$location.path('/AllClassDe/'+courserId);
			}
			$scope.cramLessondata='';
			$.ajax({
				type:"post",
				url:"/cramLesson/getLessons",
				data:{
					"cramLessonsId": cramLessonsId,//课程ID
				},
				datatype:"json",
				success:function(data){
					$scope.cramLessondata=data.object;
					$scope.$apply();
				}
			});
			
			
			
			
			
			
			
			
			
			


	}])	
	
	//18课次详情--状态02--待结课
	.controller('LDetai02Ctl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var cramLessonId=$routeParams.ID;   //课次id
			$scope.goback=function(courserId){
				$location.path('/AllClassDe/'+courserId);
			}

			//点击选择学生--未确认人数----------------------------------------
			$scope.UnconfirmedStudent='';
			$scope.Sestudents=function(){
				$('.LessonsDet').fadeOut();
				//未确认人数
				$.ajax({
					type:"post",
					url:"/cramLesson/getUnconfirmedStudentList",
					data:{
						"cramLessonId": cramLessonId,//课次ID
					},
					datatype:"json",
					success:function(data){
						$scope.UnconfirmedStudent=data.object;
						$scope.$apply();
					}
				});				
				$('#Sestudents').fadeIn();
			}
			
			//点击选择学生--已拒绝人数--------------------------------
			$scope.rejectStudent='';		
			$scope.Sestudents01=function(){
				$('.LessonsDet').fadeOut();
				//已拒绝人数
				$.ajax({
					type:"post",
					url:"/cramLesson/rejectStudentList",
					data:{
						"cramLessonId": cramLessonId,//课次ID
					},
					datatype:"json",
					success:function(data){
						$scope.rejectStudent=data.object;
						$scope.$apply();
					}
				});
				$('#Sestudents01').fadeIn();
				
			}			
			//取消选择完学生后膜态框消失
			var rejectStudentIDList=[];   //拒绝学生ID列表
			$scope.cancelSelect=function(){
				$('#Sestudents').fadeOut();
				$('#Sestudents01').fadeOut();
				$('.LessonsDet').fadeIn();
				rejectStudentIDList=[];
			}
			//单个学生点击事件

			var rejectStudentIDList=[];
			//ng-repeat之后再绑定事件--课单展开关闭
			$scope.$on('ngRepeatFinished', function( ngRepeatFinishedEvent ) {				
				var SeStu=document.getElementsByClassName("BC-check01");			
				for(var i=0; i<SeStu.length;i++){
					SeStu[i].onclick=function(){				
						var indexx=$(".BC-check01").index($(this));
						$(this).toggleClass('checksActive');
						$('.BC-listTop').eq(indexx).toggleClass('BC-active');
						$scope.checkmountStu=$('.checksActive').length;
						//构造学生ID列表
						rejectStudentIDList.push($(this).attr('data-RStudentId'));
						$scope.$apply();
					}
				}					
		
			})
			//重新提交结课
			$scope.GuitarAgain=function(Lid){
				//Lid课次id
				$.ajax({
					type:"post",
					url:"/cramLesson/againFinishClass",
					data:{
						"cramLessonId": Lid,//课程ID
						"cramLessonItemIds": rejectStudentIDList.toString(),  //重新提交结课学生ID
					},
					datatype:"json",
					success:function(data){
						alert(data.msg);
						if(data.isSuccess){
							$('#Sestudents01').fadeOut();
						}
					}
				});				
				
				
				
			}
									
			//获取界面相关数据
			$scope.cramLessondata='';
			$.ajax({
				type:"post",
				url:"/cramLesson/getLessons",
				data:{
					"cramLessonsId": cramLessonId,//课程ID
				},
				datatype:"json",
				success:function(data){
					$scope.cramLessondata=data.object;	
					$scope.$apply();
				}
			});


	}])	
	
	//19课次详情--状态03--已结课
	.controller('LDetai03Ctl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var cramLessonsId=$routeParams.ID;     //课次ID
			$scope.goback=function(courserId){
				$location.path('/AllClassDe/'+courserId);
			}

			//获取界面相关数据
			$scope.cramLessondata='';
			$scope.lessonPlan='';   //获取课次规划
			$.ajax({
				type:"post",
				url:"/cramLesson/getLessons",
				data:{
					"cramLessonsId": cramLessonsId,//课次ID
				},
				datatype:"json",
				success:function(data){
					$scope.cramLessondata=data.object;
					$scope.$apply();
				}
			});

	}])		
	
	//20补习班课单详情
	.controller('SingleClassDetailCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var courseId=$routeParams.ID;
			$scope.goback=function(){
				window.history.back();
			}
			$scope.SingleClassinfo='';   //获取课次规划
			$.ajax({
				type:"post",
				url:"/cramCourse/getCourse",
				data:{
					"courseId": courseId,//课次ID
				},
				datatype:"json",
				success:function(data){
					$scope.SingleClassinfo=data.object;
					$scope.$apply();
				}
			});











	}])		
	
	
	
	
	
	
	
	
	
	
	
})(angular)
