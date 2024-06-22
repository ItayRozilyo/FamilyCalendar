const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CalendarSchema = mongoose.Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    editors: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    viewers: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
})

const Calendar = mongoose.model("Calendar",CalendarSchema);

module.exports = Calendar;