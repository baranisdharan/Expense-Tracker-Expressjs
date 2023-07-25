const express = require('express')
const router = express.Router()
const expenseController = require('../controllers/expense')


router.post('/expense/addexpense',expenseController.postExpense)
router.get('/expense/getexpenses',expenseController.getExpense)
router.delete('/expense/deleteexpense/:expenseid',expenseController.deleteExpense)

module.exports=router;