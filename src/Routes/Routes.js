const Router = require('express')
const router = new Router
// const authMiddleware = require('../middleware/authMiddleware');
const cors = require ('cors')
const {
    registration,
    login,
    registrationSQL,
    testConnection
} =  require('../Controllers/authController')

router.post('/api/registration', registration)
router.post('/api/login', login)
router.post('/api/SQL', registrationSQL)
router.post('/api/test', testConnection)

module.exports = router
