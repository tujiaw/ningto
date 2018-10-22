var mongoose = require('./mongo').mongoose;

const TextJokeSchema = new mongoose.Schema({
    ct: { type: String },
    id: { type: String },
    title: { type: String },
    text: { type: String },
    type: { type: Number }
})

TextJokeSchema.statics.total = function() {
    return this.countDocuments({}).exec();
}

TextJokeSchema.statics.getById = function(id) {
    return this.find({ id: id }).exec();
}

TextJokeSchema.statics.getAll = function() {
    return this.find({}).exec();
}

TextJokeSchema.statics.removeById = function(id) {
    return this.remove({id: id}).exec();
}

TextJokeSchema.statics.get = function(page, count) {
    page = Number(page || 1)
    count = Number(count || 20)

    return this.find()
    .sort({ ct: -1 })
    .skip(count * (page - 1))
    .limit(count)
    .exec();
}

module.exports = {
    TextJoke: mongoose.blogConn.model('TextJoke', TextJokeSchema)
}
