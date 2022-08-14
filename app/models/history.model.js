const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    message: {
        type: String
    },
    taskId: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('history', HistorySchema);