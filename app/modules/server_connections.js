/**
 * Module dependencies.
 */

var env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , twitter = require('ntwitter')
  , twit = new twitter(config.twitter);


  // test //
  var mongoose = require('mongoose')
    , Tweet = mongoose.model('Tweet')
    , utils = require('../../lib/utils')
    , _ = require('underscore')
    , User = mongoose.model('User')
    , Tweet = mongoose.model('Tweet')
        
//  test

module.exports = function(server) {
  
  // start socket.io for real-time network requests //
  var io = require('socket.io').listen(server);
  
  // start real-time twitter streaming service //
  twit.stream('statuses/filter', { track: config.app.defaultCompetitors }, function(stream) {
    stream.on('data', function(data) {
      io.sockets.volatile.emit('tweet', {
        user: data.user.screen_name
      , avatar: data.user.profile_image_url
      , text: data.text
      });
    });
  }); 
  
  // seed tweets document //
  twit.search(config.app.defaultCompetitors.join(','), {count: 100, result_type: 'recent', include_entities: false}, function(err, data) {
    if (err) return handleError(err);
    if (data) {
      data.statuses.forEach(function(tweet) {
        Tweet.findOne({id: tweet.id}, function(err, tw) {
          if (err) return errorHandler(err);
          if (!tw) {
            var newTweet = new Tweet(tweet);
            newTweet.save();
            console.log(newTweet.id);
          }
        })
      })
    }
  });
  
  
  io.sockets.on('connection', function(client) {
    
    // initial application keywords //
    client.emit("keywords", { keywords: config.app.defaultCompetitors });
    
    // retrieve keywords from server //
    // client.on('fetch:tweets', function () {
//       var tweets = Tweet.find()
//       console.log(tweets) 
//       client.emit('deliver:tweets', tweets);
    // });
        
    });

  }
