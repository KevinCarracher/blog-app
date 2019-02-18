var express = require("express");
var app = express();
var bodyParser = require("body-parser");
methodOverride = require("method-override");
expressSanitizer = require("express-sanitizer");
mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var port = 3000;

app.listen(port, function(){
    console.log("BlogApp is running!");
});

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default:Date.now}
});

var blog = mongoose.model("blog", blogSchema);

// blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "Hello this is a blog post!"
// });

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res){
    blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

app.get("/blogs/:id/edit", function(req, res){
    blog.findById(req.params.id, function(err, foundEdit){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundEdit});
        }
    });
});

app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req, res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.render("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});