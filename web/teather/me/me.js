(function(angular){
	'use strict';
	angular.module('Mme',[
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
		//01我的主页
		$routeProvider.when('/my/',{
			templateUrl:'me/me.html',
			controller:'meCtl'
		})
		//02我的订单
		.when('/MyOrders/',{
			templateUrl:'me/MyOrders.html',
			controller:'MyOrdersCtl'
		})
		//03订单详情
		.when('/OrderDetails/:ID',{
			templateUrl:'me/OrderDetails.html',
			controller:'OrderDetailsCtl'
		})
		//04退款订单详情
		.when('/RefundDetails/:ID',{
			templateUrl:'me/RefundDetails.html',
			controller:'RefundDetailsCtl'
		})	
		//05我的收藏
		.when('/MyCollect/',{
			templateUrl:'me/MyCollect.html',
			controller:'MyCollectCtl'
		})	
		//06 主页home
		.when('/home/',{
			templateUrl:'home/home.html',
			controller:'homeCtl'
		})	
		//07 我的业务
		.when('/MyBusiness/',{
			templateUrl:'me/MyBusiness.html',
			controller:'MyBusinessCtl'
		}) 
		//08 我申请的场地详情
		.when('/PlaceSold/:ID',{
			templateUrl:'me/PlaceSold.html',
			controller:'PlaceSoldCtl'
		})		
		//09 编辑修改场地
		.when('/editPlace/:ID',{
			templateUrl:'me/editPlace.html',
			controller:'editPlaceCtl'
		})			
		//10 我发布的场地详情
		.when('/MyPublishDe/:ID',{
			templateUrl:'me/MyPublishDe.html',
			controller:'MyPublishDeCtl'
		})			
		
		
		
		
	}])
	//01我的主页
	.controller('meCtl',[
		'$scope',
		function($scope){

			$scope.avatar='';	
			$scope.name='';	
			$scope.vip_type='';
			$scope.sex='';
			$scope.score='';
			$scope.balance='';
			$scope.ib_level='';
			$scope.verify='';
		  	$.post("/p/getMyInfo",
		    		{},
		        	function(data){		       
		        		$scope.ib_level=data.ib_level;
				        $scope.avatar=data.avatar;
				        $scope.name=data.name;	
				        $scope.vip_type=data.vip_type;
				        $scope.sex=data.sex;
				        $scope.score=data.score;
				        $scope.balance=data.balance;
				        $scope.verify=data.is_id_card_verify;
				        $scope.$apply();
		    });			
	
	}])

	//02我的订单
	.controller('MyOrdersCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//顶层tabs
			tabsfn('SCart-tabs','.SCart-tabs','.SCart-tabs01','SCactive');
						
			//膜态框取消理由动效
			var cancalReason=document.getElementsByClassName('cancalReason');
			for(var i=0;i<cancalReason.length;i++){
				cancalReason[i].onclick=function(){
					var indexx=$('.cancalReason').index($(this));
					for(var i=0;i<cancalReason.length;i++){
						$('.icon-Uncheck').removeClass('checksActive');
					}
					$('.icon-Uncheck').eq(indexx).addClass('checksActive');
				}
			}
			//膜态框展示
			$scope.cancalReasonFadein=function(Oid){
				$('.cancalState').fadeIn();
				localStorage.setItem("DeleteOrderId",Oid);
			}
			//膜态框消失
			$scope.cancalReasonFadeOut=function(){
				$('.cancalState').fadeOut();
			}
			//根据订单状态跳转不同的订单详情页
			$scope.goOrderDetails=function(OState,Oid){
				//OState订单状态,Oid订单ID
				if(OState == 0 || OState == 1 || OState == 2 || OState == 3 || OState == 4){
					$location.path('/OrderDetails/'+Oid);
				}else{
					$location.path('/RefundDetails/'+Oid);
				}
			}

			//确认取消
			$scope.InsureDelete=function(){
				//要取消的订单的ID
				var Oid=localStorage.getItem("DeleteOrderId");
				var cancelReason=$('.checksActive').siblings().html();
		    	$.ajax({
		    		type:"post",
		    		url:"/order/cancelOrder",
		    		data:{
		    			"orderId":Oid,
		    			"cancelReason":cancelReason,  
		    		},
		    		datatype:"json",
		    		success:function(data){
		    			//取消订单后重新获取列表数据
				    	$.ajax({
				    		type:"post",
				    		url:"/order/getOrderListForTeacher",
				    		data:{
				    			"pageIndex":1,
				    			"pageSize":20,  
				    		},
				    		datatype:"json",
				    		success:function(data){	
								$scope.carmdAllLsits=data.object.list;
								$scope.$apply();
				    		}
				    	});
				    	$('.cancalState').fadeOut();
		    		}
		    	});				
				
			}
			
			//进来默认获取全部
			$scope.carmdAllLsits='';
			//订单状态重置
			localStorage.setItem("orderStates",'');
	    	$.ajax({
	    		type:"post",
	    		url:"/order/getOrderListForTeacher",
	    		data:{
	    			"pageIndex":1,
	    			"pageSize":20,  
	    		},
	    		datatype:"json",
	    		success:function(data){		    			
	    			$('.spinner').fadeOut();
					$scope.carmdAllLsits=data.object.list;
					$scope.$apply();
	    		}
	    	});			

			
			//待支付0，已支付1，待评价2,   选项卡点击事件
			//第二层课程tabs
			var CDtabs=document.getElementsByClassName('MyOrders-tabs');			
			for(var i=0; i<CDtabs.length;i++){
				CDtabs[i].onclick=function(){
					var indexx=$('.MyOrders-tabs').index($(this));
					for(var i=0; i<CDtabs.length;i++){
						$('.MyOrders-tabs').removeClass('MOactive');
						$('.MyOrders-tabs01').removeClass("active");
					}
					if(indexx == 0){
						$('.spinner').fadeIn();
				    	$.ajax({
				    		type:"post",
				    		url:"/order/getOrderListForTeacher",
				    		data:{
				    			"pageIndex":1,
				    			"pageSize":20,  
				    		},
				    		datatype:"json",
				    		success:function(data){	
								$scope.carmdAllLsits=data.object.list;
								$scope.$apply();
				    		}
				    	});	
				    	localStorage.setItem("orderStates",'');
					}else if(indexx == 1 || indexx == 2 || indexx == 3){
						$('.spinner').fadeIn();
				    	$.ajax({
				    		type:"post",
				    		url:"/order/getOrderListForTeacher",
				    		data:{
				    			"pageIndex":1,
				    			"pageSize":20, 
				    			"status":indexx-1,  //订单状态
				    		},
				    		datatype:"json",
				    		success:function(data){					    			
								$scope.carmdAllLsits=data.object.list;
								$scope.$apply();
				    		}
				    	});	
				    	localStorage.setItem("orderStates",indexx-1);
					}					
					pageSizes=20;
					$('.spinner').fadeOut();
					$(this).addClass('MOactive');					
					$('.MyOrders-tabs01').eq(indexx).addClass("active");
				}
			}
			
			
			
			//下拉加载更多
			var pageSizes=20;
			$(window).bind("scroll", function () {    
				if ($(document).scrollTop() + $(window).height() == $(document).height()){
					$('.spinner').fadeIn();
			    	var orderStates=localStorage.getItem("orderStates");
			    	pageSizes+=20;
			    		
			    	$.ajax({
			    		type:"post",
			    		url:"/order/getOrderListForTeacher",
			    		data:{
			    			"pageIndex":1,
			    			"pageSize":pageSizes, 
			    			"status":orderStates,  //订单状态
			    		},
			    		datatype:"json",
			    		success:function(data){	
			    			$('.spinner').fadeOut();			    			
							$scope.carmdAllLsits=data.object.list;
							$scope.$apply();
			    		}
			    	});
					
				}   
			});	
			
			
			
			
			
			
			
			//等ng-repeat之后再往元素上面绑定事件
//			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
//				//左滑
//				scartdelete('.Mychilds-container');
//	        
//	        
//	        	on-finish-render
//		
//			})			
			

			
	}])

	//03订单详情
	.controller('OrderDetailsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var Oid=$routeParams.ID;   //订单ID
			
			//获取基本信息
			$scope.OrderListDetail='';
			$scope.failureTimeH='';
			$scope.failureTimeM='';
	    	$.ajax({
	    		type:"post",
	    		url:"/order/getOrderListForTeacher",
	    		data:{
	    			"orderId":Oid,        //订单ID
	    		},
	    		datatype:"json",
	    		success:function(data){	
					$scope.OrderListDetail=data.object.list[0];	
					$scope.failureTimeH=parseInt(data.object.list[0].failureTime/1000/60/60);
					$scope.failureTimeM=parseInt(((data.object.list[0].failureTime/1000/60/60)-$scope.failureTimeH)*60);
					$scope.$apply();
	    		}
	    	});		
	    	//到期时间倒计时
			setInterval(function(){
		    	$.ajax({
		    		type:"post",
		    		url:"/order/getOrderListForTeacher",
		    		data:{
		    			"orderId":Oid,        //订单ID
		    		},
		    		datatype:"json",
		    		success:function(data){	
						$scope.failureTimeH=parseInt(data.object.list[0].failureTime/1000/60/60);
						$scope.failureTimeM=parseInt(((data.object.list[0].failureTime/1000/60/60)-$scope.failureTimeH)*60);
						$scope.$apply();
		    		}
		    	});				
			},60000);
			
			//膜态框取消理由动效
			var cancalReason=document.getElementsByClassName('cancalReason');
			for(var i=0;i<cancalReason.length;i++){
				cancalReason[i].onclick=function(){
					var indexx=$('.cancalReason').index($(this));
					for(var i=0;i<cancalReason.length;i++){
						$('.icon-Uncheck').removeClass('checksActive');
					}
					$('.icon-Uncheck').eq(indexx).addClass('checksActive');
				}
			}			
			
			//膜态框展示
			$scope.cancalReasonFadein=function(Oid){
				$('.cancalState').fadeIn();
				localStorage.setItem("DeleteOrderId",Oid);
			}
			//膜态框消失
			$scope.cancalReasonFadeOut=function(){
				$('.cancalState').fadeOut();
			}

			//确认删除
			$scope.InsureDelete=function(){
				//要删除的订单的ID
				var Oid=localStorage.getItem("DeleteOrderId");
				var cancelReason=$('.checksActive').siblings().html();
		    	$.ajax({
		    		type:"post",
		    		url:"/order/cancelOrder",
		    		data:{
		    			"orderId":Oid,
		    			"cancelReason":cancelReason,  
		    		},
		    		datatype:"json",
		    		success:function(data){
		    			//取消订单后重新获取列表数据		    			
				    	$('.cancalState').fadeOut();
				    	alert(data.msg);
				    	$.ajax({
				    		type:"post",
				    		url:"/order/getOrderList",
				    		data:{
				    			"orderId":Oid,        //订单ID
				    		},
				    		datatype:"json",
				    		success:function(data){	
								$scope.OrderListDetail=data.object.list[0];									
								$scope.$apply();
				    		}
				    	});				    	
		    		}
		    	});					
			}

			//去评价动作
			$scope.goEvaluate=function(Oid){
				//要评价的Oid订单ID
				$location.path('/Evaluate/'+Oid);
			}

	}])


	//04退款订单详细
	.controller('RefundDetailsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//强制中止
			$scope.forceStop=function(){
				$('.HandleState02').fadeIn();
			}
			//膜态框消失
			$scope.cancelForceStop=function(){
				$('.HandleState02').fadeOut();
				$('.HandleState03').fadeOut();
				$('.HandleState04').fadeOut();
			}
			//膜态框中确认强制中止
			$scope.insureForceStop=function(){
				$('.HandleState02').fadeOut();
				$('.HandleState01').fadeIn();
			}
			//成功强制中止后跳出的成功提示膜态框
			$scope.successForceStop=function(){
				$('.HandleState01').fadeOut();
			}
			
			//同意退款膜态框展示
			$scope.AgreeRefund=function(){
				$('.HandleState03').fadeIn();
			}
			//同意退款
			$scope.insureRefund=function(){
				$('.HandleState03').fadeOut();
			}
			
			//拒绝退款膜态框展示
			$scope.RefuseRefund=function(){
				$('.HandleState04').fadeIn();
			}			
			//提交拒绝退款理由
			$scope.SubmitRReason=function(){
				$('.HandleState04').fadeOut();
			}

	}])

	//05我的收藏
	.controller('MyCollectCtl',[
		'$scope',
		function($scope){
			$scope.goback=function(){
				window.history.back();
			}
			//01获取列表
			$scope.CollectList='';
	    	$.ajax({
	    		type:"post",
	    		url:"/favorite/getFavoriteList",
	    		data:{},
	    		datatype:"json",
	    		success:function(data){	
	    			$scope.CollectList=data.object;
	    			$scope.$apply();
	    		}
        	});				

			//02删除
			$scope.CollectDelete=function(id){
		    	$.ajax({
		    		type:"post",
		    		url:"/favorite/deleteFavorite",
		    		data:{
		    			"favoriteId":id,
		    		},
		    		datatype:"json",
		    		success:function(data){			    			
				    	$.ajax({
				    		type:"post",
				    		url:"/favorite/getFavoriteList",
				    		data:{},
				    		datatype:"json",
				    		success:function(data){	
				    			$scope.CollectList=data.object;
				    			$scope.$apply();
				    		}
			        	});			    			
		    			scartdelete('.MyCollect-container');
		    		}
	        	});
			}

			
			//等ng-repeat之后再往元素上面绑定事件
			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				scartdelete('.MyCollect-container');	        	
			})
			
		
		
	}])


	//06主页home
	.controller('homeCtl',[
		'$scope',
		'$location',
		'$routeParams',
		'$route',
		function($scope,$location,$routeParams,$route){
			//01地址tabs
			tabsfn('zoneBody','.zoneBody','.zoneBody01','tabItemactive');	
			//02是否选择了默认城市
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
			
			//03是否是合伙人
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
										
			//04是否有店铺（补习班）		
			$scope.ishaveShop=function(){
				$.ajax({
					type:"post",
					url:"/cramSchool/getCramSchoolState",
					data:{},
					datatype:"json",
					success:function(data){	
						if(data.object==null){
							$location.path('/noshop/');
						}else{
							if(data.object.state == 1){
								$location.path('/noshop/');
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
					
					
					
					
					
					
					
					
					
					
			//05等ng-repeat之后再往元素上面绑定事件
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

	//07我的业务
	.controller('MyBusinessCtl',[
		'$scope',
		'$location',
		'$routeParams',
		'$route',
		function($scope,$location,$routeParams,$route){
			//01 我申请的/我发布的tab切换
			tabsfn('MyBustabs','.MyBustabs','.MyBustabs01','yewuactive');
			//02 我申请的-生源/场地tab切换
			tabsfn('MyRelease','.MyRelease','.MyRelease01','MyRelease_Acitve');
			//03 我申请的-生源/场地tab切换
			tabsfn('MyApplyfor','.MyApplyfor','.MyApplyfor01','MyRelease_Acitve');
			//04获取我发布的场地列表
			$scope.MyPlaceList='';
			$.ajax({
				type:"post",
				url:"/api/rentPlace/getAllRentPlaceByMe",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.MyPlaceList=data.object;
					$scope.$apply();
				}
			});				
			//05获取我申请的场地列表
			$scope.MyAppliedList='';
			$.ajax({
				type:"post",
				url:"/api/rentOrder/getAllRentOrderByMe",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.MyAppliedList=data.object;
					$scope.$apply();
				}
			});	
			//06删除我发布的场地列表
			$scope.DeletePlace01=function(Placeid){
				
				$.ajax({
					type:"post",
					url:"/api/rentOrder/deleteRentPlace",
					data:{
						'rent_place_id':Placeid,
					},
					datatype:"json",
					success:function(data){
						$.ajax({
							type:"post",
							url:"/api/rentPlace/getAllRentPlaceByMe",
							data:{},
							datatype:"json",
							success:function(data){
								$scope.MyPlaceList=data.object;
								$scope.$apply();
							}
						});				
					}
				});				
			}
			
			//07我申请的场地列表
			$scope.DeletePlace02=function(Placeid){
				$.ajax({
					type:"post",
					url:"/api/rentOrder/deleteRentPlace",
					data:{
						'rent_place_id':Placeid,
					},
					datatype:"json",
					success:function(data){			
						$.ajax({
							type:"post",
							url:"/api/rentOrder/getAllRentOrderByMe",
							data:{},
							datatype:"json",
							success:function(data){
								$scope.MyAppliedList=data.object;
								$scope.$apply();
							}
						});							
					}
				});				
				
				
				
			}







	
	}])

	//08 我申请的场地详情
	.controller('PlaceSoldCtl',[
		'$scope',
		'$location',
		'$routeParams',
		'$route',
		function($scope,$location,$routeParams,$route){
			var OrderId=$routeParams.ID;   //订单ID
			//01返回
			$scope.goback=function(){
				window.history.back();
			}
			//02场地信息
			$scope.PlaceSoldDe='';
			$.ajax({
				type:"post",
				url:"/api/rentOrder/getDetailRentByMe",
				data:{
					'order_id':OrderId,    //订单ID
				},
				datatype:"json",
				success:function(data){
					$scope.PlaceSoldDe=data.object;
					$scope.$apply();
				}
			});	





	
	}])

	//09 编辑修改场地信息
	.controller('editPlaceCtl',[
		'$scope',
		'$location',
		'$routeParams',
		'$route',
		function($scope,$location,$routeParams,$route){
			$scope.PlaceId=$routeParams.ID;   //场地ID
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}
			//02获取场地基本信息
			$scope.PlaceDetails='';
			$.ajax({
				type:"post",
				url:"/api/rentPlace/editRentPlace",
				data:{
					'rent_place_id':$scope.PlaceId,    //订单ID
				},
				datatype:"json",
				success:function(data){
					$scope.PlaceDetails=data.object;
					$scope.$apply();
				}
			});	

			
			
			//03提交修改的场地信息
			$scope.Release=function(){
				var formData = new FormData($( "#formPlace" )[0]);
				$.ajax({
					type:"post",
					url:"/api/rentPlace/saveAfterEdit",
					data:formData,
					datatype:"json",
					async: false,
					cache: false,
					contentType: false,
					processData: false,
					success:function(data){	
						alert(data.msg);
						if(data.isSuccess){
							$location.path('/MyBusiness/'); 
						}
						$scope.$apply();
					}
				});					
			}



	
	}])

	//10 我发布的场地详情
	.controller('MyPublishDeCtl',[
		'$scope',
		'$location',
		'$routeParams',
		'$route',
		function($scope,$location,$routeParams,$route){
			var PlaceId=$routeParams.ID;   //场地ID
			//01返回上一页历史
			$scope.goback=function(){
				window.history.back();
			}	

			//02获取场地基本信息
			$scope.PlaceDetail='';
			$.ajax({					
				type:"post",
				url:"/api/rentOrder/rentPlaceDetail",
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











})(angular)