const { db, dbQuery } = require('../config/database')


module.exports = {
   getData: async (req, res) => {
        try {

            let filterQuery = []

            for (let prop in req.query) {
                if (prop != "_sort" && prop != "_order" && prop == 'fullname') {
                    filterQuery.push(`${prop == "fullname" ? `u.${prop}` : prop} LIKE '%${req.query[prop]}%'`)
                } else if (prop != "_sort" && prop != "_order" && prop == 'nis') {
                    filterQuery.push(`${prop == "fullname" ? `u.${prop}` : prop} LIKE '%${req.query[prop]}'`)

                }
            }

            console.log('query', filterQuery.join(' AND '))

            let { _sort, _order, date_sort, date_order } = req.query

            let getDataSQL = `SELECT u.*, s.session, s.timein, s.timeout, r.role, st.status FROM attendance.users u
            JOIN attendance.session s on s.idsession = u.idsession
            JOIN attendance.role r on r.idrole = u.idrole
            JOIN attendance.status as st on st.idstatus = u.idstatus WHERE role='student' 
            ${filterQuery.length > 0 ? `WHERE ${filterQuery.join(' and ')}` : ""}
            ${_sort && _order ? `ORDER BY ${_sort} ${_order}` : ""};`

            console.log('querysql', getDataSQL)

            resultsStudents = await dbQuery(getDataSQL)

            let resultsAttendance = await dbQuery(`SELECT a.*, s.status FROM attendance.attendance a JOIN attendance.status s on s.idstatus = a.idstatus ${date_sort && date_order ? `ORDER BY ${date_sort} ${date_order}` : ""}`)
            console.log('queryattendance', resultsAttendance)

            resultsStudents.forEach((value) => {
                value.attendance = [];

                resultsAttendance.forEach(val => {
                    if (value.iduser == val.iduser) {
                        delete val.iduser
                        value.attendance.push(val)
                    }
                })
            })

            res.status(200).send({
                success: true,
                message: "Get data attendance success",
                dataStudents: resultsStudents,
                error: ""
            })
           } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Failed',
                success: false
            })
        }
    },
  studentAttendance: async (req, res) => {
        try {
            console.log(`dataStudent`,req.dataStudent.iduser)
            let { _sort, _order, status, start_date, end_date } = req.query
            let dataAttendance = `
            select a.date, a.check_in, a.check_out, s.status from attendance.attendance a
            join status s on a.idstatus=s.idstatus
            where a.iduser=${req.dataStudent.iduser} ${start_date && end_date ? `and date between '${start_date}' and '${end_date}'` : ""}
            ${_sort && _order ? `order by ${_sort} ${_order}` : ""};`
            let resultsAttendance = await dbQuery(dataAttendance);

            res.status(200).send({
                success: true,
                message: `Get Attendance Success`,
                dataAttendance: resultsAttendance,
                error: ``
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: `Failed`,
                error: error
            })
        }
    },
    getSessionStudent: async (req, res) => {

        try {

            //get data session student yang sedang login
            let getStudent = await dbQuery(`select u.*, s.session, s.timein, s.timeout FROM users as u JOIN session as s ON u.idsession = s.idsession WHERE iduser=${db.escape(req.dataStudent.iduser)};`);

            console.log('isi getStudent', getStudent)
            res.status(200).send({
                message: 'success get data student',
                success: true,
                dataSessionStudent: getStudent
            })
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Failed',
                success: false
            })
        }
    },
    getAttendanceStudent : async (req,res) => {

        try {
            let getAttendance = await dbQuery(`SELECT * FROM attendance WHERE iduser=${db.escape(req.dataStudent.iduser)} AND date=${db.escape(req.params.date)}`)
            
            console.log('isi getAttendance =>', getAttendance)
            res.status(200).send({
                message: 'success get data attendance',
                success: true,
                dataAttendance: getAttendance
            })

        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Failed',
                success: false
            })
        }
    },
    checkIn: async (req, res) => {

        try {

            let { date, checkin } = req.body

            //get data session student yang sedang login
            let getStudent = await dbQuery(`select u.*, s.session, s.timein, s.timeout FROM users as u JOIN session as s ON u.idsession = s.idsession WHERE iduser=${db.escape(req.dataStudent.iduser)};`);

            //cek status berdasarkan waktu checkin dan timein
            let idstatus = checkin <= getStudent[0].timein ? 3 : 4;

            //insert data attendance
            let sqlInsert = `INSERT INTO attendance VALUES (null,${db.escape(req.dataStudent.iduser)}, ${db.escape(idstatus)},
            ${db.escape(date)}, ${db.escape(checkin)},null);`

            let InsertAttendance = await dbQuery(sqlInsert)

            if (InsertAttendance.insertId) {

                res.status(200).send({
                    message: 'success insert attendance',
                    success: true,
                    data_IdAttendance: InsertAttendance.insertId
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Failed',
                success: false
            })
        }
    },
    checkOut: async (req, res) => {

        try {

            let { checkout } = req.body

            //update kolom checkout
            await dbQuery(`UPDATE attendance set check_out=${db.escape(checkout)} WHERE idattendance=${req.params.idattendance}`)

            res.status(200).send({
                message: 'success checkout',
                success: true
            })

        } catch (error) {
            console.log(error)
            res.status(500).send({
                message: 'Failed',
                success: false
            })
        }
    }
}
