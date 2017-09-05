(function(angular){
	'use strict';
	angular.module('Mvip',[
		'ngRoute'
	])
	.config(['$routeProvider',function($routeProvider){
		$routeProvider.when('/vip/',{
			templateUrl:'vip/vip.html',
			controller:'vipCtl'
		})
	}])
	.controller('vipCtl',[
		'$scope',
		function($scope){
			//年费月费类型
			$scope.viptype='m';	
			//支付类型
			$scope.paytype=1;
			//开通时长
			$scope.viptime=1;
			//实际支付
	    	$scope.Totalamount=30;
	    	//原价
	    	$scope.originalPrice=360;
	    	//年月开关
	    	$scope.yuanonoff=true;			
			
			//会员点击事件
			$scope.vipService=function($event){
				$($event.target).toggleClass('greedborder-active');

			};
			//月费年费点击事件
			$scope.monthandyear=function($event,viptype){
				$scope.viptype=viptype;
				$scope.viptime=1;
				if($scope.viptype == "y" && $scope.viptime > 0){
					if($scope.viptime == 1){
						$scope.Totalamount=100;
						$scope.originalPrice=360;
					}
					
					
				}else if($scope.viptype == "m" && $scope.viptime > 0){
					
					if($scope.viptime == 1){
						$scope.Totalamount=30;		
					}
													
				}else{
					$scope.Totalamount="查询异常";
					$scope.yuanonoff=false;
				}
								
				$(".tehui").click(function(e){  
		            e.stopPropagation();  
		            e.preventDefault();
		      }); 							
				$('.month-year').removeClass('greedborder-active');
				$($event.target).addClass('greedborder-active');
				
				$scope.page =$event.target.getAttribute('data-vip');
				
				$('.month-year-show').css('display','none');
				$('.month-year-show').eq($scope.page).css('display','block');				
			}


			//支付方式点击事件
			$scope.paystyle=function($event,paytype){
				$scope.paytype=paytype;	
				$('.pay-style').removeClass('greedborder-active');
				$($event.target).addClass('greedborder-active');
				
			}	
			
			
			$scope.name='';
			$scope.balance='';
			$scope.parentVip='';
			$scope.sex='';
			$scope.avatar='';
			$scope.vip_end_time='';
			
			//界面初始化函数
			var resetvip=function(){
		    	$.ajax({
		    		type:"post",
		    		url:"/p/getMyInfo",
		    		data:{},
		    		datatype:"json",
		    		success:function(data){	
		    			
						$scope.name=data.name;
						$scope.balance=data.balance;
						$scope.parentVip=data.parentVip;
						$scope.sex=data.sex;
						$scope.avatar=data.avatar;
						$scope.vip_end_time=data.parentVipEndTime;	
						$scope.$apply();
						
		    		}
		
		    	});					
			}
			//界面初始化执行
			resetvip();

	    	//获取应付金额
	    	$scope.inputviptime=function(viptime){
				$scope.viptime=viptime;

				$.ajax({					
					type:"post",
					url:"/c/getVipPrice",
					data:{
						"type": $scope.viptype,
						"no":viptime,
					},
					datatype:"json",
					success:function(data){
						
						$scope.Totalamount=data.msg;
						$scope.originalPrice=data.originalPrice;
						$scope.yuanonoff=data.isSuccess;	
						if($scope.viptype == "y" && $scope.viptime > 0){
							if($scope.viptime == 1){
								$scope.Totalamount=100;
								$scope.originalPrice=360;
							}
							
							
						}else if($scope.viptype == "m" && $scope.viptime > 0){
							
							if($scope.viptime == 1){
								$scope.Totalamount=30;		
							}
															
						}else{
							$scope.Totalamount="查询异常";
							$scope.yuanonoff=false;
						}

						$scope.$apply();
						
					}
				})	

	    	}
			//提交支付事件
			$scope.submitpay=function(Totalamount,balance){			
				if($scope.paytype == 1){
					window.location.href="/c/pay/openVipByWechatPay?type="+$scope.viptype+"&no="+$scope.viptime+"&identity=1"; 
				}else if($scope.paytype == 2){
					if(Totalamount <= balance){
						$.ajax({					
							type:"post",
							url:"/c/openVip",
							data:{
								"type": $scope.viptype,
								"no":$scope.viptime,
								"identity":1
							},
							datatype:"json",
							success:function(data){
								alert(data.msg)
								resetvip()
								$scope.$apply();
								
							}
						})
					}else{
						alert("余额不足，使用微信支付或先充值");
					}						
				}
										
			}
	
			
	}])
	
	
})(angular)