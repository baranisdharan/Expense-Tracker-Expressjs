const express = require('express');
const bodyParser = require('body-parser');
const UserRoutes = require('./routes/user')
const sequelize = require('./util/database');
const User = require('./models/users');

const app = express();
var cors = require('cors')

app.use(bodyParser.json({ extended: false }));
app.use(cors());

app.use(UserRoutes)

sequelize
.sync()
.then(result => {      
  app.listen(4000);
})
.catch(err => {
  console.log(err);
});
  