var mongoose = require('./mongo').mongoose;
var config = require('config-lite');
var PAGE_COUNT = config.pageCount;

const SearchPrefix = 'search';
const TotalHitPrefix = 'totalhit';

var SearchKeySchema = new mongoose.Schema({
  prefix: { type: String },
  key: { type: String },
  count: { type: Number }
});

SearchKeySchema.statics.getSearchKey = function(limit) {
  return this.find({ prefix: SearchPrefix }).limit(limit).sort({ count: -1 }).exec();
};
  
SearchKeySchema.statics.setSearchKey = function(key) {
  return this.update({ prefix: SearchPrefix, key: key }, { $inc: {count: 1} }, {upsert: true}).exec();
};

SearchKeySchema.statics.addHit = function(pathname) {
  return this.update({ prefix: TotalHitPrefix }, { $inc: {count: 1}}, {upsert: true}).exec();
}

SearchKeySchema.statics.totalHit = function() {
  return this.findOne({ prefix: TotalHitPrefix }, 'count').exec();
}

module.exports = mongoose.model('SearchKey', SearchKeySchema);