@Competitor.module "HeaderApp.Show", (Show, App, Backbone, Mariontte, $, _) ->
  
  Show.Controller =
    
    showHeader: ->
      headerText = App.request "get:header:text"
      headerView = @getHeaderView headerText
      App.headerRegion.show headerView
      
    getHeaderView: (headerText) ->
      new Show.Header
        model: headerText