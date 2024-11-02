// Get the sign-up form
exports.new = (req, res) => {
    res.render('new');
};

// Create a new user
exports.signup = (req, res, next) => {
    let user = new User(req.body);
    user.save()
        .then(() => res.redirect('/login'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/new');
            }
            if (err.code === 11000) {
                req.flash('error', 'Email address has been used');
                return res.redirect('/new');
            }
            next(err);
        });
};

// Get the login form
exports.loginForm = (req, res) => {
    res.render('login');
};

// Process login request
exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    // Get the user that matches the email
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                // User found in the db
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id; // Store user's id in the session
                            req.flash('success', 'You have successfully logged in');
                            res.redirect('/profile');
                        } else {
                            req.flash('error', 'Wrong password');
                            res.redirect('/login');
                        }
                    });
            } else {
                req.flash('error', 'Wrong email address');
                res.redirect('/login');
            }
        })
        .catch(err => next(err));
};

// Get user profile
exports.profile = (req, res, next) => {
    let id = req.session.user;
    User.findById(id)
        .then(user => res.render('profile', { user }))
        .catch(err => next(err));
};

// Handle logout
exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) return next(err);
        else res.redirect('/');
    });
};