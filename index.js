require('dotenv').config()
const express = require('express')
const cors = require('cors')
const booksRouter = require('./routes/books')
const dbConnect = require('./dbConnect')

dbConnect()

const app = express()

app.use(express.json())
app.use(cors())
app.use('/api/books', booksRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on PORT:${PORT}`)
})
