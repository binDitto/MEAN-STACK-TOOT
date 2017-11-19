const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');

// Allows front end server to talk to cross origin back end server
const cors = require('cors');

// DB CONNECTION
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Could NOT connect to database: ', err);
    } else {
        // console.log(config.secret);
        console.log('Connected to database: ' + config.db + ' | ' + config.uri);
    }
});

// Setting specific cross origin link instead of general links for safety
app.use(cors({
    origin: 'http://localhost:4200'
}));

// Parse front-end html/text into readable backend json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Front-end static directory
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);

// Connect backend server to Angular 2 Index.html
app.get('*', (req, res) => {
    // res.send('hello world!');
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// Start Server
app.listen(8080, () => {
    console.log('Listening on port 8080');
});