const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/register', (req, res) => {
        // req.body.email;
        // req.body.username;
        // req.body.password;
        if (!req.body.email) {
            console.log(req.body);
            console.log('You must provide an email');
            return res.json({ success: false, msg: 'You must provide an email'});
        }

        if (!req.body.username) {
            console.log(req.body);
            console.log('You must provide a username');
            return res.json({success: false, msg: 'You must provide a username'});
        }

        if (!req.body.password) {
            console.log(req.body);
            console.log('You must provide a password');
            return res.json({success: false, msg: 'You must provide a password'});
        }

        
        let user = new User ({
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password
        });
        
        user.save((err) => {
            if (err) {
                if(err.code === 11000) {
                    console.log('Error: Username or email already exists!');
                    res.json({ success: false, message: 'Username or email already exists'});
                } else {
                    if(err.errors){
                        if (err.errors.email) {
                            console.log(err.errors.email.message);
                            res.json({ success: false, message: err.errors.email.message });
                        } else if (err.errors.username){
                            console.log(err.errors.username.message)
                            res.json({ success: false, message: err.errors.username.message});
                        } else if (err.errors.password){
                            console.log(err.errors.password.message);
                            res.json({success: false, message: err.errors.password.message});
                        } else {
                            res.json({success: false, message: err});
                        }
                    } else {
                        console.log('Error: Cannot save user: ' + err.errmsg);
                        res.json({ success: false, message: 'Could not save user. Error: ', err });
                    }
                }
                
            } else {
                console.log('Success');
                res.json({ success: true, message: 'Account Regisetered.' });
            }            
        });

        console.log(req.body);

        // res.json({
        //     success: true,
        //     msg: 'Successfully created an account'

        // });
        // res.send('hello world');

    });

    router.get('/checkEmail/:email', (req, res) => {
        if (!req.params.email) {
            res.json({success: false, message: 'E-mail was not provided'});
        } else {
            User.findOne({email: req.params.email}, ( err, user ) => {
                if ( err) {
                    res.json({success: false, message: err});
                } else if (user) {
                    res.json({ success: false, message: 'E-mails is already taken'});
                } else {
                    res.json({ success: true, message: 'E-mail is available' });
                }
            });
        }
    });

    // Check if exists in db already
    router.get('/checkUsername/:username', (req, res) => {
        if (!req.params.username) {
            res.json({success: false, message: 'Username was not provided'});
        } else {
            User.findOne({username: req.params.username}, ( err, user ) => {
                if ( err) {
                    res.json({success: false, message: err});
                } else if (user) {
                    res.json({ success: false, message: 'Username is already taken'});
                } else {
                    res.json({ success: true, message: 'Username is available' });
                }
            });
        }
    });
       
    router.post('/login', (req, res) => {
        // res.send('test');
        if (!req.body.username) {
            res.json({ success: false, message: 'No username was provided'});
        } else if (!req.body.password) {
            res.json({ success: false, message: 'No password was provided.' });
        } else {
            // res.json('test');
            User.findOne({ username: req.body.username.toLowerCase() }, ( err, user ) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else if (!user) {
                    res.json({ success: false, message: 'Username or Password does not exist.' });
                } else {
                    const validPassword = user.comparePassword(req.body.password);
                    if (!validPassword) {
                        res.json({ success: false, message: 'Password or Username does not exist.'});
                    } else {
                        // CREATE WEB TOKEN FOR USER TO USE - will logout after 24hrs
                        const token = jwt.sign({userId: user._id}, config.secret, { expiresIn: '24h' });
                        // specify what data is retrieved from back end user: { username: user.username }
                        res.json({ success: true, message: 'Success', token: token, user: { username: user.username}});
                    }
                }
            });
        }
    });

    // middleware to receive headers and tokens
    router.use((req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            res.json({ success: false, message: 'No token provided'});
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({ success: false, message: 'Token invalid: ' + err});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    });

    router.get('/profile', (req, res) => {
        // res.send('test');
        // res.send(req.decoded);
        User.findOne({ _id: req.decoded.userId }).select('username email').exec((err, user) => {
            if (err) { return res.json({ success: false, messages: err}); }
            if (!user) { return res.json({ success: false, message: 'User not found'}); }

            return res.json({success: true, user: user });
        });
    });
    return router;
}