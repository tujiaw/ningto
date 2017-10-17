var mongoose = require('./mongo').mongoose;
var config = require('config-lite');
var PAGE_COUNT = config.pageCount;

var PostSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  content: { type: String },
  pv: { type: Number },
  tags: { type: [String] },
});

PostSchema.statics.getPostById = function(postId) {
  return this.findOne({ _id: postId})
    .populate({ path: 'author', model: 'Users'})
    .exec();
};

PostSchema.statics.getPostsProfile = function(author, page) {
  var query = {};
  if (author) {
    query.author = author;
  }
  if (page && page > 0) {
    return this.find(query)
      .populate({ path: 'author', model: 'Users'})
      .skip(PAGE_COUNT * (page - 1))
      .limit(PAGE_COUNT)
      .sort({ _id: -1 })
      .exec();
  } else {
    return this.find(query)
      .populate({ path: 'author', model: 'Users'})
      .sort({ _id: -1 })
      .exec();
  }
};

PostSchema.statics.getPostsCount = function(author) {
  var query = {};
  if (author) {
    query.author = author;
  }
  return this.count(query).exec();
};

PostSchema.statics.incPv = function(postId) {
  return this.update({ _id: postId }, { $inc: {pv: 1} }).exec();
};

PostSchema.statics.getRawPostById = function(postId) {
  return this.findOne({ _id: postId })
    .populate({ path: 'author', model: 'Users'})
    .exec();
};

PostSchema.statics.getPostByTag = function(tag) {
  return this.find({tags: { $all: [tag] }})
    .sort({ _id: -1 })
    .exec();
};

PostSchema.statics.searchPost = function(name) {
  return this.find({
    '$or': [
      {title: new RegExp(name, 'i')},
      {content: new RegExp(name, 'i')}
    ]
  })
  .sort({ 'pv': -1 })
  .exec();
};

PostSchema.statics.hotSearchPost = function(count) {
  return this.find({}).sort({'pv': -1}).limit(count).exec();
};

PostSchema.statics.updatePostById = function(postId, author, content) {
  return this.update({ author: author, _id: postId }, { $set: content }).exec();
};

PostSchema.statics.delPostById = function(postId, author) {
  return this.remove({ author: author, _id: postId }).exec();
};

PostSchema.statics.getPrevPostById = function(postId) {
  return this.find({ _id: { $gt : postId }}).sort({ _id: 1 }).limit(1).exec();
}

PostSchema.statics.getNextPostById = function(postId) {
  return this.find({ _id: { $lt : postId }}).sort({ _id: -1 }).limit(1).exec();
}

module.exports = mongoose.model('Posts', PostSchema);