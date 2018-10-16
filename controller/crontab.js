const { TextJoke } = require('../models/joke')
const JokeController = require('./joke')
const LaifuController = require('./laifu')
const { getTextJoke, getLaifuJoke } = require('../utils/showapi')

function crontab() {
    let hitToday = 0;
    let textJokeTotal = 0;

    const initData = async () => {
        try {
            hitToday = 0;
            textJokeTotal = await TextJoke.count();
            textJokeTotal = textJokeTotal || 10000;
            console.log(`initData, hitToday:${hitToday}, textJokeTotal:${textJokeTotal}`);
        } catch (err) {
            console.log('initdata error', err);
        }
    }

    const fetchTextJoke = async () => {
        let result;
        try {
            result = await getTextJoke(1);
            const { showapi_res_body } = result.data
            const { contentlist } = showapi_res_body
            contentlist.map((content) => {
                JokeController.saveTextJoke(content)
            })
        } catch (err) {
            console.log('fetchTextJoke error', err, result);
        }
    }

    const fetchLaifuJoke = async () => {
        let result;
        try {
            result = await getLaifuJoke();
            const { showapi_res_body } = result.data
            const { list } = showapi_res_body
            list.map((content) => {
                LaifuController.saveLaifuJoke(content)
            })
        } catch (err) {
            console.log('fetchLaifuJoke error', err, result);
        }
    }
    
    initData();
    setInterval(() => {
        if (new Date().getHours() === 0) {
            console.log('零点任务开始');
            initData();
            fetchTextJoke();
            fetchLaifuJoke();
            console.log('零点任务结束');
        }
    }, 36000);

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
