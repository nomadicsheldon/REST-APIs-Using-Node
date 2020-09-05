// jshint esversion:6

const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// ############################## setting up frameworks ##############################
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//######################## mongoose setup with dbName ########################
// connection URL
const url = "mongodb://localhost:27017";

// Database Name
const dbName = 'wikiDB';

// mongoose.connect("mongodb://localhost:27017/fruitsDB");
mongoose.connect(url + "/" + dbName, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
};

// mongoose will pluralise this 'Article' in the DB.
const Article = mongoose.model('Article', articleSchema);

//------------------------👉 REST (Representable State Transfer) 👈------------------------

//######################## Get, Post, delete route ########################
// handling all articles
app.route('/articles')
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err, result) {
      if (!err) {
        res.send('Successfully saved');
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send('Successfully deleted articles');
      } else {
        res.send(err);
      }
    });
  });

// NOTE: post will not be used for replacing specific article, for this purpose PUT and PATCH is
// available, follow the tradition.

//######################## Get, Put, Post, delete for specific element using route ########################
app.route('/articles/:articleTitle')

  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (!err) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send('No articles found');
        }
      } else {
        res.send(err);
      }
    });
  })

  // put will replace this article with brand new article
  .put(function(req, res) {
    Article.updateOne({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, function(err) {
      if (!err) {
        res.send('Successfully updated article');
      } else {
        res.send(err);
      }
    });
  })

  // patch will replace only element of article which you want to replace
  .patch(function(req, res) {
    Article.updateOne({
      title: req.params.articleTitle
    }, {
      $set: req.body
    }, function(err) {
      if (!err) {
        res.send('Successfully updated article');
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.articleTitle
    }, function(err) {
      if (!err) {
        res.send('Successfully deleted article.');
      } else {
        res.send(err);
      }
    });
  });

// ############################## port setting ##############################
app.listen(3000, function() {
  console.log('Listening for wiki API started on port 3000');
});
