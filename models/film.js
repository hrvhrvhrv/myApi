var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FilmSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    studio: {
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true

    },
    review:{
        type: String,
        required: true

    },
    reviewer:{
        type: String,
        required: true

    },
    img: {
        data: Buffer,
        contentType: String
    },
}, {
    timestamp: { createdAt: 'created_at' }
});

module.exports = mongoose.model('Film', FilmSchema);