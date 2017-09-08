(function(angular){
	'use strict';
	angular.module('MCram',[
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
		//01补习班申请界面
		.when('/applycram/',{
			templateUrl:'cramschool/applycram.html',
			controller:'applycramCtl'
		})	
		//02支付确认界面
		.when('/ACinsure/',{
			templateUrl:'cramschool/ACinsure.html',
			controller:'ACinsureCtl'
		})		
		//03修改资料
		.when('/ModifyData/:ID',{
			templateUrl:'cramschool/ModifyData.html',
			controller:'ModifyDataCtl'
		})	
		//04创建分组
		.when('/Creategroup/:ID',{
			templateUrl:'cramschool/Creategroup.html',
			controller:'CreategroupCtl'
		})		
		//05创建课程
		.when('/CreateCurri/:ID',{
			templateUrl:'cramschool/CreateCurri.html',
			controller:'CreateCurriCtl'
		})	
		//06修改课程
		.when('/reviseCurri/:CURID/:SHID',{
			templateUrl:'cramschool/reviseCurri.html',
			controller:'reviseCurriCtl'
		})		
		//07课程班详情界面
		.when('/curriculum/:ID',{
			templateUrl:'cramschool/curriculum.html',
			controller:'curriculumCtl'
		})			
	}])
	//01补习班申请界面
	.controller('applycramCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01地址选项卡tabs js
			tabsfn('zoneBody','.zoneBody','.zoneBody01','tabItemactive');
			//02第一次提交申请
			$scope.submitAuthen=function(e){
				var formData = new FormData($("#withdrawForm")[0]);
				var Cramobject=e;
				console.log(formData);
				console.log(Cramobject);
				//无草稿，是第一次提交；
				if(!Cramobject){
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
			    			//有未填项，提交失败
			    			if(!data.isSuccess){
			    				alert(data.msg);
			    			}else{
								$location.path('/ACinsure/');			    				
			    			}
			    		}
		        	});					
				}else if(Cramobject.state == 1){     //有草稿，未支付状态
			    	$.ajax({
			    		type:"post",
			    		url:"/cramSchool/applyEdit",
						data:formData,
			    		datatype:"json",
						async: false,
						cache: false,
						contentType: false,
						processData: false,
			    		success:function(data){
			    			if(data.isSuccess){
			    				$location.path('/ACinsure/');
			    			}else if(!data.isSuccess){
			    				alert(data.msg);
			    			}
			    		}
		        	});						
				}			
			};
			
			
			
			//03保证金说明弹窗
			$scope.BondSH=function(e){
				$(e).fadeToggle();
			}
			//04获取草稿
			$scope.cram='';
			$scope.cramID='';
			$scope.teacher_name='';
			$scope.address='';
			$scope.aboutcram='';
			$scope.cram_avatar='';
			$scope.teacher_phone='';
			$scope.cram_name='';
			$scope.lat=22.543099;
			$scope.lng=114.057868;
			$scope.area_id=440300;
			//查询是否已经提交有草稿状态
			$.ajax({
				type:"post",
				url:"/cramSchool/getCramSchoolState",
				data:{},
				datatype:"json",
				success:function(data){
					if(data.object){
						$scope.cram=data;
						$scope.cramID=data.object.id;
						$scope.teacher_name=data.object.teacher_name;
						$scope.address=data.object.address;
						$scope.aboutcram=data.object.about;
						$scope.cram_avatar=data.object.class_avatar;
						$scope.teacher_phone=data.object.teacher_phone;
						$scope.class_name=data.object.class_name;
						$scope.lat=data.object.lat;
						$scope.lng=data.object.lng;
						$scope.area_id=data.object.area_id;
					}else{
						$scope.cram_avatar='img/morentouxiang.jpg';
					}
					$scope.$apply();
				}
			});							
			//05获取保证金数额
			$scope.margin='';
			$.ajax({
				type:"post",
				url:"/cramSchool/cramApplyCost",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.margin=data.cram_apply_cost;
					$scope.$apply();
				}
			});	
			
			//06获取班级类型
			$scope.cramStyles='';
			$.ajax({
				type:"post",
				url:"/cramSchoolType/getCramSchoolTypeList",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.cramStyles=data.object;
					$scope.$apply();
				}
			});			
			
			
			
	}])
	
	//02支付确认界面
	.controller('ACinsureCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//支付方式切换
			var applystates=document.getElementsByClassName("AC-Text02");			
			for(var i=0; i<applystates.length;i++){
				applystates[i].onclick=function(){
					var indexx=$(".AC-Text02").index($(this));
					for(var i=0; i<applystates.length;i++){
						$(".AC-Text02").removeClass("AC-active");
						$(".icon-Uncheck").removeClass("AC-check");
						$(".AC-applystate").fadeOut();
					}
					$(this).addClass("AC-active");					
					$(".icon-Uncheck").eq(indexx).addClass("AC-check");
					$(".AC-applystate").eq(indexx).fadeIn();
					
				}
			}
			
			//获取界面基本信息
			$scope.cram='';
			$scope.teacher_phone='';
			$scope.cram_name='';
			$scope.margin='';		
			$.ajax({
				type:"post",
				url:"/cramSchool/getCramSchoolState",
				data:{},
				datatype:"json",
				success:function(data){
					console.log(data);
					if(data.object){
						$scope.cram=data.object;																								
						$scope.teacher_phone=data.object.teacher_phone;
						$scope.class_name=data.object.class_name;
						$scope.margin=data.object.margin;
						$scope.$apply();
					}
					
				}
			});		
			//选择支付方式
			$scope.applyStyle=1;
			$scope.applystateWaY=function(e){
				$scope.applyStyle=e;
			}
			
			//提交支付
			
			$scope.submitCrams=function(id){
				var cramID=id;
				if($scope.applyStyle == 1){
					window.location.href="/c/pay/payForCramSchoolApply?cramSchoolId="+cramID;
				}else if($scope.applyStyle == 2){
					$.ajax({					
						type:"post",
						url:"/cramSchool/payForApply",
						data:{
							"cramSchoolId": cramID,  //需要支付的补习班申请记录ID
						},
						datatype:"json",
						success:function(data){
							alert(data.msg);
							$location.path('/news/'+3);
							$scope.$apply();								
						}
					})
				}		
			}
			
			
			
	}])
	

	//03修改资料
	.controller('ModifyDataCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//01地址选项卡tabs js
			tabsfn('zoneBody','.zoneBody','.zoneBody01','tabItemactive');
			//02获取草稿
			$scope.cram='';
			$scope.cramID='';
			$scope.teacher_name='';
			$scope.address='';
			$scope.aboutcram='';
			$scope.cram_avatar='';
			$scope.teacher_phone='';
			$scope.cram_name='';
			//03查询是否已经提交有草稿状态
			$.ajax({
				type:"post",
				url:"/cramSchool/getCramSchoolState",
				data:{},
				datatype:"json",
				success:function(data){			
					if(data.object){
						$scope.cram=data;
						$scope.cramID=data.object.id;
						$scope.teacher_name=data.object.teacher_name;
						$scope.address=data.object.address;
						$scope.aboutcram=data.object.about;
						$scope.cram_avatar=data.object.class_avatar;
						$scope.teacher_phone=data.object.teacher_phone;
						$scope.class_name=data.object.class_name;
					}else{
						$scope.cram_avatar='img/morentouxiang.jpg';
					}
					$scope.$apply();
				}
			});	
			
			
			$scope.submitModify=function(){
				var formData = new FormData($("#withdrawForm")[0]);
		    	$.ajax({
		    		type:"post",
		    		url:"/cramSchool/applyEdit",
					data:formData,
		    		datatype:"json",
					async: false,
					cache: false,
					contentType: false,
					processData: false,
		    		success:function(data){	
						$location.path('/news/'+3);
		    		}
	        	});					
							
			};			
			
			//04获取班级类型
			$scope.cramStyles='';
			$.ajax({
				type:"post",
				url:"/cramSchoolType/getCramSchoolTypeList",
				data:{},
				datatype:"json",
				success:function(data){
					$scope.cramStyles=data.object;
					$scope.$apply();
				}
			});	
			
			
			
	}])	


	//04创建分组
	.controller('CreategroupCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//获取补习班ID
			$scope.cramSchoolId=$routeParams.ID;
			//创建分组
			$scope.info = {};
		    $scope.info.operate = {};
		    var simp = '';
		    // 获取分组数据
			$.ajax({
				type:"post",
				url:"/cramCourseGroup/getGroup",
				data:{
					"cramSchoolId":$scope.cramSchoolId,  //补习班ID
				},
				datatype:"json",
				success:function(data){		
					$scope.info.operate=data.object;
					$scope.$apply();				
				}
			});			    

		    // 增加
		    $scope.info.add = function() {
		    	var $index=$scope.info.operate.length;
		    	if($index <= 7){
		    		$scope.info.operate.splice($index + 1, 0, {"cramSchoolId":$scope.cramSchoolId, "groupName": ""});
		    	}else{
		    		alert('最多只能创建八个分组！');
		    	}
		        
		        
		    };
		    // 删除
		    $scope.info.delete = function($index,groupID) {
		        $scope.info.operate.splice($index, 1);
				$.ajax({
					type:"post",
					url:"/cramCourseGroup/deleteGroup",
					data:{
						"groupId":groupID,  //补习班ID
					},
					datatype:"json",
					success:function(data){	
						
					}
				});		        		        
		    };
		    
		    
		    // 提交
		    var TTTT="";		    		    
		    $scope.info.result = function() {
		    	TTTT=JSON.stringify($scope.info.operate);
				$.ajax({
					type:"post",
					url:"/cramCourseGroup/addGroup",
					data:{
						"groups":TTTT,  //补习班ID
					},
					datatype:"json",
					success:function(data){	
						if(!data.isSuccess){
							alert(data.msg);
						}else if(data.isSuccess){
							$location.path('/CreateCurri/'+$scope.cramSchoolId);							
						}
						$scope.$apply();
					}
				});			    	
		    };
		    

	}])	
	

	//05创建课程
	.controller('CreateCurriCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//获取补习班ID
			$scope.cramSchoolId=$routeParams.ID;
			//01创建分组
		    $scope.Cramgroup = {};
		    var simp = '';
		    //02获取分组数据
			$.ajax({
				type:"post",
				url:"/cramCourseGroup/getGroup",
				data:{
					"cramSchoolId":$scope.cramSchoolId,  //补习班ID
				},
				datatype:"json",
				success:function(data){		
					$scope.Cramgroup=data.object;
					$scope.$apply();				
				}
			});
			//03地址选项卡tabs js
			tabsfn('zoneBody','.zoneBody','.zoneBody01','tabItemactive');

			//04优惠方式选择
			var applystates=document.getElementsByClassName("Discount");			
			for(var i=0; i<applystates.length;i++){
				applystates[i].onclick=function(){
					var indexx=$(".Discount").index($(this));
					$(this).toggleClass("AC-active");					
					$(".icon-Uncheck").eq(indexx).toggleClass("Discount-IMG");					
				}
			}
			
			//05获取科目
			$scope.getKemu='';
			$.ajax({
				type:"post",
				url:"/subject/getSubjectListBySchool",
				data:{
					"cramSchoolId":$scope.cramSchoolId,  //补习班ID
				},
				datatype:"json",
				success:function(data){		
					$scope.getKemu=data.object;
					console.log(data);
					$scope.$apply();				
				}
			});			
			
			
			
			
			
			//06提交创建课程
			$scope.CreateCurri=function(){
				var CCurriData=$('#CreateCu').serializeArray();
				var totailmonek=CCurriData[3].value * CCurriData[4].value;
				var zhekouTF=0;
				if($('#mianfei').is('.AC-active')){
					zhekouTF=1;
				}
				var zhenumbers=$('#zhenumber').val();
				$.ajax({
					type:"post",
					url:"/cramCourse/createCramCourse",
					data:{
						'c.cram_school_id':$scope.cramSchoolId, //补习班ID
						'c.cram_course_group_id':CCurriData[0].value, //分组 
						'c.subject_id':CCurriData[1].value,
						'c.course_name':CCurriData[2].value,    //课程名称
						'c.course_hour':CCurriData[3].value, //课程小时数
						'c.hour_price':CCurriData[4].value,  //课时费
						'c.original_price':totailmonek, //课程价格
						'c.address':CCurriData[7].value,  //授课地址 
											
						'c.introduction':CCurriData[8].value,  //简介  
						'c.area_id':CCurriData[6].value, //区域id(根据需求看是否需要传具体的区域id，可选参数)
						'c.penalty':CCurriData[5].value,
						
						'c.try_out':zhekouTF, //是否支持免费试听，1 支持 0 不支持
						'c.discount':zhenumbers,  //折扣数 
					},
					datatype:"json",
					success:function(data){		
						alert(data.msg);
						if(data.isSuccess){
							window.location.reload();
						}									
					}
				});				
			}








	}])	

	//06修改课程
	.controller('reviseCurriCtl',[
		'$scope',
		'$route',		
		'$location',
		'$routeParams',
		function($scope,$route,$location,$routeParams){
			//获取课程ID
			$scope.curriId=$routeParams.CURID;
			$scope.cramSchoolId=$routeParams.SHID;
			//创建分组
		    $scope.Cramgroup = {};
		    var simp = '';
		    // 获取分组数据
			$.ajax({
				type:"post",
				url:"/cramCourseGroup/getGroup",
				data:{
					"cramSchoolId":$scope.cramSchoolId,  //补习班ID
				},
				datatype:"json",
				success:function(data){	
					$scope.Cramgroup=data.object;
					$scope.$apply();				
				}
			});
			//地址选项卡tabs js
			tabsfn('zoneBody','.zoneBody','.zoneBody01','tabItemactive');



			//优惠方式选择
			var applystates=document.getElementsByClassName("Discount");			
			for(var i=0; i<applystates.length;i++){
				applystates[i].onclick=function(){
					var indexx=$(".Discount").index($(this));
					$(this).toggleClass("AC-active");					
					$(".icon-Uncheck").eq(indexx).toggleClass("Discount-IMG");					
				}
			}
			
			//刚进入页面查询课程信息
			$scope.curriobject='';			
			$.ajax({
				type:"post",
				url:"/cramCourse/getCourse",
				data:{
					'courseId':$scope.curriId, //补习班ID
				},
				datatype:"json",
				success:function(data){
					$scope.curriobject=data.object;
					if(data.object.try_out == 1){
						$('.Discount').eq(0).toggleClass("AC-active");
						$('.icon-Uncheck').eq(0).toggleClass("Discount-IMG");
					}
					if(data.object.discount > 0){
						$('.Discount').eq(1).toggleClass("AC-active");
						$('.icon-Uncheck').eq(1).toggleClass("Discount-IMG");
					}
					$scope.$apply();
				}
			});				
			
			
			
			//提交修改课程
			$scope.CreateCurri=function(){
				var CCurriData=$('#CreateCu').serializeArray();
				var totailmonek=CCurriData[3].value * CCurriData[4].value;
				var zhekouTF=0;
				if($('#mianfei').is('.AC-active')){
					zhekouTF=1;
				}
				var zhenumbers=$('#zhenumber').val();
				$.ajax({
					type:"post",
					url:"/cramCourse/editCramCourse",
					data:{
						'c.id':$scope.curriId,
						'c.cram_school_id':$scope.cramSchoolId, //补习班ID
						'c.cram_course_group_id':CCurriData[0].value, //分组 
						'c.subject_id':CCurriData[1].value,
						'c.course_name':CCurriData[2].value,    //课程名称
						'c.course_hour':CCurriData[3].value, //课程小时数
						'c.hour_price':CCurriData[4].value,  //课时费
						'c.original_price':totailmonek, //课程价格
						'c.address':CCurriData[7].value,  //授课地址 
											
						'c.introduction':CCurriData[8].value,  //简介  
						'c.area_id':CCurriData[6].value, //区域id(根据需求看是否需要传具体的区域id，可选参数)
						'c.penalty':CCurriData[5].value,
						
						'c.try_out':zhekouTF, //是否支持免费试听，1 支持 0 不支持
						'c.discount':zhenumbers,  //折扣数 
					},
					datatype:"json",
					success:function(data){
						alert(data.msg);
						$location.path('/news/'+3);
						$scope.$apply();
					}
				});				

			}
			

	}])

	//07课程详情
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
					'courseId':$scope.curriId, //补习班ID
				},
				datatype:"json",
				success:function(data){
					$scope.curriobject=data.object;
					console.log(data);
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
					$scope.$apply();
				}
			});	
			
			
			//获取评论
			var EvpageSize=20;
			var EvpageIndex=1;
			$scope.EvaluateList='';	
			$scope.totalRow='';
			$.ajax({
				type:"post",
				url:"/courseEvaluate/getEvaluateList",
				data:{
					'cramCourseId':$scope.curriId, //补习班ID
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
							'cramCourseId':$scope.curriId, //补习班ID
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

})(angular)