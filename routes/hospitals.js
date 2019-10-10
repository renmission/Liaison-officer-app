const router = require('express').Router();
const Hospital = require('../models/Hospital');
const { ensureAuthenticated } = require('../helpers/hbs-helpers');
const { hospitalValidation } = require('../validation');



router.get('/', ensureAuthenticated, async (req, res) => {

    try {
        const hospitals = await Hospital.find({ user: req.user.id });

        res.render('hospitals/index', { hospitals, title: `Hospitals' List` });

    } catch (error) {

        res.status(500).send('Server Error');
    }

});

router.post('/add', ensureAuthenticated, async (req, res) => {
    let errors = [];

    const { error } = hospitalValidation(req.body);

    if (error) {
        errors.push({ text: error.details[0].message })
    }

    let name = req.body.name;
    let user = req.user.id;

    const newHospital = new Hospital({
        name,
        user
    });

    try {

        const hospitalSave = await newHospital.save();

        req.flash('success_msg', 'Hospital added');

        res.redirect('/hospitals');


    } catch (error) {

        res.status(500).send('Server Error');

    }

});


router.get('/:id', ensureAuthenticated, async (req, res) => {
    const hospital = await Hospital.findById({ _id: req.params.id });

    try {
        res.render('hospitals/edit', { hospital, title: `Update hospital ${hospital.name}` });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.put('/:id', ensureAuthenticated, async (req, res) => {

    const hospital = await Hospital.findById({ _id: req.params.id });
    hospital.name = req.body.name;

    try {
        const updateHospital = await hospital.save();
        req.flash('success_msg', 'Hospital updated');
        res.redirect('/hospitals');

    } catch (error) {
        res.status(500).send('Server Error');
    }

});


router.delete('/:id', ensureAuthenticated, async (req, res) => {
    const hospital = await Hospital.findById({ _id: req.params.id });

    try {
        await hospital.remove();
        req.flash('success_msg', 'Hospital deleted');
        res.redirect('/hospitals');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;