'use strict';

function leftPad(str, count) {
    return Array(Math.max(0, count - ('' + str).length + 1)).join(0) + str;
}

function curDate() {
    var date = new Date();
    return leftPad(date.getFullYear(), 4) +
          leftPad(date.getMonth() + 1, 2) +
          leftPad(date.getDate(), 2) +
          leftPad(date.getHours(), 2) +
          leftPad(date.getMinutes(), 2) +
          leftPad(date.getSeconds(), 2);
}

var showapiRequest = function(mainUrl, appId, appParams, callback) {
    var url = new String(mainUrl + '?');
    var params = {
        showapi_appid: appId,
        showapi_timestamp: curDate(),
        showapi_sign_method: 'md5',
        showapi_res_gzip: 1
    };

    appParams = appParams || {};
    for (var appParam in appParams) {
        params[appParam] = appParams[appParam];
    }

    var keys = [];
    for (var param in params) {
        keys.push(param);
    }

    keys.sort();
    var sortResult = '';
    keys.map(function(value) {
        sortResult = sortResult + value + params[value];
    });
    var secret = '21b693f98bd64e71a9bdbb5f7c76659c';
    var sign = md5(sortResult + secret);
    keys.map(function(value) {
        url = url + value + '=' + params[value] + '&';
    });
    url = url + 'showapi_sign=' + sign;
    $.get(url, function(result) {
        callback(result);
    });
};