(function(angular){
	'use strict';
	angular.module('Mshangmenjiajiao',[
		'ngRoute'
	])
	.config(['$routeProvider',function($routeProvider){
		$routeProvider.when('/shangmenjiajiao/',{
			templateUrl:'shangmenjiajiao/shangmenjiajiao.html',
			controller:'shangmenjiajiaoCtl'
		})
	}])
	.controller('shangmenjiajiaoCtl',[
		'$scope',
		function($scope){
			//地址选项卡tabs js
			tabsfn('zoneBody','.zoneBody','.zoneBody01','tabItemactive');
			//区域选项卡
			tabsfn('regionBody','.regionBody','.regionBody01','tabItemactive');
			
			
			var smjjtab=document.getElementsByClassName("shangmenjiajiao-tablist");
			for(var i=0; i<smjjtab.length;i++){
				smjjtab[i].onclick=function(){
					var index=$(".shangmenjiajiao-tablist").index($(this));
					for(var i=0; i<smjjtab.length;i++){
						$(".icon-smjj-l").removeClass("smjjactive-san");
					}			
					$(".icon-smjj-l").eq(index).addClass("smjjactive-san");
				}
				smjjtab[i].onmouseleave=function(){
					$(".icon-smjj-l").removeClass("smjjactive-san");
				}
			}			

			//是否选择了默认城市
			$scope.ifAreas='';	
			$scope.ifAreasname='';
		  	$.post("/p/getParentHome",
		    		{},
		        	function(data){		      
				        $scope.ifAreas=data.content.parent_follow_area;
				        if($scope.ifAreas){
				        	 $scope.ifAreasname=data.content.parent_follow_area_name;
				        }
				        $scope.$apply();
		    });	
			

			
			
			


			
			//刚进来默认选则全部
			var datatext={
    			//查询页码
    			"pageIndex": 1,
    			 //每页大小
    			"pageSize": count,					
    		}			
		
			loadteather(datatext);
	    				
			var fields = $(".smjj-change").serializeArray();
		
			var orderBy="";
			var order="";
			if(fields[2].value=='1'){
				order="star.starSum";
				orderBy='desc';
			}else if(fields[2].value=='2'){
				order="star.starSum";
				orderBy='';
			}
			
			

			
		

			//地区功能
			$scope.selectarea=function(){
				 fields = $(".smjj-change").serializeArray();
			
				 orderBy="";
				 order="";
				if(fields[2].value=='1'){
					order="star.starSum";
					orderBy='desc';
				}else if(fields[2].value=='2'){
					order="star.starSum";
					orderBy='';
				}		
				 datatext={
		    			//查询页码
		    			"pageIndex": 1,
		    			 //每页大小
		    			"pageSize": count,
						//地区
						"areaId":fields[0].value,
						"subjectId":fields[1].value,
						"sex":fields[3].value,
						"order":order,
						"orderBy":orderBy,						
		    	}	
				$('#search-list').empty();			    	
				loadteather(datatext);

			}
			//搜索功能
			$scope.searchdata="";
			$scope.search=function(searchinput){
				$scope.searchdata=searchinput;
					var data={
		    			//查询页码
		    			 "pageIndex": 1,
		    			//每页大小
		    			 "pageSize": count,
		    			 "keyword": $scope.searchdata, 
		    	};					
					$('#search-list').empty();
		    		loadteather(data); 	

			}			
			
		$(window).bind("scroll", function () {    
			if ($(document).scrollTop() + $(window).height() == $(document).height()){
				$scope.searchdata = $('.a1-01sinput').val();

				fields = $(".smjj-change").serializeArray();
				++page;
				 datatext={
	    			//查询页码
	    			"pageIndex": page,
	    			 //每页大小
	    			"pageSize": count,
					//地区
					"areaId":fields[0].value,
					"subjectId":fields[1].value,
					"sex":fields[3].value,
					"order":order,
					"orderBy":orderBy,
					"keyword": $scope.searchdata,
	    		}					
				loadteather(datatext);
				
			}   
		});


	}])
	
	
})(angular)