const mongoose = require('mongoose');
const { Schema } = mongoose;

const sessionSchema = new Schema({
 userId: {
    type: Schema.Types.ObjectId,
    ref: 'students', 
    required: true
 },
 sessionId: {
    type: String,
    required: true
 },
 createdAt: {
    type: Date,
    default: Date.now
 }
});

module.exports = mongoose.model('Session', sessionSchema,'sessions');