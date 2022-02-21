const router = require(`express`).Router();
const { readToken } = require("../config/jwt");
const { attendanceController } = require(`../controllers`)

router.get(`/`, attendanceController.studentAttendance)

module.exports = router