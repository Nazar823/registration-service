const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../connection')
const user = db.user
const statusOK = {code: 200, description: 'OK'}
const statusErr = {code: 400, description: 'Bad Request'}

module.exports.registration = async (req, res) => {
    try {
        const {email, password, name} = req.body
        const findedUser = await user.findOne({
            attributes: ['id'],
            where: {
                email: email
            }
        })
        if (findedUser !== null){
            return res.status(statusErr.code).json({message: 'This email is already registered!'})
        }
        user.create({
            email: email,
            name: name,
            password: bcrypt.hashSync(password, 8)
        })
        return res.status(statusOK.code).json({message: 'Registration successfully'})
        .catch((e) => {
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
        const validPass = bcrypt.compareSync(password, findedUser.password)
        if (!validPass){
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
        const findedUser = await user.findOne({
            attributes: ['id'],
            where: {
                id: decodeId.id
            }
        })
        if (findedUser === null){
            return res.status(statusErr.code).json({message: 'Authorization failed', id: null})
        } else {
            return res.status(statusOK.code).json({message: 'Authorization successfully!', id: decodeId.id})
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