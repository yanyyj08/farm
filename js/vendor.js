var userId = '294a8224-8878-4715-9203-4ae3c6dc66c8';
var orgNo = localStorage.orgNo;
var orgName = '';

var toGetOrgNo = function() {
    var settings = {
        url: apiUrl + 'Merchant/OrgList/' + userId,
        type: 'GET',
        dataType: 'json',
        cache: false
    };
    $.ajax(settings).done(function(data) {
        if (!data.length) {
        	window.location.href = '../User/index.html';
            return false;
        }
        orgNo = data[0].orgNo;
        orgName = data[0].orgName;
        localStorage.orgNo = orgNo;
        localStorage.orgName = orgName;
        $('#myOrgName').html(orgName);
        toGetVendorOrderDetails('2017-01-10');
    });
}


var toGetVendorOrderDetails = function(dateFrom, dateTo) {
	var dateFrom = new Date(dateFrom).Format(TIMEFORMAT);
	var dateTo = dateTo ? new Date(dateTo).Format(TIMEFORMAT): new Date().Format(TIMEFORMAT);
    var settings = {
        url: apiUrl + 'Merchant/Summary/' + orgNo + '?dateFrom=' + dateFrom + '&dateTo=' + dateTo,
        type: 'GET',
        dataType: 'json',
        cache: false
    };
    $.ajax(settings).done(function(data) {
        $('#unPaidCount').html(Number(data.summary.unPaidCount));
        $('#paidCount').html(Number(data.summary.paidCount));
        $('#deliveringCount').html(Number(data.summary.deliveringCount));
        $('#signedCount').html(Number(data.summary.signedCount));
        $('.totalCount').html(Number(data.summary.totalCount));
        $('.closedCount').html(Number(data.summary.closedCount));
    });
};

$('#changeOrderTimeRange').on('click', 'li', function() {
	var today = new Date();
	var lastWeek = new Date(today.getTime() - 6 * 3600 * 24 * 1000);
	var lastMonth = new Date(new Date(today).setMonth(today.getMonth() - 1));
	var lastThreeMonth = new Date(new Date(today).setMonth(today.getMonth() - 4));
	switch($(this).index()) {
		case 0: toGetVendorOrderDetails(today); break;
		case 1: toGetVendorOrderDetails(lastWeek); break;
		case 2: toGetVendorOrderDetails(lastMonth); break;
		case 3: toGetVendorOrderDetails(lastThreeMonth); break;
	}
	$(this).addClass('active').siblings().removeClass('active');
});

var toGetWaitPaidOrders = function(data) {
    return '<a class="a01 changeAmount" href="javascript:;" data-expresscharge="' + data.order.expressCharge + '" data-consumdiscount="' +  data.order.consumDiscount + '">修改金额</a>';
};

var toGetWaitDeliverOrders = function(data) {
	return '<a class="a01 confirmDeliver" href="javascript:;">确认发货</a>';
};

var toGetWaitReceiveOrders = function(data) {
	return '<a class="a03 logistics" href="javascript:;">物流信息</a>';
};

var toGetWaitCommentOrders = function(data) {
	return '订单状态：<i>待评价</i>'
};

var toGetClosedOrders = function(data) {
	return '订单状态：<i>已完成</i>'
};

var toGetAllOrders = function(data) {
	switch(data.order.state) {
		case 1: return toGetWaitPaidOrders(data);
		case 3: return toGetWaitDeliverOrders(data);
		case 5: return toGetWaitReceiveOrders(data);
		case 6: return toGetWaitCommentOrders(data);
		case 7: return toGetClosedOrders(data);
	}
};



var toGetVendorOrderList = function(orderCode) {
	var state = '';
	var toGetBtnHtml = toGetAllOrders;
	switch(orderCode) {
		case 'waitPaid': state = 1; toGetBtnHtml = toGetWaitPaidOrders; $('#orderTitle').html('待付款订单'); break;
		case 'waitDeliver': state = 3; toGetBtnHtml = toGetWaitDeliverOrders; $('#orderTitle').html('待发货订单'); break;
		case 'waitReceive': state = 5; toGetBtnHtml = toGetWaitReceiveOrders; $('#orderTitle').html('待收货订单'); break;
		case 'waitComment': state = 6; toGetBtnHtml = toGetWaitCommentOrders; $('#orderTitle').html('待评价订单'); break;
		case 'closed': state = 7; toGetBtnHtml = toGetClosedOrders; $('#orderTitle').html('已完成订单'); break;
		case 'all': state = ''; toGetBtnHtml = toGetAllOrders; $('#orderTitle').html('所有订单'); break;
	}
	var settings = {
		url: apiUrl + 'Merchant/Orders/' + orgNo,
		type: 'GET',
		dataType: 'json',
		data: {
			state: state,
			dateFrom: '2017-01-10'
		}
	};
	$.ajax(settings).done(function(data) {
		var orderListHtml = '';
		$.each(data, function(index, value) {
			var productHtml = '';
			$.each(value.details, function(i, v) {
				productHtml += '<p>[' + value.order.orgName + '] ' + v.productName + ' x' + v.quantity + ' 规格</p>'
			});
			orderListHtml += '<li class="list-sty06" data-sequenceno="' + value.order.sequenceNo + '">'
		             	   + '	 <div class="l01">'
		             	   + '	 <p><em>订单号：' + value.order.orderNo + '</em><span></span></p>'
		             	   + '    <p>下单时间：' + new Date(value.order.tradeDate).Format(TIMEFORMATCOMPLETE) + '</p>'
		             	   + productHtml
		             	   + '    </div>'
		             	   + '    <div class="l02">'
		             	   + '        <p><em>收货人：dfa</em><span>231231231221</span></p>'
		             	   + '        <p>收货地址：2321312</p>'
		             	   + '    </div>'
		             	   + '    <div class="l03 clearfix">'
		             	   + '        <span>应收：<i>¥' + value.order.consumAmount + '</i></span>'
		             	   + '        <span>优惠：<i>¥' + value.order.consumDiscount + '</i></span>'
		             	   + '        <span>运费：<i>¥' + value.order.expressCharge + '</i></span>'
		             	   + '    </div>'
		             	   + '    <div class="l04">实收金额：' + value.order.consumAmount + ' - ' + value.order.consumDiscount + ' + ' + value.order.expressCharge + ' = <i>¥' + value.order.amount + '</i></div>'
		             	   + '    <div class="l05">'
		             	   + toGetBtnHtml(value)
		             	   + '    </div>'
		             	   + '</li>';
		});
		$('#orderList').append(orderListHtml);
	});
};

$('.modal .cancel').click(function() {
	$('.modal').hide();
	hideOverlay();
});

$('#orderList').on('click', '.changeAmount', function() {
	$('#seqNo').val($(this).parents('li').attr('data-sequenceno'));
	$('#expressCharge').val($(this).attr('data-expresscharge'));
	$('#consumDiscount').val($(this).attr('data-consumdiscount'))
	showOverlay();
	$('#changeAmountModal').show();
});

$('#changeAmountModal .confirm').click(function() {
	var settings = {
		url: apiUrl + 'Merchant/' + orgNo + '/UpdateOrder/' + $('#seqNo').val(),
		type: 'POST',
		dataType: 'json',
		data: {
			ConsumDiscount: $('#consumDiscount').val(),
			ExpressCharge: $('#expressCharge').val()
		}
	};
	$.ajax(settings).done(function(data) {
		alertMsg('修改成功!');
		setTimeout(function() {
			window.location.reload();
		}, 2000);

	}).error(function() {
		alertMsg('服务器异常，请稍后再试!');
	});
});

$('#confirmDeliverModal .confirm').click(function() {
	var settings = {
		url: apiUrl + 'Merchant/' + orgNo + '/UpdateOrder/' + $('#seqNo').val(),
		type: 'POST',
		dataType: 'json',
		data: {
			expressCorpNo: $('#expressCorpNo').val(),
			expressNo: $('#expressNo').val()
		}
	};
	$.ajax(settings).done(function(data) {
		alertMsg('修改成功!');
		setTimeout(function() {
			window.location.reload();
		}, 2000);
	}).error(function() {
		alertMsg('服务器异常，请稍后再试!');
	});
});








