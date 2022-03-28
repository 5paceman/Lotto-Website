/* TODO:
 * - Auto increment ticket numbers
 */
var mongoose = require("mongoose");
var User = require('./user').schema;

var Schema = mongoose.Schema;

var TicketSchema = new Schema({
    id: {type: Number, required: true},
    numbers: {type: [Number], requird: true},
    expiry: {type: Date, required: true},
    purchased: {type: Date, required: true},
    users: {type: [mongoose.Schema.Types.ObjectId], ref: 'User', required: true} 
});



module.exports = mongoose.model("Ticket", TicketSchema);
