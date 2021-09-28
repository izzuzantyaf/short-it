const { Schema } = require('mongoose')
module.exports = new Schema({
  original_url: String,
  short_url: Number,
})