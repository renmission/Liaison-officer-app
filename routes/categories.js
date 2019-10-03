const router = require('express').Router();
const Category = require('../models/Category');
const { categoryValidation } = require('../validation');
const { ensureAuthenticated } = require('../helpers/hbs-helpers');


router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id });

        res.render('categories/index', { categories });

    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.post('/add', ensureAuthenticated, async (req, res) => {
    const { error } = categoryValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let name = req.body.name;
    let user = req.user.id

    const category = new Category({
        name,
        user
    });

    try {

        const saveCategory = await category.save();

        req.flash('success_msg', 'Category added');
        res.redirect('/categories');

    } catch (error) {
        res.status(500).send('Server Error');
    }
});

router.get('/:id', ensureAuthenticated, async (req, res) => {
    const category = await Category.findById({ _id: req.params.id });

    try {
        res.render('categories/edit', { category });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

router.put('/:id', ensureAuthenticated, async (req, res) => {
    const category = await Category.findById({ _id: req.params.id })

    category.name = req.body.name;

    try {
        const updateCategory = await category.save();
        req.flash('success_msg', 'Category updated');
        res.redirect('/categories');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


router.delete('/:id', ensureAuthenticated, async (req, res) => {
    const category = await Category.findById({ _id: req.params.id });

    try {
        const deleteCategory = await category.delete();
        req.flash('success_msg', 'Category deleted');
        res.redirect('/categories');
    } catch (error) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;