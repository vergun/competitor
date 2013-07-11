@Competitor.module "FooterApp.Show", (Show, App, backbone, Marionette, $, _) ->
  
  class Show.Footer extends App.Views.ItemView
    template: templatizer.test
    
    initialize: ->
      this.listenTo this.model, "change", this.modelChanged
      
    modelChanged: (model) ->
      console.log model      
      
    modelEvents:
      "change" : "render"