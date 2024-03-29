// Generated by CoffeeScript 1.6.3
(function() {
  exports.requiresLogin = function(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    }
    return next();
  };

  exports.user = {
    hasAuthorization: function(req, res, next) {
      if (req.profile.id !== req.user.id) {
        req.flash("info", "You are not authorized");
        return res.redirect("/users/" + req.profile.id);
      }
      return next();
    }
  };

  exports.tweet = {
    hasAuthorization: function(req, res, next) {
      if (req.tweet.user.id !== req.user.id) {
        req.flash("info", "You are not authorized");
        return res.redirect("/tweets/" + req.tweet.id);
      }
      return next();
    }
  };

}).call(this);
