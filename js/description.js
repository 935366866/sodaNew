$(function () {
    //左边导航的效果
   $("#persongNav li").on('click',function(e){
    	$(this).siblings().removeClass("active");
        $(this).addClass("active");
        var id=$(this).data().id;
        $("#"+id).show();
        $(this).siblings().each(function(){
        	var id1=$(this).data().id;
        	$("#"+id1).hide();
        })
       
    });
    

})
