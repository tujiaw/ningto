const { TextJoke } = require('../model/joke')

module.exports = {
    saveTextJoke: async function(obj) {
        const f = await TextJoke.getById(obj.id);
        if (f.length) {
            console.log('is exist, id:' + obj.id)
        } else {
            await new TextJoke(obj).save();
        }
    },
    getTextJoke: async function(ctx, next) {
        const page = ctx.query.page || 1
        const count = ctx.query.count || 20
        const list = await TextJoke.get(page, count)
        ctx.body = { page, count, list }
    }
}

