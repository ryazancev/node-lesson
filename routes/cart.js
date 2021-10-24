const {Router} = require('express');
const Course = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');

const mapCartItems = (cart) => {
    return cart.items.map(c => ({
        ...c.courseId._doc,
        count: c.count,
        id: c.courseId.id
    }));
};

const computePrice = (courses) => {
    return courses.reduce((total, course) => {
        return total += course.price * course.count;
    }, 0);
};

router.post('/add', auth, async (req, res) => {
   try  {
       const course = await Course.findById(req.body.id).lean().populate('userId');
       await req.user.addToCart(course);
       res.redirect('/cart');
   } catch (e) {
       console.log(e);
   }
});

router.delete('/remove:id', auth, async (req,res) => {
    try {
        await req.user.removeFromCart(req.params.id);
        const user = await req.user.populate('cart.items.courseId');
        const courses = mapCartItems(user.cart);
        const cart = {
            courses,
            price: computePrice(courses)
        }
        res.status(200).json(cart);
    } catch (e) {
        console.log(e);
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.courseId');
        const courses = mapCartItems(user.cart);

        res.render('cart', {
            title: 'Корзина',
            isCart: true,
            courses,
            price: computePrice(courses)
        });
    } catch (e) {
        console.log(e)
    }
});

module.exports = router;