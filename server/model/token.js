const mongoose = require("mongoose");
const User = require("./user").schema;
const crypto = require("crypto");

const Schema = mongoose.Schema;

const TOKEN_EXPIRY = '7d';
const TOKEN_GEN_COUNT = 40;

let TokenSchema = new Schema({
    token: {type: String, index: {unique: true}, default: function() { return crypto.randomBytes(TOKEN_GEN_COUNT / 2).toString('hex'); }},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    created: {type: Date, expires: TOKEN_EXPIRY, default: Date.now }
});

module.exports = mongoose.model("Token", TokenSchema);