env = process.env.NODE_ENV or "development"
config = require("../../config/config")[env]
Mixpanel = require("mixpanel")
mixpanel = Mixpanel.init(config.mixpanel.id)
exports.track = (data, properties) ->
  mixpanel.track data, properties

exports.setMixpanelUserData = (data) ->
  mixpanel.people.set data._id,
    $name: data.name
    $email: data.email
    $username: data.username
    plan: data.plan
    created_at: data.createdAt.toString()
    keywords: data.keywords
