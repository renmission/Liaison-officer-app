const router = require('express').Router();

router.get('/', (req, res) => {
    res.render('index', { layout: 'landing' });
});


module.exports = router;