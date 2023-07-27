const express = require('express')
const router = express.Router()
const forgotpasswordController = require('../controllers/forgotpassword')



router.get('/password/resetpassword/:id',forgotpasswordController.getResetpassword)
router.get('/password/updatepassword/:resetpasswordid',forgotpasswordController.getUpdatepassword)
router.use('/password/forgotpassword',forgotpasswordController.getForgotpassword)

module.exports=router;