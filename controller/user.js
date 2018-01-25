'use strict'

var UsersModel = require('../models/users');
var MongoHelp = require('../models/mongo').mongoHelp;
var sha1 = require('sha1');
var config = require('config-lite');
var Base64 = require('js-base64').Base64;
require('es6-promise').polyfill();
require('isomorphic-fetch');

module.exports.signin = async function(ctx) {
  console.log('-------------signin---------------')
  ctx.body = await ctx.render('signin')
}

module.exports.githubLogin = async function(ctx) {
  console.log('-------------github signin--------------')
  const user = ctx.session.user
  if (user) {
    const userinfo = await UsersModel.getBaseUserById(user._id)
    if (userinfo) {
      ctx.session.user = userinfo
      console.log(userinfo)
      ctx.redirect("back")
      return
    }
  }
  ctx.redirect('https://github.com/login/oauth/authorize?client_id=531ad8e4517595748d97&state=123456789')
}

module.exports.signout = async function(ctx) {
  console.log('-------------signout---------------')
  if (ctx.session.user) {
    ctx.session.user = null
  }
  ctx.redirect('back')
}

module.exports.reqSignin = async function(ctx) {
  const req = ctx.request.body
  if (req.username.length == 0 || req.password.length == 0) {
    ctx.body = 'username or password error'
  } else {
    let result = await UsersModel.getUserByProviderLogin('ningto', req.username)
    if (!result) {
      console.log('user not find')
      ctx.redirect('back')
      return
    }
    if (sha1(req.password) !== result.password) {
      console.log('password error')
      ctx.redirect('back')
      return
    }

    delete result.password
    ctx.session.user = result
    
    if (req.referrer) {
      ctx.redirect(req.referrer);
    } else {
      ctx.redirect('/');
    }
  }
}

module.exports.githubOAuthCallbackComment = async function(ctx, next) {
  const req = ctx.request.body
  const code = ctx.query.code || '';
  const state = ctx.query.state || '';
  if (code.length === 0) {
    ctx.body = '<span>Error, code is null!</span>'
    return;
  }

  console.log('--------access token---------')
  // 获取github token
  const payload = {
      client_id: config.github.client_id,
      client_secret: config.github.client_secret,
      code: code,
      state: state
  }
  let access = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  access = await access.json()
  console.log(access)
  if (!access.access_token) {
    ctx.body = '<span>github access token failed!</span>'  
    return
  }

  // 获取github用户信息
  console.log('------get github user------')
  let user = await fetch('https://api.github.com/user?access_token=' + access.access_token, {
    header: {
      'Accept': 'application/json',
      'Authorization': 'token OAUTH-TOKEN'
    }
  })
  user = await user.json()
  if (!user.login) {
    ctx.body = '<span>github get user info failed!</span>'  
    return
  }

  // 判断用户是否在数据库中，存在就更新不存在就写入
  const newUserinfo = {
    provider: 'github',
    login: user.login,
    token: access.access_token,
    avatar_url: user.avatar_url,
    detail_info: Base64.encode(JSON.stringify(user))
  }
  try {
    const resultUserinfo = await UsersModel.findOneAndUpdate(
      {provider: 'github', login: user.login}, 
      newUserinfo, 
      {upsert: true, returnNewDocument: true})
    if (resultUserinfo && resultUserinfo._doc) {
      const newUser = resultUserinfo._doc
      newUser.detail_info = ''
      ctx.session.user = newUser
      console.log(ctx.session.user)
      
      if (req.referrer) {
        ctx.redirect(req.referrer);
      } else {
        ctx.redirect('/');
      }
      return
    }
  } catch(e) {
    console.log(e)
  }
  ctx.body = '<span>save error!</span>'
}
