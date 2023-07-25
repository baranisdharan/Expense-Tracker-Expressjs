const Expense = require('../models/expenses');

function isstringinvalid(string){
    if(string==undefined || string.length==0){
        return true
    }else{
        return false
    }
}

exports.postExpense = async(req,res)=>{
    try{
    const {expenseamount,description,category} = req.body;
    if(isstringinvalid(expenseamount) || isstringinvalid(description) || isstringinvalid(category)){
        return res.status(400).json({success:false,message:'parameter is missing'})
    }    
    await Expense.create({expenseamount,description,category,userId:req.user.id})
    .then(expense=>{
        return res.status(201).json({expense,success:true})
    })
}
    catch{err=>{
        return res.status(500).json({success:false,error:err})
    }
}
}

exports.getExpense = async(req,res)=>{    
     Expense.findAll({ where : { userId: req.user.id}})    
    .then(expenses=>{          
       return res.status(200).json({expenses,success:true})
    })
    .catch(err=>{
        res.status(500).json({error:err,success:false})
    })
}

exports.deleteExpense = async(req,res)=>{
    const expenseid = req.params.expenseid;
    if(isstringinvalid(expenseid)){
       return res.status(400).json({success:false,message:'bad parameter'})
    }
    Expense.destroy({where:{id:expenseid, userId: req.user.id}}).then((noofrows)=>{
        if(noofrows===0){
            return res.status(400).json({success:false,message:'user doesnot belong to their expenses'})
        }
        return res.status(200).json({success:true,message:'Deleted successfully'})
    })
    .catch(err=>{
        return res.status(500).json({success:false,message:"failed"})
    })
}