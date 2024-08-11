const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const adminLayout = '../views/layouts/admin';
const jwtSecret = 'SecretBlog';

//Check Login
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userID = decoded.userID;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}

module.exports = authMiddleware;



//Get
//Admin - log in page

router.get('/admin', async (req, res) => {
    try{
        const locals = {
            title: "Admin",
            description: "blog blog blog"
        };
        
        res.render('admin/index', {locals, layout: adminLayout});
    } catch (error){
        console.log(error);
    }
});

//POST
//Admin - check login

router.post('/admin', async (req, res) => {
    try{
        const{username, password} = req.body;
        
        const user = await User.findOne({username});

        if(!user){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const token = jwt.sign({ userID: user._id}, jwtSecret);
        res.cookie('token', token, { httpOnly: true});
        res.redirect('/dashboard');

        
    } catch (error){
        console.log(error);
    }
});

//GET
//Admin - dashboard

router.get('/dashboard', authMiddleware, async (req, res) => {

    try{
        const locals = {
            title: "Dashboard",
            description: "blog blog blog"
        };
        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });
        
    }catch (error){
        console.log(error);
    }

    
});  

//GET
//Admin - create new post

router.get('/add-post', authMiddleware, async (req, res) => {

    try{
        const locals = {
            title: "Add Post",
            description: "blog blog blog"
        }
        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout
        });
        
    }catch (error){
        console.log(error);
    }

    
});

//POST
//Admin - create new post

router.post('/add-post', authMiddleware, async (req, res) => {

    try{
        try{
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body
            });

            await Post.create(newPost);
            res.redirect('/dashboard');
        }catch (error){
            console.log(error);
        }
        
    }catch (error){
        console.log(error);
    }

    
});
//GET
//Admin - edit post

router.get('/edit-post/:id', authMiddleware, async (req, res) => {

    try{
        const locals = {
            title: "Add Post",
            description: "blog blog blog",
        }

        const data = await Post.findOne({_id: req.params.id});

        res.render('admin/edit-post',{
            locals,
            data,
            layout: adminLayout
        });
        
    }catch (error){
        console.log(error);
    }

    
});

//PUT
//Admin - edit post

router.put('/edit-post/:id', authMiddleware, async (req, res) => {

    try{
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);
        
    }catch (error){
        console.log(error);
    }

    
});

// router.post('/admin', async (req, res) => {
//     try{
//         const{username, password} = req.body;
        
//         if(req.body.username === 'admin' && req.body.password === 'password'){
//             res.send('You are logged in.')
//         }else{
//             res.send('Wrong username or password');
//         }
//     } catch (error){
//         console.log(error);
//     }
// });

//POST
//Admin - Register

router.post('/register', async (req, res) => {
    try{
        const{username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try{
            const user = await User.create({username, password:hashedPassword});
            res.status(201).json({message: 'User Created', user});
        }catch (error){
            if(error.code === 11000){
                req.status(409).json({message: 'User already in use'});
            }
            res.status(500).json({message: 'Internal server error'});
        }
        
    } catch (error){
        console.log(error);
    }
});
module.exports = router;