module.exports.internalHandle = function(internalSecond, count, fn) {
    let i = 0;
    const id = setInterval(() => {
        ++i;
        if (i > count) {
            clearInterval(id);
        } else {
            fn(i);
        }
    }, internalSecond * 1000)
}

module.exports.asyncSleep = async function(ms) {
    function impl(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, ms);
        })
    }
    await impl(ms);
}

module.exports.getRandom = (x, y) => {
    let a = y - x + 1;
    return a > 0 ? Math.floor(Math.random() * a + x) : 0;
}
