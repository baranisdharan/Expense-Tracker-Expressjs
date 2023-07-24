const express=require('express')
const router=express.Router()
const userController=require('../controllers/user')

router.post('/user/signup',userController.postSignup)
router.post('/user/login',userController.postLogin)


module.exports=router;