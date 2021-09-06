require('dotenv').config()
const express = require('express')
const cors = require('cors')
const PORT = process.env.MY_PORT
const apiRoutes = require('./routes/router')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use('/', apiRoutes)

app.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`)
})