const express = require('express');
const router = express.Router();
const User = require('../controllers/user')

// routes
router.post('/login', User.authenticate);
router.post('/register', User.register);
router.get('/getalluser', User.getAll);
router.get('/userinfo/:id', User.getById);
router.put('/update/:id', User.update);
router.delete('/remove/:id', User._delete);

module.exports = router;

