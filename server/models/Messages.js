const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    conversationId: {
        type: String,
    },
    senderId: {
        type: String,
    }, 
    message: {
        type: Array
    }
});

const Messages = mongoose.model('Message', messageSchema);

module.exports = Messages;