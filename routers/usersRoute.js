const router = require('express').Router();
const { readToken } = require('../config/jwt');
const {usersController} = require('../controllers');

router.post('/login',usersController.login);
router.get('/keepLogin', readToken, usersController.keepLogin);

module.exports = router;