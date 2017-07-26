
$(function () {
    $(".scroll-picture").slide({ mainCell: ".scroll-picture-list ul", autoPage: false, effect: "top", vis: 3 });
    var list = $('.scroll-picture-list ul li');
    
	var left_width = $('.focus-picture').width();
    $('.focus-picture').css('height', (left_width*0.618));
    $('.tempWrap').css('height', (left_width*0.618));
    list.css('height', ((left_width*0.618-41)/3));
    //改变窗口大小图片改变
     $(window).resize(function () {
         //左边大图根据当前图的宽度进行修改，大小为黄金比例0.618
         var left_width = $('.focus-picture').width();
         $('.focus-picture').css('height', (left_width*0.618));
         $('.tempWrap').css('height', (left_width*0.618));
         list.css('height', ((left_width*0.618-41)/3));
    });
/*
        var h = list.eq(0).find('a').height();
        list.css('height', h);
        $('.tempWrap').css('height', (h + 5) * 3);

    $(window).resize(function () {
        var h = list.eq(0).find('a').height();
        list.css('height', h);
        $('.tempWrap').css('height', (h + 5) * 3);
    })
*/
    //标签切换
    Tab($('.tabs .nav li'),$('.tabs .cons .con'),'active')
    //蓝条
    //var catname = document.getElementById("tag").innerText; 
    //if (catname=="前沿研究"){
    // 	$("#dh11").attr("class","");     
    //    $("#dh12").attr("class","nav_b1");
    //    $("#dh13").attr("class","");	
    //}else if(catname=="市场动态"){
    //	$("#dh11").attr("class","");      
      //  $("#dh12").attr("class","");
      //  $("#dh13").attr("class","nav_b1");
    //}else{
	
    //}

    //其他news展示

//  //惰性加载数据
//  $(window).scroll(function(){
//      loadData(loadNewsList,module+"/News/listNews");
//	//console.log(module+"/News/listNews")
//  });


    //搜索
    $("#search_news_input").val("");
    $("#search_news_button").on("click",function(){
        var search_data = $("#search_news_input").val();
	var url = module+"/News/searchnews";
        if(search_data != ""){
            myAjax(url,{search:search_data},search_success);
        };
    });

    //头图展示的点赞和收藏
    $(".focus-picture").on("click",".praise",function(){
        //var num = $(this).text();
        var this_id =  $(this).closest(".focus-picture").attr("id");
        myAjax(module+"/News/praiseNews",{news_id:this_id},zan_success,$(this));
    });
    //收藏
    $(".focus-picture").on("click",".favorite",function(){
        var this_id =  $(this).closest(".focus-picture").attr("id");
        myAjax("json/zan.json",{favorite_id:this_id},favorite_success,$(this));
    });
    //点赞
    $(".news").on("click",".praise",function(){
        //var num = $(this).text();
        var this_id =  $(this).closest("li").attr("id");
        myAjax(module+"/News/praiseNews",{news_id:this_id},zan_success,$(this));
	//console.log(this_id);
	//console.log($(this));
    });
    //收藏
    $(".news").on("click",".favorite",function(){
        var this_id =  $(this).closest("li").attr("id");
        myAjax(module+"/News/favoriteNews",{news_id:this_id},favorite_success,$(this));
    });

    //登录框
    
    $("#login_button").on("click",function(){
        $('#loginBox').modal('show');
    });

    

});
//==================================函数================================
//标签切换
function Tab(nav, con, tag) {
        var nav, con, tag
        nav.on('click', function(event) {
            event.preventDefault();
            var n = $(this).index()
            nav.removeClass(tag)
            $(this).addClass(tag)
            con.hide(0)
            con.eq(n).show(0)
        });
        nav.eq(0).addClass(tag)
        con.hide(0)
        con.eq(0).show(0)
    }

//惰性加载
var totalHeight = 0;     //定义一个总的高度变量
var loadFlag = 1;        //标志为1时可加载
function loadData(funcName,url){
    if(loadFlag == 1){
        //滚动条到顶部的垂直高度
        var scrollHeight = parseFloat($(window).scrollTop());
        //浏览器窗口的高度
        var windowHeight = parseFloat($(window).height());
        //页面的文档高度
        var documentHeight = parseFloat($(document).height());
        totalHeight = windowHeight + scrollHeight; 

        if (documentHeight <= totalHeight)     //当文档的高度小于或者等于总的高度的时候，开始动态加载数据
        {
            //标志置零
            loadFlag = 0;
            //加载数据
            funcName(url);
            loadFlag = 1;
        }
    }else{
        return;
    }
}

function loadNewsList(url){
    var i = $(".news ul li").length-1;
    var lastId = $($(".news ul li")[i]).attr("id");

    $.ajax({
            url:url,  
            type:'get',
            data:{id:lastId},
            dataType: "json",
            success:function(data) {
                
                var newsData = data.data;
                for(var i=0;i < newsData.length ; i++){
                    
		    if(newsData[i].pic==''){
                    	var newsType = "noPic";
                    }else{
                    	var newsType = "havePic";
                    }
                    var newsUrl = newsData[i].newsUrl;//未使用
                    var title = newsData[i].title;
                    var cat_id = newsData[i].cat_id;
                    var cat_name = newsData[i].cat_name;
                    var id = newsData[i].id;
                    var pic = newsData[i].pic;
                    var pubtime = newsData[i].pubtime;
                    var zan = newsData[i].praise;
                    var summary = newsData[i].detail;
	//		console.log(summary);
		    var summary1 = summary.substring(0,200);
                    if(cat_id == "新闻快讯"){
                        cat_id = "新闻快讯";
                    }else if(cat_id == "云中漫步"){
                        cat_id = "云中漫步";
                    }else{
                        //
                    };

                    if(newsType == "havePic"){
			$(".news ul").append('<li class="news-1" id="'+id+'"><a href="'+module+'/News/showNews/id/'+id+'" title="'+title+'"><div class="pic"><img src="'+pic+'" alt="'+title+'"></div><div class="info"><div class="tags clearfix"><div class="tag">'+cat_name+'</div></div><h3><a target="_blank" href="'+module+'/News/showNews/id/'+id+'">'+title+'</a></h3><p>'+summary1+'</p></div></a><div class="tools"><p class="praise">'+zan+'</p><p class="favorite"></p><p class="comment"><a href="'+module+'/News/showNews/id/'+id+'"></a></p></div></li>');                        

//                        $(".news ul").append('<li class="news-1" id="'+id+'"><a href="'+newsUrl+'" title="'+title+'"><div class="pic"><img src="'+pic+'" alt="'+title+'"></div><div class="info"><div class="tags clearfix"><div class="column column-color-1">'+cat_id+'</div><div class="tag">'+cat_name+'</div></div><h3><a target="_blank" href="'+module+'/News/showNews/id/'+id+'">'+title+'</a></h3><p>'+summary1+'</p></div></a><div class="tools"><p class="praise">'+zan+'</p><p class="favorite"></p><p class="comment"><a href="'+module+'/News/showNews/id/'+id+'"></a></p></div></li>');

                    }else if(newsType == "noPic"){
			$(".news ul").append('<li class="news-2" id="'+id+'"><a href="'+module+'/News/showNews/id/'+id+'" title="'+title+'"><div class="info"><div class="tags clearfix"><div class="tag">'+cat_name+'</div></div><h3><a target="_blank" href="'+module+'/News/showNews/id/'+id+'">'+title+'</a></h3><p>'+summary1+'</p></div></a><div class="tools"><p class="praise">'+zan+'</p><p class="favorite"></p><p class="comment"><a href="'+module+'/News/showNews/id/'+id+'"></a></p></div></li>');

                       //$(".news ul").append('<li class="news-2" id="'+id+'"><a href="'+newsUrl+'" title="'+title+'"><div class="info"><div class="tags clearfix"><div class="column column-color-2">'+cat_id+'</div><div class="tag">'+cat_name+'</div></div><h3><a target="_blank" href="'+module+'/News/showNews/id/'+id+'">'+title+'</a></h3><p>'+summary1+'</p></div></a><div class="tools"><p class="praise">'+zan+'</p><p class="favorite"></p><p class="comment"><a href="'+module+'/News/showNews/id/'+id+'"></a></p></div></li>');
                    }else{
                        //暂时去掉多图的情况
                    }
                };
            },    
            error : function(XMLHttpRequest) {
                alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
            }
    });  

}
//赞成功后的函数
function zan_success(data,old,dom){
    dom.text(data.data);
    dom.addClass("active");
};
//收藏成功后的函数
function favorite_success(data,old,dom){
    dom.addClass("active");
};
//搜索成功后的函数
/*function search_success(data){
    //window.open(data.rows);
    $(".news ul").empty();
    for (var i=0;i<data.length;i++){
	var id = data[i].id;
	var author = data[i].author;
	var cat_id = data[i].cat_id;			
	var cat_name = data[i].cat_name;
	var love = data[i].love;
	var pic = data[i].pic;
	var pubtime= data[i].pubtime;
	var relative = data[i].relative;
	var remark = data[i].remark;
	var short_num = data[i].short_num;
	var source = data[i].source;
	var title = data[i].title;
	var praise = data[i].praise;
	var detail = data[i].detial;
	var item = '';
	var id1 = "'"+module+'/News/showNews/id/'+data[i].id + "'";
	if (pic){
		item = '<li class="news-1" id="'+id+'"><a href="#" title="'+title+'"><div class="pic"><a target="_blank" href="'+ id + '><img src="'+ pic +'" /></a></div><div class="info"><div class="tags clearfix"><div class="tag">'+cat_name+'</div></div><h3><a target="_blank" href="'+id+'">'+title+'</a></h3><p>'+ detail+'</p></div></div></a><div class="tools"><p class="praise">'+ praise +'</p><p class="favorite"></p><p class="comment"><a href="'+id+'"></a></p></div></li>';
	}else{
		item = '<li class="news-2" id="{$news.id}"><a href="#" title="'+ title +'"><div class="info"><div class="tags clearfix"><div class="tag">'+ cat_name +'</div></div><h3><a target="_blank" href="'+ id +'">'+title+'</a></h3><p>'+detail+'</p></div></a><div class="tools"><p class="praise">'+ praise+'</p><p class="favorite"></p><p class="comment"><a href="'+id+ '"></a></p></div></li>';
	};
	$(".news ul").append(item);

    }	
};
*/
function search_success(data){//
	$("#fly").remove();
	$("#fff").remove();
	$(".news ul").empty();
	$(".articles-main").empty();
	//$(".articles-main").remove();
	var newsData = data.data;
                for(var i=0;i < newsData.length ; i++){
                    
		    if(newsData[i].pic==''){
                    	var newsType = "noPic";
                    }else{
                    	var newsType = "havePic";
                    }
                    var newsUrl = newsData[i].newsUrl;//未使用
                    var title = newsData[i].title;
                    var cat_id = newsData[i].cat_id;
                    var cat_name = newsData[i].cat_name;
                    var id = newsData[i].id;
                    var pic = newsData[i].pic;
                    var pubtime = newsData[i].pubtime;
                    var zan = newsData[i].praise;
                    var summary = newsData[i].detail;
		    var summary1 = summary.substring(0,200);
                    if(cat_id == "新闻快讯"){
                        cat_id = "新闻快讯";
                    }else if(cat_id == "云中漫步"){
                        cat_id = "云中漫步";
                    }else{
                        
                    };

                    if(newsType == "havePic"){
			//$(".news ul").append('<li class="news-1" id="'+id+'"><a href="'+newsUrl+'" title="'+title+'"><div class="pic"><img src="'+pic+'" alt="'+title+'"></div><div class="info"><div class="tags clearfix"><div class="tag">'+cat_name+'</div></div><h3><a target="_blank" href="'+module+'/News/showNews/id/'+id+'">'+title+'</a></h3><p>'+summary1+'</p></div></a><div class="tools"><p class="praise">'+zan+'</p><p class="favorite"></p><p class="comment"><a href="'+module+'/News/showNews/id/'+id+'"></a></p></div></li>');                    
			$(".news ul").append('<li class="news-1" id="'+id+'"><a href="#" title="'+title+'"><div class="pic"><a target="_blank" href="'+module+'/News/showNews/id/'+id+'"><img src="../../'+pic+'" /></a></div><div class="info"><div class="tags clearfix"><div id="tag" class="tag">'+cat_name+'</div></div><h3><a target="_blank" href="'+module+'/News/showNews/id/'+id+'">'+title+'</a></h3><p>'+summary1+'</p></div></a><div class="tools"><p class="praise">'+zan+'</p><p class="favorite"></p><p class="comment"><a href="'+module+'/News/showNews/id/'+id+'"></a></p></div></li>')
                    }else if(newsType == "noPic"){
			$(".news ul").append('<li class="news-2" id="'+id+'"><a href="'+newsUrl+'" title="'+title+'"><div class="info"><div class="tags clearfix"><div class="tag">'+cat_name+'</div></div><h3><a target="_blank" href="'+module+'/News/showNews/id/'+id+'">'+title+'</a></h3><p>'+summary1+'</p></div></a><div class="tools"><p class="praise">'+zan+'</p><p class="favorite"></p><p class="comment"><a href="'+module+'/News/showNews/id/'+id+'"></a></p></div></li>');
                    }else{
                    }
                };

}//
