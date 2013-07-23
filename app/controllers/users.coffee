###
Module dependencies.
###
mongoose = require("mongoose")
User = mongoose.model("User")
utils = require("../../vendor/lib/utils")
_ = require("underscore")
fs = require("fs")
env = process.env.NODE_ENV or "development"
config = require("../../config/config")[env]
twitter = require("ntwitter")
twit = new twitter(config.twitter)
tweets = require("../modules/tweets_helper")
mixpanel = require("../modules/mixpanel")

###
Show activity page
###
exports.activity = (req, res) ->
  user = req.user
  res.render "users/activity",
    title: "Activity"
    user: user


exports.signin = (req, res) ->

###
Auth callback
###
exports.authCallback = (req, res, next) ->
  res.redirect "/"

###
Show login form
###
exports.login = (req, res) ->
  res.redirect "/"

###
Show sign up form
###
exports.signup = (req, res) ->
  res.redirect "/"

###
Logout
###
exports.logout = (req, res) ->
  req.logout()
  res.redirect "/"

###
Session
###
exports.session = (req, res) ->
  res.redirect "/"

###
Create user
###
exports.create = (req, res) ->
  user = new User(req.body)
  user.save (err, data) ->
    
    # pass errors in // todo // 
    return res.redirect("/")  if err
    unless err
      mixpanel.setMixpanelUserData data
      mixpanel.track "User created"
    tweets.search twit, user.keywords, user, req.logIn(user, (err) ->
      fs.appendFile "../../lang.txt", err  if err #todo remove
      res.redirect "/"
    )

###
Show profile
###
exports.show = (req, res) ->
  user = req.profile
  res.render "users/show",
    title: user.first_name
    user: user


###
Edit profile
###
exports.edit = (req, res) ->
  user = req.profile
  res.render "users/edit",
    title: "Edit " + user.first_name
    user: user


###
Update profile
###
exports.update = (req, res) ->
  user = req.user
  user = _.extend(user, req.body)
  user.save (err, data, cb) ->
    unless err
      res.render "users/show",
        title: user.first_name
        message: "User was successfully updated."
        user: user

      mixpanel.setMixpanelUserData data
      mixpanel.track "User updated"
    if err
      res.render "users/edit",
        title: "Edit " + req.user.first_name
        user: req.user
        errors: err


exports.user = (req, res, next, id) ->
  User.findOne(_id: id).exec (err, user) ->
    return next(err)  if err
    return next(new Error("Failed to load User " + id))  unless user
    req.profile = user
    next()
