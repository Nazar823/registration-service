const express = require('express')
const cors = require('cors')
const PORT = 5001
const bodyParser = require("body-parser");
const apiRoutes = require('./src/Routes/Routes')
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use('/', apiRoutes)



app.listen(PORT, () => {
    try {
        console.log(`Server started on port ${PORT}`)
    } catch (e) {
        console.log(e)
    }
})