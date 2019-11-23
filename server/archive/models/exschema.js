const mongoose = require('mongoose')

const url = 'mongodb+srv://bud1:FKlPPOFUS97GpK6Z@budgety-ck8pk.mongodb.net/budgety-app?retryWrites=true&w=majority'

console.log('connecting to', url)

mongoose.connect(url, { useNewUrlParser: true })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const expenseSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

expenseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Expenses', expenseSchema)  
