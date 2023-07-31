const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
var cors = require('cors')
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const morgan = require('morgan');


const sequelize = require('./util/database');
const rootDir = require('./util/path');
const User = require('./models/users');
const Expense = require('./models/expenses');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword')
const Filelink=require('./models/filelink')
const UserRoutes = require('./routes/user')
const ExpenseRoutes = require('./routes/expense')
const PremiumRoutes = require('./routes/premium')
const RazorpayRoutes = require('./routes/razorpay')
const ForgotpasswordRoutes = require('./routes/forgotpassword')

//app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const accessLogStream = fs.createWriteStream(path.join(rootDir, 'access.log'),{flags: 'a'});
app.use(helmet());
app.use(morgan('combined', {stream: accessLogStream}))

User.hasMany(Expense)
Expense.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})

User.hasMany(Order)
Order.belongsTo(User, {constraints: true, onDelete: 'CASCADE'})

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});

User.hasMany(Filelink);
Filelink.belongsTo(User)


app.use(UserRoutes)
app.use(ExpenseRoutes)
app.use(PremiumRoutes)
app.use(ForgotpasswordRoutes)
app.use(RazorpayRoutes)

sequelize
.sync()
.then(result => {      
  app.listen(4000);
})
.catch(err => {
  console.log(err);
});
  