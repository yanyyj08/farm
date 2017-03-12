var appId = '';
// var prepayId = '';
var nonceStr = '';
var paySign = '';
var timeStamp = '';
var package = '';
var onBridgeReady = function() {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId": appId,   
            "timeStamp": timeStamp,  
            "nonceStr": nonceStr,  
            "package": package,
            "signType": "MD5",   
            "paySign": "BAA25EFB6E688D6C115919EB80F02EEC"
        },
        function(res) {
            $.each(res, function(index, value) {
                alert(index + ': ' + value);
            })
            if (res.err_msg == "get_brand_wcpay_request:ok") {} // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
        }
    );
    // wx.chooseWXPay({
    //     timestamp: timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
    //     nonceStr: nonceStr, // 支付签名随机串，不长于 32 位
    //     package: package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
    //     signType: "MD5", // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
    //     paySign: paySign, // 支付签名
    //     success: function (res) {
    //         console.log(res)
    //     }
    // });
};

var toPay = function() {
    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    } else {
        onBridgeReady();
    }
};

var payOrdrSuccess = function(data) {
    console.log(data)
    data = JSON.parse(data);
    appId = data.paymentParameters.appId;
    // prepayId = data.paymentParameters.prepay_id;
    nonceStr = data.paymentParameters.nonceStr;
    paySign = data.paymentParameters.paySign;
    package = data.paymentParameters.package;
    timeStamp = String(data.paymentParameters.timeStamp);
    console.log(package)
    toPay();
};

$('#orderList').on('click', '.pay-order', function() {
    var $li = $(this).parents('li');
    var data = {
        orderSeqNo: $li.attr('data-href')
    };
    toDoAjax(data, 'PUT', apiUrl + 'Market/Orders/Payment/' + $li.attr('data-href') + '?userId=' + userId, payOrdrSuccess, null);
});
