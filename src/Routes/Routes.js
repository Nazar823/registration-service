const Router = require('express')
const router = new Router
// const authMiddleware = require('../middleware/authMiddleware');
const cors = require ('cors')
const {
    registrationSeq, loginSeq
} =  require('../Controllers/authController')

router.post('/api/login', loginSeq)
router.post('/api/reg', registrationSeq)

module.exports = router
