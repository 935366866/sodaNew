$(function(){
    //左边导航鼠标悬停
    var allList = $(".selectable");
	for(var i=0;i<allList.length;i++){
		allList[i].index = i;
		
		$(allList[i]).click(function(){
			var div_name = $(this).children().attr("class");
			//var h = $(div_name).offset().top;
			$('html, body').animate({  
				scrollTop: $(div_name).offset().top-162
			}, 500);  			
			//console.log(h);
		});
		$(allList[i]).mouseover(function(e) {  
			addNavStyle(this.index,allList);
		});
		$(allList[i]).mouseout(function(e) {  
			removeNavStyle(this.index,allList);
		}); 
	};
    //打开时根据窗口大小选择
    checkWindowSize(".change_box");
    //变动时根据浏览器大小选择样式
    $(window).resize(checkWindowSize);

    //导航下拉菜单
    var nav_list_all = ["nav1_list1","nav2_list1","nav2_list2"];
    for(var i in nav_list_all){
        var name = nav_list_all[i];
        $("."+name).mouseover(function(){
            $(this).addClass("listshow");
        });
        $("."+name).mouseout(function(){
            $(this).removeClass("listshow");
        });
    };
});
//左边导航的滚动监听
$(function(){

    $(window).scroll(function(){
        var top = $(document).scrollTop();
        var list = $(".selectable");           //定义变量，左边导航          //定义变量，获取滚动条的高度
        var p_list = $(".r_part_box");    //定义变量，查找.item

		//滚动时导航变化
		p_list.each(function(i){  
			var m = p_list[i];  
			var p_listTop = m.offsetTop-162;
			var h=$(m).parent().height();
            var top1 = 0;   
            
			if (typeof(top) == "object"){
				top1 = top.scrollY;
			}else{
				top1 = top;	
			};  
                
			if(  p_listTop-2 < top1 && top1< (p_listTop+h+30)){
				$(".selectable.active").removeClass("active");
				$(list[i]).addClass("active");
			};

		});
    });
});
//===========================函数========================
//1.根据浏览器大小选择样式
function checkWindowSize(){
    var id=".change_box";
    if($(window).width()>=1200){
        $(id).addClass("bigbox_1200");
        $(id).removeClass("bigbox");
    }else{
        $(id).addClass("bigbox");
        $(id).removeClass("bigbox_1200");
    };
};
//左边导航的控制
function addNavStyle(i,allList){
	$(allList[i]).attr("style","background:#eee");
};
function removeNavStyle(i,allList){
	$(allList[i]).attr("style","");
};