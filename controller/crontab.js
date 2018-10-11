const { TextJoke } = require('../models/joke')

function crontab() {
    let hitToday = 0;
    let textJokeTotal = 0;

    const work1 = async () => {
        hitToday = 0;
        textJokeTotal = await TextJoke.count();
        textJokeTotal = textJokeTotal || 10000;
        console.log(`work1, hitToday:${hitToday}, textJokeTotal:${textJokeTotal}`);
    }
    
    work1();
    setInterval(() => {
        if (new Date().getHours() === 0 && new Date().getMinutes() === 0) {
            work1();
        }
    }, 10000);

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
