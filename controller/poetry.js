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
            if (type === 'zuozhe') {
                const a = await AuthorSongModel.getByAuthor(key)
                result = result.concat(Array.isArray(a) ? a : [])
                const b = await AuthorsSongModel.getByAuthor(key)
                result = result.concat(Array.isArray(b) ? b : [])
                const c = await AuthorsTangModel.getByAuthor(key)
                result = result.concat(Array.isArray(c) ? c : [])
            } else if (type === 'tangshi') {
                result = await PoetTangModel.search(key)
            } else if (type === 'songshi') {
                result = await PoetSongModel.search(key)
            } else if (type === 'songci') {
                result = await CiSongModel.search(key)
            } else if (type === 'lunyu') {
                result = await LunyuModel.search(key)
            } else if (type === 'shijing') {
                result = await ShijingModel.search(key)
            }
        } catch (err) {
            result = err
        }
        console.log(result)
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

