const { TextJoke } = require('../models/joke')
const { sendToSumscope } = require('../utils/sendmail')
const Util = require('../utils/util')
const axios = require('axios')

function crontab() {
  let hitToday = 0;
  let textJokeTotal = 0;

  const initData = async () => {
    try {
      hitToday = 0;
      textJokeTotal = await TextJoke.countDocuments();
      textJokeTotal = textJokeTotal || 10000;
      console.log(`initData, hitToday:${hitToday}, textJokeTotal:${textJokeTotal}`);
    } catch (err) {
      console.log('initdata error', err);
    }
  }

  initData();
  setInterval(() => {
    const hours = new Date().getHours();
    if (hours === 0) {
      console.log('start 0 hours work')
      initData();

      Util.internalHandle(2, 5, (index) => {
        axios.get(`https://www.ningto.com/showapi/textjoke?page=${index}`);
      })
    }
    if (hours === 17) {
      sendToSumscope('today hit', `count:${hitToday}`);
    }
  }, 3600 * 1000);

  return {
    incHitToday: () => {
      return ++hitToday;
    },
    textJokeTotal: () => {
      return textJokeTotal;
    }
  }
}

module.exports = crontab();