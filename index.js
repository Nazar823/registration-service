require("dotenv").config()
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
// const PORT = 5001 //Использовать dotenv
// console.log(process.env.MY_PORT)
const PORT = process.env.MY_PORT
const bodyParser = require("body-parser");
const apiRoutes = require('./src/Routes/Routes')
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use('/', apiRoutes)

app.listen(PORT, () => {
    try {
        console.log(`Server started on port: ${PORT}`)
    } catch (e) {
        console.log(e)
    }
})