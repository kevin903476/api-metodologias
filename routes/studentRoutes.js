//@ts-check
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const upload = require("../middleware/fileValidator");


router.get('/getStudent', studentController.getAllStudents);
router.post("/register", upload.single("foto"), studentController.registerStudent);
router.put('/update', studentController.updateStudent);
module.exports = router;