require('dotenv').config()
const express = require('express');
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// models
const Url = require('./models/Url')

// middlewares
app.use(cors({ optionsSuccessStatus: 200 }))
app.use(bodyParser.urlencoded({ extended: false }))

// handle database connection
mongoose.connection
  .on('connecting', () => console.log('Connecting to MongoDB...'))
  .on('connected', () => console.log('Connected to MongoDB!'))
  .on('disconnected', () => console.log('MongoDB is disconnected!'))
  .on('error', (error) => console.error(error))
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// list route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/api/short_url/:id', async (req, res) => {
  // get original url based on short url
  const { original_url } = await Url.findOne({ short_url: req.params.id }).exec()
  // redirect to original url
  res.redirect(original_url)
})

app.post('/api/short_url', async (req, res) => {
  const { original_url } = req.body
  // check if url is already in database
  const data = await Url.findOne({ original_url: original_url }).exec()
  // if url doesn't exist, create new one
  if (!data) {
    const url = new Url
    url.original_url = original_url
    url.short_url = Math.floor(Math.random() * 100000)
    url.save((err, data) => {
      if (err) res.json({ error: err })
      else res.json({ original_url: data.original_url, short_url: data.short_url })
    })
  }
  // if url is already in database, return the short url
  else {
    res.json({ original_url: data.original_url, short_url: data.short_url })
  }
})

app.listen(process.env.PORT ?? 3000, () => {
  console.info('Server is up on http://localhost:3000')
})