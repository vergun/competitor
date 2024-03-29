
#!
# * Module dependencies.
# 
async = require("async")

###
Controllers
###
users = require("../app/controllers/users")
tweets = require("../app/controllers/tweets")
auth = require("./middlewares/authorization")

###
Route middlewares
###
tweetAuth = [auth.requiresLogin, auth.tweet.hasAuthorization]

###
Expose routes
###
module.exports = (app, passport) ->
  
  # home route
  app.get "/", tweets.index
  
  # user routes
  app.get "/login", users.login
  app.get "/signup", users.signup
  app.get "/logout", users.logout
  app.post "/users", users.create
  app.post "/users/:userId/update", users.update
  app.post "/users/session", passport.authenticate("local",
    failureRedirect: "/"
    failureFlash: "Invalid email or password."
  ), users.session
  app.get "/users/:userId", users.show
  app.get "/users/:userId/edit", users.edit
  app.param "userId", users.user
  
  # tweet routes
  app.get "/tweets", tweetAuth, tweets.index
  app.get "/tweets/new", auth.requiresLogin, tweets.new
  app.post "/tweets", auth.requiresLogin, tweets.create
  app.get "/tweets/chart/:chart", auth.requiresLogin, tweets.chart
  app.get "/tweets/:id", tweetAuth, tweets.show
  app.get "/tweets/:id/edit", tweetAuth, tweets.edit
  app.put "/tweets/:id", tweetAuth, tweets.update
  app.del "/tweets/:id", tweetAuth, tweets.destroy
  app.param "id", tweets.load
  app.param "chart", tweets.getChartData
  
  # activity route
  app.get "/activity", auth.requiresLogin, users.activity
  
  # explore route
  app.get "/explore", auth.requiresLogin, tweets.explore
  
  #
  app.get "*", (req, res) -> # not functional
    res.render "404",
      title: "Page Not Found"

