const User = require('../models/users');
const bcrypt = require('bcrypt');

function isstringinvalid(string){
    if(string==undefined || string.length==0){
        return true
    }else{
        return false
    }
}

exports.postSignup = async(req,res)=>{
    try{
    console.log(req.body)
    const {name,email,password} = req.body
    if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
       return res.status(400).json({err:'bad parameter....something went wrong'})
        
    }
    let data = await User.create({name:name, email:email, password:password})
    res.status(201).json(data)
}
    catch{(err)=>{
        return res.status(500).json(err)
    }}
}

exports.postLogin = async(req,res)=>{
    try{
    const{email,password}=req.body;
    console.log(password)
    if(isstringinvalid(email) || isstringinvalid(password)){
        res.status(400).json({message:'email or password is missing',success:false})
    }
    const user=await User.findAll({where:{email}})
        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(err){
                    throw new Error('something went wrong')
                }
                if(result===true){
                    res.status(200).json({success:true,message:'user logged in successfully',token:generateAccessToken(user[0].id,user[0].name,user[0].ispremiumuser)})
                }else{
                    return res.status(400).json({success:false,message:'password is incorrect'})
                }
            })

        }else{
            return res.status(404).json({success:false,message:'user doesnot exist'})
        }
    
   } catch{err=>{
        res.status(500).json({message:err,success:false})
    }}
}