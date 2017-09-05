//展开显示地区信息页面
function areaShow(){
	$("#areaDiv").show();
	$("#hotDiv").hide();
	getHotSelectArea("","");
}

//选中地区后显示信息到表单
function a(id,name){
	
	var oldId=$("#area_id").val();
	$("#a"+oldId).removeClass("active");
	$("#ai"+oldId).hide();
	
	$("#area").html(name);
	$("#area_id").val(id);
	$("#areaDiv").hide();
	$("#hotDiv").show();
	$("#a"+id).addClass("active");
	$("#ai"+id).show();
	
	
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
		}
	

	$('#search-list').empty();

	loadteather(datatext01);
	
	$(window).bind("scroll", function () {     
		if ($(document).scrollTop() + $(window).height()> $(document).height() - 10 ) {       					      
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
	    		}					
				loadteather(datatext);
			
		}   
	});	
	
	

	
	
}
//开始执行按地区搜索功能
function areatext(id,name){
	
	
	
	
	var oldId=$("#area_id").val();
	$("#a"+oldId).removeClass("active");
	$("#ai"+oldId).hide();
	
	$("#area").html(name);
	$("#area_id").val(id);
	$("#areaDiv").hide();
	$("#hotDiv").show();
	$("#a"+id).addClass("active");
	$("#ai"+id).show();
	


}



//关闭地区选择页面
function areaHide(){
	$("#areaDiv").hide();
	$("#hotDiv").show();
}

//调用区域查询接口
var isAjax=false;
function getHotSelectArea(pid,key){
	$.ajax({
		type: "POST",
		url: "/t/hotSelectArea",
		data: {
			pid: pid,
			key:key
		},
		datatype: "json",
		beforeSend: function() {
			
		},
		success: function(data) {
		
			var html='';
//			var html='<div class="aui-searchbar" id="search" style="z-index:999;">';
//		    html+='<div class="aui-searchbar-input aui-border-radius">';
//		    html+='<i class="aui-iconfont aui-icon-search"></i>';
//		    html+='<form action="javascript:search();">';
//		    html+='<input id="key" type="search" name="key" placeholder="搜索城市" id="search-input">';
//		    html+='</form>';
//		    html+='</div>';
//		    html+='<div class="aui-searchbar-cancel">取消</div>';
//		    html+='</div>';
//		    html+='<div style="height:2.2rem;"></div>';
//			
//			html+='<li class="aui-list-header">';
//			html+='请选择区域';
//      	html+='</li>';
        	if(data.length>0 && data[0].parent_id>0){
				var parent_keyList=data[0].parent_key.split("-");
				var ppid="";
				if(parent_keyList.length>2){
					ppid=parent_keyList[parent_keyList.length-3];
				}
        		html+='<div class="aui-content-padded aui-content-tops"><div onclick="getHotSelectArea(\''+ppid+'\',\'\')" class="aui-btn aui-btn-block aui-btn-sm aui-btn-danger">返回上一级</div><div onclick="areaHide()" class="aui-btn aui-btn-block aui-btn-sm aui-btn-default">取消</div></div>';
        		html+='<div class="aui-content-padded"></div>';
        	}else{
        		html+='<div class="aui-content-padded aui-content-tops"><div onclick="areaHide()" class="aui-btn aui-btn-block aui-btn-sm aui-btn-default">取消</div></div>';
        	}
        	
			$.each(data, function(idx, obj) {
				
//				if(obj.level==4&&idx==0){
//					var name=obj.full_name.replace(obj.name,'');
//					
//					html+='<li class="aui-list-item" onclick="a('+obj.parent_id+',\''+name+'\')">';
//      			html+='<div class="aui-list-item-inner" id="a'+obj.parent_id+'">';
//      			html+='<div class="aui-list-item-title">全部</div>';
//     				html+='<div id="ai'+obj.parent_id+'" class="aui-list-item-right" style="display:none;">';
//   				html+='<i class="aui-pull-right aui-iconfont aui-icon-correct"></i>';
//  				html+='</div>';
//			        html+='</div>';
//			        html+='</li>';
//				}
	        	
	        	if(obj.is_hava_child){
	        		
	        		html+='<li class="aui-list-item" onclick="getHotSelectArea('+obj.id+',\'\')">';
        			html+='<div class="aui-list-item-inner aui-list-item-arrow">';
    				html+='<div id="area" class="aui-list-item-title">'+obj.name+'</div>';
   					html+='</div>';
  					html+='</li>';
	        		
	        	}else{

	        		html+='<li class="aui-list-item" onclick="a('+obj.id+',\''+obj.full_name+'\')">';
        			html+='<div class="aui-list-item-inner" id="a'+obj.id+'">';
        			html+='<div class="aui-list-item-title">'+obj.name+'</div>';
       				html+='<div id="ai'+obj.id+'" class="aui-list-item-right" style="display:none;">';
     				html+='<i class="aui-pull-right aui-iconfont aui-icon-correct"></i>';
    				html+='</div>';
			        html+='</div>';
			        html+='</li>';
			        
			        
			        
			        
			        
	        	}
			});
			
			$("#areaHtml").html(html);
		},
		complete: function(XMLHttpRequest, textStatus) {
			isAjax=false;
//			new auiToast().hide();
			
			var oldId=$("#area_id").val();
			$("#a"+oldId).addClass("active");
			$("#ai"+oldId).show();
			
			if(key.length>0){
				$("#key").val(key);
			}
			
		},
		error: function() {
			new auiDialog().alert({
				title: "提示",
				msg: "无法获取数据，请重试",
				buttons: ['确定']
			}, function(ret) {
				if(ret) {
					location.reload();
				}
			})
		}
	});
}