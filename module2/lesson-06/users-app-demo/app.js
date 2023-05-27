// display all users, signup users and display a single user based on username
const port = 3002;
const express = require('express');
const app = express();
const mongoose = require('mongoose'); // import mongoose
const User = require('./models/User.model');// import the 'User' model

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

mongoose.connect('mongodb://localhost:27017/signup-demo')
.then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
.catch(err => console.log(err))

app.get('/', (req,res) => {
    res.render('index')
})

// Display the signup form
app.get('/signup', (req, res) => {
    res.render('signup')
})

// Creating the user
app.post('/signup', (req, res)=>{
    console.log('req.body', req.body)
    // Create a User in our DB
    User.create(req.body)
    .then( newUser => {
        console.log('newUser', newUser)
        res.redirect('/')  // Send the user to the Homepage
    })
    .catch(err => console.log(err))
})

app.get('/users', (req, res) => {
    // Send the users in my Db to the front end
    User.find()
    .then(allUsers => {
        console.log('allUsers', allUsers);
        res.render('users', { allUsers });
        // const updateUsers = allUsers.map(user => {
        //     return {username: `Mr ${user.username}`}
        // })
        // res.render('users', { allUsers: updateUsers });
    })
    .catch(err => console.log(err))
    
})

app.get('/profile/:username', (req, res) => {
    console.log('req.params', req.params)
    User.findOne({username: req.params.username})
    .then(foundUser => {
        res.render('profile', { foundUser })
    })
    .catch(err => console.log(err))
    
})

app.listen(port, () => console.log(`App is listening on port ${port}`))