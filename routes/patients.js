const router = require('express').Router();
const Patient = require('../models/Patient');
const { patientValidation } = require('../validation');
const { escapeRegex } = require('../helpers/search');


router.get('/', async (req, res) => {
    try {
        const patients = Patient.find()
            .then(patients => res.render('patients', { patients }))
            .catch(err => console.log(err))
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.get('/pt/add', async (req, res) => {
    const patient = await Patient.find({});

    try {
        res.render('add-patient', { patient });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

router.get('/pt/:id', async (req, res) => {
    const patient = await Patient.findOne({_id: req.params.id});

     try {
         res.render('patient', { patient });
     } catch (error) {
        res.status(500).send('Server Error');
     }
    
});


router.post('/pt/add', async (req, res) => {
    // Validate
    const { error } = patientValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let hospital = req.body.hospital;
    let name = req.body.name;
    let room = req.body.room;
    let slug = "";
    if (slug == "")
        slug = name.replace(/\s+/g, '-').toLowerCase();
    let details = req.body.details;

    const patient = new Patient({
        hospital,
        name,
        room,
        details,
        slug
    });

    try {
        const savePatient = await patient.save();
        res.redirect('/api/patients');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById({ _id: req.params.id })

        await patient.delete();

        res.redirect('/api/patients');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.put('/:id', async (req, res) => {
    // Validate
    const { error } = patientValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const patient = await Patient.findById({ _id: req.params.id });

        patient.hospital = req.body.hospital;
        patient.name = req.body.name;
        patient.room = req.body.room;
        patient.details = req.body.details;

        await patient.save();

        res.redirect('/api/patients');

    } catch (error) {
        res.status(500).send('Server Error');
    }
});




router.get('/search', (req, res) => {

    if (req.query.search) {

        const regex = new RegExp(escapeRegex(req.query.search), 'gi');

        Patient.find({ "name": regex }, (err, foundPatient) => {

        if(err) return console.log(err);

        res.render('search', { foundPatient });

        }); 
     }
});

module.exports = router;