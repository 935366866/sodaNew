var paramUrl = 'public/draw/json/jobUrl.json'; //module+'/Data/remoteDirView';  //选择路径的模态框，向后台请求的地址
	var color1=["#fff","pink","#4357a5"];
	var color2=["#f9f98c","green","#a50026"];
	var color3=["#a0f8f0","red","#006edf"];
$(function(){
	vue=new Vue({
		el:"#myTabContent",
		data:{
			input:"",
			title:"",
			fileData:{
				content:[]
			},
			title_size_sel:"",
			title_font_sel:"",
			titleX_sel:"",
			titleY_sel:"",
			color:color1,
			minValue:0,
			middleValue:15,
			maxValue:30
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
			}
		},
		watch:{
			input:function(val,oldVal){
				$.ajax({
					url: 'public/draw/json/worldMapDrawFileData.json',  
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
	
	
	var nameMap = {
	    'Afghanistan':'阿富汗',
	    'Angola':'安哥拉',
	    'Albania':'阿尔巴尼亚',
	    'United Arab Emirates':'阿联酋',
	    'Argentina':'阿根廷',
	    'Armenia':'亚美尼亚',
	    'French Southern and Antarctic Lands':'法属南半球和南极领地',
	    'Australia':'澳大利亚',
	    'Austria':'奥地利',
	    'Azerbaijan':'阿塞拜疆',
	    'Burundi':'布隆迪',
	    'Belgium':'比利时',
	    'Benin':'贝宁',
	    'Burkina Faso':'布基纳法索',
	    'Bangladesh':'孟加拉国',
	    'Bulgaria':'保加利亚',
	    'The Bahamas':'巴哈马',
	    'Bosnia and Herzegovina':'波斯尼亚和黑塞哥维那',
	    'Belarus':'白俄罗斯',
	    'Belize':'伯利兹',
	    'Bermuda':'百慕大',
	    'Bolivia':'玻利维亚',
	    'Brazil':'巴西',
	    'Brunei':'文莱',
	    'Bhutan':'不丹',
	    'Botswana':'博茨瓦纳',
	    'Central African Republic':'中非共和国',
	    'Canada':'加拿大',
	    'Switzerland':'瑞士',
	    'Chile':'智利',
	    'China':'中国',
	    'Ivory Coast':'象牙海岸',
	    'Cameroon':'喀麦隆',
	    'Democratic Republic of the Congo':'刚果民主共和国',
	    'Republic of the Congo':'刚果共和国',
	    'Colombia':'哥伦比亚',
	    'Costa Rica':'哥斯达黎加',
	    'Cuba':'古巴',
	    'Northern Cyprus':'北塞浦路斯',
	    'Cyprus':'塞浦路斯',
	    'Czech Republic':'捷克共和国',
	    'Germany':'德国',
	    'Djibouti':'吉布提',
	    'Denmark':'丹麦',
	    'Dominican Republic':'多明尼加共和国',
	    'Algeria':'阿尔及利亚',
	    'Ecuador':'厄瓜多尔',
	    'Egypt':'埃及',
	    'Eritrea':'厄立特里亚',
	    'Spain':'西班牙',
	    'Estonia':'爱沙尼亚',
	    'Ethiopia':'埃塞俄比亚',
	    'Finland':'芬兰',
	    'Fiji':'斐',
	    'Falkland Islands':'福克兰群岛',
	    'France':'法国',
	    'Gabon':'加蓬',
	    'United Kingdom':'英国',
	    'Georgia':'格鲁吉亚',
	    'Ghana':'加纳',
	    'Guinea':'几内亚',
	    'Gambia':'冈比亚',
	    'Guinea Bissau':'几内亚比绍',
	    'Equatorial Guinea':'赤道几内亚',
	    'Greece':'希腊',
	    'Greenland':'格陵兰',
	    'Guatemala':'危地马拉',
	    'French Guiana':'法属圭亚那',
	    'Guyana':'圭亚那',
	    'Honduras':'洪都拉斯',
	    'Croatia':'克罗地亚',
	    'Haiti':'海地',
	    'Hungary':'匈牙利',
	    'Indonesia':'印尼',
	    'India':'印度',
	    'Ireland':'爱尔兰',
	    'Iran':'伊朗',
	    'Iraq':'伊拉克',
	    'Iceland':'冰岛',
	    'Israel':'以色列',
	    'Italy':'意大利',
	    'Jamaica':'牙买加',
	    'Jordan':'约旦',
	    'Japan':'日本',
	    'Kazakhstan':'哈萨克斯坦',
	    'Kenya':'肯尼亚',
	    'Kyrgyzstan':'吉尔吉斯斯坦',
	    'Cambodia':'柬埔寨',
	    'South Korea':'韩国',
	    'Kosovo':'科索沃',
	    'Kuwait':'科威特',
	    'Laos':'老挝',
	    'Lebanon':'黎巴嫩',
	    'Liberia':'利比里亚',
	    'Libya':'利比亚',
	    'Sri Lanka':'斯里兰卡',
	    'Lesotho':'莱索托',
	    'Lithuania':'立陶宛',
	    'Luxembourg':'卢森堡',
	    'Latvia':'拉脱维亚',
	    'Morocco':'摩洛哥',
	    'Moldova':'摩尔多瓦',
	    'Madagascar':'马达加斯加',
	    'Mexico':'墨西哥',
	    'Macedonia':'马其顿',
	    'Mali':'马里',
	    'Myanmar':'缅甸',
	    'Montenegro':'黑山',
	    'Mongolia':'蒙古',
	    'Mozambique':'莫桑比克',
	    'Mauritania':'毛里塔尼亚',
	    'Malawi':'马拉维',
	    'Malaysia':'马来西亚',
	    'Namibia':'纳米比亚',
	    'New Caledonia':'新喀里多尼亚',
	    'Niger':'尼日尔',
	    'Nigeria':'尼日利亚',
	    'Nicaragua':'尼加拉瓜',
	    'Netherlands':'荷兰',
	    'Norway':'挪威',
	    'Nepal':'尼泊尔',
	    'New Zealand':'新西兰',
	    'Oman':'阿曼',
	    'Pakistan':'巴基斯坦',
	    'Panama':'巴拿马',
	    'Peru':'秘鲁',
	    'Philippines':'菲律宾',
	    'Papua New Guinea':'巴布亚新几内亚',
	    'Poland':'波兰',
	    'Puerto Rico':'波多黎各',
	    'North Korea':'北朝鲜',
	    'Portugal':'葡萄牙',
	    'Paraguay':'巴拉圭',
	    'Qatar':'卡塔尔',
	    'Romania':'罗马尼亚',
	    'Russia':'俄罗斯',
	    'Rwanda':'卢旺达',
	    'Western Sahara':'西撒哈拉',
	    'Saudi Arabia':'沙特阿拉伯',
	    'Sudan':'苏丹',
	    'South Sudan':'南苏丹',
	    'Senegal':'塞内加尔',
	    'Solomon Islands':'所罗门群岛',
	    'Sierra Leone':'塞拉利昂',
	    'El Salvador':'萨尔瓦多',
	    'Somaliland':'索马里兰',
	    'Somalia':'索马里',
	    'Republic of Serbia':'塞尔维亚共和国',
	    'Suriname':'苏里南',
	    'Slovakia':'斯洛伐克',
	    'Slovenia':'斯洛文尼亚',
	    'Sweden':'瑞典',
	    'Swaziland':'斯威士兰',
	    'Syria':'叙利亚',
	    'Chad':'乍得',
	    'Togo':'多哥',
	    'Thailand':'泰国',
	    'Tajikistan':'塔吉克斯坦',
	    'Turkmenistan':'土库曼斯坦',
	    'East Timor':'东帝汶',
	    'Trinidad and Tobago':'特里尼达和多巴哥',
	    'Tunisia':'突尼斯',
	    'Turkey':'土耳其',
	    'United Republic of Tanzania':'坦桑尼亚联合共和国',
	    'Uganda':'乌干达',
	    'Ukraine':'乌克兰',
	    'Uruguay':'乌拉圭',
	    'United States of America':'美国',
	    'Uzbekistan':'乌兹别克斯坦',
	    'Venezuela':'委内瑞拉',
	    'Vietnam':'越南',
	    'Vanuatu':'瓦努阿图',
	    'West Bank':'西岸',
	    'Yemen':'也门',
	    'South Africa':'南非',
	    'Zambia':'赞比亚',
	    'Zimbabwe':'津巴布韦'
	};
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
	        top:30
	    },
		tooltip: {
		    trigger: 'item',
			formatter: '{b}'
		},
		geo: {
	        map: 'world',
	        nameMap:nameMap,
	        label: {
	        	normal:{
	        		show:false
	        	},
	            emphasis: {
	                show: true
	            }
	        },
	        itemStyle: {
	            normal: {
	            	color:"#ccc",
	                areaColor: '#fff',
	                borderColor: '#111'
	            }
	        },
			label:{
                normal: {
                    show:false,
                    formatter: function (params) {
                        return nameMap[params.name];
                    }
                },
                emphasis: {
                    label:{
                        show:true
                    }
                }
            }
		},
		series:[]
	};
	
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
	$("select").on("change.bs.select",function(){
		vue[$(this).attr("id")]=$(this).selectpicker("val");
	});
	//颜色控件初始化开始
	vue.color=["#fff","pink","#4357a5"];
	//颜色控件初始化结束
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
	//点击示例文件，加载已有参数
	$("#use_default").click(function(){
		$.ajax({
			url: 'public/draw/json/worldMapDraw.json',  
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
				url: 'public/draw/json/worldMapDrawFileData.json',  
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
	        pixelRatio: 7,
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
			y:data.titleY,
		},
		toolbox: {
	        show: true,
	        orient: 'vertical',
	        right:20,
	        itemGap: 18,
	        top: 'center',
	        feature: {
	            dataView: {readOnly: false},
	            restore: {},
	            saveAsImage: {}
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
function updateEchartsData(echartsInstance,echartsStyle,echartsData){
	var dcolor = [];
	$(".spectrum").each(function(){
		var colorStr = $(this).val();
		dcolor.push(colorStr);
	});

	if(echartsData&&echartsData.length>0){
		var option = {
			series:[],
			visualMap: {
		        min: Number(vue.minValue),
		        max: Number(vue.maxValue),
		        calculable: true,
		        text: ['高','低'],  
		        left: '20',
		        top: 'bottom',
		        inRange: {
		            color: dcolor
		        }
		    }
		};
		
		var dataIndexMap = {};//数据列名列索引映射 {"地名":0,"经度":1,"维度":2}
		var placeNameIndex = -1,
			lonIndex = -1,
			latIndex = -1;
		var mapSerieMap = {};
		var headers = echartsData[0];//获取表头行
		for(var i=0;i<headers.length;i++){//遍历表头行
			var head = headers[i];//获取到一个表头
			if(head == "地名"){
				placeNameIndex = i;
			}else if(head == "经度"){
				latIndex = i;
			}else if(head == "纬度"){
				lonIndex = i;
			}else{
				dataIndexMap[head] = i;
				var seriesItem = {
					name:head,
					type:"map",
					geoIndex: 0,
				    roam: true,
		            itemStyle:{
		                emphasis:{
		                	label:{
		                		show:true
		                	}
		                	
		                }
		            },
					data:[]
				};
				mapSerieMap[head]=seriesItem;
				option.series.push(seriesItem);
			}
		}
		if(lonIndex == -1){
			alert("维度数据不存在");
			return;
		}
		if(latIndex == -1){
			alert("经度数据不存在");
			return;
		}
		for(var i=1;i<echartsData.length;i++){//遍历数据
			var rowData = echartsData[i];
			var lat = rowData[latIndex];
			var lon =  rowData[lonIndex];
			var  placeName = rowData[placeNameIndex];
			var coordSysList = echartsInstance._coordSysMgr.getCoordinateSystems();
			if(coordSysList&&coordSysList.length>0){
			 	if(coordSysList[0]&&coordSysList[0].getRegionByCoord){
			 		var region =  coordSysList[0].getRegionByCoord([lat,lon]);
			 		if(region){
			 			placeName=region.name;
			 		}
			 	}
			}
			
			for(key in dataIndexMap){
				var index = dataIndexMap[key];
				var data = rowData[index];
				mapSerieMap[key].data.push({
					name:placeName,
					value:data
				});
			}
		}
		
		console.log(option);
		echartsInstance.setOption(option);
	}
}

//---------------------------------------------------函数---------------------------
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

