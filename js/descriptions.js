$(function () {
	
	$('#tree').treeview({data:getTree()});  
	$('#tree').on('nodeSelected', function(event, data) {
		$("#navText").text(data.text);
		if(data.href=="100"){
			$("#welcome").show();
			$("#right .navBox").hide();
			$("#content").empty();
			$("#menuPath").text(data.text);
		}else{
			if((parseInt(data.href)/10%10>0)&&(parseInt(data.href)/10%10<=9)){
				if(parseInt(data.href)%10==0){
					$("#menuPath").text("数据分析>"+ data.text);
				}else{
					if(Math.floor(parseInt(data.href)/10)%10==2){
						$("#menuPath").text("数据分析>分析流程>"+ data.text);
					}else{
						$("#menuPath").text("数据分析>小工具>"+ data.text);
					}
				}
			}else{
				$("#menuPath").text(data.text);
			}
			$("#welcome").hide();
			$("#right .navBox").show();
			$.ajax({
				url:'json/dec1.json',     //陈向伟，传给你id  返回正文信息
				type:'get',
				data:{id:data.href},
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
	
	$("#add").on("click",function(){
		var arr=$('#tree').treeview('getChecked'); 
	 	console.log(arr)
		var singleNode = {  
                    text: "小小" 
                  };  
        $("#tree").treeview("addNode", [singleNode,arr]);  
	})
	
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

	

function getTree(){
	   var tree = [
		    {
		    	text: "欢迎使用",
		    	tags: ['+'],
		    	href:"100"
		  	},
		  	{
		    	text: "注册及登录",
		    	href:"200",
		    	tags: ['+']
		  	},
		  	{
		    	text: "首页",
		    	href:"300",
		    	tags: ['+']
		  	},
			{
			    text: "数据分析",
			    href:"400",
			    tags: ['+'],  
			    nodes: [
				    {
				        text: "我的目录",
				        tags: ['+'],
				        href:"410"
				    },
				    {
				        text: "分析流程",
				        tags: ['+'],
				         href:"420",
				        nodes: [
				          {
				            text: "分析流程类型",
				            tags: ['+'],
				            href:"421"
				          },
				          {
				            text: "分析流程使用",
				            tags: ['+'],
				            href:"422"
				          },
				          {
				            text: "深度挖掘使用",
				            tags: ['+'],
				            href:"423"
				          }
				        ]
				    },
				    {
				        text: "我的项目",
				        tags: ['+'],
				        href:"430"
				    },
				    {
				        text: "回收站",
				        tags: ['+'],  
				        href:"440"
				    }
				    ,
				    {
				        text: "小工具",
				        tags: ['+'],  
				        href:"450",
				        nodes: [
					        {
					            text: "小工具类型",
					            tags: ['+'],  
					            href:"451"
					        },
					        {
					            text: "小工具使用",
					            tags: ['+'],  
					            href:"452"
					        }
				        ]
				    }
				    ,
				    {
				        text: "资源监控",
				        tags: ['+'],  
				        href:"460"
				    }
			    ]
			},
			{
			    text: "帮助",
			    tags: ['+'],  
			    href:"500"
			},
			{
			    text: "管理系统",
			    tags: ['+'],  
			    href:"600"
			},
			{
			    text: "退出",
			    tags: ['+'],  
			    href:"700"
			}
		  
		];
		return tree;  
   }  