var mongoose = require('./mongo').mongoose;
var config = require('config-lite');
var PAGE_COUNT = config.pageCount;

var SearchKeySchema = new mongoose.Schema({
  key: { type: String },
  count: { type: Number }
});


SearchKeySchema.statics.getSearchKey = function(limit) {
  return this.find().limit(limit).sort({ count: -1 }).exec();
};
  
SearchKeySchema.statics.setSearchKey = function(key) {
  return this.update({ key: key }, { $inc: {count: 1} }, {upsert: true}).exec();
};

module.exports = mongoose.model('SearchKey', SearchKeySchema);