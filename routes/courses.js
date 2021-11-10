const {Router} = require('express');
const Course = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');
const { validationResult } = require('express-validator/check');

function isOwner(course, req) {
    return course.userId.toString() === req.user._id.toString()
}

router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().lean().populate('userId');
        // без populate мы получим только поле c id юзера
        // c populate мы получаем весь объект юзера
        res.render('courses', {
            title: 'Курсы',
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses
        });
    } catch (e) {
        console.log(e)
    }
});

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/');
    }

    try {
        const course = await Course.findById(req.params.id).lean();

        if (!isOwner(course, req)) {
            res.redirect('/courses');
        }

        res.render('course-edit', {
            title: `Редактировать ${course.title}`,
            course
        });
    } catch (e) {
        console.log(e)
    }


});

router.post('/edit', auth, async (req, res) => {
    const { id } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).redirect(`/course/${id}/edit?allow=true`);
    }

    try {
        const {id} = req.body;
        const course = await Course.findById(id).lean();
        delete req.body.id;

        if (!isOwner(course, req)) {
            res.redirect('/courses');
        }
        Object.assign(course, req.body);
        await course.save();
        res.redirect('/courses');
    } catch (e) {
        console.log(e)
    }
});

router.post('/remove', auth, async (req, res) => {
    try {
        await Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
        }).lean();
        res.redirect('/courses');
    } catch (e) {
        console.log(e)
    }
});

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).lean();

        res.render('course', {
            layout: 'empty',
            title: `Курс ${course.title}`,
            course
        });
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
