var mongoose = require('mongoose');
var md5 = require('md5');

var userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
},{
  timestamps: true
});

userSchema.pre('save', function(next){
  var user = this;
  if (!user.isModified('password')) {
    return next;
  }

  user.password = md5(user.password);
  next();
});

module.exports = mongoose.model('User', userSchema, 'user');
