const bcrypt = require('bcryptjs')
const {use} = require("express/lib/router");
const jwt = require("jsonwebtoken");
const {Client} = require("pg")
const {Sequelize, DataTypes, Model} = require('sequelize')

//*********Sequelize*********

module.exports.registrationSeq = async (req, res, next) => {
    try {
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
        const user = await newUser.findOne({
            attributes: ['id', 'password'],
            where: {
                mail: mail
            }
        })
        if (user === null){
            return res.status(400).json({message: 'Пользователь не найден!'})
        }
        if (!bcrypt.compareSync(password, user.password)){
            return res.status(400).json({message: "Пароль неправильный"})
        }
        return res.status(200).json({token: getToken(newUser.id)})
    } catch (e){
        console.log(e.message)
        return res.status(400).json({message: e.message})
    }
}

//!*********End  Sequelize*********
function getToken(id) {
    return jwt.sign({id},
        'SampleKey',
        {expiresIn: "15h"})
}