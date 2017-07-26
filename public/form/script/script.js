
$(function(){
    //清空表格
    
    $("#each_input input").val("");
    //发送验证码
    $("#send_code").on("click",function(){
        var data = $(".input #phone").val();
        var a = /^((\d3)|(\d{3}\-))?13\d{9}|14[57]\d{8}|15\d{9}|18\d{9}$/ ;  
        if(data != ""){
            if(data.length != 11 || !data.match(a)){
                alert("请输入正确手机号！");
            }else{
                myAjax("json/search.json",{phone:data},code_success);
            };
        }else{
            alert("手机号不能为空！");
        };
    });

    //邮箱验证
    $("#change_by_mail").on("click",function(){
        var data = $(".input #email").val();
        var a = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/ ;  
        if(data != ""){
            if(!data.match(a)){
                alert("请输入正确邮箱！");
            }else{
                myAjax("json/search.json",{mail:data},email_success);
            };
        }else{
            alert("邮箱不能为空！");
        };
    });
    
});

//===================函数===============
function code_success(){
    alert("已发送至您的手机，请查收！");
}
function email_success(){
    $(".tips .right").text("我们已将验证邮件发至您的邮箱，请前往邮箱查看");
}
function submitForm(form) {   
  
    var ps = $('#password').val();
    var reps = $('#repassword').val();
    if(ps.length>20 || ps.length<6){
        alert("对不起，密码位数不正确！");
        return false;
    }else{
        if(ps == reps){
            if($('#agreement').is(':checked')) {
                return true;  
                }  
            else{
                alert('您还未同意协议！')
                return false; 
            }
        }else{
            alert('两次密码不一致！');
            return false; 
        };
         
    };
       
};


function submitPS(form) {   
    var ps = $('#password').val();
    var reps = $('#repassword').val();
    if(ps.length>20 || ps.length<6){
        alert("对不起，密码位数不正确！");
        return false;
    }else{
        if(ps == reps){
            return true; 
        }else{
            alert('两次密码不一致！');
            return false; 
        };
         
    };
       
};