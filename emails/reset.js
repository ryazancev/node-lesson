const keys = require("../keys");
module.exports = function (email, token) {
    return {
        to: email, // куда отправляем
        from: keys.EMAIL_FROM, // откуда отправляем
        subject: 'Восстановление доступа', // тема сообщения
        html: `
            <h1>Вы забыли пароль?</h1>
            <p>Если нет, проигнорируйте данное письмо</p>
            <p>Если да, нажмите на ссылку ниже</p>
            <a href="${keys.BASE_URL}/auth/password/${token}">Восстановить пароль</a>
        ` // разметка сообщения
    }
}