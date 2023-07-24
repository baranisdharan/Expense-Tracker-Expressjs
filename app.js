const express = require('express');
const bodyParser = require('body-parser');
const UserRoutes = require('./routes/user')

const app = express();
var cors = require('cors')

app.use(bodyParser.json({ extended: false }));
app.use(cors());

app.use(UserRoutes)

app.listen(4000)
  