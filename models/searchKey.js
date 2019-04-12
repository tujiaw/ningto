var mongoose = require('./mongo').mongoose;
var config = require('../config');
var PAGE_COUNT = config.pageCount;

const SearchPrefix = 'search';
const HitPrefix = 'hit';
const TagsPrefix = 'tags';

var SearchKeySchema = new mongoose.Schema({
  prefix: { type: String },
  key: { type: String },
  count: { type: Number }
});

SearchKeySchema.statics.getSearchKey = function(limit) {
  return this.find({ prefix: SearchPrefix }).limit(limit).sort({ count: -1 }).exec();
};
  
SearchKeySchema.statics.setSearchKey = function(key) {
  return this.updateOne({ prefix: SearchPrefix, key: key }, { $inc: {count: 1} }, {upsert: true}).exec();
};

SearchKeySchema.statics.addHit = function(pathname) {
    return Promise.all([
        this.updateOne({ prefix: HitPrefix, key: 'todayhit' }, { $inc: {count: 1}}, {upsert: true}).exec(), 
        this.updateOne({ prefix: HitPrefix, key: 'totalhit' }, { $inc: {count: 1}}, {upsert: true}).exec()]
    )
}

SearchKeySchema.statics.hit = function() {
  return this.find({ prefix: HitPrefix }).exec();
}

SearchKeySchema.statics.clearTodayHit = function() {
    return this.updateOne({ prefix: HitPrefix, key: 'todayhit'}, { $set: {todayhit: 0}}).exec();
}

SearchKeySchema.statics.getTags = function() {
  return this.findOne({ prefix: TagPrefix }).exec();
}

SearchKeySchema.statics.updateTags = function(tags) {
  return this.updateOne({ prefix: TagPrefix }, { $set: {key: tags}}, { upsert: true}).exec();
}

module.exports = mongoose.blogConn.model('SearchKey', SearchKeySchema);