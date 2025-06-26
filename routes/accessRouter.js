//@ts-check
const express = require('express');
const router = express.Router();
const accessController = require('../controllers/accessController');

router.get('/getAllAccess', accessController.getAllAccess);
router.get('/getTodayAccess', accessController.getTodayAccess);
router.get('/getWeekAccess', accessController.getWeekAccess);
router.post('/getAccessByDni', accessController.getAccessByDni);
router.post('/registerAccess', accessController.registerAccess);
router.get('/getAccessByDate', accessController.getAccessByDate);
module.exports = router;