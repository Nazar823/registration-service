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
        return checkErrors(req, res, validationResult(req), 'login')
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
        return checkErrors(req, res, validationResult(req), 'registration')
    })
router.post('/api/getUserName',
    body('user')
        .isNumeric()
        .withMessage('User must be numeric'),
    function (req, res) {
        return checkErrors(req, res, validationResult(req), 'getUserName')
    })
router.post('/api/authorization',
    header('authorization', 'Authorization field not a JWT!')
        .isJWT(),
    function (req, res) {
        return checkErrors(req, res, validationResult(req), 'checkToken')
    })

function checkErrors(req, res, e, nextFunction) {
    if (!e.isEmpty()){
        return res.status(statusErr.code).json({errors: e.array()})
    } else {
        switch (nextFunction){
            case 'getUserName': return getUserName(req, res)
            case 'checkToken': return checkToken(req, res)
            case 'login': return login(req, res)
            case 'registration': return registration(req, res)
        }
    }
}

module.exports = router
