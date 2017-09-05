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
		$routeProvider
			//01我的主界面
			.when('/my/',{
				templateUrl:'me/me.html',
				controller:'meCtl'
			})
			//02绑定手机
			.when('/phone/',{
				templateUrl:'me/telephone.html',
				controller:'phoneCtl'
			})
			//03认证
			.when('/authen/',{
				templateUrl:'me/authen.html',
				controller:'authenCtl'
			})	
			//04我的子女新增界面
			.when('/editChilds/',{
				templateUrl:'me/editChilds.html',
				controller:'editChildsCtl'
			})
			//05我的子女展示选择界面
			.when('/mychild/:ID/:oldID',{
				templateUrl:'me/mychild.html',
				controller:'mychildCtl'
			})					
			//06我的子女编辑界面
			.when('/modifyChild/:ID',{
				templateUrl:'me/modifyChild.html',
				controller:'modifyChildsCtl'
			})
			//07我的订单
			.when('/MyOrders/',{
				templateUrl:'me/MyOrders.html',
				controller:'MyOrdersCtl'
			})	
			//08订单详情
			.when('/OrderDetails/:ID',{
				templateUrl:'me/OrderDetails.html',
				controller:'OrderDetailsCtl'
			})	
			//09申请退款
			.when('/refundApply/:ID',{
				templateUrl:'me/refundApply.html',
				controller:'refundApplyCtl'
			})	
			//10退款订单详情
			.when('/RefundDetails/:ID',{
				templateUrl:'me/RefundDetails.html',
				controller:'RefundDetailsCtl'
			})			
			//11订单评价
			.when('/Evaluate/:ID',{
				templateUrl:'me/Evaluate.html',
				controller:'EvaluateCtl'
			})
			//12我的收藏
			.when('/MyCollect/',{
				templateUrl:'me/MyCollect.html',
				controller:'MyCollectCtl'
			})			
	}])
	//01我的主页
	.controller('meCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){

			$scope.avatar='';	
			$scope.name='';	
			$scope.vip_type='';
			$scope.sex='';
			$scope.score='';
			$scope.balance='';
			$scope.mobile='';
			$scope.verify='';
		  	$.post("/p/getMyInfo",
		    		{},
		        	function(data){	    					
				        $scope.avatar=data.avatar;
				        $scope.name=data.name;	
				        $scope.parentVip=data.parentVip;
				        $scope.sex=data.sex;
				        $scope.score=data.score;
				        $scope.balance=data.balance;
				        $scope.verify=data.is_id_card_verify;				        
				        if(!data.mobile){
				        	$scope.mobile='绑定手机';
				        }else if(data.mobile){
				        	$scope.mobile=data.mobile;
				        }
				        $scope.$apply();
		    });	
		    $scope.authens=function(veri){
		    	var verifys=veri;
		    	if(verifys == 2){
		    		alert("您已经通过实名认证，无需再认证")
		    	}else{
		    		$location.path('/authen/');
		    	}
		    }
		    
		    
			
	}])
	//02绑定手机
	.controller('phoneCtl',[
		'$scope',
		function($scope){
			//初始化
			$scope.statetext='';
			$scope.statetab='';
			$scope.telephone='';
		  	$.post("/p/getMyInfo",
		    		{},
		        	function(data){		        	
				        if(!data.mobile){
				        	//没绑定
				        	$scope.statetext='未绑定';
				        	$scope.statetab='绑定手机';
				        	$scope.telephone='手机号码';
				        }else if(data.mobile){
				        	//已绑定
				        	$scope.statetext=data.mobile;;
				        	$scope.statetab='更换绑定手机';
				        	$scope.telephone='改绑手机号码';
				        }			        
				        $scope.$apply();
		    });	
		    //获取验证码
		    var countdown=60;
			var	settime=function(obj){ //发送验证码倒计时
				    if (countdown == 0) { 
				        obj.attr('disabled',false); 
				        //obj.removeattr("disabled"); 
				        obj.val("获取验证码");
				        countdown = 60; 
				        return;
				    } else { 
				        obj.attr('disabled',true);
				        obj.val("重新发送(" + countdown + ")");
				        countdown--; 
				    } 
					setTimeout(function() { 
					    	settime(obj);
					},1000)}	
			var sendemail=function(){
					    var obj = $("#btnsend");
					    settime(obj);
				    }
				
		    $scope.sendSms=function(){
		    	var mobiles=$('.rCinputI').val();
		    	$.ajax({
		    		type:"post",
		    		url:"/c/sendSms",
		    		data:{
		    			"mobile":mobiles,//手机号						
		    		},
		    		datatype:"json",
		    		success:function(data){		    			
						sendemail();

		    		}
	        	});	
		    }
	    	//提交绑定
		    $scope.bindmobile=function(){
		    	var mobiles=$('.rCinputI').val();
		    	var sendtext=$('.yanzhengma').val();
		    	$.ajax({
		    		type:"post",
		    		url:"/c/wdForPhone",
		    		data:{
		    			"mobile":mobiles,//手机号
		    			"mobileCode":sendtext, //用户输入的验证码
		    		},
		    		datatype:"json",
		    		success:function(data){	
		    			alert(data.msg);
		    			if(data.isSuccess){
		    				location.reload();
		    			}
		    		}
	        	});	
		    }			 
	
	}])	
	//03实名认证
	.controller('authenCtl',[
		'$scope',
		function($scope){

			//实名认证
			$scope.submitAuthen=function(){
				var formData = new FormData($("#withdrawForm")[0]);
		    	$.ajax({
		    		type:"post",
		    		url:"/c/realNameAuthentication",
		    		data:formData,
		    		datatype:"json",
					async: false,
					cache: false,
					contentType: false,
					processData: false,
		    		success:function(data){	
		    			alert(data.msg);
		    			location.reload();
		    		}
	        	});				

				
			};
			
		
			
	}])

	//04我的子女新增界面
	.controller('editChildsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){

			$scope.creatChilds=function(){
				var ChildsData=$('#CNdatas').serializeArray();
		    	$.ajax({
		    		type:"post",
		    		url:"/childrenInfo/createChildrenInfo",
		    		data:{
		    			"c.name":ChildsData[0].value,        //子女姓名
						"c.age":ChildsData[1].value,
						"c.sex":ChildsData[2].value,       //男性：1  女性：2
						"c.mobile":ChildsData[3].value,     //13888888888
						"c.explain":ChildsData[4].value,   //情况说明
		    		},
		    		datatype:"json",
		    		success:function(data){	
		    			alert(data.msg);
		    			if(data.isSuccess){
		    				location.reload();
		    			}
		    			
		    		}
		    	});				

			}
				
				
			
			$scope.goback=function(){
				window.history.back();
			}
			
	}])

	//05我的子女选择展示界面
	.controller('mychildCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			$scope.currisID=$routeParams.ID;
			$scope.oldID=$routeParams.oldID;
			$scope.Mychildlist='';
			$scope.ishavechild='';
			//刚进入默认获取列表
			
			tabsfn('Admintabs','.Admintabs','.DY-tabs01','activeFind');
			
			if($scope.currisID == 0){
		    	$.ajax({
		    		type:"post",
		    		url:"/childrenInfo/getChildrenList",
		    		data:{},
		    		datatype:"json",
		    		success:function(data){	
		    			$scope.Mychildlist=data.object;
		    			if(data.object.length == 0){
		    				$scope.ishavechild=true;
		    			}else{
		    				$scope.ishavechild=false;
		    			}
		    			$scope.$apply();
		    		}
		    	});				
			}else if($scope.currisID > 0){
		    	$.ajax({
		    		type:"post",
		    		url:"/childrenInfo/getChildrenListByCourse",
		    		data:{
		    			'courseId':$scope.currisID, 
		    		},
		    		datatype:"json",
		    		success:function(data){			    			
		    			$scope.Mychildlist=data.object;
		    			console.log($scope.Mychildlist);
		    			if(data.object.length == 0){
		    				$scope.ishavechild=true;
		    			}else{
		    				$scope.ishavechild=false;
		    			}
		    			$scope.$apply();
		    		}
		    	});
			}
	
	
	
	    	//新增
			$scope.goEdit=function(){
				$location.path('/editChilds/');
			}
			//返回上一个界面
			$scope.goback=function(){
				window.history.back();
			}
			//制定默认
			$scope.thisDefaults=function(defaultindex,childlistsid){
				var indexss=defaultindex;
		    	$.ajax({
		    		type:"post",
		    		url:"/childrenInfo/setDefaultInfo",
		    		data:{
		    			'childrenId':childlistsid,
		    		},
		    		datatype:"json",
		    		success:function(data){	
	
				    	$.ajax({
				    		type:"post",
				    		url:"/childrenInfo/getChildrenList",
				    		data:{},
				    		datatype:"json",
				    		success:function(data){	
				    			$scope.Mychildlist=data.object;
				    			$scope.$apply();
				    		}
				    	});		    			
		    			$('.icon-Uncheck').removeClass('default-Active');
		    			$('.icon-Uncheck').eq(indexss-1).addClass('default-Active');

		    		}
		    	});
			}	

			//删除子女信息
			$scope.deletechilds=function(childlistsid){
				$.ajax({
		    		type:"post",
		    		url:"/childrenInfo/deleteChildrenInfo",
		    		data:{
		    			'childrenId':childlistsid,
		    		},
		    		datatype:"json",
		    		success:function(data){						    			
				    	$.ajax({
				    		type:"post",
				    		url:"/childrenInfo/getChildrenList",
				    		data:{},
				    		datatype:"json",
				    		success:function(data){	
				    			$scope.Mychildlist=data.object;
								$scope.$apply();
				    		}
				    	});
						scartdelete('.Mychilds-container');
		    		}
		    	});
			}
			
			//选择子女
			$scope.ChoiceChilds=function(childlistsid){
				if($scope.oldID == 0){
					$scope.oldID = null;
				}
				
				$.ajax({
		    		type:"post",
		    		url:"/courseOrderChildren/addChildrenToCourse",
		    		data:{
		    			'childrenId':childlistsid,
		    			'courseId':$scope.currisID,
		    			'oldChildrenId':$scope.oldID,
		    		},
		    		datatype:"json",
		    		success:function(data){						    			
						window.history.back();

		    		}
		    	});
			}			
			
			//等ng-repeat之后再往元素上面绑定事件
			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				//左滑
				scartdelete('.Mychilds-container');
	
		
			})			
	
	}])

	//06修改我的子女界面
	.controller('modifyChildsCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//子女ID
			$scope.childsID=$routeParams.ID;
			$scope.childsData='';
	    	$.ajax({
	    		type:"post",
	    		url:"/childrenInfo/getChildrenById",
	    		data:{
	    			"childrenId":$scope.childsID,        //子女姓名
	    		},
	    		datatype:"json",
	    		success:function(data){	
	    			$scope.childsData=data.object;
	    			$scope.$apply();
	    		}
	    	});			

			$scope.modifyChilds=function(){
				var ChildsData=$('#CNdatas').serializeArray();
		    	$.ajax({
		    		type:"post",
		    		url:"/childrenInfo/editChildrenInfo",
		    		data:{
		    			"c.id":$scope.childsID,
		    			"c.name":ChildsData[0].value,        //子女姓名
						"c.age":ChildsData[1].value,
						"c.sex":ChildsData[2].value,       //男性：1  女性：2
						"c.mobile":ChildsData[3].value,     //13888888888
						"c.explain":ChildsData[4].value,   //情况说明
		    		},
		    		datatype:"json",
		    		success:function(data){	
		    			alert(data.msg);
		    			if(data.isSuccess){
		    				window.history.back();
		    			}
		    			
		    		}
		    	});				

			}

			$scope.goback=function(){
				window.history.back();
			}
			
	}])

	//07我的订单
	.controller('MyOrdersCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//顶层tabs
			tabsfn('DY-tabs','.DY-tabs','.DY-tabs01','SCactive');
						
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
			//去评价动作
			$scope.goEvaluate=function(Oid){
				//要评价的Oid订单ID
				$location.path('/Evaluate/'+Oid);
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
				    	$.ajax({
				    		type:"post",
				    		url:"/order/getOrderList",
				    		data:{
				    			"pageIndex":1,
				    			"pageSize":20,  
				    		},
				    		datatype:"json",
				    		success:function(data){	
								console.log(data);
								$scope.carmdAllLsits=data.object.list;
								console.log($scope.carmdAllLsits);
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
	    		url:"/order/getOrderList",
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
			//立即支付
			$scope.paycurri=function(orderIds){
				//orderIds订单编号缓存
				localStorage.setItem("orderIds",orderIds);				
				$location.path('/ACinsure/');
				
			}
			
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
				    		url:"/order/getOrderList",
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
				    		url:"/order/getOrderList",
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
			    		url:"/order/getOrderList",
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

	//08订单详情
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
	    		url:"/order/getOrderList",
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
		    		url:"/order/getOrderList",
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

	//09申请退款
	.controller('refundApplyCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//膜态框取消理由动效
			var HandFilmframe01=document.getElementsByClassName('HandFilmframe01');
			var HandFilmframe02=document.getElementsByClassName('HandFilmframe02');
			for(var i=0;i<HandFilmframe01.length;i++){
				HandFilmframe01[i].onclick=function(){
					var indexx=$('.HandFilmframe01').index($(this));
					for(var i=0;i<HandFilmframe01.length;i++){
						$('.HSC01').removeClass('checksActive');
					}
					$('.HSC01').eq(indexx).addClass('checksActive');
					$('#chulistate').val($('.HSC01-text').eq(indexx).html());
					$('.HandleState01').fadeOut();
				}
			}
			for(var i=0;i<HandFilmframe02.length;i++){
				HandFilmframe02[i].onclick=function(){
					var indexx=$('.HandFilmframe02').index($(this));
					for(var i=0;i<HandFilmframe02.length;i++){
						$('.HSC02').removeClass('checksActive');
					}
					$('.HSC02').eq(indexx).addClass('checksActive');
					$('#tuikuanR').val($('.HSC02-text').eq(indexx).html());
					
				}
			}
			//膜态框展示
			$scope.HFframe01fadeIn=function(){
				$('.HandleState01').fadeIn();
			}
			//膜态框展示
			$scope.HFframe02fadeIn=function(){
				$('.HandleState02').fadeIn();
			}	
			$scope.HFframe02fadeOut=function(){
				$('.HandleState02').fadeOut();	
				$('#tuikuanR').val('请选择');
			}			
			$scope.HFframe02fadeOutR=function(){
				$('.HandleState02').fadeOut();				
			}
			
	}])


	//10退款订单详细
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
			
			
			
			
			
	}])

	//11订单评价
	.controller('EvaluateCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			var Oid=$routeParams.ID;
			$scope.goback=function(){
				window.history.back();
			}
			//星级选择效果
			var getStartFn=function(iss,a,b,c,d){
				var curriStart01=$(a).eq(iss).find(c);
				var Ev_Start01=$(a).eq(iss).find(d);
				
				for(var i=0;i<curriStart01.length;i++){
					curriStart01[i].onclick=function(){
						var indexx=curriStart01.index($(this));
						for(var i=0;i<Ev_Start01.length;i++){
							Ev_Start01[i].src = "img/start0.png";
						}					
						for(var i=0;i<=indexx;i++){
							Ev_Start01[i].src = "img/start10.png";
						}
						$(this).siblings(b).html($(this).attr("data-grade"));			
					}
				}							
			}
			
			//获取基本信息
			$scope.carmdAllLsits='';
	    	$.ajax({
	    		type:"post",
	    		url:"/courseEvaluate/evaluate",
	    		data:{
	    			"orderId":Oid,        //订单ID
	    		},
	    		datatype:"json",
	    		success:function(data){	
					$scope.carmdAllLsits=data.object;					
					$scope.$apply();
	    		}
	    	});
			//要提交的数组
			$scope.info=[];
			var TTTT="";
			$scope.ReleaseEva=function(){
				var $index=$scope.carmdAllLsits.length;				
				for(var i=0;i<$index;i++){
					$scope.info.splice(i, 0, {"explain":$('.Ev_textareaIn').eq(i).val(), "serviceScore": $('.curriStartgrad02').eq(i).html(),"qualityScore": $('.curriStartgrad01').eq(i).html(),"orderItemId": $('.MO-listTop').eq(i).attr("data-orderItemId")});

				}
				TTTT=JSON.stringify($scope.info);
		    	$.ajax({
		    		type:"post",
		    		url:"/courseEvaluate/publishEvaluate",
		    		data:{
		    			"evaluates":TTTT,        //订单ID
		    		},
		    		datatype:"json",
		    		success:function(data){
		    			alert(data.msg);
		    			if(data.isSuccess){
		    				$location.path('/MyOrders/');
		    			}
		    			$scope.$apply();
		    		}
	    		});
				
				
				
			}

			//等ng-repeat之后再往元素上面绑定事件
			$scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){				
				for(var i=0;i<$scope.carmdAllLsits.length;i++){
					//课程质量
					getStartFn(i,'.qualityScore','.curriStartgrad01','.curriStart01','.Ev_Start01');
					//服务态度
					getStartFn(i,'.serviceScore','.curriStartgrad02','.curriStart02','.Ev_Start02');
					
				}	        	
			})			
			
			

	}])

	//12我的收藏
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





})(angular)