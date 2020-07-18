const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const errorHandler = require('../middleware/errorhandler');
var jsonwt = require('jsonwebtoken')
var key = require('../models/config')
var Blog = require('../models/blog');

var passport = require('passport')


router.post('/signup', async (req, res) => {
    var newUser = {};
    newUser.username = req.body.username;
    newUser.first_name = req.body.first_name;
    newUser.last_name = req.body.last_name;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    await User.findOne({ username: newUser.username, email: newUser.email })
        .then(profile => {
            if (profile) {
                res.render('signup', {
                    message: 'User already exist'
                })
            }
            else {
                const salt = bcrypt.genSaltSync(10)
                const password = newUser.password
                const user = new User({
                    username: newUser.username,
                    password: bcrypt.hashSync(password, salt),
                    first_name: newUser.first_name,
                    last_name: newUser.last_name,
                    email: newUser.email
                })
                user.save()
                res.redirect('/login')
                console.log(user)
            }

        })
        .catch(e => {
            errorHandler(e, '', res, '')
        })
});
//get signup page
router.get('/signup', function (req, res, next) {
    res.render('signup', { message: '' });
})
//get login
router.get('/login', function (req, res, next) {
    var token = req.cookies['jwt'];
    if (token) {
        res.redirect('/create');
    }
    else {
        res.render('login', { message: '' })
    }
})
//post login
router.post("/login", function (req, res) {
    var newUser = {};
    newUser.username = req.body.username;
    newUser.password = req.body.password;

    User.findOne({ username: newUser.username })
        .then(candidate => {
            if (candidate) {
                bcrypt.compare(
                    req.body.password,
                    candidate.password,
                    function (err, result) {
                        if (err) {
                            errorHandler(err, req, res, '')
                        } else if (result == true) {
                            const payload = {
                                id: candidate.id,
                                username: candidate.username,
                                first_name: candidate.first_name,
                                last_name: candidate.last_name,
                                email: candidate.email
                            };
                            jsonwt.sign(
                                payload,
                                key.secret,
                                { expiresIn: 3600 },
                                (err, token) => {
                                    data = {
                                        success: true,
                                        id: payload.id,
                                        username: payload.username,
                                        first_name: payload.first_name,
                                        last_name: payload.last_name,
                                        email: payload.email,
                                        token: "Bearer " + token
                                    }
                                    console.log(data)
                                    res.cookie('jwt', data);
                                    res.redirect('/create');
                                }
                            );
                        } else {
                            res.render('login', { message: 'unauthorized user' });
                        }
                    }
                )
            }
            else {
                res.render('login', { message: 'user doesnt exist' });
            }

        })
        .catch(err => {
            console.log("Error is ", err.message);
            errorHandler(err, '', res, '')
        });
});

router.get('/', function (req, res, next) {
    var token = req.cookies['jwt'];
    console.log(token)
    if (token) {
        res.redirect('/create');
    }
    else
        res.render('home');

});

router.post('/create', function (req, res, next) {
    var token = req.cookies['jwt'];
    console.log(req.cookies.jwt.username, "hi")
    var newblog = new Blog({
        username: req.cookies.jwt.username,
        title: req.body.title,
        description: req.body.description
    })
    newblog.save(function (err) {
        if (err)
            throw err;
        else
            console.log('User added to the Database!');
    })
    res.redirect('/create')

});

router.get('/delete/:id', async (req, res) => {
    Blog.findByIdAndRemove({ _id: req.params.id }).then(function (blog) {
        blog = { data: [] };
        console.log("deleted")
        res.redirect('/create');
    }).catch(function (err) {
        console.log(err);
        errorHandler(err, '', res, '')
    })
});

router.get('/create', function (req, res) {
    var token = req.cookies['jwt'];
    Blog.find({}).then(function (blogList) {
        res.render('blogpage', { data: blogList, username: req.cookies.jwt.username });

    }).catch(err => {
        errorHandler(err, '', res, '')
    })

});

router.get('/logout', function (req, res, next) {
    var token = req.cookies['jwt'];
    console.log(req.cookies.jwt.username, "hi")
    if (token) {
        res.clearCookie('jwt', req.cookies.jwt.username);
        res.redirect('/login')
    }
})
module.exports = router;