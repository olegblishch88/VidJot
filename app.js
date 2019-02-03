const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();

//Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/database');

//Mongoose connect
mongoose.Promise = global.Promise;
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('MongoDb connected...'))
    .catch(err => console.log(err));

//Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Method override middleware
app.use(methodOverride('_method'));

//Session middleware
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect-flash middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('succes_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.get('/', (req, res) => { res.render('index') });
app.get('/about', (req, res) => res.render('about'));

app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 5000

app.listen(port, () => {console.log(`Server listening on port ${port}`)});