@Competitor = do (Backbone, Marionette) ->
  
  App = new Marionette.Application
  
  App.addRegions
    footerRegion:  "#footer-region"
      
  App.addInitializer ->
    App.module("FooterApp").start()

  App.on "initialize:after", ->
    if Backbone.history
      Backbone.history.start()
            
  App