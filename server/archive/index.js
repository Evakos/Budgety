const express = require('express')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')

const Expense = require('./models/exschema.js')

app.use(bodyParser.json())
const cors = require('cors')

app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

let expenses = [
  {
    id: 1,
    content: "Household",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Vehicle",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "Office",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
]

app.use(express.static('build'))

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.post('/api/expenses', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const expenses = new Expense({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  expenses.save().then(savedExpense => {
    response.json(savedExpense.toJSON())
  })
})

app.get('/api/expenses', (request, response) => {
  Expense.find({}).then(ex => {
    response.json(ex)
  })
})

app.get('/api/expenses/:id', (request, response) => {
  Expense.findById(request.params.id).then(ex => {
    response.json(ex.toJSON())
  })
})

app.delete('/api/expenses/:id', (request, response) => {
  const id = Number(request.params.id)
  expenses = expenses.filter(expense => expense.id !== id)

  response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server twat running on port ${PORT}`)
})



