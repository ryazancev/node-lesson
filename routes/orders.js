const {Router} = require('express');
const router = Router();
const Order = require('../models/order');
const auth = require('../middleware/auth');

router.get('/', auth,  async (req, res) => {
    try {
        const orders = await Order.find({
            'user.userId': req.user._id
        }).lean().populate('user.userId');

        res.render('orders', {
            isOrder: true,
            title: 'Заказы',
            orders: orders.map(o => ({
                ...o,
                price: o.courses.reduce((total, c) => {
                    return total += c.count * c.course.price
                }, 0)
            }))
        });
    } catch (e) {
        console.log(e)
    }
});


router.post('/', auth, async (req, res) => {
    try {
        // получаем user. Populate нужен чтобы id курсов превратить в объект
        const user = await req.user.populate('cart.items.courseId');

        const courses = user.cart.items.map(i => ({
            count: i.count,
            course: {...i.courseId._doc} //  Объект курса
        }));
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user
            },
            courses
        });

        await order.save();
        await req.user.clearCart();
        res.redirect('/orders');
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;