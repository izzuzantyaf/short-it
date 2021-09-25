require('dotenv').config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express()
app.use(cors({ optionsSuccessStatus: 200 }))
app.use(bodyParser.urlencoded({ extended: false }))

mongoose.connection.on('connecting', () => console.log('Connecting to MongoDB...')
)
mongoose.connection.on('connected', () => console.log('Connected to MongoDB!')
)
mongoose.connection.on('error', (error) => console.log(error))
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const { Schema } = mongoose
const urlSchema = new Schema({
  original_url: String,
  short_url: Number,
})
const Url = mongoose.model('Url', urlSchema)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.get('/api/short_url/:id', (req, res) => {
  // redirect to original url

})

app.post('/api/short_url', (req, res) => {
  // get original url from user
  const { original_url } = req.body
  // check if url is already in database
  const url = new Url
  Url.findOne({ original_url }, (err, data) => {
    if (!data) {
      url.original_url = original_url
      url.short_url = Math.floor(Math.random() * 100000)
      url.save((err, data) => {
        res.json(data)
      })
    }
    else
      res.send('hello')
  })
})

app.listen(process.env.PORT ?? 3000, () => {
  console.info('Server is up')
})