var mongoose = require('./mongo').mongoose;

var CommentsSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String },
  content: { type: String }
});

CommentsSchema.statics.getByPostId = function(postId) {
    return this.find({ postId: postId }).sort({ _id: -1 }).exec()
}

CommentsSchema.statics.countByPostId = function(postId) {
    return this.countDocuments({ postId: postId }).exec()
}

CommentsSchema.statics.deleteById = function(commentId) {
    return this.remove({ _id: commentId }).exec()
}

CommentsSchema.statics.getLastList = function(count) {
    return this.find({}).sort({ _id: -1 }).limit(count).exec()
}

module.exports = mongoose.blogConn.model('Comments', CommentsSchema);
