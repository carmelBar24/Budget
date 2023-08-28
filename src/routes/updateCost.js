var express = require('express');
var router = express.Router();
const {handleUpdateCostRequest} = require("./budgetRoutes");

/* Update Cost page. */
router.post('/', async function(req, res, next) {
   await handleUpdateCostRequest(req,res);
});


module.exports = router;