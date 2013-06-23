var env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , twitter = require('ntwitter')
  , twit = new twitter(config.twitter);
// 
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
  