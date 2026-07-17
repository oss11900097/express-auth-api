const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();//initialise express app

//global middlewares
app.use(cors()); //handles all the cors headers
app.use(express.json()); //parses incoming JSON bodies

//test route to make sure app is alive
app.get('/health', (req, res) =>{
    res.status(200).json({status: 'success', message: 'API is running'})
});

/* we will import and attach our routes here*/
app.use('/api', authRoutes); //attaching auth routes to /api prefix
app.use('/api/users', userRoutes); //attaching user routes to /api/users

//front end connection
app.use(express.static(path.join(__dirname, '../frontend')));

//when someone visits '/' - give your root HTML file:
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/register.html'));
})

module.exports = app; // making this app.js importable and used in other files.
