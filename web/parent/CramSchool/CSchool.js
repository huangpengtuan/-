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
		//01培训班搜索主页面
		.when('/CSchool/',{
			templateUrl:'CramSchool/CramSchool.html',
			controller:'CSchoolCtl'
		})
		//02培训班详情界面
		.when('/Cdetails/:ID',{
			templateUrl:'CramSchool/Cramdetails.html',
			controller:'CdetailsCtl'
		})
		//03课程详情界面
		.when('/curriculum/:ID',{
			templateUrl:'CramSchool/curriculum.html',
			controller:'curriculumCtl'
		})	
		//04举报
		.when('/Reports/:ID',{
			templateUrl:'CramSchool/Report.html',
			controller:'ReportCtl'
		})	
		//05支付确认界面
		.when('/ACinsure/',{
			templateUrl:'CramSchool/ACinsure.html',
			controller:'ACinsureCtl'
		})			
		
		//07购物车
		.when('/SCart/',{
			templateUrl:'CramSchool/ShoppingCart.html',
			controller:'SCartCtl'
		})	
		//08补习班订单
		.when('/Order/',{
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
	//01培训班主页面
	.controller('CSchoolCtl',[
		'$scope',
		function($scope){			
			//01地址选项卡tabs js
			tabsfn('zoneBody','.zoneBody','.zoneBody01','tabItemactive');	
			//02区域选项卡
			tabsfn('regionBody','.regionBody','.regionBody01','tabItemactive');			
			//03是否选择了默认城市
			$scope.ifAreas='';	
			$scope.ifAreasname='';
		  	$.post("/p/getParentHome",
	    		{},
	        	function(data){		      
			        $scope.ifAreas=data.content.parent_follow_area;
			        if($scope.ifAreas){
			        	$scope.ifAreasname=data.content.parent_follow_area_name;			        	 	 
			        }else{
			        	$scope.ifAreasname='深圳市';
			        	$scope.ifAreas=440300;
			        }			        
					var page=1;	
					var keyWord=$('#keyWords').val();
					//刚进入页面默认无条件查询			
					var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'areaId':$scope.ifAreas,
						'keyWord':keyWord,
					}
					$('#CSchools').empty();
					getcramschoollist(dataArry);
			        $scope.$apply();
		    });
			
			//搜索关键字筛选
			$scope.search=function(){
				var keyWord=$('#keyWords').val();
				var areaid=$('#area_id').val();
				$("#CSchools").empty();
				page=1;
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'areaId':areaid,
						'keyWord':keyWord,  //关键字 补习班名称或老师名称					
					}
				$('#CSchools').empty();
				getcramschoollist(dataArry);								
			}
			//获取轮播图
			$scope.inderBanner='';
			$.ajax({
				type:"post",
				url:"/cramSchool/getSchoolBannerByCategoryType",
				data:{
					'categoryType':'补习班列表',
				},
				datatype:"json",
				success:function(data){			
					$scope.inderBanner=data.object;
					console.log(data);
					$scope.$apply();
				}
			});			
			//等ng-repeat之后再往元素上面绑定事件
			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				//banner
			    var swiper01 = new Swiper('.swiper-container', {
			        pagination: '.swiper-pagination',
			        paginationClickable: true,			
			        grabCursor : true,
			        touchRatio : 0.5,
					autoplay : 3000,
					loop : true,
				});
	
		
			})



			//下拉加载更多
			$(window).bind("scroll", function (){    
				if ($(document).scrollTop() + $(window).height() == $(document).height()+5){
					++page;
					if(page == 2){
						$("#CSchools").empty();
					}
					var areaid=$('#area_id').val();
					var keyWord=$('#keyWords').val();
					var dataArry={
							'pageIndex':page,
							'pageSize':count,
							'areaId':areaid,  //关键字 补习班名称或老师名称
							'keyWord':keyWord,  //关键字 补习班名称或老师名称						
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

	//02培训班详情
	.controller('CdetailsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){	
			//获取补习班ID
			$scope.cramSchoolId=$routeParams.ID;
			//选项卡tabsjs
			tabsfn('CDtabs','.CDtabs','.CDtabs1','CDactive');
			//子选项卡tabs js
			tabsfn('tabBody','.tabBody','.tabBody01','cramdetailactive');
			
			$scope.stars='';
			$scope.groups1='';		
			//点击分组获取课程
			$scope.groupcurri='';		
			$scope.starslistA=[];
			var starsI='';
			//获取课程质量分数以及服务质量分数
			$scope.quality_score='';
			$scope.quality_score01='';
			$scope.service_score='';
			$scope.service_score01='';			
			//获取状态			
			$.ajax({
				type:"post",
				url:"/cramSchool/getCramSchoolById",
				data:{
					'schoolId':$scope.cramSchoolId,
				},
				datatype:"json",
				success:function(data){	
					$scope.starslistA=[];
					console.log(data.object);
					$scope.CramData=data.object;					
					$scope.groups1=data.object.groups[0];
					$scope.groups1.id=data.object.groups[0].id;
					if($scope.CramData.eva_star*10%10 <=2 && $scope.CramData.eva_star*10%10 != 0){
						$scope.stars='img/start2.png';

					}else if($scope.CramData.eva_star*10%10 <=5 && $scope.CramData.eva_star*10%10 != 0){
						$scope.stars='img/start5.png';
					}else if($scope.CramData.eva_star*10%10 <=9 && $scope.CramData.eva_star*10%10 != 0){
						$scope.stars='img/start8.png';
					}else if($scope.CramData.eva_star == 5){
						$scope.stars='img/start10.png';
					}else{
						$scope.stars='img/start0.png';
					}
					//课程质量和服务质量
					$scope.quality_score=data.object.quality_score;
					if($scope.quality_score*10%10 <= 2 && $scope.quality_score*10%10 != 0){
						$scope.quality_score01='img/start2.png';
					}else if($scope.quality_score*10%10 <= 5 && $scope.quality_score*10%10 != 0){
						$scope.quality_score01='img/start5.png';
					}else if($scope.quality_score*10%10 <= 9 && $scope.quality_score*10%10 != 0){
						$scope.quality_score01='img/start8.png';
					}else if($scope.quality_score == 5){
						$scope.quality_score01='img/start10.png';
					}else{
						$scope.quality_score01='img/start0.png';
					}			
					$scope.service_score=data.object.service_score;	
					if($scope.service_score*10%10 <= 2 && $scope.service_score*10%10 != 0){
						$scope.service_score01='img/start2.png';
					}else if($scope.service_score*10%10 <= 5 && $scope.service_score*10%10 != 0){
						$scope.service_score01='img/start5.png';
					}else if($scope.service_score*10%10 <= 9 && $scope.service_score*10%10 != 0){
						$scope.service_score01='img/start8.png';
					}else if($scope.service_score == 5){
						$scope.service_score01='img/start10.png';
					}else{
						$scope.service_score01='img/start0.png';
					}					
					
					
					
					
					//第一次进来默认获取第一组课程		
					$.ajax({
						type:"post",
						url:"/cramCourse/getCramCourse",
						data:{
							"schoolId": $scope.cramSchoolId,//课单ID
							"groupId":$scope.groups1.id,//状态编码，见下表
						},
						datatype:"json",
						success:function(data){								
							$scope.groupcurri=data.object.list; 
							for(var i=0;i<$scope.groupcurri.length;i++){
								if($scope.groupcurri[i].composite_score*10%10 <=2 && $scope.groupcurri[i].composite_score*10%10 != 0){
									starsI='img/start2.png';	
								}else if($scope.groupcurri[i].composite_score*10%10 <=5 && $scope.groupcurri[i].composite_score*10%10 != 0){
									starsI='img/start5.png';
			
								}else if($scope.groupcurri[i].composite_score*10%10 <=9 && $scope.groupcurri[i].composite_score*10%10 != 0){
									starsI='img/start8.png';
								}else if($scope.groupcurri[0].composite_score == 5){
									starsI='img/start10.png';
								}else{
									starsI='img/start0.png';
								}								
								$scope.starslistA.push(starsI);
								$scope.$apply();								
							}

						}
					});					
					
					$scope.$apply();				
				}
			});				
			
		$scope.fgcurri=function(schoolId,groupID,$event){
			var groupID=groupID;
			var schoolId=schoolId;
			$scope.starslistA=[];
			$.ajax({
				type:"post",
				url:"/cramCourse/getCramCourse",
				data:{
					"schoolId": schoolId,//课单ID
					"groupId":groupID,//状态编码，见下表
				},
				datatype:"json",
				success:function(data){
					$scope.groupcurri=data.object.list; 
					for(var i=0;i<$scope.groupcurri.length;i++){
						if($scope.groupcurri[i].composite_score*10%10 <=2 && $scope.groupcurri[i].composite_score*10%10 != 0){
							starsI='img/start2.png';	
						}else if($scope.groupcurri[i].composite_score*10%10 <=5 && $scope.groupcurri[i].composite_score*10%10 != 0){
							starsI='img/start5.png';
	
						}else if($scope.groupcurri[i].composite_score*10%10 <=9 && $scope.groupcurri[i].composite_score*10%10 != 0){
							starsI='img/start8.png';
						}else if($scope.groupcurri[i].composite_score == 5){
							starsI='img/start10.png';
						}else{
							starsI='img/start0.png';
						}
						
						$scope.starslistA.push(starsI);
						
					}
					$scope.$apply();
				}
			});		
			$('.tabBody').removeClass('cramdetailactive');
			$($event.target).addClass("cramdetailactive");

		}
		//跳转到课程详情
		$scope.gocurriculum=function(curriID){
			$location.path('/curriculum/'+curriID);
		}			
		//加入购物车	
		$scope.count=0;
		$scope.totalPrice=0;
		//刚进来获取默认数据
		$.ajax({
			type:"post",
			url:"/shoppingCart/getCarData",
			data:{
				'productType':1, //商品类型
			},
			datatype:"json",
			success:function(data){
				$scope.count=data.object.count;
				$scope.totalPrice=data.object.totalPrice;
				$scope.$apply();
			}
		});		
		//加入购物车函数	
		$scope.joinshoppingcart=function(goodstype,goodsID){
			$('#BottomCart').fadeIn();
			$.ajax({
				type:"post",
				url:"/shoppingCart/addCart",
				data:{
					'c.product_type':goodstype, //商品类型
					'c.product_id':goodsID, //选中的商品id
					'c.count':1, //选中的商品id
				},
				datatype:"json",
				success:function(data){
					$scope.count=data.object.count;
					$scope.totalPrice=data.object.totalPrice;
					$scope.$apply();
				}
			});				
			
		}
		
		//获取评论
		var EvpageSize=20;
		var EvpageIndex=1;
		$scope.EvaluateList='';	
		$scope.totalRow='';
		$.ajax({
			type:"post",
			url:"/courseEvaluate/getEvaluateList",
			data:{
				'schoolId':$scope.cramSchoolId, //课程ID
				'pageIndex': 1,
				'pageSize':20,
			},
			datatype:"json",
			success:function(data){	
				$scope.totalRow=data.object.totalRow;
				$scope.EvaluateList=data.object.list;
				$scope.$apply();
			}
		});
		
		//补习班详情的信息详情膜态框展示
		$scope.CCDfilmFadeIn=function(){
			$('.cramClassfilm').fadeIn();
		}
		//补习班详情的信息详情膜态框隐藏
		$scope.CCDfilmFadeOut=function(){
			$('.cramClassfilm').fadeOut();
		}		
		
		//下拉加载更多
		$(window).bind("scroll", function () {    
			if ($(document).scrollTop() + $(window).height() == $(document).height()){
				EvpageSize+=20;
				$.ajax({
					type:"post",
					url:"/courseEvaluate/getEvaluateList",
					data:{
						'schoolId':$scope.cramSchoolId, //课程ID
						'pageIndex': EvpageIndex,
						'pageSize':EvpageSize,
					},
					datatype:"json",
					success:function(data){			
						$scope.EvaluateList=data.object.list;
						$scope.$apply();
					}
				});
				
			}   
		});	
			
	}])	
	
	//03课程详情
	.controller('curriculumCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//获取课程ID
			$scope.curriId=$routeParams.ID;
			$scope.stars='';
			//刚进入页面查询课程信息
			$scope.curriobject='';			
			$.ajax({
				type:"post",
				url:"/cramCourse/getCourse",
				data:{
					'courseId':$scope.curriId, //课程ID
				},
				datatype:"json",
				success:function(data){
					$scope.curriobject=data.object;
					if(data.object.composite_score*10%10 <=2 && data.object.composite_score*10%10 != 0){
						$scope.stars='img/start2.png';

					}else if(data.object.composite_score*10%10 <=5 && data.object.composite_score*10%10 != 0){
						$scope.stars='img/start5.png';

					}else if(data.object.composite_score*10%10 <=9 && data.object.composite_score*10%10 != 0){
						$scope.stars='img/start8.png';
					}else if(data.object.composite_score == 5){
						$scope.stars='img/start10.png';
					}else{
						$scope.stars='img/start0.png';
					}	
					//是否收藏过
					if(data.object.isFavorite){
						$('.Collect').attr({class:"icon-Collect Collect"});
					}else if(!data.object.isFavorite){
						$('.Collect').attr({class:"icon-cramDe-c Collect"});
					}
					$scope.$apply();
					wxShareCurrentPage($scope.curriobject.course_name,$scope.curriobject.introduction);
				}
			});	
			$scope.paycurri=function(){
				//课程ID缓存
				localStorage.setItem("courseIdsArry",$scope.curriId);
				$location.path('/Order/');
			
			}
			
			//点击收藏
			$scope.Collect=function(){
				//收藏
				if($('.Collect').hasClass("icon-cramDe-c")){
					$('.Collect').attr({class:"icon-Collect CollectCheck Collect"});
					$.ajax({
						type:"post",
						url:"/favorite/addFavorite",
						data:{
							'goalId':$scope.curriId, //课程ID
							'type': 1,
							'url':window.location.href,
						},
						datatype:"json",
						success:function(data){
							
						}
					});						
				}else if($('.Collect').hasClass("icon-Collect")){
					$('.Collect').attr({class:"icon-cramDe-c Collect"});
					//取消收藏
					$.ajax({
						type:"post",
						url:"/favorite/cancelFavorite",
						data:{
							'goalId':$scope.curriId, //课程ID
							'type': 1,    //类型1为课程
						},
						datatype:"json",
						success:function(data){	
							
						}
					});							
					
				}				
				
			}
			
			
			
			//获取评论
			var EvpageSize=20;
			var EvpageIndex=1;
			$scope.EvaluateList='';	
			$scope.totalRow='';
			$.ajax({
				type:"post",
				url:"/courseEvaluate/getEvaluateList",
				data:{
					'cramCourseId':$scope.curriId, //课程ID
					'pageIndex': 1,
					'pageSize':20,
				},
				datatype:"json",
				success:function(data){		
					$scope.totalRow=data.object.totalRow;
					$scope.EvaluateList=data.object.list;
					$scope.$apply();
				}
			});			
			//下拉加载更多
			$(window).bind("scroll", function () {    
				if ($(document).scrollTop() + $(window).height() == $(document).height()){
					EvpageSize+=20;
					$.ajax({
						type:"post",
						url:"/courseEvaluate/getEvaluateList",
						data:{
							'cramCourseId':$scope.curriId, //课程ID
							'pageIndex': EvpageIndex,
							'pageSize':EvpageSize,
						},
						datatype:"json",
						success:function(data){			
							$scope.EvaluateList=data.object.list;
							$scope.$apply();
						}
					});
					
				}   
			});				
			
			
			
			
						
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
	.controller('ACinsureCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){	
			//订单编号缓存
			var orderIdsArry=localStorage.getItem("orderIds");
			//支付方式切换
			var applystates=document.getElementsByClassName("AC-Text02");			
			for(var i=0; i<applystates.length;i++){
				applystates[i].onclick=function(){
					var indexx=$(".AC-Text02").index($(this));
					for(var i=0; i<applystates.length;i++){
						$(".AC-Text02").removeClass("AC-active");
						$(".icon-Uncheck").removeClass("AC-check");
					}
					$(this).addClass("AC-active");					
					$(".icon-Uncheck").eq(indexx).addClass("AC-check");
					
				}
			}
			
			//获取草稿			
			$scope.teacher_phone='';
			$scope.balance='';
			$scope.margin='';		
			$.ajax({
				type:"post",
				url:"/order/getOrderAmount",
				data:{
					'orderIds':orderIdsArry,
				},
				datatype:"json",
				success:function(data){
					$scope.margin=data.object.amount;
					$scope.balance=data.object.balance;
					$scope.$apply();
				}
			});		
			//选择支付方式
			$scope.applyStyle=1;
			$scope.applystateWaY=function(e){
				$scope.applyStyle=e;
			}
			
			//提交支付
			
			$scope.submitCrams=function(){
				if($scope.applyStyle == 1){
					window.location.href="/c/pay/payForOrder?orderIds="+orderIdsArry;
				}else if($scope.applyStyle == 2){
					$.ajax({					
						type:"post",
						url:"/order/balancePayOrder",
						data:{
							"orderIds": orderIdsArry,  //订单编号数组
						},
						datatype:"json",
						success:function(data){
							if(data.isSuccess){
								$location.path('/paySuccess/'+orderIdsArry);								
							}else if(!data.isSuccess){
								$location.path('/payFail/');	
							}
							$scope.$apply();								
						}
					})
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
	//08补习班订单
	.controller('OrderCtl',[		
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var courseIdsArry=localStorage.getItem("courseIdsArry");
			$scope.orderlist='';
			$scope.discountTotal='';
			$scope.originalTotal='';
			$scope.paymentAmount='';
			$.ajax({
				type:"post",
				url:"/cramCourse/buyCourse",
				data:{
					'courseIds':courseIdsArry,
				},
				datatype:"json",
				success:function(data){	
					$scope.orderlist=data.object.courses_list;
					$scope.discountTotal=data.object.discountTotal;
					$scope.originalTotal=data.object.originalTotal;
					$scope.paymentAmount=data.object.paymentAmount;					
					$scope.$apply();
				}
			});			
			
			$scope.submitOrders=function(){
				$.ajax({
					type:"post",
					url:"/order/submitOrderForCourse",
					data:{
						'courseIds':courseIdsArry,
					},
					datatype:"json",
					success:function(data){	
						if(data.isSuccess){
							localStorage.setItem("orderIds",data.object);
							$location.path('/ACinsure/');						
						}else{
							alert(data.msg);
						}
						$scope.$apply();
					}
				});				
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


