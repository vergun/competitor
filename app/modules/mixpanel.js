var env = process.env.NODE_ENV || 'development'  
  , config = require('../../config/config')[env] 
 ,  Mixpanel = require('mixpanel')
 ,  mixpanel = Mixpanel.init(config.mixpanel.id);

 exports.track = function(data, properties) {
   mixpanel.track(data, properties)
 }

exports.setMixpanelUserData = function(data) {
  mixpanel.people.set(data._id, {
      $name: data.name
   ,  $email: data.email
   ,  $username: data.username
   ,  plan: data.plan
   ,  created_at: data.createdAt.toString()
   ,  keywords: data.keywords
  });
}