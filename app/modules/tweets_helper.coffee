###
Module dependencies.
###
mongoose = require("mongoose")
Tweet = mongoose.model("Tweet")
User = mongoose.model("User")
utils = require("../../vendor/lib/utils")
_ = require("underscore")

exports.search = (twit, keywords, user) ->
  keywords = keywords.split(",")
  _(keywords).each (word) ->
    twit.search word,
      count: 100
      result_type: "recent"
      include_entities: false
    , (err, data) ->
      console.warn "Couldn't find: " + word  if err
      if data
        data.statuses.forEach (tweet) ->
          Tweet.findOne
            id: tweet.id
          , (err, tw) ->
            return errorHandler(err)  if err
            unless tw
              newTweet = new Tweet(tweet)
              newTweet.user_id = user._id
              newTweet.keyword = word
              newTweet.keywords = keywords.join(",")
              newTweet.save()
              console.log "New tweet created, id: " + newTweet.id