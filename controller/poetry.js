const {
    AuthorSongModel,
    CiSongModel,
    AuthorsSongModel,
    AuthorsTangModel,
    PoetSongModel,
    PoetTangModel,
    LunyuModel,
    ShijingModel
} = require('../models/poetry');

module.exports.main = async function(ctx) {
    ctx.body = await ctx.render('poetry');
}

module.exports.getAuthor = async function(ctx, name) {
    if (name.length) {
        let result = []
        try {
            const a = await AuthorSongModel.getByName(name)
            result = result.concat(Array.isArray(a) ? a : [])
            const b = await AuthorsSongModel.getByName(name)
            result = result.concat(Array.isArray(b) ? b : [])
            const c = await AuthorsTangModel.getByName(name)
            result = result.concat(Array.isArray(c) ? c : [])
        } catch (err) {
            ctx.throw(err)
        }
        ctx.body = result
    } else {
        ctx.throw('name is error')
    }
}

