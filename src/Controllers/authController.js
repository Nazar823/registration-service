// import {validator} from "validator";
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const {Sequelize, DataTypes, Model} = require('sequelize')


module.exports.registration = async (req, res, next) => {
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
        const {mail, password, name} = req.headers
        if(mail == "" || password == "" || name == ""){
            return req.status(400).json({message: "Проверьте правильность заполнения полей!"})
        }
        //Вставить валидатор
        newUser.create({
            mail: mail,
            name: name,
            password: bcrypt.hashSync(password, 8)
        }).then(() => {
            return res.status(200).json({message: "Запрос успешен"})
        }).catch((e) => {
            return res.status(500).json({message: e.message})
        })

    } catch (e) {
        return res.status(400).json({message: e.message})
    }
}

module.exports.login = async (req, res, next) => {
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
        const {mail, password} = req.headers
        //Вставить валидатор
        // console.log(validateMail(mail))
        //*******
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
        return res.status(200).json({token: getToken(user.id)})
    } catch (e){
        console.log(e.message)
        return res.status(400).json({message: e.message})
    }
}

function getToken(id) {
    return jwt.sign({id},
        process.env.SECRET_KEY,
        {expiresIn: "96h"})
}