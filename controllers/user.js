var userService = require('../service/user');
var User = require('../models/user')

//login
exports.authenticate = function (req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}
//register
exports.register = function (req, res, next) {
    var newUser = new User({
        username: req.body.username,
        password: req.body.password
    });
    userService.create(newUser).then((user) => {

        res.status(200).send(user);
    })
        .catch(err => {
            res.status(404).send("user already exist");
        });
}

//getall user
exports.getAll = function (req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}
//get particular id
exports.getById = function (req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404).json({ message: "user of requested id not exist" }))
        .catch(err => next(err));
}

//update
exports.update = function (req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({ message: "User Infomation updated successfully" }))
        .catch(err => next(err));
}

//delete
exports._delete = function (req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({ message: "User Deleted Successfully" }))
        .catch(err => next(err));
}
