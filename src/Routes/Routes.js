const Router = require('express')
const router = new Router
// const authMiddleware = require('../middleware/authMiddleware');
const cors = require ('cors')
const {
    registration,
    login,
    testConnection,
    registrationSeq, registrationSQL, loginSeq
} =  require('../Controllers/authController')

router.post('/api/registration', registration)
router.post('/api/login', loginSeq)
router.post('/api/SQL', registrationSQL)
router.post('/api/reg', registrationSeq)
router.post('/api/test', testConnection)

module.exports = router
