(function(angular){
	'use strict';
	angular.module('Mwallet',[
		'ngRoute'
	])
	.config(['$routeProvider',function($routeProvider){
		$routeProvider
		//01钱包主页
		.when('/wallet/',{
			templateUrl:'wallet/wallet.html',
			controller:'walletCtl'
		})
		//02查看流水
		.when('/FWater/',{
			templateUrl:'FlowingWater/FlowingWater.html',
			controller:'FlowingWaterCtl'
		})
		//03提现
		.when('/WDCash/',{
			templateUrl:'wallet/withdrawCash.html',
			controller:'wdCashCtl'
		})
		//04提现记录
		.when('/WDCRecord/',{
			templateUrl:'FlowingWater/wdCRecord.html',
			controller:'wCashReCtl'
		})	
		//05意见反馈
		.when('/feedback/',{
			templateUrl:'wallet/feedback.html',
			controller:'feedbackCtl'
		})
		//06星币兑换记录
		.when('/duihuanjilu/',{
				templateUrl:'FlowingWater/duihuanjilu.html',
				controller:'duihuanjiluCtl'
			})
		//07课单支付界面
		.when('/payment/:MN/:ID',{
			templateUrl:'wallet/payment.html',
			controller:'paymentCtl'
		})
		//08没有银行卡中转界面
		.when('/noCard/',{
			templateUrl:'wallet/noCard.html',
			controller:'NoCardCtl'
		})		
		//09修改银行卡界面
		.when('/RCard/',{
			templateUrl:'wallet/reviseCard.html',
			controller:'RCardCtl'
		})	
		//10充值界面
		.when('/recharge/',{
			templateUrl:'wallet/recharge.html',
			controller:'rechargeCtl'
		})		
	}])
	//01钱包主页控制器
	.controller('walletCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			$scope.users='';
			$.ajax({
				type:"post",
				url:"/c/userInfo",
				data:{},
				datatype:"json",
				success:function(data){					
					$scope.users=data;
					$scope.$apply()
				}
			});
			
			$scope.Withdrawalss=function(){
				$.ajax({
					type:"post",
					url:"/bankCard/getBankCard",
					data:{},
					datatype:"json",
					success:function(data){
						if(data.object){
							$location.path('/WDCash/');
							
						}else if(!data.object){
							$location.path('/noCard/');
							
						}
						$scope.$apply()
					}
				});
			}
		
		
		
		
	}])
	
	
	
	//02查看流水控制器
	.controller('FlowingWaterCtl',[
		'$scope',
		function($scope){			
			var PTNumber=1; //页数
			var PTSize=30;  //页大小
			$scope.fwlists='';
			$scope.totalRow=1000;
			$.ajax({
				type:"post",
				url:"/balanceRecord/getBalanceRecordList",
				data:{
					"pageIndex":1, //页数，默认1
					"pageSize":PTSize , //页大小 默认不传递时为20
				},
				datatype:"json",
				success:function(data){
					$scope.totalRow=data.totalRow;
					$scope.fwlists=data.list;
					console.log(data);
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
							"pageIndex": PTNumber,//页数
							"pageSize": PTSize,//页大小
						},
						datatype:"json",
						success:function(data){
							$scope.fwlists=data.list;		
							$scope.$apply();

						}
					});	
	
			    }
			    
			});
			

			
	}])	
	
	
	//03钱包提现控制器
	.controller('wdCashCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//页面数据初始化
			$scope.cardInfo='';
			$.ajax({
				type:"post",
				url:"/bankCard/getBankCard",
				data:{},
				datatype:"json",
				success:function(data){	
					$scope.cardInfo=data.object;
					$scope.$apply()
				}
			});				
			$scope.usersInfo='';
			$.ajax({
				type:"post",
				url:"/c/userInfo",
				data:{},
				datatype:"json",
				success:function(data){					
					$scope.usersInfo=data;			
					$scope.$apply()
				}
			});
			//提现请求
			$scope.wDCmoney=function(){
				var amounts=$('.MoneyNumber').val();
				$.ajax({
					type:"post",
					url:"/withdraw/withdrawalApply",
					data:{
						"amount":amounts,
					},
					datatype:"json",
					success:function(data){
						alert(data.msg);
						if(data.isSuccess){
							location.reload();
						}												 
						$scope.$apply();
					}
				});				
			}
			
	}])	
	
	//04提现记录控制器
	.controller('wCashReCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var PTNumber=1; //页数
			var PTSize=30;  //页大小		
			
			$scope.totalRow=1000;
			$scope.wdCRecords='';
			
			$.ajax({
				type:"post",
				url:"/withdraw/withdrawList",
				data:{
					"pageNumber": 1,//页数
					"pageSize": 30,//页大小
				},
				datatype:"json",
				success:function(data){							
					$scope.wdCRecords=data.list;
					$scope.totalRow=data.totalRow;
					$scope.$apply();
				}
			});			
				
			//下拉加载更多
			$(window).bind("scroll", function () {
			    if ($(document).scrollTop() + $(window).height()> $(document).height()+40) {    	
			    	PTSize+20;
	     			$.ajax({
						type:"post",
						url:"/withdraw/withdrawList",
						data:{
							"pageNumber": PTNumber,//页数
							"pageSize": PTSize,//页大小
						},
						datatype:"json",
						success:function(data){							
							$scope.wdCRecords=data.list;							
							$scope.$apply();

						}
					});	
	
			    }
			    
			});



			
	}])		
	
	//05意见反馈控制器
	.controller('feedbackCtl',[
		'$scope',
		function($scope){
			$scope.submitfeedback=function(){
				var feedback=$(".feedback textarea").val();
				if(feedback){
					$.ajax({
						type:"post",
						url:"/c/feedbackSave",
						data:{
							"content":feedback,
						},
						datatype:"json",
						success:function(data){
						}						
					});										
					alert('感谢您提出的建议和意见，我们将努力做得更好');
					window.location.reload(); 
				}else{
					alert('请填写您的建议和意见');
				}
				
			}
	}])	
	


	//06星币兑换记录控制器
	.controller('duihuanjiluCtl',[
		'$scope',
		function($scope){

			
			
		
		
		
		
	}])
	//07课单支付界面
	.controller('paymentCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var paynumbers=$routeParams.MN;
			var currId=$routeParams.ID;
			$scope.paynumbers=paynumbers;
			
			//提交支付事件
			$scope.payWei=function(){							
				window.location.href="/c/pay/payCurriculumByWechat?currId="+currId; 
						
			}			
			
			$scope.payWal=function(){			
				$.ajax({					
						type:"post",
						url:"/c/curriculum/payCurriculum",					
						data:{
							"currId": currId, //课单ID
						},
						datatype:"json",
						success:function(data){
							alert(data.msg);
							$location.path('/dynamic/');
							$scope.$apply();
							
					}
				})											
			}
										
			
	}])

	//08没有银行卡中转界面
	.controller('NoCardCtl',[
		'$scope',
		function($scope){

										
			
	}])
	
	
	//09修改银行卡界面
	.controller('RCardCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			$scope.reviCard=function(){
				var cardinfo=$('.reCardinfo').serializeArray()
				$.ajax({					
					type:"post",
					url:"/bankCard/tiedCard",					
					data:{
						"bank.bank_name": cardinfo[0].value,
						"bank.branch_name": cardinfo[1].value,
						"bank.card_number": cardinfo[2].value,
						"bank.username": cardinfo[3].value,
					},
					datatype:"json",
					success:function(data){
						alert(data.msg);
						$location.path('/WDCash/');
						$scope.$apply();
						
					}
				})
			}
										
			
	}])	
	//10充值控制器
	.controller('rechargeCtl',[
		'$scope',
		function($scope){

	}])	
	
})(angular)


