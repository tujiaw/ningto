module.exports = async function sleep(ms) {
    function impl(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, ms);
        })
    }
    await impl(ms);
}
