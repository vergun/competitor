@Competitor.module "FooterApp.Show", (Show, App, Backbone, Mariontte, $, _) ->
  
  Show.Controller =
    
    showFooter: ->
      footerText = App.request "get:footer:text"
      footerView = @getFooterView footerText
      App.footerRegion.show footerView
      
    getFooterView: (footerText) ->
      new Show.Footer
        model: footerText