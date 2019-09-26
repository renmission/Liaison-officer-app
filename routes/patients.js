const router = require('express').Router();
const path = require('path');
const Patient = require('../models/Patient');
const Category = require('../models/Category');

const { patientValidation, categoryValidation, patientValidationTwo } = require('../validation');
const { escapeRegex } = require('../helpers/search');
const multer = require('multer');



// Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb)
    }
}).single('myImage');

// Check file type
function checkFileType(file, cb) {
    //allowed ext
    const fileTypes = /jpeg|jpg|png|gif|webp|pdf/;
    // check ext
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //check mime
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error: Images Only!');
    }
}


router.get('/', async (req, res) => {
    const perPage = 10;
    const page = req.query.page || 1;

    try {
        const patients = Patient.find()
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .populate('category')
            .then(patients => {

                Patient.collection.countDocuments()
                    .then(patientCount => {
                        res.render('patients', {

                            patients,
                            current: parseInt(page),
                            pages: Math.ceil(patientCount / perPage),

                        });
                    });
            })
            .catch(err => console.log(err))
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.get('/pt/add', (req, res) => {
    Category.find({})
        .then(categories => {
            res.render('add-patient', { categories });
        })
        .catch(err => console.log(err))
});

router.get('/pt/add', async (req, res) => {
    const categories = await Category.find({});

    try {
        res.render('add-patient', { patient });
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
    let category = req.body.category;

    const patient = new Patient({
        hospital,
        name,
        room,
        details,
        slug,
        category
    });

    try {
        const savePatient = await patient.save();
        res.redirect('/patients');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById({ _id: req.params.id })

        await patient.delete();

        res.redirect('/patients');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});



router.get('/pt/:id', async (req, res) => {

    const patient = await Patient.findById({ _id: req.params.id });
    const categories = await Category.find();

    try {
        res.render('patient', { patient, categories });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.put('/pt/:id', upload, async (req, res) => {
    const patient = await Patient.findById({ _id: req.params.id });

    patient.room = req.body.room;
    patient.category = req.body.category;
    patient.details = req.body.details;
    patient.myImage = req.file.filename;

    try {

        const savePatient = await patient.save();

        res.redirect('/patients');

    } catch (error) {
        console.error('ERROR:', error.message);
    }
});


router.get('/search', (req, res) => {

    if (req.query.search) {

        const regex = new RegExp(escapeRegex(req.query.search), 'gi');

        Patient.find({ "name": regex }, (err, foundPatient) => {

            if (err) return console.log(err);

            res.render('search', { foundPatient });

        }).populate('category')
    } else {
        res.redirect('/patients');
    }
});

module.exports = router;