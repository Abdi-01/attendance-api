const {readToken} = require('../config/jwt');
const {sessionController} = require('../controllers')
const router = require('express').Router()


// ⚠️ HARUS DITAMBKAHKAN READTOKEN ⚠️ //
router.get('/',sessionController.getSession)
router.post('/',sessionController.addSession)
router.patch('/:id',sessionController.editSession)
router.delete('/:id',sessionController.deleteSession)


module.exports = router