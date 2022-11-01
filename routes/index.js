const router = require('express').Router();
const Employee = require('../Model/Employee'); 
const mongoose=require('mongoose');
const isAuth = require('../middleware/auth').isAuth;
const bcrypt = require('bcrypt')
const passport = require('passport')

router.get('/' ,(req, res) => {
    res.render('Chat')
});

router.get('/login' ,(req, res) => {
    res.render('Login')
});

router.post("/api/login", (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).send({
                message : 'Invalid email or password'
            })
        }
        req.session.loggedin = true;
        req.session.user = user;
        req.login(user, (err) => {
            res.send({
                email : user.email,
                full_name : user.name,
                role : user.role
            })
        })
    })(req, res, next)
})

router.get('/logout', (req, res, next) => {
    req.session.loggedin = false;
    req.logout();
    res.redirect('/login');
})

router.post('/api/create-employee' , async (req, res) => {
    try{
        const staff = req.body;    
        const salt = bcrypt.genSaltSync(15);
        const hash = bcrypt.hashSync(staff.password, salt);
        staff.password = hash;
        const newStaff= await new Employee(staff);

        const _newStaff = await newStaff.save();

        Employee.find().exec(function (err, items){
            res.send({
                items : items
            })
        });
    
    }catch(e){
        res.send('Error', 500)
    }
})

 

module.exports = router;