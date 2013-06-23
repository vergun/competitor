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
    , User = mongoose.model('User');
        
//  test

module.exports = function(server) {
  
  // start socket.io for real-time network requests //
  var io = require('socket.io').listen(server);
  
  // start real-time twitter streaming service //
  // twit.stream('statuses/filter', { track: config.app.defaultCompetitors }, function(stream) {
  //   stream.on('data', function(data) {
  //     io.sockets.volatile.emit('tweet', {
  //       user: data.user.screen_name
  //     , avatar: data.user.profile_image_url
  //     , text: data.text
  //     });
  //   });
  // }); 
  
  
  // Person
  // .find({ occupation: /host/ })
  // .where('name.last').equals('Ghost')
  // .where('age').gt(17).lt(66)
  // .where('likes').in(['vaporizing', 'talking'])
  // .limit(10)
  // .sort('-occupation')
  // .select('name occupation')
  // .exec(callback);
  // 
  // since_id: 347767223877771260, 
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
  
  // io events //
  io.sockets.on('connection', function(client) {
    
    
 
      
    
    // initial application keywords //
    client.emit("keywords", { keywords: config.app.defaultCompetitors });
    
    // retrieve keywords from server //
    client.on('get:keywords', function () {
      twit.search(config.app.defaultCompetitors[0], {count: 100, since_id: 347767223877771260, result_type: 'recent', include_entities: false}, function(err, data) {
        if (err) console.log(err);
        if (data) client.emit('deliver:keywords', {data: data});
      });
    });
        
  });

}

// 
// io.sockets.on('connection', function(client) {
// 
//   client.emit("keywords", {
//     keywords: config.defaults.keywords
//   });
//   
//   client.on('get:keywords', function () {
//     var keyword = "mcdonalds";
//     twit.search(keyword, {count: 100, since_id: 347767223877771260, result_type: 'recent', include_entities: false}, function(err, data) {
//       if (err) {
//         
//         client.emit('deliver:keywords', {error: err});
//         
//       } else {
//         
//         client.emit('deliver:keywords', {data: data});
//                   
//         for (var i=0; i < data.statuses.length; i++) {
//           
//           TM.addTweet(data.statuses[i], keyword, function(o, e) {
//             if (o) console.log(o);
//             else console.log(e);
//           })
// 
//         } 
//       }
// 
//     });
//   });
//    
// });



         // for (var i=0; i < data.statuses.length; i++) {
    //        TM.addTweet(data.statuses[i], keyword, function(o, e) {
    //          if (o) console.log(o);
    //          else console.log(e);
    //        })
    //      } 
  