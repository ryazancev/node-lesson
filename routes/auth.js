const {Router} = require("express");
const router = Router();
const User = require('../models/user');

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true
    })
});

router.get('/logout', async (req, res) => {
    // Удаляем сессию
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    });
});

router.post('/login', async (req, res) => {
    req.session.user = await User.findById('6171e97c239d305e4e7bcfdc');
    req.session.isAuthenticated = true; // В сессии будет храниться значение тру если мы залогинились в системе
    // Сохраним юзера и только потом сделаем редирект
    req.session.save((err) => {
        if (err) throw new Error(err);
        res.redirect('/');
    });
});

module.exports = router;