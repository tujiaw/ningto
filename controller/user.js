'use strict'

var UsersModel = require('../models/users');
var MongoHelp = require('../models/mongo').mongoHelp;
var sha1 = require('sha1');
var config = require('config-lite');
var Base64 = require('js-base64').Base64;
require('es6-promise').polyfill();
require('isomorphic-fetch');

async function getGithubInfo(token) {
  const res = await fetch('https://api.github.com/user?access_token=' + token, {
    header: {
      'Accept': 'application/json',
      'Authorization': 'token OAUTH-TOKEN'
    }
  })
  const userInfo = await res.json()
  if (userInfo.login) {
    const oldUserInfo = await UsersModel.getUserByProviderLogin('github', userInfo.login)
    if (oldUserInfo) {
      return oldUserInfo
    } else {
      await new UsersModel({
        provider: 'github',
        login: userInfo.login,
        token: token,
        avatar_url: userInfo.avatar_url,
        detail_info: Base64.encode(JSON.stringify(userInfo))
      }).save()
      const newUserInfo = await UsersModel.getUserByProviderLogin('github', userInfo.login)
      return newUserInfo;
    }
  }
  return undefined
}

module.exports.signin = async function(ctx) {
  console.log('-------------signin---------------')
  ctx.body = await ctx.render('signin')
}

module.exports.githubLogin = async function(ctx) {
  console.log('-------------github signin--------------')
  const user = ctx.session.user
  if (user) {
    const userinfo = await UsersModel.getUserById(user._id)
    if (userinfo) {
      delete userinfo.detail_info
      ctx.session.user = userinfo
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
  const code = ctx.query.code || '';
  const state = ctx.query.state || '';
  if (code.length === 0) {
    ctx.body = '<span>Error, code is null!</span>'
    return;
  }

  const payload = {
      client_id: config.github.client_id,
      client_secret: config.github.client_secret,
      code: code,
      state: state
  }
  let res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  const access = await res.json()
  if (access.access_token && access.access_token.length) {
    const userinfo = await getGithubInfo(access.access_token)
    if (userinfo) {
      delete userinfo.detail_info
      ctx.session.user = userinfo
      ctx.redirect('back')
      return
    }
  }
  ctx.body = '<span>github return failed!</span>'
}
