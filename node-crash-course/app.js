const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')
const Blog = require('./models/blog');
const bodyParser = require("body-parser")

//express app 
const app = express();

//conncting mongo db to the app
const dbURI = 'mongodb+srv://balu25:dmQgljPUlZlQthRY@cluster0.6mclupo.mongodb.net/blogapp'
mongoose.connect(dbURI)
    .then((result) => {app.listen(3000)})
    .catch((err) => {console.log(err)})


//register view engine
app.set('view engine', 'ejs');

//listen for requests
//app.listen(3001);

//middleware 
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));

//main page
app.get('/', (req, res) => {
    res.redirect('/blogs')
});

//about page
app.get('/about', (req, res) => {
    res.render('about', {title: 'about'});
});
// blog routes
app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
  });

// create page or blog routes
app.get('/blogs', (req, res) => {
    Blog.find().sort({ceratedAt: -1})
    .then((result) => {
        res.render('index', { title: "All blogs", blogs: result})
    })
    .catch((err) =>{
        console.log(err)
    })
});

// getting new blogs from submit button and saving to DB and rediriecting to homepage
app.post('/blogs', (req, res) =>  {
    const blog = new Blog(req.body)

    blog.save()
    .then((result) => {
        res.redirect('/blogs')
    })
    .catch((err)=> {
        console.log(err)
    })
});

// getting id of the blog pages
app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
    .then(result => {
        res.render('details', {blog: result, title: 'Blog details' })
    })
    .catch(err => {
        console.log(err)
    })
});

//deleteing blogs
app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
    .then(result=> {
        res.json({redirect: '/blogs'})
    })
    .catch((err)=> {
        console.log(err)
    })
});


app.get('/blogs/create', (req, res) => {
    res.render('create', {title: 'create'});
});

// 404 page 
app.use((req, res) => {
    res.status(404).render('404', {title: '404'});
});
