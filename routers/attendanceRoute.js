const { readToken } = require('../config/jwt');
const { attendanceController } = require('../controllers')

const router = require ('express').Router()

router.get('/', attendanceController.getData);
router.get('/:id', attendanceController.studentAttendance)

module.exports = router