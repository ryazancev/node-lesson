const path = require('path');
const express = require('express');
const csrf = require('csurf');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongodb-session')(session);
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const varMiddleware = require('./middleware/variables.js');
const userMiddleware = require('./middleware/user.js');
const keys = require('./keys');
const errorHandler = require('./middleware/error');
const fileMiddleware = require('./middleware/file');
const helmet = require('helmet');
const compression = require('compression');

// Создаем экземпляр приложения
const app = express();
// Настраиваем шаблонизатор
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers')
});
// Создаем экземпляр на базе класса MongoStore
const store = new MongoStore({
    collection: 'sessions', // Название коллекции (поля) в БД
    uri: keys.MONGODB_URI
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: keys.SESSION_SECRET, // временно
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(fileMiddleware.single('avatar'));
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
        });
        // const condidate = await User.findOne().lean();
        //
        // if (!condidate) {
        //     const user = new User({
        //         email: 'ryazancev.e@gmail.com',
        //         name: 'Ryazanb',
        //         cart: {items: []}
        //     })
        //     await user.save();
        // }
        app.listen(PORT, () => {
            console.log(`sarvar запущен на порте ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};
start();




