const { LaifuJoke } = require('../models/laifu')
const { getLaifuJoke } = require('../utils/showapi')

const laifu = {
  saveLaifuJoke: async function(obj) {
    const f = await LaifuJoke.getByTitle(obj.title);
    if (f.length) {
      console.log('is exist, title:' + obj.title)
    } else {
      await new LaifuJoke(obj).save();
    }
  },
  fetchfromshowapi: async function(ctx) {
    try {
      const result = await getLaifuJoke();
      const { showapi_res_body } = result.data
      const { list } = showapi_res_body
      if (Array.isArray(list)) {
        for (const content of list) {
          laifu.saveLaifuJoke(content)
        }
      }
      ctx.body = result.data;
    } catch (err) {
      ctx.throw(err)
    }
  }
}

module.exports = laifu;