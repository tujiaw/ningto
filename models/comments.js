var mongoose = require('./mongo').mongoose;
var config = require('../config');

var CommentsSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String },
  content: { type: String }
});

CommentsSchema.statics.getByPostId = function(postId) {
    return this.find({ postId: postId }).exec()
}

CommentsSchema.statics.countByPostId = function(postId) {
    return this.count({ postId: postId }).exec()
}

module.exports = mongoose.model('Comments', CommentsSchema);