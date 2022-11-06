// module.exports.isAuth = (req, res, next) => {
//   if (req.isAuthenticated()) {
//       next();
//   } else {
//       res.status(401).redirect('/login')
//   }
// }

const userModel = require('../Model/Employee');
const jwt = require('jsonwebtoken');
const isAuthenticated = async (req,res,next)=>{
    try { 
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!token){
            return next('Please login to access the data');
        }
        const decoded = await jwt.verify(token,process.env.SECRET_KEY);
        // req.user = await userModel.findById(verify.id);
        req.user = decoded;
    } catch (error) {
        return res.status(401).send("Invalid Token");
    }
    next();
}

module.exports = isAuthenticated;