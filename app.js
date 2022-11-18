// Express
const express = require("express");
const app = express();

// Modules
require("dotenv").config();
const ejs = require("ejs");
const _ = require('lodash');
var fs = require('fs');
var path = require('path');
require('dotenv/config');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

// Connect To Mongoose
const mongoose = require("mongoose");
const internal = require("stream");
mongoose.connect('mongodb+srv://mrigank:mrigank123@cluster0.fiqfiwg.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// EXPRESS SPECIFIC STUFF
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/img", express.static(__dirname + "public/img"));
app.set("views", "./views");
app.use(bodyParser.json());
app.set("view engine", "ejs");

// Database
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Database is connected");

    //Post Schema
    const postSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        min: {
            type: Number,
            required: true
        },
        author: {
            type: String,
            required: true
        },
        img:
        {
            data: Buffer,
            contentType: String
        }

    });
    const Post = mongoose.model("Post", postSchema);

    //Contact Schema
    const contactSchema = new mongoose.Schema({
        name: String,
        email: String,
        phone_Number: String,
        message: String
    });
    const Contact = mongoose.model('Contact', contactSchema);

    // Home Page
    app.get("/", (req, res) => {
        Post.find(function (err, posts) {
            res.render("home", {
                posts: posts,
                _: _
            });
        });
    });

    // Contact Page
    app.get("/contact", (req, res) => {
        res.render("contact");
    });

    // Latest Page
    app.get("/latest", (req, res) => {
        Post.find(function (err, posts) {
            res.render("latest", {
                posts: posts,
                _: _
            });
        });
    });

    // your_blogs Page
    app.get("/your_blogs", (req, res) => {
        Post.find(function (err, posts) {
            res.render("your_blogs", {
                posts: posts,
                _: _
            });
        });
    });

    // w_blog Page
    app.get("/w_blog", (req, res) => {
        res.render("w_blog");
    });

    // SignUp Page
    app.get("/signup", (req, res) => {
        res.render("signup");
    });

    // login Page
    app.get("/login", (req, res) => {
        res.render("login");
    });

    //set up multer for storing uploaded files
    var multer = require('multer');

    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads')
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + Date.now())
        }
    });
    var upload = multer({ storage: storage });

    // Publish Post
    app.post("/w_blog", upload.single('image'), (req, res, next) => {
        const post = new Post({
            title: req.body.postTitle,
            content: req.body.postContent,
            date: req.body.postDate,
            min: req.body.postMin,
            author: req.body.postAuthor,
            img: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: 'image/png'
            }
        });

        post.save(function (err) {
            if (!err) {
                res.redirect("/latest");
            }
        });
    });

    // Get Contacts
    app.post("/contact", (req, res) => {
        const contact = new Contact(req.body);

        contact.save(function (err) {
            if (!err) {
                res.redirect("/");
            }
        });
    });

    // Routing Of Posts
    app.get("/posts/:postId", function (req, res) {
        const requestedPostId = req.params.postId;

        Post.findOne({ _id: requestedPostId }, function (err, post) {
            res.render("post", {
                title: post.title,
                content: post.content,
                date: post.date,
                min: post.min,
                author: post.author,
                img: post.img
            });
        });
    });
    // e_blog Pages
    app.get("/e_blog/:postId", function (req, res) {
        const requestedPostId = req.params.postId;

        Post.findOne({ _id: requestedPostId }, function (err, post) {
            res.render("e_blog", {
                title: post.title,
                content: post.content,
                date: post.date,
                min: post.min,
                author: post.author,
                img: post.img
            });
        });

    });
    // detele Pages
    app.get("/delete/:postId", function (req, res) {
        const requestedPostId = req.params.postId;

        Post.deleteOne({ _id: requestedPostId }, function (err, posts) {
            res.render("your_blogs", {
                posts: posts,
                _: _
            });
        })
        Post.deleteOne({ _id: requestedPostId });
        res.redirect("/your_blogs");
    });

});

// Listen on port
let port = process.env.PORT;
if (port == null || port == "") {
    port = 5000;
}
app.listen(port, () => {
    console.log(`The application started successfully at http://localhost:${port}`);
});
