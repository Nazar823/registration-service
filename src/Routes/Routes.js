const Router = require('express')
const router = new Router
const {
    registration, loginSeq
} =  require('../Controllers/authController')

router.post('/api/login', loginSeq)
router.post('/api/reg', registration)

module.exports = router
