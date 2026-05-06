const { getUsers, confirmPasscode, adminAvailabledPasscodes, adminAddPasscode } = require("../config/db/query");

async function indexHomePage(req, res) {
    try {
        const users = await getUsers();
        res.render('index', {users})
    } catch (err) {
        console.error(err) 
        res.status(500).send('Server error!')       
    }
}

function loginSuccess(req, res) {
    if(!req.isAuthenticated()) {
        return res.redirect('/log-in')
    }

    res.render('success', {
        user: req.user,
        posts: [],
    })
}

async function logOut(req, res, next) {
    req.logout((err) => {
        if(err) {
            return next(err)
        }

        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            res.redirect('/')
        })
    });
}

function membershipPage(req, res) {
    res.render('membership', {
        user: req.user,
        error: req.query.error
    })
}

async function applyMembership(req, res) {
    if (!req.isAuthenticated()) {
        return res.redirect('/log-in');
    }
    const { passcode } = req.body;
    const confirm = await confirmPasscode(passcode, req.user.id);
    if(!confirm) {
        return res.redirect('/membership?error=invalid_passcode');
    }
    res.redirect('/protected-route')
}

async function adminPageController(req, res) {
    if(!req.isAuthenticated()) {
        return res.redirect('/log-in');
    }
    if(!req.user.isadmin) {
        return res.redirect('/protected-route')
    }
    try {
        const users = await getUsers();
        const codes = await adminAvailabledPasscodes();
        
        res.render('admin', { user:req.user, users, codes: codes || [] })
    } catch(error) {
        console.error(error);
        res.status(500).send('Server Error!')
    }
}

async function adminAddPasscodes(req, res) {
    if (!req.isAuthenticated() || !req.user.isadmin) {
        return res.redirect('/');
    }
    try {
        const { passcode } = req.body;
        await adminAddPasscode(passcode)
        res.redirect('/admin')
    } catch(err) {
        console.error(err);
        res.status(500).send('Server error!')
    }

}
module.exports = { indexHomePage, loginSuccess, logOut, membershipPage, applyMembership, adminPageController, adminAddPasscodes}