@Competitor.module "FooterApp.Show", (Show, App, backbone, Marionette, $, _) ->
  
  class Show.Footer extends App.Views.ItemView
    template: "footer/show/templates/show_footer"   
    
    modelEvents:
      "change" : "render"