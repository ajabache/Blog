const express = require('express');
const router = express.Router();
const Post = require('../models/Post')

//Get
//Home
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "Blog",
            description: "blog blog blog"
        };

        let perPage = 3;
        let page = parseInt(req.query.page) || 1;

        const data = await Post.aggregate([
            { $sort: { createdAt: -1 } },
            { $skip: (perPage * (page - 1)) },
            { $limit: perPage }
        ]);

        const count = await Post.countDocuments();
        const nextPage = page + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});


/*router.get('', async (req, res) => {
    const locals = {
        title: "Blog",
        description: "blog blog blog"
    }

    try{
        const data = await Post.find();
        res.render('index', {locals, data});
    } catch (error){
        console.log(error);
    }
});*/

//Get
//Post :id
router.get('/post/:id', async (req, res) => {
    try{
        let slug = req.params.id;

        const locals = {
            title: "blog",
            description: "blog blog blog"
        }

        const data = await Post.findById({ _id: slug});
        res.render('post', {locals, data});
    } catch (error){
        console.log(error);
    }
});





router.get('/about', (req, res) => {
    res.render('about');
})

router.get('/contact', (req, res) => {
    res.render('contact');
})

module.exports = router;