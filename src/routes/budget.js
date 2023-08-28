var express = require('express');
var router = express.Router();
const {handleBudgetRequest} = require("./budgetRoutes");

/* Budget page. */
router.get('/', async function(req, res, next) {
    await handleBudgetRequest(req,res);
});


module.exports = router;