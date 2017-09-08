(function(angular){
	'use strict';
	angular.module('MStudentShop',[
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
		//01没有店铺状态
		$routeProvider.when('/noshop/',{
			templateUrl:'StudentShop/noShop.html',
			controller:'noShopCtl'
		})
		//02创建店铺
		.when('/Asshop/',{
			templateUrl:'StudentShop/applySShop.html',
			controller:'AsshopCtl'
		})
		//03支付界面
		.when('/payment/:ID',{
			templateUrl:'StudentShop/payment.html',
			controller:'paymentCtl'
		})
		//04我的店铺
		.when('/myshop/',{
			templateUrl:'StudentShop/myshop.html',
			controller:'myshopCtl'
		})		
		//05店铺信息
		.when('/shopDetails/:ID',{
			templateUrl:'StudentShop/shopDetails.html',
			controller:'shopDetailsCtl'
		})		
		//06创建课程
		.when('/CreateLesson/:ID',{
			templateUrl:'StudentShop/CreateLesson.html',
			controller:'CreateLessonCtl'
		})		
		//07课程详情
		.when('/LessionDetails/:ID',{
			templateUrl:'StudentShop/LessionDetails.html',
			controller:'LessionDetailsCtl'
		})		
		//08下架课程列表
		.when('/OffTheShelf/:ID',{
			templateUrl:'StudentShop/OffTheShelf.html',
			controller:'OffTheShelfCtl'
		})	
		//09重新上架
		.when('/AgainTheShelves/:ID',{
			templateUrl:'StudentShop/AgainTheShelves.html',
			controller:'AgainTheShelvesCtl'
		})		
		//10重新上架课程编辑界面
		.when('/TheShelvesTable/:ID',{
			templateUrl:'StudentShop/TheShelvesTable.html',
			controller:'TheShelvesTableCtl'
		})		
		//11生源场地
		.when('/PlaceAndChild/',{
			templateUrl:'PlaceLease/PlaceAndChild.html',
			controller:'PlaceAndChildCtl'
		})		
		//12发布场地表单
		.when('/ReleasePlace/',{
			templateUrl:'PlaceLease/ReleasePlace.html',
			controller:'ReleasePlaceCtl'
		})		
		//13场地详情
		.when('/PlaceDetails/:ID',{
			templateUrl:'PlaceLease/PlaceDetails.html',
			controller:'PlaceDetailsCtl'
		})		
		//14支付成功中转界面
		.when('/PlaceUnpaid/:ID/:CID',{
			templateUrl:'PlaceLease/PlaceUnpaid.html',
			controller:'PlaceUnpaidCtl'
		})		
		//15支付成功中转界面
		.when('/PaySuccess/:ID',{
			templateUrl:'PlaceLease/PaySuccess.html',
			controller:'PaySuccessCtl'
		})		
		//16发起结课
		.when('/getOverL/:ID',{
			templateUrl:'StudentShop/getOverLession.html',
			controller:'getOverLCtl'
		})		
		//17结课信息
		.when('/OverLDetail/:ID',{
			templateUrl:'StudentShop/OverLessionDetail.html',
			controller:'OverLDetailCtl'
		})		
		
		
		
		
		
	}])
	//01没有店铺状态
	.controller('noShopCtl',[
		'$scope',
		'$location',
		'$routeParams',
		'$route',
		function($scope,$location,$routeParams,$route){
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//02是否有店铺（补习班）		
			$scope.ishaveShop=function(){
				$.ajax({
					type:"post",
					url:"/cramSchool/getCramSchoolState",
					data:{},
					datatype:"json",
					success:function(data){
						if(data.object==null){
							$location.path('/Asshop/');
						}else{
							if(data.object.state == 1){
								$location.path('/Asshop/');
							}else if(data.object.state == 2){
								$location.path('/myshop/');
							}else if(data.object.state == 3){
								$location.path('/myshop/');
							}else if(data.object.state == 4){
								$location.path('/myshop/');
							}
						}
						$scope.$apply();
					}
				});				
				
				
				
			}		
	
	}])

	//02创建店铺
	.controller('AsshopCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01上传头像蒙版出现
			$scope.fileImgShow=function(){
				$('#fileimg').fadeIn();
			}
			//02返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}				
			//03店铺类型选择
			var CDtabs=document.getElementsByClassName('YYList_btn');			
			for(var i=0; i<CDtabs.length;i++){
				CDtabs[i].onclick=function(){
					var indexx=$('.YYList_btn').index($(this));
					$('.ToggBtn').eq(indexx).toggleClass('icon-yuan20');
				}
			}			
			//04提交店铺信息跳支付页
			
			$scope.Release=function(){
				var schoolType=[];
				var SType=document.getElementsByClassName('icon-yuan20');			
				for(var i=0; i<SType.length;i++){
					var STypeData=SType[i].getAttribute('data_schoolType');
					schoolType.push(STypeData);
				}				
								
				$("#school_type").val(schoolType.toString());				
				var formData = new FormData($( "#form" )[0]);
				var data=$("#fileData").val();
				// dataURL 的格式为 “data:image/png;base64,****”,逗号之前都是一些说明性的文字，我们只需要逗号之后的就行了
				data=data.split(',')[1];
				data=window.atob(data);
				var ia = new Uint8Array(data.length);
				for (var i = 0; i < data.length; i++) {
				    ia[i] = data.charCodeAt(i);
				};
				// canvas.toDataURL 返回的默认格式就是 image/png
				var blob=new Blob([ia], {type:"image/png"});
				formData.append('file',blob);			
				$.ajax({
					type:"post",
					url:"/cramSchool/apply",
					data:formData,
					datatype:"json",
					async: false,
					cache: false,
					contentType: false,
					processData: false,
					success:function(data){	
						localStorage.setItem('payTotal',300);  //支付金额
						if(data.isSuccess){
							$location.path('/payment/1');   //1为店铺保证金支付
						}else{
							alert(data.msg);
						}
						$scope.$apply();
					}
				});				
				
				
				
			}
			

	}])
	
	//03支付公共界面
	.controller('paymentCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01获取支付入口类型ID，1是店铺补习班支付 2是场地支付
			$scope.EntranceId=$routeParams.ID;
			//02支付类型选择
			var CDtabs=document.getElementsByClassName('PayStyle');			
			for(var i=0; i<CDtabs.length;i++){
				CDtabs[i].onclick=function(){
					var indexx=$('.PayStyle').index($(this));
					for(var i=0; i<CDtabs.length;i++){
						$('.icon-yuan06').removeClass('icon-yuan23');
					}
					$('.icon-yuan06').eq(indexx).toggleClass('icon-yuan23');
				}
			}
			//03返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}
			//04获取支付金额
			$scope.payTotals=localStorage.getItem('payTotal');
			//05支付动作
			$scope.PayMenoy=function(){
				var Pstyle=$('.icon-yuan23').attr('data-Pstyle');
				if($scope.EntranceId == 1){
					if(Pstyle == 1){
						window.location.href="/c/pay/payForCramSchoolApply?cramSchoolId=";	
					}else if(Pstyle == 2){
						$.ajax({					
							type:"post",
							url:"/cramSchool/payForApply",
							data:{},
							datatype:"json",
							success:function(data){
								alert(data.msg);
								if(data.isSuccess){
									$location.path('/myshop/');
								}							
								$scope.$apply();								
							}
						})					
					}					
				}else if($scope.EntranceId == 2){
					var orderId=localStorage.getItem('orderId');     //订单ID
					if(Pstyle == 1){
						window.location.href="/c/pay/payRentOrder?orderId="+orderId;	
					}else if(Pstyle == 2){							
						$.ajax({					
							type:"post",
							url:"/c/pay/payRentOrderByYue",
							data:{
								'orderId':orderId,   //订单ID
							},
							datatype:"json",
							success:function(data){	
								if(data.isSuccess){
									$location.path('/PaySuccess/'+data.object.id)
								}else{
									alert(data.msg);
								}
								$scope.$apply();	
							}
						})				
					}
	
				}else if($scope.EntranceId == 3){     //3为场地保证金					
					if(Pstyle == 1){
						window.location.href="/c/pay/payCationMoney";	
					}else if(Pstyle == 2){	
						$.ajax({					
							type:"post",
							url:"/c/pay/payCautionMoneyByYue",
							data:{},
							datatype:"json",
							success:function(data){	
								alert(data.msg);
								if(data.isSuccess){
									$location.path('/PlaceAndChild/')
								}
								$scope.$apply();	
							}
						})				
					}
	
				}

			}

	
	}])	
	
	
	//04我的店铺
	.controller('myshopCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01课程/评论tabs js
			tabsfn('YY_tabA','.YY_tabA','.YY_tabA01','YYtabA-active');
			//02更多按钮展示
			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				
				var moreOperation=document.getElementsByClassName('moreOperation');			
				for(var i=0; i<moreOperation.length;i++){
					moreOperation[i].onclick=function(){
						var indexx=$('.moreOperation').index($(this));
						$('.OperationList').eq(indexx).slideToggle("slow");
					}
				}							
		
			})
			//03返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//04创建课程
			$scope.CreateLesson=function(id){
				$location.path('/CreateLesson/'+id);
			}			
			//05下架课程列表
			$scope.OffTheShelf=function(id){
				$location.path('/OffTheShelf/'+id)
			}
			//06获取店铺基本信息
			$scope.ShopInfo='';
			$scope.ishavecram='';
			$scope.CramCourseList='';
			$scope.cramStatetext='';
			$scope.isShow='';
			function getdatainfo(){
				$.ajax({					
					type:"post",
					url:"/cramSchool/getCramSchoolState",
					data:{},
					datatype:"json",
					success:function(data){
						$scope.ShopInfo=data.object;
						if(data.object.state == 2){
							$scope.cramStatetext='店铺审批中...';
							$scope.isShow=false;
						}else if(data.object.state == 3){
							$scope.cramStatetext='您还没有课程，赶快创建一个吧';
							$scope.isShow=true;
						}else if(data.object.state == 4){
							$scope.cramStatetext='审核不通过,请7天后再申请';
							$scope.isShow=false;
						}
						
						$.ajax({					
							type:"post",
							url:"/cramCourse/getCramCourseListBySchoolId",
							data:{
								'schoolId': data.object.id,
							},
							datatype:"json",
							success:function(data){
								$scope.CramCourseList=data.object.list;
								if(data.object.list.length == 0){
									$scope.ishavecram=true;
								}else if(data.object.list.length > 0){
									$scope.ishavecram=false;
								}
								$scope.$apply();								
							}
						})					
						
						$scope.$apply();	
					}
				})				
			}
			getdatainfo();



			//07下架课程操作
			$scope.getdownLession=function(CramCourseId){
				$.ajax({					
					type:"post",
					url:"/cramCourse/soldOutCourse",
					data:{
						'courseId': CramCourseId,
					},
					datatype:"json",
					success:function(data){
						alert(data.msg);
						if(data.isSuccess){
							getdatainfo();							
						}
						$scope.$apply();								
					}
				})				

			}
			
			
			
			
			







	
	}])	
	
	//05店铺信息
	.controller('shopDetailsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//02获取课程信息
			$scope.ShopInfo='';
			$.ajax({					
				type:"post",
				url:"/cramSchool/getCramSchoolState",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.ShopInfo=data.object;
					$scope.$apply();								
				}
			})	

	
	}])
	
	//06创建课程
	.controller('CreateLessonCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var Cid=$routeParams.ID;   //补习班ID
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//02优惠类型选择
			var CDtabs=document.getElementsByClassName('activitylist');			
			for(var i=0; i<CDtabs.length;i++){
				CDtabs[i].onclick=function(){
					var indexx=$('.activitylist').index($(this));
					$('.icon-yuan06').eq(indexx).toggleClass('icon-yuan20');
				}
			}	
			
			//03课程表消失
			$scope.CSCardfadeOut=function(){
				$('#ClassScheduleCard').fadeOut();
				$('.CreateLesson').fadeIn();
			}
			//04课程表展示
			$scope.CSCardfadeIn=function(){
				$('.CreateLesson').fadeOut();
				$('#ClassScheduleCard').fadeIn();
			}		
			//05确定课程表
			$scope.Determine=function(){
				$scope.CSCardfadeOut();
			}
			//06课表时间选择动作
			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				var selectToggle=document.getElementsByClassName('selectToggle');			
				for(var i=0; i<selectToggle.length;i++){
					selectToggle[i].onclick=function(){
						var indexx=$('.selectToggle').index($(this));
						$('.selectToggle').eq(indexx).toggleClass('timeData-active');						
					}
				}										
			})			
			//07获取课程表
			$scope.Schedule='';
			$.ajax({					
				type:"post",
				url:"/cramCourse/getCalendarDate",
				data:{
					'cramCourseId':Cid,  //课程ID
					'days':90,
				},
				datatype:"json",
				success:function(data){
					$scope.Schedule=data;
					$scope.$apply();								
				}
			})	
			//08获取课程类型
			$scope.schoolTypeList='';
			$.ajax({					
				type:"post",
				url:"/cramSchool/getCramSchoolState",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.schoolTypeList=data.object.schoolTypeList;
					$scope.$apply();								
				}
			})			

			
			//09创建课程动作
			$scope.PublishLesson=function(LDId){
				var course_name=$('#course_name').val();
				var school_type_id=$('#school_type_id').val();
				var course_hour=$('#course_hour').val();
				var hour_price=$('#hour_price').val();
				var introduction=$('#introduction').val();
				
				var tryOut=0;
				if($('#mianfei').is('.icon-yuan20')){
					tryOut=1;
				}				
				var discount='';
				if($('#zhe').is('.icon-yuan20')){
					discount=$('#zhenumber').val();;
				}
				var cramTimetables=[];
				var timeDataActive=document.getElementsByClassName('timeData-active');			
				for(var i=0; i<timeDataActive.length;i++){					
					cramTimetables.push(timeDataActive[i].getAttribute('data-startTime'));					
				}				
				$.ajax({					
					type:"post",
					url:"/cramCourse/createCramCourse",
					data:{
						"c.cram_school_id":Cid,
						"c.school_type_id":school_type_id,
						"c.course_name":course_name,
						"c.course_hour":course_hour,
						"c.hour_price":hour_price,
						"c.introduction":introduction ,
						"c.try_out":tryOut,
						"c.discount":discount,
						"cramTimetable":cramTimetables.toString(),
					},
					datatype:"json",
					success:function(data){
						alert(data.msg);
						if(data.isSuccess){
							$location.path('/myshop/');
						}
						$scope.$apply();								
					}
				})				
				
			}
			
			
			
	}])	

	//07课程详情
	.controller('LessionDetailsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var Cid=$routeParams.ID;   //课程ID
			//01返回上一页历史
			$scope.goback=function(){
				$location.path('/news/2');
			}	
			//02课程表消失
			$scope.CSCardfadeOut=function(){
				$('#ClassScheduleCard').fadeOut();
				$('.LessionDetails').fadeIn();
			}
			//03课程表展示
			$scope.CSCardfadeIn=function(){
				$('.LessionDetails').fadeOut();				
				$('#ClassScheduleCard').fadeIn();
			}		
			//04确定课程表
			var ClassCard=[];
			$scope.Determine=function(){
				$scope.CSCardfadeOut();
//				var timeData=document.getElementsByClassName('timeData-active');			
//				for(var i=0; i<timeData.length;i++){											
//						ClassCard.push(timeData[i].getAttribute('data-startTime'));	
//				}					
			}
			//05课表时间选择动作

			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				var selectToggle=document.getElementsByClassName('selectToggle');			
				for(var i=0; i<selectToggle.length;i++){
					selectToggle[i].onclick=function(){
						var indexx=$('.selectToggle').index($(this));
						$('.selectToggle').eq(indexx).toggleClass('timeData-active');						
					}
				}										
			})			
			
			
			
			//06获取课程表
			$scope.Schedule='';
			$.ajax({					
				type:"post",
				url:"/cramCourse/getCalendarDate",
				data:{
					'cramCourseId':Cid,  //课程ID
					'days':90,
				},
				datatype:"json",
				success:function(data){
					$scope.Schedule=data;
					$scope.$apply();								
				}
			})
			//07获取课程基本信息
			$scope.lessionDetail='';
			$.ajax({					
				type:"post",
				url:"/cramCourse/getCourse",
				data:{
					'courseId':Cid ,  //课程ID
				},
				datatype:"json",
				success:function(data){
					$scope.lessionDetail=data.object;
					$scope.$apply();								
				}
			})
			//08学员信息表展示
			$scope.studentListShow=function(a){
				$(a).slideToggle();
			}

			
			
			
			
			

	
	}])


	//08下架课程列表
	.controller('OffTheShelfCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//02获取下架课程列表
			$scope.TheShelfList='';
			$.ajax({					
				type:"post",
				url:"/cramCourse/getSoldOutCourseList",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.TheShelfList=data.object;
					$scope.$apply();								
				}
			})		

	
	}])

	//09重新上架
	.controller('AgainTheShelvesCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var Cid=$routeParams.ID;   //课程ID
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//02课程表消失
			$scope.CSCardfadeOut=function(){
				$('#ClassScheduleCard').fadeOut();
				$('.AgainTheShelves').fadeIn();
			}
			//03课程表展示
			$scope.CSCardfadeIn=function(){
				$('.AgainTheShelves').fadeOut();
				$('#ClassScheduleCard').fadeIn();
			}		
			//04确定课程表
			$scope.Determine=function(){
				$scope.CSCardfadeOut();
			}
			//05课表时间选择动作
			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				var selectToggle=document.getElementsByClassName('selectToggle');			
				for(var i=0; i<selectToggle.length;i++){
					selectToggle[i].onclick=function(){
						var indexx=$('.selectToggle').index($(this));
						$('.selectToggle').eq(indexx).toggleClass('timeData-active');						
					}
				}										
			})
			//06学员和评论信息表展示
			$scope.studentListShow=function(a){
				$(a).slideToggle();
			}		
			//08获取课程表
			$scope.Schedule='';
			$.ajax({					
				type:"post",
				url:"/cramCourse/getCalendarDate",
				data:{
					'cramCourseId':Cid,  //课程ID
					'days':90,
				},
				datatype:"json",
				success:function(data){
					$scope.Schedule=data;
					$scope.$apply();								
				}
			})
			//09获取课程基本信息
			$scope.lessionDetail='';
			$.ajax({					
				type:"post",
				url:"/cramCourse/getCourse",
				data:{
					'courseId':Cid ,  //课程ID
				},
				datatype:"json",
				success:function(data){
					$scope.lessionDetail=data.object;
					$scope.$apply();								
				}
			})	
			//10重新上架编辑动作
			$scope.AgainTheShelves=function(LDId){
				$location.path('/TheShelvesTable/'+LDId);	
			}
			
			


	}])
	//10重新上架课程编辑界面
	.controller('TheShelvesTableCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var Cid=$routeParams.ID;   //课程ID
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//02优惠类型选择
			var CDtabs=document.getElementsByClassName('activitylist');			
			for(var i=0; i<CDtabs.length;i++){
				CDtabs[i].onclick=function(){
					var indexx=$('.activitylist').index($(this));
					$('.icon-yuan06').eq(indexx).toggleClass('icon-yuan20');
				}
			}	
			
			//03课程表消失
			$scope.CSCardfadeOut=function(){
				$('#ClassScheduleCard').fadeOut();
				$('.CreateLesson').fadeIn();
			}
			//04课程表展示
			$scope.CSCardfadeIn=function(){
				$('.CreateLesson').fadeOut();
				$('#ClassScheduleCard').fadeIn();
			}		
			//05确定课程表
			$scope.Determine=function(){
				$scope.CSCardfadeOut();
			}
			//06课表时间选择动作
			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				var selectToggle=document.getElementsByClassName('selectToggle');			
				for(var i=0; i<selectToggle.length;i++){
					selectToggle[i].onclick=function(){
						var indexx=$('.selectToggle').index($(this));
						$('.selectToggle').eq(indexx).toggleClass('timeData-active');						
					}
				}										
			})			
			//07获取课程表
			$scope.Schedule='';
			$.ajax({					
				type:"post",
				url:"/cramCourse/getCalendarDate",
				data:{
					'cramCourseId':Cid,  //课程ID
					'days':90,
				},
				datatype:"json",
				success:function(data){
					$scope.Schedule=data;
					$scope.$apply();								
				}
			})	
			//08获取课程类型
			$scope.schoolTypeList='';
			$.ajax({					
				type:"post",
				url:"/cramSchool/getCramSchoolState",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.schoolTypeList=data.object.schoolTypeList;
					$scope.$apply();								
				}
			})									
			//09重新上架动作
			$scope.PublishLesson=function(LDId){
				var course_name=$('#course_name').val();
				var school_type_id=$('#school_type_id').val();
				var course_hour=$('#course_hour').val();
				var hour_price=$('#hour_price').val();
				var introduction=$('#introduction').val();
				
				var tryOut=0;
				if($('#mianfei').is('.icon-yuan20')){
					tryOut=1;
				}				
				var discount='';
				if($('#zhe').is('.icon-yuan20')){
					discount=$('#zhenumber').val();;
				}
				var cramTimetables=[];
				var timeDataActive=document.getElementsByClassName('timeData-active');			
				for(var i=0; i<timeDataActive.length;i++){					
					cramTimetables.push(timeDataActive[i].getAttribute('data-startTime'));					
				}				
				$.ajax({					
					type:"post",
					url:"/cramCourse/editCramCourse",
					data:{
						"c.id":Cid,
						"c.school_type_id":school_type_id,
						"c.course_name":course_name,
						"c.course_hour":course_hour,
						"c.hour_price":hour_price,
						"c.introduction":introduction ,
						"c.try_out":tryOut,
						"c.discount":discount,
						"cramTimetable":cramTimetables.toString(),
					},					
					datatype:"json",
					success:function(data){						
						if(data.isSuccess){
							alert("课程已重新上架");
							$location.path('/myshop/');
						}else{
							alert(data.msg);
						}
						$scope.$apply();								
					}
				})				
				
			}

			//10获取课程基本信息
			$scope.lessionDetail='';
			$.ajax({					
				type:"post",
				url:"/cramCourse/getEditCramCourseData",
				data:{
					'courseId':Cid ,  //课程ID
				},
				datatype:"json",
				success:function(data){
					$scope.lessionDetail=data.object;
					$scope.$apply();								
				}
			})





			
			
	}])

	//11生源和场地---------------------------------------------------
	.controller('PlaceAndChildCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//02tab栏切换
			tabsfn('PAC_tab','.PAC_tab','.PAC_tab01','PAC-active');
			//03场地tab切换
			var PlaceTab=document.getElementsByClassName('PlaceTablist');			
			for(var i=0; i<PlaceTab.length;i++){
				PlaceTab[i].onclick=function(){
					var indexx=$('.PlaceTablist').index($(this));					
					for(var i=0; i<PlaceTab.length;i++){
						$('.PlaceTablist').removeClass('PlaceActive');
					}
					$(this).addClass('PlaceActive');											
				}
			}
			
			//04是否发布生源或场地蒙版1--出现
			$scope.MaskOnefadeIn=function(){
				$('.PalceMaskOne').fadeIn();
			}
			//05是否发布生源或场地蒙版1--消失
			$scope.MaskOneFadeOut=function(){
				$('.PalceMaskOne').fadeOut();
				
				$('.MaskOneData').fadeIn();
				$('.MaskOneDataTwo').fadeOut();
			}			
			//06是否已经缴纳保证金蒙版
			$scope.isMaskOneFadein=function(){
				$.ajax({					
					type:"post",
					url:"/api/rentPlace/sendRentPlace",
					data:{},
					datatype:"json",
					success:function(data){					
						if(data.isSuccess){  //已经缴纳保证金
							$location.path('/ReleasePlace/');
						}else if(!data.isSuccess){    //没缴纳保证金
							$('.MaskOneData').fadeOut();
							$('.MaskOneDataTwo').fadeIn();							
						}
						$scope.$apply();								
					}
				})				

			}			
			//07去缴纳保证金
			$scope.ReleasePlace=function(){
				$.ajax({					
					type:"post",
					url:"/api/rentPlace/toPayCautionMoney",
					data:{},
					datatype:"json",
					success:function(data){					
						if(data.isSuccess){  //去缴纳保证金   							
							localStorage.setItem('memberId',data.object.memberId);     //用户ID				
							localStorage.setItem('payTotal',data.object.amount);     //订单费用							
							$location.path('/payment/3');     //3是场地保证金
						}else if(!data.isSuccess){    
							alert(data.msg);						
						}
						$scope.$apply();								
					}
				})				

			}
			
			//08刚进来默认获取全部场地列表
			$scope.PlaceList=[];
			$('.spinner').fadeIn();
			$.ajax({					
				type:"post",
				url:"/api/rentPlace/index",
				data:{
					'pageIndex':1,   //页数
					'pageSize':pageSize,    //页大小
				},
				datatype:"json",
				success:function(data){	
					$scope.PlaceList=data.object;					
					$('.spinner').fadeOut();
					$scope.$apply();								
				}
			})					
			//09排序
			var order='';
			$scope.BySort=function(sorttext){
				pageNumber=1;
				order=sorttext;
				var areaId=$('#show_contact').attr('data-district-code');
				$('.spinner').fadeIn();
				$.ajax({					
					type:"post",
					url:"/api/rentPlace/index",
					data:{
						'pageIndex':1,   //页数
						'pageSize':pageSize,    //页大小
						'order':order,    //条件排序
						'areaId':areaId,   //筛选地区
					},
					datatype:"json",
					success:function(data){	
						$scope.PlaceList=data.object;	
						$('.spinner').fadeOut();
						$scope.$apply();								
					}
				})							
			}
			//10区域筛选	
			//10-01地址选项卡
		    var _hmt = _hmt || [];
		    (function(){
			    var hm = document.createElement("script");
			    //   hm.src = "//hm.baidu.com/hm.js?b25bf95dd99f58452db28b1e99a1a46f";
			    var s = document.getElementsByTagName("script")[0]; 
			    s.parentNode.insertBefore(hm, s);
		    })();
			
		    var selectContactDom = $('#select_contact');
		    var showContactDom = $('#show_contact');
		    var contactProvinceCodeDom = $('#contact_province_code');
		    var contactCityCodeDom = $('#contact_city_code');
		    selectContactDom.bind('click', function (){
		        var sccode = showContactDom.attr('data-city-code');
		        var scname = showContactDom.attr('data-city-name');
		
		        var oneLevelId = showContactDom.attr('data-province-code');
		        var twoLevelId = showContactDom.attr('data-city-code');
		        var threeLevelId = showContactDom.attr('data-district-code');
		        var iosSelect = new IosSelect(3, 
		            [iosProvinces, iosCitys, iosCountys],
		            {
		                title: '地址选择',
		                itemHeight: 35,
		                relation: [1, 1, 0, 0],
		                oneLevelId: oneLevelId,
		                twoLevelId: twoLevelId,
		                threeLevelId: threeLevelId,
		                callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
		                    contactProvinceCodeDom.val(selectOneObj.id); 
		                    contactProvinceCodeDom.attr('data-province-name', selectOneObj.value);
		                    contactCityCodeDom.val(selectTwoObj.id);
		                    contactCityCodeDom.attr('data-city-name', selectTwoObj.value);
		
		                    showContactDom.attr('data-province-code', selectOneObj.id);
		                    showContactDom.attr('data-city-code', selectTwoObj.id);
		                    showContactDom.attr('data-district-code', selectThreeObj.id);
		                    showContactDom.html(selectThreeObj.value);
		                    
		                    
		                	//10-02触发地址筛选
							var areaId=$('#show_contact').attr('data-district-code');
							$('.spinner').fadeIn();
							pageNumber=1;
							$.ajax({					
								type:"post",
								url:"/api/rentPlace/index",
								data:{
									'pageIndex':1,   //页数
									'pageSize':pageSize,    //页大小
									'order':order,    //条件排序
									'areaId':areaId,   //筛选地区
								},
								datatype:"json",
								success:function(data){	
									$scope.PlaceList=data.object;	
									$('.spinner').fadeOut();
									$scope.$apply();								
								}
							})		                			                
		                }
		        	});
		    	});
		    //11 定时器8秒自动加载	
		    setInterval(function(){
		    	pageNumber++;
		    	var areaId=$('#show_contact').attr('data-district-code');			    
				$.ajax({					
					type:"post",
					url:"/api/rentPlace/index",
					data:{
						'pageIndex':pageNumber,   //页数
						'pageSize':pageSize,    //页大小
						'order':order,    //条件排序
						'areaId':areaId,   //筛选地区
					},
					datatype:"json",
					success:function(data){	
						$scope.PlaceList=$scope.PlaceList.concat(data.object);
						$scope.$apply();								
					}
				})		    	
		    },8000);
		    	
			//12下拉加载更多
			$(window).bind("scroll", function () {
			    if ($(document).scrollTop() + $(window).height()== $(document).height()) {
			    	$('.spinner').fadeIn();
			    	pageNumber++;
			    	var areaId=$('#show_contact').attr('data-district-code');			    
					$.ajax({					
						type:"post",
						url:"/api/rentPlace/index",
						data:{
							'pageIndex':pageNumber,   //页数
							'pageSize':pageSize,    //页大小
							'order':order,    //条件排序
							'areaId':areaId,   //筛选地区
						},
						datatype:"json",
						success:function(data){	
							$scope.PlaceList=$scope.PlaceList.concat(data.object);							
							$('.spinner').fadeOut();
							$scope.$apply();								
						}
					})			    	
			    	

			    }
			    
			});			
			
			
	
			
	}])

	//12发布场地表单
	.controller('ReleasePlaceCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var PlaceId=$routeParams.ID;   //场地ID
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//提交表单发布场地
			$scope.Release=function(){
				var formData = new FormData($( "#formPlace" )[0]);
				$.ajax({
					type:"post",
					url:"/api/rentPlace/savePlace",
					data:formData,
					datatype:"json",
					async: false,
					cache: false,
					contentType: false,
					processData: false,
					success:function(data){	
						alert(data.msg);
						if(data.isSuccess){
							$location.path('/PlaceAndChild/'); 
						}
						$scope.$apply();
					}
				});					
			}
			
		
			
			
			
			
			
	
			
	}])

	//13场地详情
	.controller('PlaceDetailsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var PlaceId=$routeParams.ID;   //场地ID
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//02购买时长加减号
			$scope.HourAmounts=1;			
			$scope.reduce=function(){
				if($scope.HourAmounts > 1){
					$scope.HourAmounts--;
				}else{
					$scope.HourAmounts == 1;
				}
			}
			$scope.plus=function(){
				$scope.HourAmounts++;
			}

			//03获取场地基本信息
			$scope.PlaceDetail='';
			$.ajax({					
				type:"post",
				url:"/api/rentPlace/getOneRentPlace",
				data:{
					'rent_place_id':PlaceId,   //场地ID
				},
				datatype:"json",
				success:function(data){	
					$scope.PlaceDetail=data.object;	
					$scope.$apply();								
				}
			})				


			
	}])


	//14场地未支付界面
	.controller('PlaceUnpaidCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var PlaceId=$routeParams.ID;   //场地ID
			var count=$routeParams.CID;   //数量
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//02获取场地基本信息
			$scope.PlaceDetail='';
			$scope.payTotal='';
			$scope.UnitPrice='';
			$.ajax({					
				type:"post",
				url:"/api/rentPlace/submit",
				data:{
					'rent_place_id':PlaceId,   //场地ID
					'count':count,    //数量
				},
				datatype:"json",
				success:function(data){						
					$scope.PlaceDetail=data.object;	
					$scope.$apply();								
				}
			})				
			//03购买场地
			$scope.PayPlace=function(orderId,amount){
				localStorage.setItem('orderId',orderId);     //订单ID				
				localStorage.setItem('payTotal',amount);     //订单费用
				$location.path('/payment/2');   //2为场地支付

			}
			//04取消订单
			$scope.cancalOrder=function(orderId){
				$.ajax({					
					type:"post",
					url:"/api/rentOrder/cancleRentOrder",
					data:{
						'orderId':orderId,   //订单ID
					},
					datatype:"json",
					success:function(data){						
						if(data.isSuccess){
							$location.path('/PlaceAndChild/')
						}else{
							alert(data.msg);
						}
						$scope.$apply();								
					}
				})				
			}
			
			
	
			
	}])


	//15支付成功
	.controller('PaySuccessCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var Orderid=$routeParams.ID;  
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//02获取订单信息
			$scope.OrderDetail='';
			$.ajax({					
				type:"post",
				url:"/api/rentOrder/afterYuePay",
				data:{
					'orderId':Orderid,   //订单ID
				},
				datatype:"json",
				success:function(data){						
					$scope.OrderDetail=data.object;	
					$scope.$apply();								
				}
			})			
			
			
			
	
			
	}])

	//16发起结课
	.controller('getOverLCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var cramLessonsId=$routeParams.ID;    //课次ID
			//01返回上一页历史
			$scope.goback=function(){
				$location.path('/news/2');
			}
			//02获取学生列表
			$scope.studentsList='';

			$.ajax({					
				type:"post",
				url:"/cramLesson/getLessons",
				data:{
					'cramLessonsId':cramLessonsId,   //课次ID
				},
				datatype:"json",
				success:function(data){						
					$scope.studentsList=data.object.studentList;	
					$scope.$apply();								
				}
			})					
			//03提交结课信息
			var info = '';
			var infoArr=[];
			$scope.submitOverData=function(){
				var Evaluations=document.getElementsByClassName('getOverL_StudentR');			
				for(var i=0; i<Evaluations.length;i++){
					var evText=$('.getOverL_StudentR').eq(i).val();
					var studentId=$('.getOverL_StudentR').eq(i).attr('data-studentId');
					info={"teacher_evaluation":evText, "id": studentId};					
					infoArr.push(info);
				}
				var LeReport=$('#lereport').val();
				$.ajax({					
					type:"post",
					url:"/cramLesson/sponsorFinishClass",
					data:{
						'cramLessonId':cramLessonsId,   //课次ID
						'le.report':LeReport,
						'teacherEvaluations':infoArr.toString(),					
					},
					datatype:"json",
					success:function(data){						
						alert(data.msg);
						if(data.isSuccess){
							$location.path('/news/2');
						}
						$scope.$apply();								
					}
				})				
				
			
			
			}
			
			
			

		



	}])

	//17结课信息
	.controller('OverLDetailCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var cramLessonsId=$routeParams.ID;  //课次ID
			//01返回上一页历史
			$scope.goback=function(){
				$location.path('/news/2');
			}	
			//02获取结课
			$scope.LessonsDetail='';
			$.ajax({					
				type:"post",
				url:"/cramLesson/getLessons",
				data:{
					'cramLessonsId':cramLessonsId,   //课次ID
				},
				datatype:"json",
				success:function(data){						
					$scope.LessonsDetail=data.object;	
					$scope.$apply();								
				}
			})			



	}])



})(angular)









































