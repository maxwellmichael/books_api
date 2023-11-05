const mongoose = require('mongoose')
const Joi = require('joi') 




const bookSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3 },
  author: { type: String, required: true, minLength: 3 },
  tags: {
    type: Array,
    validate: {
      validator: function (value) {
        return value && value.length > 0
      },
    },
  },
  price: {
    type: Number,
    validate: {
      validator: function (value) {
        return value && value >= 0
      },
    },
  },
  isPublished: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Date,
    default: Date.now,
  },
})


function validateBook(data){
  const schema = Joi.object({
    name:Joi.string().min(3).required(),
    author: Joi.string().min(3).required(),
    tags:Joi.array().required(),
    price: Joi.number().required(),
    isPublished: Joi.boolean(),
    date: Joi.date(),
  })

  return schema.validate(data)

}


exports.Book = mongoose.model('books', bookSchema)
exports.validateBook = validateBook
