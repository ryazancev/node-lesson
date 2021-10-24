const User = require('../models/user');

module.exports = async function (req, res, next) {
    // Проверяем создан ли пользователь
    if (!req.session.user) {
        return next();
    }
    // Превращаем сессию в модель
    req.user = await User.findById(req.session.user._id);
    next();
};