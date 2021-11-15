const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        // Куда мы будем складывать наш файл
        cb(null, 'images')
    },
    filename(req, file, cb) {
        // Переименовываем наш файл, имя должно быть уникальным
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
});

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
//Валидатор для файла
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = multer({
    storage,
    fileFilter
});