$(function () {
	$.ajax({
			type:"get",
			url:"json/getNode.json",
			dataType: "json",
			success:function(data,status){
				if(status=="success"){
					$('#tree').treeview({
						data:data.data,
						expandIcon: 'glyphicon glyphicon-chevron-right',
						collapseIcon: 'glyphicon glyphicon-chevron-down',
						selectedColor: '#FFFFFF',
						selectedBackColor: '#13438b',
						showTags:false
					});
					
					$('#tree').on('nodeSelected', function(event, data) {
						$("#menuPath").text(data.text);
						$("#navText").text(data.text);
						if(data.unId=="100"){
							$("#welcome").show();
							$("#right .navBox").hide();
							$("#content").empty();
						}else{
							$("#search").hide()
							$("#content").show();
							if(data.parentId){
								var nodes=$('#tree').treeview('getNodes',{nodeId:data.parentId});
								for(var i=0;i<nodes.length;i++){
									if(nodes[i].nodeId==data.parentId){
										$("#menuPath").text(nodes[i].text+">"+data.text);
										if(nodes[i].parentId){
											var nodes1=$('#tree').treeview('getNodes',{nodeId:nodes[i].parentId});
											for(var j=0;j<nodes1.length;j++){
												if(nodes1[j].nodeId==nodes[i].parentId){
													$("#menuPath").text(nodes[j].text+">"+nodes[i].text+">"+data.text);
												}
											}
										}
									}
								}
							}
							
							$("#welcome").hide();
							$("#right .navBox").show();
							$.ajax({
								url:'json/dec1.json',     
								type:'get',
								data:{id:data.unId},
								dataType: "json",
								success:function(data,textStatus){
									if(textStatus=="success"){
										$("#content").empty();
										$("#content").append(data.data["detail"])
									}
				
								},
								error: function(XMLHttpRequest){
									alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);
								}
								 
							}); 
						}
					});
				}
				
			}
	}); 
	$("#search_button").on("click",function(){
		var searchText= $("#search_flowapp").val();
		if(searchText!=""){
			search();
		}
		
	})
	
	$("#search_flowapp").keydown(function(k){
		var searchText= $("#search_flowapp").val();
		if(k.keyCode==13 ){
			if(searchText!=""){
				search();
			}
		}
	});
	
	$("#searchResult").on("click","li",function(){
		$('#tree').treeview('enableAll', { silent: true });
		var nodes=$('#tree').treeview('getNodes');
		for(var i=0;i<nodes.length;i++){
			if(nodes[i].unId==$(this).attr("unid")){
				$('#tree').treeview('revealNode', [nodes[i], { silent: false } ]);
				$('#tree').treeview('selectNode', [nodes[i], { silent: false } ]);
			}

		}
	})
	
	$("#expand").on("click",function(){
		$("#showAll").hide();
		var searchText= $("#search_flowapp").val();
		$.ajax({
			type:"get",
			url:"json/searchAll.json",
			dataType: "json",
			success:function(data,status){
				if(status=="success"){
					var datas=data.data;
					for(var i=0;i<datas.length;i++){
						var str=datas[i]["title"].replace(searchText,"<span style='color:#13438b'>"+searchText+"</span>")
						var html="<li unId="+datas[i]["unId"]+"><h4>"+str+"</h4><p>"+datas[i]["content"]+"</p></li>"
						$("#searchResult").append(html);
					}
				}
			}
		});
		totalNum=$("#searchResult li").length;
	})
	
})
var totalNum;
function search(){
	$("#welcome").hide();
	$("#content").hide();
	$("#navBox").hide();
	$('#tree').treeview('disableAll');
	var searchText= $("#search_flowapp").val();
	$("#searchContent").text(searchText)
	$.ajax({
		type:"get",
		url:"json/searchResult.json",
		data:{texts:searchText},
		dataType: "json",
		success:function(data,status){
			if(status=="success"){
				var datas=data.data;
				var total=datas["total"];
				$("#searchTotal").text("("+total+"个结果)")
				if(total!=0){
					if(total>5){
						$("#search").show();
						$("#showAll").show();		
					}else{
						$("#search").show();
						$("#showAll").hide();
					}
					var lists=datas["lists"];
					$("#searchResult").empty();
					for(var i=0;i<lists.length;i++){
						var str=lists[i]["title"].replace(searchText,"<span style='color:#13438b'>"+searchText+"</span>")
						var html="<li unId="+lists[i]["unId"]+"><h4>"+str+"</h4><p>"+lists[i]["content"]+"</p></li>"
						$("#searchResult").prepend(html);
					}				
				}else{
					$("#search").hide();
					$("#showAll").hide();
					$("#searchFail").show()
				}
				totalNum=$("#searchResult li").length;
				console.log(totalNum)
			}
		}
	});
	
}

