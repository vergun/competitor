@Competitor.module "TweetApp", (TweetApp, App, Backbone, Marionette, $, _) ->
  @startWithParent = false
  
  API =
    showIndex: ->
      TweetApp.Index.Controller.showIndex()
      
  TweetApp.on "start", ->
    API.showIndex()
