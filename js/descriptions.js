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
						selectedBackColor: '#13438b'
					});
					
					$('#tree').on('nodeSelected', function(event, data) {
						$("#menuPath").text(data.text);
						$("#navText").text(data.text);
						if(data.unId=="100"){
							$("#welcome").show();
							$("#right .navBox").hide();
							$("#content").empty();
						}else{
							if(data.parentId){
								var nodes=$('#tree').treeview('getNodes',{nodeId:data.parentId});
								for(var i=0;i<nodes.length;i++){
									if(nodes[i].nodeId==data.parentId){
										$("#menuPath").text(nodes[i].text+">"+data.text);
										if(nodes[i].parentId){
											debugger
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
		$.ajax({
			type:"post",
			url:"",
			data:{texts:searchText},
			dataType: "json",
			success:function(data,textStatus){
				
			}
		});
	})
	
})

	

