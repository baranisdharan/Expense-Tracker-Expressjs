const express=require('express')
const router=express.Router()
const userController=require('../controllers/user')

router.post('/user/signup',userController.postSignup)







module.exports=router;