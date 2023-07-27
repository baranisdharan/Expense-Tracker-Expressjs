const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Expense=require('../models/expenses');


function isstringinvalid(string){
    if(string==undefined || string.length==0){
        return true
    }else{
        return false
    }
}

exports.postSignup = async(req,res)=>{
    try{    
    const {name,email,password} = req.body
    if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
       return res.status(400).json({err:'bad parameter....something went wrong'})        
    }
    const saltrounds = 10
    bcrypt.hash(password,saltrounds,async(err,hash)=>{
        if(err){
            throw new Error('something went wrong')
        }
        await User.create({name,email,password:hash})
        res.status(201).json({message:'succesfully created new user'})
    })
}
    catch{(err)=>{
        return res.status(500).json(err)
    }}
}

exports.postLogin = async(req,res)=>{
    try{
    const{email,password}=req.body;    
    if(isstringinvalid(email) || isstringinvalid(password)){
        res.status(400).json({message:'email or password is missing',success:false})
    }
    const user = await User.findAll({where:{email}})
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
   }
    catch{err=>{
        res.status(500).json({message:err,success:false})
    }}
}

function generateAccessToken(id,name,ispremiumuser){
    return jwt.sign({userId:id,name:name,ispremiumuser:ispremiumuser},'secretkey')
}

exports.getDownload=async(req,res,next)=>{
    if(!req.user.ispremiumuser){
        return res.status(400).json({message:'only for premium user'})
    }
    try{
    const expenses=await req.user.getExpenses()
    console.log(expenses)
    const stringifiedExpenses=JSON.stringify(expenses)
    // depend on the users
    const userId=req.user.id;
    const filename=`Expense${userId}/${new Date()}.txt`;
    const fileURl=await uploadToS3(stringifiedExpenses,filename)
    console.log(fileURl)
    await req.user.createFilelink({fileURl:fileURl})
   
    res.status(200).json({fileURl,success:true})
    }
    catch(err){
        res.status(500).json({fileURl:'',success:false,err:err})
    }

}