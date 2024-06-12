const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const EventSchema = mongoose.Schema({
    start: Date,
    end: Date,
    title: String,
    calendar: {
        type: Schema.Types.ObjectId,
        ref: "Calendar",
    },
})

const Event = mongoose.model("Event",EventSchema);

module.exports = Event;