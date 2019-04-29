
$(document).ready(function($) {



    (function(){
        // 自定义多选
        $('[role=checkbox]').each(function(){
            var input = $(this).find('input[type="checkbox"]');
     
                input.each(function(){
                    if( $(this).attr('checked')){
                        $(this).parents('label').addClass('checked');
                        $(this).prop("checked", true)
                    }
                })
     
                input.change(function(){
                    $(this).parents('label').toggleClass('checked');
                });
        })

    })();

    // 选项卡 鼠标点击切换
    $(".TAB_CLICK li").click(function(){
      var tab=$(this).parent(".TAB_CLICK");
      var con=tab.attr("id");
      var on=tab.find("li").index(this);
      $(this).addClass('on').siblings(tab.find("li")).removeClass('on');
      $(con).eq(on).show().siblings(con).hide();
    });

    // 选项卡 鼠标经过切换
    $(".TAB li").mousemove(function(){
      var tab=$(this).parent(".TAB");
      var con=tab.attr("id");
      var on=tab.find("li").index(this);
      $(this).addClass('hover').siblings(tab.find("li")).removeClass('hover');
      $(con).eq(on).show().siblings(con).hide();
    });
    
    //分栏等高js
    function myBox(){
        var _winw = $(window).width();
        var _sheight = $('.side-col').height();
        var _mheight = $('.main-col').height();
        if( _winw>=992 ){
            $('.side-col,.main-col').height(Math.max(_sheight,_mheight));
        }else{
            $('.side-col,.main-col').height('auto');
        }
    }
    myBox();
    $(window).on('resize',function(){
        myBox();
    });
});