const mongoose = require('./mongo').mongoose;

const AuthorSongSchema = new mongoose.Schema({
    name: { type: String },
    short_description: { type: String },
    description: { type: String }
})

const CiSongSchema = new mongoose.Schema({
    author: { type: String },
    rhythmic: { type: String },
    paragraphs: { type: [String] }
})

const AuthorsSchema = new mongoose.Schema({
    name: { type: String },
    desc: { type: String }
})

const PoetSchema = new mongoose.Schema({
    author: { type: String },
    title: { type: String },
    paragraphs: { type: [String] },
    strains: { type: [String] }
})

const LunyuSchema = new mongoose.Schema({
    chapter: { type: String },
    paragraphs: { type: [String] }
})

const ShijingSchema = new mongoose.Schema({
    title: { type: String },
    chapter: { type: String },
    section: { type: String },
    content: { type: [String] }
})

AuthorSongSchema.statics.getByName = function(name) {
    return this.find({ name: new RegExp(name, 'i') }).limit(20).exec()
}
AuthorsSchema.statics.getByName = function(name) {
    return this.find({ name: new RegExp(name, 'i') }).limit(20).exec()
}

module.exports.AuthorSongModel = mongoose.model('author_song', AuthorSongSchema);
module.exports.CiSongModel = mongoose.model('ci_song', CiSongSchema);
module.exports.AuthorsSongModel = mongoose.model('authors_song', AuthorsSchema);
module.exports.AuthorsTangModel = mongoose.model('authors_tang', AuthorsSchema);
module.exports.PoetSongModel = mongoose.model('peot_song', PoetSchema);
module.exports.PoetTangModel = mongoose.model('peot_tang', PoetSchema);
module.exports.LunyuModel = mongoose.model('lunyu', LunyuSchema);
module.exports.ShijingModel = mongoose.model('shijing', ShijingSchema);
