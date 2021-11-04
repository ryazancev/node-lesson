const keys = require('../keys');

module.exports = function (email) {
    return {
        to: email, // куда отправляем
        from: keys.EMAIL_FROM, // откуда отправляем
        subject: 'Аккаунт создан', // тема сообщения
        html: `
            <h1>Привет</h1>
            <p>Ты только что зарегистрировался на нашем сайте</p>
            <p>Твой email: ${email}</p>
            <a href="${keys.BASE_URL}">Магазин сарваров</a>
        ` // разметка сообщения
    }
}