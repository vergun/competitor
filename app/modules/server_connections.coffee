module.exports = (twit, config, io) ->
  
  # start real-time twitter streaming service //
  twit.stream "statuses/filter",
    track: config.app.defaultCompetitors
  , (stream) ->
    stream.on "data", (data) ->
      io.sockets.volatile.emit "tweet",
        user: data.user.screen_name
        username: data.user.name
        userurl: data.user.url
        avatar: data.user.profile_image_url
        text: data.text



  
  #setup default keywords
  io.sockets.on "connection", (client) ->
    client.emit "keywords",
      keywords: config.app.defaultCompetitors