const express = require('express')
const router = express.Router()
const statusErr = {code: 400, description: 'Bad Request'}
const statusOK = {code: 200, description: 'OK Request'}
const {body, header, validationResult} = require('express-validator')
const {
    registration, login, checkToken, getUserName
} =  require('./controllers/authController')

router.post('/api/auth/login',
        body('email')
            .isEmail()
            .withMessage('Email not valid'),
        body('password', 'Password field null!')
            .notEmpty(),
    middleCheckErrors,
    function (req, res) {
        return login(req, res)
    })

router.post('/api/auth/registration',
    body('email', 'Email not valid')
        .isEmail()
        .normalizeEmail(),
    body('password')
        .isLength({min: 8})
        .withMessage('Password must be at least 8 chars long'),
    body('name', 'Name field null!')
        .notEmpty(),
    middleCheckErrors,
    function (req, res) {
        return registration(req, res)
    })

router.post('/api/auth/getUserName',
    body('user')
        .isNumeric()
        .withMessage('User must be numeric'),
    middleCheckErrors ,
    function (req, res) {
        return getUserName(req, res)
    })
router.post('/api/auth/authorization',
    header('authorization', 'Authorization field not a JWT!')
        .isJWT(),
    middleCheckErrors,
    function (req, res) {
        return checkToken(req, res)
    })

function middleCheckErrors(req, res, next){
    const errors = validationResult(req)
    console.log(errors.array())
    if (!errors.isEmpty()){
        return res.status(statusErr.code).json({errors: errors.array()})
    }
    next()
}

module.exports = router