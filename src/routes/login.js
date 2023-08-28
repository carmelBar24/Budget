var express = require('express');
var router = express.Router();
const {handleLoginRequest} = require("./userRoutes");

/* Login page. */
router.post('/', async function(req, res, next) {
    await handleLoginRequest(req,res);
});


module.exports = router;