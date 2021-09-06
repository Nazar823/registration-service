const Router = require('express')
const router = new Router
const {check} = require('express-validator')
const {
    registration, login, checkToken
} =  require('../Controllers/authController')

router.post('/api/login',
    check('mail')
        .isEmail().normalizeEmail()
        .withMessage('Почта указана неправильно')
        .notEmpty(),
    check('password', )
        .notEmpty({ignore_whitespace: true})
        .withMessage('не должно быть пробелов в пароле'),
    login)
router.post('/api/registration',
    check('mail', 'Почта указана неправильно')
        .isEmail()
        .normalizeEmail(),
    check('password', 'Поле пароля пустое!')
        .notEmpty({ignore_whitespace: true})
        .withMessage('не должно быть пробелов в пароле'),
    check('name', 'Поле имени пустое!')
        .notEmpty({ignore_whitespace: true}),
    registration)
router.post('/api/authorization', checkToken)

module.exports = router
