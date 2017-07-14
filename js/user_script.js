
$(function () {
    $('.toggle').on('click',function(){
        if($(this).next('.togglebox').is(":hidden")){
            $(this).addClass('active');
            $(this).next('.togglebox').show(0);
        }else{
            $(this).removeClass('active');
            $(this).next('.togglebox').hide(0);
        }
    })
    $('.sub-toggle').on('click',function(){
        
        if($(this).next('.user-form').is(":hidden")){
            $(this).addClass('active');
            $(this).next('.user-form').show(0);
        }else{
            $(this).removeClass('active');
            $(this).next('.user-form').hide(0);
        }
    })
	
    //左边导航的效果
	var scrollTop = $(window).scrollTop()
   $("#persongNav li").on('click',function(e){
   		e.preventDefault();
    	$(this).siblings().removeClass("active");
        $(this).addClass("active");
	    $('html, body').animate({
		    'scrollTop': $($(this).children("a").attr('href')).offset().top-60
		}, 400);
    });

//1.个人信息部分===================================
    //昵称提交
    $("#s_nikename").click(function(){
        var data = $("#nikename").val();
        myAjax(module + "/User/change_name",{nikename: data},s_success);
    });
    //修改密码
    $("#s_password").click(function(){
        var old = $("#password").val();
        var now = $("#newpassword").val();
        var re = $("#repassword").val();
        myAjax(module + "/User/change_password",{password: old,newpassword:now,repassword:re},s_success);
    });
    //修改手机号
    $("#verification_code").click(function(){
        var number = $("#mobile").val();
        myAjax(url,{mobile: number},s_mobile);
    });
    $("#s_phone").click(function(){
        var phone = $("#mobile").val();
        var number = $("#code").val();
        myAjax(url,{mobile: phone,code:number},s_success);
    });
    //修改邮箱
    $("#s_mail").click(function(){
        var now = $("#mail").val();
        myAjax(module + "/User/change_email",{mail: now},s_success);
    });
});


function s_success(){
    //if(data=='1'){
    //	alert('邮箱修改成功，请到新邮箱确认')
    //}else{
    alert("修改成功！");
    //}
}
function s_mobile(){
    alert("已经给您的手机发送了验证码，请注意查收！");
}

//2.消息中心部分===================================

$(function(){
	//实时统计选中checkbox的个数		
	checkedNow1('infoTable','now_ck_num'); 	
	//点击刷新时清除选中
	refreshTable("infoDiv","now_ck_num");

	//添加删除按钮
	$("#infoDiv button[name='paginationSwitch']").after('<button class="btn btn-default" title="trash" name="trash" id="removeInfo"><i class="glyphicon glyphicon-trash icon-trash"></i></button>');


	//添加点击函数 这里直接写入了remove所用的参数，第一个参数是当前的表格id，第二个是网后台传的id，最后是向后台发送的地址
	$("#removeInfo").click(function(){
		remove('infoTable','id','json/info.json');    //陈向伟  所有删除的都要有状态  data['status']  跟之前一样,成功或失败出现相应提示在data['data']里
		$("#now_ck_num").text(0);
	});
	//消息
	submitData("json/info.json","infoTable","now_ck_num","newMessage","submitNewMessage");	
});

//3.收藏部分===================================
var all_favorite_flag = 0;
$(function(){
	//1.加载所有收藏的信息
	//返回的数据
	var data = {
					"total": "2",
					"rows": [
						{
							"favorite_id": "9EB34B66-D853-D6D9-F026-A6368E3C9A88",
							"url":"www.baidu.com",
							"insert_time": "0000-00-00 00:00:00",
							"cat_id": "02",
							"cat_name": "DNA",
							"title": "dna产品",
							"pubtime": "2016-11-08 12:14:18"
						},
						{
							"favorite_id": "A3B51B09-CA73-58FD-6402-6CA3A6986139",
							"url":"www.hao123.com",
							"insert_time": "0000-00-00 00:00:00",
							"cat_id": "01",
							"cat_name": "前沿研究",
							"title": "title标题",
							"pubtime": "2016-09-08 12:14:18"
						},
						{
							"favorite_id": "001",
							"url":"www.baidu.com",
							"insert_time": "0000-00-00 00:00:00",
							"cat_id": "02",
							"cat_name": "DNA",
							"title": "dna产品",
							"pubtime": "2016-11-08 12:14:18"
						},
						{
							"favorite_id": "002",
							"url":"www.baidu.com",
							"insert_time": "0000-00-00 00:00:00",
							"cat_id": "01",
							"cat_name": "DNA",
							"title": "dna产品",
							"pubtime": "2016-11-08 12:14:18"
						},
						{
							"favorite_id": "003",
							"url":"www.baidu.com",
							"insert_time": "0000-00-00 00:00:00",
							"cat_id": "02",
							"cat_name": "DNA",
							"title": "dna产品",
							"pubtime": "2016-11-08 12:14:18"
						},
						{
							"favorite_id": "004",
							"url":"www.baidu.com",
							"insert_time": "0000-00-00 00:00:00",
							"cat_id": "01",
							"cat_name": "DNA",
							"title": "dna产品",
							"pubtime": "2016-11-08 12:14:18"
						},
					]
				};
	data = data.rows;
	for(var i=0;i<data.length;i++){
		var id =  data[i].favorite_id;
		var url = data[i].url;
		var title  = data[i].title;
		var cat_id = data[i].cat_id;
		var cat_name = data[i].cat_name;
		var pubtime = data[i].pubtime
		if(cat_id == "01"){
			cat_id = "前沿研究";

		}else{
			cat_id = "市场动态";
		};
		var item = '<li><div class="checked"><input type="checkbox" name="'+id+'" id="'+id+'"></div><div class="favorites-list-link"><a href="'+url+'" title="'+title+'"><div class="tag"><span>'+cat_id+'</span></div><h3>'+title+'</h3><p>'+pubtime+'</p></a></div></li>';
		$(".favorites-list ul").append(item);
	};
	//2.全选
	//默认整个网页无选中
	$("input[type='checkbox']").attr("checked",false);
	
	$("#all_favorite").click(function(){
		var all_select =  $(".favorites-list li input");
		if(all_favorite_flag == 0){
			
			for(var i=0;i<all_select.length;i++){
				var s_item = $(all_select[i]);
				if(s_item.is(":checked") == false){
					s_item.prop("checked",true);
				};
			};
			all_favorite_flag = 1;
		}else{
			
			for(var i=0;i<all_select.length;i++){
				var s_item = $(all_select[i]);
				if(s_item.is(":checked") == true){
					s_item.prop("checked",false);
				};
			};
			all_favorite_flag = 0;
		};
	});
	//3.删除
	$("#favorite_delete").click(function(){
		//向后传id
		var ids = "";
		var all_select =  $(".favorites-list li input");
		for(var i=0;i<all_select.length;i++){
				var s_item = $(all_select[i]);
				if(s_item.is(":checked") == true){
					if(ids==""){
						ids += s_item.attr("id");
					}else{
						ids += ","+s_item.attr("id");
					}	
				};
			};
		myAjax("json/t1.json",{id:ids},f_d_c);
	});
	favoritesSelect($("#studyInput"));
	favoritesSelect($("#marketInput"));
});

//删除收藏后执行的函数
function f_d_c(a,old){
	var all = old.id.split(",");
	for(var i=0;i<all.length;i++){
		var id_name = all[i];
		$($(".favorites-list #"+id_name).closest("li")).remove();	
	};	
	setTimeout(function(){
		alert("删除成功!");
	},400)
};

		function favoritesSelect(ele){
			$(ele).click(function(){
				$(".favorites-list").children("div").css("height","auto")
				var content=$(this).next().text();
				if($(this).prop("checked")){
					$(this).siblings(".selectInput").attr("disabled","disabled");
					$(".favorites-list-link .tag span").each(function(){
						if(content==$(this).text()){
							$(this).parents("li").find("input").prop("checked",true);
						}
					});
					$(".favorites-list").find("input:not(:checked)").parents("li").hide()
				}else{
					$(this).siblings(".selectInput").removeAttr("disabled","disabled");
					$(".favorites-list-link .tag span").each(function(){
						if(content==$(this).text()){
							$(this).parents("li").find("input").prop("checked",false);
						}
					});
					$(".favorites-list").find("input:not(:checked)").parents("li").show()
				}
			})	
		}

//4.评论部分===================================
var all_favorite_flag = 0;
var all_comment_flag = 0;
$(function(){
	//1.加载所有收藏的信息
	//返回的数据
	var data = 
	{
    "total": "2",
    "rows": [
        {
            "news_id": "c1",
            "url": "www.baidu.com",
            "comment": "werthj1",
            "create_time": "2016-11-30 23:47:19",
            "cat_id": "01",
            "cat_name": "DNA",
            "title": "dna产品",
            "pubtime": "2016-11-08 12:14:18"
        },
        {
            "news_id": "c2",
            "url": "www.baidu.com",
            "comment": "werthj2",
            "create_time": "2016-11-30 23:47:19",
            "cat_id": "02",
            "cat_name": "DNA",
            "title": "dna产品",
            "pubtime": "2016-11-08 12:14:18"
        },
        {
            "news_id": "c3",
            "url": "www.baidu.com",
            "comment": "werthj3",
            "create_time": "2016-11-30 23:47:19",
            "cat_id": "01",
            "cat_name": "DNA",
            "title": "dna产品",
            "pubtime": "2016-11-08 12:14:18"
        },
        {
            "news_id": "c4",
            "url": "www.baidu.com",
            "comment": "werthj4",
            "create_time": "2016-11-30 23:47:19",
            "cat_id": "02",
            "cat_name": "DNA",
            "title": "dna产品",
            "pubtime": "2016-11-08 12:14:18"
        }
    ]
}
	data = data.rows;
	for(var i=0;i<data.length;i++){
		var id =  data[i].news_id;
		var url = data[i].url;
		var title  = data[i].title;
		var cat_id = data[i].cat_id;
		var cat_name = data[i].cat_name;
		var pubtime = data[i].pubtime;
		var comment = data[i].comment;

		if(cat_id == "01"){
			cat_id = "前沿研究";

		}else{
			cat_id = "市场动态";
		};
		var item = '<li><div class="checked"><input type="checkbox" name="'+id+'" id="'+id+'"></div><div class="comment-list-link"><a href="'+url+'" title="'+title+'"><div class="tag"><span>'+cat_id+'</span></div><h3>'+title+'</h3><h3 class="comment-info">'+comment+'</h3><p>2016.09.19</p></a></div></li>';
		$(".comment-list ul").append(item);
	};
	//2.全选
	
	$("#all_comment").click(function(){
		var all_select =  $(".comment-list li input");
		if(all_comment_flag == 0){
			
			for(var i=0;i<all_select.length;i++){
				var s_item = $(all_select[i]);
				if(s_item.is(":checked") == false){
					s_item.prop("checked",true);
				};
			};
			all_comment_flag = 1;
		}else{
			
			for(var i=0;i<all_select.length;i++){
				var s_item = $(all_select[i]);
				if(s_item.is(":checked") == true){
					s_item.prop("checked",false);
				};
			};
			all_comment_flag = 0;
		};
	});

	//3.删除
	$("#comment_delete").click(function(){
		//向后传id
		var ids = "";
		var all_select =  $(".comment-list li input");
		for(var i=0;i<all_select.length;i++){
				var s_item = $(all_select[i]);
				if(s_item.is(":checked") == true){
					if(ids==""){
						ids += s_item.attr("id");
					}else{
						ids += ","+s_item.attr("id");
					}	
				};
			};
		myAjax("json/t1.json",{id:ids},c_d_c);
	});
	commentSelect($("#commentStudy"));
	commentSelect($("#commentMarket"));
});
//删除评论后执行的函数
function c_d_c(a,old){
	var all = old.id.split(",");
	for(var i=0;i<all.length;i++){
		var id_name = all[i];
		$($(".comment-list #"+id_name).closest("li")).remove();
	};
	setTimeout(function(){
		alert("删除成功!");
	},400)
};

		//删选前沿研究或者市场动态
		function commentSelect(ele){
			$(ele).click(function(){
				$(".comment-list").children("div").css("height","auto")
				var content=$(this).next().text();
				if($(this).prop("checked")){
					$(this).siblings(".selectInput").attr("disabled","disabled");
					$(".comment-list-link .tag span").each(function(){
						if(content==$(this).text()){
							$(this).parents("li").find("input").prop("checked",true);
						}
					});
					$(".comment-list").find("input:not(:checked)").parents("li").hide()
				}else{
					$(this).siblings(".selectInput").removeAttr("disabled","disabled");
					$(".comment-list-link  .tag span").each(function(){
						if(content==$(this).text()){
							$(this).parents("li").find("input").prop("checked",false);
						}
					});
					$(".comment-list").find("input:not(:checked)").parents("li").show()
				}
			})	
		}
//-------------------------------------------函数------------------------------

//清空表格参数
function clearForm(formId){
	var allFormParams = $("#"+formId).serializeArray()  //所有表单中的数据
	for(var i=0;i<allFormParams.length;i++){				
		var key = allFormParams[i]["name"];
		$("#"+formId +" ."+key).val("");
	};
};
//数据传输
function submitData(url,table,ck_num,modal,form){
	var  options={  dataType:'json',
					url:url, //请求url    陈向伟
					success:function(data) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
							$("#"+table).bootstrapTable('refresh');      //刷新
							$("#"+ck_num).text(0);
				    		alert(data['data']);
				    	}else{
							$("#"+table).bootstrapTable('refresh');
							$("#"+ck_num).text(0);	
							$('#'+modal).modal('hide');
							alert("提交成功！");						
				    	}
					},
					error:function(XMLHttpRequest) {
				       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   	
					}
	};
	//使用jquery form进行提交
	$("#"+form).submit(function(){
		$(this).ajaxSubmit(options);
		return false;
	});
};

//任务的状态
function jobState(index, row) {
	if ( row.type == "sys"){
		return '<button class="btn btn-danger btn-xs" style="width:100px;">通知</button>';
	}else{
		if ( row.flag == "succeeded"){
			return  '<button class="btn btn-primary btn-xs" style="width:100px;">任务完成</button>';
		}
		if ( row.flag ==  "failed"){
			return '<button class="btn btn-warning btn-xs" style="width:100px;">任务中断</button>';
		}
	}
   
};

//点击具体任务跳转链接 linkJobDetial
function linkNewsDetial(name,row) {
	var newsId = row.id;
	//console.log(typeof(newsId))
	var str = "'"+newsId+"'"
	//console.log(str)
	if(row.status=='0'){
		return '<a href="#"  onclick="showNews('+str+',\'yes\')" id="'+newsId+'">'+ name +'</a>'
	}else{
		return '<a href="#" style="color: #781173" onclick="showNews('+str+',\'no\')" id="'+newsId+'">'+ name +'</a>'
	}
};

function showNews(id, bmark){
	//是否更改标记
	if(bmark=='yes'){
		$("#"+id).css('color','#781173');
		$("#"+id).attr('onclick', "showNews('"+id+"','no')")
	}
	
		$.ajax({
				    url:'/sodadev/Home/Notice/getNoticeInfo/bmark/'+bmark,     
				    type:'post',
				    data:{id:id},
				    dataType: "json",
				    success:function(data,textStatus) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
				    		alert(data['data']);
				    	}else{
				    		data = data['data'];
				    		d=data;
							$('#newsDetial').modal('show');
							$("#infoTitle").html("名称：" + data.title);
							$("#infoSender").html("发送人：" + data.name);
							$("#infoTime").html("发送时间：" + data.send_time);
							infoDe = data.content.replace(/\n/gm,"")
							$("#infoDetial").html(infoDe);
							if(bmark=='yes'){
								navInterval();
							}
				    	}
				   	  },    
				    error : function(XMLHttpRequest) {
				       	alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				     }
				}); 
	
	};


//表格中的中文显示
function daytime_style(mark) {
	return mark+"天";
}
function longtext_style(mark) {
	return mark+"G";
}

function payment_style(mark) {
	return '<span style="width:100%;background-color:#d70302;color:#fff;">￥'+mark+'</span>';
}

function status_style(mark) {
	return '<span style="width:100%;color:#d70302;">'+mark+'</span>';
}
function goods_attr_style(mark) {
	if(mark == "hot"){
		return "热存储";
	}else{
		return "冷存储";
	}
}
function id_style(mark) {
	return '<span style="width:100%;background-color:#218ae5;color:#fff;">'+mark+'</span>';
}
