$(function () {
	var data=0;
    //左边导航的效果
   $("#persongNav li.p").on('click',function(e){
   		$("#list li").css("background","#fff")
    	$(this).siblings().removeClass("active");
        $(this).addClass("active");
        var id=$(this).data().id;
        $("#"+id).show();
        $(this).siblings().each(function(){
        	var id1=$(this).data().id;
        	$("#"+id1).hide();
        })
        
        if(id=="data"){
        	if(data==0){
        		$("#list").show().children("li").removeClass("active");
	        	$("#icon").css("background","url(img/dec_arrowDown.svg)");
	        	data=1;
        	}else{
        		$("#list").hide();
        		$("#icon").css("background","url(img/dec_arrowLeft.svg)");
	        	data=0;
        	}
        	
        }
       
    });
	$("#list li").on('click',function(e){
		$(".p").removeClass("active");
		$(this).css("background","#13438b").children("a").css("color","#fff");
		$(this).siblings("li").css("background","#fff").children("a").css("color","#333");
	})

})
