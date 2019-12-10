const passport = require('passport');
const User = require('../models/userModel');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//Store User in Session
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Store ID in Session
passport.deserializeUser((id, done) => {
    User.findById({
        id, function(err, user) {
            done(err, user);
        }
    })
});

passport.use('local.register', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) =>{

   await User.findOne({email: email}, function (err, user) {
        if (err) return done(err);
        if (user) {
            return done(null, false, {message: 'Email is already in use'})
        }else {
            const newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            newUser.save(function (err, result) {
                if (err) return done(err);
                return done(null, newUser);
            });
        }
    });
}));



//  function initialize(passport, getUserByEmail) {
//     const authenticateUser = async (email, password, done) => {
//         const user = getUserByEmail(email);
//         if (user == null) return done(null, false, {message: 'No User with that email'});
//         console.log('user :',user);
//         console.log('user password:',user.password);
//         try {
//             if (await bcrypt.compare(password, user.password)) {
//                 return done(null, user)
//             } else return done(null, false, {message: 'Password incorrect'});
//
//         } catch (err) {
//             return done(err)
//         }
//     };
//     passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
//     passport.serializeUser((user, done) => {
//     });
//     passport.deserializeUser((id, done) => {
//     });
// }
