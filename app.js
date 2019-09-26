const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
var cookieParser = require('cookie-parser')

const app = express();

// DB connection
require('dotenv').config();
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log(err);
    console.log('DB connection successfully.');
});

app.use(methodOverride('_method'));

// session
app.use(session({
    secret: 'mysecretkey',
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SET static folder
app.use(express.static(path.join(__dirname, 'public')));

// SET template engine
const { select, generateDate, paginate } = require('./helpers/hbs-helpers');
app.engine('handlebars', exphbs({ defaultLayout: 'main', helpers: { select: select, generateDate: generateDate, paginate: paginate } }));
app.set('view engine', 'handlebars');

// landing page
// app.get('/', (req, res) => res.render('index', { layout: 'landing' }));

// Init Routes
app.use('/', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/categories', require('./routes/categories'));

app.listen(3000, () => { console.log('Server start on port 3000....') });