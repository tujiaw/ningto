const { TextJoke } = require('../models/joke')
const Crontab = require('./crontab')
const { getTextJoke } = require('../utils/showapi')

module.exports = {
  saveTextJoke: async function(obj) {
    const f = await TextJoke.getById(obj.id);
    if (f.length) {
      console.log('is exist, id:' + obj.id)
    } else {
      await new TextJoke(obj).save();
    }
  },
  getTextJoke: async function(ctx) {
    try {
      const page = ctx.query.page || 1
      const count = ctx.query.count || 20
      const list = await TextJoke.get(page, count)
      ctx.body = { page, count, list }
    } catch (err) {
      ctx.throw(err)
    }
  },
  textJoke: async function(ctx) {
    const getRandom = (x, y) => {
      let a = y - x + 1;
      return a > 0 ? Math.floor(Math.random() * a + x) : 0;
    }

    try {
      const page = ctx.query.page || 1
      const count = ctx.query.count || 20
      const PAGE_PREFIX = '/textjoke?page=';
      const totalPage = Crontab.textJokeTotal() / count;

      const prevPage = Math.max(1, parseInt(page) - 1);
      const nextPage = Math.min(totalPage, parseInt(page) + 1);
      const randomPage = Math.max(1, getRandom(1, totalPage));
      const list = await TextJoke.get(page, count)
      ctx.body = await ctx.render('joke', { 
        page, 
        count, 
        list,
        prevPage: PAGE_PREFIX + prevPage,
        nextPage: PAGE_PREFIX + nextPage,
        randomPage: PAGE_PREFIX + randomPage 
      })
    } catch (err) {
      ctx.throw(err)
    }
  },
  fetchfromshowapi: async function(ctx) {
    const page = ctx.query.page || 1
    const count = ctx.query.count || 20

    let result = {};
    try {
        result = await getTextJoke(page, count);
        const { showapi_res_body } = result.data
        const { contentlist } = showapi_res_body
        if (Array.isArray(contentlist)) {
          for (const content of contentlist) {
            this.saveTextJoke(content)
          }
        }
        ctx.body = result;
    } catch (err) {
      ctx.body = { err, result };
    }
  }
}

