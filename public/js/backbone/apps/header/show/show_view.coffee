@Competitor.module "HeaderApp.Show", (Show, App, backbone, Marionette, $, _) ->
  
  class Show.Header extends App.Views.ItemView
    template: templatizer.header.header
    
    initialize: ->
      this.listenTo this.model, "change", this.modelChanged
      
    modelChanged: (model) ->
      console.log model      
      
    modelEvents:
      "change" : "render"