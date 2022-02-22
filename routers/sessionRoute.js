const {readToken} = require('../config/jwt');
const {sessionController} = require('../controllers')
const router = require('express').Router()


// ⚠️ HARUS DITAMBKAHKAN READTOKEN ⚠️ //
router.get('/',readToken,sessionController.getSession)
router.post('/',readToken,sessionController.addSession)
router.patch('/:id',readToken,sessionController.editSession)
router.delete('/:id',readToken,sessionController.deleteSession)


module.exports = router