const mongoose = require('mongoose');

const jobSchema = new moongose.Schema({
    name: String,
    emoji: String
});

module.exports = moongose.model('job', jobSchema);