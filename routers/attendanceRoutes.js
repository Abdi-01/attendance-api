const router = require('express').Router();
const { readToken } = require('../config/jwt');
const {attendanceController} = require('../controllers');

router.get('/session', readToken ,attendanceController.getSessionStudent);
router.get('/:date', readToken ,attendanceController.getAttendanceStudent);
router.post('/checkin', readToken, attendanceController.checkIn);
router.patch('/checkout/:idattendance', readToken, attendanceController.checkOut);

module.exports = router