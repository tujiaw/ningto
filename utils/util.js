exports.internalHandle = function(internalSecond, count, fn) {
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

exports.asyncSleep = async function(ms) {
    function impl(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, ms);
        })
    }
    await impl(ms);
}

exports.getRandom = (x, y) => {
    let a = y - x + 1;
    return a > 0 ? Math.floor(Math.random() * a + x) : 0;
}

exports.encodeBase64 = function(str) {
    return new Buffer(str).toString('base64')
}

exports.decodeBase64 = function(str) {
    return new Buffer(str, 'base64').toString()
}
