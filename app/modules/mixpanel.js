// Generated by CoffeeScript 1.6.3
(function() {
  var Mixpanel, config, env, mixpanel;

  env = process.env.NODE_ENV || "development";

  config = require("../../config/config")[env];

  Mixpanel = require("mixpanel");

  mixpanel = Mixpanel.init(config.mixpanel.id);

  exports.track = function(data, properties) {
    return mixpanel.track(data, properties);
  };

  exports.setMixpanelUserData = function(data) {
    return mixpanel.people.set(data._id, {
      $name: data.name,
      $email: data.email,
      $username: data.username,
      plan: data.plan,
      created_at: data.createdAt.toString(),
      keywords: data.keywords
    });
  };

}).call(this);
