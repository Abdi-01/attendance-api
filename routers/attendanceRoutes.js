const router = require('express').Router();
const {attendanceController} = require('../controllers');

router.get('/', attendanceController.getSessionStudent);
router.post('/checkin', attendanceController.checkIn);
router.patch('/checkout/:idattendance', attendanceController.checkOut);

module.exports = router