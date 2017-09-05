var paramUrl = 'public/draw/json/jobUrl.json'; //module+'/Data/remoteDirView';  //选择路径的模态框，向后台请求的地址
$(function(){
	vue=new Vue({
		el:"#myTabContent",
		data:{
			colorDefault:["#006600", "#5a9bd4", "#f15a60", "#cfcf1b", "#ff7500", "#c09853"] ,
			fileData:{
				content:[]
			},
			sampleList:[],
			show:false,
			vennType:"classic",
			statisticsPanel:"show",
			opacityVal:"20"
			
		},
		methods:{
			addSample:function(){
				if(this.sampleList.length == 6){
					alert();
					return;
				}
				this.sampleList.push({
					file:"",
					sampleName:"",
					color:""
				});
				$(".spectrum").spectrum({
					preferredFormat: "hex3"
				});
			},
			delSample:function(index){
				if(this.sampleList.length ==2){
					return;
				}
				this.sampleList.splice(index, 1);
			}
		},
		computed: {
			statistics:function(){
				if(this.statisticsPanel=="show"){
					return true;
				}else{
					return false;
				}
			},
			num_size: {
				cache:false,
			    get: function () {
			      return  $("#num_size").selectpicker("val");
			    },
			    set: function (newValue) {
			       	$("#num_size").selectpicker("val",newValue);
			    }
			},
			num_font:{
				cache:false,
			  	get: function () {
			      return $("#num_font").selectpicker("val");
			    },
			    set: function (newValue) {
			       	$("#num_font").selectpicker("val",newValue);
			    }
			},
			sample_size: {
				cache:false,
			    get: function () {
			      return  $("#sample_size").selectpicker("val");
			    },
			    set: function (newValue) {
			       	$("#sample_size").selectpicker("val",newValue);
			    }
			},
			sample_font:{
				cache:false,
			  	get: function () {
			      return $("#sample_font").selectpicker("val");
			    },
			    set: function (newValue) {
			       	$("#sample_font").selectpicker("val",newValue);
			    }
			}
		},
		watch:{
			sampleList:function(val,oldVal){
				this.$nextTick(function(){
					$(".spectrum").spectrum({
						preferredFormat: "hex3"
					});
				});
			},
			fileData:function(val,oldVal){
				for(var item in this.defaults){
						if(item!="input")
						vue[item]=this.defaults[item];
				}
			}
		}
	});
	vue.sampleList=[
				{
					file:"",
					sampleName:"",
					color:""
				},
				{
					file:"",
					sampleName:"",
					color:""
				}
			];
				
	
	//点击示例文件，加载已有参数
	$("#use_default").click(function(){
		$.ajax({
			url: 'public/draw/json/vennDraw.json',  
			type:'get',
			data:tool_id,
			dataType: "json",
			success:function(data) {
				//加载成功后将所有数据赋值给vue
				var sampleListSize = vue.sampleList.length;
				for(var item in data){
					if(item == "sampleList"){
						vue[item]= data[item].slice(0,sampleListSize);
					}else{
						vue[item]=data[item];
					}
					
				}
				vue.defaults = data;
			},    
			error : function(XMLHttpRequest) {
				alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);    
			}
		});
	});
	//提交参数
	$("#submit_paras").click(function(){
		var formData =[];
		for(var i=0;i<vue.sampleList.length;i++){
			formData.push(vue.sampleList.file)
		}
		$.ajax({
			url: 'public/draw/json/vennDrawFileData.json',  
			type:'get',
			data:{
				fileNames:formData
			},
			dataType: "json",
			success:function(data) {
				updateVennData($("#main"),data["files"],vue.sampleList,vue.vennType,vue.statistics,vue.num_size,vue.num_font,vue.sample_size,vue.sample_font,vue.opacityVal);
			},    
			error : function(XMLHttpRequest) {
				alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);
			}
		});
		
	});


	//支持下载png格式
	$("#btnPng").click(function(){
		$("#main-canvasExport").css('background', "#FFFFFF");
	  	$("#main-format-png").click();
	});

	//与后台交互时冻结窗口
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);

});



function updateVennData(el,filesVal,sampleList,vennType,statistics,num_size,num_font,sample_size,sample_font,opacityVal){
	var sets=[];
	var files = [];
	for(var i=0;i<sampleList.length;i++){
		var fileName=sampleList[i].file;
		var sampleName=sampleList[i].sampleName;
		for(var j=0;j<filesVal.length;j++){
			var file=filesVal[j];
			var fileName2=file.fileName;
			if(fileName==fileName2){
				file.sampleName=sampleName;
				files.push(file);
				break;
			}
		}
	}
	var seriesTable = new Array(); 
	for(var i=0; i<files.length; i++) {
		seriesTable.push({
			name: files[i].sampleName,
			data: files[i].fileContent
		});
	}
	var color = [];
	$(".spectrum").each(function(){
		var colorStr = $(this).spectrum("get").toHexString().colorRgb();
		color.push(colorStr);
	});

	var fontSize = Number(num_size);
	var fontFamily="Arial"
	var displayMode =vennType;
	var shortNumber = true;// true or false
	var displayStat = statistics;// true or false
	var displaySwitch = true; // true or false
	$("#main").jvenn({
		series: seriesTable,
		colors: color,
		fontSize:   fontSize,
		fontFamily: fontFamily,
		displayMode:   displayMode,
		shortNumber:   shortNumber,
		displayStat:   displayStat,
		displaySwitch: displaySwitch,
		fnClickCallback: function() {
			var value = "";
			if (this.listnames.length == 1) {
				value += "Elements only in ";
			} else {
				value += "Common elements in ";
			}
			for (name in this.listnames) {
				value += this.listnames[name] + " ";
			}
			value += ":\n";
			for (val in this.list) {
				value += this.list[val] + "\n";
			}
		}
	});
	console.log($('path[class^=square]'))
//	var opacityVal = self.opacityVal.trim() && !isNaN(self.opacityVal.trim()) ? self.opacityVal.trim() : self.opacityValOld;
        if (opacityVal && !isNaN(opacityVal)) {
          $('path[class^=square]').attr('fill-opacity', opacityVal / 100 >= 0.1 ? opacityVal / 100 : 0.1);
          $('path[class^=path]').next('g').children('path').attr('fill-opacity', opacityVal / 100 >= 0.1 ? opacityVal / 100 : 0.1);
        }
	
	console.log(opacityVal)
	var numFont=buildTextStyle(num_font);
	var sampleFont=buildTextStyle(sample_font);
	$('.number-black').css({'fontWeight':numFont.fontWeight,'fontStyle': numFont.fontStyle})
	$("[id^='main-label']").css({'fontWeight':sampleFont.fontWeight,'fontStyle': sampleFont.fontStyle,'fontSize':Number(sample_size)})
}


function buildTextStyle(font){
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
		fontWeight:fontWeight
	}
}



//---------------------------------------------------函数---------------------------
	//十六进制颜色转换成rgb
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
	String.prototype.colorRgb = function(){  
	    var sColor = this.toLowerCase();  
	    if(sColor && reg.test(sColor)){  
	        if(sColor.length === 4){  
	            var sColorNew = "#";  
	            for(var i=1; i<4; i+=1){  
	                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
	            }  
	            sColor = sColorNew;  
	        }  
	        //处理六位的颜色值  
	        var sColorChange = [];  
	        for(var i=1; i<7; i+=2){  
	            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
	        }  
	        return "RGB(" + sColorChange.join(",") + ")";  
	    }else{  
	        return sColor;    
	    }  
	};
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

