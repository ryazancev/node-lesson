const {Router} = require('express');
const Course = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
    const courses = await Course.find().lean().populate('userId');
    // без populate мы получим только поле c id юзера
    // c populate мы получаем весь объект юзера
    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    });
});

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const course = await Course.findById(req.params.id).lean();
    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    });
});

router.post('/edit', auth, async (req, res) => {
    const {id} = req.body;
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body).lean();
    res.redirect('/courses');
});

router.post('/remove', auth, async (req, res)=>{
    try {
        await Course.deleteOne({_id: req.body.id}).lean();
        res.redirect('/courses');
    } catch (e) {
        console.log(e)
    }
});

router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id).lean();

    res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course
    });
});

module.exports = router;
