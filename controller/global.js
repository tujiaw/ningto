const { TextJoke } = require('../models/joke')
const { mongoose } = require('../models/mongo')
const SearchKey = require('../models/searchKey')

class GlobalCache {
    constructor() {
        this.todayhit = 0
        this.totalhit = 0
        this.totalTextJokeCount = 0
    }

    async init() {
        const { totalhit, todayhit } = await SearchKey.hit()
        this.todayhit = todayhit
        this.totalhit = totalhit
        this.totalTextJokeCount = await TextJoke.countDocuments();
        this.totalTextJokeCount = this.totalTextJokeCount || 10000;
        console.log(this)
    }

    setTodayHit(val) { this.todayhit = val }
    setTotalHit(val) { this.totalhit = val }
    addTodayHit(inc) { this.todayhit += inc }
    addTotalHit(inc) { this.totalhit += inc }
    getTodayHit() { return this.todayhit }
    getTotalHit() { return this.totalhit }
    setTotalTextJokeCount(val) { this.totalTextJokeCount = val }
    getTotalTextJokeCount() { return this.totalTextJokeCount }
}

const global = new GlobalCache()
mongoose.blogConn.on('connected', function() {
    global.init()
})

module.exports = global