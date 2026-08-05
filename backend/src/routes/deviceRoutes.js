const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const validateRequest = require('../middlewares/validateRequest');
const deviceSchema = require('../validations/deviceSchema');

router.get('/light', deviceController.getLight);
router.patch('/light', validateRequest(deviceSchema), deviceController.updateLight);

module.exports = router;