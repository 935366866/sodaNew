$(function () {
	var data=0;
	var data1=0;
	var data2=0;
    //左边导航的效果
   $("#persongNav li.p").on('click',function(e){
        $("#right").load($(".active").attr("urls"),function(){
   			
   		})
        $(this).siblings().removeClass("active");
       	$(this).addClass("active");
        var id=$(this).attr("urls")
        $(this).siblings("ul").children("li").each(function(){
        	var id1=$(this).data().id;
        	$("#"+id1).hide();
        })
        if(id=="data"&&$("#process").hasClass("open")==false){
    		$("#menuPath").text("数据分析");
        	$("#process").addClass("open");
        	$("#list").show();
        }else{
    		$("#menuPath").text($(this).text());
    		$("#process").removeClass("open")
    		$("#list").hide();
        }
       
    });
    
	$("#list li.q").on('click',function(e){
			e.stopPropagation();
			$("#menuPath").text("数据分析>"+e.target.innerHTML);
			$("#process").removeClass("active");
			
			$(this).siblings().removeClass("active");
			$(this).addClass("active");
			var id=$(this).attr("id");
			if(id=="process1"&&$("#process").removeClass("open")){
	        	$("#process1").addClass("open");
	        	$("#list1").show();
	        }else{
	        	$("#process1").removeClass("open");
	        	$("#list1").hide();
	        }
	        
	        if(id=="process2"){
	        	$("#process2").addClass("open");
	        	$("#list2").show();
	        }else{
	        	$("#process2").removeClass("open");
	        	$("#list2").hide();
	        }
	})
	
	

})
