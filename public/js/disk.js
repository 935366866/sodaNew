//页面加载完成后
$(function(){
    //打开时根据窗口大小选择
    checkWindowSize();
    //变动时根据浏览器大小选择样式
    $(window).resize(checkWindowSize);

    //配置elfinder
    //所有选项的网址：https://github.com/Studio-42/elFinder/wiki/Client-configuration-options-2.1
    var options = {
        url  : module+'/Dir/dispatchCmd',  // connector URL (REQUIRED)
        lang : 'zh_CN',            // language (OPTIONAL)
        height:500,
        handlers: {
            remove:function(event, elfinderInstance) {
            console.log(event.data);
            }
        },
        contextmenu: {
        	navbar:['open','opendir','upload','mkdir','paste'],
        	cwd: ['reload','back','|','upload','mkdir','paste','|','sort','colwidth','|','info','fullscreen'],
        	files: ['download','opendir','|','upload','paste','copy','cut','rm','rename']
        },
        commandsOptions: {
        	download : {
        		method : 'post'
        	}
        },
        bootCallback : function(fm, extraObj) {
						/* any bind functions etc. */
						fm.bind('init', function() {
							// any your code
						});
						// for example set document.title dynamically.
						var title = document.title;
						fm.bind('open', function() {
							var path = '',
								cwd  = fm.cwd();
							if (cwd) {
								path = fm.path(cwd.hash) || null;
							}
							document.title = path? path + ':' + title : title;
						}).bind('destroy', function() {
							document.title = title;
						});
					},
        uiOptions : {
        	toolbar : [
				['back', 'forward'],
				//['netmount'],
				// ['reload'],
				// ['home', 'up'],
				['mkdir','upload'],
				['open', 'download', 'getfile'],
				//['info', 'chmod'],
				//['quicklook'],
				['copy', 'cut', 'paste'],
				['rm'],
				[ 'rename'],
				//['extract', 'archive'],
				['search'],
				['view', 'sort'],
				//['help'],
				['fullscreen'],
				{
					autoHideUA: ['Mobile']
				}      
        	]
        }
    }

    $('#elfinder').elfinder(options); 
    //有关回调函数：https://github.com/Studio-42/elFinder/wiki/Client-event-API
    /*
    与上面handlers中的功能类似，我比较了一下，结果是一样的。
    使用one只执行一次
    var elfinder = $('#elfinder').elfinder(options).elfinder('instance');
    elfinder.one('remove', function(event) { 
            console.log(event.data);
    });
    */

});
//===========================函数========================
//1.根据浏览器大小选择样式
function checkWindowSize(){
    if($(window).width()>=1200){
        $("#bigbox").addClass("bigbox_1200");
        $("#bigbox").removeClass("bigbox");
    }else{
        $("#bigbox").addClass("bigbox");
        $("#bigbox").removeClass("bigbox_1200");
    };
};