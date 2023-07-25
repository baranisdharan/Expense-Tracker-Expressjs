const express = require('express');
const bodyParser = require('body-parser');
const UserRoutes = require('./routes/user')
const sequelize = require('./util/database');
const ExpenseRoutes = require('./routes/expense')
const User = require('./models/users');
const Expense=require('./models/expenses');
var cors = require('cors')
const app = express();

app.use(bodyParser.json({ extended: false }));
app.use(cors());

User.hasMany(Expense)
Expense.belongsTo(User)

app.use(UserRoutes)
app.use(ExpenseRoutes)

sequelize
.sync()
.then(result => {      
  app.listen(4000);
})
.catch(err => {
  console.log(err);
});
  