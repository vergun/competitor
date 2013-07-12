var cronJob = require('cron').CronJob
  , env = process.env.NODE_ENV || 'development'  
  , config = require('../../config/config')[env]
  , twitter = require('ntwitter')
  , twit = new twitter(config.twitter)
  , tweets = require('../modules/tweets_helper')
  , mongoose = require('mongoose')
  , User = mongoose.model('User')
  , _ = require('underscore')
  
// format * * * * * *
// 'seconds minutes hours * * daysofweek(e.g. 1-5 for Monday - Friday)'

exports.cron = function() {
  
  //todo add logic for frequency of searching given
  // different types of subscriptions
  var tweetsFetch = new cronJob({
    // every 30 minutes
    cronTime: '* * * * * *',
    onTick: function() {
      User.find({}, function(err, users) {
        _(users).each(function(user) {
          tweets.search(twit, user.keywords, user);
        });
      });
    },
    start: false,
    timeZone: "America/Los_Angeles"
  });
  
   // tweetsFetch.start();
  
}
