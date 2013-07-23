@Competitor.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Tweet extends Entities.Model
  class Entities.TweetCollection extends Entities.Collection
    initialize: (options) ->
      @options = options
      @urlRoot = "/tweets/chart/"
      @defaultURL = "date=&chart=Pie&keywords=baroque%3B+hello%3B+goodbye&since=&context=totals/"
      @model = Entities.Tweet
      
    url: ->
      if Object.keys(@options).length > 0
        @urlRoot + $.param(@options)
      else
        @urlRoot + @defaultURL
  
  API =
    getTweets: (options = {}) ->
      new Entities.TweetCollection options

  App.reqres.setHandler "get:index:tweets", (options = {}) ->
    API.getTweets options
    


  
