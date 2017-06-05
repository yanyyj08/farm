// var userId = '294a8224-8878-4715-9203-4ae3c6dc66c8';
var orgNo = localStorage.orgNo;
var orgName = localStorage.orgName;

var toGetOrgNo = function() {
	if (orgNo && orgName) {
		$('#myOrgName').html(orgName);
        var today = new Date();
        toGetVendorOrders(today);
        toGetVendorOrderDetails(today);
        return false;
	}
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
        var today = new Date();
        toGetVendorOrders(today);
        toGetVendorOrderDetails(today);
    });
};

var toGetVendorInfo = function() {
	if (!orgNo) {
		return false;
	};
	var settings = {
        url: apiUrl + 'Basis/Org/Page/' + orgNo,
        type: 'GET',
        dataType: 'json',
        cache: false
    };
    $.ajax(settings).done(function(data) {
    	// if (data.org.state == 3) {
    	// 	$('#confirmVendorInfo').remove();
    	// 	$('.content').addClass('content-sty01');
    	// 	$('input').attr('readonly', 'readonly');
    	// }
    	$('#orgName').val(data.org.orgName);
    	$('#address').val(data.org.address);
    	$('#contactName').val(data.org.contactName);
    	$('#phoneNumber').val(data.org.phoneNumber);
    	$('#faxNumber').val(data.org.faxNumber);
    });
};

$('#confirmVendorInfo').click(function() {
	if ($('#orgName').val() == '') {
		alertMsg('请输入店铺名称!');
		return false;
	} else if ($('#address').val() == '') {
		alertMsg('请输入店铺地址!');
		return false;
	} else if ($('#contactName').val() == '') {
		alertMsg('请输入联系人姓名');
		return false;
	} else if ($('#phoneNumber').val() == '') {
		alertMsg('请输入联系电话');
		return false;
	}
	var orgId = Number(orgNo);
	var data = {
		orgNo: orgId,
		orgName: $('#orgName').val(),
    	address: $('#address').val(),
    	contactName: $('#contactName').val(),
    	phoneNumber: $('#phoneNumber').val(),
    	faxNumber: $('#faxNumber').val()
	};
	toDoAjax(data, 'POST', apiUrl + 'Merchant/' + orgNo + '/UpdateOrg/' + userId, changeAmountSuccess);
});

var toGetVendorOrders = function(dateFrom, dateTo) {
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
        $('#toBeDeliveredCount').html(Number(data.summary.toBeDeliveredCount));
        $('#deliveringCount').html(Number(data.summary.deliveringCount));
        $('#signedCount').html(Number(data.summary.signedCount));
        $('#totalCount').html(Number(data.summary.totalCount));
        $('#closedCount').html(Number(data.summary.closedCount));
    });
};

var toSetIndexHref = function(dateFrom, dateTo) {
	var timeRange = '&dateFrom=' + dateFrom + '&dateTo=' + dateTo;
	$('#totalCountHref').attr('href', 'orderList.html?orderCode=all' + timeRange);
	$('.paidlist-href').attr('href', 'orderList.html?orderCode=paid' + timeRange);
	$('.paidrecord-href').attr('href', 'simpleRecords.html?recordCode=paid' + timeRange);
	$('#incomeHref').attr('href', 'simpleRecords.html?recordCode=income' + timeRange);
};

var toGetVendorOrderNormal = function(dateFrom, dateTo) {
	var settings = {
        url: apiUrl + 'Merchant/Summary/' + orgNo + '?dateFrom=' + dateFrom + '&dateTo=' + dateTo,
        type: 'GET',
        dataType: 'json',
        cache: false
    };
    $.ajax(settings).done(function(data) {
    	$('#amount').html(Number(data.summary.amount));
        $('.totalCount').html(Number(data.summary.totalCount));
        $('#paidCount').html(Number(data.summary.paidCount));
    });
};

var toGetVendorOrderClear = function(dateFrom, dateTo) {
	var settings = {
        url: apiUrl + 'Merchant/Clearing/' + orgNo + '?dateFrom=' + dateFrom + '&dateTo=' + dateTo,
        type: 'GET',
        dataType: 'json',
        cache: false
    };
    $.ajax(settings).done(function(data) {
    	$('#transferOutAmount').html(data.summary.transferOutAmount);
    	$('#transferOutCount').html(data.summary.transferOutCount);
    });
};

var toGetVendorOrderDetails = function(dateFrom, dateTo) {
	var dateFrom = new Date(dateFrom).Format(TIMEFORMAT);
	var dateTo = dateTo ? new Date(dateTo).Format(TIMEFORMAT): new Date().Format(TIMEFORMAT);
	toSetIndexHref(dateFrom, dateTo);
	toGetVendorOrderNormal(dateFrom, dateTo);
	toGetVendorOrderClear(dateFrom, dateTo);
};

$('#changeOrderTimeRange').on('click', 'li', function() {
	var today = new Date();
	var lastWeek = new Date(today.getTime() - 6 * 3600 * 24 * 1000);
	var lastMonth = new Date(new Date(today).setMonth(today.getMonth() - 1));
	var lastThreeMonth = new Date(new Date(today).setMonth(today.getMonth() - 3));
	switch($(this).index()) {
		case 0: toGetVendorOrderDetails(today);
        		break;
		case 1: toGetVendorOrderDetails(lastWeek);
        		break;
		case 2: toGetVendorOrderDetails(lastMonth);
        		break;
		case 3: toGetVendorOrderDetails(lastThreeMonth);
        		break;
	}
	$(this).addClass('active').siblings().removeClass('active');
});

var toGetWaitPaidOrders = function(data) {
    return '<a class="a03 add-remark" href="javascript:;" data-expressremark="' + data.payment.expressRemark + '">备注</a><a class="a01 change-amount" href="javascript:;" data-expresscharge="' + data.order.expressCharge + '" data-consumdiscount="' +  data.order.consumDiscount + '">修改金额</a>';
};

var toGetWaitDeliverOrders = function(data) {
	return '<a class="a03 add-remark" href="javascript:;" data-expressremark="' + data.payment.expressRemark + '">备注</a><a class="a01 confirm-deliver" href="javascript:;">确认发货</a>';
};

var toGetWaitReceiveOrders = function(data) {
	return '<a class="a03 add-remark" href="javascript:;" data-expressremark="' + data.payment.expressRemark + '">备注</a><a class="a03 change-logistics" href="javascript:;" data-expresscompanyno="' + data.payment.expressCorpNo + '" data-expresscompanyname="' + data.payment.expressCorpName + '" data-expressno="' + data.payment.expressNo + '">修改物流</a><a class="a03 show-logistics" href="javascript:;">查看物流</a>';
};

var toGetWaitCommentOrders = function(data) {
	return '订单状态：<i>待评价</i><a class="a03 add-remark" href="javascript:;" data-expressremark="' + data.payment.expressRemark + '">备注</a>'
};

var toGetClosedOrders = function(data) {
	return '订单状态：<i>已完成</i><a class="a03 add-remark" href="javascript:;" data-expressremark="' + data.payment.expressRemark + '">备注</a>'
};

var toGetInvalidOrders = function(data) {
	return '订单状态：<i>已关闭</i><a class="a03 add-remark" href="javascript:;" data-expressremark="' + data.payment.expressRemark + '">备注</a>'
};

var toGetAllOrders = function(data) {
	switch(data.order.state) {
		case 1: return toGetWaitPaidOrders(data);
		case 3: return toGetWaitDeliverOrders(data);
		case 5: return toGetWaitReceiveOrders(data);
		case 6: return toGetWaitCommentOrders(data);
		case 7: return toGetClosedOrders(data);
		case 100: return toGetInvalidOrders(data);
	}
};

var toGetVendorOrderList = function(orderCode) {
	var state = '';
	var scoreState;
	var toGetBtnHtml = toGetAllOrders;
	var dateFrom = toGetParameter('dateFrom');
	var dateTo = toGetParameter('dateTo');
	switch(orderCode) {
		case 'waitPaid': state = 1; toGetBtnHtml = toGetWaitPaidOrders; $('#orderTitle').html('待付款订单'); break;
		case 'waitDeliver': state = 3; toGetBtnHtml = toGetWaitDeliverOrders; $('#orderTitle').html('待发货订单'); break;
		case 'waitReceive': state = 5; toGetBtnHtml = toGetWaitReceiveOrders; $('#orderTitle').html('待收货订单'); break;
		case 'waitComment': state = '6,7'; scoreState = 0; toGetBtnHtml = toGetWaitCommentOrders; $('#orderTitle').html('已签收/待评价订单'); break;
		case 'closed': state = '6,7'; scoreState = 1; toGetBtnHtml = toGetClosedOrders; $('#orderTitle').html('已完成订单'); break;
		case 'all': state = ''; toGetBtnHtml = toGetAllOrders; $('#orderTitle').html('所有订单'); break;
		case 'paid': state = ''; toGetBtnHtml = toGetAllOrders; $('#orderTitle').html('成交订单'); break; // TODO: paidState
	}
	var settings = {
		url: apiUrl + 'Merchant/Orders/' + orgNo,
		type: 'GET',
		dataType: 'json',
		data: {
			state: state,
			dateFrom: dateFrom,
			dateTo: dateTo
		}
	};
	if (scoreState !== null) {
		settings.data.ScoreState = scoreState;
	}
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
		             	   + '    <p>下单时间：' + new Date(value.order.tradeDate).Format(TIMEFORMAT) + '</p>'
		             	   + productHtml
		             	   + '    </div>'
		             	   + '    <div class="l02">'
		             	   + '        <p><em>收货人：' + value.payment.shippingContact + '</em><span>' + value.payment.shippingPhone + '</span></p>'
		             	   + '        <p>收货地址：' + value.payment.shippingAddress + '</p>'
		             	   + '    </div>'
		             	   + '    <div class="l04">商品总价：<i>¥' + value.order.consumAmount + '</i></div>'
		             	   + '    <div class="l03 clearfix">'
		             	   + '        <span>优惠：<i>¥' + value.order.consumDiscount + '</i></span>'
		             	   + '        <span>运费：<i>¥' + value.order.expressCharge + '</i></span>'
		             	   + '    </div>'
		             	   + '    <div class="l04">订单总价：' + value.order.consumAmount + ' - ' + value.order.consumDiscount + ' + ' + value.order.expressCharge + ' = <i>¥' + value.order.amount + '</i></div>'
		             	   + '    <div class="l05">'
		             	   + toGetBtnHtml(value)
		             	   + '    </div>'
		             	   + '</li>';
		});
		$('#orderList').append(orderListHtml);
	});
};

var toGetExpressCompany = function() {
	var settings = {
		url: apiUrl + 'Common/LexiconCategory/6',
		type: 'GET',
		dataType: 'json',
		cache: false
	};
	$.ajax(settings).done(function(data) {
		var expressCompanyHtml = '';
		$.each(data, function(index, value) {
			expressCompanyHtml += '<option value="' + value.lexiconCode + '">' + value.lexiconName + '</option>'
		});
		$('#expressCompanyNo').append(expressCompanyHtml);
	});

};

$('#expressCompanyNo').on('change', function() {
	if ($(this).val() == '6999') {
		$('#expressCompanyName').parent().show();
		$('#expressCompanyName').val('');
	} else {
		$('#expressCompanyName').parent().hide();
		$('#expressCompanyName').val($(this).find('option:selected').html());
	}
});

$('.modal .cancel').click(function() {
	$('.modal').hide();
	hideOverlay();
});

$('#orderList').on('click', '.change-amount', function() {
	$('#seqNo').val($(this).parents('li').attr('data-sequenceno'));
	$('#expressCharge').val($(this).attr('data-expresscharge'));
	$('#consumDiscount').val($(this).attr('data-consumdiscount'))

	showOverlay();
	$('#changeAmountModal').show();
});

$('#orderList').on('click', '.confirm-deliver', function() {
	$('#seqNo').val($(this).parents('li').attr('data-sequenceno'));
	$('#expressCompanyNo').val('');
	$('#expressCompanyName').val('').hide();
	$('#expressNo').val('');
	showOverlay();
	$('#confirmDeliverModal').show();
});

$('#orderList').on('click', '.change-logistics', function() {
	$('#seqNo').val($(this).parents('li').attr('data-sequenceno'));
	$('#expressCompanyNo').val($(this).attr('data-expresscompanyno'));
	$('#expressCompanyName').val($(this).attr('data-expresscompanyname')).hide();
	$('#expressNo').val($(this).attr('data-expressno'));
	showOverlay();
	$('#confirmDeliverModal').show();
});

$('#orderList').on('click', '.add-remark', function() {
	$('#seqNo').val($(this).parents('li').attr('data-sequenceno'));
	$('#remark').val($(this).attr('data-expressremark'));
	showOverlay();
	$('#remarkModal').show();
});

$('#orderList').on('click', '.show-logistics', function() {
	window.location.href = '../User/logistics.html?sequenceNo=' + $(this).parents('li').attr('data-sequenceno');
});

var changeAmountSuccess = function(data) {
	alertMsg('修改成功!');
	setTimeout(function() {
		window.location.reload();
	}, 2000);
};

$('#changeAmountModal .confirm').click(function() {
	var data = {
		ConsumDiscount: Number($('#consumDiscount').val()),
		ExpressCharge: Number($('#expressCharge').val())
	};
	toDoAjax(data, 'POST', apiUrl + 'Merchant/' + orgNo + '/UpdateOrder/' + $('#seqNo').val(), changeAmountSuccess);
});

$('#confirmDeliverModal .confirm').click(function() {
	if ($('#expressCompanyNo').val() == '6999') {
		if ($('#expressCompanyName').val() == '') {
			alertMsg('请输入快递公司名称!');
			return false;
		}
	}
	if ($('#expressCompanyNo').val() == '') {
		alertMsg('请选择快递公司!');
		return false;
	} else if ($('#expressNo').val() == '') {
		alertMsg('请输入快递单号!');
		return false;
	}
	var data = {
		sequenceNo: $('#seqNo').val(),
		expressCorpNo: $('#expressCompanyNo').val(),
		expressCorpName: $('#expressCompanyName').val(),
		expressNo: $('#expressNo').val()
	};
	toDoAjax(data, 'POST', apiUrl + 'Merchant/' + orgNo + '/UpdateOrder/' + $('#seqNo').val(), changeAmountSuccess);
});

$('#remarkModal .confirm').click(function() {
	var data = {
		sequenceNo: $('#seqNo').val(),
		ExpressRemark: $('#remark').val()
	};
	toDoAjax(data, 'POST', apiUrl + 'Merchant/' + orgNo + '/UpdateOrder/' + $('#seqNo').val(), changeAmountSuccess);
});

var toGetClearSimpleOrder = function (dateFrom, dateTo) {
	$('#transferHtml').html('结算');
	toGetVendorOrderClear(dateFrom, dateTo);
	var settings = {
		url: apiUrl + 'Merchant/Clearing/' + orgNo + '/Orders',
		type: 'GET',
		dataType: 'json',
		data: {
			dateFrom: dateFrom,
			dateTo: dateTo
		},
		cache: false
	};
	$.ajax(settings).done(function(data) {
		var recordHtml = '';
		$.each(data, function(index, value) {
			recordHtml += '<li>'
                    	+ '    <p>'
                    	+ '        <em>订单号：' + value.order.orderNo + '</em>'
                    	+ '    </p>'
                    	+ '    <p>'
                    	+ '        <em>下单时间：' + new Date(value.order.tradeDate).Format(TIMEFORMATCOMPLETE) + '</em>'
                    	+ '    </p>'
                    	+ '    <p>'
                    	+ '        <em>商品总价：¥' + value.order.consumAmount + '</em>'
                    	+ '        <span>订单总价：¥' + value.order.amount + '</span>'
                    	+ '    </p>'
                    	+ '    <p>'
                    	+ '        <span>结算金额：¥' + value.order.incomeAmount + '</span>'
                    	+ '    </p>'
                    	+ '</li>'
		});
		$('#simpleRecords').append(recordHtml);
	});
};

var toGetPaidSimpleOrder = function (dateFrom, dateTo) {
	var settings = {
        url: apiUrl + 'Merchant/Summary/' + orgNo + '?dateFrom=' + dateFrom + '&dateTo=' + dateTo,
        type: 'GET',
        dataType: 'json',
        cache: false
    };
    $.ajax(settings).done(function(data) {
    	$('#transferOutAmount').html(Number(data.summary.amount));
        $('#transferOutCount').html(Number(data.summary.paidCount));
    });
	var settings = {
		url: apiUrl + 'Merchant/PaidOrders/' + orgNo,
		type: 'GET',
		dataType: 'json',
		cache: false,
		data: {
			dateFrom: dateFrom,
			dateTo: dateTo
		}
	};
	$.ajax(settings).done(function(data) {
		var recordHtml = '';
		$.each(data, function(index, value) {
			recordHtml += '<li>'
                    	+ '    <p>'
                    	+ '        <em>订单号：' + value.order.orderNo + '</em>'
                    	+ '    </p>'
                    	+ '    <p>'
                    	+ '        <em>下单时间：' + new Date(value.order.tradeDate).Format(TIMEFORMATCOMPLETE) + '</em>'
                    	+ '    </p>'
                    	+ '    <p>'
                    	+ '        <em>商品总价：¥' + value.order.consumAmount + '</em>'
                    	+ '        <span>订单总价：¥' + value.order.amount + '</span>'
                    	+ '    </p>'
                    	+ '</li>'
		});
		$('#simpleRecords').append(recordHtml);
	});
};

var toGetSimpleRecords = function() {
	var dateFrom = toGetParameter('dateFrom');
	var dateTo = toGetParameter('dateTo');
	var recordCode = toGetParameter('recordCode');
	switch (recordCode) {
		case 'income': toGetClearSimpleOrder(dateFrom, dateTo); break;
		case 'paid': toGetPaidSimpleOrder(dateFrom, dateTo); break;
	}
};

$('#showVendorInfoModal').click(function() {
	showOverlay();
	$('#vendorInfoModal').show();

});

var toGetVendorList = function() {
	var settings = {
		url: apiUrl + 'Merchant/OrgList/' + userId,
		type: 'GET',
		dataType: 'json',
		cache: false
	};
	$.ajax(settings).done(function(data) {
		var vendorHtml = '';
		$.each(data, function(index, value) {
			vendorHtml += '<li class="list-sty02" data-orgno="' + value.orgNo + '" data-orgname="' + value.orgName + '">'
                        + '    <a href="javascript:;">'
                        + '        <div class="first-line">'
                        + '            <img src="' + imgUrl + value.thumbImgFileId + '" alt="">'
                        + '            <h3><span>' + value.orgName + '</span></h3>'
                        + '        </div>'
                        + '        <div class="second-line">'
                        + '            <h4>店铺地址：</h4>'
                        + '            <p>' + value.description + '</span></p>'
                        + '        </div>'
                        + '    </a>'
                        + '</li>';
		});
		$('#vendorList').html(vendorHtml);
	});
};

$('#vendorList').on('click', 'li', function() {
	localStorage.orgNo = $(this).attr('data-orgno');
	localStorage.orgName = $(this).attr('data-orgname');
	window.location.href = 'index.html';
});