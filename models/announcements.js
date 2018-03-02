var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AnnouncementSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamp: true
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);