var paramUrl = 'public/draw/json/jobUrl.json'; //module+'/Data/remoteDirView';  //选择路径的模态框，向后台请求的地址

$(function(){
	var color=["#37458b","#de1615","#0b8543","#991c54","#b11e23","#057e7c","#5b2379","#308cc6","#808080","#191717"];
	vue=new Vue({
		el:"#myTabContent",
		data:{
			input:"",
			title:"频率直方图",
			xlab:"无",
			ylab:"Y轴标题",
			fileData:{
				content:[]
			},
			title_size_sel:"18",
			title_font_sel:"bold",
			xlab_size_sel:"12",
			xlab_font_sel:"normal",
			ylab_size_sel:"12",
			ylab_font_sel:"normal",
			xColumnField_sel:null,
			groups:10,
			titleX_sel:"center",
			titleY_sel:"top",
			color:color,
			Xgrid:"show",
			Ygrid:"show",
			markLine:'show',
			computeType:'频率'
		},
		computed: {
			title_size: {
			    get: function () {
			      return this.title_size_sel;
			    },
			    set: function (newValue) {
			       this.title_size_sel = newValue;
			       $("#title_size").selectpicker("val",newValue);
			    }
			},
			title_font:{
			  	get: function () {
			      return this.title_font_sel;
			    },
			    set: function (newValue) {
			    	this.title_font_sel = newValue;
			       $("#title_font").selectpicker("val",newValue);
			    }
			},
			xlab_size:{
			  	get: function () {
			      return this.xlab_size_sel;
			    },
			    set: function (newValue) {
			    	this.xlab_size_sel = newValue;
			       $("#xlab_size").selectpicker("val",newValue);
			    }
			},
			xlab_font:{
			  	get: function () {
			      return this.xlab_font_sel;
			    },
			    set: function (newValue) {
			    	this.xlab_font_sel = newValue;
			       $("#xlab_font").selectpicker("val",newValue);
			    }
			},
			ylab_size:{
			  	get: function () {
			      return this.ylab_size_sel;
			    },
			    set: function (newValue) {
			    	this.ylab_size_sel = newValue;
			       $("#ylab_size").selectpicker("val",newValue);
			    }
			},
			ylab_font:{
			  	get: function () {
			      return this.ylab_font_sel;
			    },
			    set: function (newValue) {
			    	this.ylab_font_sel = newValue;
			       $("#ylab_font").selectpicker("val",newValue);
			    }
			},
			titleX:{
			  	get: function () {
			      return this.titleX_sel;
			   },
			    set: function (newValue) {
			    	if(!newValue) return;
			    	this.titleX_sel = newValue;
			       $("#titleX").selectpicker("val",newValue);
			    }
			},
			titleY:{
			  	get: function () {
			      return this.titleY_sel;
			   	},
			    set: function (newValue) {
			    	if(!newValue) return;
			    	this.titleY_sel = newValue;
			       $("#titleY").selectpicker("val",newValue);
			    }
			},
			xColumnField:{
			  	get: function () {
			      return this.xColumnField_sel;
			    },
			    set: function (newValue) {
			    	if(!newValue) return;
			    	this.xColumnField_sel = newValue;		    	
			        $("#xColumnField").selectpicker("val",newValue);
			    }
			},
			markLines:function(){
				if(this.markLine=="show"){
					return true;
				}else{
					return false;
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
		watch:{
			input:function(val,oldVal){
				$.ajax({
					url: 'public/draw/json/frequencyHistogramDrawFileData.json',  
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
				this.$nextTick(function(){
					$('#xColumnField').selectpicker('refresh');				
					this.xColumnField_sel=$('#xColumnField').selectpicker("val");
					$(".spectrum").spectrum({
						preferredFormat: "hex3"
					});
				});
			},
			xColumnField:function(val,oldVal){
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
	        y:vue.titleY,
	        top:20
	       
	    },
	    tooltip : {
//	        trigger: 'axis',
//	        showDelay : 0,
//	        axisPointer:{
//	            show: true,
//	            type : 'cross',
//	            lineStyle: {
//	                type : 'dashed',
//	                width : 1
//	            }
//	        },
//	        zlevel: 1
	    },
	    xAxis : [
	        {
	            nameLocation:'middle',
	            nameGap:30,
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
	            type : 'value',
	            nameLocation:'middle',
	            nameGap:40,
	            splitLine:{
                	show:vue.gridY,
                	lineStyle:{
                		type:'solid'
                	}
            	},
            	axisLine:{
            		show:false
            	},
            	axisTick:{
            		inside: true
            	}
	        }
	    ],
	    grid:{
	    	show:true,
	    	borderColor:'#000',
	    	top:45,
	    	bottom:60,
	    	left:80,
	    	right:60
	    	
	    }
	};
	
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
			$(this).children("td:eq("+index+")").addClass("active");
			$(this).children("td:eq("+index+")").siblings("td").removeClass("active");
		})
	});
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
	$("select").on("change.bs.select",function(){
		vue[$(this).attr("id")]=$(this).selectpicker("val");
	});
	vue.color=["#37458b"];
	$("#colorProject").on("change.bs.select",function(){
		if($(this).selectpicker("val")=="project1"){
			vue.color=color[0];
		}else if($(this).selectpicker("val")=="project2"){
			vue.color=color[1];
		}
		else{
			vue.color=color[2];
		}
	});
	//点击示例文件，加载已有参数
	$("#use_default").click(function(){
		$.ajax({
			url: 'public/draw/json/frequencyHistogramDraw.json',  
			type:'get',
			data:tool_id,
			dataType: "json",
			success:function(data) {
				//加载成功后将所有数据赋值给vue
				for(var item in data){
					vue[item]=data[item];
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
				url: 'public/draw/json/frequencyHistogramDrawFileData.json',  
				type:'get',
				data:{
					fileName:formData.input
				},
				dataType: "json",
				success:function(data) {
					myChart.hideLoading();
					updateEchartsData(myChart,formData,data["content"],vue.xColumnField,vue.markLines,vue.groups,vue.computeType);
				},    
				error : function(XMLHttpRequest) {
					alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);
				}
			});
		}
	});
	//支持下载png格式
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
	        pixelRatio: 8,
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
	var color = [];
	$(".spectrum").each(function(){
		var colorStr = $(this).spectrum("get").toHexString();
		color.push(colorStr);
	});
	echarts.setOption({
		color: color,
		title:{
			text:data.title,
			textStyle:buildTextStyle(data.title_font,data.title_size),
			x:data.titleX,
			y:data.titleY,
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
		},
		color:color
		
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

function updateEchartsData(echart,echartsStyle,echartsData,xAxisField,markLines,groups,computeType){
	if(echartsData&&echartsData.length>0){
		var option = {
			series:[],
			xAxis:{
			}
		};
		var xAxisIndex;
		for(var i=0;i<echartsData[0].length;i++){
			if(echartsData[0][i]==xAxisField){
				xAxisIndex=i;
			}
		}
		var resultData=[];
		for(var i=1;i<echartsData.length;i++){
			resultData.push(Number(echartsData[i][xAxisIndex]));
		}
		var maxData=getMaximin(resultData,"max");
		var minData=getMaximin(resultData,"min");
		
		var step = (maxData-minData)/groups;
		var datas =[];
		for(var i=0;i<groups;i++){
			datas.push({
				groupIndex:i,
				minValue:minData+step*i,
				maxValue:minData+step*i+step,
				count:0
			})
		}
		for(var i=0;i<resultData.length;i++){
			var value=resultData[i];
			for(var j=0;j<datas.length;j++){
				if(j==0){
					if(value>=datas[j].minValue&&value<=datas[j].maxValue){
						datas[j].count++;
					}
				}else{
					if(value>datas[j].minValue&&value<=datas[j].maxValue){
						datas[j].count++;
					}
				}

			}
		}
		var barData=[];
		var lineData=[];
		for(var i=0;i<datas.length;i++){
			if(computeType=="频率"){
				barData[i]=[(datas[i].minValue+datas[i].maxValue)/2,datas[i].count/resultData.length];
				lineData[i]=[(datas[i].minValue+datas[i].maxValue)/2,datas[i].count/resultData.length];
			}else{
				barData[i]=[(datas[i].minValue+datas[i].maxValue)/2,datas[i].count];
				lineData[i]=[(datas[i].minValue+datas[i].maxValue)/2,datas[i].count];
			}
		}

		option = {
		    xAxis: {
				min:minData,
				max:maxData,
				splitNumber:groups,
				interval:step,
				axisLabel:{
					formatter:function(value){
						return value.toFixed(1)
					}
				}
		    },
		    tooltip:{
			    trigger: 'axis',
		        formatter: function(parame){
		        	for(var i=0;i<parame.length;i++){
		        		return "x轴："+parame[i].data[0]+"<br/>y轴："+parame[i].data[1]
		        	}
		        }
		    },
		    series: [{
		        type: 'bar',
		        data: barData,
		        label: {
		            normal: {
		                show: true,
		                position: 'top'
		            }
		        }
		   	},{
		   		type:'line',
		   		data:[],
		   		smooth: true
			}]
		};
		
		if(markLines==true){
			option.series[1].data=lineData;
		}
		if(computeType=="频率"){
			option.series[0].label.normal.formatter=function(params){
							return params.value[1].toFixed(2)
						}
		}else{
			option.series[0].label.normal.formatter=function(params){
				return params.value[1].toFixed(0)
			}
		}
		
		
		
//		var girth=resultData;
//		var bins = ecStat.histogram(girth,function(){
//			return groups;
//		});
//		var interval;
//		var min = Infinity;
//		var max = -Infinity;
//		var data = echarts.util.map(bins.data, function (item, index) {
//			if(index>0){
//				var x0 = bins.bins[index].x0;
//		    	var x1 = bins.bins[index].x1;
//		    	interval = x1 - x0;
//		    	min = Math.min(0);
//		    	max = Math.max(max, x1);
//			}
//		    return [x0, x1, item[1]];
//		});
//		
//		function renderItem(params, api) {
//		    var yValue = api.value(2);
//		    var start = api.coord([api.value(0), yValue]);
//		    var size = api.size([api.value(1) - api.value(0), yValue]);
//		    var style = api.style();
//		    return {
//		        type: 'rect',
//		        shape: {
//		            x: start[0]+1,
//		            y: start[1],
//		            width: size[0] - 2,
//		            height: size[1]
//		        },
//		        style: style
//		    };
//		}
//		
//		var lineData=[]
//		for(var i=0;i<data.length;i++){
//			lineData[i]=[];
//			if(computeType=="频率"){
//				data[i][2]=(data[i][2]/resultData.length).toFixed(2);
//			}
//			lineData[i][0]=data[i][0]+interval/2;
//			lineData[i][1]=data[i][2];
//		}
//		option = {
//			    xAxis: [{
//			        type: 'value',
//			        min:min,
//			        max: max,
//			        interval: interval
//			    }],
//			    series: [{
//			        name: 'height',
//			        type: 'custom',
//			        renderItem: renderItem,
//			        label: {
//			            normal: {
//			                show: true,
//			                position: 'insideTop'
//			            }
//			        },
//			        encode: {
//			            x: [0, 1],
//			            y: 2,
////			            tooltip:2,
//			            label: 2
//			        },
//			        data: data
//			   	},{
//			   		type:'line',
//			   		data:[],
//			   		smooth: true
//			   	}]
//			};
//		if(groups>20){
//			option.series[0].label.normal.show=false
//		}
//
//		if(markLines==true){
//			option.series[1].data=lineData;
//		}

		echart.setOption(option);
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
	var pdfDiv=document.getElementById("pdf");
    html2canvas(document.getElementById('main'), {
        onrendered: function(canvas) {
            pdfDiv.appendChild(canvas);
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

