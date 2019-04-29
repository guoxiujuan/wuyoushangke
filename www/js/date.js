var $dte = function (id) {
    return "string" == typeof id ? document.getElementById(id) : id;
};

var Class = {
    create: function () {
        return function () {
            this.initialize.apply(this, arguments);
        }
    }
}

var Extend = function (destination, source) {
    for (var property in source) {
        destination[property] = source[property];
    }
    return destination;
}


var Calendar = Class.create();
Calendar.prototype = {
    initialize: function (container, options) {
        this.Container = $dte(container);//容器(table结构)
        this.Days = [];//日期对象列表

        this.SetOptions(options);

        this.Year = this.options.Year || new Date().getFullYear();
        this.Month = this.options.Month || new Date().getMonth() + 1;
        this.SelectDay = this.options.SelectDay ? new Date(this.options.SelectDay) : null;
        this.onSelectDay = this.options.onSelectDay;
        this.onToday = this.options.onToday;
        this.onFinish = this.options.onFinish;

        this.Draw();
    },
    //设置默认属性
    SetOptions: function (options) {
        this.options = {//默认值
            Year: 0,//显示年
            Month: 0,//显示月
            SelectDay: null,//选择日期
            onSelectDay: function () {
            },//在选择日期触发
            onToday: function () {
            },//在当天日期触发
            onFinish: function () {
            }//日历画完后触发
        };
        Extend(this.options, options || {});
    },
    //当前月
    NowMonth: function () {
        this.PreDraw(new Date());
    },
    //上一月
    PreMonth: function () {
        this.PreDraw(new Date(this.Year, this.Month - 2, 1));
    },
    //下一月
    NextMonth: function () {
        this.PreDraw(new Date(this.Year, this.Month, 1));
    },
    //上一年
    PreYear: function () {
        this.PreDraw(new Date(this.Year - 1, this.Month - 1, 1));
    },
    //下一年
    NextYear: function () {
        this.PreDraw(new Date(this.Year + 1, this.Month - 1, 1));
    },
    //根据日期画日历
    PreDraw: function (date) {
        //再设置属性
        this.Year = date.getFullYear();
        this.Month = date.getMonth() + 1;
        //重新画日历
        this.Draw();
    },
    //画日历
    Draw: function () {
        //用来保存日期列表
        var arr = [];
        //用当月第一天在一周中的日期值作为当月离第一天的天数
        for (var i = 1, firstDay = new Date(this.Year, this.Month - 1, 1).getDay(); i <= firstDay; i++) {
            arr.push(0);
        }
        //用当月最后一天在一个月中的日期值作为当月的天数
        for (var i = 1, monthDay = new Date(this.Year, this.Month, 0).getDate(); i <= monthDay; i++) {
            arr.push(i);
        }
        //清空原来的日期对象列表
        this.Days = [];
        //插入日期
        var frag = document.createDocumentFragment();
        while (arr.length) {
            //每个星期插入一个tr
            var row = document.createElement("tr");
            //每个星期有7天
            for (var i = 1; i <= 7; i++) {
                var cell = document.createElement("td");
                cell.innerHTML = " ";
                if (arr.length) {
                    var d = arr.shift();
                    if (d) {
                        cell.setAttribute("id", d);
                        cell.innerHTML = d;
                        this.Days[d] = cell;
                        var on = new Date(this.Year, this.Month - 1, d);
                        //判断是否今日
                        this.IsSame(on, new Date()) && this.onToday(cell);
                        //判断是否选择日期
                        this.SelectDay && this.IsSame(on, this.SelectDay) && this.onSelectDay(cell);
                    }
                }
                row.appendChild(cell);
            }
            frag.appendChild(row);
        }
        //先清空内容再插入(ie的table不能用innerHTML)
        while (this.Container.hasChildNodes()) {
            this.Container.removeChild(this.Container.firstChild);
        }
        this.Container.appendChild(frag);
        //附加程序
        this.onFinish();
    },
    //判断是否同一日
    IsSame: function (d1, d2) {
        return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
    }
}

var cale = new Calendar("idCalendar", {
    SelectDay: new Date().setDate(10),
    onSelectDay: function (o) {
        o.className = "onSelect";
    },
    onToday: function (o) {
        o.className = "onToday";
    },
    onFinish: function () {
        $dte("idCalendarYear").innerHTML = this.Year;
        var mm = this.Month;
        if (mm.length == 1) mm = '0' + mm;
        $dte("idCalendarMonth").innerHTML = mm;
        aja(this.Year + '-' + mm);
    }
});

//$dte("idCalendarPre").onclick = function(){ cale.PreMonth(); }
//$dte("idCalendarNext").onclick = function(){ cale.NextMonth(); }

// $dte("idCalendarPreYear").onclick = function(){ cale.PreYear(); }
//$dte("idCalendarNextYear").onclick = function(){ cale.NextYear(); }

//$dte("idCalendarNow").onclick = function(){ cale.NowMonth(); }

// ================================= 初始化

// 初始化执行月份
aja($('#idCalendarYear').text() + '-' + $('#idCalendarMonth').text());


// 点击日期调取并显示当前日期的内容                        

var china_week = ['日', '一', '二', '三', '四', '五', '六'];

function bind_td(){
    $("td").on('click', function (e) {
        day = $(this).text();
        if (day.length == 1) day = '0' + day;
        das = cale.Year + "-" + cale.Month + "-" + day; // 带-日期
        w = china_week[$(this).index()];
        day>0 && loadinfo(day, w);
        $(this).parents('.Calendar').find('td').removeClass('onToday');
        day>0&&$(this).addClass('onToday');
    });
}
bind_td();
// ==================================  函数区域
/* 
 * ------------获取当月星星日期----------------
 *  变量 da 到 url
 *  数据格式为："2016-09"
 *  返回格式：10,13,16,23
 */
function aja(da) {
    $.ajax({
        type: "get",
        // 返回当前月份的日即可
        url: 'http://liu.xiaoyuok.com/chgj/index.php/single/chaxiaoli',
        data: {da: da},
        cache: false,
        dataType: "html",
        success: function (data) {
            star(data);
        }
    });
}

// 显示星星
function star(ds) {
    //alert(123);
    var ds;
    var flag = new Array();
    flag = ds.split(",");
    for (var i = 0, len = flag.length - 1; i < len; i++) {
        $("td[id='" + flag[i] + "']").html("<a href='javascript:void(0);'>" + flag[i] + "</a>");
        console.log(flag[i]);
    }
}

/*
 * --------------获取当前日期的内容----------------
 */
var today=new Date();
function loadinfo(d, w) {
    $('.today').html("<span>" + d + "</span>周" + w);
}
$('.today').html("<span>" + today.getDate() + "</span>周" + china_week[today.getDay()]);
                 

$('.a-next,.a-prev').click(function(){
    bind_td();
})                  