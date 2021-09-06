const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../connection')
const {verify} = require("jsonwebtoken");
const user = db.user
const statusOK = {code: 200, description: 'Successfully'}
const statusErr = {code: 200, description: 'Client error'}

module.exports.registration = async (req, res) => {
    try {
        const {email, password, name} = req.body
        await db.sequelize.sync()
        user.create({
            email: email,
            name: name,
            password: bcrypt.hashSync(password, 8)
        }).then(() => {
            return res.status(statusOK.code).json({message: 'Registration successfully'})
        }).catch((e) => {
            return res.status(statusErr.code).json({message: e.message})
        })

    } catch (e) {
        return res.status(statusErr.code).json({message: e.message})
    }
}

module.exports.login = async (req, res) => {
    try {
        const {email, password} = req.body
        const findedUser = await user.findOne({
            attributes: ['id', 'password'],
            where: {
                email: email
            }
        })
        if (findedUser === null){
            return res.status(statusErr.code).json({message: 'User not found!'})
        }
        if (!bcrypt.compareSync(password, findedUser.password)){
            return res.status(statusErr.code).json({message: 'Wrong password!'})
        }
        return res.status(statusOK.code).json({token: getToken(findedUser.id)})
    } catch (e){
        console.log(e.message)
        return res.status(statusErr.code).json({message: e.message})
    }
}

module.exports.checkToken = async (req, res) => {
    try {
        const secretKey = process.env.SECRET_KEY
        const token = req.headers.authorization
        const decodeId = jwt.verify(token, secretKey)
        console.log(decodeId.id, typeof decodeId.id)
        const findedUser = await user.findOne({
            attributes: ['id', 'password'],
            where: {
                id: decodeId
            }
        })
        if (jwt.verify(req.headers.authorization, process.env.SECRET_KEY)) {
            return res.status(statusOK.code).json({message: 'Authorization successfully'})
        } else {
            return res.status(statusErr.code).json({message: 'Authorization failed!'})
        }
    } catch (e){
        console.log(e.message)
        return res.json(e.message)
    }
}

function getToken(id) {
    return jwt.sign({id},
        process.env.SECRET_KEY,
        {expiresIn: '96h'})
}