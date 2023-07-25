const express = require('express');
const bodyParser = require('body-parser');
const UserRoutes = require('./routes/user')
const sequelize = require('./util/database');
const ExpenseRoutes = require('./routes/expense')

const app = express();
var cors = require('cors')

app.use(bodyParser.json({ extended: false }));
app.use(cors());

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
  