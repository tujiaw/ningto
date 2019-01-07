const { TextJoke } = require('../models/joke')
const { sendToSumscope } = require('../utils/sendmail')
const Util = require('../utils/util')
const axios = require('axios')
const log = require('log4js').getLogger('app')

function crontab() {
  let hitToday = 0;
  let textJokeTotal = 0;

  const initData = async () => {
    try {
      log.debug('initdata start')
      hitToday = 0;
      textJokeTotal = await TextJoke.countDocuments();
      textJokeTotal = textJokeTotal || 10000;
      log.debug(`initData, hitToday:${hitToday}, textJokeTotal:${textJokeTotal}`);
      log.debug('initdata finished')
    } catch (err) {
      log.debug('initdata error', err);
    }
  }

  initData();
  setInterval(() => {
    const hours = new Date().getHours();
    if (hours === 0) {
      log.debug('start 0 hours work')
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