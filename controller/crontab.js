const SearchKey = require('../models/searchKey')
const { sendToSumscope } = require('../utils/sendmail')
const Util = require('../utils/util')
const global = require('./global')
const axios = require('axios')
const log = require('log4js').getLogger()
const CronJob = require('cron').CronJob

const bing = require('./config').bing
const path = require('path')
const url = require('url')
const fs = require('fs')

const BING_DIR = './public/bing'
if (!fs.existsSync(BING_DIR)) fs.mkdirSync(BING_DIR)

async function downloadBingWallpaper() {
    const bingResult = await axios.get(bing)
    const imageurl = bingResult.data.url
    const urlResult = url.parse(imageurl, true)
    const imagepath = path.join(BING_DIR, urlResult.query.id)
    if (fs.existsSync(imagepath)) {
        console.log('is exist:' + imagepath)
        return
    }

    const result = await axios({
        method:'get',
        url: imageurl,
        responseType:'stream'
    })
    result.data.pipe(fs.createWriteStream(imagepath))
}

function crontabStart() {
    // 每天零点清理当天访问数
    const clearTodayHit = new CronJob('0 0 * * *', function() {
        log.info('clear today hit job start')
        SearchKey.clearTodayHit()
        global.setTodayHit(0)
    })

    // 每分钟写入网站点击数
    const updateHit = new CronJob('* * * * *', function() {
        if (global.getTodayHit() > 0) {
            SearchKey.sethit(global.getTodayHit(), global.getTotalHit())
        }
    })

    // 每天早上五点更新文本笑话
    const textJokeJob = new CronJob('0 5 * * *', function() {
        log.info('update text joke job start')
        Util.internalHandle(2, 5, (index) => {
            axios.get(`https://www.ningto.com/showapi/textjoke?page=${index}`);
        })
    })

    // 每天下午五点半发送邮件
    const sendMailJob = new CronJob('30 17 * * *', function() {
        log.info('send today hit mail job start')
        //sendToSumscope('today hit', `count:${hitToday}`);
    })

    // 每天下午一点下载必应壁纸
    const bingJob = new CronJob('0 13 * * *', function() {
        log.info('down bing wallpaper job start')
        try {
            downloadBingWallpaper()
        } catch (err) {
            log.error(err)
        }
    })

    clearTodayHit.start()
    textJokeJob.start()
    sendMailJobj.start()
    updateHit.start()
    bingJob.start()
}

module.exports = crontabStart