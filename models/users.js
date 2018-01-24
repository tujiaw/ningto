var mongoose = require('./mongo').mongoose;

var UsersSchema = new mongoose.Schema({
  provider: { type: String },
  login: { type: String },
  password: { type: String },
  token: { type: String },
  avatar_url: { type: String },
  detail_info: { type: String }
});

UsersSchema.static.getUserById = function(id) {
  return this.findOne({ _id: id }).exec()
}

UsersSchema.statics.getUserByProviderLogin = function(provider, login) {
  return this.findOne({ provider: provider, login: login}).exec();
}

UsersSchema.statics.getUserByToken = function(token) {
  return this.findOne({ token: token }).exec();
}

module.exports = mongoose.model('Users', UsersSchema);
