@Competitor.module "FooterApp.Show", (Show, App, backbone, Marionette, $, _) ->
  
  class Show.Footer extends App.Views.ItemView
    template: templatizer.footer.footer
      
    modelEvents:
      "change" : "render"