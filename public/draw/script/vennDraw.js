var paramUrl = 'public/draw/json/jobUrl.json'; //module+'/Data/remoteDirView';  //选择路径的模态框，向后台请求的地址
	var color1=["#fff","#4357a5"];
	var color2=["#f9f98c","#a50026"];
	var color3=["#a0f8f0","#006edf"];
$(function(){
	vue=new Vue({
		el:"#myTabContent",
		data:{
			fileData:{
				content:[]
			},
			sampleList:[
				{
					file:"",
					sampleName:""
				},
				{
					file:"",
					sampleName:""
				}
			],
			show:false
		},
		methods:{
			addSample:function(){
				if(this.sampleList.length == 6){
					alert();
					return;
				}
				this.sampleList.push({
					file:"",
					sampleName:""
				});
			},
			delSample:function(index){
				if(this.sampleList.length ==2){
					alert();
					return;
				}
				this.sampleList.splice(index, 1);
			}
		},
		computed: {
		
		},
		watch:{
			
		}
	});


	
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
				updateVennData($("#main"),data["files"],vue.sampleList);
			},    
			error : function(XMLHttpRequest) {
				alert(XMLHttpRequest.status +' '+ XMLHttpRequest.statusText);
			}
		});
		
	});


	//支持下载png格式
	$("#btnPng").click(function(){
		var svgXml = $('#main').html();
		var image = new Image();
		image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgXml))); //给图片对象写入base64编码的svg流
		
		var canvas = document.createElement('canvas');  //准备空画布
		canvas.width = $('#main svg').width();
		canvas.height = $('#main svg').height();
		
		var context = canvas.getContext('2d');  //取得画布的2d绘图上下文
		context.drawImage(image, 0, 0);
		
		var a = document.createElement('a');
		a.href = canvas.toDataURL('image/png');  //将画布内的信息导出为png图片数据
		a.download = "MapByMathArtSys";  //设定下载名称
		a.click(); //点击触发下载	
	});






	//与后台交互时冻结窗口
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);

});

function updateVennData(el,filesVal,sampleList){
	var sets=[];
	var files = [];
	for(var i=0;i<sampleList.length;i++){
		var fileName=sampleList[i].file;
		var sampleName=sampleList[i].sampleName;
		for(var j=0;j<filesVal.length;j++){
			var file=filesVal[j];
			var fileName2=file.fileName;
			if(fileName==fileName2){
				file.sampleName=[sampleName];
				files.push(file);
				break;
			}
		}
	}
	for(var i=0;i<files.length;i++){
		sets.push({
			sets:files[i].sampleName, 
			size:files[i].fileContent.length
		});
	}
	var twoSame = [];
	for(var i=0;i<files.length;i++){
		var file1 = files[i];
		for(var j=i+1;j<files.length;j++){
			var file2 = files[j];
			var result = sameItemArr(file1,file2);
			twoSame.push(result);
			sets.push({
				sets:result.sampleName, 
				size:result.fileContent.length}
			);
		}
	}
	if(files.length>=3){
		var threeSame = [];
		var threeSampleNameArr = [];
		for(var i=0;i<twoSame.length;i++){
			var two = twoSame[i];
			for(var j=0;j<files.length;j++){
				var file2 = files[j];
				if(two.sampleName.indexOf(file2.sampleName[0]) != -1){//如果已经是包含他的并集 跳过
					continue;
				}
				var result = sameItemArr(two,file2);
				var isHas = false;
				for(var k=0;k<threeSampleNameArr.length;k++){
					if(arrEquals(threeSampleNameArr[k],result.sampleName)){
						isHas = true;
					}
				}
				if(isHas){
					continue;
				}
				
				threeSampleNameArr.push(result.sampleName);
				threeSame.push(result);
				sets.push({
					sets:result.sampleName, 
					size:result.fileContent.length}
				);
			}
		}
		console.log(threeSame);
	}
	
	if(files.length>=4){
		var fourSame = [];
		var fourSampleNameArr = [];
		for(var i=0;i<threeSame.length;i++){
			var three = threeSame[i];
			for(var j=0;j<files.length;j++){
				var file2 = files[j];
				if(three.sampleName.indexOf(file2.sampleName[0]) != -1){//如果已经是包含他的并集 跳过
					continue;
				}
				var result = sameItemArr(three,file2);
				var isHas = false;
				for(var k=0;k<fourSampleNameArr.length;k++){
					if(arrEquals(fourSampleNameArr[k],result.sampleName)){
						isHas = true;
					}
				}
				if(isHas){
					continue;
				}
				
				fourSampleNameArr.push(result.sampleName);
				fourSame.push(result);
				sets.push({
					sets:result.sampleName, 
					size:result.fileContent.length}
				);
			}
		}
		console.log(fourSame);
	}
	
	if(files.length>=5){
		var fiveSame = [];
		var fiveSampleNameArr = [];
		for(var i=0;i<fourSame.length;i++){
			var four = fourSame[i];
			for(var j=0;j<files.length;j++){
				var file2 = files[j];
				if(four.sampleName.indexOf(file2.sampleName[0]) != -1){//如果已经是包含他的并集 跳过
					continue;
				}
				var result = sameItemArr(four,file2);
				var isHas = false;
				for(var k=0;k<fiveSampleNameArr.length;k++){
					if(arrEquals(fiveSampleNameArr[k],result.sampleName)){
						isHas = true;
					}
				}
				if(isHas){
					continue;
				}
				fiveSampleNameArr.push(result.sampleName);
				fiveSame.push(result);
				sets.push({
					sets:result.sampleName, 
					size:result.fileContent.length}
				);
			}
		}
		console.log(fiveSame);
	}
	
	if(files.length>=6){
		var sixSame = [];
		var sixSampleNameArr = [];
		for(var i=0;i<fiveSame.length;i++){
			var five = fiveSame[i];
			for(var j=0;j<files.length;j++){
				var file2 = files[j];
				if(five.sampleName.indexOf(file2.sampleName[0]) != -1){//如果已经是包含他的并集 跳过
					continue;
				}
				var result = sameItemArr(five,file2);
				var isHas = false;
				for(var k=0;k<sixSampleNameArr.length;k++){
					if(arrEquals(sixSampleNameArr[k],result.sampleName)){
						isHas = true;
					}
				}
				if(isHas){
					continue;
				}
				sixSampleNameArr.push(result.sampleName);
				sixSame.push(result);
				sets.push({
					sets:result.sampleName, 
					size:result.fileContent.length}
				);
			}
		}
		console.log(sixSame);
	}
	
var chart = venn.VennDiagram()
    chart.wrap(false) 
    .width(450)
    .height(450);

var div = d3.select("#main").datum(sets).call(chart);

var tooltip = d3.select("body").append("div")
    .attr("class", "venntooltip");

div.selectAll("path")
    .style("stroke-opacity", 0)
    .style("stroke", "#fff")
    .style("stroke-width", 3)

div.selectAll("g")
    .on("mouseover", function(d, i) {
        // sort all the areas relative to the current item
        venn.sortAreas(div, d);

        // Display a tooltip with the current size
        tooltip.transition().duration(400).style("opacity", .8);
        tooltip.text(d.size);

        // highlight the current path
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
            .style("stroke-opacity", 1);
    })

    .on("mousemove", function() {
        tooltip.style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
    })

    .on("mouseout", function(d, i) {
        tooltip.transition().duration(400).style("opacity", 0);
        var selection = d3.select(this).transition("tooltip").duration(400);
        selection.select("path")
            .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
            .style("stroke-opacity", 0);
    });
    var colours = ['black', 'red', 'blue','green','yellow','pink'];
	d3.selectAll("#main .venn-circle path")
    .style("fill", function(d,i) { return colours[i]; });

}



function arrEquals(arr1,arr2){
	if(arr1.length != arr2.length){
		return false;
	}
	for(var i=0;i<arr1.length;i++){
		if(arr2.indexOf(arr1[i])==-1){
			return false;
		}
	}
	return true;
}
function sameItemArr(file1,file2){
	var result={
		fileName:"",
		sampleName:[],
		fileContent:[]
	}
	result.fileName = file1.fileName+";"+file2.fileName;
	result.sampleName = file1.sampleName.concat(file2.sampleName);
	
	for(var i=0;i<file1.fileContent.length;i++){
		var record1=file1.fileContent[i];
		for(var j=0;j<file2.fileContent.length;j++){
			var record2=file2.fileContent[j];
			if(record1 == record2){
				result.fileContent.push(record1);
				break;
			}
		}
	}
	return result;
}

//---------------------------------------------------函数---------------------------

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

