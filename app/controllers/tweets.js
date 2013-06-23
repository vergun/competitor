

// var db = require('./mongoconnection');
// var modules = require('./modules.js');
// var tweets = db.collection('tweets');
// 
// exports.addTweet = function(tweet, keyword, callback) 
// {
//   tweets.findOne({id: tweet.id}, function(e, o) {
//     if (o){
//       callback('tweet already exists');
//     } else {
//       newTweet = tweet;
//       newTweet.keyword = keyword;
//       newTweet.date = modules.moment().format('MMMM Do YYYY, h:mm:ss a');
//       tweets.insert(newTweet, {safe: true}, callback); 
//     }
//   });
// }


/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Tweet = mongoose.model('Tweet')
  , utils = require('../../lib/utils')
  , _ = require('underscore')
  , User = mongoose.model('User')

/**
 * Load
 */

exports.load = function(req, res, next, id){
  var User = mongoose.model('User')

  Tweet.load(id, function (err, tweet) {
    if (err) return next(err)
    if (!tweet) return next(new Error('not found'))
    req.tweet = tweet
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    perPage: perPage,
    page: page
  }

  Tweet.list(options, function(err, tweets) {
    if (err) return res.render('500')
    Tweet.count().exec(function (err, count) {
      res.render('index', {
        title: null,
        tweets: tweets,
        page: page + 1,
        pages: Math.ceil(count / perPage),
        user: new User()
      })
    })
  })
}

/**
 * New tweet
 */

exports.new = function(req, res){
  res.render('tweets/new', {
    title: 'New Tweet',
    tweet: new Tweet({})
  })
}

/**
 * Create a tweet
 */

exports.create = function (req, res) {
  var tweet = new Tweet(req.body)
  tweet.user = req.user
  tweet.save
}

/**
 * Edit a tweet
 */

exports.edit = function (req, res) {
  res.render('tweets/edit', {
    title: 'Edit ' + req.tweet.title,
    tweet: req.tweet
  })
}

/**
 * Update tweet
 */

exports.update = function(req, res){
  var tweet = req.tweet
  tweet = _.extend(tweet, req.body)

  tweet.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/tweets/' + tweet._id)
    }
    
    res.render('tweets/edit', {
      title: 'Edit Tweet',
      tweet: tweet,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('tweets/show', {
    title: req.tweet.title,
    tweet: req.tweet
  })
}

/**
 * Delete a tweet
 */

exports.destroy = function(req, res){
  var tweet = req.tweet
  tweet.remove(function(err){
    req.flash('info', 'Deleted successfully')
    res.redirect('/tweets')
  })
}

/**
 * Explore tweets
 */


exports.explore = function(req, res){
  res.render('tweets/explore', {
    title: "Explore"
  })
}
