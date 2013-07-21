/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('../../lib/utils')
  , _ = require('underscore')
  , fs = require('fs')
  , env = process.env.NODE_ENV || 'development'  
  , config = require('../../config/config')[env]
  , twitter = require('ntwitter')
  , twit = new twitter(config.twitter)
  , tweets = require('../modules/tweets_helper')
  , mixpanel = require('../modules/mixpanel')
  
/**
 * Show activity page
 */

exports.activity = function(req, res){
  var user = req.user
  res.render('users/activity', {
    title: "Activity",
    user: user
  })
}


exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

/**
 * Show login form
 */

exports.login = function (req, res) {
  res.redirect('/')
}

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.redirect('/')
}

/**
 * Logout
 */

exports.logout =  function (req, res) {
  req.logout()
  res.redirect('/')
}

/**
 * Session
 */

exports.session = function (req, res) {
  res.redirect('/')
}

/**
 * Create user
 */

exports.create = function (req, res) {
      
  var user = new User(req.body);
  user.save(function (err, data) {
    if (err) { 
      // pass errors in // todo // 
      return res.redirect('/')
    }
    if (!err) {
      mixpanel.setMixpanelUserData(data);
      mixpanel.track("User created");
    }
    tweets.search(twit, user.keywords, user, req.logIn(user, function(err) {
        if (err) fs.appendFile('../../lang.txt', err); //todo remove
          return res.redirect('/')
      })
    );
  })
}

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
    title: user.first_name,
    user: user
  })
}

/**
 *  Edit profile
 */

exports.edit = function (req, res) {
  var user = req.profile
  res.render('users/edit', {
    title: "Edit " + user.first_name,
    user: user
  })
}

/**
 *  Update profile
 */

exports.update = function(req, res){
  var user = req.user
    , user = _.extend(user, req.body)
  user.save(function (err, data, cb) {
    if (!err) {
      res.render('users/show', {
        title: user.first_name,
        message: 'User was successfully updated.',
        user: user
      })
      mixpanel.setMixpanelUserData(data);
      mixpanel.track("User updated");
    }
    if (err) {
      res.render('users/edit', {
        title: 'Edit ' + req.user.first_name,
        user: req.user,
        errors: err
      })
    } 
  })
}

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}
