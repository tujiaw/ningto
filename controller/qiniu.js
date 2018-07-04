'use strict'

var qiniu = require('qiniu');
var config = require('../config');
const uuidV1 = require('uuid/v1');

var mac = new qiniu.auth.digest.Mac(config.qiniu.ak, config.qiniu.sk);
//构建上传策略函数
function getUptoken(bucket, key) {
  var options = {
      scope: bucket
  };
  var putPolicy = new qiniu.rs.PutPolicy(options);
  var uploadToken=putPolicy.uploadToken(mac);
  return uploadToken
}

module.exports.uptoken = async function(ctx) {
    const uptoken = getUptoken(config.qiniu.bucket);
    if (uptoken) {
        ctx.body = { uptoken: uptoken }
    } else {
        ctx.throw('uptoken error')
    }
}
