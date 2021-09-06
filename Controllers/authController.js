const validator = require('validator');
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const db = require('../connection')
const user = db.user

module.exports.registration = async (req, res, next) => {
    try {
        const {mail, password, name} = req.body
        await db.sequelize.sync()
        user.create({
            mail: mail,
            name: name,
            password: bcrypt.hashSync(password, 8)
        }).then(() => {
            return res.status(200).json({message: "Registration successfully"})
        }).catch((e) => {
            return res.status(400).json({message: e.message})
        })

    } catch (e) {
        return res.status(400).json({message: e.message})
    }
}

module.exports.login = async (req, res, next) => {
    console.log("here")
    try {
        const {mail, password} = req.body
        await db.sequelize.sync()
        const findedUser = await user.findOne({
            attributes: ['id', 'password'],
            where: {
                mail: mail
            }
        })
        if (findedUser === null){
            return res.status(400).json({message: 'User not found!'})
        }
        if (!bcrypt.compareSync(password, findedUser.password)){
            return res.status(400).json({message: "Wrong password!"})
        }
        return res.status(200).json({token: getToken(findedUser.id)})
    } catch (e){
        console.log(e.message)
        return res.status(400).json({message: e.message})
    }
}

module.exports.checkToken = async (req, res, next) => {
    try {
        if (jwt.verify(req.headers.authorization, process.env.SECRET_KEY)) {
            return res.status(200).json({message: "Authorization successfully"})
        } else {
            return res.status(400).json({message: "Authorization failed!"})
        }
    } catch (e){
        console.log(e.message)
        return res.json(e.message)
    }
}

function getToken(id) {
    return jwt.sign({id},
        process.env.SECRET_KEY,
        {expiresIn: "96h"})
}