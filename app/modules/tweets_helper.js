/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , Tweet = mongoose.model('Tweet')
    , User = mongoose.model('User')
    , utils = require('../../lib/utils')
    , _ = require('underscore')

module.exports = function(twit, keywords, user, cb) {
    
    twit.search(keywords, {count: 100, result_type: 'recent', include_entities: false}, function(err, data) {
      if (err) return handleError(err);
      if (data) {
        data.statuses.forEach(function(tweet) {
          Tweet.findOne({id: tweet.id}, function(err, tw) {
            if (err) return errorHandler(err);
            if (!tw) {
              var newTweet = new Tweet(tweet);
              // newTweet.user = user
              newTweet.keywords = keywords.split(',');
              newTweet.save();
              console.log(newTweet.id);
            }
          })
        })
      }
      return cb();
    });
  
}