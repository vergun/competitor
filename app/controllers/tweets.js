/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Tweet = mongoose.model('Tweet')
  , utils = require('../../lib/utils')
  , _ = require('underscore')
  , User = mongoose.model('User')
  , moment = require('moment')

/**
 * Load
 */

exports.load = function(req, res, next, id){
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
  if (req.isAuthenticated()) {
    var user = req.user
    Tweet.find({}, function(err, tws) {
      if (err) return err
      if (!err) {
        

        // _(tws).each(function(tw) { var d = tw.created_at.toString(); console.log(moment().format(d)) })
          
        var arrayOfTweetsSource = _.map(_(tws).countBy('source'), function (value, key) { return [key, value] });
        var arrayOfTweetsLanguage = _.map(_(tws).countBy('lang'), function (value, key) { return [key, value] });
        
        res.render('index', {
          tweets: tws,
          lang: _.sortBy(arrayOfTweetsLanguage, function (t) { return t[1] }).reverse(),
          source: _.sortBy(arrayOfTweetsSource, function (t) { return t[1] }).reverse(),
          recent: _.sortBy(tws, 'id').reverse(),
          user: user
        })
      }
    })
  } else {
    res.render('index', {
      user: new User()
    })
  }
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
  var user = req.user
  res.render('tweets/explore', {
    title: "Explore",
    user: user
  })
  

 
}
