/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('../../lib/utils')
  , _ = require('underscore')
  
  
/**
 * Show activity page
 */

exports.activity = function(req, res){
  var user = req.profile
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
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err) {
    if (err) {
      return res.render('/', {
        errors: utils.errors(err.errors),
        user: user,
        title: 'Sign up'
      })
    }

    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) return next(err)
      // get tweets (before login? if new)
      
      return res.redirect('/')
    })
  })
}

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile
  res.render('users/show', {
    title: user.name,
    user: user
  })
}

/**
 *  Edit profile
 */

exports.edit = function (req, res) {
  var user = req.profile
  res.render('users/edit', {
    title: "Edit " + user.name,
    user: user
  })
}

/**
 *  Update profile
 */

exports.update = function(req, res){
  var user = req.user
    , user = _.extend(user, req.body)
  user.save(function (err, cb) {
    if (!err) {
      res.render('users/show', {
        title: user.name,
        message: 'User was successfully updated.',
        user: user
      })
    }
    if (err) {
      res.render('users/edit', {
        title: 'Edit ' + req.user.username,
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
