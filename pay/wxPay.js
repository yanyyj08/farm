var payInfo = {};
var onBridgeReady = function() {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
            "appId": payInfo.appId,   
            "timeStamp": payInfo.timeStamp,  
            "nonceStr": payInfo.nonceStr,  
            "package": payInfo.package,
            "signType": "MD5",   
            "paySign": payInfo.paySign
        },
        function(res) {
            $.each(res, function(index, value) {
                alert(index + ': ' + value);
            })
            if (res.err_msg == "get_brand_wcpay_request:ok") {} // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
        }
    );
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
    payInfo.appId = data.paymentParameters.appId;
    // prepayId = data.paymentParameters.prepay_id;
    payInfo.nonceStr = data.paymentParameters.nonceStr;
    payInfo.paySign = data.paymentParameters.paySign;
    payInfo.package = data.paymentParameters.package;
    payInfo.timeStamp = String(data.paymentParameters.timeStamp);
    toPay();
};

$('#orderList').on('click', '.pay-order', function() {
    var $li = $(this).parents('li');
    var data = {
        orderSeqNo: $li.attr('data-href')
    };
    toDoAjax(data, 'PUT', apiUrl + 'Market/Orders/Payment/' + $li.attr('data-href') + '?userId=' + userId, payOrdrSuccess, null);
});
