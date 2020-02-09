const passport = require('passport');
const User = require('../models/userModel');
const LocalStrategy = require('passport-local').Strategy;

//TODO can't get req.user
//Store User in Session
passport.serializeUser((user, done) => {
    console.log('Serliazed User!', user);
    done(null,  user.id);
    }
);

// Store ID in Session
passport.deserializeUser((id, done) => {
    console.log('Deserialze User!',id);
        User.findById(id).then(user => {
            done(null, user)
        }).catch(error =>{c
            console.log(error);
        });
});

passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email: email}, (err, user) => {
        if (err) return done(err);
        if (user) {
            return done(null, false, {message: 'Email is already in use.'})
        } else {
            const newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            newUser.save(err => {
                    if (err) return done(err);
                    return done(null, newUser);
                }
            );
        }
    });
}));

passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email: email}, (err, user) => {
        if (err) return done(err);
        if (!user) {
            return done(null, false, {message: 'No user found with this e-mail'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password'});

        }
        return done(null, user);
    });
}));