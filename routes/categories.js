const router = require('express').Router();
const Category = require('../models/Category');
const { categoryValidation } = require('../validation');

router.get('/', async (req, res) => {
    const categories = await Category.find({});

    try {
        res.render('categories', { categories });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.post('/add', async (req, res) => {
    const { error } = categoryValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let name = req.body.name;

    const category = new Category({
        name
    });

    try {
        const saveCategory = await category.save();
        res.redirect('/api/categories');

    } catch (error) {
        res.status(500).send('Server Error');
    }
});

router.get('/:id', (req, res) => {
    Category.find({ _id: req.params.id })
        .then(category => res.render('edit-category', { category }))
        .catch(err => console.log(err))
});

router.put('/:id', async (req, res) => {
    const { error } = categoryValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const category = await Category.findById({ _id: req.params.id })

    category.name = req.body.name;

    try {
        const update = await category.save();
        res.redirect('/api/categories');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.delete('/:id', async (req, res) => {
    const category = await Category.findById({ _id: req.params.id });

    try {
        const deleteCategory = await category.delete();
        res.redirect('/api/categories');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;