$(function(){
    //清除所有input
    $(".buy-space-l input").val("");
    //加一
    $(".add").on("click",function(){
        var num = $(this).prevAll("input").val();
        
        if(isNaN(num)){
            alert("您输入的不是有效数字！");
            $(this).prevAll("input").val("");
        }else{
            var now = parseFloat(num) + 1.0;
            $(this).prevAll("input").val(now);
        };

    });
    //减一
    $(".sub").on("click",function(){
        var num = $(this).prevAll("input").val();
        
        if(isNaN(num)){
            alert("您输入的不是有效数字！");
            $(this).prevAll("input").val("");
        }else{
            var now = parseFloat(num) - 1.0;
            $(this).prevAll("input").val(now);
        };
    });
    //失焦事件
    $(".buy-space-l input").blur(function(){
        var num = $(this).val();      
        if(isNaN(num)){
            alert("您输入的不是有效数字！");
            $(this).val("");
        }else{
            compute($(this));
        };
    });
    //立即购买
    $("#buy_now").on("click",function(){
        var num = $(this).prevAll("input").val();
        //参数的收集
        var hot_gb = $($(".buy-space-hot").find("input")[0]).val();
        var hot_days = $($(".buy-space-hot").find("input")[1]).val();
        var cool_gb = $($(".buy-space-cool").find("input")[0]).val();
        var cool_days = $($(".buy-space-cool").find("input")[1]).val();

        
        if(hot_gb && hot_days && cool_gb && cool_days){ //所有的数据
            console.log(hot_gb,hot_days,cool_gb,cool_days)
            myAjax("json/t1.json",{hot_GB:hot_gb,hot_daytime:hot_days,cold_GB:cool_gb,cold_daytime:cool_days},send_success);
        }else{
            if(hot_gb && hot_days){//热存储
                myAjax("json/t1.json",{hot_GB:hot_gb,hot_daytime:hot_days},send_success);

            }else if(cool_gb && cool_days){//冷存储
                myAjax("json/t1.json",{cold_GB:cool_gb,cold_daytime:cool_days},send_success);
            }else{
                alert("订单信息填写不正确！")
            };

        };
    });
});

function compute(obj){
    //传进来object
    
    //判断冷热存储
    var type = $(obj.closest(".buy")).prev().find("h3").attr("class");
    //当前冷、热存储的价格
    var gb = $(obj.closest(".buy").find("input")[0]).val();
    var days = $(obj.closest(".buy").find("input")[1]).val();
    var hot_unit_price = 1.5;
    var cool_unit_price = 1;

    //当两个值都存在的时候
    if(days && gb ){
        if(type == "hot"){
            if(days>=100){
                var part_sum = gb * hot_unit_price *days*0.88;
                obj.closest(".buy").find(".buy-r h3 span").text(part_sum);
                var sum =  parseFloat($("#cool_sum").text())+part_sum;
                $("#all_sum").text(sum);
            }else{
                var part_sum = gb * hot_unit_price *days;
                obj.closest(".buy").find(".buy-r h3 span").text(part_sum);
                var sum =  parseFloat($("#cool_sum").text())+part_sum;
                $("#all_sum").text(sum);
            };   
        }else{
            if(days>=100){
                var part_sum = gb*cool_unit_price*days*0.88;
                obj.closest(".buy").find(".buy-r h3 span").text(part_sum);
                var sum =  parseFloat($("#hot_sum").text())+part_sum;
                $("#all_sum").text(sum);
            }else{
                var part_sum = gb*cool_unit_price*days;
                obj.closest(".buy").find(".buy-r h3 span").text(part_sum);
                var sum =  parseFloat($("#hot_sum").text())+part_sum;
                $("#all_sum").text(sum);
            };   
        };
   
    };
    
};

function send_success(){
    //alert("提交成功！");
}