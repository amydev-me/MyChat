const jwt = require('jsonwebtoken');
const isAuthenticated = async (req,res,next)=>{
    try { 
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if(!token){
            return res.status(401).send("Invalid Token");
        }
        const decoded = await jwt.verify(token,process.env.SECRET_KEY);
        // let user = await userModel.findById(decoded.user_id);
        req.user = decoded;
        // console.log(decoded)
    } catch (error) {
        return res.status(401).send("Invalid Token");
    }
    next();
}

module.exports = isAuthenticated;


