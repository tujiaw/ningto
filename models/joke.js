const mongoose = require('./mongo')

const TextJokeSchema = new mongoose.Schema({
    ct: { type: String },
    id: { type: String },
    title: { type: String },
    text: { type: String },
    type: { type: Number }
})

TextJokeSchema.statics.getById = function(id) {
    return this.find({ id: id }).exec();
}

TextJokeSchema.statics.get = function(page, count) {
    page = Number(page || 1)
    count = Number(count || 20)
    console.log(`page:${page}, count:${count}`)

    return this.find()
    .skip(count * (page - 1))
    .limit(count)
    .sort({ _id: -1 })
    .exec();
}

module.exports = {
    TextJoke: mongoose.model('TextJoke', TextJokeSchema)
}
