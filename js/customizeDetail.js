var nodeStatus={};  //判断是否是草稿，加载任务参数填写时option的值
var seqType;
$(function(){
		//波波，这是删除，终止和重跑的地址
    var delete_url = "";
    var stop_url = "";
	var rerun_url = "";

	//与后台交互时冻结
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);

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
    $(".main_nav3_left_report li").click(function(){
    	$(this).children("span").css("background",'#13438B').children("a").css("color","#fff");
    	$(this).siblings("li").children("span").css("background",'#fff').children("a").css("color","#777");
    })
    //深度挖掘
    $("#deepBtn").click(function(){
    	window.location.href= "deepExcavation.html";
    })
	//rerun
	$("#taskRerun").click(function(){
		$(this).parent("span").css("background","#13438B").children("a").css("color","#fff");
		var r=confirm("您确定要rerun该任务吗？");
		if (r==true)
			{
				var id = $("#taskId").val();
				$.ajax({
					url:rerun_url,    //甄伟波，rerun的地址  
					type:'post',
					data:{id:id},
					dataType: "json",
					success:function(data) {
						if(data['status']=='ERROR'){    //请求成功但没有执行成功
							alert(data['data']);
						}else{
							alert("rerun成功！");	
						}
						},    
						error : function(XMLHttpRequest) {
						alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
						}
				});  
			};
	});
	
	getTaskData("json/customizeDetail.json");
	
});

function openSftp(user,ip,port, eid){
	window.open('sftp://'+user+'@'+ip+':'+port+$("#"+eid).text());
}
	
function stopTask(taskid){
	if (typeof(taskStatus)=='undefined' || taskStatus == 'finished' || taskStatus =='failed' ){
		return false;
	}
	
	if(!confirm("您确定要终止任务吗？")){
		return false;
	}
	
	$.ajax({
		url:"__MODULE__/Task/stopTasks",
		type:'post',
		data:{id:taskid},
		dataType: "json",
		success:function(data){
			if(data['status']=='SUCCESS'){    
	    		$("#taskStatus").removeClass('btn-primary').addClass("btn-warning").text("任务已终止");
	    	}
			alert(data['data']);
			window.location.reload();
		},
		error : function(XMLHttpRequest) {
	       	alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   
	    }
	});
}

function getTaskData(url){
	var nodeDataArray=[];  //节点名称及坐标
	var linkDataArray=[]	//连线节点
	var requiredColor="#13438b";
	var unselectColor="lightgray";
	var selectColor="rgb(142,217,255)";
	var runningColor="rgb(68,157,68)";
	var failedColor="rgb(255,0,0)"
	var arrowColor="rgb(100,100,100)";
	var nodeNameColor="rgb(255,255,255)";
	var nodeBorderColor="rgb(167,167,167)";
	var okColor="rgb(19,67,139)";
	$.ajax({
			url:url,  
			type:'get',
			dataType: "json",
			success:function(data) {
				if(data['status']=='ERROR'){    //请求成功但没有执行成功
					alert(data['data']);
				}else{
					/*模块节点设置*/
					var  requiredNode=data.data["requiredNode"];//必选模块
					var moduleDatas=data.data["processModule"];
					for(var i=0;i<moduleDatas.length;i++){
						var nodes=moduleDatas[i];
						nodeDataArray.push({key:nodes["nodeName"],
											loc:nodes["loc"]
											}
										)
						if(nodes["linkData"].length>0){
							for(var j=0;j<nodes["linkData"].length;j++){
								var obj={from:nodes["nodeName"],to:nodes["linkData"][j]["name"],curviness:nodes["linkData"][j]["curviness"]};
								linkDataArray.push(obj)
							}
						}
					}
	
					var $ = go.GraphObject.make;  
					diagram =
				      $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
				        {
				          initialContentAlignment: go.Spot.Center,
				          allowDrop: false,  // must be true to accept drops from the Palette
				          "animationManager.duration": 800, // slightly longer than default (600ms) animation
				          "undoManager.isEnabled": false  // enable undo & redo
				        }
				       );
					
					//节点的样式
					diagram.nodeTemplate =
						$(go.Node, "Auto",
							new go.Binding("location", "loc", go.Point.parse),
							$(go.Shape, "RoundedRectangle", 
								{ fill: selectColor ,
							  	parameter1: 5,  // the corner has a large radius
							  	stroke:nodeBorderColor,
								},
								new go.Binding("fill", "color")
							),
							{
								selectionAdornmentTemplate:
								$(go.Adornment, "Auto",
									$(go.Shape, "RoundedRectangle",
									{ fill: null, stroke: selectColor, strokeWidth: 1 }),
									$(go.Placeholder)
								)  // end Adornment
							},
							$(go.TextBlock,
								{ font: "bold 14px sans-serif",
								stroke: nodeNameColor,
								margin: 10 },
								new go.Binding("text", "key")
							)
						);
								
					//连线的样式
				   	diagram.linkTemplate =
					  $(go.Link,  
						{ curve: go.Link.Bezier, reshapable: true },
						// don't need to save Link.points, so don't need TwoWay Binding on "points"
						new go.Binding("curviness", "curviness").makeTwoWay(),  // but save "curviness" automatically
						$(go.Shape,  // the link shape
						  { strokeWidth: 2 ,stroke:arrowColor }),
						$(go.Shape,  // the arrowhead
						  { toArrow: "standard", stroke: null, fill:arrowColor })
						
					  );  

					diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);	
					diagram.initialContentAlignment = go.Spot.Center; //整个图居中	

					var $=jQuery;
					var status=data.data["status"];
					if(status == "finished"){
						$("#showReport").attr("onclick","window.open('__MODULE__/Report/showReport/id/{$id}')");
						$("#downloadReport").attr("onclick","window.open('__MODULE__/Report/downReport/id/{$id}')");
						$("#taskStatus").removeClass("btn-success");
						$("#taskStatus").addClass("btn-primary").text('任务已完成');								
					}else if(status == "failed"){
						$("#taskStatus").addClass("btn-warning").text('任务已终止');
						$("#showReport").css("background","#ccc");
						$("#downloadReport").css("background","#ccc");
						$("#taskReport h4").after('<p>任务终止，报告未生成。</p>');
					}
					else{
						$("#taskStatus").addClass("btn-success").text('任务运行中');
						$("#showReport").css("background","#ccc");
						$("#downloadReport").css("background","#ccc");
						$("#taskReport h4").after('<p>报告尚未生成，请耐心等待</p>');
					}
					
					var unselectNode=data.data["unselectNodes"];
					for(var i=0;i<unselectNode.length;i++){
						if(!diagram.findNodeForKey(unselectNode[i])){
							continue;
						}
						diagram.findNodeForKey(unselectNode[i]).elt(0).fill=unselectColor;	//未选中模块变成灰色
						nodeStatus[unselectNode[i]] = 0;
					};
					/*运行中模块*/
					var runMod = data.data["runMod"];
					if(runMod!=""){
						diagram.findNodeForKey(runMod).elt(0).fill=runningColor;	//运行中模块变成绿色
					}
						
					/*运行失败模块*/
					var failedMod =data.data["failedMod"];
					for(var i=0;i<failedMod.length;i++){
						if(!diagram.findNodeForKey(failedMod[i])){
							continue;
						}
						diagram.findNodeForKey(failedMod[i]).elt(0).fill=failedColor;	//失败模块变成红色
					};
					/*运行完成模块*/
					var finishedMod = data.data["finishedMod"];
					for(var i=0;i<finishedMod.length;i++){
						if(!diagram.findNodeForKey(finishedMod[i])){
							continue;
						}
						diagram.findNodeForKey(finishedMod[i]).elt(0).fill=okColor;	//运行中模块变成绿色
					};
					$('#modStatusTable').bootstrapTable('load',data.data["modStatus"]);
					var flowName=data.data["flowName"];
					$("#flowName").text(flowName);
					$("#flowName").text(flowName);
					for(var key in data.data["flowData"]){
						if(key!="module"){
							$("#"+key).val(data.data["flowData"][key])
						}
					}
					seqType=data.data["seq_type"];
					var data=data.data["flowData"]["module"];
					for(var key in data){
						$("#parasPanel").append('<div class="panel panel-default"  id="' + key + '"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#' + key + '" href="#' + key + '_panel_body">' + key + ' 参数设置</a></h4></div><div id="' + key + '_panel_body" class="panel-collapse collapse in"><div class="panel-body"><form class="form-horizontal" role="form"></form></div></div></div>');
						var paraDatas=data[key];
						addPara(paraDatas,key,seqType); //添加面板中的参数
					};	
				};
			 },   
			 error : function(XMLHttpRequest) {
			   alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
			 }
		}); 
	};


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
	


//各种默认参数的url
var nodeParaUrl="__MODULE__/Task/getTaskInfo/id/{$id}";  // 节点参数的默认值的url
var samplesDataUrl = "__MODULE__/Data/remoteDirView"; //像后台发送目录的地址


//在参数设置中 给node名字为key的模块 添加input或dropdown参数
function addPara(paraDatas,keyId,seqType){
	var data = paraDatas;
	for (var i=0; i < data.length; i++){   //遍历其中的许多参数
		if(data[i]["showType"]=="path_list"){
			var name = data[i]["para_name"];
			var id = data[i]["id"];
			var value = data[i]["para_value"];
			$("#" + keyId + " form").append('<div class="form-group"><label class="col-sm-3 control-label">' + name + '</label><div class="col-sm-7"><input type="text"  class="form-control" readonly id="'+ id +'" name="'+ id +'"></div></div>');	
			var htms="<div class='form-group'><div class='col-sm-8 col-sm-offset-2'><table id='sampleTable'></table></div>"
			$("#" + keyId + " form").append(htms);
			var sampleData=data[i]["tableData"];
			var tableData=[];
			if(seqType == "SE"){    //判断是双端   （注意：必须是PE）
				var options={
					toolbar:"#toolbar",
					clickToSelect:true,
					showFooter:false,
					classes:'table',
					height:"250",
					columns: [   
				        {align: "left", field: "sample", order: "asc",editable:{type:'text'}, title: "样本名称 "},
				        {align: "center", field: "fq1", order: "asc", title: "FastQ文件 "}
			      	]
				}
				
				$('#sampleTable').bootstrapTable(options);
				var option=$('#sampleTable').bootstrapTable("getOptions");
				option.columns=[{
					align: "left",
					field: "sample", 
					order: "asc",
					title: "样本名称"
				},{
					align: "center", field: "fq", order: "asc", title: "FastQ文件 "
				}];
				$('#sampleTable').bootstrapTable('destroy');
				$('#sampleTable').bootstrapTable(option);
		  		$('#sampleTable').bootstrapTable("resetView");
				for(var j=0;j<sampleData.length;j++){
		  			var row=sampleData[j];
		  			var tableRow={};
		  			for(var key in row){
		  				tableRow["sample"]=key;
		  				tableRow["fq"]=row[key][0];
		  			}
		  			tableData.push(tableRow)
		  		}
			}else{
				var options={
					toolbar:"#toolbar",
					clickToSelect:true,
					showFooter:false,
					classes:'table',
					height:"250",
					columns: [   
				        {align: "left", field: "sample", order: "asc",editable:{type:'text'}, title: "样本名称 "},
				        {align: "center", field: "fq1", order: "asc", title: "FastQ1文件 "},
				        {align: "center", field: "fq2", order: "asc", title: "FastQ2文件 "}
			      	]
				}
					
				$('#sampleTable').bootstrapTable(options);
				var option=$('#sampleTable').bootstrapTable("getOptions");
				option.columns=[{
					align: "left",
					field: "sample", 
					order: "asc",
					title: "样本名称"
				},{
					align: "center", field: "fq1", order: "asc", title: "FastQ1文件 "
				},{
					align: "center", field: "fq2", order: "asc", title: "FastQ2文件 "
				}];
				$('#sampleTable').bootstrapTable('destroy');
				$('#sampleTable').bootstrapTable(option);
		  		$('#sampleTable').bootstrapTable("resetView");
		  		for(var k=0;k<sampleData.length;k++){
		  			var row=sampleData[k];
		  			var tableRow={};
		  			for(var key in row){
		  				tableRow["sample"]=key;
		  				tableRow["fq1"]=row[key][0];
		  				tableRow["fq2"]=row[key][1];
		  			}
		  			tableData.push(tableRow)
		  		}

			};

			$('#sampleTable').bootstrapTable('load',tableData);   //载入数据
			$("#" + id).val(value);
		}else if(data[i]["showType"]=="sampleGroup"){
			var name = paraDatas[i]["para_name"];
			var id = paraDatas[i]["id"];
			var value = paraDatas[i]["para_value"];
			$("#" + keyId + " form").append('<div class="form-group"><div style="margin-bottom:42px"><label class="col-sm-3 control-label">' + name + '</label></div><div><div class="col-sm-8 col-sm-offset-2"><div class="panel panel-default"><div class="panel-heading" style="height: 40px"><p class="col-sm-3"><strong>样本名称</strong></p><p class="col-sm-3"><strong>Group</strong></p><p class="col-sm-3"><strong>Compare</strong></p><p class="col-sm-3"><strong>Venn</strong></p></div><div class="panel-body"><div id="samplesSelected" class="col-sm-3"></div><div id="Group" class="col-sm-3"></div><div id="Compare" class="col-sm-3"></div><div id="Venn" class="col-sm-3"></div></div></div></div></div></div>');		
			var samplesArray=value['samples'];
			if(samplesArray!=undefined&&samplesArray.length>0){
				for(var j=0;j<samplesArray.length;j++){
					var name = samplesArray[j];
					add='<li class="list-group-item ui-widget-content ui-corner-tr">'+name+'</li>'
					$(add).appendTo('#samplesSelected')
				};	
			}
			var groupsObg = value['groupSamples'];
			if(groupsObg){
				for(key in groupsObg){
					var html='<div name="sampleGroup" class="ui-widget-content ui-state-default sampleGroup" style=border-radius:3px;><span class="ui-widget-header" style=font-size:18px;height:28px;border:none;background:none;display:inline-block;>'+key+'</span><ul class="sampleNames ui-helper-reset"/></ul></div>';
					var divHtml = $(html);
					for(var j=0;j<groupsObg[key].length;j++){
						var sample=groupsObg[key][j];
						var liHtml=$('<li class="list-group-item ui-widget-content ui-corner-tr ui-draggable" style="display: block;border:none;background:none; width: 90px;">'
					    	+sample+'</li>');
					  liHtml.appendTo(divHtml.find("ul"))
						
					}
					divHtml.appendTo('#Group');
				}
			}
			var compareObg = value["compareGroups"];
			if(compareObg){
				for(key in compareObg){
					var html='<div name="goupCompare" class="ui-widget-content ui-state-default goupCompare" style=border-radius:3px;><span class="ui-widget-header" style=font-size:18px;height:28px;border:none;background:none;display:inline-block;>'+key+'</span><ul class="goupCompare ui-helper-reset"/></ul></div>';
					var divHtml = $(html);
					for(var j=0;j<compareObg[key].length;j++){
						var sample=compareObg[key][j];
						var liHtml=$('<li class="list-group-item ui-widget-content ui-corner-tr ui-draggable" style="display: block;border:none;background:none; width: 90px;">'
					    	+sample+'</li>');
					  liHtml.appendTo(divHtml.find("ul"))
						
					}
					divHtml.appendTo('#Compare');
				}
			}
			var vennObg = value['vennCompares'];
			if(vennObg){
				for(key in vennObg){
					var html='<div name="venn" class="ui-widget-content ui-state-default venn" style=border-radius:3px;><span class="ui-widget-header" style=font-size:18px;height:28px;border:none;background:none;display:inline-block;>'+key+'</span><ul class="goupCompare ui-helper-reset"/></ul></div>';
					var divHtml = $(html);
					for(var j=0;j<vennObg[key].length;j++){
						var sample=vennObg[key][j];
						var liHtml=$('<li class="list-group-item ui-widget-content ui-corner-tr ui-draggable" style="display: block;border:none;background:none; width: 90px;">'
					    	+sample+'</li>');
					  liHtml.appendTo(divHtml.find("ul"))
						
					}
					divHtml.appendTo('#Venn');
				}
			}
		}else if(data[i]["showType"]=="sampleSel"){
			var name = paraDatas[i]["para_name"];
			var id = paraDatas[i]["id"];
			var value = paraDatas[i]["para_value"];
			$("#" + keyId + " form").append('<div class="form-group"><label class="col-sm-3 control-label">' + name + '</label><div class="col-sm-7"><div class="panel panel-default"><div class="panel-body" id="samplePanel"></div></div></div></div>');		
			console.log(value)
			for(var key in value){
				var html='<div class="form-group"><lable class="col-sm-3 control-label">'+key+'</lable><div class="col-sm-7"><input class="form-control" value='+value[key]+'></div></div>'
				$("#samplePanel").append(html);
			}
		}else{
			var name = data[i]["para_name"];
			var id = data[i]["id"];
			var value = data[i]["para_value"];
			$("#" + keyId + " form").append('<div class="form-group"><label class="col-sm-3 control-label">' + name + '</label><div class="col-sm-7"><input type="text"  class="form-control" readonly id="'+ id +'" name="'+ id +'"></div></div>');	
			$("#" + id).val(value);
		}
	};					
	
};

