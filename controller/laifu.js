const { LaifuJoke } = require('../models/laifu')

module.exports = {
  saveLaifuJoke: async function(obj) {
    const f = await LaifuJoke.getByTitle(obj.title);
    if (f.length) {
      console.log('is exist, title:' + obj.title)
    } else {
      await new LaifuJoke(obj).save();
    }
  }
}

