/*----------------------------------
*  author：diyijiajiao
*  time:2017-04-19
*  01 首页banner动画
*  02 重写alert弹框js
*  03 老师列表js
*  04 补习班tabs切换js
*  05 补习班列表查询函数封装
*  06 补习班地址js
*  07 购物车列表
* 
* 
*====================================*/

/*----------------------------------
*  01 公共变量
*====================================*/
		var count=6;     //每页有多少条
		var page=1;     //页码	
		var sexonoff='';     //性别
		var viptype='';	   //会员等级
    	var CountOnOff='';   //会员总数
		var pinyin='';   //首页拼音
		var ceshiarr=[1,2,3];
/*----------------------------------
*  02 重写alert弹框js
*====================================*/
//	window.alert = function(name){
//	 var iframe = document.createElement("IFRAME");
//	iframe.style.display="none";
//	iframe.setAttribute("src", 'data:text/plain,');
//	document.documentElement.appendChild(iframe);
//	window.frames[0].window.alert(name);
//	iframe.parentNode.removeChild(iframe);
//	
//	}



/*----------------------------------
*  03 老师列表js
*====================================*/

	var loadteather=function(datatext){
		
		$('.spinner').fadeIn();
		
		
		var data1 =[];

		$.ajax({
    		type:"get",
    		url:"/p/getTeacherList",
    		data:datatext,
    		datatype:"json",
    		success:function(data){										
				data1 = data.content;
				recordCount=data.recordCount;
				

				var str = "";
				var chengjiu0='none',chengjiu1='none',chengjiu2='none',chengjiu3='none',
					chengjiu4='none',chengjiu5='none',chengjiu6='none',chengjiu7='none',
					chengjiu8='none',chengjiu9='none',chengjiu10='none',chengjiu11='none';
				
        		var templ = "";
					templ+='<li class="teather-list border-bottom10">';			
					templ+='<div class="list-left border-top">';
					templ+='<a href="#/teatherdetails/{{id}}">';
					templ+='<img src="{{avatar}}" class="list-left-img" alt="..."/>';	   		   		   		
					templ+='<div class="list-left-body">';	   		   		
					templ+='<div class="listteathername">{{name}}';	   		   		
					templ+='<i><img src="img/{{teacherVip}}" style="margin:0 0 0.2rem 0.4rem" alt="" /></i>';
					templ+='<i><img src="img/icon_gender_{{sexonoff}}.png" style="margin:0 0 0.2rem 0.4rem" alt="" /></i></div>';				      	    

					templ+='<div class="listteatherzishu">自述:{{self_description}}</div>';				      	    
					templ+='<div class="listteatherachieve">';				      	    
					templ+='<span class="listteatherachieve-text">成就:</span>';				      	    
					templ+='<div class="listteatherachieve-list">';		
					
					templ+='<span class="bcolorblack" style="display:{{chengjiu0}}">全国名师</span>';	
					templ+='<span class="bcolorblack" style="display:{{chengjiu1}}">世界名校</span>';		
					templ+='<span class="bcolorblack" style="display:{{chengjiu2}}">迷之存在</span>';		
					templ+='<span class="bcolorblack"  style="display:{{chengjiu3}}">德高望重</span>';		
					templ+='<span class="bcolorViolet" style="display:{{chengjiu4}}">长期稳定</span>';		
					templ+='<span class="bcolorViolet" style="display:{{chengjiu5}}">国内名校</span>';		
					templ+='<span class="bcolorViolet" style="display:{{chengjiu6}}">城中名师</span>';		
					templ+='<span class="bcolorViolet" style="display:{{chengjiu7}}">乐于奉献</span>';		
					templ+='<span class="bcolorred" style="display:{{chengjiu8}}">海外归来</span>';		
					templ+='<span class="bcolorblue" style="display:{{chengjiu9}}">百里挑一</span>';		
					templ+='<span class="bcolorgreed" style="display:{{chengjiu10}}">家教联盟</span>';		
					templ+='<span class="bcolorgreed" style="display:{{chengjiu11}}">开拓之星</span>';		
						
						
						
					templ+='</div><div class="clearfix"></div>';										
					templ+='<span class="textcolorred listteatherachieve-number" style="display:{{CountOnOff}}">({{achievCount}})</span></div></div>';									
					templ+='<div class="clearfix"></div></a></div>';										
					templ+='<div class="list-right">';									
					templ+='<img class="media-object-img" src="img/icon_starnb_small_{{starCount}}.png" alt="...">';										
					templ+='<div>指导价(小时)</div>';									
					templ+='<div>{{guidancePrice}}</div></div>';									
					templ+='<div class="clearfix"></div></li>';							 

		        for(var i = 0; i < data1.length; i++) {

		        	//性别
		        	if(data1[i].sex == 1){
		        		sexonoff="men";
		        	}else if(data1[i].sex == 2){
		        		sexonoff="woman";
		        	}
		        	//vip等级
		        	if(data1[i].teacherVip == 0){
		        		teacherVip="icon_vip.png";
		        	}else if(data1[i].teacherVip == 1){
		        		teacherVip="icon_vip_m.png";
		        	}else if(data1[i].teacherVip == 2){
		        		teacherVip="icon_vip_y.png";
		        	}
		        	//自述
		        	if(!data1[i].self_description){
		        		data1[i].self_description="他没有填写自我描述";
		        	}
		        	//成就
		        	if(data1[i].achievCount > 2){
		        		CountOnOff='block';
		        	}else{
		        		CountOnOff='none';
		        	}
					
					if(data1[i].memberStar.achieve0 == 1){
						chengjiu0='block';
					}
					if(data1[i].memberStar.achieve1 == 1){
						chengjiu1='block';
					}				        	
					if(data1[i].memberStar.achieve2 == 1){
						chengjiu2='block';
					}				        	
					if(data1[i].memberStar.achieve3 == 1){
						chengjiu3='block';
					}					        	
					if(data1[i].memberStar.achieve4 == 1){
						chengjiu4='block';
					}				        	
					if(data1[i].memberStar.achieve5 == 1){
						chengjiu5='block';
					}				        	
					if(data1[i].memberStar.achieve6 == 1){
						chengjiu6='block';
					}				        	
					if(data1[i].memberStar.achieve7 == 1){
						chengjiu7='block';
					}
					if(data1[i].memberStar.achieve8 == 1){
						chengjiu8='block';
					}							
					if(data1[i].memberStar.achieve9 == 1){
						chengjiu9='block';
					}							
					if(data1[i].memberStar.achieve10 == 1){
						chengjiu10='block';
					}							
					if(data1[i].memberStar.achieve11 == 1){
						chengjiu11='block';
					}		        	
												
					
					
		        	
            		str += templ.replace("{{id}}", data1[i].id).replace("{{avatar}}", data1[i].avatar).replace("{{name}}", data1[i].name).replace("{{teacherVip}}", teacherVip).replace("{{sexonoff}}",sexonoff).replace("{{self_description}}", data1[i].self_description).replace("{{chengjiu0}}", chengjiu0).replace("{{chengjiu1}}", chengjiu1).replace("{{chengjiu2}}", chengjiu2).replace("{{chengjiu3}}", chengjiu3).replace("{{chengjiu4}}", chengjiu4).replace("{{chengjiu5}}", chengjiu5).replace("{{chengjiu6}}", chengjiu6).replace("{{chengjiu7}}", chengjiu7).replace("{{chengjiu8}}", chengjiu8).replace("{{chengjiu9}}", chengjiu9).replace("{{chengjiu10}}", chengjiu10).replace("{{chengjiu11}}", chengjiu11).replace("{{achievCount}}", data1[i].achievCount).replace("{{achievCount}}", data1[i].achievCount).replace("{{starCount}}", data1[i].starCount).replace("{{guidancePrice}}", data1[i].guidancePrice).replace("{{CountOnOff}}",CountOnOff);
            		
       			 }

				
				$(str).appendTo($("#search-list"));
				
				$('.spinner').fadeOut();
				
    		}
   		});	

	
	
	
	}

/*----------------------------------
*  04 补习班tabs切换js
*====================================*/				
	var tabsfn=function(a,b,c,d){
		var CDtabs=document.getElementsByClassName(a);			
		for(var i=0; i<CDtabs.length;i++){
			CDtabs[i].onclick=function(){
				var indexx=$(b).index($(this));
				for(var i=0; i<CDtabs.length;i++){
					$(b).removeClass(d);
					$(c).removeClass("active");
				}
				$(this).addClass(d);					
				$(c).eq(indexx).addClass("active");
			}
		}				
	}
/*----------------------------------
*  05 补习班列表查询函数封装
*====================================*/		
	//	查询动作
   function getcramschoollist(dataArry){
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
					$("#CSchools").html('<a class="SASnone"><i class="icon-comment CurriState-Ic"></i><div class="CramState-Title">未找到您要找的机构！</div></a>');
				}
			}
		});   	
    }

	
	//列表拼接
	function listsplits(data){
		$('.spinner').fadeIn();
		var data1=data;
		var templ='';
		var str='';
			str+='<li class="CSchoolList"><a href="#/Cdetails/{{id}}" class="listTOP">';
			str+='<div class="listleft"><div class="cramWidth">';
			str+='<img src="{{class_avatar}}" alt="" /></div></div>';
			str+='<div class="listright"><div class="listright01">';
			str+='<div class="listright01-L">{{class_name}}</div>';
			str+='<div class="listright01-R">距离：{{distance}}</div>';
			str+='<div class="clearfix"></div></div><div class="listright02">';
			str+='<div class="listright02-start">';
			str+='<span><img src="{{staronoff01}}"/></span>';
			str+='<span><img src="{{staronoff02}}"/></span>';
			str+='<span><img src="{{staronoff03}}"/></span>';
			str+='<span><img src="{{staronoff04}}"/></span>';
			str+='<span><img src="{{staronoff05}}"/></span>';
			str+='</div><div class="listright02-grade">&nbsp;&nbsp;{{eva_star}}</div>';
//			str+='<div class="listright01-R">已经报班人数：{{sales}}人</div>';
			str+='<div class="clearfix"></div></div>';
			str+='<div class="listright03">业务介绍：{{about}}</div>';
			str+='<div class="listright03">地址：{{area_text}}{{address}}</div>';
			str+='</div><div class="clearfix"></div></a>';
			str+='<div class="listBotton" ><div class="listBotton-L" style="display:{{actonoff01}};">';
			str+='<span class="CSmian">免</span>&nbsp;&nbsp;免试课费</div>';
			str+='<div class="listBotton-L" style="display:{{is_discount}};">';
			str+='<span class="CSmian">折</span></div>';
			str+='<div class="clearfix"></div></div>';
			str+='<div class="cramcurrilist" style="display:{{currioff}};">';
			str+='<div class="cclist01" style="display:{{currioff01}};">';
			str+='<a href="#/curriculum/{{curriID01}}" >{{subject_text01}}（课程：{{course_name01}}）';
			str+='<span class="textcoloryellow3">￥{{preferential_price01}}元</span>';
			str+='<i class="icon-direction-left cclist01-img"></i></a></div>';
			str+='<div class="cclist01" style="display:{{currioff02}};">';
			str+='<a href="#/curriculum/{{curriID02}}">{{subject_text02}}（课程：{{course_name02}}）';
			str+='<span class="textcoloryellow3">￥{{preferential_price02}}元</span>';
			str+='<i class="icon-direction-left cclist01-img"></i></a></div>';
			str+='<div class="cclist01" style="display:{{currioff03}};">';
			str+='<a href="#/curriculum/{{curriID03}}">{{subject_text03}}（课程：{{course_name03}}）';
			str+='<span class="textcoloryellow3">￥{{preferential_price03}}元</span>';
			str+='<i class="icon-direction-left cclist01-img"></i>';
			str+='</a></div></div></li>';


			for(var i=0;i<data1.length;i++){
		var staronoff01='img/start0.png',staronoff02='img/start0.png',staronoff03='img/start0.png',staronoff04='img/start0.png',staronoff05='img/start0.png';
		var actonoff01='none',currioff='none',currioff01='none',currioff02='none',currioff03='none';
		var curriID01='',curriID02='',curriID03='',subject_text01='',subject_text02='',subject_text03='',course_name01='',course_name02='',course_name03='',preferential_price01='',preferential_price02='',preferential_price03='';
		
		var stars='';
				
				//判断星级01
				if(data1[i].eva_star*10%10 <=2 && data1[i].eva_star*10%10 != 0){
					stars='img/start2.png';

				}else if(data1[i].eva_star*10%10 <=5 && data1[i].eva_star*10%10 != 0){
					stars='img/start5.png';

				}else if(data1[i].eva_star*10%10 <=9 && data1[i].eva_star*10%10 != 0){
					stars='img/start8.png';
				}else if(data1[i].eva_star == 5){
						stars='img/start10.png';
				}else{
						stars='img/start0.png';
				}				
				
				
				//判断星级02
				if(data1[i].eva_star >= 4){
					staronoff01='img/start10.png';
					staronoff02='img/start10.png';
					staronoff03='img/start10.png';
					staronoff04='img/start10.png';
					staronoff05=stars;
				}else if(data1[i].eva_star >= 3){
					staronoff01='img/start10.png';
					staronoff02='img/start10.png';
					staronoff03='img/start10.png';
					staronoff04=stars;
					staronoff05='img/start0.png';
				}else if(data1[i].eva_star>=2){
					staronoff01='img/start10.png';
					staronoff02='img/start10.png';
					staronoff03=stars;
					staronoff04='img/start0.png';
					staronoff05='img/start0.png';
				}else if(data1[i].eva_star>=1){
					staronoff01='img/start10.png';
					staronoff02=stars;
					staronoff03='img/start0.png';
					staronoff04='img/start0.png';
					staronoff05='img/start0.png';
				}
							
				//判断优惠活动
				if(data1[i].try_out == 1){
					actonoff01='block';
				}
				
				//判断课程列表
				if(data1[i].cramCourse.length == 1){
					currioff='block';
					currioff01='block';
					curriID01 = data1[i].cramCourse[0].course_id;
					subject_text01 = data1[i].cramCourse[0].subject_text;
					course_name01 = data1[i].cramCourse[0].course_name;
					preferential_price01 = data1[i].cramCourse[0].preferential_price;
					
				}else if(data1[i].cramCourse.length == 2){
					currioff='block';
					currioff01='block';
					currioff02='block';
					curriID01 = data1[i].cramCourse[0].course_id;
					subject_text01 = data1[i].cramCourse[0].subject_text;
					course_name01 = data1[i].cramCourse[0].course_name;
					preferential_price01 = data1[i].cramCourse[0].preferential_price;
					
					curriID02 = data1[i].cramCourse[1].course_id;
					subject_text02 = data1[i].cramCourse[1].subject_text;
					course_name02 = data1[i].cramCourse[1].course_name;
					preferential_price02 = data1[i].cramCourse[1].preferential_price;
					
				}else if(data1[i].cramCourse.length == 3){
					currioff='block';
					currioff01='block';
					currioff02='block';
					currioff03='block';
					curriID01 = data1[i].cramCourse[0].course_id;
					subject_text01 = data1[i].cramCourse[0].subject_text;
					course_name01 = data1[i].cramCourse[0].course_name;
					preferential_price01 = data1[i].cramCourse[0].preferential_price;
					
					curriID02 = data1[i].cramCourse[1].course_id;
					subject_text02 = data1[i].cramCourse[1].subject_text;
					course_name02 = data1[i].cramCourse[1].course_name;
					preferential_price02 = data1[i].cramCourse[1].preferential_price;
					
					curriID03 = data1[i].cramCourse[2].course_id;
					subject_text03 = data1[i].cramCourse[2].subject_text;
					course_name03 = data1[i].cramCourse[2].course_name;
					preferential_price03 = data1[i].cramCourse[2].preferential_price;					
				}
				
				//替换模板
				 templ+= str.replace("{{id}}", data1[i].id).replace("{{class_avatar}}", data1[i].class_avatar).replace("{{class_name}}", data1[i].class_name).replace("{{sales}}", data1[i].sales).replace("{{staronoff01}}", staronoff01).replace("{{staronoff02}}", staronoff02).replace("{{staronoff03}}", staronoff03).replace("{{staronoff04}}", staronoff04).replace("{{staronoff05}}", staronoff05).replace("{{eva_star}}", data1[i].eva_star).replace("{{about}}", data1[i].about).replace("{{area_text}}", data1[i].area_text).replace("{{address}}", data1[i].address).replace("{{actonoff01}}", actonoff01).replace("{{is_discount}}", data1[i].is_discount).replace("{{currioff}}", currioff).replace("{{currioff01}}",currioff01).replace("{{curriID01}}",curriID01).replace("{{subject_text01}}", subject_text01).replace("{{course_name01}}", course_name01).replace("{{preferential_price01}}", preferential_price01).replace("{{currioff02}}",currioff02).replace("{{curriID02}}",curriID02).replace("{{subject_text02}}", subject_text02).replace("{{course_name02}}", course_name02).replace("{{preferential_price02}}", preferential_price02).replace("{{currioff03}}",currioff03).replace("{{curriID03}}",curriID03).replace("{{subject_text03}}", subject_text03).replace("{{course_name03}}", course_name03).replace("{{preferential_price03}}", preferential_price03).replace("{{distance}}", data1[i].distance);
            		
       			 
			

			}

			$(templ).appendTo($("#CSchools"));				
			//获取城市拼音
		  	$.post("/p/getParentHome",
		    		{},
		        	function(data){		  
						pinyin=data.content.parent_follow_area_pinyin;	
						$('#pinyin').html(pinyin);
		    });		
		      
		    
			$('.spinner').fadeOut();

	}
	
	
/*----------------------------------
*  06 补习班地址js
*====================================*/	


		//展开显示地区信息页面
		function areaShow(a,b,c){
			$(a).fadeOut();				
			setTimeout(function(){
				$(c).hide();
				$('.zoneBody').removeClass('tabItemactive');
				$('.zoneBody').eq(0).addClass('tabItemactive');
				$('.zoneBody01').removeClass('active');
				$('.zoneBody01').eq(0).addClass('active');	
				$(b).fadeIn();
			},350);
			
		}	
//		areaShow("#zone","#zoneinfo");
		//收起地区信息页面
		function areaHide(a,b){
			$(a).fadeOut();
			setTimeout(function(){
				$(b).fadeIn();
			},350);
						
		}
//		areaHide("#zoneinfo","#zone");
		//热门城市
		var gethotcity=function(e,statesstyle){
			var cityID=$(e.target).attr('data-cityid');			
			$('.citys').removeClass('tabItemactive');
	        $(e.target).addClass('tabItemactive');     // 设置背景色
	        
	        //当前选择城市显示
			var cityname=$(e.target).html();
			$('#areanames01').empty();
			$('#areanames02').empty();
			$('#areanames01').attr('data-CID',cityID);
			$('#areanames01').html(cityname);
			
			$('#area_id').val(cityID);						
			$('#area').html(cityname);
			//收起地区信息页面
			areaHide("#zoneinfo","#zone");
			//获取数据-------------------------------------------------
		  	$.post("/p/setParentFollowArea",
	    		{
	    		'areaId':cityID,
	    		},
	        	function(data){
	        		
    		});
    		localStorage.setItem('ScityId',cityID);  //设置缓存，科目学习中用到
    		//1是补习班主界面调用和home
    		if(statesstyle == 1){
				page=1;						
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'areaId':cityID, 
				}				
				$("#CSchools").empty();
				getcramschoollist(dataArry);				
				
				
			//3是科目学习界面调用
    		}else if(statesstyle == 3){
				page=1;						
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
				$("#CSchools").empty();
				getcramschoollist(dataArry);
				$('#CSchools').show();
			//4是兴趣班	
    		}else if(statesstyle == 4){
				page=1;						
				var areaid=$('#area_id').val();
				var subjectId=$('#subjectId').val();
				var order=$('#order').val();
				var teacherSex=$('#teacherSex').val();
				var activity=$('#activity').val();
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'schoolTypeId':statesstyle-2,
						'areaId':areaid, 
						'subjectId':subjectId,
						'order':order,
						'activity':activity,
						'teacherSex':teacherSex,
				}				
				$("#CSchools").empty();
				getcramschoollist(dataArry);
				$('#CSchools').show();			
    		}
    		
    		
			
		}
				
		//01获取市
		var getcityid=function(e,statesstyle,ann){						
			var cityID=$(e.target).attr('data-cityid');			
			$('.provinces').removeClass('tabItemactive');
	        $(e.target).addClass('tabItemactive');     // 设置背景色
	                
	        
	        //当前选择城市显示
			var cityname=$(e.target).html();
			$('#areanames01').empty();
			$('#areanames02').empty();
			$('#areanames03').empty();
			$('#areanames04').empty();
			$('#areanames01').attr('data-CID',cityID);
			$('#areanames01').html(cityname);
			
			$.ajax({
				type:"post",
				url:"/area/getAreaList",
				data:{
					"areaId":cityID, //地区ID，传入将会返回该地区下及区域信息				
				},
				datatype:'jsonp',
				success:function(data){
					$('.zonehide').fadeIn();						
					var cityData=data;			
					var str = "";
					var templ = "";
					//1是补习班主界面
					if(statesstyle == 1){
						templ+='<li class="citys01" onclick="getcountyid(event,1,1)" data-cityid = "{{provincesID}}">{{cityname}}</li>';						
					//3是科目学习界面
					}else if(statesstyle == 3){
						templ+='<li class="citys01" onclick="getcountyid(event,3)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
					//2是上门家教界面
					}else if(statesstyle == 2){
						templ+='<li class="citys01" onclick="getcountyid(event,2)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
					}else if(statesstyle == 4){
						templ+='<li class="citys01" onclick="getcountyid(event,4)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
					}						
					$('#city01').empty();
					for(var i = 0; i < cityData.length; i++) {
						str += templ.replace("{{provincesID}}",cityData[i].id).replace("{{cityname}}", cityData[i].short_name);
						
					}
					
					$(str).appendTo($("#city01"));	

				}
			});
			
			//自动跳转
			$('.zoneBody').eq(1).removeClass('tabItemactive');
			$('.zoneBody').eq(2).addClass('tabItemactive');
			$('.zoneBody01').eq(1).removeClass('active');
			$('.zoneBody01').eq(2).addClass('active');			
			
		}

		//02获取县
		var getcountyid=function(e,statesstyle){			
			var cityID=$(e.target).attr('data-cityid');
			$('.citys01').removeClass('tabItemactive');
	        $(e.target).addClass('tabItemactive');     // 设置背景色	
			localStorage.setItem('ScityID',cityID);  //存着，上门家教需要用
			//当前选择城市显示
			var cityname=$(e.target).html();
			$('#areanames02').empty();	
			$('#areanames02').attr('data-CID',cityID);
			$('#areanames02').html(cityname);

			$('#area').html(cityname);		
			$('#area_id').val(cityID);			
			//获取数据-------------------------------------------------
		  	$.post("/p/setParentFollowArea",
	    		{
	    		'areaId':cityID,
	    		},
	        	function(data){						
   	 		});				
			//获取数据
			$.ajax({
				type:"post",
				url:"/area/getAreaList",
				data:{
					"areaId":cityID, //地区ID，传入将会返回该地区下及区域信息				
				},
				datatype:'jsonp',
				success:function(data){
					$('.zonehide').fadeIn();						
					var cityData=data;			
					var str = "";
					var templ = "";
					//1是补习班和home主界面
					if(statesstyle == 1){
						areaHide("#zoneinfo","#zone");
						templ+='<li class="citys01" onclick="areaShow01(event,1)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
						page=1;	
						var keyWord=$('#keyWords').val();
						var dataArry={
								'pageIndex':page,
								'pageSize':count,
								'areaId':cityID,
								'keyWord':keyWord,
						}				
						$("#CSchools").empty();
						getcramschoollist(dataArry);						
					//3是科目学习界面
					}else if(statesstyle == 3){
						templ+='<li class="citys01" onclick="areaShow01(event,3)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
					//2是上门家教界面
					}else if(statesstyle == 2){
						areaHide("#zoneinfo","#zone");
						templ+='<li class="citys01" onclick="areaShow01(event,2)" data-cityid = "{{provincesID}}">{{cityname}}</li>';							
		    		//4兴趣班					
					}else if(statesstyle == 4){
						templ+='<li class="citys01" onclick="areaShow01(event,4)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
					//2是上门家教界面
					}					
					$('#city02').empty();
					for(var i = 0; i < cityData.length; i++) {
						str += templ.replace("{{provincesID}}",cityData[i].id).replace("{{cityname}}", cityData[i].short_name);						
					}					
					$(str).appendTo($("#city02"));	
				}
			});	
			//自动跳转
			$('.zoneBody').removeClass('tabItemactive');
			$('.zoneBody').eq(3).addClass('tabItemactive');
			$('.zoneBody01').removeClass('active');
			$('.zoneBody01').eq(3).addClass('active');				
			
		}	

//================================
		//上门家教分支
		var areaShowfenzhi=function(){
			$('#zone').fadeOut();
			$('#zoneinfo').fadeIn();
			$('.zonehide01').hide();
			$('.zonehide02').hide();
			$('.zonehide03').hide();
			var cityID=localStorage.getItem('ScityID');	
			//获取数据
			$.ajax({
				type:"post",
				url:"/area/getAreaList",
				data:{
					"areaId":cityID, //地区ID，传入将会返回该地区下及区域信息				
				},
				datatype:'jsonp',
				success:function(data){
					$('.zonehide').fadeIn();						
					var cityData=data;			
					var str = "";
					var templ = "";
					templ+='<li class="citys01" onclick="areaShow01(event,2)" data-cityid = "{{provincesID}}">{{cityname}}</li>';	
					$('#city02').empty();
					for(var i = 0; i < cityData.length; i++) {
						str += templ.replace("{{provincesID}}",cityData[i].id).replace("{{cityname}}", cityData[i].short_name);						
					}					
					$(str).appendTo($("#city02"));	
				}
			});
			$('.zoneBody').removeClass('tabItemactive');
			$('.zoneBody').eq(3).addClass('tabItemactive');
			$('.zoneBody01').removeClass('active');
			$('.zoneBody01').eq(3).addClass('active');

		}

//---------------------------------



//获取区域-----------------------------------------
			//03获取街道
			var areaShow01=function(e,statesstyle){
				var cityID=$(e.target).attr('data-cityid');							
				$('.citys01').removeClass('tabItemactive');
		        $(e.target).addClass('tabItemactive');     // 设置背景色
		       	        
		        //选择的县
				var cityname=$(e.target).html();
				$('#areanames02').empty();
				$('#areanames03').empty();
				$('#areanames04').empty();
				$('#areanames02').attr('data-CID',cityID);
				$('#areanames02').html(cityname);		        
		        		        		        
				$.ajax({
					type:"post",
					url:"/area/getAreaList",
					data:{
						"areaId":cityID, //地区ID，传入将会返回该地区下及区域信息				
					},
					datatype:"json",
					success:function(data){
						var cityData=data;			
						var str = "";
						var templ = "";	
						//1是补习班主界面和home
						if(statesstyle == 1){
							templ+='<li class="citys" onclick="gosearchbyarea(event,1)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
						//3是学习科目
						}else if(statesstyle == 3){
							templ+='<li class="citys" onclick="gosearchbyarea(event,3)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
						//2上门家教
						}else if(statesstyle == 2){								
							templ+='<li class="citys" onclick="gosearchbyarea(event,2)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
						//4兴趣班
						}else if(statesstyle == 4){
							templ+='<li class="citys" onclick="gosearchbyarea(event,4)" data-cityid = "{{provincesID}}">{{cityname}}</li>';						
						}
						
						$('#city03').empty();
						for(var i = 0; i < cityData.length; i++) {
							str += templ.replace("{{provincesID}}",cityData[i].id).replace("{{cityname}}", cityData[i].short_name);
							
						}
						$(str).appendTo($("#city03"));		
					}
				});
				//自动跳转
				$('.zoneBody').removeClass('tabItemactive');
				$('.zoneBody').eq(4).addClass('tabItemactive');
				$('.zoneBody01').removeClass('active');
				$('.zoneBody01').eq(4).addClass('active');											
			}
							
	

		//根据地址搜索结果
		var gosearchbyarea=function(e,statetype){	
			var cityID=$(e.target).attr('data-cityid');
			$('.citys').removeClass('tabItemactive');
    		$(e.target).addClass('tabItemactive');     // 设置背景色	
			
        	//当前选择城市显示
			var cityname=$(e.target).html();
			$('#areanames04').empty();
			$('#areanames04').attr('data-CID',cityID);
			$('#areanames04').html(cityname);
		
			$('#area').html($('#areanames04').html());			
			$('#area_id').val(cityID);
			
			$('#area01').html($('#areanames04').html());			
			$('#area_id01').val(cityID);			
					
			//获取数据-------------------------------------------------
			//1是补习班住界面
			if(statetype == 2){				
				var fields = $(".smjj-change").serializeArray();
				var searchdata=$('.a1-01sinput').val();								
				var orderBy="";
				var order="";
				if(fields[2].value=='1'){
					order="star.starSum";
					orderBy='desc';
				}else if(fields[2].value=='2'){
					order="star.starSum";
					orderBy='';
				}
			
				var  datatext01={
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
						"keyword":searchdata,
					}
				$('#search-list').empty();
				loadteather(datatext01);
			//3是补习班科目学习
			}else if(statetype == 3){
				page=1;						
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
				$("#CSchools").empty();
				getcramschoollist(dataArry);
				$('#CSchools').show();				
				setTimeout(function(){
					//交互动作
					$('.njhBody01').removeClass('active');
					$('.njhBody').eq(0).removeClass('CSSearchActive');
					$('.njhTabs').removeClass('njhTabsActive');
					$('.cstabimgb').eq(0).removeClass("cstabimgbActive");
				},600);	
				
			}else if(statetype == 4){
				page=1;						
				var areaid=$('#area_id').val();
				var subjectId=$('#subjectId').val();
				var order=$('#order').val();
				var teacherSex=$('#teacherSex').val();
				var activity=$('#activity').val();
				var dataArry={
						'pageIndex':page,
						'pageSize':count,
						'schoolTypeId':statetype-2,
						'areaId':areaid, 
						'subjectId':subjectId,
						'order':order,
						'activity':activity,
						'teacherSex':teacherSex,
				}				
				$("#CSchools").empty();
				getcramschoollist(dataArry);
				$('#CSchools').show();				
				setTimeout(function(){
					//交互动作
					$('.njhBody01').removeClass('active');
					$('.njhBody').eq(0).removeClass('CSSearchActive');
					$('.njhTabs').removeClass('njhTabsActive');
					$('.cstabimgb').eq(0).removeClass("cstabimgbActive");
				},600);	
				
			}			
			areaHide("#zoneinfo","#zone");			
		}
		




/*----------------------------------
*  07 购物车列表
*====================================*/	
	function scartdelete(scdclass){
		//左划
		var container = document.querySelectorAll(scdclass);	
	    for(var i=0; i<container.length; i++) {
	        var x, y, X, Y, swipeX, swipeY;
	
	        container[i].addEventListener('touchstart', function(event) {
	            x = event.changedTouches[0].pageX;
	            y = event.changedTouches[0].pageY;
	            swipeX = true;
	            swipeY = true ;
	        });
	
	        container[i].addEventListener('touchmove', function(event) {
	
	            X = event.changedTouches[0].pageX;
	            Y = event.changedTouches[0].pageY;
	            // 左右滑动
	            if(swipeX && Math.abs(X-x) - Math.abs(Y-y) > 0) {
	
	                // 阻止事件冒泡
	                event.stopPropagation();
	
	                if(X - x > 10) {
	                    event.preventDefault();
	                    this.style.left = '0px';
	                }
	                if(x - X > 10) {
	                    event.preventDefault();
	                    this.style.left = '-100px';
	                }
	                swipeY = false;
	            }
	
	            // 上下滑动
	            if(swipeY && Math.abs(X-x) - Math.abs(Y-y) < 0) {
	                swipeX = false;
	            }
	            
	        });
	
	    }
	}
	
	//加减	
	function jiajian(){		
		var change_box_left=document.getElementsByClassName("change_box_left");
		var change_box_right=document.getElementsByClassName("change_box_right");
		var change_box=document.getElementsByClassName("change_box");
		var inputs=document.getElementsByTagName("input");			
		var goodsid='';
		var goodscount=1;
	    for(var i=0;i<change_box_left.length;i++){
	        change_box_left[i].index=i;
	        change_box_left[i].onclick= function () {
	            if(inputs[this.index].value>1){
	                inputs[this.index].value--;
	            }else{
	                inputs[this.index].value=1;
	            }
				goodsid=inputs[this.index].getAttribute("data-goodsID");
				goodscount=inputs[this.index].value;
				$.ajax({
					type:"post",
					url:"/shoppingCart/addCart",
					data:{
						'c.product_id':goodsid,  //商品ID，此处传递课程ID
						'c.product_type':1, //商品类型，此处课程类型固定专递1
						'c.count':goodscount, //传递商品数量参数
					},
					datatype:"json",
					success:function(data){					
						sumamount();
					}
				});
	        }
	
	
	    }
	    for(var i=0;i<change_box_right.length;i++){
	        change_box_right[i].index=i;
	        change_box_right[i].onclick= function () {
	            inputs[this.index].value++;
	            if(inputs[this.index].value>999){
	                inputs[this.index].value = 999;
	            }
				goodsid=inputs[this.index].getAttribute("data-goodsID");
				goodscount=inputs[this.index].value;
				$.ajax({
					type:"post",
					url:"/shoppingCart/addCart",
					data:{
						'c.product_id':goodsid,  //商品ID，此处传递课程ID
						'c.product_type':1, //商品类型，此处课程类型固定专递1
						'c.count':goodscount, //传递商品数量参数
					},
					datatype:"json",
					success:function(data){												
						sumamount();
					}
				});	            
	        }
	    }
	    for(var i=0;i<inputs.length;i++){
	        inputs[i].index=i;
	        inputs[i].onkeyup = function(){
	            this.value=this.value.replace(/\D/g,'');
	            if(inputs[this.index].value>999){
	                inputs[this.index].value = 999;
	            }
				goodsid=inputs[this.index].getAttribute("data-goodsID");
				goodscount=inputs[this.index].value;
				$.ajax({
					type:"post",
					url:"/shoppingCart/addCart",
					data:{
						'c.product_id':goodsid,  //商品ID，此处传递课程ID
						'c.product_type':1, //商品类型，此处课程类型固定专递1
						'c.count':goodscount, //传递商品数量参数
					},
					datatype:"json",
					success:function(data){					
						sumamount();
					}
				});	            
	
	        }
	    }
		
	}

	
	//勾选
	/*尾部结算*/
	function checkFN(){
		var checkAll=document.getElementsByClassName("checkalls");
		var check_box=document.getElementsByClassName("checks");
	    var check_box1=document.getElementsByClassName("checks01");
		//单选
	    for(var i=0;i<check_box1.length;i++){
	        check_box1[i].onclick= function(){
	        	listArry=[];
	        	var indexx=$(".checks01").index($(this));
				$(this).toggleClass('checksActive01');
				sumamount();
	        }
	    }
	    //对店多选
	    for(var i=0;i<check_box.length;i++){
	        check_box[i].onclick= function(){
	        	listArry=[];
	        	var indexx=$(".checks").index($(this));
	        	if($(this).hasClass("checksActive")){
	        		$(this).removeClass('checksActive');
	        		$('.SClists').eq(indexx).find('.checks01').removeClass('checksActive01');
					sumamount();        		
	        	}else{
	        		$(this).addClass('checksActive');
	        		$('.SClists').eq(indexx).find('.checks01').addClass('checksActive01');
					sumamount();        		
	        	}				

	        }
	        

	    }
	    
	    //全选
	    for(var i=0;i<checkAll.length;i++){
	        checkAll[i].onclick= function(){
				listArry=[];
				if($(this).find('.icon-Uncheck').hasClass("checksActiveAll")){
					$(this).find('.icon-Uncheck').removeClass('checksActiveAll');
					$('.checks01').removeClass('checksActive01');
					$('.checks').removeClass('checksActive');
					$('#Totalsnumbers').html(0.00);
					
				}else{
					$(this).find('.icon-Uncheck').addClass('checksActiveAll');
					$('.checks01').addClass('checksActive01');
					$('.checks').addClass('checksActive');
					sumamount();


				}

				
	        }	    	
	    }
	}
	var listArry=[];
	//计算金额
	function sumamount(){
		var moneylist=document.getElementsByClassName("checksActive01");		
		if(moneylist.length > 0){
			for(var i=0;i<moneylist.length;i++){
				listArry.push(moneylist[i].getAttribute('data-checkID'));
	
			}	
		}
		var  listArryString=listArry.toString();
		localStorage.setItem("courseIdsArry",listArryString);
		$.ajax({
			type:"post",
			url:"/shoppingCart/getCarData",
			data:{
				'productType':1,
				'productIds':listArryString,
			},
			datatype:"json",
			success:function(data){	
				$('#Totalsnumbers').html(data.object.totalPrice);				
			}
		});		
			
	}


