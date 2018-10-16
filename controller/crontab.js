const { TextJoke } = require('../models/joke')
const JokeController = require('./joke')
const LaifuController = require('./laifu')
const { getTextJoke, getLaifuJoke } = require('../utils/showapi')

function crontab() {
    let hitToday = 0;
    let textJokeTotal = 0;

    const initData = async () => {
        const allJoke = await TextJoke.getAll()
        let mp = new Map();
        for (const joke of allJoke) {
            if (mp.has(joke.text)) {
                mp.get(joke.text).push(joke.id)
            } else {
                mp.set(joke.text, [joke.id])
            }
        }
        let removeCount = 0;
        mp.forEach((value, key) => {
            if (value.length > 1) {
                for (let i = 1; i < value.length; i++) {
                    TextJoke.removeById(value[i])
                    ++removeCount;
                }
            }
        })
        console.log('text joke remove repeat count:' + removeCount);

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
            for (let i = 1; i < 6; i++) {
                result = await getTextJoke(i);
                const { showapi_res_body } = result.data
                const { contentlist } = showapi_res_body
                if (Array.isArray(contentlist)) {
                    for (const content of contentlist) {
                        JokeController.saveTextJoke(content)
                    }
                }
            }
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
            if (Array.isArray(list)) {
                for (const content of list) {
                    LaifuController.saveLaifuJoke(content)    
                }
            }
        } catch (err) {
            console.log('fetchLaifuJoke error', err, result);
        }
    }
    
    initData();
    setInterval(() => {
        if (new Date().getHours() === 0) {
            initData();
        }
        if (new Date().getHours() === 3) {
            fetchTextJoke();
            fetchLaifuJoke();
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
