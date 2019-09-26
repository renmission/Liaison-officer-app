const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

const passport = require('passport');


const app = express();

// DB connection
require('dotenv').config();
mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) return console.log(err);
    console.log('DB connection successfully.');
});


app.use(methodOverride('_method'));

// session
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());

// SET static folder
app.use(express.static(path.join(__dirname, 'public')));

// SET template engine
const { select, generateDate, paginate } = require('./helpers/hbs-helpers');
app.engine('handlebars', exphbs({ defaultLayout: 'main', helpers: { select: select, generateDate: generateDate, paginate: paginate } }));
app.set('view engine', 'handlebars');

// Init Routes
app.use('/', require('./routes/auth'));
app.use('/patients', require('./routes/patients'));
app.use('/categories', require('./routes/categories'));

const port = process.env.PORT || 3000;

app.listen(port, () => { console.log(`Server start on port ${port}....`) });