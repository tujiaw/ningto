var mongoose = require('./mongo').mongoose;

const LaifuJokeSchema = new mongoose.Schema({
    pubDate: { type: String },
    title: { type: String },
    poster: { type: String },
    url: { type: String },
    content: { type: String }
})

LaifuJokeSchema.statics.total = function() {
    return this.countDocuments({}).exec();
}

LaifuJokeSchema.statics.getByTitle = function(title) {
    return this.find({ title: title }).exec();
}

LaifuJokeSchema.statics.get = function(page, count) {
    page = Number(page || 1)
    count = Number(count || 20)
    console.log(`page:${page}, count:${count}`)

    return this.find()
    .sort({ pubDate: -1 })
    .skip(count * (page - 1))
    .limit(count)
    .exec();
}

module.exports = {
    LaifuJoke: mongoose.model('LaifuJoke', LaifuJokeSchema)
}
