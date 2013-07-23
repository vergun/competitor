
#
# *  Generic require login routing middleware
# 
exports.requiresLogin = (req, res, next) ->
  return res.redirect("/login")  unless req.isAuthenticated()
  next()


#
# *  User authorization routing middleware
# 
exports.user = hasAuthorization: (req, res, next) ->
  unless req.profile.id is req.user.id
    req.flash "info", "You are not authorized"
    return res.redirect("/users/" + req.profile.id)
  next()


#
# *  Article authorization routing middleware
# 
exports.tweet = hasAuthorization: (req, res, next) ->
  unless req.tweet.user.id is req.user.id
    req.flash "info", "You are not authorized"
    return res.redirect("/tweets/" + req.tweet.id)
  next()