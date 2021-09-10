const express = require('express')
const router = express.Router()
const statusErr = {code: 400, description: 'Bad Request'}
const {body, header, validationResult} = require('express-validator')
const {
    registration, login, checkToken, getUserName
} =  require('./controllers/authController')

router.post('/api/login',
        body('email')
            .isEmail()
            .withMessage('Email not valid'),
        body('password', 'Password field null!')
            .notEmpty(),
    function (req, res) {
        const e = validationResult(req)
        if (!e.isEmpty()){
            return res.status(statusErr.code).json({errors: e.array()})
        }
        return login(req, res)
    })

router.post('/api/registration',
    body('email', 'Email not valid')
        .isEmail()
        .normalizeEmail(),
    body('password')
        .isLength({min: 8})
        .withMessage('Password must be at least 8 chars long'),
    body('name', 'Name field null!')
        .notEmpty(),

    function (req, res) {
        const e = validationResult(req)
        if (!e.isEmpty()){
            return res.status(statusErr.code).json({errors: e.array()})
        }
        return registration(req, res)
    })
router.post('/api/getUserName',
    body('user')
        .isNumeric()
        .withMessage('User must be numeric'),
    function (req, res) {
        const e = validationResult(req)
        if (!e.isEmpty()){
            return res.status(statusErr.code).json({errors: e.array()})
        }
        return getUserName(req, res)
    })
router.post('/api/authorization',
    header('authorization', 'Authorization field not a JWT!')
        .isJWT(),
    function (req, res) {
        const e = validationResult(req)
        if (!e.isEmpty()){
            return res.status(statusErr.code).json({errors: e.array()})
        }
        return checkToken(req, res)
    })


module.exports = router
