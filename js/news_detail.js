$(function () {
    //标签切换
    Tab($('.tabs .nav li'),$('.tabs .cons .con'),'active')

    //惰性加载数据
    $(window).scroll(function(){
        loadData(loadNewsList,"json/news_comment.json");
    });


    //搜索
    $("#search_news_input").val("");
    $("#search_news_button").on("click",function(){
        var search_data = $("#search_news_input").val();
        if(search_data != ""){
            myAjax("json/search.json",{search:search_data},search_success);
        };
    });

    //点赞
    $(".tools-1").on("click",".praise",function(){
        //var num = $(this).text();
        var this_id =  news_id;
        myAjax("json/zan.json",{zan_id:this_id},zan_success,$(this));
    });
    //收藏
    $(".tools-1").on("click",".favorite",function(){
        var this_id =  news_id;
        myAjax("json/zan.json",{favorite_id:this_id},favorite_success,$(this));
    });

    //评论
    $("#comment_detail").val("");
    
    $("#send_comment").on("click",function(){
        var this_id =  news_id;
        var detail = $("#comment_detail").val();
        if(detail != ""){
            myAjax("json/news_comment.json",{id:this_id,remark:detail},send_success);
        }else{
            alert("评论不能为空！");
        };
    });

    //最新评论排序
    $("#sort_new").on("click",function(){
        var this_id =  news_id;
        myAjax("json/news_comment.json",{sort_new_id:this_id},sort_success);
        $("#sort_old").parent().removeClass("active");
        $("#sort_new").parent().addClass("active");
    });
    //最早评论排序
    $("#sort_old").on("click",function(){
        var this_id =  news_id;
        myAjax("json/news_comment.json",{sort_old_id:this_id},sort_success);
        $("#sort_new").parent().removeClass("active");
        $("#sort_old").parent().addClass("active");
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
    var i = $(".message-board-list ul li").length-1;
    var lastId = $($(".message-board-list ul li")[i]).attr("id");

    $.ajax({
            url:url,  
            type:'post',
            data:{id:lastId},
            dataType: "json",
            success:function(data) {
                var newsData = data.rows;
                var total = data.total;
                $("#comment_num").text(total);
                for(var i=0;i < newsData.length ; i++){
                    
                    var name = newsData[i].name;
                    var face = newsData[i].face;
                    var pubtime = newsData[i].pubtime;
                    var comment = newsData[i].comment;
                    var comment_id = newsData[i].comment_id;


                    $(".message-board-list ul").append('<li id="'+comment_id+'"><div class="photo"><img src="'+face+'" alt=""></div><div class="info"><div class="nickname"><h3>'+name+'</h3><span>'+pubtime+'</span></div><div class="message-board-message"><p>'+comment+'</p></div></div></li>');

                    
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
function search_success(data){
    window.open(data.data);
};
//评论成功
function send_success(data){

    //清空所有评论重新加载
    $(".message-board-list ul").empty();
    //返回的数据
    var newsData = data.rows;
    var total = data.total;
    $("#comment_num").text(total);
    for(var i=0;i < newsData.length ; i++){
        
        var name = newsData[i].name;
        var face = newsData[i].face;
        var pubtime = newsData[i].pubtime;
        var comment = newsData[i].comment;
        var comment_id = newsData[i].comment_id;


        $(".message-board-list ul").append('<li id="'+comment_id+'"><div class="photo"><img src="'+face+'" alt=""></div><div class="info"><div class="nickname"><h3>'+name+'</h3><span>'+pubtime+'</span></div><div class="message-board-message"><p>'+comment+'</p></div></div></li>');
    };
    alert("评论成功！");
    $("#comment_detail").val("");
};
function sort_success(data){
    //清空所有评论重新加载
    $(".message-board-list ul").empty();
    //返回的数据
    var newsData = data.rows;
    var total = data.total;
    $("#comment_num").text(total);
    for(var i=0;i < newsData.length ; i++){
        
        var name = newsData[i].name;
        var face = newsData[i].face;
        var pubtime = newsData[i].pubtime;
        var comment = newsData[i].comment;
        var comment_id = newsData[i].comment_id;


        $(".message-board-list ul").append('<li id="'+comment_id+'"><div class="photo"><img src="'+face+'" alt=""></div><div class="info"><div class="nickname"><h3>'+name+'</h3><span>'+pubtime+'</span></div><div class="message-board-message"><p>'+comment+'</p></div></div></li>');
    };
};