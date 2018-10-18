const md5 = require('md5')
const axios = require('axios')

const SECRET = '21b693f98bd64e71a9bdbb5f7c76659c';
function curDate() {
  const leftPad = (str, count) => {
      return Array(Math.max(0, count - ('' + str).length + 1)).join(0) + str;
  }
  const date = new Date();
  const year = leftPad(date.getFullYear(), 4);
  const month = leftPad(date.getMonth() + 1, 2);
  const day = leftPad(date.getDate(), 2);
  const hours = leftPad(date.getHours(), 2);
  const minutes = leftPad(date.getMinutes(), 2);
  const seconds = leftPad(date.getSeconds(), 2);
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

var showapiRequest = function(mainUrl, appId, appParams, callback) {
    var url = mainUrl + '?';
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
    for (const key of keys) {
      sortResult = sortResult + key + params[key];
    }

    var sign = md5(sortResult + SECRET);
    for (const key of keys) {
      url = url + key + '=' + params[key] + '&';
    }
    url = url + 'showapi_sign=' + sign;
    console.log(url)
    return axios.get(url)
};

exports.getWchatHot = function(typeid, page) {
  const appParams = { typeId: typeid || 0, page: page || 1 }
  return showapiRequest('https://route.showapi.com/582-2', 17262, appParams)
}

exports.getTextJoke = function(page, maxResult = 20) {
  const appParams = { page: page || 1, maxResult: maxResult }
  return showapiRequest('http://route.showapi.com/341-1', 17262, appParams)
}

exports.getLaifuJoke = function() {
  return showapiRequest('http://route.showapi.com/107-32', 17262)
}
