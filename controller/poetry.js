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
const Crontab = require('./crontab')
const { getRandom } = require('../utils/util')

async function randomPeotTang() {
    const maxCount = Crontab.poetryCount().peotTangsCount
    return await PoetTangModel.getFromIndex(getRandom(0, maxCount))
}

module.exports.main = async function(ctx) {
    try {
        ctx.body = await ctx.render('poetry', Crontab.poetryCount());
    } catch (err) {
        ctx.throw(err)
    }
}

module.exports.search = async function(ctx) {
    const type = ctx.query.type || ''
    const key = ctx.query.key || ''
    if (type.length && key.length) {
        let result = []
        try {
            if (type === '作者') {
                const a = await AuthorSongModel.getByAuthor(key)
                result = result.concat(Array.isArray(a) ? a : [])
                const b = await AuthorsSongModel.getByAuthor(key)
                result = result.concat(Array.isArray(b) ? b : [])
                const c = await AuthorsTangModel.getByAuthor(key)
                result = result.concat(Array.isArray(c) ? c : [])
            }
        } catch (err) {
            result = err
        }
        ctx.body = result
    } else {
        ctx.throw('type or key is error')
    }
}

module.exports.randomTang = async function(ctx) {
    try {
        const maxCount = Crontab.poetryCount().peotTangsCount
        ctx.body = await PoetTangModel.getFromIndex(getRandom(0, maxCount))
    } catch (err) {
        ctx.throw(err)
    }
}

