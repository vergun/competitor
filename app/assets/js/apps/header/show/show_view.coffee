@Competitor.module "HeaderApp.Show", (Show, App, backbone, Marionette, $, _) ->
  
  class Show.Header extends App.Views.ItemView
    template: templatizer.header.header   
      
    modelEvents:
      "change" : "render"