const router = require('express').Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { registerValidation } = require('../validation');

const User = require('../models/User');

require('../config/passport')(passport);


// GET about
router.get('/about', (req, res) => {
    res.render('about', { title: 'about lo' })
});

// GET login
router.get('/', (req, res, next) => {
    if (req.user) return res.render('/patients');
    res.render('users/login', { layout: 'landing' });
});

// POST login + passport user authenticate
router.post('/login', passport.authenticate('local', {
    successRedirect: '/patients',
    failureRedirect: '/',
    failureFlash: true
}));

// GET logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// GET register
router.get('/register', (req, res) => {
    res.render('users/register', { layout: 'landing' });
});

// POST register
router.post('/register', async (req, res) => {
    let errors = [];

    const { error } = registerValidation(req.body);

    if (error) {
        errors.push({ text: error.details[0].message })
    }

    if (errors.length > 0) {
        res.render('users/register', {
            layout: 'landing',
            errors: errors,
            name: req.body.name,
            email: req.body.email
        });
    } else {

        const user = await User.findOne({ email: req.body.email });

        if (user) {
            req.flash('error_msg', 'Email already registered');
            res.redirect('register');
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });

        await newUser.save();
        req.flash('success_msg', 'You now registered and can log in');
        res.redirect('/login');
    }
})

module.exports = router;