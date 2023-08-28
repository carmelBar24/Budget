var express = require('express');
var router = express.Router();
const {handleRemoveCostRequest} = require("./budgetRoutes");

/* Remove Cost page. */
router.delete('/', async function(req, res, next) {
    await handleRemoveCostRequest(req,res);
});


module.exports = router;