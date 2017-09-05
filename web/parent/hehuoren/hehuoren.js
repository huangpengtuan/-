(function(angular){
	'use strict';
	angular.module('Mpartner',[
		'ngRoute'
	])
	.config(['$routeProvider',function($routeProvider){
		$routeProvider
		//01合伙人
		.when('/partner/',{
			templateUrl:'hehuoren/hehuoren.html',
			controller:'partnerCtl'
		})
		//02规则明细
		.when('/guizemingxi/',{
			templateUrl:'hehuoren/guizemingxi.html',
			controller:'guizemingxiCtl'
		})
		//03星币兑换
		.when('/wagesExchange/',{
			templateUrl:'hehuoren/wagesExchange.html',
			controller:'wagesExchangeCtl'
		})
		//04合伙人申请
		.when('/ApplyPartner/',{
			templateUrl:'hehuoren/ApplyPartner.html',
			controller:'ApplyPartnerCtl'
		})		
		
		//05合伙人支付
		.when('/PartnerPay/',{
			templateUrl:'hehuoren/PartnerPay.html',
			controller:'PartnerPayCtl'
		})
		
		
		
	}])
	//01合伙人控制器
	.controller('partnerCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			tabsfn('DirIntro-tabs','.DirIntro-tabs','.DirIntro-tabs01','DirIntroactive');
			//01累计收入列表展示
			$scope.FlowRecordList01='';
			$scope.totalRow01='';
			$scope.showListFn01=function(){
		    	$.ajax({
		    		type:"post",
		    		url:"/partnerFlowRecord/getFlowRecordList",
		    		data:{
		    			"pageIndex":1,
		    			"pageSize":10000,
		    			"type":5,
		    		},
		    		datatype:"json",
		    		success:function(data){	
		    			console.log(data);
						$scope.FlowRecordList01=data.object.list;
						$scope.totalRow01=data.object.totalRow;
						$scope.$apply();
		    		}
	        	});						
				$('.Partner').fadeOut();
				$('.AmountOfIncome').fadeIn();
			}
			//02贡献值列表展示
			$scope.FlowRecordList02='';
			$scope.totalRow02='';
			$scope.showListFn02=function(){
		    	$.ajax({
		    		type:"post",
		    		url:"/partnerFlowRecord/getFlowRecordList",
		    		data:{
		    			"pageIndex":1,
		    			"pageSize":10000,
		    			"type":1,
		    		},
		    		datatype:"json",
		    		success:function(data){	
						$scope.FlowRecordList02=data.object.list;
						$scope.totalRow02=data.object.totalRow;
						$scope.$apply();
		    		}
	        	});				
				
				$('.Partner').fadeOut();
				$('.ContributionValue').fadeIn();
			}
			//03工资列表展示
			$scope.FlowRecordList03='';
			$scope.totalRow03='';
			$scope.showListFn03=function(){
		    	$.ajax({
		    		type:"post",
		    		url:"/partnerFlowRecord/getFlowRecordList",
		    		data:{
		    			"pageIndex":1,
		    			"pageSize":10000,
		    			"type":0,
		    		},
		    		datatype:"json",
		    		success:function(data){	
						$scope.FlowRecordList03=data.object.list;
						$scope.totalRow03=data.object.totalRow;
						$scope.$apply();
		    		}
	        	});
				$('.Partner').fadeOut();
				$('.wages').fadeIn();
			}			
			//04直接引进列表展示
			$scope.directIntrodu='';
			$scope.directTotal='';
			$scope.indirectIntrodu='';
			$scope.indirectTotal='';
			$scope.showListFn04=function(a){
		    	$.ajax({
		    		type:"post",
		    		url:"/partner/getDirectUserList",
		    		data:{
		    			"pageIndex":1,
		    			"pageSize":10000,
		    		},
		    		datatype:"json",
		    		success:function(data){		    			
						$scope.directIntrodu=data.object.list;
						$scope.directTotal=data.object.totalRow;
						$scope.$apply();
		    		}
	        	});				
		    	$.ajax({
		    		type:"post",
		    		url:"/partner/getIndirectUserList",
		    		data:{
		    			"pageIndex":1,
		    			"pageSize":10000,
		    		},
		    		datatype:"json",
		    		success:function(data){		    			
						$scope.indirectIntrodu=data.object.list;
						$scope.indirectTotal=data.object.totalRow;
						$scope.$apply();
		    		}
	        	});	
	        	var Dirtabs=$('.DirIntro-tabs');
	        	if(a == 2){	        													
					for(var i=0;i<Dirtabs.length;i++){
						$('.DirIntro-tabs').removeClass('DirIntroactive');
						$('.DirIntro-tabs01').removeClass('active');
					}
					$('.DirIntro-tabs').eq(1).addClass('DirIntroactive');
					$('.DirIntro-tabs01').eq(1).addClass('active');
	        	}else if(a == 1){
					for(var i=0;i<Dirtabs.length;i++){
						$('.DirIntro-tabs').removeClass('DirIntroactive');
						$('.DirIntro-tabs01').removeClass('active');
					}
					$('.DirIntro-tabs').eq(0).addClass('DirIntroactive');
					$('.DirIntro-tabs01').eq(0).addClass('active');	        		
	        	}
				$('.Partner').fadeOut();
				$('.DirectIntro').fadeIn();
			}
						
			//05我的红利列表展示
			$scope.FlowRecordList04='';
			$scope.totalRow04='';
			$scope.showListFn05=function(){
		    	$.ajax({
		    		type:"post",
		    		url:"/partnerFlowRecord/getFlowRecordList",
		    		data:{
		    			"pageIndex":1,
		    			"pageSize":10000,
		    			"type":2,
		    		},
		    		datatype:"json",
		    		success:function(data){			    			
						$scope.FlowRecordList04=data.object.list;
						$scope.totalRow04=data.object.totalRow;
						$scope.$apply();
		    		}
	        	});	
				$('.Partner').fadeOut();
				$('.ContributionValue-HL').fadeIn();
			}				
			//06去规则明细
			$scope.goguize=function(){
				$location.path('/guizemingxi/');
			}
			//07膜态框消失
			$scope.membraneDisappear=function(){				
				$('.AmountOfIncome').fadeOut();
				$('.ContributionValue').fadeOut();
				$('.wages').fadeOut();
				$('.DirectIntro').fadeOut();
				$('.ContributionValue-HL').fadeOut();
				$('.Partner').fadeIn();

			}
			//08返回
			$scope.goback=function(){
				window.history.back();
			}
			//初进界面，获取界面数据
			$scope.Pcontent="";
	    	$.ajax({
	    		type:"post",
	    		url:"/partner/getPartnerInfo",
	    		data:{},
	    		datatype:"json",
	    		success:function(data){	
					$scope.Pcontent=data.object;
					$scope.$apply();
	    		}
        	});				
			
			
			
		

			
	}])

	
	//02规则明细
	.controller('guizemingxiCtl',[
		'$scope',
		'$location',
		'$routeParams',
		function($scope,$location,$routeParams){

			

			
	}])	
	//03工资兑换
	.controller('wagesExchangeCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01选择兑换方式事件
			var WExchange=$('.WExchange_stateTOP');
			for(var i=0;i<WExchange.length;i++){
				WExchange[i].onclick=function(){
					var indexx=$('.WExchange_stateTOP').index($(this));
					for(var i=0;i<WExchange.length;i++){
						$('.WExchange_state').removeClass('PartnerActive');
						$('.icon-Uncheck').removeClass('AC-check');
						$('.WExchange_Data').slideUp();
					}
					$scope.Salarys=0;
					$scope.SalaryNumber=0;
					$scope.$apply();
					$('.WExchange_state').eq(indexx).addClass('PartnerActive');
					$('.icon-Uncheck').eq(indexx).addClass('AC-check');
					$('.WExchange_Data').eq(indexx).slideDown();
					
					
					
				}
			}
			//02输入兑换数额获取金额事件
			$scope.SalaryNumber=0;
			$scope.Salarys=0;
			var SStates='';
			var SNumbers=''
			$scope.getSalary=function(SState,SNumber){
				SStates=SState;	
				SNumbers=SNumber;
		    	$.ajax({
		    		type:"post",
		    		url:"/partner/getSalaryConversionResult",
		    		data:{
		    			"changeNumber":SNumber,
		    			"type":SState,
		    		},
		    		datatype:"json",
		    		success:function(data){	
		    			if(SNumber == 0){
		    				$scope.Salarys == 0;
		    				
		    			}else if(SNumber > 0){
		    				$scope.Salarys=data.object;
		    			}		    			
						$scope.$apply();
		    		}
	        	});
			}
			//03获取工资数据
			$scope.Pcontent="";
	    	$.ajax({
	    		type:"post",
	    		url:"/partner/getPartnerInfo",
	    		data:{},
	    		datatype:"json",
	    		success:function(data){	
					$scope.Pcontent=data.object;
					$scope.$apply();
	    		}
        	});
        	//04提交兑换请求
        	$scope.submitExchange=function(){
	 	    	$.ajax({
		    		type:"post",
		    		url:"/partner/wageChange",
		    		data:{
		    			"changeNumber":SNumbers,
		    			"type":SStates,
		    		},
		    		datatype:"json",
		    		success:function(data){	
						alert(data.msg);
						if(data.isSuccess){
					    	$.ajax({
					    		type:"post",
					    		url:"/partner/getPartnerInfo",
					    		data:{},
					    		datatype:"json",
					    		success:function(data){	
									$scope.Pcontent=data.object;
									$scope.$apply();
					    		}
				        	});
						}
		    		}
	        	});
        	}
			//04返回
			$scope.goback=function(){
				window.history.back();
			}
        	
        	
        	
			
	}])	
	
	//04合伙人申请
	.controller('ApplyPartnerCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01返回
			$scope.goback=function(){
				window.history.back();
			}
			//02申请状态切换
			var applytabs=$('.applyPartnertabs');
			for(var i=0;i<applytabs.length;i++){
				applytabs[i].onclick=function(){
					$(this).addClass('activeFuck');
				}
			}
			

			//03合伙人选择
			var partnerCheck=$('.APData_check');
			for(var i=0;i<partnerCheck.length;i++){
				partnerCheck[i].onclick=function(){
					var indexx=$('.APData_check').index($(this));
					for(var i=0;i<partnerCheck.length;i++){
						$('.APData_check').removeClass('PartnerActive');
						$('.icon-Uncheck').removeClass('checksActive');
					}
					$(this).addClass('PartnerActive');
					$('.icon-Uncheck').eq(indexx).addClass('checksActive');	
				}
			}
			//04跳支付
			$scope.submitpay=function(){	
				//需支付的钱
				localStorage.setItem('NeedMoney',$('.checksActive').attr('data-NeedMoney'));
								
		    	$.ajax({
		    		type:"post",
		    		url:"/openPartnerApply/saveOpenPartnerApply",
		    		data:{
		    			"verCode":$('#verCode').val(), //验证码
		    			"apply.name":$('#names').val(), //姓名
		    			"apply.mobile":$('#mobile').val(), //电话
		    			"apply.partner_type":$('.checksActive').attr('data-partnerType'), //合伙人类型
		    		},
		    		datatype:"json",
		    		success:function(data){	
		    			console.log(data);
						if(!data.isSuccess){
							alert(data.msg);
						}else if(data.isSuccess || data.object==3){
							$location.path('/PartnerPay/');
						}
						$scope.$apply();
		    		}
	        	});
			}
			//05立刻开通
			$scope.immediately=function(){
				$('.applyPartnertabs').removeClass('applyPartneractive');
				$('.applyPartnertabs1').removeClass('active');
				$('.applyPartnertabs').eq(0).addClass('applyPartneractive');
				$('.applyPartnertabs1').eq(0).addClass('active');
			}
			//05去规则明细
			$scope.goguize=function(){
				$location.path('/guizemingxi/');
			}
			//06发送验证码
			var daojishu=60	;
			$scope.getYZM=function(){
				var mobiles=$('#mobile').val();
		    	$.ajax({
		    		type:"post",
		    		url:"/openPartnerApply/sendSmsByOpenPartner",
		    		data:{
		    			"mobile":mobiles, //电话
		    		},
		    		datatype:"json",
		    		success:function(data){	
		    			if(!data.isSuccess){
		    				alert(data.msg);
		    			}else if(data.isSuccess){		    				
					 		var my_interval = setInterval(function () {
					            if (daojishu > 0) {
					            	$('.getYZM').html(daojishu+"秒后可重新获取");
					                daojishu--;		               
					            }else if(daojishu == 0){
					                clearInterval(my_interval);
					                daojishu=60	;
					                $('.getYZM').html("重新获取验证码")
					            }
					        }, 1000);  					
		    			}					
						$scope.$apply();
		    		}
	        	});
			}
			//07获取合伙人费用
			$scope.partnerCost='';
			$scope.superPartnerCost='';
	    	$.ajax({
	    		type:"post",
	    		url:"/openPartnerApply/getOpenNeedMoney",
	    		data:{},
	    		datatype:"json",
	    		success:function(data){	
	    			$scope.partnerCost=data.object.partnerCost;
	    			$scope.superPartnerCost=data.object.superPartnerCost;
					$scope.$apply();
	    		}
        	});			
			//08获取合伙人开通申请信息
			$scope.ApplyPartnerDatas='';
			$scope.ApplyStateText='';
			$scope.ApplyStateText01='';
			$scope.isApplyState=false;
			$scope.ApplyPstatesImg='';
	    	$.ajax({
	    		type:"post",
	    		url:"/openPartnerApply/getPartnerApply",
	    		data:{},
	    		datatype:"json",
	    		success:function(data){	
	    			if(data.object){	    				
	    				$scope.ApplyPartnerDatas=data.object;
	    				if($scope.ApplyPartnerDatas.apply_state == 2){
	    					$scope.ApplyStateText='审核不通过';
	    					$scope.ApplyStateText01='您的审核申请不通过，款项将于7个工作日内退还至您的账户余额';
	    					$scope.ApplyPstatesImg='icon-examine-not';
							$('.applyPartnertabs').removeClass('applyPartneractive');
							$('.applyPartnertabs1').removeClass('active');
							$('.applyPartnertabs').eq(1).addClass('applyPartneractive');
							$('.applyPartnertabs1').eq(1).addClass('active');	    					
	    				}else if($scope.ApplyPartnerDatas.apply_state == 4 || $scope.ApplyPartnerDatas.apply_state == 5){
	    					$scope.ApplyStateText='审核中';
	    					$scope.ApplyStateText01='工作人员将于3个工作日后通知审核结果，请您耐心等待审核结果。审核不通过款项将退还账户余额';
	    					$scope.ApplyPstatesImg='icon-examineing';
							$('.applyPartnertabs').removeClass('applyPartneractive');
							$('.applyPartnertabs1').removeClass('active');
							$('.applyPartnertabs').eq(1).addClass('applyPartneractive');
							$('.applyPartnertabs1').eq(1).addClass('active');				
	    				}else if($scope.ApplyPartnerDatas.apply_state == 3){	    					
							$('.applyPartnertabs').removeClass('applyPartneractive');
							$('.applyPartnertabs1').removeClass('active');
							$('.applyPartnertabs').eq(0).addClass('applyPartneractive');
							$('.applyPartnertabs1').eq(0).addClass('active');				
	    				}
	    			}
	    			else if(!data.object){
						$('.applyPartnertabs').removeClass('applyPartneractive');
						$('.applyPartnertabs1').removeClass('active');
						$('.applyPartnertabs').eq(0).addClass('applyPartneractive');
						$('.applyPartnertabs1').eq(0).addClass('active');						
	    			}
					$scope.$apply();
	    		}
        	});
			
			
			
			
			
			
			
	}])	

	//05合伙人支付
	.controller('PartnerPayCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01去规则明细
			$scope.goguize=function(){
				$location.path('/guizemingxi/');
			}
			//02支付方式切换
			var paystyle=1;
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
					paystyle=$(this).attr('data-paystyle');

				}
			}
			//03返回
			$scope.goback=function(){
				window.history.back();
			}
			//04我已转账膜态框消失
			$scope.BankpayfadeOut=function(){
		    	$.ajax({
		    		type:"post",
		    		url:"/openPartnerApply/confirmTransfer",
		    		data:{},
		    		datatype:"json",
		    		success:function(data){							
						if(data.isSuccess){
							alert('我们将尽快核实您的转账信息，请耐心等待。');
							$location.path('/home/');
						}else{
							alert(data.msg);
						}
						$scope.$apply();
		    		}
	       		});
				$('.TransferAccounts').fadeOut();
			}
			//05确认付款
			$scope.submitPay=function(){
				if(paystyle == 1){
					$('.TransferAccounts').fadeIn();
				}else if(paystyle == 2){
		        	window.location.href="/c/pay/payForPartnerApply";		        	
				}else if(paystyle == 3){
			    	$.ajax({
			    		type:"post",
			    		url:"/openPartnerApply/balancePayApply",
			    		data:{},
			    		datatype:"json",
			    		success:function(data){	
							alert(data.msg);
							if(data.isSuccess){
								$location.path('/home/');
							}							
							$scope.$apply();
			    		}
		        	});
		        	
				}			
			}
			//06获取虚支付金额
			$scope.needpaymoney=localStorage.getItem('NeedMoney');


			
	}])	

	
	
})(angular)