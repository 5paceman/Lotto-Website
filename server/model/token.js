var mongoose = require("mongoose");
const User = require("./user");
var crypto = require("crypto");

var Schema = mongoose.Schema;

const TOKEN_GEN_COUNT = 20;

var TokenSchema = new Schema({
    token: {type: String, index: {unique: true}, default: function() { return crypto.randomBytes(TOKEN_GEN_COUNT / 2).toString('hex'); }},
    user: {type: User, required: true}
});

module.exports = mongoose.model("Token", TokenSchema);