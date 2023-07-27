const express=require('express')
const router=express.Router()
const userController=require('../controllers/user')
const auth=require('../middleware/auth');

router.post('/user/signup',userController.postSignup)
router.post('/user/login',userController.postLogin)
router.get('/user/download',auth,userController.getDownload)


module.exports=router;