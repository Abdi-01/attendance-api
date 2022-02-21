const { db, dbQuery } = require(`../config/database`);
const { uploader } = require("../config/multer");
const fs = require("fs");

module.exports = {

    studentAttendance: async (req, res) => {

        try {
            let filterQuery = [];

            for (let prop in req.query) {
                if (prop != "_sort" && prop != "_order") {
                    if (prop != "start_date" && prop != "end_date") {
                        filterQuery.push(`${prop == "date" ? `a.${prop}` : prop}=${db.escape(req.query[prop])}`)
                    }
                }
            }

            // console.log(filterQuery)

            let { _sort, _order, status, start_date, end_date } = req.query

            // if (req.dataUser.role == 'student') {
            let getAttendance = `
            select a.date, a.checkin, a.checkout, s.status from attendance a
            join status s on a.idstatus=s.idstatus
            where a.iduser=3 ${start_date && end_date? `and date between '${start_date}' and '${end_date}'`:""}
            ${_sort && _order ? `order by ${_sort} ${_order}` : ""};`
            
            // where a.iduser=${req.dataUser.iduser} ${start_date && end_date? `and date between '${start_date}' and '${end_date}'`:""}
            // order by date desc;`            
            // let getAttendance = `
            // select a.date, a.checkin, a.checkout, s.status from attendance a
            // join status s on a.idstatus=s.idstatus
            // where a.iduser=3 and date between '${start_date}' and '${end_date}' order by date desc;`


            let resultsAttendance = await dbQuery(getAttendance);

            res.status(200).send({
                success: true,
                message: `Get Attendance Success`,
                getAttendance: resultsAttendance,
                error: ``
            });
            // } else {
            //     res.status(401).send({
            //         success: false,
            //         message: "You can't access this API"
            //     })
            // }
        } catch (error) {
            res.status(500).send({
                success: false,
                message: `Failed`,
                error: error
            })
        }
    }
}
