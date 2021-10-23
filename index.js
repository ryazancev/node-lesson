const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const User = require('./models/user');

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use( async (req,res,next) => {
    try {
        req.user = await User.findById('6171e97c239d305e4e7bcfdc'); // Временный user где id мы копируем из базы
        next();
    } catch (e) {
        console.log(e)
    }
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}))

app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        const url = 'mongodb+srv://ryazanb:8XgUAaacADW3C1r5@cluster0.neans.mongodb.net/shop';
        await mongoose.connect(url, {
            useNewUrlParser: true,
        });
        const condidate = await User.findOne().lean();

        if (!condidate) {
            const user = new User({
                email: 'ryazancev.e@gmail.com',
                name: 'Ryazanb',
                cart: {items: []}
            })
            await user.save();
        }
        app.listen(PORT, () => {
            console.log(`sarvar запущен на порте ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};
start();




