var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    postID: {
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

module.exports = mongoose.model('Comment', CommentSchema);

