//------按钮们--------
//刷新
	$("#refresh").click(function(){
		window.location.reload();
    });
//终止
	$("#stop").click(function(){
		var r=confirm("您确定要终止该任务吗？");
		if(r==true){
			 var id = $("#taskId").val();
			 $.ajax({
				    url:stop_url,  
				    type:'post',
				    data:{id:id},
				    dataType: "json",
				    success:function(data) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
				    		alert(data['data']);
				    	}else{
							alert("任务终止成功！");	
							$(this).find("img").attr("src","img/start.svg") 
				    	};
				     },    
				     error : function(XMLHttpRequest) {
				       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				     }
				});  
		  };
    });    
//删除
	$("#delete").click(function(){
		var r=confirm("您确定要删除该任务吗？");
		if(r==true){

			 var id = $("#taskId").val();
			 $.ajax({
				    url:delete_url,  
				    type:'post',
				    data:{id:id},
				    dataType: "json",
				    success:function(data) {
				    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
				    		alert(data['data']);
				    	}else{
							alert("删除成功！");	
				    	};
				     },    
				     error : function(XMLHttpRequest) {
				       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				     }
				});  
		  };
    });
/*-----------------差异倍数页面js代码------------------*/
$(function(){
	$(".fancybox-effects-a").fancybox({
			width:500,
			height:500,
			helpers: {
				title : {
					type : 'outside'
				},
				overlay : {
					speedOut : 0
				}
			}
		});
	
	var compareData = null;
	var geneSet;
	$('a[href="#dgfGeneList"]').on('show.bs.tab', function (e) {
		updateTable("compareGroups","dgfGeneList",compareData);
	})
	
	/*轮播图片初始化*/
    $("#dgfCarousel").jCarouselLite({
        btnNext: ".default #dgfNext",
        btnPrev: ".default #dgfPrev",
        visible: 1,
        speed: 800
    });
    function statusUpdate(){
    	$.ajax({
				url:'json/taskDetail.2.json',  
				type:'get',
				dataType: "json",
				success:function(data) {
					$('#dgfmodStatusTable').bootstrapTable('load',data["modStatus"]);
				},
				error : function(XMLHttpRequest) {
				   alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				}
			})

    }
	/*打开任务状态不断更新数据*/
	var setInt;
	$('a[href="#dgfStatus"]').on('show.bs.tab', function (e) {
		statusUpdate();
		setInt=window.setInterval(statusUpdate,5000)
	})
	/*关闭任务状态不更新数据*/
	$('a[href="#dgfStatus"]').on('hide.bs.tab', function (e) {
		window.clearInterval(setInt)
	})
	/*生物学重复*/
	$('#isRepeat').on('changed.bs.select', function(e) {
		if(e.target.value){
			if(e.target.value=="no"){
				$("#sampleNames li").each(function(){
					var gname= $(this).text();
					var html='<div name="sampleGroup" class="ui-widget-content ui-state-default sampleGroup" style=border-radius:3px;><span class="ui-widget-header" style=font-size:18px;height:28px;border:none;background:none;display:inline-block;>'+gname+'</span><button class="ui-widget-header glyphicon glyphicon-remove pull-right closeBorder" style="opacity:0.2" ></button><ul class="sampleNames ui-helper-reset"><li class="list-group-item ui-widget-content ui-corner-tr ui-draggable" style="display: block;border:none;background:none; width: 90px;">'+gname+'</li></ul></div>';
					$(html).appendTo('#groupList');
					allgroups.push(gname);
					dragInit();
				})
			}else{
				$('#groupList').html("");
				allgroups=[];
			}
		}
	})
	
	
	$("#groupName").keydown(function(k){
		if(k.keyCode==13 ){
			addGroup();
		}
	});
	$("#addGroup").click(function(){
		addGroup();
	});
	$("#compareName").keydown(function(k){
		if(k.keyCode==13 ){
			addCompare();
		}
	});
	$("#addCompare").click(function(){
		addCompare();
	});
	$("#addVenn").click(function(){
		addVenn();
	});
	
	//提交参数
	$("#dgfSubmit_paras").click(function(){
		var formData =  allParams($("#dgfParameter"));//取form表单参数
		if(formData.dgfInput==""){
			alert("请选择输出目录！");
		}else if(formData.input==""){
			alert("请选择输入文件！");
		}else{
			if($("#dgfPValue").val()<0||$("#dgfPValue").val()>1){
				alert("p值大小必须大于等于0小于等于1！")
			}
			if($("#diffMultiple").val()<0){
				alert("差异倍数必须大于等于0！")
			}
			var groupCompareVenn={};	
			var groups =$('#groupList').find('div');
			var allGroupItems=[];
			if(groups.length>0){
				var groupSamples= {};
				for(var i=0; i<groups.length; i++){
					var sampleItems = $($(groups[i]).find('ul')[0]).find('li');
					if(sampleItems.length==0){
						continue;
					}			
					//组名
					var curGroup =$($(groups[i]).find('span')).text().replace(/(^\s*)|(\s*$)/g, "");  //空格开头或者结尾
					var curGroupSamples = new Array();
					for(var j=0; j < sampleItems.length ;j++){
						curGroupSamples.push($(sampleItems[j]).text().replace(/(^\s*)|(\s*$)/g, ""));
						allGroupItems.push($(sampleItems[j]).text().replace(/(^\s*)|(\s*$)/g, ""));
					}
					
					groupSamples[curGroup]= curGroupSamples;
				}
				groupCompareVenn['groupSamples']= groupSamples;
			}
		//检查数据
		//检查样本是否已全部分组，非强制
		var samples=$("#sampleNames").find('li');
		if(samples.length>0){
			for(var i=0;i<samples.length;i++){
				if(allGroupItems.indexOf(samples[i].innerText)==-1){
					if(confirm("发现有未分组的样品，确定不分组?")){
						break;
					}
				}
			}
		}
		//检查比较组
		debugger
		var compares = $('#compareList').find('div');
		if(compares.length>0){
			var compareGroups = {};
			for(var i=0; i<compares.length; i++){
				var groupItems = $($(compares[i]).find('ul')[0]).find('li');
				if(groupItems.length!=2){
					alert("分组数必须为2")
					continue;
				}
				//比较组名
				var curCompare = $($(compares[i]).find('span')).text().replace(/(^\s*)|(\s*$)/g, "");
				var curCompareGroups = new Array();
				for(var j=0; j<groupItems.length; j++){
					curCompareGroups.push($(groupItems[j]).text().replace(/(^\s*)|(\s*$)/g, ""));
				}
				compareGroups[curCompare] = curCompareGroups;
			}
			groupCompareVenn['compareGroups']= compareGroups;
		}else{
			alert("比较组不能为空！");
			return false;
		}
		//检查venn图
		var venns = $('#vennList').find('div');
		if(venns.length>0){
			var vennCompares={};
			for(var i=0; i<venns.length; i++){
				var compareItems = $($(venns[i]).find('ul')[0]).find('li');
				if(compareItems.length==0){
					continue;
				}
				
				//比较韦恩图
				var curVennCompares = $($(venns[i]).find('span')).text().replace(/(^\s*)|(\s*$)/g, "");
				var curVennGroups = new Array();
				for(var j=0; j<compareItems.length; j++){
					curVennGroups.push($(compareItems[j]).text().replace(/(^\s*)|(\s*$)/g, ""));
				}
				vennCompares[curVennCompares] = curVennGroups;
			}
			groupCompareVenn['vennCompares'] = vennCompares;
		}
		
		//全部的参数	
		var samplesStr=""
		for(var j=0;j<samples.length;j++ ){  
			if(samplesStr == ""){
				samplesStr += samples[j].innerText;
				}
			else{
				samplesStr += ","+samples[j].innerText;
				}
		};

		var resultPara={
						"paras":formData,
						"samples":samplesStr,
						"groupCompareVenn":groupCompareVenn
						}; 
						
		resultPara = JSON.stringify(resultPara);
		console.log(resultPara)
			$.ajax({
				url: 'json/taskDetail.2.json',  
				type:'get',
				data:{parameter:resultPara},
				dataType: "json",
				success:function(data) {	
					var showData=data["show"];
					compareData=data["arr"];
					$("#dgfCarousel").empty();
					$("#dgfCarousel").append("<ul></ul>");
 					for(var i=0;i<showData.length;i++){
 						$("#dgfCarousel").find("ul").append("<li style='width: 455px;height: 460px;' ><a class='fancybox-effects-a' href='"+showData[i]+"' title='Lorem'><img style='width: 455px;height:460px;padding-right: 23px;' src='" + showData[i] +"' alt='' /></a></li>")
 					}
     				$("#dgfCarousel").jCarouselLite({
				        btnNext: ".default #dgfNext",
				        btnPrev: ".default #dgfPrev",
				        visible: 1,
				        speed: 800
				    });
				    $("#compareGroups").empty();
					for(var i=0;i<compareData.length;i++){
						var option="<option value="+compareData[i]["compareName"]+">"+compareData[i]["compareName"]+"</option>"
						$("#compareGroups").append(option);
					}
					$('#compareGroups').selectpicker('refresh');
					$('#compareGroups').on('changed.bs.select', function (e) {
						updateTable("compareGroups","dgfGeneList",compareData);
					});					
							
				},    
				error : function(XMLHttpRequest) {
					alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);
				}
			});
		}
	});
});

//初始化拖拽
function dragInit() {
	var $sampleNames = $( "#sampleNames" ),
    		$sampleGroup = $( ".sampleGroup" ),
    		$compareGroup = $(".goupCompare")
    		$venn = $(".venn");
	//样本拖动
	$( "li", $sampleNames ).draggable({
	      cancel: "a.ui-icon", // 点击一个图标不会启动拖拽
	      revert: "invalid", // 当未被放置时，条目会还原回它的初始位置
	      containment: "document",
	      helper: "clone",
	      cursor: "move"
	    });
	//分组拖动
	$( ".sampleGroup" ).draggable({
	    revert: "invalid", 
	    containment: "document",
	    helper: "clone",
	    cursor: "move"
	});
	
	//比较组拖动
	$(".goupCompare").draggable({
	      revert: "invalid", 
	      containment: "document",
	      helper: "clone",
	      cursor: "move"
	    });
	//维恩图接收比较组名
	$venn.droppable({
	      accept: "#compareList>div",
	      activeClass: "ui-state-highlight",
	      tolerance:"pointer",
	      drop: function( event, ui ) {
	        dropItem( ui.draggable ,$(this),'#333', 5);
	      }
	    });
	//比较组接收组名
	$compareGroup.droppable({
	      accept: ".sampleGroup",
	      activeClass: "ui-state-highlight",
	      tolerance:"pointer",
	      drop: function( event, ui ) {
	        dropItem( ui.draggable ,$(this),'#333',2);
	      }
	    });
	//分组接收样本
	var maxNum=$("#sampleNames li").length
	$sampleGroup.droppable({
	      accept: "#sampleNames > li, .sampleGroup li",
	      activeClass: "ui-state-highlight",
	      tolerance:"pointer",
	      drop: function( event, ui ) {
	        dropItem( ui.draggable ,$(this),'#333',maxNum);
	      }
	    });
	 if(maxNum>12){
	 	$("#sampleNames").css({
	 		height:'360px',
	 		overflow:'auto'
	 	})
	 }
	if($("#groupList .sampleGroup").length>12){
		$("#groupList").css({
	 		height:'360px',
	 		overflow:'auto'
	 	})
	}

	    curcontainer= null;
	    function dropItem($item ,$container,$color,maxNum){
	    	if($item.context.localName=='li'){
	    		var itemName = $item.text();
	    		var items = $container.find('li');
		    	if(items.length>=maxNum){
		    		alert("超出了最大允许数目"+maxNum);
		    		return false;
		    	}
		    	for (var i=0; i<items.length; i++){
		    		if($(items[i]).text()==itemName){
		    			alert("有重复的条目"+itemName+"！");
		    			return false;
		    		}
		    	}
	    		var $list = $( "ul", $container ).length ?$( "ul", $container ) :$( "<ul class='sampleNames ui-helper-reset'/>" ).appendTo($container);
			    $('<li class="list-group-item ui-widget-content ui-corner-tr ui-draggable" style="display: block;border:none;background:none; width: 90px;color:'+$color+'">'
		    	+itemName+'</li>').appendTo($list).fadeIn(function() {
		  	            $item
			              	.find( "img" )
			                .animate({ height: "36px" });
			          	});
			        
	    	}else{
	    		var itemName = $item.children("span").text();
		    	//遍历container查看已包含哪些元素
		    	var containItems= new Array();
		    	var items = $container.find('li');
		    	if(items.length>=maxNum){
		    		alert("超出了最大允许数目"+maxNum);
		    		return false;
		    	}
		    	
		    	for (var i=0; i<items.length; i++){
		    		if($(items[i]).text()==itemName){
		    			alert("有重复的条目"+itemName+"！");
		    			return false;
		    		}
		    	}
		    	
		    	var $list = $( "ul", $container ).length ?
			            $( "ul", $container ) :
			            $( "<ul class='goupCompare ui-helper-reset'/>" ).appendTo($container);
			    $('<li class="list-group-item ui-widget-content ui-corner-tr ui-draggable" style="display: block;border:none;background:none; width: 90px;color:'+$color+'">'
			    	+itemName+'</li>').appendTo($list).fadeIn(function() {
			            $item
			              .find( "img" )
			                .animate({ height: "36px" });
			         });
		    		
	    	}
	    }
	    
	    function recycleItem( $item ) {
	      $item.fadeOut(function() {
	        $item
	          .find( "a.ui-icon-refresh" )
	            .remove()
	          .end()
	          .css("background-color","#FFFFFF").css("border","1px solid #dddddd")
	          .find( "img" )
	            .css( "height", "72px" )
	          .end()
	          .appendTo( $sampleNames )
	          .fadeIn();
	      });
	    }
	    
	    $("#groupList .glyphicon-remove").each(function(){
			$(this).click(function(){
				$(this).parent('div').remove();
				var value=$(this).siblings("span").text();
				var index=$.inArray(value,allgroups);
				
				if(index==-1){
					return ;
				}
				allgroups.splice(index,1);
				
				$("#compareList").find("li").each(function(){
					if($(this).text()==value){
						$(this).remove();
					}
					
				})

				dragInit();
			})
		});
		$("#compareList .glyphicon-remove").each(function(){
			$(this).click(function(){
				$(this).parent('div').remove();
				var value=$(this).siblings("span").text();
				var index=$.inArray(value,allCompares);
				if(index==-1){
					return ;
				}
				
				$("#vennList").find("li").each(function(){
					if($(this).text()==value){
						$(this).remove();
					}
					
				})
				allCompares.splice(index,1);
			})
		});
		$("#vennList .glyphicon-remove").each(function(){
			$(this).click(function(){
				var value=$(this).siblings("span").text();
				var index=$.inArray(value,allVenns);
				if(index==-1){
					return ;
				}
				allVenns.splice(index,1);
				$(this).parent('div').remove();
			})
		});
};

var patrn=/^(\w){1,10}$/i; 
var allgroups = new Array();	//all groups
function addGroup(){
	var gname= $("#groupName").val();
	if(gname=='' ||gname==null){
		return false;
	}
    if (!patrn.exec(gname)) {
    	alert('只能包含字母数字下划线，长度不超过10');
		return false;
	}
	if(-1!=allgroups.indexOf(gname,0)){
		alert('分组名'+gname+"已存在！");
		return false;
	}
	if($('#sampleNames>li').length<=allgroups.length){
		alert("分组数不能超过样本数！");
		return false;
	}
	$("#groupName").val('');
	var html='<div name="sampleGroup" class="ui-widget-content ui-state-default sampleGroup" style=border-radius:3px;><span class="ui-widget-header" style=font-size:18px;height:28px;border:none;background:none;display:inline-block;>'+gname+'</span><button style=opacity:.2; class="ui-widget-header glyphicon glyphicon-remove pull-right closeBorder" ></button></div>';
	$(html).appendTo('#groupList');
	allgroups.push(gname);
	dragInit();
}

//增加比较组
var allCompares = new Array(); 
function addCompare(){
	if(allgroups.length <2){
		alert('此为组间比较，至少需要两个样本组，请先填写样本组信息！');
		return false;
	}

	var cname= $('#compareName').val();
	if (!patrn.exec(cname)) {
    	alert('只能包含字母数字下划线，长度不超过10');
		return false;
	}
	if(cname=='' ||cname==null){
		return false;
	}
	if(-1!=allCompares.indexOf(cname,0)){
		alert('比较组'+cname+"已存在！");
		return false;
	}
	$('#compareName').val('');
	var html='<div name="goupCompare" class="ui-widget-content ui-state-default goupCompare" style=border-radius:3px;><span class="ui-widget-header" style="font-size:18px;border:none;background:none;height:28px;display:inline-block;" >'+cname+'</span><button style=opacity:.2; class="ui-widget-header glyphicon glyphicon-remove pull-right closeBorder" ></button></div>';
	$(html).appendTo('#compareList');
	allCompares.push(cname);
	dragInit();
}
var allVenns = new Array(); 
function addVenn(){
	if(allCompares.length <2){
		alert("维恩图至少需要两个比较组，请先填写比较组信息！");
		return false;
	}
	var cname= $('#vennName').val();
	if (!patrn.exec(cname)) {
    	alert('只能包含字母数字下划线，长度不超过10');
		return false;
	}
	if(cname=='' ||cname==null){
		return false;
	}
	if(-1!=allVenns.indexOf(cname,0)){
		alert('维恩组'+cname+"已存在！");
		return false;
	}
	$('#vennName').val('');
	var html='<div name="venn" class="ui-widget-content ui-state-default venn" style=margin-left:10px;border-radius:3px;><span class="ui-widget-header" style="font-size:18px;border:none;background:none;height:28px;display:inline-block;" >'+cname+'</span><button style=opacity:.2; class="ui-widget-header glyphicon glyphicon-remove pull-right closeBorder" ></button></div>';

	$(html).appendTo('#vennList');
	allVenns.push(cname);
	dragInit();
}

/*-------------公共函数-------------------*/
function updateTable(selectId,tabPanelId,compareData){
		if(!compareData) return;
		var p=$("#"+selectId).selectpicker("val");
		for(var j=0;j<compareData.length;j++){
			if(p==compareData[j]["compareName"]){
				var content=compareData[j]['content'];
				var head=content[0];
				var options={
					clickToSelect:true,
					showFooter:false,
					classes:'table',
					columns: []
				}
				for(var m=0;m<head.length;m++){
					var obj={order: "asc"};
					obj["title"]=head[m];
					obj["field"]=head[m];
					options.columns.push(obj);
				}
				$("#"+tabPanelId+" table").bootstrapTable(options);
				var tableData=[];
				for(var i=1;i<content.length;i++){
					var row=content[i];
					var rowObj={};
					for(var k=0;k<row.length;k++){
						rowObj[head[k]]=row[k];
					}
					tableData.push(rowObj);
				}
				$("#"+tabPanelId+" table").bootstrapTable('destroy');
				$("#"+tabPanelId+" table").bootstrapTable(options);
				$("#"+tabPanelId+" table").bootstrapTable('load',tableData);
			}
		}
	}
//任务的状态
function taskState(State) {
	
    if ( State == 'done'){
			return  '<button class="btn btn-primary btn-xs" style="width:100px;">完成</button>';
		}else	if ( State == 'failed'){
			return '<button class="btn btn-warning btn-xs" style="width:100px;">中止</button>';
		}else if (State == 'ready'){
			return '<button class="btn  btn-xs" style="width:100px;">就绪/重运行</button>';
		}else if (State == 'pending'){
			return '<button class="btn btn-xs" style="width:100px;">等待中</button>';
		}
		else{
			return '<button class="btn btn-success btn-xs" style="width:100px;">运行中</button>';
		}
};	
	
//参数组装
function allParams(dom){
	var app = dom.serializeArray();
	var json1 = {};
	for(var i=0;i<app.length;i++){
			var name = app[i].name;
			var value = app[i].value;
			json1[name] = value;
	}
	return json1;
};

//-----------------------------------点击打开目录--------------------------------------------	
var samplesDataUrl = "json/jobUrl.json"; //像后台发送目录的地址
//打开任务目录
function opendir_path(id){
	var inputValue = $("#"+id).val();  //当前input的值
	$("#inputUrl").val(inputValue);
	$('#selectUrl').modal('show');
    $("#selected").attr("onClick","geturl('#"+id+"','dir')")
};
//打开任务目录
function openUrl(id,type){
	
	var inputValue = $(id).val();  //当前input的值
	if(inputValue=""){
		$("#inputUrl").val(inputValue);
	}
	
	$('#selectUrl').modal('show');

    $("#selected").attr("onClick","geturl('"+id+"','"+type+"')")   //给选择按钮添加事件

};

//选择目录时添加文件或者目录的图标
function addIcon(State, row) {
	var typeChr = row.type.charAt(0);
		
	if(typeChr == 'd'){
		return '<span class="glyphicon glyphicon-folder-open"></span>';
		}
	else{
		return '<span class="glyphicon glyphicon-file"></span> ';
		}
};
//当模态框加载完成后给input中添加当前用户的根目录
$(function(){
  dblCilck('jobUrlTable','inputUrl',samplesDataUrl);
  $('#selectUrl').on('shown.bs.modal', function () {    //模态框完全显示之后把根目录放入
//	      	$("#inputUrl").val("/home/agloom");
  	if($("#inputUrl").val()==''){
  		$("#inputUrl").val("/home/agloom");
  	}
  	checkUrl($("#inputUrl").val(), samplesDataUrl, 'inputUrl','jobUrlTable');
  });
});


//回车查目录是否存在
$(function(){
	$('#inputUrl').bind('keypress',function(event){
		if(event.keyCode == "13")    
		{
			newUrl = $("#inputUrl").val();
			checkUrl(newUrl,samplesDataUrl,"inputUrl","jobUrlTable"); //参数依次为需要检查的URL， 后台的地址， 需要更新的输入框id， 需要刷新的bootstrap table
		}
	});
//点击右边箭头，检查	
	$("#search").click(function(){  
    	  newUrl = $("#inputUrl").val();
		  checkUrl(newUrl,samplesDataUrl,"inputUrl","jobUrlTable");
    });  
//后退按钮
	$("#back").click(function(){  
    	   Url= $("#inputUrl").val();
		   
		   lastLen =Url.split('/').pop().length
		   newUrl = Url.substring(0,Url.length - lastLen-1);
		   checkUrl(newUrl,samplesDataUrl,"inputUrl","jobUrlTable");
    }); 
	
});
var samplesArr=[];
function uploadFile(url,uploadId,inputId,ddir){  
		dpath = '';
		if(typeof(ddir)!='undefined'|| ddir=='undefined' ||ddir==''){
			dpath = ddir;
		}
	    $('#'+uploadId).fileupload({
	        url: url,
	        dataType: 'json',
	        done: function (e, data) {   //设置文件上传完毕事件的回调函数  
				var status = data.status;
				if(status == "ERROR"){
					alert(data.data);
					}
				else{
					var url = data.data.url;
					$(inputId).val(url);    
					samplesArr = data.data.samples;
					samplesArr.shift();
					$("#sampleNames").empty();
					//样本分组初始化设置
					if(samplesArr.length>0){
						for(var i=0;i<samplesArr.length;i++){
							var name = samplesArr[i];
							add='<li class="list-group-item ui-widget-content ui-corner-tr">'+name+'</li>'
							$(add).appendTo('#sampleNames')
					
						};	
						dragInit();
					}
					alert("上传成功！");
					}
	        }
	    })
};	

//点击选择关闭模态框，将当前模态框input中的路径取出放入表单中,type 的类型 暂时有两种，dir和 file
function geturl(formInputId,type){
	var selected_num = checkedNum("jobUrlTable");
	if(type == "dir"){
		//只能选择文件夹，单选
		var newUrl = ""
		
		if(selected_num == 1){
			//此时选中了一项，判断是否是目录
			
			var singleName = ""   //选择一个文件夹或者文件的名字，单选
			$.map($('#jobUrlTable').bootstrapTable('getSelections'), function (row) {
				var d_f_type = "";
				d_f_type = row.type.charAt(0);
				if(d_f_type == "d"){
					singleName = row.name;
					newUrl = $("#inputUrl").val() + "/"+ singleName;    //点击选择时取input中当前的路径，在加上此时选择的
					newUrl = newUrl.replace('//','/');
					$("#selected").removeAttr("onClick");   //选择按钮
					$("#selectUrl").modal('hide');          //隐藏目录选择的模态框
					$(formInputId).val(newUrl);	
					if(formInputId == "#data_dir"){
						var sequencingType = $("#seq_type").val();
						$.ajax({
								url:samplesDataUrl,  
								type:'get',
								data:{url:newUrl},
								dataType: "json",
								success:function(data,textStatus) {
									if(data['status']=='ERROR'){    //请求成功但没有执行成功
										alert(data['data']);
									}else{
										var data1 = data['data'];

										objData = dataTableGet(data1,sequencingType);   //向后台传输数据，返回值组成Json
										
										$('#sampleTable').bootstrapTable('load',objData);  //填入table中	
									}
								},    
								error : function(XMLHttpRequest) {
									alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   
								}
						}); 
					
					};
				}else{
					alert("对不起，您选择的必须是目录文件！");
				
				};
						
			});
			
		
		}else if(selected_num == 0){
			//没有选中任何项，将此时的url传到前面

			newUrl = $("#inputUrl").val();    //点击选择时取input中当前的路径，在加上此时选择的
			newUrl = newUrl.replace('//','/');
			$("#selected").removeAttr("onClick");
			$("#selectUrl").modal('hide');
			$(formInputId).val(newUrl);

			var sequencingType = $("#seq_type").val();
			$.ajax({
					url:samplesDataUrl,  
					type:'get',
					data:{url:newUrl},
					dataType: "json",
					success:function(data,textStatus) {
						if(data['status']=='ERROR'){    //请求成功但没有执行成功
							alert(data['data']);
						}else{
							var data1 = data['data'];
							objData = dataTableGet(data1,sequencingType);   //向后台传输数据，返回值组成Json
							console.log(objData)
							$('#sampleTable').bootstrapTable('load',objData);  //填入table中
						}
					},    
					error : function(XMLHttpRequest) {
						alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   
					}
			}); 
		}
		else{
			//选择了多项，直接报错
			alert("对不起，只能选择一个目录文件！");
		};
		
	}
	else if(type == "file"){
		//只能选择文件，多选
		var newUrl = ""
		var files = [];
		var have_dir = 0
		$.map($('#jobUrlTable').bootstrapTable('getSelections'), function (row) {
			var d_f_type = "";
			d_f_type = row.type.charAt(0);
			if(d_f_type == "d"){
				have_dir = 1;
			}else{
				files.push(row.name);
			}
			
		});
		if(have_dir == 1){
			alert("对不起，不能选择文件夹，只能选择文件！");
		}else{
			if(files.length == 0){
				alert("请选择文件！")
			}else{
				
				//获得当前的目录，取消绑定，关闭模态框
				var filename_now = '/'+ $('#jobUrlTable').bootstrapTable('getSelections')[0].name;
				newUrl = $("#inputUrl").val()+filename_now;
				newUrl = newUrl.replace('//','/');	
				$.ajax({
						url:"json/uploadTable.json",  
						type:'get',
						data:{url:newUrl},
						dataType: "json",
						success:function(data,textStatus) {
							if(data['status']=='ERROR'){    //请求成功但没有执行成功
								alert(data['data']);
							}else{
								var data1 = data['data'];
								var samples=data1["samples"];
								samplesArr=samples;
								samplesArr.shift();
								$("#sampleNames").empty();
								//样本分组初始化设置
								if(samplesArr.length>0){
									for(var i=0;i<samplesArr.length;i++){
										var name = samplesArr[i];
										add='<li class="list-group-item ui-widget-content ui-corner-tr">'+name+'</li>'
										$(add).appendTo('#sampleNames')
								
									};	
									dragInit();
								}
							}
						},    
						error : function(XMLHttpRequest) {
							alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   
						}
				}); 
				$("#selected").removeAttr("onClick");
				$("#selectUrl").modal('hide');
				$(formInputId).val(newUrl);				
			};
		};

	}
	else{
		return false;
	}

};