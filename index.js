require('dotenv').config()
const express = require('express')
const cors = require('cors')
const PORT = process.env.MY_PORT
const apiRoutes = require('./router')
const bodyParser = require('body-parser')
const {sequelize} = require('./connection');
const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use('/', apiRoutes)

sequelize.sync().then(function (){
    app.listen(PORT, () => {
        console.log(`Server started on port: ${PORT}`)
    })
})