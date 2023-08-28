var express = require('express');
var router = express.Router();
const {handleRegisterRequest} = require("./userRoutes");

/* Register page. */
router.post('/', async function(req, res, next) {
    await handleRegisterRequest(req,res);
});


module.exports = router;