const config = require('../models/config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('../middleware/jwt').passport;


module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};
//login
async function authenticate({ username, password }) {
    const user = await User.findOne({ username: username });
    console.log(user)
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        console.log(user, token)
        return {
            user,
            token
        };
    }
}
//get all user
async function getAll() {

    return await User.find();
}

//get particular id
async function getById(id) {
    const user = await User.findById(id);
    if (user) {
        return await User.findById(id);
    }

}
//register user
async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    const user = new User(userParam);
    if (userParam.password) {
        user.password = bcrypt.hashSync(userParam.password, 10);
    }
    await user.save();
    return user
}

//update
async function update(id, userParam) {
    const user = await User.findById(id);
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }
    if (userParam.password) {
        userParam.password = bcrypt.hashSync(userParam.password, 10);
    }
    Object.assign(user, userParam);
    return await user.save();
}

//delete user
async function _delete(id) {
    await User.findByIdAndRemove(id);
}