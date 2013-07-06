/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
    , Tweet = mongoose.model('Tweet')
    , User = mongoose.model('User')
    , utils = require('../../lib/utils')
    , _ = require('underscore')

exports.search = function(twit, keywords, user) {

  var keywords = keywords.split(',');
  
  _(keywords).each(function(word) {
    
      twit.search(word, {count: 100, result_type: 'recent', include_entities: false}, function(err, data) {        
        if (err) console.log("couldn't find!!!!!!! " + word)
        if (data) {
          data.statuses.forEach(function(tweet) {
            Tweet.findOne({id: tweet.id}, function(err, tw) {
              if (err) return errorHandler(err);
              if (!tw) {
                var newTweet = new Tweet(tweet);
                newTweet.user_id = user._id;
                newTweet.keyword = word;
                newTweet.keywords = keywords.join(',');
                newTweet.save();
                console.log("New tweet created, id: " + newTweet.id);
              }
            })
          })
        }
      })
  });
  
}