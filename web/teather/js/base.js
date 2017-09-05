/*----------------------------------
*  author：diyijiajiao
*  time:2017-05-17
*  01 全局变量
*  02 补习班tabs切换js
*  03 地址js
*  04 验证打折input js



*====================================*/
/*----------------------------------
*  01 全局变量
*====================================*/
	var pageNumber=1;
	var pageSize=5;

/*----------------------------------
*  02 补习班tabs切换js
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
*  03 地址js
*====================================*/	


		//展开显示地区信息页面
		function areaShow(a,b){
			$(a).fadeOut();			
			setTimeout(function(){
				$('.zonehide01').hide();
				$('.zonehide02').hide();
				$('.zonehide03').hide();
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
			$('#areanames01').empty();
			
			var cityID=$(e.target).attr('data-cityid');	
			var cityname=$(e.target).html();
			$('#area_id').val(cityID);						
			$('#area').html(cityname);
			//5为主页home
			if(statesstyle == 5){
				areaHide("#zoneinfo","#zone");
				$.ajax({
					type:"post",
					url:"/p/setParentFollowArea",
					data:{
						"areaId":cityID, //地区ID，传入将会返回该地区下及区域信息				
					},
					datatype:'jsonp',
					success:function(data){									
						//获取城市拼音
					  	$.post("/p/getParentHome",
				    		{},
				        	function(data){		  
								pinyin=data.content.parent_follow_area_pinyin;	
								$('#pinyin').html(pinyin);
					    });
					}
				});				
			}else{
				getcountyid(e,statesstyle);
			}
		}
		
		

		//由省获市
		var getcityid=function(e,statesstyle){
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
					$('.zonehide01').fadeIn();						
					var cityData=data;			
					var str = "";
					var templ = "";	
					//5为home主页
					if(statesstyle == 5){
						templ+='<li class="citys01" onclick="getcountyid(event,5)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
					}else{
						templ+='<li class="citys01" onclick="getcountyid(event,1)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
					}											
					$('#city01').empty();
					for(var i = 0; i < cityData.length; i++) {
						str += templ.replace("{{provincesID}}",cityData[i].id).replace("{{cityname}}", cityData[i].name);						
					}
					
					$(str).appendTo($("#city01"));	

				}
			});
			
			//自动跳转
			$('.zoneBody').removeClass('tabItemactive');
			$('.zoneBody').eq(2).addClass('tabItemactive');
			$('.zoneBody01').removeClass('active');
			$('.zoneBody01').eq(2).addClass('active');			
			
		}

		//由市获取县区
		var getcountyid=function(e,statesstyle){			
			var cityID=$(e.target).attr('data-cityid');
			$('.citys01').removeClass('tabItemactive');
	        $(e.target).addClass('tabItemactive');     // 设置背景色	
			
			//当前选择城市显示
			var cityname=$(e.target).html();
			$('#areanames02').empty();
			$('#areanames03').empty();
			$('#areanames04').empty();
			$('#areanames02').attr('data-CID',cityID);
			$('#areanames02').html(cityname);

			//获取数据-------------------------------------------------
		  	$.post("/area/getAreaList",
		    		{
		    		'areaId':cityID,
		    		},
		        	function(data){
						$('.zonehide02').fadeIn();
						var cityData=data;			
						var str = "";
						var templ = "";	
						if(statesstyle == 5){
							templ+='<li class="citys02" onclick="getcountyidL03(event,5)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
							areaHide("#zoneinfo","#zone");
							var cityID=$(e.target).attr('data-cityid');	
							var cityname=$(e.target).html();
							$('#area_id').val(cityID);						
							$('#area').html(cityname);
							$.ajax({
								type:"post",
								url:"/p/setParentFollowArea",
								data:{
									"areaId":cityID, //地区ID，传入将会返回该地区下及区域信息				
								},
								datatype:'jsonp',
								success:function(data){									
									//获取城市拼音
								  	$.post("/p/getParentHome",
							    		{},
							        	function(data){		  
											pinyin=data.content.parent_follow_area_pinyin;	
											$('#pinyin').html(pinyin);
								    });
								}
							});																			
						}else{
							templ+='<li class="citys02" onclick="getcountyidL03(event,1)" data-cityid = "{{provincesID}}">{{cityname}}</li>';
						}													
						$('#city02').empty();
						for(var i = 0; i < cityData.length; i++) {
							str += templ.replace("{{provincesID}}",cityData[i].id).replace("{{cityname}}", cityData[i].name);							
						}
						$(str).appendTo($("#city02"));						
		   	 		});	
		   	 	
			//自动跳转
			$('.zoneBody').removeClass('tabItemactive');
			$('.zoneBody').eq(3).addClass('tabItemactive');
			$('.zoneBody01').removeClass('active');
			$('.zoneBody01').eq(3).addClass('active');	
		   	 							
		}

		//点击县结束
		var getcountyidL03=function(e,statesstyle){			
			var cityID=$(e.target).attr('data-cityid');
			$('.citys02').removeClass('tabItemactive');
	        $(e.target).addClass('tabItemactive');     // 设置背景色	
			
			//当前选择城市显示
			var cityname=$(e.target).html();
			$('#areanames03').empty();	
			$('#areanames03').attr('data-CID',cityID);
			$('#areanames03').html(cityname);		
			
			$('#area_id').val(cityID);
			//补习班开课所需
			$('.cramkaike').html($('#areanames01').html()+$('#areanames02').html()+cityname);
			
			areaHide("#zoneinfo","#zone");
			//获取数据-------------------------------------------------			
			$('#tencent').fadeIn();
								
		}

/*----------------------------------
*  04 验证打折input js
*====================================*/	

		function limitInput(o){
		    //Number()方法能保留小数点后的值,你用parseInt(),如果输入10.1，会变成10
		    var value = Number(o.value);
		    if( value<1 || value>10){
		        alert("请输入1-10之间数字");
		        o.value="";
		     }else{
		        //匹配1.0-10.0的数
		          var reg = new RegExp(/^\d{0,1}(\.\d)?$/);
		        if(reg.test(value)){
		        return true;
		        }else{
	        	o.value=parseInt(value*10)/10;
		        return false;    
		        }
		     }    
		}

 		function ValidateValue(textbox){  
             var IllegalString = "\`~@#;,.!#$%^&*()+{}|\\:\"<>?-=/,\'";  
             var textboxvalue = textbox.value;  
             var index = textboxvalue.length - 1;  
               
             var s = textbox.value.charAt(index);  
               
             if(IllegalString.indexOf(s)>=0)  
             {  
                s = textboxvalue.substring(0,index);  
                textbox.value = s;  
             }  
        }  



/*----------------------------------
*  05 左划和删除
*====================================*/	
	//左划-----------
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
	//删除-----------


/*----------------------------------
*  06 腾讯地图
*====================================*/	

	window.addEventListener('message', function(event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data;
        if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
          	console.log('location', loc); 
          	$('#lat').val(loc.latlng.lat);   //经度
          	$('#lng').val(loc.latlng.lng);   //纬度 
          	$('#DiZhi').val(loc.poiaddress);
            $('#tencent').fadeOut();
        }                                
    }, false);







