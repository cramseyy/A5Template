const express = require('express');
const router = express.Router();

const applicationController = require('../application/applicationController');

router.get('/', applicationController.getCart);
router.post('/', applicationController.addToCart);
router.delete('/:id', applicationController.removeFromCart);

module.exports = router;