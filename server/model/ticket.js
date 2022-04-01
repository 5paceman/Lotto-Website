const mongoose = require("mongoose");
const User = require('./user').schema;
const crypto = require('crypto');

const Schema = mongoose.Schema;


let TicketSchema = new Schema({
    id: {type: String, index: {unique: true}, default: function() { return crypto.randomBytes(5).toString('hex');},
    numbers: {type: [Number], requird: true},
    expiry: {type: Date, required: true},
    purchased: {type: Date, required: true, default: Date.now},
    users: {type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true} 
});



module.exports = mongoose.model("Ticket", TicketSchema);
