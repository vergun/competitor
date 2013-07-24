Backbone.Marionette.Renderer.render = (template, data) ->
  path = template
  unless path
    throw "Template #{template} not found!"
  path(data)