$(function () {
    //1.开始的时候加载数据
    var flowApp_data ={
        "total": "18",
        "rows": [
            {	"name": "有参转录组分析",
                "cat_name": "DNA",
                "version": "versions2.0",
                "pubtime":"2016.09.09",
                "summary":"专业、专注、严谨负责的态度使您每一次的分析结果都呈现出高端...",
                "introduction_url":"personalCenter.html",
                "use_url":"personalCenter.html"
            },
            {	"name": "有参转录组差异表达分析",
                "cat_name": "RNA",
                "version": "versions2.0",
                "pubtime":"2016.09.09",
                "summary":"专业、专注、严谨负责的态度使您每一次的分析结果都呈现出高端...",
                "introduction_url":"personalCenter.html",
                "use_url":"personalCenter.html"
            },
            {	"name": "火山图",
                "cat_name": "小工具",
                "version": "versions2.0",
                "pubtime":"2016.09.09",
                "summary":"专业、专注、严谨负责的态度使您每一次的分析结果都呈现出高端...",
                "introduction_url":"personalCenter.html",
                "use_url":"personalCenter.html"
            },
            {	"name": "有参转录组差异表达分析",
                "cat_name": "健康医学",
                "version": "versions2.0",
                "pubtime":"2016.09.09",
                "summary":"专业、专注、严谨负责的态度使您每一次的分析结果都呈现出高端...",
                "introduction_url":"personalCenter.html",
                "use_url":"personalCenter.html"
            },
            {	"name": "有参转录组分析",
                "cat_name": "DNA",
                "version": "versions2.0",
                "pubtime":"2016.09.09",
                "summary":"专业、专注、严谨负责的态度使您每一次的分析结果都呈现出高端...",
                "introduction_url":"personalCenter.html",
                "use_url":"personalCenter.html"
            },
            {	"name": "有参转录组差异表达分析",
                "cat_name": "RNA",
                "version": "versions2.0",
                "pubtime":"2016.09.09",
                "summary":"专业、专注、严谨负责的态度使您每一次的分析结果都呈现出高端...",
                "introduction_url":"personalCenter.html",
                "use_url":"personalCenter.html"
            },
            {	"name": "火山图",
                "cat_name": "小工具",
                "version": "versions2.0",
                "pubtime":"2016.09.09",
                "summary":"专业、专注、严谨负责的态度使您每一次的分析结果都呈现出高端...",
                "introduction_url":"personalCenter.html",
                "use_url":"personalCenter.html"
            },
            {	"name": "有参转录组差异表达分析",
                "cat_name": "健康医学",
                "version": "versions2.0",
                "pubtime":"2016.09.09",
                "summary":"专业、专注、严谨负责的态度使您每一次的分析结果都呈现出高端...",
                "introduction_url":"personalCenter.html",
                "use_url":"personalCenter.html"
            }
        ]
    };
    //判断条目总数，生成翻页
    var item_numbers = flowApp_data.total;
    count_pages(item_numbers);
    //数据生成（每次生成当页的，限制为8个）
    var rows = flowApp_data.rows;
    add_list(rows);
    //2.点击搜索或者回车的时候，向后传搜索内容，返回数据
    $("#search_flowapp").val("");
    $("#search_button").click(function(){
        var data = $("#search_flowapp").val();
        var url = "json/flowAppParams.json";
        if(data){
            myAjax(url,{search:data},add_data);
        };
    });
    $('#search_flowapp').bind('keypress',function(event){
		if(event.keyCode == "13")    
		{
            var data = $("#search_flowapp").val();
            var url = "json/flowAppParams.json";
            if(data){
                myAjax(url,{search:data},add_data);
            };
		}
	});
    //3.翻页上一页，下一页，固定页数
    //上一页
    $("#previous").click(function(){
        var prev_item = $($(".pages_num.active").prev());

        if(prev_item.attr("id") == "previous"){
            //当前是第一页了
        }else{
            //当前不是第一一个
            $(".pages_num.active").removeClass("active");
            prev_item.addClass("active");
            //向后传输数据
            var num = prev_item.text();
            myAjax("json/flowAppParams.json",{page:num},next_data);
        }
    });
    //下一页
    $("#next").click(function(){
        var next_item = $($(".pages_num.active").next());
        if(next_item.attr("id") == "next"){
            //当前是最后一页了
        }else{
            //当前不是最后一个
            $(".pages_num.active").removeClass("active");
            next_item.addClass("active");
            //向后传输数据
          var num = next_item.text();
          myAjax("json/flowAppParams.json",{page:num},next_data);
        }
    });
    //点击固定页
    $(".pages_num").click(function(){
        if($(this).hasClass("active")){

        }else{
            var num = $(this).text();
            myAjax("json/flowAppParams.json",{page:num},next_data);
            $(".pages_num.active").removeClass("active");
            $(this).addClass("active");
        }
    });


});
//搜索加载数据
function add_data(data){
    $(".list ul").empty();
    $(".pages_num").remove();
    var item_numbers = data.total;
    count_pages(item_numbers);
    //数据生成（每次生成当页的，限制为8个）
    var rows = data.rows;
    add_list(rows);
};
//下一页加载数据
function next_data(data,old){
    //数据生成（每次生成当页的，限制为8个）
    $(".list ul").empty();
    var rows = data.rows;
    add_list(rows);
};
//=================函数==============
//1.判断条目总数，生成翻页
function count_pages(item_numbers){
    var pages_num = Math.ceil(item_numbers/8); 
    for(var i=pages_num;i>=1;i--){
        if(i == 1){
            $("#previous").after('<li class="pages_num active"><a>'+i+'</a></li>');
        
        }else{
            $("#previous").after('<li class="pages_num"><a>'+i+'</a></li>');
        };
    };    
};
//2.给当前页添加流程和app
function add_list(data){
    for(var i=0;i<data.length;i++){
        var name =  data[i].name;
		var type = data[i].cat_name;
		var version  = data[i].version;
		var pubtime = data[i].pubtime;
		var summary = data[i].summary;
		var introduction_url = "'"+ data[i].introduction_url +"'";
        var use_url = "'"+ data[i].use_url +"'";
        var item;

		if(type == "DNA"){
			item ='<li style="background:url(img/DNA.svg) no-repeat right top;"><div class="flowApp"><p class="preSale"></p><p class="fa_title">'+name+'</p><p class="fa_ver">'+version+'</p><p class="fa_ver">'+pubtime+'</p><p class="fa_info">'+summary+'</p></div><div class="use_button"><button class="btn btn_white round_Button"  onclick="window.open('+introduction_url+')"><a>方案说明</a></button><button class="btn btn_blue round_Button"  onclick="window.open('+use_url+')"><a>立即使用</a></button></div></li>';
		}else if(type == "RNA"){
            item ='<li style="background:url(img/RNA.svg) no-repeat right top;"><div class="flowApp"><p class="fa_title">'+name+'</p><p class="fa_ver">'+version+'</p><p class="fa_ver">'+pubtime+'</p><p class="fa_info">'+summary+'</p></div><div class="use_button"><button class="btn btn_white round_Button"  onclick="window.open('+introduction_url+')"><a>方案说明</a></button><button class="btn btn_green round_Button"  onclick="window.open('+use_url+')"><a>立即使用</a></button></div></li>';

        }else if(type == "小工具"){
            item ='<li style="background:url(img/tool.svg) no-repeat right top;"><div class="flowApp"><p class="fa_title">'+name+'</p><p class="fa_ver">'+version+'</p><p class="fa_ver">'+pubtime+'</p><p class="fa_info">'+summary+'</p></div><div class="use_button"><button class="btn btn_white round_Button"  onclick="window.open('+introduction_url+')"><a>方案说明</a></button><button class="btn btn_grey round_Button"  onclick="window.open('+use_url+')"><a>立即使用</a></button></div></li>';
        }else{
            item ='<li style="background:url(img/health.svg) no-repeat right top;"><div class="flowApp"><p class="fa_title">'+name+'</p><p class="fa_ver">'+version+'</p><p class="fa_ver">'+pubtime+'</p><p class="fa_info">'+summary+'</p></div><div class="use_button"><button class="btn btn_white round_Button"  onclick="window.open('+introduction_url+')"><a>方案说明</a></button><button class="btn btn_purple round_Button"  onclick="window.open('+use_url+')"><a>立即使用</a></button></div></li>';

		};
		$(".list ul").append(item);
    }
}

/*友情弹窗,第一次登录时显示*/
if(getcookievalue("isReload")){
	$('#tip').modal('hide');
	
}else{
	$('#tip').modal('show');
	setcookievalue("isReload",true);
}

function getcookievalue(sname){
  var svalue="";
  var sname=sname+"=";
  if(document.cookie.length>0){ 
  	console.log(document.cookie)
    offset=document.cookie.indexOf(sname);
    if(offset!=-1){ 
      offset+=sname.length;
      end=document.cookie.indexOf(";",offset);
      if(end==-1)end=document.cookie.length;
      svalue=unescape(document.cookie.substring(offset,end))
    }
  }
  return svalue;
}
function setcookievalue(sname,svalue){
  document.cookie=sname+"="+escape(svalue);
}