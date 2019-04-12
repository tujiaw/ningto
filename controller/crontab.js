const SearchKey = require('../models/searchKey')
const { sendToSumscope } = require('../utils/sendmail')
const Util = require('../utils/util')
const global = require('./global')
const axios = require('axios')
const log = require('log4js').getLogger()
const CronJob = require('cron').CronJob

function crontabStart() {
    const clearTodayHit = new CronJob('0 0 * * *', function() {
        log.info('clear today hit job start')
        SearchKey.clearTodayHit()
        global.setTodayHit(0)
    })

    const updateHit = new CronJob('* * * * *', function() {
        if (global.getTodayHit() > 0) {
            SearchKey.sethit(global.getTodayHit(), global.getTotalHit())
        }
    })

    const textJokeJob = new CronJob('0 5 * * *', function() {
        log.info('update text joke job start')
        Util.internalHandle(2, 5, (index) => {
            axios.get(`https://www.ningto.com/showapi/textjoke?page=${index}`);
        })
    })

    const sendMailJobj = new CronJob('30 17 * * *', function() {
        log.info('send today hit mail job start')
        //sendToSumscope('today hit', `count:${hitToday}`);
    })

    clearTodayHit.start()
    textJokeJob.start()
    sendMailJobj.start()
    updateHit.start()
}

module.exports = crontabStart