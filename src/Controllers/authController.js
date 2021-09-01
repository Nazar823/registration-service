const bcrypt = require('bcryptjs')
const {use} = require("express/lib/router");
const jwt = require("jsonwebtoken");
const {Client} = require("pg")
const {Sequelize, DataTypes, Model} = require('sequelize')

//*********Sequelize*********

module.exports.registrationSeq = async (req, res, next) => {
    try {
        console.log('Запрос принят (Seq)')
        const sequelize = new Sequelize('users_auth', 'nazar', 'ignatenko123', {
            dialect: "postgres",
            host: 'localhost'
        })
        const newUser = require('../../models/user')(sequelize)
        module.exports = {
            sequelize: sequelize,
            user: newUser
        }
        const {mail, password, name} = req.body
        if(mail == "" || password == "" || name == ""){
            return req.status(400).json({message: "Проверьте правильность заполнения полей!"})
        }
        newUser.create({
            mail: mail,
            name: name,
            password: bcrypt.hashSync(password, 8)
        }).then(() => {
            return res.status(200).json({message: "Запрос успешен"})
        }).catch(() => {
            return res.status(400).json({message: "Поле не уникальное"})
        })

    } catch (e) {
        console.log(e.message)
        return res.status(400).json({message: e.message})
    }
}

module.exports.loginSeq = async (req, res, next) => {
    try {
        console.log('Запрос принят (Seq)')
        const sequelize = new Sequelize('users_auth', 'nazar', 'ignatenko123', {
            dialect: "postgres",
            host: 'localhost'
        })
        const newUser = require('../../models/user')(sequelize)
        module.exports = {
            sequelize: sequelize,
            user: newUser
        }
        const {mail, password} = req.body
        await newUser.findAll({
            attributes: ['password', 'id'],
            where: {
                mail: mail
            }
        }).then(() => {
            console.log('Вы отправили пароль: ',password)
            console.log('Хэш этого пароля: ', bcrypt.compareSync(password, 8))
            console.log('Хэш верного пароля: ', newUser.password)
            if (newUser.password !== bcrypt.hashSync(password, 8)){
                return res.status(400).json({message: "Пароль неправильный"})
            }
            return res.status(200).json({token: getToken(newUser.id)})
        }).catch(() => {
            return res.status(400).json({message: "Пользователь не найден"})
        })
    } catch (e){
        console.log(e.message)
        return res.status(400).json({message: e.message})
    }
}

//!*********End  Sequelize*********


//!*********VANILLA POSTGRES*********
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
            console.log('Err: ', err, "\nInserted")
            client.end()
        })
        return res.status(200).json({message: 'Регистрация успешна!'})
    } catch (e) {
        return next(e)
    }
}

module.exports.testConnection = async (req, res, next) => {
    try {
        return res.status(200).json({message: 'Working!'})
    } catch (e) {
        return next(e)
    }
}

//!*********MONGO*********
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

//!*********MONGO*********
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
