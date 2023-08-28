// Middleware to authenticate JWT tokens
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
       const authHeader=req.headers['authorization'];
       if(authHeader==undefined)
       {
        //doesnt have token
        return res.status(401).json('Please provide token');
       }
        const token=authHeader.split(' ')[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
            if(err)
            {
                //token no longer valid
                return res.json("The provided ID does not correspond to the user");
            }
            //valid token
            req.user=user;
            //move on from the middleware
            next();
        });

}

module.exports = { authenticateToken };