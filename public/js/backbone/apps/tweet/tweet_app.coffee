@Competitor.module "TweetApp", (TweetApp, App, Backbone, Marionette, $, _) ->
  @startWithParent = false
  
  API =
    showIndex: ->
      TweetApp.Index.Controller.showIndex()
      
    showChart: (options) ->
      TweetApp.Index.Controller.showChart options.model
      
  TweetApp.on "start", ->
    API.showIndex()
    
  App.vent.on "update:chart", (options) ->
    API.showChart(options)
