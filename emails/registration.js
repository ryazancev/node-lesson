const keys = require('../keys');

module.exports = function (email) {
    return {
        to: email, // куда отправляем
        from: keys.EMAIL_FROM, // откуда отправляем
        subject: 'Аккаунт создан', // тема сообщения
        html: `
            <h1>Привет</h1>
            <p>Пошел нахер!</p>
            <p>Твой email псина: ${email}</p>
            <a href="${keys.BASE_URL}">Магазин сарваров</a>
        ` // разметка сообщения
    }
}