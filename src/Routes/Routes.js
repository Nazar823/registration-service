const Router = require('express')
const router = new Router
const {
    registrationSeq, loginSeq
} =  require('../Controllers/authController')

router.post('/api/login', loginSeq)
router.post('/api/reg', registrationSeq)

module.exports = router
