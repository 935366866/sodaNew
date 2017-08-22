var paramUrl = 'public/draw/json/jobUrl.json'; //module+'/Data/remoteDirView';  //选择路径的模态框，向后台请求的地址
	var color1=["#fff","pink","#4357a5"];
	var color2=["#fbfb92","#ea9100","#a50f00"];
	var color3=["#fff","#a0f8f0","#006edf"];
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
			color:[],
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
	    'Afghanistan':'阿富汗(Afghanistan)',
	    'Angola':'安哥拉(Angola)',
	    'Albania':'阿尔巴尼亚(Albania)',
	    'United Arab Emirates':'阿联酋(United Arab Emirates)',
	    'Argentina':'阿根廷(Argentina)',
	    'Armenia':'亚美尼亚(Armenia)',
	    'French Southern and Antarctic Lands':'法属南半球和南极领地(French Southern and Antarctic Lands)',
	    'Australia':'澳大利亚(Australia)',
	    'Austria':'奥地利(Austria)',
	    'Azerbaijan':'阿塞拜疆(Azerbaijan)',
	    'Burundi':'布隆迪(Burundi)',
	    'Belgium':'比利时(Belgium)',
	    'Benin':'贝宁(Benin)',
	    'Burkina Faso':'布基纳法索(Burkina Faso)',
	    'Bangladesh':'孟加拉国(Bangladesh)',
	    'Bulgaria':'保加利亚(Bulgaria)',
	    'The Bahamas':'巴哈马(The Bahamas)',
	    'Bosnia and Herzegovina':'波斯尼亚和黑塞哥维那(Bosnia and Herzegovina)',
	    'Belarus':'白俄罗斯(Belarus)',
	    'Belize':'伯利兹(Belize)',
	    'Bermuda':'百慕大(Bermuda)',
	    'Bolivia':'玻利维亚(Bolivia)',
	    'Brazil':'巴西(Brazil)',
	    'Brunei':'文莱(Brunei)',
	    'Bhutan':'不丹(Bhutan)',
	    'Botswana':'博茨瓦纳(Botswana)',
	    'Central African Rep.':'中非共和国(Central African Rep.)',
	    'Canada':'加拿大(Canada)',
	    'Switzerland':'瑞士()',
	    'Chile':'智利()',
	    'China':'中国(China)',
	    'Ivory Coast':'象牙海岸(Ivory Coast)',
	    'Cameroon':'喀麦隆(Cameroon)',
	    'Dem. Rep. Congo':'刚果民主共和国(Dem. Rep. Congo)',
	    'Congo':'刚果(Congo)',
	    'Colombia':'哥伦比亚(Colombia)',
	    'Costa Rica':'哥斯达黎加(Costa Rica)',
	    'Cuba':'古巴(Cuba)',
	    'Northern Cyprus':'北塞浦路斯(Northern Cyprus)',
	    'Cyprus':'塞浦路斯(Cyprus)',
	    'Czech Republic':'捷克共和国(Czech Republic)',
	    'Germany':'德国(Germany)',
	    'Djibouti':'吉布提(Djibouti)',
	    'Denmark':'丹麦(Denmark)',
	    'Dominican Republic':'多明尼加共和国(Dominican Republic)',
	    'Algeria':'阿尔及利亚(Algeria)',
	    'Ecuador':'厄瓜多尔(Ecuador)',
	    'Egypt':'埃及(Egypt)',
	    'Eritrea':'厄立特里亚(Eritrea)',
	    'Spain':'西班牙(Spain)',
	    'Estonia':'爱沙尼亚(Estonia)',
	    'Ethiopia':'埃塞俄比亚(Ethiopia)',
	    'Finland':'芬兰(Finland)',
	    'Fiji':'斐(Fiji)',
	    'Falkland Islands':'福克兰群岛(Falkland Islands)',
	    'France':'法国(France)',
	    'Gabon':'加蓬(Gabon)',
	    'United Kingdom':'英国(United Kingdom)',
	    'Georgia':'格鲁吉亚(Georgia)',
	    'Ghana':'加纳(Ghana)',
	    'Guinea':'几内亚(Guinea)',
	    'Gambia':'冈比亚(Gambia)',
	    'Guinea Bissau':'几内亚比绍(Guinea Bissau)',
	    'Equatorial Guinea':'赤道几内亚(Equatorial Guinea)',
	    'Greece':'希腊(Greece)',
	    'Greenland':'格陵兰(Greenland)',
	    'Guatemala':'危地马拉(Guatemala)',
	    'French Guiana':'法属圭亚那(French Guiana)',
	    'Guyana':'圭亚那(Guyana)',
	    'Honduras':'洪都拉斯(Honduras)',
	    'Croatia':'克罗地亚(Croatia)',
	    'Haiti':'海地(Haiti)',
	    'Hungary':'匈牙利(Hungary)',
	    'Indonesia':'印尼(Indonesia)',
	    'India':'印度(India)',
	    'Ireland':'爱尔兰(Ireland)',
	    'Iran':'伊朗(Iran)',
	    'Iraq':'伊拉克(Iraq)',
	    'Iceland':'冰岛(Iceland)',
	    'Israel':'以色列(Israel)',
	    'Italy':'意大利(Italy)',
	    'Jamaica':'牙买加(Jamaica)',
	    'Jordan':'约旦(Jordan)',
	    'Japan':'日本(Japan)',
	    'Kazakhstan':'哈萨克斯坦(Kazakhstan)',
	    'Kenya':'肯尼亚(Kenya)',
	    'Kyrgyzstan':'吉尔吉斯斯坦(Kyrgyzstan)',
	    'Cambodia':'柬埔寨(Cambodia)',
	    'Korea':'韩国(Korea)',
	    'Dem. Rep. Korea':'朝鲜(Dem. Rep. Korea)',
	    'Kosovo':'科索沃(Kosovo)',
	    'Kuwait':'科威特(Kuwait)',
	    'Lao PDR':'老挝(Lao PDR)',
	    'Lebanon':'黎巴嫩(Lebanon)',
	    'Liberia':'利比里亚(Liberia)',
	    'Libya':'利比亚(Libya)',
	    'Sri Lanka':'斯里兰卡(Sri Lanka)',
	    'Lesotho':'莱索托(Lesotho)',
	    'Lithuania':'立陶宛(Lithuania)',
	    'Luxembourg':'卢森堡(Luxembourg)',
	    'Latvia':'拉脱维亚(Latvia)',
	    'Morocco':'摩洛哥(Morocco)',
	    'Moldova':'摩尔多瓦(Moldova)',
	    'Madagascar':'马达加斯加(Madagascar)',
	    'Mexico':'墨西哥(Mexico)',
	    'Macedonia':'马其顿(Macedonia)',
	    'Mali':'马里(Mali)',
	    'Myanmar':'缅甸(Myanmar)',
	    'Montenegro':'黑山(Montenegro)',
	    'Mongolia':'蒙古(Mongolia)',
	    'Mozambique':'莫桑比克(Mozambique)',
	    'Mauritania':'毛里塔尼亚(Mauritania)',
	    'Malawi':'马拉维(Malawi)',
	    'Malaysia':'马来西亚(Malaysia)',
	    'Namibia':'纳米比亚(Namibia)',
	    'New Caledonia':'新喀里多尼亚(New Caledonia)',
	    'Niger':'尼日尔(Niger)',
	    'Nigeria':'尼日利亚(Nigeria)',
	    'Nicaragua':'尼加拉瓜(Nicaragua)',
	    'Netherlands':'荷兰(Netherlands)',
	    'Norway':'挪威(Norway)',
	    'Nepal':'尼泊尔(Nepal)',
	    'New Zealand':'新西兰(New Zealand)',
	    'Oman':'阿曼(Oman)',
	    'Pakistan':'巴基斯坦(Pakistan)',
	    'Panama':'巴拿马(Panama)',
	    'Peru':'秘鲁(Peru)',
	    'Philippines':'菲律宾(Philippines)',
	    'Papua New Guinea':'巴布亚新几内亚(Papua New Guinea)',
	    'Poland':'波兰(Poland)',
	    'Puerto Rico':'波多黎各(Puerto Rico)',
	    'North Korea':'北朝鲜(North Korea)',
	    'Portugal':'葡萄牙(Portugal)',
	    'Paraguay':'巴拉圭(Paraguay)',
	    'Qatar':'卡塔尔(Qatar)',
	    'Romania':'罗马尼亚(Romania)',
	    'Russia':'俄罗斯(Russia)',
	    'Rwanda':'卢旺达(Rwanda)',
	    'Western Sahara':'西撒哈拉()',
	    'Western Sahara':'西撒哈拉()',
	    'Saudi Arabia':'沙特阿拉伯(Saudi Arabia)',
	    'Sudan':'苏丹(Sudan)',
	    'S. Sudan':'南苏丹(S. Sudan)',
	    'Senegal':'塞内加尔(Senegal)',
	    'Solomon Islands':'所罗门群岛(Solomon Islands)',
	    'Sierra Leone':'塞拉利昂(Sierra Leone)',
	    'El Salvador':'萨尔瓦多(El Salvador)',
	    'Somaliland':'索马里兰(Somaliland)',
	    'Somalia':'索马里(Somalia)',
	    'Serbia':'塞尔维亚共和国(Serbia)',
	    'Suriname':'苏里南(Suriname)',
	    'Slovakia':'斯洛伐克(Slovakia)',
	    'Slovenia':'斯洛文尼亚(Slovenia)',
	    'Sweden':'瑞典(Sweden)',
	    'Swaziland':'斯威士兰(Swaziland)',
	    'Syria':'叙利亚(Syria)',
	    'Chad':'乍得(Chad)',
	    'Togo':'多哥(Togo)',
	    'Thailand':'泰国(Thailand)',
	    'Tajikistan':'塔吉克斯坦(Tajikistan)',
	    'Turkmenistan':'土库曼斯坦(Turkmenistan)',
	    'East Timor':'东帝汶(East Timor)',
	    'Trinidad and Tobago':'特里尼达和多巴哥(Trinidad and Tobago)',
	    'Tunisia':'突尼斯(Tunisia)',
	    'Turkey':'土耳其(Turkey)',
	    'Tanzania':'坦桑尼亚联合共和国(Tanzania)',
	    'Uganda':'乌干达(Uganda)',
	    'Ukraine':'乌克兰(Ukraine)',
	    'Uruguay':'乌拉圭(Uruguay)',
	    'United States':'美国(America)',
	    'Uzbekistan':'乌兹别克斯坦(Uzbekistan)',
	    'Venezuela':'委内瑞拉(Venezuela)',
	    'Vietnam':'越南(Vietnam)',
	    'Vanuatu':'瓦努阿图(Vanuatu)',
	    'West Bank':'西岸(West Bank)',
	    'Yemen':'也门(Yemen)',
	    'South Africa':'南非(South Africa)',
	    'Zambia':'赞比亚(Zambia)',
	    'Zimbabwe':'津巴布韦(Zimbabwe)'
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
	            },
            emphasis:{
                areaColor: null,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
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
		width:480,
		series:[]
	};
	
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
	$("select").on("change.bs.select",function(){
		vue[$(this).attr("id")]=$(this).selectpicker("val");
	});
	//颜色控件初始化开始
	vue.color=["#fff","pink","#4357a5"];
	console.info("341初始化");
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
		var colorStr = $(this).spectrum("get").toHexString();
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
		        precision:0,
		        inRange: {
		            color: dcolor
		        },
		        range:[Number(vue.minValue),Number(vue.maxValue)],
		        formatter:function(value){
                	return value;
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
		console.info(JSON.stringify(option));
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

