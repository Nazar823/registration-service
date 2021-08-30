const User = require('../Objects/User')
const bcrypt = require('bcryptjs')
const {use} = require("express/lib/router");
const jwt = require("jsonwebtoken");
const {Client} = require('pg')
const {Sequelize} = require('sequelize')

//*********Sequelize*********
module.exports.testConnection = async (req, res, next) => {
    try {
        const sequelize = new Sequelize(
            'users_auth', 'nazar', 'ignatenko123', {
                host: 'localhost',
                dialect: "postgres"
            }
        )
        let mess;
        try {
            await sequelize.authenticate();
            mess = 'подключение успешно'
            console.log(mess)
        } catch (e){
            mess = 'ошибка'
            console.log(mess)
        }
        return res.status(200).json({message: mess})
    } catch (e){
        return next(e)
    }
}

//*********VANILLA POSTGRES*********
module.exports.registrationSQL = async (req, res, next) => {
    try {
        console.log('Запрос принят')
        const client = new Client({
            user: 'nazar',
            host: 'localhost',
            database: 'users_auth',
            password: 'ignatenko123',
            port: 5432
        })
        client.connect()
        const queryString = 'INSERT INTO users VALUES (DEFAULT, \'sample.adress@mail.ru\', \'Sample Name\', \'MyPasswordHere\')'
        client.query(queryString, (err, res) => {
            console.log(err, res)
            client.end()
        })
        return res.status(200).json({message: 'Регистрация успешна!'})
    } catch (e) {
        return next(e)
    }
}

//*********MONGO*********
module.exports.registration = async (req, res, next) => {
    try {
        console.log('запрос получен')
        const {username, password, nickname} = req.body
        const candidate = await User.findOne({username})
        if (candidate){
            return res.status(400).json({message: 'Пользователь с таким именем уже существует'})
        }
        const hasPass = bcrypt.hashSync(password, 8)
        const  user = new User({nickname, username, password: hasPass})
        await user.save()
        return res.status(200).json({message: 'Аккаунт создан!'})
    } catch (error) {
        console.log(error.message)
        return next(error)
    }
}
function getToken(id) {
    return jwt.sign({id},
        'SampleKey',
        {expiresIn: "15h"})
}

//*********MONGO*********
module.exports.login = async (req, res, next) => {
    try {
        const {username, password} = req.body
        const user = await User.findOne({username})
        if (!user){
            return res.status(400).json({message: 'Пользователь не найден!'})
        }
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword){
            return res.status(400).json({message: 'Пароль неправильный!'})
        }
        const token = getToken(user._id)
        return res.status(200).json ({token})
    } catch (error) {
        return next(error)
    }
}
