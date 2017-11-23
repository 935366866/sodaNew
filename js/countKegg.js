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
/*-----------------kegg页面js代码------------------*/
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

	var keggValue=defaultRefParams["KEGG"][0]["value"];
	var value = keggValue.split(";")
	var opts = ""
	for(var j = 0; j < value.length; j++) {
		var tmpArr = value[j].split(',');
		if(tmpArr!=""){
			if(tmpArr.length < 2) {
				tmpArr[1] = tmpArr[0];
			}
			opts += '<option value="' + tmpArr[0] + '">' + tmpArr[1] + '</option>'; //给option添加一个value
		}
		
	};
	//添加dropdown的代码
	$("#keggAbb").append(opts);
	
	/*轮播图片初始化*/
    $("#KeggCarousel").jCarouselLite({
        btnNext: ".default #keggNext",
        btnPrev: ".default #KeggPrev",
        visible: 1,
        speed: 800
    });
    function statusUpdate(){
    	$.ajax({
				url:'json/taskDetail.2.json',  
				type:'get',
				dataType: "json",
				success:function(data) {
					$('#modStatusTable').bootstrapTable('load',data["modStatus"]);
				},
				error : function(XMLHttpRequest) {
				   alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
				}
			})

    }
	/*打开任务状态不断更新数据*/
	var setInt;
	$('a[href="#KEGGStatus"]').on('show.bs.tab', function (e) {
		statusUpdate();
		setInt=window.setInterval(statusUpdate,5000)
	})
	/*关闭任务状态不更新数据*/
	$('a[href="#KEGGStatus"]').on('hide.bs.tab', function (e) {
		window.clearInterval(setInt)
	})
	var compareData=null;
	//提交参数
	$("#submit_paras").click(function(){
		var formData =  allParams($("#parameter"));//取form表单参数
		if(formData.dgfInput==""){
			alert("请选择输出目录！");
		}else if(formData.input==""){
			alert("请选择输入文件！");
		}else{
			var resultPara={
							"paras":formData
							}; 
						
			resultPara = JSON.stringify(resultPara);
			$.ajax({
				url: 'json/taskDetail.2.json',  
				type:'get',
				data:{parameter:resultPara},
				dataType: "json",
				success:function(data) {	
					var showData=data["show"];
					$("#KeggCarousel").empty();
					$("#KeggCarousel").append("<ul></ul>");
 					for(var i=0;i<showData.length;i++){
 						$("#KeggCarousel").find("ul").append("<li style='width: 455px;height: 460px;' ><a class='fancybox-effects-a' href='"+showData[i]+"' title='Lorem'><img style='width: 455px;height:460px;padding-right: 23px;' src='" + showData[i] +"' alt='' /></a></li>")
 					}
     				$("#KeggCarousel").jCarouselLite({
				        btnNext: ".default #keggNext",
				        btnPrev: ".default #KeggPrev",
				        visible: 1,
				        speed: 800
				    });
				    updateTable("listTable",data["list"])
				},    
				error : function(XMLHttpRequest) {
					alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);
				}
			});
		}
	});
});


/*-------------公共函数-------------------*/
	function updateTable(tableId,data){
		var head=data[0];
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
		$("#"+tableId).bootstrapTable(options);
		var tableData=[];
		for(var i=1;i<data.length;i++){
			var row=data[i];
			var rowObj={};
			for(var k=0;k<row.length;k++){
				rowObj[head[k]]=row[k];
			}
			tableData.push(rowObj);
		}
		$("#"+tableId).bootstrapTable('destroy');
		$("#"+tableId).bootstrapTable(options);
		if(tableData.length<1000){
			$("#"+tableId).bootstrapTable('load',tableData);
		}else{
			var tableDataTemp=tableData.slice(0,300);
			$("#"+tableId).bootstrapTable('load',tableDataTemp);
			setTimeout(function(){
				tableDataTemp=tableData.slice(300,tableData.length);
				$("#"+tableId).bootstrapTable('append',tableDataTemp);
			},500)
			
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

	$("#inputUrl").val(inputValue);
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
  		$("#inputUrl").val('/');
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