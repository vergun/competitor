@Competitor.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Header extends Entities.Model
    
    
  class Entities.HeaderCollection extends Entities.Collection
    model: Entities.Header
    
  
  API =
    getHeaders: ->
      new Entities.Header {
        copyrightyear: "MMXIII"
        text: ". ALL RIGHTS RESERVED. CONTACT US AT HELP@INSTOREDOES.COM."
        brand: "OWN GROUP, INC" 
        }

  App.reqres.setHandler "get:header:text", ->
    API.getHeaders()