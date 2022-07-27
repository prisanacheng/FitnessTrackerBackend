require("dotenv").config()
const express = require("express")
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const client = require("./db/client")
client.connect();

app.use(morgan('dev'))

app.use(express.json())

app.use(cors())

const apiRouter = require('./api')
app.use('/api', apiRouter)

app.use((error, req, res, next)=>{
// console.error(error)
res.send({
    message: error.message,
    name: error.name,
    error: error.message
})
})
module.exports = app;


