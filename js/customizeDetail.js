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
	var selectColor="rgb(56,190,237)";
	var unselectColor="lightgray";
	var arrowColor="rgb(100,100,100)";
	var nodeNameColor="rgb(255,255,255)";
	var nodeBorderColor="rgb(167,167,167)";
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
						nodeStatus[nodes["nodeName"]]=nodes["status"];
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
			
					//单击元素，直接获得 key
					diagram.addDiagramListener("ObjectSingleClicked",function(e) {
						if(nodeLockStatus == 1){
								var part = e.subject.part;
								var color = part.elt(0).fill;
								obj = part	
						     if(jQuery.inArray(obj.data.key, requiredNode) == -1 ){   //单击的节点不在必选的节点当中
								 if(color == selectColor){
									part.elt(0).fill = unselectColor;
									nodeStatus[obj.data.key] = 0;
									findChildren(obj,requiredNode);
									}
									
								if(color == unselectColor){
									part.elt(0).fill = selectColor;
									nodeStatus[obj.data.key] = 1;
									findParents(obj,requiredNode);
									}
							  };
						}else{
							alert("无法编辑，请先解锁模块")
						}
				   	});
					diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);	
					diagram.initialContentAlignment = go.Spot.Center; //整个图居中	
					
					var $=jQuery;
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
						if(nodeStatus[key]==1){
							$("#parasPanel").append('<div class="panel panel-default"  id="' + key + '"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#' + key + '" href="#' + key + '_panel_body">' + key + ' 参数设置</a></h4></div><div id="' + key + '_panel_body" class="panel-collapse collapse in"><div class="panel-body"><form class="form-horizontal" role="form"></form></div></div></div>');
							var paraDatas=data[key];
							addPara(paraDatas,key,seqType); //添加面板中的参数
						}
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
function addPara(paraDatas,key,seqType){
	debugger
	var data = paraDatas;
	for (var i=0; i < data.length; i++){   //遍历其中的许多参数
		if(data[i]["showType"]=="path_list"){
			var name = data[i]["para_name"];
			var id = data[i]["id"];
			var value = data[i]["para_value"];
			$("#" + key + " form").append('<div class="form-group"><label class="col-sm-3 control-label">' + name + '</label><div class="col-sm-7"><input type="text"  class="form-control" readonly id="'+ id +'" name="'+ id +'"></div></div>');	
			var htms="<div class='form-group'><div class='col-sm-8 col-sm-offset-2'><table id='sampleTable'></table><div style='width:360px;margin:0 auto;padding:40px 0;'></div></div>"
			$("#" + key + " form").append(htms);
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
				for(var i=0;i<sampleData.length;i++){
		  			var row=sampleData[i];
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
		  		for(var i=0;i<sampleData.length;i++){
		  			var row=sampleData[i];
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
			
		}else{
			var name = data[i]["para_name"];
			var id = data[i]["id"];
			var value = data[i]["para_value"];
			$("#" + key + " form").append('<div class="form-group"><label class="col-sm-3 control-label">' + name + '</label><div class="col-sm-7"><input type="text"  class="form-control" readonly id="'+ id +'" name="'+ id +'"></div></div>');	
			$("#" + id).val(value);
		}
	};					
	
};

