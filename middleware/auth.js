const jwt = require('jsonwebtoken');
const User = require('../models/users');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization');        
        const user = jwt.verify(token,'secretkey');        
        User.findByPk(user.userId).then(user => {
            req.user = user; 
            next();
        })
      } catch(err) {        
        return res.status(401).json({success: false})        
      }
}

module.exports = auth;