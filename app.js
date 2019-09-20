const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

// DB connection
require('dotenv').config();
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log(err);
    console.log('DB connection successfully.');
});

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SET static folder
app.use(express.static(path.join(__dirname, 'public')));

// SET template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// landing page
app.get('/', (req, res) => res.render('index', { layout: 'landing' }));

// Init Routes
app.use('/api/patients', require('./routes/patients'));

app.listen(3000, () => { console.log('Server start on port 3000....') });