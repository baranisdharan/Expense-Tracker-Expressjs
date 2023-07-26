const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
var cors = require('cors')

const sequelize = require('./util/database');

const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const UserRoutes = require('./routes/user')
const ExpenseRoutes = require('./routes/expense')
const PremiumRoutes=require('./routes/premium')
const RazorpayRoutes=require('./routes/razorpay')


app.use(bodyParser.json({ extended: false }));
app.use(cors());

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

app.use(UserRoutes)
app.use(ExpenseRoutes)
app.use(PremiumRoutes)
app.use(RazorpayRoutes)

sequelize
.sync()
.then(result => {      
  app.listen(4000);
})
.catch(err => {
  console.log(err);
});
  