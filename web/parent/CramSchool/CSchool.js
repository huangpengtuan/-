(function(angular){
	'use strict';
	angular.module('MCSchool',[
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
		//01培训班列表页面（圆圆版）
		.when('/CSchool/',{
			templateUrl:'CramSchool/CramSchool.html',
			controller:'CSchoolCtl'
		})
		//02培训班详情界面（圆圆版）
		.when('/Cdetails/:ID',{
			templateUrl:'CramSchool/Cramdetails.html',
			controller:'CdetailsCtl'
		})
		//03培训班信息（圆圆版）
		.when('/CDDetail/:ID',{
			templateUrl:'CramSchool/CDDetail.html',
			controller:'CDDetailCtl'
		})		
		//04课程详情界面（圆圆版）
		.when('/curriculum/:ID',{
			templateUrl:'CramSchool/curriculum.html',
			controller:'curriculumCtl'
		})	
		//04举报
		.when('/Reports/:ID',{
			templateUrl:'CramSchool/Report.html',
			controller:'ReportCtl'
		})	
		//05支付界面(圆圆版)
		.when('/Pay/:OID/:SID',{   //SID为支付类型：1为购买补习班课程支付
			templateUrl:'CramSchool/Pay.html',
			controller:'PayCtl'
		})			
		
		//07购物车
		.when('/SCart/',{
			templateUrl:'CramSchool/ShoppingCart.html',
			controller:'SCartCtl'
		})	
		//08补习班订单（圆圆版）
		.when('/Order/:ID',{
			templateUrl:'CramSchool/Order.html',
			controller:'OrderCtl'
		})
		//09支付成功
		.when('/paySuccess/:ID',{
			templateUrl:'CramSchool/paySuccess.html',
			controller:'paySuccessCtl'
		})		
		//10支付失败
		.when('/payFail/',{
			templateUrl:'CramSchool/payFail.html',
			controller:'payFailCtl'
		})		
		//11科目学习
		.when('/SAS/:ID',{
			templateUrl:'CramSchool/SubjectAndStudy.html',
			controller:'SubjectAndStudyCtl'
		})		
		//12兴趣班
		.when('/InterestCram/:ID',{
			templateUrl:'CramSchool/InterestCram.html',
			controller:'InterestCramCtl'
		})		
		
	}])
	//01补习班列表页面（圆圆版）
	.controller('CSchoolCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}
			//02科目类型切换
			var CSTab=document.getElementsByClassName('CSTab');			
			for(var i=0; i<CSTab.length;i++){
				CSTab[i].onclick=function(){
					var indexx=$('.CSTab').index($(this));
					for(var i=0; i<CSTab.length;i++){
						$('.CSTab').removeClass('CSTab-Active');
					}
					$(this).addClass('CSTab-Active');
				}
			}
			//03获取补习班列表函数   1学习科目   2琴棋书画  3舞蹈健身  
			var pageIndex=1;    //页码
			var pageSize=6;		//页大小
			var keyWord='';     //关键词
			$scope.schoolList=[];	//用于操作的数组
			$scope.SearchHistory='';  //历史关键词			
 			$scope.getDataforList=function(SchoolType){	
 				keyWord=$('.search_input').val();
 				pageIndex=1;
 				$('.spinner').fadeIn();
				$.ajax({					
					type:"post",
					url:"/cramSchool/getSchoolList",
					data:{
						'schoolTypeId':SchoolType,  //1学习科目   2琴棋书画  3舞蹈健身  
						'keyWord':keyWord,
						'pageIndex':pageIndex,  //课程ID
						'pageSize':pageSize,						
						},
					datatype:"json",
					success:function(data){
						$scope.schoolList=data.object;
						$('.spinner').fadeOut();
						$scope.$apply();								
					}
				})				
 			}			
			//04搜索蒙版出现
			$scope.SearchFadein=function(){
				$('.CramSchool').fadeOut();
				//获取关键词
				$.ajax({					
					type:"post",
					url:"/cramSchool/getSchoolSearchHistory",
					data:{},
					datatype:"json",
					success:function(data){
						$scope.SearchHistory=data.object;
						$scope.$apply();								
					}
				})												
				$('.school_search').fadeIn();
			}
			//05搜索蒙版消失
			$scope.SearchFadeOut=function(){
				$('.school_search').fadeOut();
				$('.CramSchool').fadeIn();
			}	
 			//06初进入默认获取学习科目		
 			$scope.getDataforList(1);			
			//07提交搜索关
			$scope.submitSearch=function(){
				keyWord=$('.search_input').val();
				pageIndex=1;
				$('.spinner').fadeIn();
				var SchoolType=$('.CSTab-Active').attr('data-SchoolType');
				$.ajax({					
					type:"post",
					url:"/cramSchool/getSchoolList",
					data:{
						'schoolTypeId':SchoolType,  //1学习科目   2琴棋书画  3舞蹈健身  
						'keyWord':keyWord,
						'pageIndex':pageIndex,  //课程ID
						'pageSize':pageSize,						
						},
					datatype:"json",
					success:function(data){
						$scope.schoolList=data.object;
						$('.spinner').fadeOut();
						$scope.$apply();								
					}
				})				
				$scope.SearchFadeOut();
			}
			//08关键词触发搜索
			$scope.SearchByHistory=function($event){				
				var keyWord=$($event.target).html();
				var SchoolType=$('.CSTab-Active').attr('data-SchoolType');
				pageIndex=1;
				$('.spinner').fadeIn();
				$.ajax({					
					type:"post",
					url:"/cramSchool/getSchoolList",
					data:{
						'schoolTypeId':SchoolType,  //1学习科目   2琴棋书画  3舞蹈健身  
						'keyWord':keyWord,
						'pageIndex':pageIndex,  //课程ID
						'pageSize':pageSize,						
						},
					datatype:"json",
					success:function(data){
						$scope.schoolList=data.object;
						$('.spinner').fadeOut();
						$scope.$apply();								
					}
				})							
				$scope.SearchFadeOut();
			}
			//09删除搜索历史
			$scope.DeleteSearch=function(){
				$.ajax({
					type:"post",
					url:"/cramSchool/deleteSchoolSearchHistory",
					data:{},
					datatype:"json",
					success:function(data){	
						$scope.SearchHistory=data.object;
						$scope.$apply();
					}
				});									
			}			


 			
		    //10 定时器8秒自动加载	
		    setInterval(function(){
				pageIndex++;
				keyWord=$('.search_input').val();
			    var SchoolType=$('.CSTab-Active').attr('data-SchoolType');
				$.ajax({					
					type:"post",
					url:"/cramSchool/getSchoolList",
					data:{
						'schoolTypeId':SchoolType,  //1学习科目   2琴棋书画  3舞蹈健身  
						'keyWord':keyWord,
						'pageIndex':pageIndex,  //课程ID
						'pageSize':pageSize,						
						},
					datatype:"json",
					success:function(data){
						$scope.schoolList=$scope.schoolList.concat(data.object);
						$scope.$apply();								
					}
				})				
		    },8000); 			


			//11下拉加载更多
			$(window).bind("scroll", function (){    
				if ($(document).scrollTop() + $(window).height() == $(document).height()){
					pageIndex++;
					keyWord=$('.search_input').val();
					$('.spinner').fadeIn();
				    var SchoolType=$('.CSTab-Active').attr('data-SchoolType');
					$.ajax({					
						type:"post",
						url:"/cramSchool/getSchoolList",
						data:{
							'schoolTypeId':SchoolType,  //1学习科目   2琴棋书画  3舞蹈健身  
							'keyWord':keyWord,
							'pageIndex':pageIndex,  //课程ID
							'pageSize':pageSize,						
							},
						datatype:"json",
						success:function(data){
							$scope.schoolList=$scope.schoolList.concat(data.object);
							$('.spinner').fadeOut();
							$scope.$apply();								
						}
					})				    
					

				}   
			});
			
			
			
			
	}])

	//02补习班详情(圆圆版)
	.controller('CdetailsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){	
			//01获取补习班ID
			$scope.cramSchoolId=$routeParams.ID;
			//02课程/评论tabs js
			tabsfn('YY_tabA','.YY_tabA','.YY_tabA01','YYtabA-active');			
			//03返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	
			//04获取补习班详细信息
			$scope.schoolDetail='';
			$.ajax({					
				type:"post",
				url:"/cramSchool/getCramSchoolById",
				data:{
					'schoolId':$scope.cramSchoolId,  //补习班ID
				},
				datatype:"json",
				success:function(data){
					$scope.schoolDetail=data.object;
					$scope.$apply();								
				}
			})
			//05获取补习班课程列表
			$scope.LessionList='';
			$.ajax({					
				type:"post",
				url:"/cramCourse/getCramCourseListBySchoolId",
				data:{
					'schoolId':$scope.cramSchoolId,  //补习班ID
				},
				datatype:"json",
				success:function(data){
					$scope.LessionList=data.object.list;
					$scope.$apply();								
				}
			})
			//06获取评价列表
			$scope.EvaluateList='';
			$scope.getEvaluateList=function(){
				$.ajax({					
					type:"post",
					url:"/courseEvaluate/getEvaluateList",
					data:{
						'schoolId':$scope.cramSchoolId,  //补习班ID
					},
					datatype:"json",
					success:function(data){
						$scope.EvaluateList=data.object.list;
						$scope.$apply();								
					}
				})				
			}








			
	}])	

	//03补习班资料（圆圆版）
	.controller('CDDetailCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){	
			//01获取补习班ID
			$scope.cramSchoolId=$routeParams.ID;
			//02返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}				
			//03获取补习班详细信息
			$scope.schoolDetail='';
			$.ajax({					
				type:"post",
				url:"/cramSchool/getCramSchoolById",
				data:{
					'schoolId':$scope.cramSchoolId,  //补习班ID
				},
				datatype:"json",
				success:function(data){
					$scope.schoolDetail=data.object;
					$scope.$apply();								
				}
			})

			
	}])	


	//04课程详情（圆圆版）
	.controller('curriculumCtl',[
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
				$('.subscribe').fadeOut();
				$('.LessionDetails').fadeIn();
			}
			//03课程表展示
			$scope.CSCardfadeIn=function(){
				$('.LessionDetails').fadeOut();	
				$('.subscribe').fadeOut();
				$('#ClassScheduleCard').fadeIn();
			}		
			//04确定课程表
			var ClassCard=[];
			$scope.Determine=function(){
				$scope.CSCardfadeOut();
					
			}
			//05预约试听蒙版展现
			$scope.subscribeFadeIn=function(){
				$('.LessionDetails').fadeOut();	
				$('#ClassScheduleCard').fadeOut();
				$('.subscribe').fadeIn();				
			}
			//06发起预约
			$scope.GoSubscribe=function(){
				var SubData=$("#SubForm").serialize();
				$.ajax({					
					type:"post",
					url:"/cramCourse/appointmentTryCourse",
					data:SubData,
					datatype:"json",
					success:function(data){
						alert(data.msg);
						if(data.isSuccess){
							$scope.CSCardfadeOut();	
						}
						$scope.$apply();								
					}
				})				

							
			}			
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
		
	}])	

	//04举报
	.controller('ReportCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){	
			//获取补习班ID
			$scope.cramSchoolId=$routeParams.ID;
			
			$('.reports-Li').click(function(){
				$(this).toggleClass('tabItemactive');
			})

			
	}])	

	//05支付确认界面
	.controller('PayCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){	
			//01获取支付入口类型ID，1是购买补习班课程支付 
			var OIDs=$routeParams.OID;   //订单ID
			var SIDs=$routeParams.SID;   //类型ID
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
			$scope.payTotals = localStorage.getItem('payTotals');
			//05支付动作
			$scope.PayMenoy=function(){
				var Pstyle=$('.icon-yuan23').attr('data-Pstyle');   //获取选择的支付方式
				if(SIDs == 1){
					if(Pstyle == 1){						
						window.location.href="/c/pay/payForOrder?orderId="+OIDs;	
					}else if(Pstyle == 2){						
						$.ajax({
							type:"post",
							url:"/order/balancePayOrder",
							data:{
								'orderId':OIDs,
							},
							datatype:"json",
							success:function(data){	
								alert(data.msg);
								if(data.isSuccess){
									$location.path('/CSchool/');
								}							
								$scope.$apply();
							}
						});							
						
						
					}

				}				
				
				
				
				
			}
			





			
			
			
	}])

	//07购物车
	.controller('SCartCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){	
			//获取课程ID
			tabsfn('SCart-tabs','.SCart-tabs','.SCart-tabs01','SCactive');
		
			$scope.CartLists='';
			//获取购物车列表
			$.ajax({
				type:"post",
				url:"/shoppingCart/getCartList",
				data:{
					'type':1,
				},
				datatype:"json",
				success:function(data){						
					$scope.CartLists=data.object;	
					$scope.$apply();				
				}
			});
			
			//删除
		    $scope.deleteFN=function(currid){
				$.ajax({
					type:"post",
					url:"/shoppingCart/deleteProductByCart",
					data:{
						'productType':1,
						'productId':currid,
					},
					datatype:"json",
					success:function(data){	
						$scope.CartLists=data.object;
						sumamount();						
						$scope.$apply();	
						jiajian();
						scartdelete('.SC-container');
						checkFN();
					}
				});	    	
		    };				
			

			
			
		$scope.totalPrice=0;	
		//等ng-repeat之后再往元素上面绑定事件
		$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
			//左滑
			scartdelete('.SC-container');
			//数量加减	
			jiajian();
			//勾选
			checkFN();
			//获取勾选课程id
			listArry=[];
			sumamount();
	
		})

	}])	
	//08补习班订单（圆圆版）
	.controller('OrderCtl',[		
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

			//03获取课程基本信息
			$scope.CourseInfo='';
			$scope.price='';
			$.ajax({					
				type:"post",
				url:"/cramCourse/getBuyCourseInfo",
				data:{
					'courseId':Cid ,  //课程ID
				},
				datatype:"json",
				success:function(data){
					$scope.CourseInfo=data.object;
					$scope.price=data.object.preferential_price;
					console.log(data);
					$scope.$apply();								
				}
			})		
			//获取当前用户名下所有子女信息记录
			$scope.ChildrenList='';
			$.ajax({					
				type:"post",
				url:"/childrenInfo/getChildrenList",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.ChildrenList=data.object;
					
					$scope.$apply();								
				}
			})			
			$scope.TotalNumber=0;
			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				//04点击孩子事件
				var childList=document.getElementsByClassName('Student');
				for(var i=0; i<childList.length;i++){
					childList[i].onclick=function(){
						var indexx=$('.Student').index($(this));				
						$('.children_select_ioc').eq(indexx).toggleClass("icon-yuan20");
						var childrenNumber=$('.icon-yuan20').length;
						$scope.TotalNumber=childrenNumber*$scope.price;
						$scope.$apply();
					}
				}
			})	
			//05提交购买
			$scope.PaySchool=function(LId){
				var childarr=[];
				var selectedChild=document.getElementsByClassName('icon-yuan20');
				for(var i=0; i<selectedChild.length;i++){
					childarr.push(selectedChild[i].getAttribute('data-childId'));
				}	
				
				$.ajax({					
					type:"post",
					url:"/cramCourse/buyCourse_v2",
					data:{
						'crouseId':LId,  //课程ID
						'childrenIds':childarr.toString(),  //孩子ID
					},
					datatype:"json",
					success:function(data){
						console.log(data);
						if(data.isSuccess){   // /Pay/订单ID/支付类型   1为购买补习班课程类型  
							localStorage.setItem('payTotals',data.object.amount);  //设置需要支付金额缓存，为下一个界面展示用
							$location.path('/Pay/'+data.object.id+'/'+1);   
						}else if(!data.isSuccess){
							alert(data.msg);
						}
						$scope.$apply();								
					}
				})
				
			}
			
			
	}])
	//09支付成功
	.controller('paySuccessCtl',[		
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){				
			var Oid=$routeParams.ID;      //获取订单Id
			$scope.amount='';
			$scope.in_time='';
			$scope.pay_time='';
			$.ajax({
				type:"post",
				url:"/order/getOrderPaySuccessInfo",
				data:{
					'orderIds':Oid,   //订单ID
				},
				datatype:"json",
				success:function(data){	
					$scope.amount=data.object.amount;
					$scope.in_time=data.object.in_time;
					$scope.pay_time=data.object.pay_time;					
					$scope.$apply();
				}
			});
			
			
			$scope.gohomes=function(){
				$location.path('/home/');
			}
			$scope.goMyOrders=function(){
				$location.path('/MyOrders/');
			}
	}])	
	
	//10支付失败
	.controller('payFailCtl',[		
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			$scope.gohomes=function(){
				$location.path('/home/');
			}
			$scope.goback=function(){
				window.history.back();
			}
			
			
			
			
			
	}])	
	
	//11科目学科
	.controller('SubjectAndStudyCtl',[		
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//获取补习班类型
			$scope.CramStyle=$routeParams.ID;		
			//01返回上一页
			$scope.goback=function(){
				window.history.back();
			}
			//02条件筛选选项卡tabs js
			var CDtabs=document.getElementsByClassName('njhBody');			
			for(var i=0; i<CDtabs.length;i++){
				CDtabs[i].onclick=function(){
					var indexx=$('.njhBody').index($(this));
					for(var i=0; i<CDtabs.length;i++){
						$('.njhBody').removeClass('CSSearchActive');
						$('.njhBody01').removeClass("active");
						$('.cstabimgb').removeClass("cstabimgbActive");
					}
					$(this).addClass('CSSearchActive');					
					$('.njhBody01').eq(indexx).addClass("active");
					$('.njhBody01').eq(0).removeClass("active");
					$('.cstabimgb').eq(indexx).addClass("cstabimgbActive");
					$('.njhTabs').addClass('njhTabsActive');
					$('#CSchools').hide();
				}
			}			
			//03地址选项卡tabs js
			tabsfn('zoneBody','.zoneBody','.zoneBody01','tabItemactive');

			//04学科选项卡
			tabsfn('SubjectBody','.SubjectBody','.SubjectBody01','tabItemactive');
			
			//05筛选动作
			$scope.freeAx=function($event){
				var activityID=$($event.target).attr('data-name');
				$('.screenList01').removeClass('shaixuanActive');
				$($event.target).addClass('shaixuanActive');
				$('#activity').val(activityID);
			}
			$scope.SexAx=function($event){
				var sexID=$($event.target).attr('data-name');
				$('.screenList02').removeClass('shaixuanActive');
				$($event.target).addClass('shaixuanActive');
				$('#teacherSex').val(sexID);
			}
			$scope.EmptySX=function(){
				$('.screenList01').removeClass('shaixuanActive');
				$('.screenList02').removeClass('shaixuanActive');
				$('#activity').val('');
				$('#teacherSex').val('');				
			}
			$scope.GetSX=function(){
				page=1;						
				var areaid=$('#area_id').val();
				var subjectId=$('#subjectId').val();
				var order=$('#order').val();
				var teacherSex=$('#teacherSex').val();
				var activity=$('#activity').val();
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'schoolTypeId':$scope.CramStyle,
						'areaId':areaid, 
						'subjectId':subjectId,
						'order':order,
						'activity':activity,
						'teacherSex':teacherSex,
				}
				$('#CSchools').empty();
				$('.njhBody01').eq(3).removeClass('active');
				getcramschoollist(dataArry);
			}
			//06刚进入页面默认无条件查询
			page=1;						
			var dataArry={
					'pageIndex':page,
					'pageSize':count,
 					'schoolTypeId':$scope.CramStyle,
				}
			getcramschoollist(dataArry);


						
			//07所有科目搜索动作
			$scope.allsubject=function($event,ctype,eclass){
		        var changename=$($event.target).attr('data-name');
		        var changeid=$($event.target).attr('data-cityid');
		        
				$('.njhBodyname').eq(ctype).html(changename);
				$('.smjj-change').eq(ctype).val(changeid);
				
				page=1;						
				var areaid=$('#area_id').val();
				var subjectId=$('#subjectId').val();
				var order=$('#order').val();
				var teacherSex=$('#teacherSex').val();
				var activity=$('#activity').val();
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'schoolTypeId':$scope.CramStyle,
						'areaId':areaid, 
						'subjectId':subjectId,
						'order':order,
						'activity':activity,
						'teacherSex':teacherSex,
				}				
				$("#CSchools").empty();
				getcramschoollist(dataArry);				
				setTimeout(function(){
					//交互动作
					$('.njhBody01').removeClass('active');
					$('.njhBody').eq(ctype).removeClass('CSSearchActive');
					$('.njhTabs').removeClass('njhTabsActive');
					$('.cstabimgb').eq(ctype).removeClass("cstabimgbActive");
				},600);				
			}
		
			//08学科和排序动作和触发结果
			$scope.njhscreen=function($event,ctype,eclass){				
				var changeID=$($event.target).attr('data-cityid');
				if(eclass){
					$(eclass).removeClass('tabItemactive');	
					$($event.target).toggleClass('tabItemactive'); 
				}
    				
				//设置背景色
		        //显示选择条件      	        	
		        var changename=$($event.target).attr('data-name');
		        var changeid=$($event.target).attr('data-cityid');
				$('.njhBodyname').eq(ctype).empty();
				$('.njhBodyname').eq(ctype).html(changename);
				$('.smjj-change').eq(ctype).val(changeid);
				
				page=1;						
				var areaid=$('#area_id').val();
				var subjectId=$('#subjectId').val();
				var order=$('#order').val();
				var teacherSex=$('#teacherSex').val();
				var activity=$('#activity').val();
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'schoolTypeId':$scope.CramStyle,
						'areaId':areaid, 
						'subjectId':subjectId,
						'order':order,
						'activity':activity,
						'teacherSex':teacherSex,
				}				
				$("#CSchools").empty();
				getcramschoollist(dataArry);
				
				setTimeout(function(){
					//交互动作
					$('.njhBody01').removeClass('active');
					$('.njhBody').eq(ctype).removeClass('CSSearchActive');
					$('.njhTabs').removeClass('njhTabsActive');
					$('.cstabimgb').eq(ctype).removeClass("cstabimgbActive");

				},600);

			}	
	
			//09搜索膜态框展示
			$scope.searchHistory='';
			$scope.SearchMask=function(){
				$.ajax({
					type:"post",
					url:"/cramSchool/getSchoolSearchHistory",
					data:{},
					datatype:"json",
					success:function(data){	
						$scope.searchHistory=data.object;
						console.log($scope.searchHistory);				
						$scope.$apply();
					}
				});				
				$('#zone').fadeOut();
				$('#InterSearchMask').fadeIn();
			}
			//10搜索膜态框返回消失
			$scope.gobackfalse=function(){ 
				$('#zone').fadeIn();
				$('#InterSearchMask').fadeOut();
				$('#IntS_in').val('');
			}	
			//11搜索膜态框消失
			$scope.goSearch=function(){
				var keyWord=$('#IntS_in').val();
				var areaid=$('#area_id').val();
				$("#CSchools").empty();
				page=1;
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'schoolTypeId':$scope.CramStyle,
						'areaId':areaid,
						'keyWord':keyWord,  //关键字 补习班名称或老师名称					
					}
				$('#CSchools').empty();
				getcramschoollist(dataArry); 
				$('#zone').fadeIn();
				$('#InterSearchMask').fadeOut();
				setTimeout(function(){
					$('#IntS_in').val('');
				},500);
			}	
			//13点击搜索历史搜索
			$scope.HistorySearch=function($event){
				var  keyWord=$($event.target).html();
				var areaid=$('#area_id').val();
				$("#CSchools").empty();
				page=1;
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'schoolTypeId':$scope.CramStyle,
						'areaId':areaid,
						'keyWord':keyWord,  //关键字 补习班名称或老师名称					
					}
				$('#CSchools').empty();
				getcramschoollist(dataArry); 
				$('#zone').fadeIn();
				$('#InterSearchMask').fadeOut();
			}	
	
			//14下拉加载更多
			$(window).bind("scroll", function () {    
				if ($(document).scrollTop() + $(window).height() == $(document).height()+5){
					++page;
					if(page == 2){
						$("#CSchools").empty();
					}
					var areaid=$('#area_id').val();
					var subjectId=$('#subjectId').val();
					var order=$('#order').val();
					var teacherSex=$('#teacherSex').val();
					var activity=$('#activity').val();
					var dataArry={
							'pageIndex':page,
							'pageSize':count,
							'schoolTypeId':1,
							'areaId':areaid, 
							'subjectId':subjectId,
							'order':order,
							'activity':activity,
							'teacherSex':teacherSex,
					}				
					$.ajax({
						type:"post",
						url:"/cramSchool/getSchoolList",
						data:dataArry,
						datatype:"json",
						success:function(data){			
							//数据源
							listsplits(data.object);
							$("#CSchools").show();
							if(data.object.length == 0){
								$("#getmorefalse").fadeIn();
								setTimeout(function(){
									$("#getmorefalse").fadeOut();
								},650)
							}
						}
					});					
				}   
			});		
	
			
	}])
	
	//12兴趣班
	.controller('InterestCramCtl',[		
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01获取补习班类型
			$scope.CramStyle=$routeParams.ID;
			$scope.CramProject='';
			var ProjectTotal='';
			$.ajax({
				type:"post",
				url:"/subject/getSubjectListByType",
				data:{
					'schoolTypeId':$scope.CramStyle, 
				},
				datatype:"json",
				success:function(data){			
					$scope.CramProject=data.object;
					ProjectTotal=data.object.length;
					$scope.$apply();
				}
			});		
			//02返回上一页
			$scope.goback=function(){
				window.history.back();
			}			
						
			//03条件筛选选项卡tabs js
			var CDtabs=document.getElementsByClassName('njhBody');	
			for(var i=0; i<CDtabs.length;i++){
				CDtabs[i].onclick=function(){
					var indexx=$('.njhBody').index($(this));
					for(var i=0; i<CDtabs.length;i++){
						$('.njhBody').removeClass('InterActive');
						$('.njhBody01').removeClass("active");
						$('.cstabimgb').removeClass("cstabimgbActive");
					}
					$(this).addClass('InterActive');
					if(indexx == 1){
						//003按距离排序
						$('.njhBody01').eq(1).removeClass("active");
						$('.njhBody01').eq(1).val('1');
						page=1;						
						var areaid=$('#area_id').val();
						var subjectId=$('#subjectId').val();
						var distanceRecent=$('#distanceRecent').val();
						var order=$('#order').val();
						var teacherSex=$('#teacherSex').val();
						var activity=$('#activity').val();
						var dataArry={
								'pageIndex':page,
								'pageSize':count,
								'schoolTypeId':$scope.CramStyle,
								'areaId':areaid, 
								'subjectId':subjectId,
								'distanceRecent':1,
								'order':order,
								'activity':activity,
								'teacherSex':teacherSex,
						}
						$('#CSchools').empty();
						$('.njhBody01').eq(3).removeClass('active');
						getcramschoollist(dataArry);						
					}else{
						$('.njhBody01').eq(indexx).addClass("active");
					}										
					$('.njhBody01').eq(0).removeClass("active");
					$('.cstabimgb').eq(indexx).addClass("cstabimgbActive");
					$('#CSchools').hide();
				}
			}
			//04地址选项卡tabs js
			tabsfn('zoneBody','.zoneBody','.zoneBody01','tabItemactive');

			//05筛选动作
			$scope.freeAx=function($event){
				var activityID=$($event.target).attr('data-name');
				$('.screenList01').removeClass('shaixuanActive');
				$($event.target).addClass('shaixuanActive');
				$('#activity').val(activityID);
			}
			$scope.SexAx=function($event){
				var sexID=$($event.target).attr('data-name');
				$('.screenList02').removeClass('shaixuanActive');
				$($event.target).addClass('shaixuanActive');
				$('#teacherSex').val(sexID);
			}
			$scope.EmptySX=function(){
				$('.screenList01').removeClass('shaixuanActive');
				$('.screenList02').removeClass('shaixuanActive');
				$('#activity').val('');
				$('#teacherSex').val('');	
				$('.njhBody01').eq(3).removeClass('active');
			}
			$scope.GetSX=function(){
				page=1;						
				var areaid=$('#area_id').val();
				var distanceRecent=$('#distanceRecent').val();
				var subjectId=$('#subjectId').val();
				var order=$('#order').val();
				var teacherSex=$('#teacherSex').val();
				var activity=$('#activity').val();
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'schoolTypeId':$scope.CramStyle,
						'areaId':areaid, 
						'subjectId':subjectId,
						'distanceRecent':distanceRecent,
						'order':order,
						'activity':activity,
						'teacherSex':teacherSex,
				}
				$('#CSchools').empty();
				$('.njhBody01').eq(3).removeClass('active');
				getcramschoollist(dataArry);
			}
			//06刚进入页面默认无条件查询
			page=1;						
			var dataArry={
					'pageIndex':page,
					'pageSize':count,
 					'schoolTypeId':$scope.CramStyle,
				}
			getcramschoollist(dataArry);
			
			//07ng-repeat之后再往元素上面绑定事件--横向滚动条请求数据
			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				//横向滚动条
				$scope.selectClass=function($event,ProjectID){
					var pfpx=Number($($event.target).attr('data-pfpx'));
					
					if(ProjectTotal != pfpx+1){
						if(2 <= pfpx < ProjectTotal-2){
							$('.IntHeader').css('left','-'+(pfpx-1)*25+'vw');
						}else if(pfpx < 2){
							$('.IntHeader').css('left',0+'vw');
						}
					}
					$('.IntHeader_list').removeClass('IntHeader_Active');
					$($event.target).addClass('IntHeader_Active');
					$("#subjectId").val($(".IntHeader_Active").attr('data-Project'));
					//获取数据
					page=1;						
					var areaid=$('#area_id').val();
					var subjectId=$(".IntHeader_Active").attr('data-Project');
					var distanceRecent=$('#distanceRecent').val();
					var order=$('#order').val();
					var teacherSex=$('#teacherSex').val();
					var activity=$('#activity').val();
					var dataArry={
							'pageIndex':page,
							'pageSize':count,
							'schoolTypeId':$scope.CramStyle,
							'subjectId':subjectId,
							'areaId':areaid, 
							'distanceRecent':distanceRecent,
							'order':order,
							'activity':activity,
							'teacherSex':teacherSex,
					}				
					$("#CSchools").empty();
					getcramschoollist(dataArry);					
					
				}

			})
			

			//08下拉加载更多和吸顶效果
			$(window).bind("scroll", function () {
				//001吸顶效果
				if($(document).scrollTop() >= $('.hotGroom').height()+2.5*12){
					$('#IntTabs').addClass('IntSectionFixed');
				}else if($(document).scrollTop() < $('.hotGroom').height()+12.1*12){
					$('#IntTabs').removeClass('IntSectionFixed');
				}
				//002下拉加载更多
				if($(document).scrollTop() + $(window).height() == $(document).height()+5){
					++page;
					if(page == 2){
						$("#CSchools").empty();
					}
					var areaid=$('#area_id').val();
					var subjectId=$('#subjectId').val();
					var distanceRecent=$('#distanceRecent').val();
					var order=$('#order').val();
					var teacherSex=$('#teacherSex').val();
					var activity=$('#activity').val();
					var dataArry={
							'pageIndex':page,
							'pageSize':count,
							'schoolTypeId':$scope.CramStyle,
							'subjectId':subjectId,
							'areaId':areaid, 
							'distanceRecent':distanceRecent,
							'order':order,
							'activity':activity,
							'teacherSex':teacherSex,
					}
					$.ajax({
						type:"post",
						url:"/cramSchool/getSchoolList",
						data:dataArry,
						datatype:"json",
						success:function(data){			
							//数据源
							listsplits(data.object);
							$("#CSchools").show();
							if(data.object.length == 0){
								$("#getmorefalse").fadeIn();
								setTimeout(function(){
									$("#getmorefalse").fadeOut();
								},650)
							}
						}
					});					
				}				
			});
			//09搜索膜态框展示===========================
			$scope.searchHistory='';
			$scope.SearchMask=function(){
				$.ajax({
					type:"post",
					url:"/cramSchool/getSchoolSearchHistory",
					data:{},
					datatype:"json",
					success:function(data){	
						$scope.searchHistory=data.object;
						$scope.$apply();
					}
				});				
				$('#zone').fadeOut();
				$('#InterSearchMask').fadeIn();
			}
			//10搜索膜态框返回消失
			$scope.gobackfalse=function(){ 
				$('#zone').fadeIn();
				$('#InterSearchMask').fadeOut();
				$('#IntS_in').val('');
			}	
			//11搜索膜态框消失
			$scope.goSearch=function(){
				var keyWord=$('#IntS_in').val();
				var areaid=$('#area_id').val();
				$("#CSchools").empty();
				page=1;
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'schoolTypeId':$scope.CramStyle,
						'areaId':areaid,
						'keyWord':keyWord,  //关键字 补习班名称或老师名称					
					}
				$('#CSchools').empty();
				getcramschoollist(dataArry); 
				$('#zone').fadeIn();
				$('#InterSearchMask').fadeOut();
				setTimeout(function(){
					$('#IntS_in').val('');
				},500);
			}			
			//12删除搜索历史
			$scope.DeleteSearch=function(){
				$.ajax({
					type:"post",
					url:"/cramSchool/deleteSchoolSearchHistory",
					data:{},
					datatype:"json",
					success:function(data){	
						$scope.searchHistory=data.object;
						console.log($scope.searchHistory);				
						$scope.$apply();
					}
				});									
			}	
			//13点击搜索历史搜索
			$scope.HistorySearch=function($event){
				var  keyWord=$($event.target).html();
				var areaid=$('#area_id').val();
				$("#CSchools").empty();
				page=1;
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'schoolTypeId':$scope.CramStyle,
						'areaId':areaid,
						'keyWord':keyWord,  //关键字 补习班名称或老师名称					
					}
				$('#CSchools').empty();
				getcramschoollist(dataArry); 
				$('#zone').fadeIn();
				$('#InterSearchMask').fadeOut();
			}
			
			//14排序动作和触发结果----------------------------------
			$scope.njhscreen=function($event,ctype,eclass){				    
				//设置背景色
		        //显示选择条件      	        	
		        var changename=$($event.target).attr('data-name');
		        var changeid=$($event.target).attr('data-cityid');
				$('.njhBodyname').eq(ctype).empty();
				$('.njhBodyname').eq(ctype).html(changename);
				$('.smjj-change').eq(ctype).val(changeid);
				
				page=1;						
				var areaid=$('#area_id').val();
				var subjectId=$('#subjectId').val();
				var distanceRecent=$('#distanceRecent').val();
				var order=$('#order').val();
				var teacherSex=$('#teacherSex').val();
				var activity=$('#activity').val();
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'schoolTypeId':$scope.CramStyle,
						'subjectId':subjectId,
						'areaId':areaid, 
						'distanceRecent':distanceRecent,
						'order':order,
						'activity':activity,
						'teacherSex':teacherSex,
				}				
				$("#CSchools").empty();
				getcramschoollist(dataArry);
				
				setTimeout(function(){
					//交互动作
					$('.njhBody01').removeClass('active');
					$('.njhBody').eq(ctype).removeClass('CSSearchActive');
					$('.njhTabs').removeClass('njhTabsActive');
					$('.cstabimgb').eq(ctype).removeClass("cstabimgbActive");

				},600);
			}			
			//15获取热门课程
			$scope.getHotGroom='';
			$.ajax({
				type:"post",
				url:"/cramCourse/getHotCourseList",
				data:{
					'schoolTypeId':$scope.CramStyle,
				},
				datatype:"json",
				success:function(data){			
					$scope.getHotGroom=data.object;
					$scope.$apply();
				}
			});
			
			
			
			
			
			
			
	}])


	
	
})(angular)


