const { db, dbQuery } = require('../config/database');
const fs = require('fs')

module.exports = {
    getSession: async (req, res) => {
        try {
            let getSQL = await dbQuery(`Select * from session`)
            res.status(200).send({
                success: true,
                message: 'Get Session Success',
                session: getSQL,
                error: ''
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Failed ❌",
                error: error,
            })
        }
    },
    addSession: async (req, res) => {
        try {
            // if (req.dataUser.role == "admin") {
                let insertSQL = await dbQuery(`Insert into session values (null,${db.escape(req.body.session)},${db.escape(req.body.timein)},${db.escape(req.body.timeout)})`)
                res.status(200).send(insertSQL)
            // } else {
            //     res.status(401).send({
            //         success: false,
            //         message: 'You cant access this API ⚠️'
            //     })
            // }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Failed ❌",
                error: error
            })
        }
    },
    editSession: async (req, res) => {
        try {
            // if (req.dataUser.role == "admin") {
                let editSQL = await dbQuery(`UPDATE session SET session = '${req.body.session}',timein = '${req.body.timein}',timeout = '${req.body.timeout}' where idsession = ${db.escape(req.params.id)}`)
                res.status(200).send(editSQL)
            // }else {
            //     res.status(401).send({
            //         success: false,
            //         message: 'You cant access this API ⚠️'
            //     })
            // }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Failed ❌",
                error: error
            })
        }
    },
    deleteSession: async (req, res) => {
        try {
            // if(req.dataUser.role == "admin"){
            let deleteSQL = await dbQuery(`DELETE from session WHERE idsession = ${req.params.id}`)
            res.status(200).send({
                deleteSQL,
                success: true,
                message: "Delete Session Success",
                error: ''
            })
        // }else {
        //     res.status(401).send({
        //         success: false,
        //         message: 'You cant access this API ⚠️'
        //     })
        // }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                message: "Failed ❌",
                error: error
            })
        }
    }
}