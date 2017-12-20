var paramUrl = 'public/draw/json/jobUrl.json'; //module+'/Data/remoteDirView';  //选择路径的模态框，向后台请求的地址

$(function(){	
	var color1=["#b09b84","#da9034","#cf151b","#7c5f47"];
	var color2=["#37458b","#de1615","#0b8543","#5b2379","#057e7c","#b11e23","#308cc6","#991c54","#808080","#191717"];
	var color3=["#4357a5","#c43c32","#719657","#eae185","#44657f","#ea8f10","#5ca8d1","#7c2163","#72be68","#cf91a2"];
	vue=new Vue({
		el:"#myTabContent",
		data:{
			input:"",
			title:"男性女性身高体重分布",
			xlab:"X轴标题",
			ylab:"Y轴标题",
			pointsize:"5",
			fileData:{
				content:[]
			},
			title_size_sel:"18",
			title_font_sel:"bold",
			xlab_size_sel:"12",
			xlab_font_sel:"normal",
			ylab_size_sel:"12",
			ylab_font_sel:"normal",
			titleX_sel:"",
			titleY_sel:"",
			legendDiameter:"80",
			legendX_sel:"center",
			legendY_sel:"bottom",
			legendLayout_sel:"horizontal",
			xColumnField_sel:null,
			yColumnField_sel:null,
			color:color1,
			Xgrid:"show",
			Ygrid:"show",
			legend:["man","woman"]
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
			legendX:{
			  	get: function () {
			      return this.legendX_sel;
			   	},
			    set: function (newValue) {
			    	if(!newValue) return;
			    	this.legendX_sel = newValue;
			       $("#legendX").selectpicker("val",newValue);
			    }
			},
			legendY:{
			  	get: function () {
			      return this.legendY_sel;
			   },
			    set: function (newValue) {
			    	this.legendY_sel = newValue;
			       $("#legendY").selectpicker("val",newValue);
			    }
			},
			legendLayout:{
			  	get: function () {
			      return this.legendLayout_sel;
			   	},
			    set: function (newValue) {
			    	this.legendLayout_sel = newValue;
			       $("#legendLayout").selectpicker("val",newValue);
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
			yColumnField:{
			  	get: function () {
			      return this.yColumnField_sel;
			    },
			    set: function (newValue) {
			    	if(!newValue) return;
			    	this.yColumnField_sel = newValue;
			        $("#yColumnField").selectpicker("val",newValue);
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
					url: 'public/draw/json/scatterDrawFileData-height.json',  
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
					$('#yColumnField').selectpicker('refresh');
					$('#xColumnField').selectpicker('refresh');
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
			yColumnField:function(val,oldVal){
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
	        text: ''
	    },
	    tooltip : {
	        showDelay : 0,
	        formatter : function (params) {
	            if (params.value.length > 1) {
	                return params.seriesName + ' :<br/>'
	                + params.value[0] + 'cm '
	                + params.value[1] + 'kg ';
	            }
	            else {
	                return params.seriesName + ' :<br/>'
	                + params.name + ' : '
	                + params.value + 'kg ';
	            }
	        },
	        axisPointer:{
	            show: true,
	            type : 'cross',
	            lineStyle: {
	                type : 'dashed',
	                width : 1
	            }
	        }
	    },
		toolbox: {
	        feature: {
	            dataZoom: {},
	            brush: {
	                type: ['rect', 'polygon', 'clear']
	            }
	        }
	    },
	    xAxis : [
	        {	
	        	type : 'value',
	            scale:true,
	            axisLabel : {
	                formatter: '{value} cm'
	            },
	            nameLocation:'middle',
	            nameGap: 23,
	            splitLine:{
                	show:vue.gridX,
                	lineStyle:{
                		type:'solid'
                	}
            	}	
	        }
	    ],
	    yAxis : [
	        {
	            type : 'value',
	            scale:true,
	            nameLocation:'middle',
	            nameGap: 60,
	            splitLine:{
                	show:vue.gridY,
                	lineStyle:{
                		type:'solid'
                	}
            	},
	            axisLabel : {
	                formatter: '{value} kg'
	            }
	        }
	    ],
	    grid:{
//	    	show:true,
	    	left:80
	    },
		legend: {
			y:vue.legendY,
			x:vue.legendX,
			orient:vue.legendLayout
		}
	};
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
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
	console.log(vue.pointsize)
	//点击示例文件，加载已有参数
	$("#use_default").click(function(){
		$.ajax({
			url: 'public/draw/json/scatterDraw-height.json',  
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
				url: 'public/draw/json/scatterDrawFileData-height.json',  
				type:'get',
				data:{
					fileName:formData.input
				},
				dataType: "json",
				success:function(data) {
					myChart.hideLoading();
					updateEchartsData(myChart,formData,data["content"]);
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
	        pixelRatio: 2,
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
		},
		legend:{
			x:data.legendX,
			y:data.legendY,
			orient:data.legendLayout
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
function updateEchartsData(echarts,echartsStyle,echartsData){
	if(echartsData&&echartsData.length>0){
		var option = echarts.getOption();
		option.series=[];
//		echarts.clear();
		var heads = echartsData[0];
		var sexIndex;
		var heightIndex;
		var weightIndex;
		var dataMap = {};//用来存储每一个系列的数据
		for(var i=0;i<heads.length;i++){//循环表头
			if(heads[i]=="sex"){
				sexIndex=i;
			}else if(heads[i]=="height"){
				heightIndex=i;
			}else{
				weightIndex=i;
			}
		}
		var mandatas=[];
		var womanDatas=[];
		for(var i=1;i<echartsData.length;i++){
			var row=echartsData[i]
			var sex=row[sexIndex];	
			var manData=[];
			var womanData=[];
			if(sex=="man"){
				manData[0]=row[heightIndex];
				manData[1]=row[weightIndex];
				mandatas.push(manData);
			}else{
				womanData[0]=row[heightIndex];
				womanData[1]=row[weightIndex];
				womanDatas.push(womanData);
			}
		}
	
		dataMap["man"] = {
					type:"scatter",
					symbolSize: echartsStyle.pointsize,
					name:"man",
					data:[],
					markArea: {
		                silent: true,
		                itemStyle: {
		                    normal: {
		                        color: 'transparent',
		                        borderWidth: 1,
		                        borderType: 'dashed'
		                    }
		                },
		                data: [[{
		                    name: '男性分布区间',
		                    xAxis: 'min',
		                    yAxis: 'min'
		                }, {
		                    xAxis: 'max',
		                    yAxis: 'max'
		                }]]
		            },
		            markPoint : {
		                data : [
		                    {type : 'max', name: '最大值'},
		                    {type : 'min', name: '最小值'}
		                ]
		            },
		            markLine : {
		                lineStyle: {
		                    normal: {
		                        type: 'solid'
		                    }
		                },
		                data : [
		                    {type : 'average', name: '平均值'},
		                    { xAxis: 170 }
		                ]
		            }
				}
		dataMap["man"]["data"]=mandatas;
		dataMap["woman"] = {
					type:"scatter",
					symbolSize: echartsStyle.pointsize,
					name:"woman",
					data:[],
					markArea: {
		                silent: true,
		                itemStyle: {
		                    normal: {
		                        color: 'transparent',
		                        borderWidth: 1,
		                        borderType: 'dashed'
		                    }
		                },
		                data: [[{
		                    name: '女性分布区间',
		                    xAxis: 'min',
		                    yAxis: 'min'
		                }, {
		                    xAxis: 'max',
		                    yAxis: 'max'
		                }]]
		            },
		            markPoint : {
		                data : [
		                    {type : 'max', name: '最大值'},
		                    {type : 'min', name: '最小值'}
		                ]
		            },
		            markLine : {
		                lineStyle: {
		                    normal: {
		                        type: 'solid'
		                    }
		                },
		                data : [
		                    {type : 'average', name: '平均值'},
		                    { xAxis: 160 }
		                ]
		            }
				}
		dataMap["woman"]["data"]=womanDatas;
		option.legend={};
		option.legend.data=["man","woman"];
		for(var key in dataMap){
			option.series.push(dataMap[key])
		}
		
		var numD=parseInt(echartsStyle.legendDiameter);
		option.legend.itemHeight=numD;
		option.legend.itemWidth=numD;

		echarts.setOption(option);	
	}
	
}

//---------------------------------------------------函数---------------------------
//支持下载pdf格式
function convertCanvasToImage() {
	var pdfDiv=document.getElementById('pdf')
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

