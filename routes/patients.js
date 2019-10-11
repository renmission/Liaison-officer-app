const router = require('express').Router();
const path = require('path');
const Patient = require('../models/Patient');
const Category = require('../models/Category');
const Hospital = require('../models/Hospital');

const { patientValidation, categoryValidation, patientValidationTwo } = require('../validation');
const { escapeRegex } = require('../helpers/search');
const { ensureAuthenticated } = require('../helpers/hbs-helpers');
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
    limits: { fileSize: 3000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
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



router.get('/search', async (req, res) => {
    if (req.query.search) {
        const regex = RegExp(escapeRegex(req.query.search), 'gi');
        const foundPatient = await Patient.find({ name: regex }).populate('category').populate('hospital')
        res.render('patients/search', { foundPatient });
    }
});

router.get('/', ensureAuthenticated, async (req, res) => {


    const perPage = 10;
    const page = req.query.page || 1;

    try {

        const patients = Patient.find({ user: req.user.id })
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .populate('category')
            .populate('hospital')
            .then(patients => {

                Patient.collection.countDocuments()
                    .then(patientCount => {
                        res.render('patients/index', {

                            patients,
                            current: parseInt(page),
                            pages: Math.ceil(patientCount / perPage),
                            title: `Patients' List`

                        });
                    });
            })
            .catch(err => console.log(err))

    } catch (error) {
        res.status(500).send('Server Error');
    }
});

router.get('/add', ensureAuthenticated, async (req, res) => {
    const patient = await Patient.find({});
    const categories = await Category.find({});
    const hospitals = await Hospital.find({});

    try {
        res.render('patients/add', { patient, categories, hospitals, title: 'Add Patients' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.post('/add', ensureAuthenticated, async (req, res, next) => {
    // Validate
    let errors = [];

    const { error } = patientValidation(req.body);

    if (error) {
        errors.push({ text: error.details[0].message })
    }

    let hospital = req.body.hospital;
    let name = req.body.name;
    let room = req.body.room;
    let dateOfAdmission = req.body.dateOfAdmission;
    let dateOfAdmissionTo = req.body.dateOfAdmissionTo;
    let slug = "";
    if (slug == "")
        slug = name.replace(/\s+/g, '-').toLowerCase();
    let category = req.body.category;
    let cardNum = req.body.cardNum;
    let company = req.body.company;
    let birthday = req.body.birthday;
    let principal = req.body.principal;
    let principalBirthday = req.body.principalBirthday;
    let className = req.body.className;
    let plan = req.body.plan;
    let roomAndBoardAllowance = req.body.roomAndBoardAllowance;
    let shs = req.body.shs;
    let util = req.body.util;
    let pecWaived = req.body.pecWaived;
    let exp = req.body.exp;
    let fdx = req.body.fdx;
    let ghb = req.body.ghb;
    let phic = req.body.phic;
    let doctor = req.body.doctor;
    let alga = req.body.alga;
    let additionalDetails = req.body.additionalDetails;
    let user = req.user.id

    if (errors.length > 0) {
        res.render('patients/add', {
            errors: errors,
            hospital,
            name,
            room,
            cardNum,
            dateOfAdmission
        });
    }

    const patient = new Patient({
        hospital,
        name,
        room,
        dateOfAdmission,
        dateOfAdmissionTo,
        slug,
        cardNum,
        company,
        birthday,
        principal,
        principalBirthday,
        className,
        plan,
        roomAndBoardAllowance,
        shs,
        util,
        pecWaived,
        exp,
        fdx,
        ghb,
        phic,
        doctor,
        alga,
        additionalDetails,
        category,
        user
    });

    try {
        const savePatient = await patient.save();
        req.flash('success_msg', 'Patient successfully added');
        res.redirect('/patients');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        const patient = await Patient.findById({ _id: req.params.id })

        await patient.delete();
        req.flash('success_msg', 'Patient deleted');
        res.redirect('/patients');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

router.get('/view/:id', async (req, res) => {
    const patient = await Patient.findById({ _id: req.params.id })
        .populate('category')
        .populate('hospital')

    try {
        res.render('patients/view', { patient, title: `Patient ${patient.name}` })
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

router.get('/:id', ensureAuthenticated, async (req, res) => {

    const patient = await Patient.findById({ _id: req.params.id });
    const categories = await Category.find();
    const hospitals = await Hospital.find();

    try {

        if (patient.user != req.user.id) {
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/patients');
        }

        res.render('patients/edit', { patient, categories, hospitals, title: `Patient ${patient.name}` });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.put('/:id', ensureAuthenticated, upload, async (req, res) => {
    const patient = await Patient.findById({ _id: req.params.id });

    patient.name = req.body.name;
    patient.room = req.body.room;
    patient.category = req.body.category;
    patient.details = req.body.details;
    patient.myImage = req.file.filename;

    patient.cardNumber = req.body.cardNumber;
    patient.company = req.body.company;
    patient.birthday = req.body.birthday;
    patient.principal = req.body.principal;
    patient.principalBirthday = req.body.principalBirthday;
    patient.className = req.body.className;
    patient.plan = req.body.plan;
    patient.roomAndBoardAllowance = req.body.roomAndBoardAllowance;
    patient.shs = req.body.shs;
    patient.util = req.body.util;
    patient.pecWaived = req.body.pecWaived;
    patient.exp = req.body.exp;
    patient.fdx = req.body.fdx;
    patient.ghb = req.body.ghb;
    patient.phic = req.body.phic;
    patient.doctor = req.body.doctor;
    patient.alga = req.body.alga;
    patient.additionalDetails = req.body.additionalDetails;

    try {

        const savePatient = await patient.save();

        req.flash('success_msg', 'Patient successfully updated');
        res.redirect('/patients');

    } catch (error) {
        console.error('ERROR:', error.message);
    }
});


module.exports = router;