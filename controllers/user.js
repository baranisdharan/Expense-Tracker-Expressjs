const User = require('../models/users');

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
        res.status(400).json({err:'bad parameter....something went wrong'})
    }  
}
    catch{(err)=>{
        return res.status(500).json(err)
    }}
}
