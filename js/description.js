$(function () {
	var data=0;
	var data1=0;
	var data2=0;
    //左边导航的效果
   $("#persongNav li.p").on('click',function(e){
   		$("#menuPath").text($(this).children("a").text());
   		$("#list li").css("background","#fff").children("a").css("color","#333");
    	$(this).siblings().removeClass("active");
        $(this).addClass("active");
        $("#right").load($(".active").attr("urls"),function(){
   			
   		})
        var id=$(this).attr("urls")
//      $("#"+id).show();
//      $(this).siblings().each(function(){
//      	var id1=$(this).data().id;
//      	$("#"+id1).hide();
//      })
        $(this).siblings("ul").children("li").each(function(){
        	var id1=$(this).data().id;
        	$("#"+id1).hide();
        })
        if(id=="data"){
        	if(data==0){
        		$("#list").show().children("li").removeClass("active");
	        	$("#icon").css("background","url(img/dec_arrowDown1.svg)");
	        	data=1;
        	}else{
        		$("#list").hide();
        		$("#icon").css("background","url(img/dec_arrowLeft1.svg)");
	        	data=0;
        	}
        	
        }else{
	        if(data==0){
	        	$("#icon").css("background","url(img/dec_arrowLeft.svg)");
	        }else{
	        	$("#icon").css("background","url(img/dec_arrowDown.svg)");
	        }
	        if(data1==0){
	        	$("#icon1").css("background","url(img/dec_arrowLeft.svg)");
	        }else{
	        	$("#icon1").css("background","url(img/dec_arrowDown.svg)");
	        }
	        if(data2==0){
	        	$("#icon2").css("background","url(img/dec_arrowLeft.svg)");
	        }else{
	        	$("#icon2").css("background","url(img/dec_arrowDown.svg)");
	        }
        }
       
    });
	$("#list li.q").on('click',function(e){
		var id=$(this).data().id;
        $("#"+id).show();
        $("#persongNav li.p").each(function(){
        	var id2=$(this).data().id;
        	$("#"+id2).hide();
        })
        $(this).siblings().each(function(){
        	var id1=$(this).data().id;
        	$("#"+id1).hide();
        })
        $(this).siblings("ul").children("li").each(function(){
        	var id1=$(this).data().id;
        	$("#"+id1).hide();
        })
		$("#menuPath").text("数据分析>"+$(this).children("a").text());
		$("#icon").css("background","url(img/dec_arrowDown.svg)");
		$(".p").removeClass("active");
		$(this).css("background","#13438b").children("a").css("color","#fff");
		$(this).siblings("li").css("background","#fff").children("a").css("color","#333");
		$("#list1>li").css("background","#fff").children("a").css("color","#333");
		$("#list2>li").css("background","#fff").children("a").css("color","#333");
		if($(this).children("span").attr("id")=="icon1"){
			if(data1==0){
				$("#list1").show();
				$("#icon1").css("background","url(img/dec_arrowDown1.svg)");
				data1=1;
			}else{
				$("#list1").hide();
				$("#icon1").css("background","url(img/dec_arrowLeft1.svg)");
				data1=0;
			}
			
		}else{
			if(data1==0){
	        	$("#icon1").css("background","url(img/dec_arrowLeft.svg)");
	        }else{
	        	$("#icon1").css("background","url(img/dec_arrowDown.svg)");
	        }
		}
		if($(this).children("span").attr("id")=="icon2"){
			if(data2==0){
				$("#list2").show();
				$("#icon2").css("background","url(img/dec_arrowDown1.svg)");
				data2=1;
			}else{
				$("#list2").hide();
				$("#icon2").css("background","url(img/dec_arrowLeft1.svg)");
				data2=0;
			}
			
		}else{
			if(data2==0){
	        	$("#icon2").css("background","url(img/dec_arrowLeft.svg)");
	        }else{
	        	$("#icon2").css("background","url(img/dec_arrowDown.svg)");
	        }
		}
		
	})
	
	$("#list1 li").on("click",function(){
		var id=$(this).data().id;
        $("#"+id).show();
        $("#persongNav li.p").each(function(){
        	var id2=$(this).data().id;
        	$("#"+id2).hide();
        })
        $(this).siblings().each(function(){
        	var id1=$(this).data().id;
        	$("#"+id1).hide();
        })
        $(this).parent("ul").siblings("li").each(function(){
        	var id1=$(this).data().id;
        	$("#"+id1).hide();
        })
		$("#menuPath").text("数据分析>分析流程>"+$(this).children("a").text());
		$(this).css("background","#13438b").children("a").css("color","#fff");
		$(this).siblings("li").css("background","#fff").children("a").css("color","#333");
		$("#list>li").css("background","#fff").children("a").css("color","#333");
		$("#persongNav>li").css("background","#fff").children("a").css("color","#333");
		if(data1==0){
        	$("#icon1").css("background","url(img/dec_arrowLeft.svg)");
        }else{
        	$("#icon1").css("background","url(img/dec_arrowDown.svg)");
        }
	})
	$("#list2 li").on("click",function(){
		$("#menuPath").text("数据分析>小工具>"+$(this).children("a").text());
		$(this).css("background","#13438b").children("a").css("color","#fff");
		$(this).siblings("li").css("background","#fff").children("a").css("color","#333");
		$("#list>li").css("background","#fff").children("a").css("color","#333");
		$("#persongNav>li").css("background","#fff").children("a").css("color","#333");
		if(data2==0){
        	$("#icon2").css("background","url(img/dec_arrowLeft.svg)");
        }else{
        	$("#icon2").css("background","url(img/dec_arrowDown.svg)");
        }
	})

})
