const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt");
const {User} = require("../models/database");

async function handleRegisterRequest(req, res)
{
    console.log("Received user registration request:", req.body.username);
    // Hash the password and create a new user
    let user_salt=bcrypt.genSaltSync(12);
    let hash_pass=bcrypt.hashSync(req.body.password,user_salt);
    const user=new User({
        username:req.body.username,
        password:hash_pass,
    });
    const newUser = await User.create(user);
    console.log(`User ${req.body.username} has been successfully registered.`);
    return res.json(`${req.body.username} has been successfully added. Please proceed to log in.`)
}

async function handleLoginRequest(req, res){
    console.log("Received login request for user:", req.body.username);
    // Check if the user exists
    const existUser = await User.findOne({username: req.body.username});
    if(existUser==null)
    {
        console.log("User not found:", req.body.username);
        return res.status(401).json("Login failed. There seems to be an issue with the username");
    }
    else{
        // Compare passwords
        if(bcrypt.compareSync(req.body.password,existUser.password))
        {
            console.log("Password match for user:", req.body.username);
            // Create and send an access token
            const user = {name: req.body.username,id:existUser.id};
            const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            console.log("Access token generated for user:", req.body.username);
            return res.json({access_token: access_token})
        }
        else{
            console.log("Password mismatch for user:", req.body.username);
            return res.json("Password does not match the user's credentials.")
        }
    }
}


module.exports = {handleRegisterRequest,handleLoginRequest};
