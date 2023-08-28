
const {Budget} = require("../models/database");

async function handleBudgetRequest(req, res) {
    // Retrieve budget data based on user ID and category if provided
    // Handle different cases for matching user ID and other errors
    // Return appropriate responses
    const category = req.query.category;
    try {
        console.log("Received budget request for user ID:", req.user.id);
        if (category) {
            console.log("Request includes category:", category);
            resultComputed = await Budget.find({user_id: req.user.id, category: category});
        } else {
            resultComputed = await Budget.find({user_id: req.user.id});
        }
        return resultComputed[0] === undefined ? res.json('this user does not have budget') : res.json(resultComputed);
    }
    catch (e) {
        console.error("An error occurred:", e.message);
        res.json(e.message)
    }
}

async function handleAddCostRequest(req,res)
{
    // Create a new budget entry and send a success response
    try{
        console.log("Received add cost request for user ID:", req.user.id);
        const cost = new Budget({
            user_id: req.user.id,
            description: req.body.description,
            category: req.body.category,
            sum: req.body.sum
        });
        await Budget.create(cost);
        console.log("Cost added successfully for user ID:", req.user.id);
        res.json('Successfully added cost');
    }
    catch (e) {
        console.error("An error occurred:", e.message);
        return res.status(401).json(e.message);
    }
}

async function handleRemoveCostRequest(req,res)
{
    // Find and delete the cost entry based on the provided cost ID
    // Handle not found or other errors
        try{
            console.log("Received remove cost request for user ID:", req.user.id);
            await Budget.find({id:req.body.cost_id});
            const cost=await Budget.find({id:req.body.cost_id});
            if(cost.length==0)
            {
                console.log("No cost found with the provided ID:", req.body.cost_id);
                throw Error("No cost found with the provided ID.");
            }
            else{
                await Budget.find({id:req.body.cost_id}).remove();
            }
            console.log("Cost removed successfully for user ID:", req.user.id);
            res.json('Successfully deleted cost');
        }
        catch (e) {
            console.log("Cost removed successfully for user ID:", req.user.id);
            res.json(e.message);
        }
    }

async function handleUpdateCostRequest(req,res) {
    // Update the sum of the specified cost entry
    // Handle no modification or other errors
    try{
        console.log("Received update cost request for user ID:", req.user.id);
        const update=await Budget.updateOne(
            { id:req.body.cost_id}, // The filter to match the document you want to update
            { $set: { sum: req.body.sum } }            // The update operation to perform
        );
        if(update.modifiedCount==0){
            console.log("No cost found with the provided ID:", costId);
            throw Error("No cost found with the provided ID.");
        }
        console.log("Cost updated successfully for user ID:", req.user.id);
        res.json('Successfully updated cost');
    }
    catch (e) {
        console.error("An error occurred:", e.message);
        res.json(e.message);
    }
}

module.exports = { handleBudgetRequest ,handleAddCostRequest,handleRemoveCostRequest,handleUpdateCostRequest};
