const express = require('express')
const router = express.Router()
const expenseController = require('../controllers/expense')
const auth = require('../middleware/auth');


router.post('/expense/addexpense',auth,expenseController.postExpense)
router.get('/expense/getexpenses',auth,expenseController.getExpense)
router.delete('/expense/deleteexpense/:expenseid',auth,expenseController.deleteExpense)

module.exports=router;