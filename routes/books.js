const express = require('express')
const { Book, validateBook } = require('../models/Book')
const router = new express.Router()

router.get('', async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0
    const limit = parseInt(req.query.limit) || 5
    const search = req.query.search || ''

    const books = await Book.find({
      name: { $regex: search, $options: 'i' },
    })
      .skip(page * limit)
      .limit(limit)
      .sort({ name: 1 })
    const count = await Book.countDocuments({})
    res.send({
      total: count,
      page: req.query.page,
      limit: limit,
      data: books,
    })
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  if (!id || id == '') {
    res.status(400).send('Invalid Id')
    return
  }

  try {
    const book = await Book.findById(id)
    res.send(book)
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id
    if (!id || id == '') {
      res.status(400).send('Invalid Id')
      return
    }

    const data = req.body
    const validationResult = validateBook(data)
    if (validationResult.error) {
      const messages = []
      validationResult.error.details.map((err) => messages.push(err.message))
      res.status(401).send(messages)
      return
    }

    const book = await Book.findById(id);
    if(!book){
      res.status(404).send('Book not found')
    }

    book.set({
      name: data.name,
      author: data.author,
      tags: data.tags,
      price: data.price,
      isPublished: data.isPublished,
    })
    const result = await book.save()
    res.send(result)

  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

router.post('', async (req, res) => {
  try {
    const data = req.body
    const result = validateBook(data)
    if (result.error) {
      const messages = []
      result.error.details.map((err) => messages.push(err.message))
      res.status(401).send(messages)
      return
    }

    let newBook = new Book(data)
    newBook = await newBook.save()
    res.send(newBook)
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const result = await Book.deleteOne({ _id: id })
    if (result.error) {
      res.status(400).send(error.details)
      return
    }
    res.send(result)
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router
