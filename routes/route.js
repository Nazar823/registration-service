const Router = require('express')
const router = new Router
const {
    registration, login, checkToken
} =  require('../Controllers/authController')

router.post('/api/login', login)
router.post('/api/registration', registration)
router.post('/api/authorization', checkToken)

module.exports = router
