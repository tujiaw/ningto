const { TextJoke } = require('../models/joke')
const { sendToSumscope } = require('../utils/sendmail')
const Util = require('../utils/util')
const axios = require('axios')
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

function crontab() {
  let hitToday = 0;
  let textJokeTotal = 0;
  let poetryCount = {};

  const initData = async () => {
    try {
      console.log('initdata start')
      hitToday = 0;
      textJokeTotal = await TextJoke.countDocuments();
      textJokeTotal = textJokeTotal || 10000;
      console.log(`initData, hitToday:${hitToday}, textJokeTotal:${textJokeTotal}`);

      poetryCount.peotTangsCount = await PoetTangModel.count();
      poetryCount.peotSongsCount = await PoetSongModel.count();
      poetryCount.ciSongsCount = await CiSongModel.count();
      poetryCount.shiAuthorsCount = await AuthorsSongModel.count() + await AuthorsTangModel.count();
      poetryCount.ciAuthorsCount = await AuthorSongModel.count();
      poetryCount.lunyuCount = await LunyuModel.count();
      poetryCount.shijingCount = await ShijingModel.count();
      console.log('initdata finished')
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
    },
    poetryCount: () => {
      return poetryCount;
    }
  }
}

module.exports = crontab();