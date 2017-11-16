const User = require('../models/user');

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
       

    return router;
}