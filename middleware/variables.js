module.exports = function (req, res, next) {
    // добавим собственное поле в объект locals
    res.locals.isAuth = req.session.isAuthenticated;
    res.locals.csrf = req.csrfToken();
    next();
};