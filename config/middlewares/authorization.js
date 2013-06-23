
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  next()
}

/*
 *  User authorization routing middleware
 */

exports.user = {
  hasAuthorization : function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/users/'+req.profile.id)
    }
    next()
  }
}

/*
 *  Article authorization routing middleware
 */

exports.tweet = {
  hasAuthorization : function (req, res, next) {
    if (req.tweet.user.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.redirect('/tweets/'+req.tweet.id)
    }
    next()
  }
}
