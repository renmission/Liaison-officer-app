const router = require('express').Router();

const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



router.get('/', (req, res) => {
    res.render('index', { layout: 'landing' });
});

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if user already exist 
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('email already exist');

    //hash password - bcrypt
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash
    });

    try {
        const saveUser = await user.save();
        res.redirect('/');
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/', async (req, res) => {
    // Validate
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // check if user do not exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('email is not found');

    // if password is match
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).send('Invalid password');

    // create and assign token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    res.header('auth-token', token);
    res.cookie('auth-token', token);

    res.redirect('/api/patients');
});


module.exports = router;