const { db, dbQuery } = require("../config/database")

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

            let getDataSQL = `SELECT u.*, s.session, s.time_in, s.time_out, r.role, st.status FROM attendance.users u
            JOIN attendance.session s on s.idsession = u.idsession
            JOIN attendance.role r on r.idrole = u.idrole
            JOIN attendance.status as st on st.idstatus = u.idstatus 
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
                success: false,
                message: "Failed",
                error
            })
        }
    },
    studentAttendance: async (req, res) => {

        try {
            let { _sort, _order, status, start_date, end_date } = req.query
            let getAttendance = `
            select a.date, a.check_in, a.check_out, s.status from attendance.attendance a
            join status s on a.idstatus=s.idstatus
            where a.iduser=${req.params.id} ${start_date && end_date ? `and date between '${start_date}' and '${end_date}'` : ""}
            ${_sort && _order ? `order by ${_sort} ${_order}` : ""};`

            let resultsAttendance = await dbQuery(getAttendance);

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
    }
}
