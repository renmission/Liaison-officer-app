const router = require('express').Router();
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/User');

router.get('/', (req, res, next) => {
    if (req.user) return res.render('/patients');
    res.render('index', { layout: 'landing' });
});

//APP LOGIN
passport.use(new localStrategy({ usernameField: 'email' }, (email, password, done) => {

    User.findOne({ email: email }).then(user => {
        if (!user) return done(null, false, { message: 'No user found' });

        bcrypt.compare(password, user.password, (err, matched) => {

            if (err) return err;

            if (matched) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect password' });
            }

        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/patients',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;