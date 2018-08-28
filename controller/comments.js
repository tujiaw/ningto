const xss = require("xss");
const CommentsModel = require('../models/comments');

module.exports.add = async function(ctx) {
    let data = ctx.request.body;
    let error = '';
    try {
        if (data.postId.length && data.name.length && data.content.length) {
            const count = await CommentsModel.countByPostId(data.postId)
            if (count >= 1000) {
                error = '评论过多禁止发表新的评论'
            } else {
                data.name = xss(data.name)
                data.content = xss(data.content)
                await new CommentsModel(data).save()
            }
        } else {
            error = '参数错误'
        }
    } catch (err) {
        error = JSON.stringify(err, null, 2)
    }
    ctx.body = { error: error }
}

module.exports.getByPostId = async function(ctx, postId) {
    let result = undefined
    try {
        result = await CommentsModel.getByPostId(postId)
    } catch (err) {
        result = err
    }
    ctx.body = result
}
