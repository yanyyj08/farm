// /* 此处为线上 */
// var apiUrl = 'http://api.guagua365.net/apiv1/';
// var imgUrl = apiUrl + 'FastFiles/';

// var accessKey = '';
// var userId = '';
// var orgNo = '';
// toGetBasicInfo();
// /* 此处为线上 end */


/* 此处为本地测试 */
// var apiUrl = 'http://mgapi.tunnel.qydev.com/apiv1/';
// var imgUrl = 'http://api.guagua365.net/apiv1/FastFiles/';
// var accessKey = 'mob_6d2bb8089de047eaafd5273b45ce55c1';
// var userId = '48e54ad1-fb9f-4e40-836d-fc292bf4859b';
/* 此处为本地测试 end */


/* 此处为yan本地测试 */
var apiUrl = 'http://api.guagua365.net/apiv1/';
var imgUrl = apiUrl + 'FastFiles/';
var accessKey = '5cdf9742b8f04ebda32111b9dc1b2880';
var userId = 'a7f842df-78b3-4944-a428-05bb9b8c9ed9';
/* 此处为yan本地测试 end */


const TIMEFORMATCOMPLETE = 'yyyy-MM-dd hh:mm:ss';
const TIMEFORMAT = 'yyyy-MM-dd';

function toGetBasicInfo() {
    accessKey = toGetParameter('accesskey');
    userId = toGetParameter('userid');
    if (!accessKey || !userId) {
        if (!localStorage.accessKey || !localStorage.userId) {
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx751a3b9c6afdb368&redirect_uri=' + encodeURI('http://api.guagua365.net/apiv1/auth/wechat/authorize') + '&response_type=code&scope=snsapi_userinfo&state=home#wechat_redirect';
        } else {
            accessKey = localStorage.accessKey;
            userId = localStorage.userId;
        }
    } else {
        localStorage.accessKey = accessKey;
        localStorage.userId = userId;
    }
};

// 时间格式化
Date.prototype.Format = function(fmt) { //author: meizz   
    var o = {
        "M+": this.getMonth() + 1, //月份   
        "d+": this.getDate(), //日   
        "h+": this.getHours(), //小时   
        "m+": this.getMinutes(), //分   
        "s+": this.getSeconds(), //秒   
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
        "S": this.getMilliseconds() //毫秒   
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 轮播
var toDefaultSlider = function() {
    $dragBln = false;
    $('#carouselMain').touchSlider({
        flexible: true,
        speed: 200,
        btn_prev: $('#btnPrev'),
        btn_next: $('#btnNext'),
        paging: $('#carouselIcon' + ' a'),
        counter: function(e) {
            $('#carouselIcon' + ' a').removeClass('current').eq(e.current - 1).addClass('current');
        }
    });
    $('#carouselMain').bind('mousedown', function() {
        $dragBln = false;
    })
    $('#carouselMain').bind('dragstart', function() {
        $dragBln = true;
    })
    $('#carouselMain a').click(function() {
        if ($dragBln) {
            return false;
        }
    })
    timer = setInterval(function() {
        $('#btnNext').click();
    }, 3000);
    $('#carouselMain').hover(function() {
        clearInterval(timer);
    })
    $('#carouselMain').bind('touchstart', function() {
        clearInterval(timer);
    }).bind('touchend', function() {
        timer = setInterval(function() {
            $('#btnNext').click();
        }, 3000);
    });
};

var reload = function() {
    window.location.reload();
};

var toGetParameter = function(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg) ?
        window.location.search.substr(1).match(reg)[2] : '';
    return r;
};

// 小黑框
var alertMsg = function(msg) {
    $('.msg').html(msg);
    $('.msg').fadeIn();
    $('.msg').css('margin-top', '-' + $('.msg').get(0).clientHeight / 2 + 'px')
        .css('margin-left', '-' + $('.msg').get(0).clientWidth / 2 + 'px');
    setTimeout(function() {
        $('.msg').fadeOut();
    }, 2000);
};

$(function() {
    $('body').prepend('<div class="msg"></div>');
    $('.msg').css({
        'display': 'none',
        'position': 'fixed',
        'top': '50%',
        'left': '50%',
        'z-index': '99999',
        'max-width': '50%',
        'min-width': '100px',
        'padding': '16px',
        'color': '#fff',
        'font-size': '14px',
        'text-align': 'center',
        'line-height': '18px',
        'border-radius': '2px',
        'background-color': 'rgba(0, 0, 0, .6)'
    });
});

var showOverlay = function() {
    $('body').append('<div class="overlay"></div>');
};

var hideOverlay = function() {
    $('.overlay').remove();
};

var toDoAjax = function(param, type, url, callBack, callBackData) {
    var data = JSON.stringify(param);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener("readystatechange", function() {
        if (this.readyState === 4) {
            if (Object.prototype.toString.call(callBack) === '[object Function]') {
                if (callBackData) {
                    callBack(this.responseText, callBackData);
                } else {
                    callBack(this.responseText);
                }
            }
        }
    });

    xhr.open(type, url);
    xhr.setRequestHeader('accesskey', accessKey);
    // xhr.setRequestHeader('userId', userId);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.setRequestHeader('cache-control', 'no-cache');

    xhr.send(data);
};

// 分页

$(function() {
    $('.tabs').on('click', 'li', function() {
        $(this).addClass('active').siblings().removeClass('active');
        $('.tab-panel').eq($(this).index()).show().siblings().hide();
    });

    $('.btn-back').click(function() {
        history.back(-1);
    });
});
