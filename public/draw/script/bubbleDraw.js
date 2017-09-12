var paramUrl = 'public/draw/json/jobUrl.json'; //module+'/Data/remoteDirView';  //选择路径的模态框，向后台请求的地址

$(function(){	
	var color1=["#da9034","#4ab1c9","#0f9a82","#3a5183","#eb977b","#828db0","#b3d4ab","#cf151b","#7c5f47"];
	var color2=["#37458b","#de1615","#0b8543","#5b2379","#057e7c","#b11e23","#308cc6","#991c54","#808080"];
	var color3=["#4357a5","#eae185","#c43c32","#44657f","#ea8f10","#5ca8d1","#7c2163","#72be68","#cf91a2"];
	vue=new Vue({
		el:"#myTabContent",
		data:{
			input:"",
			title:"气泡图",
			xlab:"X轴标题",
			ylab:"Y轴标题",
			fileData:{
				content:[]
			},
			xCoumnDefault:"",
			yCoumnDefault:"",
			groupCoumnDefault:"",
			sizeCoumnDefault:"",
			groupColumnData:[],
			sizeColumnData:[],
			xColumnData:[],
			yColumnData:[],
			groupColorName:[],
			legendDiameter:"14",
			minValue:0,
			maxValue:0.2,
			color:color1,
			Xgrid:"show",
			Ygrid:"show"
		},
		computed: {	
			title_size: {
				cache:false,
			    get: function () {
			      return   $("#title_size").selectpicker("val");
			    },
			    set: function (newValue) {
			       $("#title_size").selectpicker("val",newValue);
			    }
			},
			title_font:{
				cache:false,
			  	get: function () {
			      return  $("#title_font").selectpicker("val");
			    },
			    set: function (newValue) {
			       $("#title_font").selectpicker("val",newValue);
			    }
			},
			xlab_size:{
				cache:false,
			  	get: function () {
			      return $("#xlab_size").selectpicker("val");
			    },
			    set: function (newValue) {
			       $("#xlab_size").selectpicker("val",newValue);
			    }
			},
			xlab_font:{
				cache:false,
			  	get: function () {
			      return  $("#xlab_font").selectpicker("val");
			    },
			    set: function (newValue) {
			       $("#xlab_font").selectpicker("val",newValue);
			    }
			},
			ylab_size:{
				cache:false,
			  	get: function () {
			      return $("#ylab_size").selectpicker("val");
			    },
			    set: function (newValue) {
			       $("#ylab_size").selectpicker("val",newValue);
			    }
			},
			ylab_font:{
				cache:false,
			  	get: function () {
			      return $("#ylab_font").selectpicker("val");
			    },
			    set: function (newValue) {
			       $("#ylab_font").selectpicker("val",newValue);
			     
			    }
			},
			titleX:{
				cache:false,
			  	get: function () {
			      return $("#titleX").selectpicker("val");
			   },
			    set: function (newValue) {
			       $("#titleX").selectpicker("val",newValue);
			    }
			},
			titleY:{
				cache:false,
			  	get: function () {
			      return  $("#titleY").selectpicker("val");
			   	},
			    set: function (newValue) {
			       $("#titleY").selectpicker("val",newValue);
			    }
			},
			legendX:{
				cache:false,
			  	get: function () {
			      return  $("#legendX").selectpicker("val");
			   },
			    set: function (newValue) {
			    	
			       $("#legendX").selectpicker("val",newValue);
			    }
			},
			legendY:{
				cache:false,
			  	get: function () {
			      return $("#legendY").selectpicker("val");
			   },
			    set: function (newValue) {
			       $("#legendY").selectpicker("val",newValue);
			    }
			},
			legendLayout:{
				cache:false,
			  	get: function () {
			      return $("#legendLayout").selectpicker("val");
			   	},
			    set: function (newValue) {
			       $("#legendLayout").selectpicker("val",newValue);
			    }
			},
			xColumnField:{
				cache:false,
			  	get: function () {
			        return $("#xColumnField").selectpicker("val");
			    },
			    set: function (newValue) {
			       	 $("#xColumnField").selectpicker("val",newValue);
			       	this.yColumnData = this.calcYColumnData();
			       	this.groupColumnData = this.calcGroupColumnData();
			       	this.$nextTick(function(){
						$('#yColumnField').selectpicker('refresh');
						$('#groupColumnField').selectpicker('refresh');
						
					});
					return true;
			    }
			},
			yColumnField:{
				cache:false,
			  	get: function () {
			    		return $("#yColumnField").selectpicker("val");
			    },
			    set: function (newValue) {
			       	$("#yColumnField").selectpicker("val",newValue);
			       	this.xColumnData = this.calcXColumnData();
			       	this.groupColumnData = this.calcGroupColumnData();
			       	this.$nextTick(function(){
						$('#xColumnField').selectpicker('refresh');
						$('#groupColumnField').selectpicker('refresh');
						
					});
			    }
			},
			groupColumnField:{
				cache:false,
			  	get: function () {
			      	return  $("#groupColumnField").selectpicker("val");
			    },
			    set: function (newValue) {
			       		$("#groupColumnField").selectpicker("val",newValue);
			       		this.xColumnData = this.calcXColumnData();
			       		this.yColumnData = this.calcYColumnData();
			       		this.groupColorName = this.calcGroupColorName();
			       		this.sizeColumnData = this.calcSizeColumnData();
			       		this.$nextTick(function(){
							$('#xColumnField').selectpicker('refresh');
							$('#yColumnField').selectpicker('refresh');
							
						});
			    }
			},
			sizeColumnField:{
				cache:false,
			  	get: function () {
			      	return  $("#sizeColumnField").selectpicker("val");
			    },
			    set: function (newValue) {
			       		$("#sizeColumnField").selectpicker("val",newValue);
			       		this.xColumnData = this.calcXColumnData();
			       		this.yColumnData = this.calcYColumnData();
			       		this.groupColorName = this.calcGroupColorName();
			       		this.$nextTick(function(){
							$('#xColumnField').selectpicker('refresh');
							$('#yColumnField').selectpicker('refresh');
							$('#groupColumnField').selectpicker('refresh');
						});
			    }
			},
			gridX:function(){
				if(this.Xgrid=="show"){
					return true;
				}else{
					return false;
				}
			},
			gridY:function(){
				if(this.Ygrid=="show"){
					return true;
				}else{
					return false;
				}
			}
		},
		methods:{
			calcGroupColorName:function () {
				var result = [];
		       if(this.fileData.content&&this.fileData.content.length>0&&this.sizeColumnField){
		       		var heads = this.fileData.content[0];
					var headIndexMap={};//用来存储每个表头对应的列数
					for(var i=0;i<heads.length;i++){//循环表头
						var headColumn = heads[i];
						headIndexMap[headColumn]=i;//将表头的列数存入map中
					}
					var dataMap={};
					for(var i=1;i<this.fileData.content.length;i++){
						var row = this.fileData.content[i];
						var sizeVal = row[headIndexMap[this.sizeColumnField]];
						if(!dataMap[sizeVal]){//如果是数据轴
							result.push(sizeVal);//将数据名存入图例
							dataMap[sizeVal] =true;
						}
						
					}
		       }
		       return result;
			 },
			calcGroupColumnData:function(){
				var groupColumnData=[];
				var datas=this.fileData.content[0];
				if(!datas){
					return new Array();
				}
				for(var i=0;i<datas.length;i++){
//					if(datas[i]==this.xColumnField){
//						continue;
//					}
//					if(datas[i]==this.yColumnField){
//						continue;
//					}
					groupColumnData.push(datas[i])
				}
				return groupColumnData;
				
			},
			calcXColumnData:function(){
				var xColumnData=[];
				var datas=this.fileData.content[0];
				if(!datas){
					return new Array();
				}
				for(var i=0;i<datas.length;i++){
//					if(datas[i]==this.groupColumnField){
//						continue;
//					}
//					if(datas[i]==this.yColumnField){
//						continue;
//					}
					xColumnData.push(datas[i])
				}
				return xColumnData;

			},
			calcYColumnData:function(){
				var yColumnData=[];
				var datas=this.fileData.content[0];
				if(!datas){
					return new Array();
				}
				for(var i=0;i<datas.length;i++){
//					if(datas[i]==this.xColumnField){
//						continue;
//					}
//					if(datas[i]==this.groupColumnField){
//						continue;
//					}
					yColumnData.push(datas[i])
				}
				return yColumnData;

			},
			calcSizeColumnData:function(){
				var sizeColumnData=[];
				var datas=this.fileData.content[0];
				if(!datas){
					return new Array();
				}
				for(var i=0;i<datas.length;i++){
//					if(datas[i]==this.xColumnField){
//						continue;
//					}
//					if(datas[i]==this.groupColumnField){
//						continue;
//					}
//					if(datas[i]==this.yColumnField){
//						continue;
//					}
					sizeColumnData.push(datas[i])
				}
				return sizeColumnData;
			}
		},
		watch:{
			input:function(val,oldVal){
				$.ajax({
					url: 'public/draw/json/bubbleDrawFileData.json',  
					type:'get',
					data:{
						fileName:val
					},
					dataType: "json",
					success:function(data) {
						 vue["fileData"]=data;
					},    
					error : function(XMLHttpRequest) {
						//alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
					}
				});
			},
			fileData:function(val,oldVal){
			 	this.xColumnData = this.calcXColumnData();
		       	this.groupColumnData = this.calcGroupColumnData();
		       	this.yColumnData = this.calcYColumnData();
		       	this.sizeColumnData = this.calcSizeColumnData();
				this.$nextTick(function(){
					$('#xColumnField').selectpicker('refresh');
					$('#yColumnField').selectpicker('refresh');
					$('#groupColumnField').selectpicker('refresh');
					$('#sizeColumnField').selectpicker('refresh');
					for(var item in this.defaults){
						if(item!="input")
						vue[item]=this.defaults[item];
					}
				});
			},
			groupColorName:function(val,oldVal){
				this.$nextTick(function(){
					$(".spectrum").spectrum({
						preferredFormat: "hex3"
					});
				});
			},
			color:function(val,oldVal){
				this.$nextTick(function(){
					$(".spectrum").spectrum({
						preferredFormat: "hex3"
					});
				});
			}
		}
	});
 	var myChart = echarts.init(document.getElementById('main'));
        // 指定图表的配置项和数据
    var option = {
    	backgroundColor: '#fff',
	    title: {
	        text: '',
	        textStyle:{
	        	fontStyle:'normal',
	        	fontWeight:'normal',
	        	fontSize:14
	        },
	        x:vue.titleX,
	        y:vue.titleY
	       
	    },
	    tooltip : {
	        trigger: 'axis',
	        formatter: function(parame){
	        	for(var i=0;i<parame.length;i++){
	        		return parame[i].data[0]+"<br/>"+parame[i].data[1]+"<br/>"+parame[i].data[2]+"</br>"+parame[i].data[3]
	        	}
	        }
	    },
	    xAxis : [
	        {
	        	type:'value',
	            nameLocation:'middle',
	            nameGap: 25,
	            splitLine:{
                	show:vue.gridX,
                	lineStyle:{
                		type:'solid'
                	}
            	},
            	axisTick:{
            		inside: true
            	},
            	axisLine:{
            		show:false
            	}
	        }
	    ],
	    yAxis : [
	        {
	        	type:'category',
	            nameLocation:'middle',
	            nameGap: 25,
	            splitLine:{
                	show:vue.gridY,
                	lineStyle:{
                		type:'solid'
                	}
            	},
            	axisTick:{
            		inside: true
            	},
            	axisLine:{
            		show:false,
            		onZero: false
            	},
            	data:[],
            	axisLabel: {
            		align:'right'
            	}
	        }
	    ],
	    grid:{
	    	show:true,
	    	borderColor:'#000',
	    	left:180,
	    	right:100,
	    	top:50,
	    	bottom:57
	    }
	};

	 myChart.setOption(option);
	//点击数据，对应的数据高亮显示
	myChart.on('click', function (parmas) {
		$('#appTabLeft li:eq(0) a').tab('show');
		var tr=$("#file table tr").first();
		var ths=$(tr).children("th");
		//取到x轴名字
		var xText=vue.xColumnField;
		var index;
		for(var i=0;i<ths.length;i++){
			if(ths[i].innerText==xText){
				index=i;
				break;
			}									
		}
		$("#file table tr").each(function(){
			if($(this).children("td:eq("+index+")").text()==parmas.value[0]){
				$(this).addClass("active");
				$(this).siblings("tr").removeClass("active");
			}			
		})
	});
    // 使用刚指定的配置项和数据显示图表。
   
	$("select").on("change.bs.select",function(){
		vue[$(this).attr("id")]=$(this).selectpicker("val");
	})
	$("#colorProject").on("change.bs.select",function(){
		if($(this).selectpicker("val")=="project1"){
			vue.color=color1;
		}else if($(this).selectpicker("val")=="project2"){
			vue.color=color2;
		}
		else{
			vue.color=color3;
		}
	});
	//颜色控件初始化开始
	vue.color=["#da9034","#4ab1c9","#0f9a82"];
	//点击示例文件，加载已有参数
	$("#use_default").click(function(){
		$.ajax({
			url: 'public/draw/json/bubbleDraw.json',  
			type:'get',
			data:tool_id,
			dataType: "json",
			success:function(data) {
				//加载成功后将所有数据赋值给vue
				for(var item in data){
					vue[item]=data[item];
					vue.defaults = data;
				}
			},    
			error : function(XMLHttpRequest) {
				alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
			}
		});
	});

	//提交参数
	$("#submit_paras").click(function(){
		var formData =  allParams();//取form表单参数
		if(formData.input==""){
			alert("请输入文件");
		}else{
			updateEcharts(myChart,formData);//更新echarts设置 标题 xy轴文字之类的
			myChart.showLoading();
			$.ajax({
				url: 'public/draw/json/bubbleDrawFileData.json',  
				type:'get',
				data:{
					fileName:formData.input
				},
				dataType: "json",
				success:function(data) {
					myChart.hideLoading();
					
					updateEchartsData(myChart,formData,data["content"],vue.xColumnField,vue.yColumnField,vue.groupColumnField,vue.sizeColumnField);
				},    
				error : function(XMLHttpRequest) {
					alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);
				}
			});
		}
	});
//	支持下载png格式
	$("#btnPng").click(function(){
		downloadPic(myChart);
	});
	function downloadPic(myChart){
		var $a = document.createElement('a');
		var type = 'png';
		var title = myChart.getModel().get('title.0.text') || 'echarts';
		$a.download = title + '.' + type;
		$a.target = '_blank';
	    var url = myChart.getConnectedDataURL({
	        type: type,
	        backgroundColor:myChart.getModel().get('backgroundColor') || '#fff',
	        pixelRatio: 10,
	        excludeComponents: ['toolbox']
	    });
	    $a.href = url;
	     // Chrome and Firefox
        if (typeof MouseEvent === 'function' && !$.support.msie && !$.support.edge) {
            var evt = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: false
            });
            $a.dispatchEvent(evt);
        }
        // IE
        else {
            var html = ''
                + '<body style="margin:0;">'
                + '<img src="' + url + '" style="max-width:100%;" />'
                + '</body>';
            var tab = window.open();
            tab.document.write(html);
        }
	}
	//与后台交互时冻结窗口
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);

});
function updateEcharts(echarts,data){

	echarts.setOption({
		title:{
			text:data.title,
			textStyle:buildTextStyle(data.title_font,data.title_size),
			x:data.titleX,
			y:data.titleY
		},
		xAxis :{
			name:data.xlab,
			nameTextStyle:buildTextStyle(data.xlab_font,data.xlab_size),
			splitLine:{
            	show:data.XgridShow
        	}
		},
		yAxis :{
			name:data.ylab,
			nameTextStyle:buildTextStyle(data.ylab_font,data.ylab_size),
			splitLine:{
            	show:data.YgridShow
        	}
		}
		
	});
}

function buildTextStyle(font,fontSize){
	var fontStyle,fontWeight;
	if(font=="bold"){
		fontWeight = 'bolder';
		fontStyle= 'normal';
	}else if(font=="italic"){
		fontWeight = 'normal';
		fontStyle= 'italic';
	}else{
		fontWeight = 'normal';
		fontStyle= 'normal';	
	}
	return {
		fontStyle:fontStyle,
		fontWeight:fontWeight,
		fontSize:fontSize
	}
}
function updateEchartsData(echarts,echartsStyle,echartsData,xAxisField,yAxisField,colorColumnField,sizeColumnField){
	var color = [];
	$(".spectrum").each(function(){
		var colorStr = $(this).spectrum("get").toHexString();
		color.push(colorStr);
	});
	var minValue=Number(vue.minValue);
	var maxValue=Number(vue.maxValue);
	if(echartsData&&echartsData.length>0){
		var option ={
			yAxis:{
				type:'category',
				data:[]
			},
			xAxis:{
				min:function(value){
					return value.min-5/100*(value.max-value.min);
				},
				max:function(value){
					return value.max+5/100*(value.max-value.min);
				}
			},
			series:[{
				type:"scatter",
				data:[]
			}],
			visualMap: [
				{
		            left: 'right',
		            bottom: '5%',
		            dimension: 2,
		        	min: minValue,
		        	max: maxValue,
		            itemHeight: 120,
		            calculable: true,
		            precision: 2,
		            text: [colorColumnField],
		            textGap: 20,
		            inRange: {
		                color:color
		            },
		            outOfRange: {
		                color: ['rgba(255,255,255,.2)']
		            },
		           	controller: {
		                outOfRange: {
		                    color: ['#444']
		                }
		            }
			    },
			    {
		            right: 0,
		            top: '10%',
		            dimension: 3,
		            itemWidth: 20,
		            itemHeight: 120,
		            calculable: true,
		            padding:[5,-30,5,0],
		            precision: 2,
		            text: [sizeColumnField],
		            textGap: 20,
		            inRange: {
		                symbolSize: [10, 20]
		            },
		            outOfRange: {
		                symbolSize: [10, 20],
		                color: ['rgba(255,255,255,.2)']
		            },
		            controller: {
		                inRange: {
		                    color: ['#c23531']
		                },
		                outOfRange: {
		                    color: ['#444']
		                }
		            }
		        }
			]
			
		};

		var heads = echartsData[0];
		var dataMap = {};//用来存储每一个系列的数据
		var yAxisData = [];//用来存储y轴的数据 只有类目轴才会用到
		var headIndexMap={};//用来存储每个表头对应的列数
		for(var i=0;i<heads.length;i++){//循环表头
			var headColumn = heads[i];
			headIndexMap[headColumn]=i;//将表头的列数存入map中
		}
		var sizeDatas=[]
		for(var i=1;i<echartsData.length;i++){
			var row = echartsData[i];
			var xVal = row[headIndexMap[xAxisField]];
			var yVal = row[headIndexMap[yAxisField]];
			var sizeVal = row[headIndexMap[sizeColumnField]];
			var colorVal = row[headIndexMap[colorColumnField]];
			if(yVal.length>=30){
				var sub=yVal.substring(0,25);
				yVal=sub+"....";
			}
			yAxisData.push(yVal);
			option.series[0].data.push([xVal,yVal,colorVal,sizeVal]);
			sizeDatas.push(sizeVal)
		}
		var maxNum=getMaximin(sizeDatas,'max');
		option.visualMap[1].max= maxNum;
		option.visualMap[1].min= 0;
		option.yAxis.data = yAxisData;
		echarts.setOption(option);	
	}
	
}

//---------------------------------------------------函数---------------------------
//求数组的最大最小值
function getMaximin(arr,maximin){ 
	if(maximin=="max") 
	{ 
	return Math.max.apply(Math,arr); 
	}
	else if(maximin=="min") 
	{ 
	return Math.min.apply(Math, arr); 
	} 
}
//支持下载pdf格式
function convertCanvasToImage() {
    html2canvas(document.getElementById('main'), {
        onrendered: function(canvas) {
            document.body.appendChild(canvas);
            createPDFObject(canvas.toDataURL("image/jpeg"));
        }
    });
}
function createPDFObject(imgData) {
    var doc = new jsPDF('p', 'pt');
    doc.addImage(imgData, 10, 10, 500, 340, 'img');
    doc.save('test.pdf');
}

//参数组装
function allParams(){
	var app = $("#parameter").serializeArray();
	var json1 = {};
	for(var i=0;i<app.length;i++){
			var name = app[i].name;
			var value = app[i].value;
			json1[name] = value;
	}
	return json1;
};

function allJsonParams(){

	var app = $("#parameter").serializeArray();
	var json1 = {};
	for(var i=0;i<app.length;i++){
			var name = app[i].name;
			var value = app[i].value;
			json1[name] = value;
	}
	var Params = JSON.stringify(json1);
	return Params
};

 
//-----------------------------------模态框-----------------------------------
//回车查目录是否存在
$(function(){
	//判断选择目录还是文件

	dblCilck('urlTable','inputUrl',paramUrl);  //双击行，判断是否是目录，若是，则进入目录。（三个参数：模态框中table的ID， input的ID， url为后台地址。）

	$('#inputUrl').bind('keypress',function(event){
		if(event.keyCode == "13")    
		{
			newUrl = $("#inputUrl").val();
			checkUrl(newUrl,paramUrl,"inputUrl","urlTable"); //参数依次为需要检查的URL， 后台的地址， 需要更新的输入框id， 需要刷新的bootstrap table
		}
	});
//点击右边箭头，检查	
	$("#search").click(function(){  
    	  newUrl = $("#inputUrl").val();
		  checkUrl(newUrl,paramUrl,"inputUrl","urlTable");
    });  
//后退按钮
	$("#back").click(function(){  
    	   Url= $("#inputUrl").val();
		   
		   lastLen =Url.split('/').pop().length
		   newUrl = Url.substring(0,Url.length - lastLen-1);
		   checkUrl(newUrl,paramUrl,"inputUrl","urlTable");
    }); 
//模态框绑定事件
	$('#selectUrl').on('show.bs.modal', function () {    //加载当前目录的表格
		var url = $("#inputUrl").val()? $("#inputUrl").val():'/';
 		checkUrl(url,paramUrl,"inputUrl","urlTable");
	});

});
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

//点击选择关闭模态框，将当前模态框input中的路径取出放入表单中,type 的类型 暂时有两种，dir和 file
function geturl(formInputId,type){
	var selected_num = checkedNum("urlTable");
	if(type == "dir"){
		//只能选择文件夹，单选
		var newUrl = ""

		if(selected_num == 1){
			//此时选中了一项，判断是否是目录
			var singleName = ""   //选择一个文件夹或者文件的名字，单选
			$.map($('#urlTable').bootstrapTable('getSelections'), function (row) {
				var d_f_type = "";
				d_f_type = row.type.charAt(0);
				if(d_f_type == "d"){
					singleName = row.name;
					newUrl = $("#inputUrl").val() + "/"+ singleName;    //点击选择时取input中当前的路径，在加上此时选择的
					newUrl = newUrl.replace('//','/');
					$("#selected").removeAttr("onClick");
					$("#selectUrl").modal('hide');
					
					$(formInputId).val(newUrl);	
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
		$.map($('#urlTable').bootstrapTable('getSelections'), function (row) {
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
				
				var filename_now = '/'+ $('#urlTable').bootstrapTable('getSelections')[0].name;
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

