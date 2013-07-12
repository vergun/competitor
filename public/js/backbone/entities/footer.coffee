@Competitor.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->
  
  class Entities.Footer extends Entities.Model
    
    
  class Entities.FooterCollection extends Entities.Collection
    model: Entities.Footer
    
  
  API =
    getFooters: ->
      new Entities.Footer {
        copyrightyear: "MMXIII"
        text: ". ALL RIGHTS RESERVED. CONTACT US AT HELP@INSTOREDOES.COM."
        brand: "OWN GROUP, INC" 
        }

  App.reqres.setHandler "get:footer:text", ->
    API.getFooters()