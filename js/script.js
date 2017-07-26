function Tab(nav, con, tag) {
    var nav, con, tag
    nav.on('click', function (event) {
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

var scrollFunc = function () {
    if ($(document).scrollTop() + $(window).height() > $(document).height() - 100) {
        homeNews.get();
    }
}


var homeNews = {
    url: '/',
    page: 1,
    page_size: 4,
    page_total: 1,
    get: function () {
        $.ajax({
            type: "post",
            url: "http://localhost:8080/api/home_news",
            dataType: "json",
            success: function (resp) {
                homeNews.push(resp)
            }
        });

    },
    push: function (resp) {
        if (resp.code == 200) {

            var list = resp.list;
            var html = '';
            for (i in list) {
                if (list[i].type == 0) {
                    html += '<li class="news-1"> <a href="' + list[i].link + '" title="' + list[i].title + '" news-id="' + list[i].id + '"> <div class="pic"><img src="' + list[i].pic + '" alt="' + list[i].title + '"> </div> <div class="info"> <div class="tags clearfix"> <div class="column ' + list[i].columnClass + '">' + cat_id_Chinese(list[i].cat_id) + '</div> <div class="tag">' + list[i].cat_name + '</div> </div> <h3>' + list[i].title + '</h3> <p>' + list[i].info + '</p> </div> </a> <div class="tools"> <p class="praise"> ' + list[i].praise + ' </p> <p class="favorite"></p> <p class="comment"> <a href="' + list[i].commentlink + '"></a> </p> <p class="share"> <img src="?' + list[i].link + '" alt=""> </p> </div> </li>'
                } else if (list[i].type == 1) {
                    html += '<li class="news-2"> <a href="' + list[i].link + '" title="' + list[i].title + '" news-id="' + list[i].id + '"> <div class="info"> <div class="tags clearfix">  <div class="column ' + list[i].columnClass + '">' + cat_id_Chinese(list[i].cat_id) + '</div> <div class="tag">' + list[i].cat_name + '</div> </div> <h3>' + list[i].title + '</h3> <p>' + list[i].info + '</p> </div> </a> <div class="tools"> <p class="praise"> ' + list[i].praise + ' </p> <p class="favorite"></p> <p class="comment"> <a href="' + list[i].commentlink + '"></a> </p> <p class="share"> <img src="?' + list[i].link + '" alt=""> </p> </div> </li>'
                } else if (list[i].type == 2) {
                    var subNewsHtml = '';
                    for (n in list[i].subNews) {
                        subNewsHtml += '<li> <a href="' + list[i].subNews[n].link + '" title="' + list[i].subNews[n].title + '"> <div class="pic"><img src="' + list[i].subNews[n].img + '" alt="' + list[i].subNews[n].title + '"></div> <div class="info"> <p>' + list[i].subNews[n].info + '</p> </div> </a> </li>'
                    }
                    html += '<li class="news-3"> <a href="' + list[i].link + '" title="' + list[i].title + '" news-id="' + list[i].id + '"> <div class="pic"><img src="' + list[i].pic + '" alt="' + list[i].title + '"> </div> <div class="info"> <div class="tags clearfix"> <div class="column ' + list[i].columnClass + '">' + cat_id_Chinese(list[i].cat_id) + '</div> <div class="tag">' + list[i].cat_name + '</div> </div> <h3>' + list[i].title + '</h3> <p>' + list[i].info + '</p> </div> </a><ul class="sub_news">' + subNewsHtml + '</ul> <div class="tools"> <p class="praise"> ' + list[i].praise + ' </p> <p class="favorite"></p> <p class="comment"> <a href="' + list[i].commentlink + '"></a> </p> <p class="share"> <img src="?' + list[i].link + '" alt=""> </p> </div> </li>'

                }
            }
            $('.home .news .list').append(html)
        }

    }

}


var homeEnter = {
    homeTop: function () {
        $.ajax({
            type: "post",
            url: "ttp://192.168.1.138:8080/api/home_top",
            dataType: "json",
            success: function (resp) {
                var html = "";
                if (resp.code == 200) {

                }
            }
        });
    }
}




var importData = {
    homeTop: function () {
        var home_top = data.homeTop;
        var id = home_top.id, praise = home_top.praise, link = 'showNew/id/'+home_top.id, commentlink = home_top.commentlink, title = home_top.title, img = home_top.pic, info = home_top.detail;
        var html = '<a href="' + link + '" title="' + title + '" news-id="' + id + '"> <img src="' + img + '" alt="' + title + '"> <span class="img-mask"></span> <div class="info"> <p class="title">' + title + '</p> <p class="description">' + info + '</p> </div> </a> <div class="tools"> <p class="praise">' + praise + '</p> <p class="favorite"></p> <p class="comment"> <a href="' + commentlink + '"></a> </p> <p class="share"> <img src="?' + link + '" alt="' + title + '"> </p> </div>';
        $('.home-top').html(html);
    },
    hotNews: function () {
        var list = data.hotNews;
        var html = "";
        for (i in list) {
            html += '<li> <a href="showNew/id/' + list[i].id + '" title="' + list[i].title + '"> <img src="' + list[i].pic + '" alt="' + list[i].title + '"> <p>' + list[i].title + '</p> </a> </li>';
        }
        $('.hot-news ul').html(html);
    },
    news: function () {
        var list = data.news;
        var html = '';
        for (i in list) {
            if (list[i].pic != null && list[i].pic != '') {
                html += '<li class="news-1"> <a href="showNew/id/' + list[i].id + '" title="' + list[i].title + '" news-id="' + list[i].id + '"> <div class="pic"><img src="' + list[i].pic + '" alt="' + list[i].title + '"> </div> <div class="info"> <div class="tags clearfix"> <div class="column column-color-1">' + cat_id_Chinese(list[i].cat_id) + '</div> <div class="tag">' + list[i].cat_name + '</div> </div> <h3>' + list[i].title + '</h3> <p>' + list[i].detail + '</p> </div> </a> <div class="tools"> <p class="praise"> ' + list[i].praise + ' </p> <p class="favorite"></p> <p class="comment"> <a href="' + list[i].commentlink + '"></a> </p> <p class="share"> <img src="?' + list[i].link + '" alt=""> </p> </div> </li>'
            } else {
                html += '<li class="news-2"> <a href="showNew/id/' + list[i].id + '" title="' + list[i].title + '" news-id="' + list[i].id + '"> <div class="info"> <div class="tags clearfix">  <div class="column column-color-2">' + cat_id_Chinese(list[i].cat_id) + '</div> <div class="tag">' + list[i].cat_name + '</div> </div> <h3>' + list[i].title + '</h3> <p>' + list[i].detail + '</p> </div> </a> <div class="tools"> <p class="praise"> ' + list[i].praise + ' </p> <p class="favorite"></p> <p class="comment"> <a href="' + list[i].commentlink + '"></a> </p> <p class="share"> <img src="?' + list[i].link + '" alt=""> </p> </div> </li>'
            } /**else if (list[i].type == 2) {
                var subNewsHtml = '';
                for (n in list[i].subNews) {
                    subNewsHtml += '<li> <a href="' + list[i].subNews[n].link + '" title="' + list[i].subNews[n].title + '"> <div class="pic"><img src="' + list[i].subNews[n].img + '" alt="' + list[i].subNews[n].title + '"></div> <div class="info"> <p>' + list[i].subNews[n].info + '</p> </div> </a> </li>'
                }
                html += '<li class="news-3"> <a href="' + list[i].link + '" title="' + list[i].title + '" news-id="' + list[i].id + '"> <div class="pic"><img src="' + list[i].pic + '" alt="' + list[i].title + '"> </div> <div class="info"> <div class="tags clearfix"> <div class="column ' + list[i].columnClass + '">' + cat_id_Chinese(list[i].cat_id) + '</div> <div class="tag">' + list[i].cat_name + '</div> </div> <h3>' + list[i].title + '</h3> <p>' + list[i].info + '</p> </div> </a><ul class="sub_news">' + subNewsHtml + '</ul> <div class="tools"> <p class="praise"> ' + list[i].praise + ' </p> <p class="favorite"></p> <p class="comment"> <a href="' + list[i].commentlink + '"></a> </p> <p class="share"> <img src="?' + list[i].link + '" alt=""> </p> </div> </li>'

            }*/
        }
        $('.home .news .list').append(html)
    },
    recruit: function () {
        var list = data.recruit;
        var html = "";
        for (i in list) {
            html += '<li><a href="' + list[i].link + '" title="' + list[i].info + '"><span>' + list[i].num + '</span>' + list[i].info + '</a></li>'
        }
        $('.recruit-info ul').html(html);
    },
    plan: function () {
        var list = data.plan;
        var html = "";
        for (i in list) {
            html += '<li><a href="' + list[i].link + '" title="' + list[i].info + '">' + list[i].rank + '.' + list[i].info + '</a></li>';
        }
        $('.plan ul').html(html);
    },
    tool: function () {
        var list = data.tool;
        var html = "";
        for (i in list) {
            html += '<li><a href="' + list[i].link + '" title="' + list[i].info + '">' + list[i].rank + '.' + list[i].info + '</a></li>';
        }
        $('.tool ul').html(html);
    },
    ad: function () {
        var ad = data.ad;
        var html = '<a href="' + ad.link + '" title="' + ad.title + '"><img src="' + ad.img + '" alt="' + ad.title + '"></a>'
        $('.implant .main').html(html);
    }

}


function cat_id_Chinese(mark) {
	if ( mark == '01'){
		return '新闻快讯';
		};	
	if ( mark == '02'){
		return  '云中漫步';
		};
}









Tui.onReady(function () {
    Tab($('.tabs .nav li'), $('.tabs .cons .con'), 'active');
    $(window).bind("scroll", scrollFunc);

    $('.implant .close').on('click', 'span', function () {
        $('.implant').remove();
    })


    importData.homeTop();
    importData.hotNews();
    importData.news();
    importData.recruit();
    importData.plan();
    importData.tool();
    importData.ad();




});