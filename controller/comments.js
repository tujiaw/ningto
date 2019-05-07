const xss = require("xss");
const CommentsModel = require('../models/comments');
var MongoHelp = require('../models/mongo').mongoHelp;
const log = require('log4js').getLogger('app')

const kMaxComments = 100;
function isCommentValid(content) {
    if (content.length < 3) {
        return false
    }

    const MAX_WORD_LEN = 15
    const chineseRegex =/[\u4E00-\u9FA5]+/; 
    const strList = content.split(/[ ，。；？！、,.;:!\/]/)
    for (let str of strList) {
        str = str.trim()
        if (str.length < MAX_WORD_LEN) {
            continue
        } else if (chineseRegex.test(str)) {
            continue
        } else {
            return false;
        }
    }
    return true;
}

module.exports.add = async function(ctx) {
    let result = '';
    try {
        let data = JSON.parse(ctx.request.body);
        if (data.postId.length && data.name.length && data.content.length) {
          if (data.name.length > 128 || data.content.length > 1024) {
            result = '名字或内容太长！'
          } else if (!isCommentValid(data.content)) {
            result = '评论不合法！'
          } else {
            const count = await CommentsModel.countByPostId(data.postId)
            if (count >= kMaxComments) {
                result = '评论过多禁止发表新的评论'
            } else {
                data.name = xss(data.name)
                data.content = xss(data.content)
                await new CommentsModel(data).save()
            }
          }
        } else {
            result = '参数错误！'
        }
    } catch (err) {
        result = JSON.stringify(err, null, 2)
    }
    ctx.body = result;
}

module.exports.reqRemove = async function(ctx) {
    let msg = 'success'
    const data = ctx.request.body
    if (data && data.commentId && data.commentId.length) {
        try {
            await CommentsModel.deleteById(data.commentId)
        } catch (err) {
            msg = err
        }
    }
    ctx.body = msg
}

module.exports.reqAdd = async function(ctx) {
    ctx.redirect('/');
    return; // 禁用评论

    let data = ctx.request.body
    if (data.postId.length && data.name.length && data.content.length) {
        try {
            const count = await CommentsModel.countByPostId(data.postId)
            if (count >= kMaxComments) {
                ctx.body = '评论过多禁止发表新的评论'
                return
            } else if (!isCommentValid(data.content)) {
                result = '评论不合法！'
            } else {
                data.name = xss(data.name)
                data.content = xss(data.content)
                await new CommentsModel(data).save()
            }
        } catch (err) {
          log.error(err)
        }
    }
    if (data.postId) {
        ctx.redirect('/post/' + data.postId);
      } else {
        ctx.redirect('/');
      }
}

module.exports.getByPostId = async function(ctx, postId) {
    let result = {
        error: '',
        content: []
    }
    try {
        const datas = await CommentsModel.getByPostId(postId)
        if (datas && Array.isArray(datas)) {
            MongoHelp.addAllCreateDateTime(datas)
        }
        result.content = datas.map(item => {
            return {
                id: item.id,
                name: item.name,
                content: item.content,
                created_at: item.created_at
            }
        })
    } catch (err) {
        result.error = err
    }
    ctx.body = result
}
