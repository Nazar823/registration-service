require("dotenv").config()
const express = require('express')
const cors = require('cors')
const PORT = process.env.MY_PORT
const apiRoutes = require('./Routes/Routes')
const bodyParser = require("body-parser");
const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use('/', apiRoutes)

app.listen(PORT, () => {
    try {
        console.log(`Server started on port: ${PORT}`)
    } catch (e) {
        console.log(e)
    }
})