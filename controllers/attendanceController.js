const { db, dbQuery } = require('../config/database')


module.exports = {
    getSessionStudent: async (req, res) => {

        try {

            //get data session student yang sedang login
            let getStudent = await dbQuery(`select u.*, s.session, s.timein, s.timeout FROM users as u JOIN sessions as s ON u.idsession = s.idsession WHERE iduser=1;`);

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
    checkIn: async (req, res) => {

        try {

            let { date, checkin } = req.body

            //get data session student yang sedang login
            let getStudent = await dbQuery(`select u.*, s.session, s.timein, s.timeout FROM users as u JOIN sessions as s ON u.idsession = s.idsession WHERE iduser=1;`);

            //cek status berdasarkan waktu checkin dan timein
            let idstatus = checkin <= getStudent[0].timein ? 3 : 4;

            //insert data attendance
            let sqlInsert = `INSERT INTO attendances VALUES (null,${db.escape(getStudent[0].iduser)}, ${db.escape(idstatus)},
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
            await dbQuery(`UPDATE attendances set checkout=${db.escape(checkout)} WHERE idattendance=${req.params.idattendance}`)

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