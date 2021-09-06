const express = require('express')
const router = express.Router()
const {body, validationResult} = require('express-validator')
const {
    registration, login, checkToken
} =  require('../controllers/authController')

router.post('/api/login',
        body('email')
            .isEmail()
            .withMessage('Email не валиден'),
        body('password', 'Поле пароля пустое!')
            .notEmpty(),
    (req, res) => {
    const e = validationResult(req)
    if (!e.isEmpty()){
        return res.status(400).json({errors: e.array()})
    }
    return login(req, res)
    })

router.post('/api/registration',
    body('email', 'Email не валиден')
        .isEmail()
        .normalizeEmail(),
    body('password')
        .isLength({min: 8})
        .withMessage('Пароль должен быть не меньше 8 символов'),
    body('name', 'Поле имени пустое!')
        .notEmpty(),

    (req, res) => {
        const e = validationResult(req)
        if (!e.isEmpty()){
            return res.status(400).json({errors: e.array()})
        }
        return registration(req, res)
    })
router.post('/api/authorization', checkToken)

module.exports = router
