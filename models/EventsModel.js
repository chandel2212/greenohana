var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
    name: String,
    summary: String,
    location: String,
    startdate: String,
    event_link: String,
    updated_date: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('Event', EventSchema);