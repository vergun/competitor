
/*!
 * Module dependencies.
 */

var async = require('async')

/**
 * Controllers
 */

var users = require('../app/controllers/users')
  , tweets = require('../app/controllers/tweets')
  , auth = require('./middlewares/authorization')

/**
 * Route middlewares
 */

var tweetAuth = [auth.requiresLogin, auth.tweet.hasAuthorization]

/**
 * Expose routes
 */

module.exports = function (app, passport) {
  
  // home route
  app.get('/', tweets.index)

  // user routes
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/:userId/update', users.update)
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/',
      failureFlash: 'Invalid email or password.'
    }), users.session)
  app.get('/users/:userId', users.show)
  app.get('/users/:userId/edit', users.edit)

  app.param('userId', users.user)

  // tweet routes
  app.get('/tweets', tweets.index)
  app.get('/tweets/new', auth.requiresLogin, tweets.new)
  app.post('/tweets', auth.requiresLogin, tweets.create)
  app.get('/tweets/:id', tweets.show)
  app.get('/tweets/:id/edit', tweetAuth, tweets.edit)
  app.put('/tweets/:id', tweetAuth, tweets.update)
  app.del('/tweets/:id', tweetAuth, tweets.destroy)

  app.param('id', tweets.load)
  
  // explore route
  app.get('/activity', users.activity)
  
  // activity route
  app.get('/explore', tweets.explore)
  
  // comment routes
  var comments = require('../app/controllers/comments')
  app.post('/tweets/:id/comments', auth.requiresLogin, comments.create)

  // tag routes
  var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', tags.index)

}
