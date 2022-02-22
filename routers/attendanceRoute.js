const { readToken } = require('../config/jwt');
const { attendanceController } = require('../controllers')

const router = require ('express').Router()

router.get('/', attendanceController.getData);
router.get('/:id', attendanceController.studentAttendance)
router.get('/session', attendanceController.getSessionStudent);
router.post('/checkin', attendanceController.checkIn);
router.patch('/checkout/:idattendance', attendanceController.checkOut);

module.exports = router