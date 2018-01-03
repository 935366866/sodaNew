//各种默认参数的url
var nodeParaUrl="json/draft.json";  // 节点参数的默认值的url
var samplesDataUrl = "json/jobUrl.json"; //像后台发送目录的地址
var nodeLockStatus=1  //可编辑
var nodeStatus={};  //判断是否是草稿，加载任务参数填写时option的值
var flowType;
var defaultRefParams;
var requiredColor="#13438b";
var selectColor="rgb(56,190,237)";
var unselectColor="lightgray";
var arrowColor="rgb(100,100,100)";
var nodeNameColor="rgb(255,255,255)";
var nodeBorderColor="rgb(167,167,167)";
var ids=[];
var idObj={};
$(function(){
	//blockUI，请求失败提示
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	var nodeDataArray=[];  //节点名称及坐标
	var linkDataArray=[]	//连线节点
	$.ajax({
		url:"json/ajaxModule.json",  
		type:'get',
		async: false,
		dataType: "json",
		success:function(data,status) {
			if(status=="success"){  
				var $=jQuery;
				/*流程头部设置*/
				var flowHead=data.data["flowHead"];
//				$("#flowHead").addClass(flowHead["style"]);
				$("#flowHead").css("background-color",flowHead["style"]);
				$("#flowHead>p").text(flowHead["flow_tile"]);
				$("#flowHead>button").on("click",function(){
					window.location.href='../barDraw.html'
				})
				/*提交设置*/
				var src=data.data["submitPic"];
				$("#taskRun img").attr("src",src);
				debugger
				/*模块节点设置*/
				var  requiredNode=data.data["requiredNode"];//必选模块
				var moduleDatas=data.data["processModule"];
				for(var i=0;i<moduleDatas.length;i++){
					var nodes=moduleDatas[i];
					idObj[nodes["nodeName"]]=nodes["id"];
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

				for(var key in nodeStatus){
					if(nodeStatus[key]==0){
						if(!diagram.findNodeForKey(key)){
							continue;
						}
						diagram.findNodeForKey(key).elt(0).fill=unselectColor;	//未选中模块变成灰色
						nodeStatus[key] = 0;
					}
				}
			};
		 },   
		 error : function(XMLHttpRequest) {
		   alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
		 }
	}); 


	$('#creatTask label').addClass('label_width');   //含有任务名称等基本信息的表格中label
	
	$("#dirName").keydown(function(k){
		if(k.keyCode==13 ){
			addDir("dirName","jobUrlTable","inputUrl","dirModal");
		}
	});
	$("#addDir").click(function(){
		addDir("dirName","jobUrlTable","inputUrl","dirModal");
	});
	$('#dirModal').on('shown.bs.modal', function () {
	  $('#dirName').focus()
	})
	
})

//找到选中节点的子节点
function findChildren(obj,requiredNode){
	var it = obj.findTreeChildrenNodes();    //找到所有的子节点
    for(var i=0;i<it.count;i++){             //遍历子节点
		if(it.next()){   
			var cObj=it.value;   
			if(  jQuery.inArray(cObj.data.key, requiredNode) == -1 ){   //单击的节点不在必选的节点当中
				it.value.elt(0).fill=unselectColor;//变成灰色
				nodeStatus[cObj.data.key] = 0;
			};
			       
			var cNum= cObj.findTreeChildrenNodes().count;//console.log(cNum);
			if(cNum != 0){
				findChildren(cObj);
				}; 
		};
	}	
}
//找到父节点
function findParents(obj,requiredNode){
	var it = obj.findNodesInto();
    for(var i=0;i<it.count;i++){  
		if(it.next()){
			var pObj=it.value;
			if(  jQuery.inArray(pObj.data.key, requiredNode) == -1 ){   //单击的节点不在必选的节点当中 
				it.value.elt(0).fill=selectColor
				nodeStatus[pObj.data.key] = 1;
			};
			var pNum=pObj.findNodesInto().count;//console.log(cNum);
			if(pNum != 0){
				findParents(pObj);
				}; 
		};
	}	
}
//解锁
function unlock(){
	nodeLockStatus=1;
	$("#lockNode").attr("class","btn btn_orange round_Button");
	$("#unlockNode").attr("class","btn btn_white round_Button");
	$("#parasPanel").html("");  //清空现有的参数
};

//点击锁定模块
function selectedNode(){
	$("#unlockNode").attr("class","btn btn_orange round_Button");
	$("#lockNode").attr("class","btn btn_white round_Button");
	for(var key in nodeStatus){
		if(nodeStatus[key]==1){
			ids.push(idObj[key])
		}
	}
	if(nodeLockStatus == 1){  //判断是否是解锁状态
		$("#parasPanel").html(""); //清空现有的参数
		$.ajax({
			url:"json/ajaxPara.json",  
			type:'get',
			dataType: "json",
			data:{MOD_IDS:ids},
			async: false,
			success:function(data,status){
				if(status=="success"){ 
					$("#parasBox").show()
					var datas=data.data;
					flowType=data.flow_type;
					for(var key in datas){
						if(nodeStatus[key]==1){
							$("#parasPanel").append('<div class="panel panel-default"  id="' + key + '"><div class="panel-heading"><h4 class="panel-title"><a data-toggle="collapse" data-parent="#' + key + '" href="#' + key + '_panel_body">' + key + ' 参数设置</a></h4></div><div id="' + key + '_panel_body" class="panel-collapse collapse in"><div class="panel-body"><form class="form-horizontal" role="form"></form></div></div></div>');
							var paraDatas=datas[key];
							addPara(paraDatas,key,flowType); //添加面板中的参数
						}
					}
				}	
			},	
			error : function(XMLHttpRequest) {
			   alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
			}
		})
		nodeLockStatus=0; 	
	};
	
};
var samplesLock=1 //没有锁定
//在参数设置中 给node名字为key的模块 添加input或dropdown参数
function addPara(paraDatas,key,flowType) {
	for(var i=0;i<paraDatas.length;i++){
		if(typeof(paraDatas[i]) == 'undefined' || paraDatas[i] == null) {
			return;
		}
		if(paraDatas[i]["showType"] == "input") { //添加一个input框
			var name = paraDatas[i]["para_name"];
			var id = paraDatas[i]["id"];
			var value = paraDatas[i]["para_value"];
			var info = ""
			var defaultValue=paraDatas[i]["default_value"];
			//添加input的代码		
			$("#" + key + " form").append('<div class="form-group"><label class="col-sm-3 control-label">' + name + '</label><div class="col-sm-7"><input type="text"  class="form-control" required id="' + id + '" name="' + id + '" title="' + info + '"></div><a class="col-sm-2 control-label"  style=" text-align:left;cursor: pointer;text-decoration: none;" onclick="paraDefult(' + key + ',' + id +','+defaultValue+ ')">默认值</a></div>');		
			//向input中添加默认值
			$("#" + id).val(value);
		};
		if(paraDatas[i]["showType"] == "select") { //添加一个下拉框
			var name = paraDatas[i]["para_name"];
			var id = paraDatas[i]["id"];
			var value = paraDatas[i]["para_value"];
			var info = ""
			var options='';
			for(var j=0;j<value.length;j++){
				var htm="<option value="+value[j]["value"]+">"+value[j]["name"]+"</option>"
				options=options+htm;
			}
			$("#" + key + " form").append('<div class="form-group" ><label title="' + info + '" class="col-sm-3 control-label">' + name + '</label><div class="col-sm-7" ><select class="form-control" id="' + id + '" name="' + id + '"  title="">' + options + '</select></div></div>');
			$("#" + id).selectpicker({
				liveSearch: true
			});


			$('#seq_type').on('changed.bs.select', function(e) {
			    if(e.target.value){
			      	if(e.target.value=="SE"){
			      	var options=$('#sampleTable').bootstrapTable("getOptions");
						
						options.columns=[{
							checkbox:true,checkboxEnabled:true,field:"state",title:""
						},{
							align: "left", 
							field: "sample",
							order: "asc",
							editable: {
			                    type: 'text',
			                    validate: function (v) {
			                    	var patrn=/^(\w){1,8}$/; 
			                        if (!v&&v.trim().length<=0){
			                        	return '用户名不能为空';
			                        } 
			                        if (!patrn.exec(v)) {
										return '只能包含字母数字下划线，长度不超过8';
									}
			                        var data = $("#sampleTable").bootstrapTable('getData');
			                        for(var i=0;i<data.length;i++){
			                        	if(v==data[i].sample){
			                        		return '样本名已存在';
			                        	}
			                        }
			                   }
		                	}, 
		                	title: "样本名称<span id='sampleTip' style='cursor:default'  class='glyphicon glyphicon-question-sign'></span>"
						},{
							align: "center", field: "fq", order: "asc", title: "FastQ文件 "
						}];
						$('#sampleTable').bootstrapTable('destroy');
						$('#sampleTable').bootstrapTable(options);
			
						
			    	}else{
						var options=$('#sampleTable').bootstrapTable("getOptions");
						options.editable=true;
						options.columns=[{
							checkbox:true,checkboxEnabled:true,field:"state",title:""
						},{
							align: "left",
							field: "sample", 
							order: "asc",
							title: "样本名称<span id='sampleTip' style='cursor:default'  class='glyphicon glyphicon-question-sign'></span>",
							editable: {
				                type: 'text',
				                validate: function (v) {
				                	var patrn=/^(\w){1,8}$/; 
				                    if (!v&&v.trim().length<=0){
				                    	return '用户名不能为空';
				                    } 
				                    if (!patrn.exec(v)) {
										return '只能包含字母数字下划线，长度不超过8';
									}
				                    var data = $("#sampleTable").bootstrapTable('getData');
				                    for(var i=0;i<data.length;i++){
				                    	if(v==data[i].sample){
				                    		return '样本名已存在';
				                    	}
				                    }
				               }
				        	}
				        	
						},{
							align: "center", field: "fq1", order: "asc", title: "FastQ1文件 "
						},{
							align: "center", field: "fq2", order: "asc", title: "FastQ2文件 "
						}];
						$('#sampleTable').bootstrapTable('destroy');
						$('#sampleTable').bootstrapTable(options);
				  		$('#sampleTable').bootstrapTable("resetView");
				  	}
			    }
		    });
			

		};
		
		if(paraDatas[i]["showType"] == "path") { //添加一个下拉框
			var name = paraDatas[i]["para_name"];
			var id = paraDatas[i]["id"];
			var value = paraDatas[i]["para_value"];
			var info = ""
			var options='';
			//添加input的代码		
			$("#" + key + " form").append('<div class="form-group"><label class="col-sm-3 control-label">' + name + '</label><div class="col-sm-7"><input type="text"  class="form-control" required id="' + id + '" name="' + id + '" title="' + info + '"></div><a class="col-sm-2"  style=" text-align:left;cursor: pointer;text-decoration: none;" onclick="opendir_path()"><span class="glyphicon glyphicon-folder-open"></span></a></div>');		
			//向input中添加默认值
			$("#" + id).val(value);
		};
		
		if(paraDatas[i]["showType"] == "path_list") { 
			var name = paraDatas[i]["para_name"];
			var id = paraDatas[i]["id"];
			var value = paraDatas[i]["para_value"];
			var info = ""
			var options='';

			//添加input的代码
			$("#" + key + " form").append('<div class="form-group"><label class="col-sm-3 control-label">' + name + '</label><div class="col-sm-7"><input type="text"  class="form-control" required id=' + id + ' name=' + id + ' title=' + info + '></div><a class="col-sm-2"  style=" text-align:left;cursor: pointer;text-decoration: none;" onclick="openDataUrl('+id+')"><span class="glyphicon glyphicon-folder-open"></span></a></div>');		
		
			var htms="<div class='form-group'><div class='col-sm-8 col-sm-offset-2'><button id='removeDataTable' class='btn btn-default'>删除行</button><table id='sampleTable'></table><div style='width:360px;margin:0 auto;padding:40px 0;'><button id='getSamples' class='btn btn_orange round_Button'>锁定样本</button><button id='unlockSamples' class='btn btn_white round_Button'>清空样本</button></div><div id='sampleTipModal' class='sampleTipModal'>建议点击每个样本的名称进行样本名的修改，由数字、字母、下划线任意组合构成，不能包含空格，长度不超过10个字符</div></div></div>"
			$("#" + key + " form").append(htms);
			var options={
				editable:true,
				toolbar:"#toolbar",
				clickToSelect:true,
				showFooter:false,
				classes:'table',
				height:"250",
				columns: [  
			        {field:"state",edit:false,checkbox:true,checkboxEnabled:true},  
			        {align: "left", field: "sample", order: "asc",editable:{type:'text'}, title: "样本名称 <span id='sampleTip' style='cursor:default'  class='glyphicon glyphicon-question-sign'></span>"},
			        {align: "center", field: "fq1", order: "asc", title: "FastQ1文件 "},
			        {align: "center", field: "fq2", order: "asc", title: "FastQ2文件 "}
		      	]
			}
			$('#sampleTable').bootstrapTable(options);
			
			var samples = []
			//点击锁定样本，获得样本名称
			bindGroupClick()
			$("#getSamples").on("click",function(){
				if(samplesLock == 1){
					var data = $("#sampleTable").bootstrapTable('getData');
					if(data.length == 0){
						alert("还没有选择样本")
						}
					else{
						var array = new Array()    //用来去重
						for(var i=0;i<data.length;i++){
							var name = data[i].sample;
							if($.inArray(name, array) == -1){
								if(name.length>8){
									alert("样本名过长，不利于报告美观，建议修改！");
									return false;
								}
								
								array.push(name)
								if(flowType=="有参"){
									var add;
									add='<li class="list-group-item ui-widget-content ui-corner-tr">'+name+'</li>'
									$(add).appendTo('#sampleNames')
								}
								if(flowType=="bsa"){
									var options="<option>"+name+"</option>"
									$(".sampleSel").append(options);
								}
								
							};
			
						};
						$("#p2").append("<option>-</option>");
						$("#s1").append("<option>-</option>");
						samples = array;
						dragInit();
						samplesLock = 0;
						$("#unlockSamples").attr("class","btn btn_orange round_Button");
						$("#getSamples").attr("class","btn btn_white round_Button");
					};
					
					$(".editable-click").editable("disable");
					$(".editable-click").parent().click(function(){
						alert("样本已锁定，请先解锁！")
					})
				};
				return false
			}); 
			
			//解锁样本
			$("#unlockSamples").click(function(){
				samplesLock = 1;
				$("#unlockSamples").attr("class","btn btn_white round_Button");
				$("#getSamples").attr("class","btn btn_orange round_Button");
				$('#sampleNames').html("");
				$('#groupList').html("");
				$('#compareList').html("");
				$('#vennList').html("");
				allgroups=[];
				allCompares=[];
				allVenns=[];
				$(".editable-click").parent().off("click")
				$(".editable-click").editable("enable");
				$(".sampleSel").empty();
				return false;
			});
			
			
	    	//删除选中的行
	        $('#removeDataTable').click(function () {
				if(samplesLock == 1){
					var seq_type=$('#seq_type').val();
					if(seq_type==undefined||seq_type==""){
						seq_type="PE";
					}
					if(seq_type=="PE"){
						var ids = $.map($('#sampleTable').bootstrapTable('getSelections'), function (row) {
							if(row.fq1){
								return row.fq1;
							}else{
								return row.fq2;
							}
						});
						var index=ids[0].lastIndexOf("_");
						var arr=ids[0].split(""); 
						if(arr[index+1]=="2"||arr[index+2]=="2"){
							$('#sampleTable').bootstrapTable('remove', {
								field: 'fq2',
								values: ids
							});
						}
					if(arr[index+1]=="1"||arr[index+2]=="1"){
							$('#sampleTable').bootstrapTable('remove', {
								field: 'fq1',
								values: ids
							});
						}
					}else{
						var ids = $.map($('#sampleTable').bootstrapTable('getSelections'), function (row) {
							return row.fq;
						});
						$('#sampleTable').bootstrapTable('remove', {
							field: 'fq',
							values: ids
						});
					}
				};
				if(samplesLock == 0){
					alert("样本已经锁定，请先解锁")
				}
				return false
	        });
	        
			$('#sampleTip').on("mouseover",function(){
				$('#sampleTipModal').show(); 
			});  
			$('#sampleTip').on("mouseout",function(){
				$('#sampleTipModal').hide(); 
			}); 
    
		};
		
		if(paraDatas[i]["showType"] == "sampleGroup") { //添加一个下拉框
			var name = paraDatas[i]["para_name"];
			var id = paraDatas[i]["id"];
			var value = paraDatas[i]["para_value"];
			var sampleDatas =value["samples"];
			var html1='<div class="col-sm-3"><lable class="control-label">样本名称：</lable></div>';
			var html2='<div class="col-sm-3"><button id="addBtn" class="btn btn-default"><span class="glyphicon glyphicon-plus">Group</span></button></div>';
			var html3='<div class="col-sm-3"><button id="compareBtn" class="btn btn-default"><span class="glyphicon glyphicon-plus">Compare</span></button></div>'
			var html4='<div class="col-sm-3"><button id="vennBtn" class="btn btn-default"><span class="glyphicon glyphicon-plus">Venn</span></button></div>'
			$("#" + key + " form").append('<div class="form-group"><div style="width:80%">' + html1 +html2+html3+html4+ '</div></div>');	
			$("#" + key + " form").append('<div class="form-group"><div style="width:80%"><ul id="sampleNames" class="col-sm-3 list-group sampleNames ui-helper-reset ui-helper-clearfix"></ul><div id="groupList" class="col-sm-3" style="position:static"></div><div id="compareList" class="col-sm-3" style="position:static"></div><div id="vennList" class="col-sm-3" style="position:static"></div></div></div>');		
			
			$("#"+key).on("click","#addBtn",function(){
				if($("#sampleNames li").length>0){
					$('#groupModal').modal();
				}
				return false;
			})
			$("#"+key).on("click","#compareBtn",function(){
				if($("#groupList .sampleGroup ").length>0){
					$('#compareModal').modal();
				}
				return false;
			})
			$("#"+key).on("click","#vennBtn",function(){
				if($("#compareList .goupCompare ").length>0){
					$('#vennModal').modal();
				}
				return false;
			})
			$('#groupModal').on('shown.bs.modal', function () {
			  $('#groupName').focus()
			})
			$('#compareModal').on('shown.bs.modal', function () {
			  $('#compareName').focus()
			})
			$('#vennModal').on('shown.bs.modal', function () {
			  $('#vennName').focus()
			})
		};	
		
		if(paraDatas[i]["showType"] == "sampleSel") { //添加一个下拉框
			var name = paraDatas[i]["para_name"];
			var id = paraDatas[i]["id"];
			var value = paraDatas[i]["para_value"];
			//添加input的代码		
			$("#" + key + " form").append('<div class="form-group"><label class="col-sm-3 control-label">' + name + '</label><div class="col-sm-7"><div class="panel panel-default"><div class="panel-body" id="samplePanel"></div></div></div></div>');		
			for(var j=0;j<value.length;j++){
				var html='<div class="form-group"><lable class="col-sm-3 control-label">'+value[j]+'</lable><div class="col-sm-7"><select class="form-control sampleSel" id='+value[j]+'><select/></div></div>'
				$("#samplePanel").append(html);
			}

		};
	}
};//点击恢复默认值
function paraDefult(key,id,defaultValue){
	var key = key.id;
	var id = id.id;	
	$("#"+id).val(defaultValue);
};

//-----------------------------------点击打开目录--------------------------------------------	
//打开任务目录
function opendir_path(){
	var inputValue = $("#dir_path").val();  //当前input的值
	$("#inputUrl").val(inputValue);
	//console.log(inputValue)
	$('#selectUrl').modal('show');
    $("#selected").attr("onClick","geturl('#dir_path','dir')")
};

//打开数据目录
function openDataUrl(id){
	var inputId=$(id).attr("id");
	if(samplesLock == 1){
		var inputValue = $("#data_dir").val();  //当前input的值
		$("#inputUrl").val(inputValue);	
		$('#selectUrl').modal('show');   //显示模态框
		$("#selected").attr("onClick","geturl("+inputId+",'dir')");
	};
	if(samplesLock == 0){
		alert("样本已经锁定，请先解锁")
	}
};
//新建目录
function addDir(dirName,tableId,inputUrl,dirModal){
	var name=$("#"+dirName).val();
	if(name==""||name==null){
		alert("请输入目录名");
	}else{
		name=$.trim(name);
		var tableDatas=$("#"+tableId).bootstrapTable('getData');
		for(var i=0;i<tableDatas.length;i++){
			var rowName=tableDatas[i].name;
			var rowType=tableDatas[i].type;
			if(rowType=="drwxrwxr-x."){
				if(name==rowName){
					alert("目录名已存在！");
				}
			}
		}
	}
	var path=$("#"+inputUrl).val();
	$.ajax({
			url:"json/addDir.json",  
			type:'get',
			data:{dirName:name,
				InputPath:path
				},
			dataType: "json",
			success:function(data,textStatus) {
				if(data['status']=='SUCCESS'){ 
					var data1 = data['data'];
					$('#'+tableId).bootstrapTable('prepend',data1);  //填入table中
					$("#"+dirModal).modal('hide');
					
				}else{
					alert(data['data']);
				}
			  },    
			error : function(XMLHttpRequest) {
				alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);   
			 }
		}); 
}
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
//点击选择关闭模态框，将当前模态框input中的路径取出放入表单中,type 的类型 暂时有两种，dir和 file
function geturl(id,type){
	var formInputId="#"+$(id).attr("id");
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
					if(formInputId!= "#dir_path"){
						var sequencingType = $("#seq_type").val();
						if(sequencingType==undefined||sequencingType==""){
							sequencingType="PE";
						}
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
			if(sequencingType==undefined||sequencingType==""){
				sequencingType="PE";
			}
			$.ajax({
					url:samplesDataUrl,  
					type:'post',
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
				//获得当前的目录，取消绑定，关闭模态框，在外面填写
				newUrl = $("#inputUrl").val();
				newUrl = newUrl.replace('//','/');
				$("#selected").removeAttr("onClick");
				$("#selectUrl").modal('hide');
				$(formInputId).val(newUrl);
				//清空样本
				$(formInputId).nextAll().remove();
				for(var i=0; i< files.length; i++){
					$(formInputId).after('<span class="label label-default span_sample">'+files[i]+'<a href="javascript:void(0);" onclick="remover_this_sample(this)" class="glyphicon glyphicon-remove"></a></span>');
				};
			};
		};

	}
	else{
		return false;
	}

};
	


<!-- ##################　样本分组、比较、维恩图　################## -->
function dragInit() {
	debugger
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
	        dropItem( ui.draggable ,$(this),'red', 5);
	      }
	    });
	//比较组接收组名
	$compareGroup.droppable({
	      accept: ".sampleGroup",
	      activeClass: "ui-state-highlight",
	      tolerance:"pointer",
	      drop: function( event, ui ) {
	        dropItem( ui.draggable ,$(this),'green',2);
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
				if($("#groupList .glyphicon-remove").length>0){
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
				}else{

    				$("#compareList").empty();
    				$("#vennList").empty();
				}

			})
		}); 
	    
	    	    
		$("#compareList .glyphicon-remove").each(function(){
			
			$(this).click(function(){
				if($("#compareList .glyphicon-remove").length>0){
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
				}else{
					$("#vennList").empty();
				}
				
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
	var html='<div name="sampleGroup" class="ui-widget-content ui-state-default sampleGroup" style=border-radius:3px;><span class="ui-widget-header" style=font-size:18px;height:28px;border:none;background:none;display:inline-block;>'+gname+'</span><button class="ui-widget-header glyphicon glyphicon-remove pull-right closeBorder" ></span></div>';
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
	var html='<div name="goupCompare" class="ui-widget-content ui-state-default goupCompare" style=border-radius:3px;><span class="ui-widget-header" style="font-size:18px;color:green;border:none;background:none;height:28px;display:inline-block;" >'+cname+'</span><span class="ui-widget-header glyphicon glyphicon-remove pull-right closeBorder" ></span></div>';
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
	var html='<div name="venn" class="ui-widget-content ui-state-default venn" style=border-radius:3px;><span class="ui-widget-header" style="font-size:18px;border:none;color:red;background:none;height:28px;display:inline-block;" >'+cname+'</span><span class="ui-widget-header glyphicon glyphicon-remove pull-right closeBorder" ></span></div>';

	$(html).appendTo('#vennList');
	allVenns.push(cname);
	dragInit();
}

function bindGroupClick(){
	dragInit();
	$("#groupName").keydown(function(k){
		if(k.keyCode==13 ){
			addGroup();
		}
	});
	$("#compareName").keydown(function(k){
		if(k.keyCode==13 ){
			addCompare();
		}
	});
	$("#vennName").keydown(function(k){
		if(k.keyCode==13 ){
			addVenn();
		}
	});
	$("#addGroup").click(function(){
		addGroup();
		
	});
	$("#addCompare").click(function(){
		addCompare();
	});
	$("#addVenn").click(function(){
		addVenn();
	});
}


//检查参数填写情况
function checkInput(){
	var checkTask=$("#creatTask input[name]");
	var checkNode=$("#parasPanel input[name]");
	var checkDrop=$("#parasPanel select");
	var count=0; //计数
//	var patt = /^[a-zA-Z0-9_]{1,}$/i; 
	for(var i=0;i<checkTask.length;i++){
	  if(checkTask[i].value==""){
		$($("#creatTask input[name]")[i]).attr("style","border-color:red;")
		count += 1;
	  }
	  else{
		$($("#creatTask input[name]")[i]).attr("style","border-color:#ccc;") 
		  };
	};
	
	for(var i=0;i<checkNode.length;i++){
	  if(checkNode[i].value==""){
		$($("#parasPanel input[name]")[i]).attr("style","border-color:red;")
		count += 1;
	  }
	  else{
		$($("#parasPanel input[name]")[i]).attr("style","border-color:#ccc;")  
		  };
	}; 
	
	for(var i=0;i<checkDrop.length;i++){
	  if(checkDrop[i].value==""){
		count += 1;
	  }
	}; 
	
	if(count != 0){
		alert("还有未填写的参数！");
	};
	if(samplesLock == 1){
		alert("未锁定样本！");
		count += 1;
	}
	if(nodeLockStatus == 1){
		alert("未锁定模块！");
		count += 1;
	}
	return count
	};

//任务运行，提交参数
$("#taskRun").click(function(){
	console.log(flowType)
	var tableDatas=$('#sampleTable').bootstrapTable("getData");
	var resultArray=[];
	for(var i=0;i<tableDatas.length;i++){
		var rowData=tableDatas[i];
		var obj={};
		if(rowData.fq1||rowData.fq2){
			var trs=$('#sampleTable tr')
			obj["oldName"]=trs[i+1].children[1].children[0].getAttribute("data-value");
			obj["newName"]=rowData.sample;
			obj[rowData.sample]=[rowData.fq1,rowData.fq2];
		}else{
			obj[rowData.sample]=[rowData.fq];
		}
		resultArray.push(obj)
	}
	var nullNum = checkInput()
	if(nullNum==0){
		var value=$("#task_name").val();
		var  patrn=/^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/; 
		if(!patrn.test(value)){
			alert("只能由字母、数字、下划线组成，且不能以下划线开始结束！");
			return false;
		}
		
		//任务参数有关的信息
		var taskPara = $("#creatTask").serializeArray();
		//	taskPara = decodeURIComponent(taskPara,true);
		//taskPara = JSON.stringify(taskPara);
		//选中的模块参数
		var selectPara = $("#parasPanel select[name]").serializeArray();  //选择框
		var inputPara = $("#parasPanel input[name]").serializeArray();   //下拉框
		var nodePara= $.merge(selectPara,inputPara); //合并
		//	nodePara = JSON.stringify(nodePara);
	
		//没选中的模块名字
		var unselectNode=""
		for (var i in nodeStatus){
		  if(nodeStatus[i] == 0){
			if(unselectNode==""){
				unselectNode += i
				}
			else{
				unselectNode += ","+i
				}
		  };
		}
		
		var groupCompareVenn={};	//发向服务器的json数据
		if(flowType=="有参"){
			//检查是否有分组，每个分组下的样品名
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
						allGroupItems.push($(sampleItems[j]).text().replace(/(^\s*)|(\s*$)/g, ""))
					}
			//		allGroupItems.push(curGroupSamples);
					groupSamples[curGroup]= curGroupSamples;
				}
				groupCompareVenn['groupSamples']= groupSamples;
			}
			
			//检查数据
			//检查样本是否已全部分组，非强制
			var samples=$("#sampleNames").find('li');
			if(samples.length>0){
				for(var i=0;i<samples.length;i++){
					if(allGroupItems.indexOf(samples[i].innerText)==-1&&nodeStatus["DE"] == 1){
						if(confirm("发现有未分组的样品，确定不分组?")){
							break;
						}
					}
				}
			}
		
			//检查比较组
			var compares = $('#compareList').find('div');
			if(compares.length>0){
				var compareGroups = {};
				for(var i=0; i<compares.length; i++){
					var groupItems = $($(compares[i]).find('ul')[0]).find('li');
					if(groupItems.length!=2){
						alert("比较组必须含有两个组")
						return false;
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
				if(nodeStatus["DE"] == 1){
					alert("比较组不能为空！");
					return false;
				}
				
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
				groupCompareVenn['vennGroups'] = vennCompares;
			}
		
		
			groupCompareVenn = JSON.stringify(groupCompareVenn);
			$('#groupCompareVenn').val(JSON.stringify(groupCompareVenn));
			
			
			//全部的参数	
			var samplesStr=""
			for(var j=0;j<samples.length;j++ ){  
				if(samplesStr == ""){
					samplesStr += samples[j].innerText;
				}else{
					samplesStr += ","+samples[j].innerText;
				}
			};
		}
		var sampleSel={};
		if(flowType=="bsa"){
			$("#samplePanel").find("select").each(function(){
				var id=$(this).attr("id");
				var val=$(this).val();
				sampleSel[id]=val;
			})
		}
		var resultPara={
				"sampleSel":sampleSel,
				"sampleData":resultArray,
				"taskPara":taskPara,
				"nodePara":nodePara,
				"unselectNode":unselectNode,
				"samples":samplesStr,
				"groupCompareVenn":groupCompareVenn
		}; 					
		resultPara = JSON.stringify(resultPara);
		console.log(resultPara)
		//向后台传送数据
		 $.ajax({
		//	url:"__MODULE__/Task/addUpdateTask/submitType/job",  
			url:"json/job.json",
		    type:'get',
		    data:{parameter:resultPara},
		    dataType: "json",
		    success:function(data) {
		    	if(data['status']=='ERROR'){    //请求成功但没有执行成功
		    		alert(data['data']);
		    	}else{
		    		$('#id').val(data['data']);
					alert("执行成功！");
					//	window.location.href= "__MODULE__/Task/getTask/id/"+data['data'];
					//	window.location.href= "taskDetailRNA.html";
		    	}
		     },    
		     error : function(XMLHttpRequest) {
		       alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText); 
		     }
		});  
	} 
});

