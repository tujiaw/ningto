var mongoose = require('./mongo').mongoose;

var UsersSchema = new mongoose.Schema({
  name: { type: String },
  password: { type: String },
  avatar: {type: String },
  gender: { type: String, enum:['m', 'f', 'x'] },
  bio: { type: String }
});

UsersSchema.statics.getUserByName = function(name) {
  return this.findOne({name: name}).exec();
};

module.exports = mongoose.model('Users', UsersSchema);
