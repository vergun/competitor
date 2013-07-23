###
Module dependencies.
###
express = require("express")
mongoStore = require("connect-mongo")(express)
flash = require("connect-flash")
helpers = require("view-helpers")
pkg = require("../package.json")
module.exports = (app, config, passport) ->
  app.set "showStackError", true
  
  # should be placed before express.static
  app.use express.compress(
    filter: (req, res) ->
      /json|text|javascript|css/.test res.getHeader("Content-Type")

    level: 9
  )
  app.use express.favicon()
  app.use express.static(config.root + "/app/assets")
  
  # don't use logger for test env
  app.use express.logger("dev")  if process.env.NODE_ENV isnt "test"
  
  # set views path, template engine and default layout
  app.set "views", config.root + "/app/assets/html"
  app.set "view engine", "jade"
  app.configure ->
    
    # expose package.json to views
    app.use (req, res, next) ->
      res.locals.pkg = pkg
      next()

    # cookieParser should be above session
    app.use express.cookieParser()
    
    # bodyParser should be above methodOverride
    app.use express.bodyParser()
    app.use express.methodOverride()
    
    # express/mongo session storage
    app.use express.session(
      secret: "competition_tracker"
      store: new mongoStore(
        url: config.db
        collection: "sessions"
      )
    )
    
    # use passport session
    app.use passport.initialize()
    app.use passport.session()
    
    # connect flash for flash messages - should be declared after sessions
    app.use flash()
    
    # should be declared after session and flash
    app.use helpers(pkg.name)
    
    # adds CSRF support
    app.use express.csrf()  if process.env.NODE_ENV isnt "test"
    
    # This could be moved to view-helpers :-)
    app.use (req, res, next) ->
      res.locals.csrf_token = req.session._csrf
      next()
    
    # routes should be at the last
    app.use app.router
    
    # assume "not found" in the error msgs
    # is a 404. this is somewhat silly, but
    # valid, you can do whatever you like, set
    # properties, use instanceof etc.
    app.use (err, req, res, next) ->
      
      # treat as 404
      return next() if err.message and (~err.message.indexOf("not found") or (~err.message.indexOf("Cast to ObjectId failed")))
      
      # log it
      # send emails if you want
      console.error err.stack
      
      # error page
      res.status(500).render "500",
        error: err.stack

    # assume 404 since no middleware responded
    app.use (req, res, next) ->
      res.status(404).render "404",
        url: req.originalUrl
        error: "Not found"

  # development env config
  app.configure "development", ->
    app.locals.pretty = true
