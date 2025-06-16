var express = require('express');
var router = express.Router();

var applicationController = require('../application/applicationController');


router.get('/product', applicationController.getAllProducts)
router.get('/product/:id', applicationController.getProductById);



module.exports = router;