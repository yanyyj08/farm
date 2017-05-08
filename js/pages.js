var toSetHeaders = function(xhr) {
    xhr.setRequestHeader('accesskey', accessKey);
	// xhr.setRequestHeader('content-type', 'application/json');
	// xhr.setRequestHeader('cache-control', 'no-cache');
};

// 数量增减
$('body').on('click', '.reduce', function() {
    if ($(this).hasClass('disabled')) {
        return false;
    }
    var min = Number($(this).parents('.num-ctr').attr('data-min'));
    var max = Number($(this).parents('.num-ctr').attr('data-max'));
    var number = Number($(this).siblings('input').val());
    $(this).siblings('input').val(--number);
    if (number <= min) {
        $(this).addClass('disabled');
        $(this).siblings('input').val(min);
    } else {
        if (number < max) {
            $(this).siblings('.add').removeClass('disabled');
        }
    }
});

$('body').on('click', '.add', function(e) {
    if ($(this).hasClass('disabled')) {
        return false;
    }
    var min = Number($(this).parents('.num-ctr').attr('data-min'));
    var max = Number($(this).parents('.num-ctr').attr('data-max'));
    var number = Number($(this).siblings('input').val());
    $(this).siblings('input').val(++number);
    if (number >= max) {
        $(this).siblings('input').val(max);
        $(this).addClass('disabled');
        alertMsg('不能购买更多该类产品');
    } else {
        if (number > min) {
            $(this).siblings('.reduce').removeClass('disabled');
        }
    }
});

$('#onOff').click(function() {
	if ($(this).hasClass('icon-off')) {
		$(this).removeClass('icon-off').addClass('icon-on');
		$('#onOrOff').val(true);
	} else {
		$(this).removeClass('icon-on').addClass('icon-off');
		$('#onOrOff').val(false);
	}
})

// 首页
var toIndexTab = function(index) {
	$('.tab li').eq(index).addClass('active').siblings().removeClass('active');
	$('.tab-panel').eq(index).show().siblings().hide();
};

var toHideFilter = function() {
	$('.product-filter div').slideUp(150).attr('data-show', '0');
	$('.panel-overlay').hide();
};

$('.product-filter > p').click(function(e) {
	e.stopPropagation();
    if ($(this).siblings('div').attr('data-show') != '1') {
        $(this).siblings('div').slideDown(150).attr('data-show', '1');
        $('.panel-overlay').show();
    } else {
        $(this).siblings('div').slideUp(150).attr('data-show', '0');
        $('.panel-overlay').hide();
    }
    $(this).parents('.product-filter').siblings().find('div').slideUp(150).attr('data-show', '0');
});

$('.panel-overlay').click(function() {
	toHideFilter();
});

$('#showOrg').click(function() {
	toHideFilter();
	if ($(this).attr('data-status') == '0') {
		toChangeIndexList(1);
	} else {
		toChangeIndexList(0);
	}
});

// 首页列表显示 0 => 产品, 1 => 店铺 
var toChangeIndexList = function(index) {
	if (index == 0) {
		$('#productPanel').show();
	    $('#orgPanel').hide();
	    $('#showOrg').html('门店').attr('data-status', 0);
	} else {
		$('#productPanel').hide();
	    $('#orgPanel').show();
	    $('#showOrg').html('产品').attr('data-status', 1);
	}
};

var toSetIndexListParameter = function(element, arr) {
	$.each(arr, function(i, v) {
		element.attr(v.name, v.value);
	});
	element.attr('data-page', 0).html('');
	toHideFilter();
};

var toChangeLoadStatus = function(status, element) {
	switch(status) {
		case 0: element.html('<i class="icon-load"></i><span>加载中...</span>').attr('data-status', 1); break;
		case 1: element.html('点击加载更多数据').attr('data-status', 0); break;
		case 2: element.html('没有更多数据').attr('data-status', 2).addClass('unable'); break;
	}
};

$('#loadProduct').click(function() {
    var status = $(this).attr('data-status');
    if (status == '0') {
        toChangeLoadStatus(0, $(this));
        toGetProductList();
    }
});

$('#loadOrg').click(function() {
    var status = $(this).attr('data-status');
    if (status == '0') {
        toChangeLoadStatus(0, $(this));
        toGetOrgList();
    }
});

var toGetProductList = function() {
	toChangeLoadStatus(0, $('#loadProduct'));
	var regionId = $('#productList').attr('data-regionid');
	var category = $('#productList').attr('data-category');
	var filter = '';
	switch ($('#salesFilter').attr('data-status')) {
		case '0': filter = ''; break;
		case '1': filter = '?OrderBy=SaleCount,DESC';break;
		case '2': filter = '?OrderBy=SaleCount,ASC';break;
	}
	var orgNo = toGetParameter('orgNo');
	var pageNo = Number($('#productList').attr('data-page')) + 1;
	var pageSize = 20;
	var urlDetails = arguments.length > 0 ? '.' : './Views/Product'
	$('#productList').attr('data-page', pageNo);
    var settings = {
        url: apiUrl + 'Basis/Products/' + filter,
        cache: false,
        type: 'GET',
        dataType: 'json',
        data: {
        	OnSale: 1,
        	PageNo: pageNo,
        	PageSize: pageSize,
        	region: regionId,
        	category: category,
        	orgNo: orgNo,
        	opt: 1,
        	userId: userId
        },
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
    };
    $.ajax(settings).done(function(data) {
    	var productHtml = '';
        $.each(data, function(index, value) {
            productHtml += '<li class="list-sty01">'
                         + '    <a href="' + urlDetails + '/productDetails.html?productNo=' + value.productNo + '">'
                        + '        <img src="' + imgUrl + value.thumbImgFileId + '" alt="" />'
                         // + '        <img src="" alt="" />'
                         + '        <h3>'
                         + '            <i class="icon-superfine"></i>'
                         + '            <span>' + value.productName + '</span>'
                         + '            <em class="icon-new"></em>'
                         + '        </h3>'
                         // + '        <p>'
                         // + '            <i class="icon-full"></i>'
                         // + '            <span>满20减5元 满40减12元</span>'
                         // + '        </p>'
                         // + '        <p>'
                         // + '            <i class="icon-grab"></i>'
                         // + '            <span>买二瓶送一瓶</span>'
                         // + '        </p>'
                         + '        <h4>'
                         + '            <span>¥<i>' + value.salePrice + '</i></span>'
                         + '            <b>¥' + value.marketPrice + '</b>'
                         + '            <em>月售' + value.saleCount + '单</em>'
                         + '        </h4>'
                         + '    </a>'
                         + '</li>';
        });
        pageNo = 1 ? $('#productList').html(productHtml) : $('#productList').append(productHtml);;
        if (data.length < pageSize) {
	        toChangeLoadStatus(2, $('#loadProduct'));
        } else {
        	toChangeLoadStatus(1, $('#loadProduct'));
        }
    });
};

var toGetOrgList = function() {
	toChangeLoadStatus(0, $('#loadOrg'));
	var regionId = $('#productList').attr('data-regionId');
	var pageNo = Number($('#orgList').attr('data-page')) + 1;
	var pageSize = 20;
	$('#orgList').attr('data-page', pageNo);
	var settings = {
		url: apiUrl + 'Basis/Org/List',
		type: 'GET',
		dataType: 'json',
		cache: false,
        data: {
        	PageNo: pageNo,
        	PageSize: pageSize,
        	regionId: regionId,
        },
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		var orgListHtml = '';
		$.each(data, function(index, value) {
			var isNew = value.isNew ? '<em class="icon-new"></em>' : '';
			var address = value.address ? value.address : '上海市闸北区';
			orgListHtml += '<li class="list-sty02">'
                         + '    <a href="./Views/Product/shopDetails.html?orgNo=' + value.orgNo + '">'
                         + '        <div class="first-line">'
                         + '            <img src="' + imgUrl + value.thumbImgFileId + '" alt="">'
                         + '            <h3><span>' + value.orgName + '</span><i class="icon-superfine"></i></h3>'
                         + isNew
                         + '        </div>'
                         + '        <div class="second-line">'
                         // + '            <h4>店铺活动：</h4>'
                         // + '            <p><i class="icon-full"></i><span>满20减5元 满40减12元</span></p>'
                         // + '            <p><i class="icon-grab"></i><span>买二送一</span></p>'
                         + '            <h4>店铺介绍：</h4>'
                         + '            <p>' + value.description + '</span></p>'
                         + '            <p>店铺地址：' + value.address + '</span></p>'
                         + '        </div>'
                         + '    </a>'
                         + '</li>';
		});
		$('#orgList').append(orgListHtml);
		if (data.length < pageSize) {
	        toChangeLoadStatus(2, $('#loadOrg'));
        } else {
        	toChangeLoadStatus(1, $('#loadOrg'));
        }
	});
};

var toGetProvinceList = function() {
	var settings = {
		url: apiUrl + 'Common/Region',
		cache: false,
		type: 'GET',
		dataType: 'json',
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		var provinceListHtml = '';
		provinceListHtml += '<li data-id="" class="active">全部</li>';
		$.each(data, function(index, value) {
			if (value.regionType == 3) {
			    provinceListHtml += '<li data-id="' + value.regionId + '">' + value.regionName + '</li>'
			}
		});
		$('#provinceList').html(provinceListHtml);
	})
};

var toGetCategoryList = function() {
	var settings = {
		url: apiUrl + 'Common/Categories/1?opt=1',
		cache: false,
		type: 'GET',
		dataType: 'json',
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		var categoryListHtml = '';
		categoryListHtml += '<li data-id="1" class="active">全部</li>';
		$.each(data, function(index, value) {
			categoryListHtml += '<li data-category="' + value.categoryId + '">' + value.categoryName + '</li>'
		});
		$('#categoryList').html(categoryListHtml);
	});
};

$('#provinceList').on('click', 'li', function() {
	$(this).addClass('active').siblings().removeClass('active');
	toSetIndexListParameter($('#productList'), [{name: 'data-regionid', value: $(this).attr('data-id')}]);
	toSetIndexListParameter($('#orgList'), [{name: 'data-regionid', value: $(this).attr('data-id')}]);
	toGetProductList();
	toGetOrgList();
});

$('#categoryList').on('click', 'li', function() {
	$(this).addClass('active').siblings().removeClass('active');
	toSetIndexListParameter($('#productList'), [{name: 'data-category', value: $(this).attr('data-category')}]);
	toGetProductList();
	toChangeIndexList(0);
});

$('#salesFilter').click(function() {
    $('.panel-overlay').hide();
    $('#productList').attr('data-page', 0);
	$('.product-filter div').slideUp(150).attr('data-show', '0');
	switch ($(this).attr('data-status')) {
		case '0': $('#salesFilter').attr('data-status', 1); break;
		case '1': $('#salesFilter').attr('data-status', 2); break;
		case '2': $('#salesFilter').attr('data-status', 1); break;
	}
	toGetProductList();
	toChangeIndexList(0);
});


// 店铺详情页
var toGetOrgDetails = function() {
	var settings = {
		url: apiUrl + 'Basis/Org/Page/' + toGetParameter('orgNo'),
		type: 'GET',
		dataType: 'json',
		cache: false,
		data: {
			userId: userId
		},
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		$('#orgDescription').html(data.pages[0].detail);
		$('#orgName').html(data.org.orgName);
		$('#orgImg').attr('src', imgUrl + data.org.originalImgFileId);
		if(data.org.inFavorites) {
			$('#collectOrgBtn').addClass('active');
		}
	});
};

var toGetOrgLoc = function() {
	var settings = {
		url: apiUrl + 'Basis/Land/List/Org/' + toGetParameter('orgNo'),
		type: 'GET',
		dataType: 'json',
		cache: false,
		data: {
			orgNo: toGetParameter('orgNo')
		},
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		$.each(data, function(index, value) {
			var position = {
				longitude: value.longitude,
				latitude: value.latitude
			};
			toAddMap(index, position);
		})
	})
}
var toAddMap = function(no, position) {
	$('#orgMap').append('<div id="map' + no + '"></div>');
    var map = new AMap.Map('map' + no, {
        center: [position.longitude, position.latitude],
        zoom: 14
    });
    map.plugin(["AMap.ToolBar"], function() {
        map.addControl(new AMap.ToolBar());
    });
    marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: [position.longitude, position.latitude]
    });
    marker.setMap(map);
};
// 产品详情页
var toDrawRader = function(data) {
	var indicator = [];
	var normalValue = [];
	var tableHtml = '';
	$.each(data, function(index, value) {
		indicator.push({name: value.lexiconName, max: 10});
		normalValue.push(value.normalValue);
		tableHtml += '<li><em>' + value.lexiconName + '</em><span>' + value.normalValue.toFixed(3) + '</span></li>'
	});
	$('#raderList').html(tableHtml);
    var myChart = echarts.init(document.getElementById('rader'));
    option = {
	    // title: {
	    //     text: '基础雷达图'
	    // },
	    tooltip: {},
	    // legend: {
	    //     data: ['预算分配（Allocated Budget）']
	    // },
	    radar: {
	        // shape: 'circle',
	        indicator: indicator
	    },
	    series: [{
	        // name: '预算 vs 开销（Budget vs spending）',
	        type: 'radar',
	        // areaStyle: {normal: {}},
	        data : [
	            {
	                value : normalValue,
	                name : '预算分配（Allocated Budget）'
	            }
	        ]
	    }]
	};
    myChart.setOption(option);
};
var toGetProductDetails = function(productNo) {
	var settings = {
		url: apiUrl + 'Basis/Products/Page/' + productNo,
		cache: false,
		type: 'GET',
		dataType: 'json',
		data: {
		    userId: userId,
		},
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		toDrawRader(data.inspection);
		if (data.product.isNewProduct) {
			$('.icon-new').show();
		}
		if (data.product.inFavorites) {
			$('#collectProductBtn').addClass('active');
		}
		var parameterHtml = '';
		$.each(data.metadata, function(index, value) {
			if (value.content) {
				parameterHtml += '<tr>'
				               + '    <td>' + value.lexiconName + '</td>'
				               + '    <td>' + value.content + '</td>'
				               + '</tr>';
			}
		});
		var expressCharge = data.product.expressCharg;
		expressCharge = expressCharge ? expressCharge.toFixed(2) : '包邮';
		$('#productName').html(data.product.productName);
		$('#productDetails').html(data.page.detail);
		$('#shopHref').attr('href', $('#shopHref').attr('href') + data.org.orgNo);
		$('#saleCount').html(data.product.saleCount);
		$('#marketPrice').html('¥' + data.product.marketPrice);
		$('#salePrice').html('<i>¥</i>' + data.product.salePrice);
		$('#skuPrice').html('<i>¥</i>' + data.product.salePrice);
		$('#landArea').html(data.product.landArea);
		$('#expressCharge').html(expressCharge);
		$('#roughYield').html(data.product.roughYield);
		var stock = data.product.stockQty ? data.product.stockQty : '9999';
		$('#stock').html('库存：' + stock);
		$('#orgNo').val(data.product.orgNo);
		$('#productNo').val(data.product.productNo);
		$('#productImg').attr('src', imgUrl + data.product.thumbImgFileId);
		$('#orgName').html(data.org.orgName);
		$('#productInfo').html(parameterHtml);
		if (data.product.collectProductBtn) {
		    $('#collectProductBtn').addClass('active')
		}
	})
};

var toGetProductSku = function(productNo) {
	var settings = {
		url: apiUrl + 'Basis/Products/Sku/' + productNo,
		cache: false,
		type: 'GET',
		dataType: 'json',
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		var productSkuHtml = '';
		$.each(data, function(index, value) {
			var stockClass = value.stockQty > 0 ? '' : ' class="disabled"';
			productSkuHtml += '<li' +  stockClass + ' data-sku="' + value.skuNo + '" data-stock="' + value.stockQty + '" data-price="' + value.salePrice + '" data-imgsrc="' + value.thumbImgFileId + '">' + value.skuName + '</li>';
		});
		$('#productSku').html(productSkuHtml);
	})
};

$('#productSku').on('click', 'li', function() {
	if ($(this).hasClass('disabled')) {
		return false;
	}
	$('#skuNo').val($(this).attr('data-sku'));
	$('#skuName').val($(this).html());
	$('#skuPrice').html('¥' + $(this).attr('data-price'));
	$('#stock').html('库存： ' + $(this).attr('data-stock'));
	if ($(this).attr('data-imgsrc') != '0') {
		$('#productImg').attr('src', imgUrl + $(this).attr('data-imgsrc'));
	}
	$(this).addClass('active').siblings().removeClass('active');
	$('#chooseSku').text('已选择：' + $(this).html());
});

var toPosition = function(element) {
	$('.content').stop(true)
	    .animate({ scrollTop: element.offset().top + $('.content').scrollTop() - 50 }, 500);  
};

$('#productDetailsTab').on('click', 'li', function() {
	toPosition($($(this).attr('data-href')));
});

var collectSuccess = function(data) {
	alertMsg('收藏成功!');
};

var toCollect = function(productNo, orgNo) {
	var data = {
	    sequenceNo: 0,
		userId: userId,
		orgNo: orgNo,
		productNo: productNo,
		title: $('#productName').html(),
		url: 'http://a.b.c/to',
		timestamp: new Date()
	}
	toDoAjax(data, 'PUT', apiUrl + 'Basis/User/Favorites/' + userId, collectSuccess, null);
};

var toCancelCollect = function(productNo, orgNo, element) {
	var cancelDetails = '';
	if ((isNaN(Number(productNo)) || Number(productNo) == 0) && Number(orgNo) != 0) {
		cancelDetails = '/Org/' + orgNo;
	} else {
		cancelDetails = '/Product/' + productNo;
	}
	var settings = {
		url: apiUrl + "/Basis/User/Favorites/" + userId + cancelDetails,
		type: 'DELETE',
		dataType: 'json',
		cache: false,
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		alertMsg('取消收藏');
		if (element) {
			element.remove();
		}
	});
};

$('.favorite-list').on('click', '.cancel-collect', function() {
	toCancelCollect($(this).parents('li').attr('data-product'), $(this).parents('li').attr('data-org'), $(this).parents('li'));
});

$('#collectProductBtn').click(function() {
	if ($('#collectProductBtn').hasClass('active')) {
		toCancelCollect(toGetParameter('productNo'), 0, null);
		$('#collectProductBtn').removeClass('active');
	} else {
	    toCollect(toGetParameter('productNo'), 0);
		$('#collectProductBtn').addClass('active');
	}
});

$('#collectOrgBtn').click(function() {
	if ($('#collectOrgBtn').hasClass('active')) {
		toCancelCollect(0, toGetParameter('orgNo'), null);
		$('#collectOrgBtn').removeClass('active');
	} else {
	    toCollect(0, toGetParameter('orgNo'));
		$('#collectOrgBtn').addClass('active');
	}
});

// 购物车
var addShopCartSuccess = function(data) {
	alertMsg('已加入购物车!');
	toHideStandardFooter();
};

var addShopCartAndBuy = function(data) {
	window.location.href = '../order/shopCart.html';
};

var toAddShopCart = function(skuNo, productNo, quantity, href) {
	var arr = [
	    {
	    	"productNo": productNo,
	        "skuNo": skuNo,
	        "quantity": quantity
	    }
	];
	if (href) {
	    toDoAjax(arr, 'PUT', apiUrl + 'Market/Carts/' + userId + '/sku', addShopCartAndBuy);
	} else {
	    toDoAjax(arr, 'PUT', apiUrl + 'Market/Carts/' + userId + '/sku', addShopCartSuccess, null);
	}
};

var toGetShopProduct = function(orgNo, orgName) {
	var settings = {
		url: apiUrl + 'Market/Carts/' + userId + '/org/' + orgNo,
		type: 'GET',
		cache: false,
		dataType: 'json',
		crossDomain: true,
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		var shopCartHtml = '<div class="shop-cart" data-orgno="' + orgNo + '" data-orgname="' + orgName + '"><h4><i class="choose-org"></i><a><i class="icon-shop"></i>' + orgName + '</a><em class="editor-shop-cart" data-status="0">编辑</em></h4>';
		var shopCartEditorHtml = '';
		var totalCount = 0;
		$.each(data, function(index, value) {
			var reduceClass = value.quantity <= 1 ? ' disabled': '';
			var addClass = value.quantity >= 100 ? ' disabled': '';
			totalCount += value.salePrice * value.quantity;
			shopCartHtml += '<li class="list-sty03" data-skuNo="' + value.skuNo + '" data-productNo="' + value.productNo + '" data-quantity="' + value.quantity + '">'
                          + '    <input class="amount" type="hidden" value="' + value.amount + '"/>'
                          + '    <div class="choose" data-href="0"></div>'
                          + '    <div class="left exhibite">'
                          + '        <img src="' + imgUrl + value.thumbImgFileId + '" alt="">'
                          + '        <h3><a href="../Product/productDetails.html?productNo=' + value.productNo + '">' + value.productName + '</a></h3>'
                          + '        <p>' + value.skuName + '</p>'
                          + '        <h4><i>¥</i><span>' + value.salePrice + '</span></h4>'
                          + '        <div class="num-ctr" data-min="1" data-max="100" style="left: auto; right: 10px;">x' + value.quantity + '</div>'
                          + '    </div>'
                          + '    <div class="left editor" style="display: none;">'
                          + '        <img src="' + imgUrl + value.thumbImgFileId + '" alt="">'
                          + '        <h3><a href="../Product/productDetails.html?productNo=' + value.productNo + '">' + value.productName + '</a></h3>'
                          + '        <p>' + value.skuName + '</p>'
                          + '        <div class="num-ctr" data-min="1" data-max="100">'
                          + '            <a href="javascript:;" class="reduce' + reduceClass + '"></a>'
                          + '            <input class="num" type="text" value="' + value.quantity + '">'
                          + '            <a href="javascript:;" class="add' + addClass + '"></a>'
                          + '        </div>'
                          + '    </div>'
                          + '    <div class="right shop-cart-delete">'
                          + '        <i class="icon-delete-01"></i>'
                          + '    </div>'
                          + '</li>';
		});
		$('#shopCartList').append(shopCartHtml);
	});
};

var toGetShopCart = function() {
	var settings = {
		url: apiUrl + 'Market/Carts/' + userId + '/org',
		type: 'GET',
		cache: false,
		dataType: 'json',
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		$.each(data, function(index, value) {
			toGetShopProduct(value.orgNo, value.orgName);
		});
	});
};

var emptySuccess = function() {
	reload();
};

$('#emptyShopCart').click(function() {
	toDoAjax(null, 'DELETE', apiUrl + 'Market/Carts/' + userId + '/SkuAll', emptySuccess, null);
});

var deleteShopCartSuccess = function(data) {
	alertMsg('已删除！');
	reload();
}
$('#shopCartList').on('click', '.shop-cart-delete', function() {
	var arr = [
	    {
	        "skuNo": $(this).parents('li').attr('data-skuno'),
	        "productNo": $(this).parents('li').attr('data-productNo')
	    }
	];
	toDoAjax(arr, 'DELETE', apiUrl + 'Market/Carts/' + userId + '/sku', deleteShopCartSuccess, null);
});

$('#shopCartList').on('click', '.editor-shop-cart', function() {
	if ($(this).attr('data-status') == '0') {
		$(this).parents('.shop-cart').find('.exhibite').hide();
		$(this).parents('.shop-cart').find('.editor').show();
		$(this).html('完成');
		$(this).attr('data-status', 1);
	} else {
		var editorArray = $(this).parents('.shop-cart').find('li');
		var dataArray = [];
		$.each(editorArray, function(index, value) {
			var skuDetails = {};
			skuDetails.skuNo = $(this).attr('data-skuno');
			skuDetails.quantity = $(this).find('.num').val();
			skuDetails.productNo = $(this).attr('data-productNo');
			dataArray.push(skuDetails);
		});
		toDoAjax(dataArray, 'POST', apiUrl + 'Market/Carts/' + userId + '/sku', reload, null);
    }
});

var chooseShopCart = function() {
	var amount = 0;
	var elementArray = $('#shopCartList').find('.choose.active');
	elementArray.each(function() {
		amount += Number($(this).parents('li').find('.amount').val());
	});
	if (elementArray.length) {
		$('#settleAccounts').removeClass('disabled');
	} else {
		$('#settleAccounts').addClass('disabled');
	}
	$('#totalCount').html(amount.toFixed(2));
	$('#totalNum').html(elementArray.length);
}

$('#shopCartList').on('click', '.choose', function() {
	if ($(this).hasClass('active')) {
		$(this).removeClass('active');
	} else {
		$(this).addClass('active');
	}
	chooseShopCart();
});

$('#shopCartList').on('click', '.choose-org', function() {
	if ($(this).hasClass('choosed')) {
		$(this).removeClass('choosed');
	    $(this).parents('.shop-cart').find('.choose').removeClass('active');
	} else {
		$(this).addClass('choosed');
	    $(this).parents('.shop-cart').find('.choose').addClass('active');
	}
	chooseShopCart();
});

$('#chooseAllProduct').click(function() {
	if ($(this).hasClass('active')) {
		$(this).removeClass('active');
	    $('#shopCartList').find('.choose').removeClass('active');
	    $('#shopCartList').find('.choose-org').removeClass('choosed');
	} else {
		$(this).addClass('active');
	    $('#shopCartList').find('.choose').addClass('active');
	    $('#shopCartList').find('.choose-org').addClass('choosed');
	}
	chooseShopCart();
});

var prepareOrdersSuccess = function(data) {
	// window.location.href = '../Order/orderConfirm.html';
}


$('#settleAccounts').click(function() {
	if ($(this).hasClass('disabled')) {
		return false;
	}
	var orgArray = [];
	$('.choose.active').parents('.shop-cart').each(function() {
		var productArray = [];
		$(this).find('.choose.active').parents('li').each(function() {
			var obj = {
				skuNo: $(this).attr('data-skuno'),
				quantity: $(this).attr('data-quantity'),
				productNo: $(this).attr('data-productNo'),
				productName: $(this).find('h3 a').html(),
				quantity: $(this).attr('data-quantity'),
				skuName: $(this).find('p').html(),
				salePrice: $(this).find('h4 span').html(),
				imgSrc: $(this).find('img').attr('src'),
				amount: $(this).find('.amount').val()
		    };
			productArray.push(obj);
		});
		var orgItem = {
			orgNo: $(this).attr('data-orgno'),
			orgName: $(this).attr('data-orgname'),
			details: productArray
		};
		orgArray.push(orgItem);
	});
	localStorage.orderDetails = JSON.stringify(orgArray);
	window.location.href = '../Order/orderConfirm.html';
	// toDoAjax(dataArray, 'PUT', apiUrl + 'Market/Carts/' + userId + '/PrepareOrders', prepareOrdersSuccess, null);
});

// productDetail根据不同按钮改变弹框footer内容
var toShowStandardFooter = function(element) {
	$('#cartOrBuy').hide();
    $('#addShopCart').hide();
    $('#buyNow').hide();
    element.show();
	showOverlay();
	$('#productStandard').removeClass('slide-down').addClass('slide-up');
};

var toHideStandardFooter = function() {
	hideOverlay();
	$('#productStandard').removeClass('slide-up').addClass('slide-down');
};

$('#addShopCartBtn').click(function() {
	toShowStandardFooter($('#addShopCart'));
});

$('#buyNowBtn').click(function() {
	toShowStandardFooter($('#buyNow'));
});

$('#chooseStandard').click(function() {
	toShowStandardFooter($('#cartOrBuy'));
});

$('#productStandard .icon-close').click(function() {
	toHideStandardFooter();
});

$('.cart-btn').click(function() {
	if(!$('#skuNo').val()) {
		alertMsg('请选择规格！');
		return false;
	}
	toAddShopCart($('#skuNo').val(), $('#productNo').val(), $('#number').val(), false);
});

$('.buy-btn').click(function() {
	if(!$('#skuNo').val()) {
		alertMsg('请选择规格！');
		return false;
	}
	var orgArray = [];
	var obj = {
		skuNo: $('#skuNo').val(),
		productNo: $('#productNo').val(),
		productName: $('#productName').html(),
		quantity: $('#number').val(),
		skuName: $('#skuName').html(),
		salePrice: $('#skuPrice').html().slice(1),
		imgSrc: $('#productImg').attr('src'),
		amount: Number($('#number').val()) * Number($('#skuPrice').html().slice(1))
    };
	var productArray = [];
	productArray.push(obj);
	var orgItem = {
		orgNo: $('#orgNo').val(),
		orgName: $('#orgName').html(),
		details: productArray
	};
	orgArray.push(orgItem);
	localStorage.orderDetails = JSON.stringify(orgArray);
	window.location.href = '../Order/orderConfirm.html';

	// toAddShopCart($('#skuNo').val(), $('#productNo').val(), $('#number').val(), true);
});


var toGetAccountDetails = function() {
	var settings = {
		url: apiUrl + 'Basis/user/' + userId,
		type: 'GET',
		cache: false,
		dataType: 'json',
		data: {
			opt: 1 + 2 + 32
		},
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		console.log(data)
		$('#userName').val(data.userInfo.userName);
		$('#cellPhone').val(data.userInfo.cellPhone);
		$('#email').val(data.userInfo.email);
		var gender = data.userInfo.gender == 'M'? '男' : '女';
		$('#favoriteAll').html(data.favorites.length);
		var favoriteShop = 0;
		$.each(data.favorites, function(index, value) {
			if (value.orgNo != 0) {
				favoriteShop++;
			}
		});
		$('#favoriteShop').html(favoriteShop);
		$('#favoriteProduct').html(data.favorites.length - favoriteShop);
		var accountAddressHtml = '';
		$.each(data.address, function(index, value) {
			accountAddressHtml += '<div class="line">'
                                + '    <em class="address">地址' + index + '</em>'
                                + '    <span>' + value.address + '&nbsp;&nbsp;' + value.phone + '</span>'
                                + '</div>';
		});
		accountAddressHtml += '<div class="line"><a href="./address.html?choose=0"><b></b>收货地址管理</a></div>'
		$('#accountAddress').html(accountAddressHtml);
	});
};

var toUpdateAccountInfo = function(inputId) {
	var data = {
		userId: userId
	};
	data[inputId] = $('#' + inputId).val();
	var settings = {
		url: apiUrl + 'Basis/User/' + userId,
		type: 'POST',
		cache: false,
		dataType: 'json',
		data: data,
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
	});
};

$('.editor-user-info').click(function() {
	if ($(this).attr('data-status') == '0') {
	    $(this).siblings('input').removeAttr('readOnly');
	    $(this).addClass('active').attr('data-status', '1');
	} else {
		toUpdateAccountInfo($(this).siblings('input').attr('id'));
	    $(this).siblings('input').attr('readOnly', 'readOnly');
	    $(this).removeClass('active').attr('data-status', '0');
	}
});

$('.editor-user-code').click(function() {
	if ($(this).attr('data-status') == '0') {
	    $(this).siblings('input').removeAttr('readOnly');
	    $(this).addClass('active').attr('data-status', '1');
	    $(this).siblings('.verification').slideDown();
	} else {
		toUpdateAccountInfo($(this).siblings('input').attr('id'));
	    $(this).siblings('input').attr('readOnly', 'readOnly');
	    $(this).removeClass('active').attr('data-status', '0');
	}
});

var toGetFavoriteList = function(status) {
	var settings = {
		url: apiUrl + 'Basis/User/Favorites/' + userId + '?opt=' + status,
		type: 'GET',
		dataType: 'json',
		cache: false,
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		var favoriteHtml = '';
		if (status == 1) {
			$.each(data, function(index, value) {
				favoriteHtml += '<li class="list-sty02" data-org="' + value.orgNo + '">'
                              + '    <a href="../product/shopDetails.html?orgNo=' + value.orgNo + '">'
                              + '        <div class="first-line">'
                              + '            <img src="' + value.thumbUrl + '" alt="">'
                              + '            <h3><span>' + value.title + '</span><i class="icon-superfine"></i></h3>'
                              + '            <em class="icon-new"></em>'
                              + '        </div>'
                              + '        <div class="second-line">'
                              // + '            <h4>店铺活动：</h4>'
                              // + '            <p><i class="icon-full"></i><span>满20减5元 满40减12元</span></p>'
                              // + '            <p><i class="icon-grab"></i><span>买二送一</span></p>'
                              + '        </div>'
                              + '    </a>'
                              + '    <div class="right cancel-collect">'
                              + '        <i class="icon-delete-01"></i>'
                              + '    </div>'
                              + '</li>';
            });
		    $('#favoriteShopList').append(favoriteHtml);
		    $('#favoriteShop').html(data.length);
		} else if (status == 2){
            $.each(data, function(index, value) {
				favoriteHtml += '<li class="list-sty01" data-product="' + value.productNo + '">'
                              + '    <a href="../product/productDetails.html?productNo=' + value.productNo + '">'
                              + '        <img src="' + value.thumbUrl + '" alt="" />'
                              + '        <h3>'
                              + '            <i class="icon-superfine"></i>'
                              + '            <span>' + value.title + '</span>'
                              + '        </h3>'
                              + '        <p>'
                              // + '            <i class="icon-full"></i>'
                              // + '            <span>满20减5元 满40减12元</span>'
                              + '        </p>'
                              + '        <p>'
                              // + '            <i class="icon-grab"></i>'
                              // + '            <span>买二瓶送一瓶</span>'
                              + '        </p>'
                              + '        <h4>'
                              + '            <span>¥<i>' + value.salePrice + '</i></span>'
                              // + '            <b>¥28.80</b>'
                              + '        </h4>'
                              + '    </a>'
                              + '    <div class="right cancel-collect">'
                              + '        <i class="icon-delete-01"></i>'
                              + '    </div>'
                              + '</li>';
		    });
		    $('#favoriteProductList').append(favoriteHtml);
		    $('#favoriteProduct').html(data.length);
        }
	});
};

var toGetAddress = function() {
	var settings = {
		url: apiUrl + 'Basis/User/Address/' + userId,
		type: 'GET',
		dataType: 'json',
		cache: false,
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		var addressHtml = '';
		$.each(data, function(index, value) {
			var defaultClass = value.isDefault ? ' class="default"' : '';
			var defaultText = value.isDefault ? '默认地址' : '设为默认';
			var defaultBtnClass = value.isDefault ? ' default-address' : '';
			addressHtml += '<li' + defaultClass + ' data-href="' + value.userMetaNo + '">'
                         +'    <div class="p01">'
                         +'        <a href="javascript:;">'
                         +'            <h4>'
                         +'            <span class="address-contact">' + value.contact + '</span>'
                         +'            <em class="address-phone">' + value.phone + '</em>'
                         +'        </h4>'
                         +'            <p class="address-details">' + value.address + '</p>'
                         +'        </a>'
                         +'    </div>'
                         +'    <div class="p02">'
                         +'        <span class="default-address' + defaultBtnClass + '">'
                         +'            <i></i>'
                         +'            <em>' + defaultText + '</em>'
                         +'        </span>'
                         +'        <span class="editor-address">'
                         +'            <i class="icon-editor"></i>'
                         +'            <em>编辑</em>'
                         +'        </span>'
                         +'        <span class="delete-address">'
                         +'            <i class="icon-delete-03"></i>'
                         +'            <em>删除</em>'
                         +'        </span>'
                         +'    </div>'
                         +'</li>';
		});
		$('#addressList').html(addressHtml);
	});
};

$('#addressList').on('click', '.default-address', function() {
	var settings = {
		url: apiUrl + 'Basis/User/Address/' + userId + '/DefaultTo/' + $(this).parents('li').attr('data-href'),
		type: 'POST',
		dataType: 'json',
		cache: false,
		headers: {
            'accesskey': accessKey,
            'content-type': 'application/json',
            'cache-control': 'no-cache'
        },
        // beforeSend: function(xhr) {
        // 	toSetHeaders(xhr);
        // }
	};
	$.ajax(settings).done(function(data) {
		toGetAddress();
	});
});

$('#addressList').on('click', '.editor-address', function() {
	$('#userMetaNo').val($(this).parents('li').attr('data-href'));
	$('#addressDetails').val($(this).parents('li').find('.address-details').html()),
    $('#addressContact').val($(this).parents('li').find('.address-contact').html()),
    $('#addressPhone').val($(this).parents('li').find('.address-phone').html()),
    $('#isDefault').val($(this).parents('li').find('.address-default').hasClass('.default-address') ? true : false);
	showOverlay();
	$('#editorAddressGroup').show();
});

$('#addressList').on('click', '.delete-address', function() {
	var settings = {
		url: apiUrl + 'Basis/User/Address/' + userId,
		type: 'DELETE',
		dataType: 'json',
		cache: false,
		data: {
			userMetaNo: $(this).parents('li').attr('data-href')
		},
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        },
		// headers: {
	 //        'accesskey': accessKey,
	 //        'content-type': 'application/json',
	 //        'cache-control': 'no-cache'
	 //    },
	};
	$.ajax(settings).done(function(data) {
		toGetAddress();
	});
});

var addAddressSuccess = function() {
	toGetAddress();
	$('#editorAddressGroup').hide();
	hideOverlay();
};

$('#editorAddress').click(function() {
	if ($('#userMetaNo').val() != '0') {
		var data = {
	        userMetaNo: $('#userMetaNo').val(),
		    address: $('#addressDetails').val(),
		    contact: $('#addressContact').val(),
		    phone: $('#addressPhone').val(),
		    isDefault: $('#isDefault').val()
	    };
	    data = JSON.stringify(data);
		var settings = {
			url: apiUrl + 'Basis/User/Address/' + userId,
			crossDomain: true,
			type: 'POST',
			dataType: 'json',
			cache: false,
		    headers: {
			    'accesskey': accessKey,
			    'content-type': 'application/json',
			    'cache-control': 'no-cache'
			},
			data: data,
		};
		$.ajax(settings).done(function(data) {
			toGetAddress();
			$('#editorAddressGroup').hide();
		    hideOverlay();
		});
	} else {
		var data = {
		    userMetaNo: $('#userMetaNo').val(),
	        address: $('#addressDetails').val(),
	        contact: $('#addressContact').val(),
	        phone: $('#addressPhone').val(),
	        isDefault: false
		};

		toDoAjax(data, 'PUT', apiUrl + 'Basis/User/Address/' + userId, addAddressSuccess, null);
	}
	
});

$('#editorAddressGroup .icon-close').click(function() {
	$('#editorAddressGroup').hide();
	hideOverlay();
});

$('#addAddress').click(function() {
	showOverlay();
	$('#editorAddressGroup').show();
	$('#userMetaNo').val('0');
	$('#addressContact').val('');
	$('#addressPhone').val('');
	$('#addressDetails').val('');
});

$('#addressList').on('click', '.p01', function() {
    if (toGetParameter('choose') == '1') {
        window.location.href = '../Order/orderConfirm.html?address=' + $(this).parents('li').attr('data-href');
    }
});

var temporaryData;
var toGetTemporaryList = function() {
	var confirmListHtml = '';
	var data = JSON.parse(localStorage.orderDetails);
	var orgListHtml = '';
	var allAmount = 0;
	var allCount = 0;
	$.each(data, function(index, value) {
		var amount = 0;
		confirmListHtml += '<div><h4><i class="icon-shop"></i>' + value.orgName + '</h4><ul>';
		$.each(value.details, function(i, v) {
			confirmListHtml += '<li class="list-sty04">'
	                     + '    <img src="' + v.imgSrc + '" alt="">'
	                     + '    <h3><a href="javascript:;">' + v.productName + '</a></h3>'
	                     + '    <h5>(此商品性质不支持7天退货)</h5>'
	                     + '    <h4><i>¥</i>' + v.salePrice + '</h4>'
	                     + '    <p><b>规格: ' + v.skuName + '</b><em>数量：' + v.quantity + '</em></p>'
	                     + '</li>';
		    amount += Number(v.amount);
		});
		confirmListHtml += '</ul>'
                         + '<div>'
                         + '    <div>'
                         + '        <em>配送方式</em>'
                         + '        <span>快递¥0.00</span>'
                         + '    </div>'
                         // + '    <div>'
                         // + '        <em>开具发票</em>'
                         // + '        <input type="hidden" id="onOrOff">'
                         // + '        <span><i class="icon-off" id="onOff"></i></span>'
                         // + '    </div>'
                         + '    <div>'
                         + '        <span><em>共' + value.details.length + '件商品</em><em>小计：<i>¥<b>' + amount + '</b></i></em></span>'
                         + '    </div>'
                         + '</div></div>';
        allAmount += amount;
        allCount += Number(value.details.length);
	});
	$('#amount').html(allAmount.toFixed(2));
	$('#count').html(allCount)
    $('#confirmList').html(confirmListHtml);
};

var confirmOrderSuccess = function(data) {
	alertMsg('订单提交成功');
	setTimeout(function() {
	    window.location.href = '../../pay/waitPayment.html';
	}, 2000);
};
$('#confirmOrder').click(function() {
	if ($(this).hasClass('disabled')) {
		return false;
	}
	$(this).addClass('disabled');
	var dataArray = JSON.parse(localStorage.orderDetails);
	$.each(dataArray, function(index, value) {
		var order = {
			orgName: value.orgName,
			orgNo: value.orgNo,
			userId: userId
		};
		var payment = {
	        shippingContact: $('#addressName').html(),
	        shippingPhone: $('#addressPhone').html(),
	        shippingAddress: $('#addressDetails').html(),
	        shippingAddrSeqNo: $('#metaNo').val()
		};
		var details = value.details;
		var data = {
			order: order,
			payment: payment,
			details: details
		}
	    toDoAjax(data, 'PUT', apiUrl + 'Market/Orders/0?userId=' + userId + '&opt=1', confirmOrderSuccess);
	});
})

var toGetAddressDetails = function() {
	var metaNo = toGetParameter('address');
	var data = {
		MetaNo: metaNo
	};
	if (!metaNo) {
		data = {
			opt: 1
		}
	}
	var settings = {
		url: apiUrl + 'Basis/User/Address/' + userId,
		type: 'GET',
		dataType: 'json',
		cache: false,
		data: data,
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		$('#metaNo').val(data.userMetaNo);
		$('#addressName').html(data.contact)
		$('#addressPhone').html(data.phone);
		$('#addressDetails').html(data.address)
	});
}

var toGetOrder = function(orderStatus) {
	var settings = {
		url: apiUrl + 'Market/Orders/List/' + userId,
		type: 'GET',
		dataType: 'json',
		data: {
			state: orderStatus
		},
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		var orderListHtml = '';
		$.each(data, function(index, value) {
			var productHtml = '';
			var amount = 0;
			$.each(value.details, function(i, v) {
				productHtml += '<div class="list-sty04">'
                             + '    <img src="' + imgUrl + v.thumbImgFileId + '" alt="">'
                             + '    <h3><a href="javascript:;">' + v.productName + '</a></h3>'
                             // + '    <h5>(此商品性质不支持7天退货)</h5>'
                             + '    <h5>规格：' + v.skuName + '</h5>'
                             + '    <h4><i>¥</i>' + v.salePrice.toFixed(2) + '</h4>'
                             + '    <p>数量：' + v.quantity + '</p>'
                             + '</div>'
                amount += v.amount
			});
			var btnHtml = '';
			var orderDetailsUrl = '../../pay/orderDetails.html';
			switch(orderStatus) {
				case 1: btnHtml = '<h4><a class="cancel-order native" href="javascript:;">取消订单</a><a class="pay-order" href="javascript:;">付款</a></h4>'; orderDetailsUrl = '../pay/orderDetails.html'; break;
				case 5: btnHtml = '<h4><a href="logistics.html?sequenceNo=' + value.order.sequenceNo + '">查看物流</a></h4>'; break;
				case 6: btnHtml = '<h4><a class="native" href="logistics.html?sequenceNo=' + value.order.sequenceNo + '">查看物流</a><a href="orderComment.html?sequenceNo=' + value.order.sequenceNo + '">评价</a></h4>'; break;
			}
			orderListHtml += '<li class="list-sty05" data-href="' + value.order.sequenceNo + '">'
                           + '    <h3>'
                           // + '        <img src="../../img/temporary-logo.png" alt="">'
                           + '	  	  <i class="icon-shop"></i>'
                           + value.order.orgName
                           + '    </h3>'
                           + '    <div onclick="javascript:window.location.href=\'' + orderDetailsUrl + '?sequenceNo=' + value.order.sequenceNo + '\'">'
                           + productHtml
                           + '    </div>'
                           + '    <p>共' + value.details.length + '件，合计：<em>¥<b>' + amount.toFixed(2) + '</b></em>(包含快递)</p>'
                           + btnHtml
                           + '</li>';
		});
		$('#orderList').append(orderListHtml);
	})
};

var toGetLogisticsInfo = function() {
	var settings = {
		url: apiUrl + 'Market/Express/' + toGetParameter('sequenceNo')  + '?userId=' + userId,
		type: 'GET',
		dataType: 'json',
		cache: false
	};
	$.ajax(settings).done(function(data) {
		var state;
		switch (data.state) {
			case -1: state = '待查询'; break;
			case 0: state = '查询异常'; break;
			case 1: state = '暂无记录'; break;
			case 2: state = '在途中'; break;
			case 3: state = '派送中'; break;
			case 4: state = '已签收'; break;
			case 5: state = '用户拒签'; break;
			case 6: state = '疑难件'; break;
			case 7: state = '无效单'; break;
			case 8: state = '超时单'; break;
			case 9: state = '签售失败'; break;
			case 10: state = '退回'; break;
		}
		$('#logisticState').html(state);
		$('#expressCorpName').html(data.expressCorpName);
		$('#expressCorpTel').html(data.telphone);
		$('#mailNo').html(data.mailNo);
		var logisticsHtml = '';
		$.each(data.progress, function(index, value) {
			logisticsHtml += '<li>'
                           + '    <div class="left"></div>'
                           + '    <div class="point"></div>'
                           + '    <div class="right">'
                           + '        <div class="l01">' + value.context + '</div>'
                           + '        <div>' + new Date(value.time).Format(TIMEFORMATCOMPLETE)+ '</div>'
                           + '    </div>'
                           + '</li>';
		});
		$('#logisticsDetails').html(logisticsHtml);
	});
};

$('#orderList').on('click', '.cancel-order', function() {
	var $li = $(this).parents('li');
	var settings = {
		url: apiUrl + 'Market/Orders/' + $li.attr('data-href'),
		type: 'DELETE',
		dataType: 'json',
		cache: false,
		data: {
			SeqNo: $li.attr('data-href')
		},
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		alertMsg('订单取消成功');
		$li.remove();
	});
});

var toGetOrderDetails = function() {
	var seqNo = toGetParameter('sequenceNo');
    var settings = {
		url: apiUrl + 'Market/Orders/' + seqNo,
		type: 'GET',
		dataType: 'json',
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		switch (data.order.state) {
			case 1: $('#paymentTime').parents('div:eq(0)').hide();
		            $('#expressTime').parents('div:eq(0)').hide();
		            $('#paymentFooter').show();
				    break;
		    case 2: $('#expressTime').parents('div:eq(0)').hide();
				    break;
			case 5: $('#receiveFooter').show();
					$('#checklogistics > a').attr('href', '../Views/User/logistics.html?sequenceNo=' + seqNo);
					break;
			case 6: $('#commentFooter').show();
					$('#commitOrder > a').attr('href', '../Views/User/orderComment.html?sequenceNo=' + seqNo);
					$('#checklogistics > a').attr('href', '../Views/User/logistics.html?sequenceNo=' + seqNo);
					break;
		}
			
		var productHtml = '';
		$.each(data.details, function(index, value) {
            productHtml += '<div class="list-sty04">'
                         + '    <img src="' + imgUrl + value.thumbImgFileId + '" alt="">'
                         + '    <h3><a href="javascript:;">' + value.productName + '</a></h3>'
                         // + '    <h5>(此商品性质不支持7天退货)</h5>'
                         + '    <h5>规格：' + value.skuName + '</h5>'
                         + '    <h4><i>¥</i>' + value.salePrice + '</h4>'
                         + '    <p>数量：' + value.quantity + '</p>'
                         + '</div>'
		});
		$('#addressName').html(data.payment.shippingContact);
		$('#addressPhone').html(data.payment.shippingPhone);
		$('#addressDetails').html(data.payment.shippingAddress);
		$('#consumAmount').html(data.order.consumAmount);
		$('#consumDiscount').html(data.order.consumDiscount);
		$('#expressCharge').html(data.order.expressCharge);
		$('#tradeDate').html(new Date(data.order.tradeDate).Format(TIMEFORMATCOMPLETE));
		$('#paymentTime').html(new Date(data.payment.paymentTime).Format(TIMEFORMATCOMPLETE));
		$('#expressTime').html(new Date(data.payment.expressTime).Format(TIMEFORMATCOMPLETE));
		$('#amount').html(data.order.amount);
		$('#orderNo').html(data.order.orderNo);
		$('#sequenceNo').val(data.order.sequenceNo);
		$('#orderProductList').html(productHtml);
	})
};

$('#cancelOrder').click(function() {
	var element = $(this).parents('li');
	var settings = {
		url: apiUrl + 'Market/Orders/' + toGetParameter('sequenceNo'),
		type: 'DELETE',
		dataType: 'json',
		cache: false,
		data: {
			SeqNo: toGetParameter('sequenceNo')
		},
        beforeSend: function(xhr) {
        	toSetHeaders(xhr);
        }
	};
	$.ajax(settings).done(function(data) {
		alertMsg('订单取消成功');
		$('.footer-sty06 ul').html('<li class="disabled">已取消</li>');
		setTimeout(function() {
			window.reload();
		}, 2000);
	});
});

var toGetCommentList = function() {
	var settings = {
		url: apiUrl + 'Market/Orders/' + toGetParameter('sequenceNo'),
		type: 'GET',
		dataType: 'json',
		cache: false
	};
	$.ajax(settings).done(function(data) {
		var commentHtml = '';
		$('#orgNo').val(data.order.orgNo);
		$.each(data.details, function(index, value) {
			commentHtml += '<li data-productno="' + value.productNo + '" data-skuno="' + value.skuNo + '">'
                         + '    <div class="l01">'
                         + '        <img src="' + imgUrl + value.thumbImgFileId + '" alt="">'
                         + '        <textarea placeholder="分享"></textarea>'
                         + '    </div>'
                         + '    <div class="l02"></div>'
                         + '    <ul class="comment-level" data-level="1">'
                         + '        <li class="good active" data-level="1">'
                         + '            <i></i><span>好评</span>'
                         + '        </li>'
                         + '        <li class="common" data-level="0">'
                         + '            <i></i><span>中评</span>'
                         + '        </li>'
                         + '        <li class="bad" data-level="-1">'
                         + '            <i></i><span>差评</span>'
                         + '        </li>'
                         + '    </ul>'
                         + '</li>'
		});
		$('#commentList').html(commentHtml);
	});
};

$('.stars').on('click', 'li', function() {
    var index = $(this).index();
    $($(this).parents('.stars').attr('data-id')).val((index + 1) * 2);
    $(this).parents('.stars').find('li').removeClass('on');
    for(var i = 0; i <= index; i++) {
    	$(this).parents('.stars').find('li').eq(i).addClass('on');
    }
});

$('#commentList').on('click', '.comment-level li', function(data) {
	$(this).addClass('active').siblings().removeClass('active');
	$(this).parents('.comment-level').attr('data-level', $(this).attr('data-level'));
});

$('#chooseAnonymous').click(function() {
	if ($(this).hasClass('off')) {
		$(this).removeClass('off');
		$('#isAnonymous').val(0);
	} else {
		$(this).addClass('off');
		$('#isAnonymous').val(1);
	}
});

var commentSuccess = function(data) {
	alertMsg('评价成功！');
	setTimeout(function() {
		window.location.href = 'waitComment.html';
	}, 2000);
};

$('#confirmComment').click(function() {
	var orderNo = toGetParameter('sequenceNo');
	if (!$('#sellerAttitude').val() || !$('#logistic').val() || !$('#describe').val()) {
		alertMsg('请对所有评价项进行评分！');
		return;
	}
	var data = {
		org: {
			sequenceNo: 0,
			content: '',
			orderSeqNo: orderNo,
			orgNo: $('#orgNo').val(),
			scoring: {
				201001: $('#sellerAttitude').val(), 
				201002: $('#logistic').val(), 
				202001: $('#describe').val()
			}
		}
	};
	var products = [];
	$('#commentList > li').each(function() {
		var content = $(this).find('textarea').val();
		var level = $(this).find('.comment-level').attr('data-level');
		var productItem = {
			sequenceNo: 0,
			orderSeqNo: orderNo,
			productNo: $(this).attr('data-productno'),
			skuNo: $(this).attr('data-skuno'),
			content: content,
			score: $(this).find('.comment-level').attr('data-level'),
			state: Number($('#isAnonymous').val())
		};
		products.push(productItem);
	});
	data.products = products;
	toDoAjax(data, 'PUT', apiUrl + 'Market/Appraisal/' + orderNo, commentSuccess, null)
});

$('.verification').on('click', '.active', function() {
	var lastSecond = 59;
	var $this = $(this);
	$this.removeClass('active').html(lastSecond + '秒后可再次获取');
	var countDown = setInterval(function(){
		lastSecond--;
		$this.html(lastSecond + '秒后可再次获取');
		if (lastSecond == 0) {
			clearInterval(countDown);
			$this.html('获取验证码').addClass('active');
		}
	}, 1000);
});

var toGetProductComment = function(productNo) {
	var settings = {
		url: apiUrl + 'Market/Appraisal/product/' + productNo,
		type: 'GET',
		dataType: 'json',
		cache: false
	};
	$.ajax(settings).done(function(data) {
		console.log(data);
	});
}
