// Adapted from https://stackoverflow.com/questions/36486397/passport-login-and-persisting-session
module.exports = function (req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.user) {
        next();
    }
    // if they aren't redirect them to the login page
    else {
        req.flash('error_msg', 'Please log in to view that resource');
        res.redirect('/login');
    }
};