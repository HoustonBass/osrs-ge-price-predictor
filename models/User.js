const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        required: 'What do you want to call yourself?'
    },
    password: {
        type: String,
        required: 'And how do we know that its you...'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    methods: {
        type: [{
            type: String
        }]
    }
});

module.exports = mongoose.model('User', User);
