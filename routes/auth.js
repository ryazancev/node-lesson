const {Router} = require("express");
const router = Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const keys = require("../keys");
const regEmail = require('../emails/registration');

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY}
}))

router.get('/login', async (req, res) => {
    res.render('auth/login', {
        title: 'Авторизация',
        isLogin: true,
        loginError: req.flash('loginError'), // Принимаем ошибку
        registerError: req.flash('registerError') // Принимаем ошибку
    })
});

router.get('/logout', async (req, res) => {
    // Удаляем сессию
    req.session.destroy(() => {
        res.redirect('/auth/login#login');
    });
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const candidate = await User.findOne({ email });

        if (candidate) {
            const areSame = await bcrypt.compare(password, candidate.password);

            if (areSame) {
                req.session.user = candidate;
                req.session.isAuthenticated = true; // В сессии будет храниться значение тру если мы залогинились в системе
                // Сохраним юзера и только потом сделаем редирект
                req.session.save((err) => {
                    if (err) throw err;
                    res.redirect('/');
                });
            } else {
                req.flash('loginError', 'Неверный пароль');
                res.redirect('/auth/login#login');
            }
        } else {
            req.flash('loginError', 'Такого пользователя не существует');
            res.redirect('/auth/login#login');
        }

    } catch (e) {
        console.log(e)
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email, password, repeat, name } = req.body;
        const candidate = await User.findOne({ email });
        if (candidate) {
            // Обрабатываем ошибку
            req.flash('registerError', 'Пользователь с таким email уже существует');
            res.redirect('/auth/login#register');
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            const user = new User({
                email, name, password: hashPassword, cart: {items: []}
            });
            await user.save();
            await transporter.sendMail(regEmail(email));
            res.redirect('/auth/login#login');
        }
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;