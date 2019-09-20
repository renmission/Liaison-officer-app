const router = require('express').Router();
const Patient = require('../models/Patient');
const { patientValidation } = require('../validation');


router.get('/', async (req, res) => {
    try {
        const patients = Patient.find()
            .then(patients => res.render('patients', { patients }))
            .catch(err => console.log(err))
    } catch (error) {
        res.status(400).send('Server Error');
    }
});

router.post('/add', async (req, res) => {
    // Validate
    const { error } = patientValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const patient = new Patient({
        name: req.body.name,
        details: req.body.details
    });

    try {
        const savePatient = await patient.save();
        res.send('Patient successfully created');
    } catch (error) {
        res.status(400).send('Server Error');
    }
});


router.delete('/delete/:id', async (req, res) => {
    try {
        const patient = await Patient.findById({ _id: req.params.id })

        await patient.delete();

        res.redirect('/api/patients');
    } catch (error) {
        res.status(400).send('Server Error');
    }
});


router.post('/update/:id', async (req, res) => {
    // Validate
    const { error } = patientValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const patient = await Patient.findById({ _id: req.params.id });

        patient.name = req.body.name;
        patient.details = req.body.details;

        await patient.save();

        res.send('Patient Successfully updated');

    } catch (error) {
        res.status(400).send('Server Error');
    }
});


module.exports = router;