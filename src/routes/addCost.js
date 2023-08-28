var express = require('express');
var router = express.Router();
const {handleAddCostRequest} = require("./budgetRoutes");

/* Add Cost page. */
router.post('/', async function(req, res, next) {
    await handleAddCostRequest(req,res);
});


module.exports = router;