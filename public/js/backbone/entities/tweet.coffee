@Competitor.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Tweet extends Entities.Model
    
    
  class Entities.TweetCollection extends Entities.Collection
    model: Entities.Tweet
    url: '/tweets/chart/date=&chart=Pie&keywords=baroque;_hello;_goodbye&since=&context=totals/'    
  
  API =
    getTweets: ->
      new Entities.TweetCollection

  App.reqres.setHandler "get:index:tweets", ->
    API.getTweets()