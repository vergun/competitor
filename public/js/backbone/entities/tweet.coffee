@Competitor.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Tweet extends Entities.Model
    
    
  class Entities.TweetCollection extends Entities.Collection
    initialize: (options) ->
      console.log options
      @options = options
      @urlRoot = "/tweets/chart/"
      @baseURL = "date=&chart=Pie&keywords=baroque;_hello;_goodbye&since=&context=totals/"
      @model = Entities.Tweet
      
    url: ->
      if @options.length?
        @urlRoot + $.params(options)
      else
        @urlRoot + @baseURL
        
      # initialize: (options) ->
        # @options ?= options
    
  
  
      # urlRoot: "/tweets/chart/"

 
        # if @options.length? 
        #   @urlRoot + $.param(options) 
        # else 
        # @urlRoot + "date=&chart=Pie&keywords=baroque;_hello;_goodbye&since=&context=totals/"
  
  API =
    getTweets: (options = {}) ->
      new Entities.TweetCollection options

  App.reqres.setHandler "get:index:tweets", (options = {}) ->
    API.getTweets options
    


  
