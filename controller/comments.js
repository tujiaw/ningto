const xss = require("xss");
const CommentsModel = require('../models/comments');
var MongoHelp = require('../models/mongo').mongoHelp;

module.exports.add = async function(ctx) {
    let result = '';
    try {
        let data = JSON.parse(ctx.request.body);
        if (data.postId.length && data.name.length && data.content.length) {
            const count = await CommentsModel.countByPostId(data.postId)
            if (count >= 1000) {
                result = '评论过多禁止发表新的评论'
            } else {
                data.name = xss(data.name)
                data.content = xss(data.content)
                await new CommentsModel(data).save()
            }
        } else {
            result = '参数错误'
        }
    } catch (err) {
        result = JSON.stringify(err, null, 2)
    }
    ctx.body = { result: result }
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
