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

AuthorSongSchema.statics.getByAuthor = function(author) {
    return this.find({ name: new RegExp('' + author) }).limit(20).exec()
}
AuthorSongSchema.statics.count = function() {
    return this.countDocuments().exec();
}
CiSongSchema.statics.count = function() {
    return this.countDocuments().exec();
}
CiSongSchema.statics.search = function(key) {
    return this.find({ rhythmic: new RegExp(key) }).limit(20).exec()
}
AuthorsSchema.statics.getByAuthor = function(author) {
    return this.find({ name: new RegExp(author) }).limit(20).exec()
}
AuthorsSchema.statics.count = function() {
    return this.countDocuments().exec();
}
PoetSchema.statics.count = function() {
    return this.countDocuments().exec();
}
PoetSchema.statics.getFromIndex = function(index) {
    return this.find({}).skip(index).limit(1).exec();
}
PoetSchema.statics.search = function(key) {
    return this.find({ title: new RegExp(key) }).limit(20).exec()
}
LunyuSchema.statics.count = function() {
    return this.countDocuments().exec();
}
LunyuSchema.statics.search = function(key) {
    const reg = new RegExp(key)
    return this.find({ 
            $or: [
                { chapter: reg },
                { paragraphs: reg }
            ]
        }).limit(10).exec()
}
ShijingSchema.statics.count = function() {
    return this.countDocuments().exec();
}
ShijingSchema.statics.search = function(key) {
    const reg = new RegExp(key)
    return this.find({ 
            $or: [
                { title: reg },
                { chapter: reg },
                { section: reg },
                { content: reg }
            ]
        }).limit(10).exec()
}

module.exports.AuthorSongModel = mongoose.poetryConn.model('author_song', AuthorSongSchema);
module.exports.CiSongModel = mongoose.poetryConn.model('ci_song', CiSongSchema);
module.exports.AuthorsSongModel = mongoose.poetryConn.model('authors_song', AuthorsSchema);
module.exports.AuthorsTangModel = mongoose.poetryConn.model('authors_tang', AuthorsSchema);
module.exports.PoetSongModel = mongoose.poetryConn.model('peot_song', PoetSchema);
module.exports.PoetTangModel = mongoose.poetryConn.model('peot_tang', PoetSchema);
module.exports.LunyuModel = mongoose.poetryConn.model('lunyu', LunyuSchema);
module.exports.ShijingModel = mongoose.poetryConn.model('shijing', ShijingSchema);
