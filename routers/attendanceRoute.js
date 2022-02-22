const { readToken } = require('../config/jwt');
const { attendanceController } = require('../controllers')

const router = require ('express').Router()

router.get('/', attendanceController.getData);
router.get('/session', readToken, attendanceController.getSessionStudent);
router.get('/:date', readToken ,attendanceController.getAttendanceStudent);
router.patch('/checkout/:idattendance', readToken, attendanceController.checkOut);
router.post('/checkin', readToken, attendanceController.checkIn);
router.get('/:id', attendanceController.studentAttendance)

module.exports = router