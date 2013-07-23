@Competitor.module "TweetApp", (TweetApp, App, Backbone, Marionette, $, _) ->
  @startWithParent = false
  
  API =
    showIndex: ->
      TweetApp.Index.Controller.showIndex()
      
    showChart: (options = {}) ->
      TweetApp.Index.Controller.showChart options.model
      
    showChartLegend: (options = {}) ->
      TweetApp.Index.Controller.showChartLegend options.model
      
    showTweetList: (options = {}) ->
      TweetApp.Index.Controller.showTweetList options.model
      ## todo limited number of tweets to begin with, then sorting those? 
    
    showLoading: ->
      TweetApp.Index.Controller.showLoading()
      
    removeLoading: ->
      TweetApp.Index.Controller.removeLoading()
      
    updateTweets: (options = {}) ->
      TweetApp.Index.Controller.updateIndex(options)
      
      
  TweetApp.on "start", ->
    API.showIndex()
    
  App.vent.on "update:chart", (options = {}) ->
    API.showChart(options)
    API.showChartLegend(options)
    
  App.vent.on "update:keywords", (options = {}) ->
    API.showChart(options)
    API.showChartLegend(options)
    API.showTweetList(options)
    
  App.vent.on "update:tweets", (options = {}) ->
    API.updateTweets(options)
    
  App.vent.on "show:loading", ->
    API.showLoading()
    
  App.vent.on "remove:loading", ->
    API.removeLoading()
