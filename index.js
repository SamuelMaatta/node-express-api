const express = require('express')
const passport = require('passport')
const basicStrategy = require('passport-http').BasicStrategy
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')
const postings = require('./routes/postings')
const app = express()
//const port = 3000
const { v4: uuidv4 } = require('uuid')

app.use(bodyParser.json());
app.use('/postings', postings)

const users =[];

passport.use(new basicStrategy(
    function(username, password, done) {
        let user = users.find(user => (user.username === username) && (bcrypt.compareSync(password, user.password)));
        if(user != undefined) {
            done(null, user);
        } else {
            done(null, false);
        }
    }
));

/*
app.use((req, res, next) => {
    console.log('Middleware aktiivinen');
    next();
})

function mvTest(req, res, next) {
    console.log("mvTest aktiivinen");
    next();
}
*/

app.get('/', (req, res) => {
    res.send('Hello World!')
})

/*
{
    username: "johndoe"
    password: "johnspassword"
    email: "john@doe.com"
}
*/
app.post('/users', (req, res) => {

    const salt = bcrypt.genSaltSync(6);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    console.log(hashedPassword);

    const user = {
        id: uuidv4(),
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email
    }
    users.push(user);
    res.sendStatus(201);
})
/*
app.get('/httpBasicSecured', passport.authenticate('basic', { session: false }), (req, res) => {
    console.log('Tähän reittiin ei pääse käsiksi ilman HTTP Basic autentikointia')
    console.log('Passport toteuttaa autentikoinnin ennen tätä reittikäsittelijää')
    res.send("Hello Secure World");
})
*/

const secrets = require('./secrets.json');

const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
let jwtValidationOptions = {}
jwtValidationOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtValidationOptions.secretOrKey = secrets.jwtSignKey;

passport.use(new JwtStrategy(jwtValidationOptions, function(jwt_payload, done) {
    const user = users.find(u => u.id === jwt_payload.userID)
    done(null, {});
}));

app.post('/login', passport.authenticate('basic', { session: false }), (req, res) => {
    
    console.log(req)
    // JWT generointi
    const payloadData =  {
        foo:'bar',
        hops: 'pops',
        userID: req.user.id 
    }

    const options = {
        expiresIn: '1d'
    }

    const token = jwt.sign(payloadData, secrets.jwtSignKey, options);
    // tokenin lähetys vastausviestissä
    res.json({ token: token })
})

app.get('/jwtSecured', passport.authenticate('jwt', {session: false}), (req, res) => {
    // tähän ei pääse käsiksi kuin lähettämällä pyynnön mukana JWT
    res.json({ status: "OK, toimii" , user: req.user.id })
})

app.set('port', (process.env.PORT || 80));

/*
app.post('/upload', upload.single('image'), function (req, res, next) {
    console.log(req.file);
    console.log(req.body);

    res.sendStatus(200);
})
*/
app.listen(port, () => {
    console.log('API listening on port ' + port)
})