'use strict'

var config = require('../config');
var PostsModel = require('../models/posts');
var SearchKeyModel = require('../models/searchKey');
var MongoHelp = require('../models/mongo').mongoHelp;
var fs = require('fs');
var marked = require('marked');
var iconv = require('iconv-lite');
var path = require('path');
var svgCaptcha = require('svg-captcha');
var crypto = require('crypto');

if (!fs.existsSync('./public/upload')) { fs.mkdirSync('./public/upload') }

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

async function file_md5(path) {
    var md5sum = crypto.createHash('md5');
    var stream = fs.createReadStream(path);
    return new Promise((resolve, reject) => {
        stream.on('data', function(chunk) {
            md5sum.update(chunk)
        })
        
        stream.on('end', function() {
            const md5str = md5sum.digest('hex').toUpperCase();
            resolve(md5str)
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
    ctx.body = await ctx.render('tool_mdviewer');
}

module.exports.mdfile = async function(ctx, next) {
  if ('POST' != ctx.method) {
      return await next();
  }

  if (ctx.request.body.files && ctx.request.body.files.file) {
    const author = ctx.request.body.fields.author;
    const file = ctx.request.body.files.file;
    console.log('mdfile, file:' + file.path);
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
  } else if (ctx.request.body.fields.md_text) {
    const text = ctx.request.body.fields.md_text
    ctx.body = marked(text)
  } else {
    return await next();
  }
}

module.exports.html2markdown = async function(ctx, next) {
    if ('GET' === ctx.method) {
        ctx.body = await ctx.render('tool_html2md');
    } else if ('POST' === ctx.method) {
        ctx.body = 'post'
    } else {
        return await next();
    }
}

module.exports.uploadImage = async function(ctx, next) {
    if ('GET' === ctx.method) {
        ctx.body = await ctx.render('tool_image');
    } else if ('POST' === ctx.method) {
        const { id } = ctx.request.body.fields
        const { file } = ctx.request.body.files
        console.log('uploadImage, file:' + file.path)
        try {
            const md5 = await file_md5(file.path)
            const ext = file.name.slice(file.name.lastIndexOf('.'))
            const newName = md5 + (ext.length > 2 ? ext : '');
            const dstPath = path.join('./public/upload', newName)
            if (!fs.exists(dstPath)) {
                const reader = fs.createReadStream(file.path)
                const writer = fs.createWriteStream(dstPath)
                reader.pipe(writer)
            }

            const response = { id: id, url: ctx.header.origin + '/upload/' + newName }
            console.log(response)
            ctx.body = response
        } catch (err) {
            ctx.body = err
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
        content += `<dt><a href="http://ningto.com/post/${post._id}" add_date="${post.created_at}">${post.title}</a></dt>\n`
    })
    html = html.replace('dt-list-placeholder', content);
    ctx.set('Content-disposition', 'attachment;filename=ningto.com.html');
    ctx.body = html;
}

module.exports.addHit = async function(pathname) {
    await SearchKeyModel.addHit(pathname);
    const totalHit = await SearchKeyModel.totalHit();
    return Promise.resolve(totalHit.count);
}


module.exports.eval = async function(ctx, evalEncode) {
    if (!evalEncode) {
        ctx.throw(404, 'invalid eval encode');
    }
    var express = decodeURIComponent(evalEncode);
    ctx.body = eval(express);
}

module.exports.captcha = async function(ctx) {
    ctx.body = svgCaptcha.create();
}
