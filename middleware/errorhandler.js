module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        return res.render('error', { message: err.message });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.render('render', { message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.render('error', { message: err.message });
    }

    // default to 500 server error
    return res.render('error', { message: err.message });
}