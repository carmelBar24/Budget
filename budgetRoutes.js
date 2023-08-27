const jwt = require("jsonwebtoken");
const bcrypt=require('bcrypt');
const {Budget, User} = require("./models/database");

async function handleBudgetRequest(req, res) {
    // Retrieve budget data based on user ID and category if provided
    // Handle different cases for matching user ID and other errors
    // Return appropriate responses
    let resultComputed;
    let q = req.url.split('?'), result = {};
    splitUrl(q,result);
    if(req.user.id!=result.user_id)
    {
        return res.status(401).json("The provided ID does not correspond to the user.");
    }
    try {
        if (result.category) {
            resultComputed = await Budget.find({user_id: result.user_id, category: result.category});
        } else {
            resultComputed = await Budget.find({user_id: result.user_id});
        }
        return resultComputed[0] === undefined ? res.json('this user does not have budget') : res.json(resultComputed);
    }
    catch (e) {
        res.json(e.message)
    }
}

async function handleAddCostRequest(req,res)
{
    // Check if the provided user ID matches
    // Create a new budget entry and send a success response
    if(req.user.id!=req.body.user_id)
    {
        return res.status(401).json("The provided ID does not correspond to the user.");
    }
    try{
        const cost = new Budget({
            user_id: req.body.user_id,
            description: req.body.description,
            category: req.body.category,
            sum: req.body.sum
        });
        await Budget.create(cost);
        res.json('Successfully added cost');
    }
    catch (e) {
        return res.status(401).json(e.message);
    }
}

async function handleRemoveCostRequest(req,res)
{
        // Check if the provided user ID matches
        // Find and delete the cost entry based on the provided cost ID
        // Handle not found or other errors
    if(req.user.id!=req.body.user_id)
    {
        return res.status(401).json("The provided ID does not correspond to the user.");
    }
        try{
            await Budget.find({id:req.body.cost_id});
            const cost=await Budget.find({id:req.body.cost_id});
            if(cost.length==0)
            {
                throw Error("No cost found with the provided ID.");
            }
            else{
                await Budget.find({id:req.body.cost_id}).remove();
            }
            res.json('Successfully deleted cost');
        }
        catch (e) {
            res.json(e.message);
        }
    }

async function handleUpdateCostRequest(req,res) {
    // Check if the provided user ID matches
    // Update the sum of the specified cost entry
    // Handle no modification or other errors
    if(req.user.id!=req.body.user_id)
    {
        return res.status(401).json("The provided ID does not correspond to the user.");
    }
    try{
        const update=await Budget.updateOne(
            { id:req.body.cost_id}, // The filter to match the document you want to update
            { $set: { sum: req.body.sum } }            // The update operation to perform
        );
        if(update.modifiedCount==0){
            throw Error("No cost found with the provided ID.");
        }
        res.json('Successfully updated cost');
    }
    catch (e) {
        res.json(e.message);
    }
}

async function handleRegisterRequest(req, res)
{
    // Hash the password and create a new user
    let user_salt=bcrypt.genSaltSync(12);
    let hash_pass=bcrypt.hashSync(req.body.password,user_salt);
    const existId = await User.findOne({id: req.body.id});
    if(existId!==null)
    {
        return res.status(401).json("ID is already in use");
    }
    const user=new User({
        id:req.body.id,
        username:req.body.username,
        password:hash_pass,
    });
    const newUser = await User.create(user);
    return res.json(`${req.body.username} has been successfully added. Please proceed to log in.`)
}

async function handleLoginRequest(req, res){
    // Check if the user exists
    const existUser = await User.findOne({id: req.body.id, username: req.body.username});
    if(existUser==null)
    {
        return res.status(401).json("Login failed. There seems to be an issue with the username or ID.");
    }
    else{
        // Compare passwords
        if(bcrypt.compareSync(req.body.password,existUser.password))
        {
            // Create and send an access token
            const user = {name: req.body.username,id:req.body.id};
            const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            return res.json({access_token: access_token})
        }
        else{
            return res.json("Password does not match the user's credentials.")
        }
    }
}

// Function to split URL parameters
function splitUrl(url,result) {
    if (url.length >= 2) {
        // Split the URL by '&' and add each parameter to the result object
        url[1].split('&').forEach(item => {
            try {
                result[item.split('=')[0]] = item.split('=')[1];
            } catch (e) {
                result[item.split('=')[0]] = '';
            }
        });
    }
}

module.exports = { handleBudgetRequest ,handleAddCostRequest,handleRemoveCostRequest,handleUpdateCostRequest,handleRegisterRequest,handleLoginRequest};
