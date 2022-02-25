const { readToken } = require('../config/jwt');
const { attendanceController } = require('../controllers')

const router = require('express').Router()

router.get('/', attendanceController.getData);
router.get('/student', readToken, attendanceController.studentAttendance)
router.post('/checkin', readToken, attendanceController.checkIn);
router.patch('/checkout/:idattendance', readToken, attendanceController.checkOut);
router.get('/:date', readToken, attendanceController.getAttendanceStudent);

module.exports = router