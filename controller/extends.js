'use strict'

var config = require('config-lite');
var PostsModel = require('../models/posts');
var SearchKeyModel = require('../models/searchKey');
var MongoHelp = require('../models/mongo').mongoHelp;
var fs = require('fs');
var marked = require('marked');
var iconv = require('iconv-lite');
var path = require('path');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const readFilePromise = (path, encoding) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding || '', (err, data) => {
            if (err) {
                console.log('xxx:' + err);
                return reject();
            }
            return resolve(data);
        })
    })
}

const writeFilePromise = (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) {
                console.log('xxx:' + err);
                return reject();
            }
            return resolve();
        })
    })
}

module.exports.about = async function(ctx) {
    let aboutInfo = { 
        postCount: 0,
        postHits: 0,
        lastUpdate: '2017-04-19'
    }
    let posts = await PostsModel.getPostsProfile()
    posts.forEach(function(item) {
        aboutInfo.postCount++;
        aboutInfo.postHits += item.pv;
    })
    if (posts.length) {
        aboutInfo.lastUpdate = MongoHelp.id2time(posts[0]._doc._id, 'YYYY-MM-DD');
    }
    ctx.body = await ctx.render('about', { about: aboutInfo });
}

module.exports.program = async function(ctx) {
    ctx.body = await ctx.render('program');
}

module.exports.programUpload = async function(ctx) {
    ctx.body = await ctx.render('program_upload');
}

module.exports.mdviewer = async function(ctx) {
    ctx.body = await ctx.render('md_viewer');
}

module.exports.mdfile = async function(ctx, next) {
  if ('POST' != ctx.method) {
      return await next();
  }

  if (ctx.request.body.files && ctx.request.body.files.file) {
    const author = ctx.request.body.fields.author;
    const file = ctx.request.body.files.file;
    let content = await readFilePromise(file.path, 'utf8');
    if (content && content.length) {
        let matchstr = content.match(/�/g);
        if (matchstr && matchstr.length > 3) {
            content = await readFilePromise(file.path);
            content = iconv.decode(content, 'gbk');
            matchstr = content.match(/�/g);
            if (matchstr && matchstr.length > 30) {
                content = 'Invalid File Format';
            }
        }
        ctx.body = marked(content);
    } else {
        return await next();
    }
  } else {
    return await next();
  }
}

module.exports.createpostlist = async function(ctx, next) {
    const READ_PATH = './public/post-list-template.html';
    let posts = await PostsModel.getPostsProfile()
    MongoHelp.addAllCreateDateTime(posts);
    let html = await readFilePromise(READ_PATH, 'utf8');
    let content = '';
    posts.forEach((post, index) => {
        content += `<dt><a href="http://3inns.cn/post/${post._id}" add_date="${post.created_at}">${post.title}</a></dt>\n`
    })
    html = html.replace('dt-list-placeholder', content);
    ctx.set('Content-disposition', 'attachment;filename=3inns.cn.html');
    ctx.body = html;
}

module.exports.addHit = async function(pathname) {
    await SearchKeyModel.addHit(pathname);
    const totalHit = await SearchKeyModel.totalHit();
    return Promise.resolve(totalHit.count);
}

module.exports.githubOAuthCallbackComment = async function(ctx, next) {
    const code = ctx.query.code || '';
    const state = ctx.query.state || '';
    if (code.length && state.length) {
        const payload = {
            client_id: '531ad8e4517595748d97',
            client_secret: 'bf123fc9fe25a30e3e33d7a07daf825b73e07dc6',
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
        let content = await res.json()
        console.log(content);
        if (content.access_token && content.access_token.length) {
            res = await fetch('https://api.github.com/user?access_token=' + content.access_token, {
                header: {
                    'Accept': 'application/json',
                    'Authorization': 'token OAUTH-TOKEN'
                }
            })
            content = await res.text()
            console.log(content)
        }

        ctx.redirect('/')
    } else {
        ctx.body = '<h1>error</h1>';
    }
}