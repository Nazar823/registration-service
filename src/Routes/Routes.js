const Router = require('express')
const router = new Router
const {
    registration, login
} =  require('../Controllers/authController')

router.post('/api/login', login)
router.post('/api/reg', registration)

module.exports = router
