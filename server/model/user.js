var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

const SALT = 10;

var UserSchema = new Schema({
   username: {type: String, required: true, index: {unique: true}},
   password: {type: String, required: true},
   email: {type: String, required: true},
   created: {type: Date, required: true},
   isAdmin: {type: Boolean, default: false} // TODO: replace with permissions system
});

UserSchema.pre("save", function(next) {
    var user = this;

    if(user.isModified("password")) {
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
})

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model("User", UserSchema);