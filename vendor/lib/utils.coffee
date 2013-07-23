###
Formats mongoose errors into proper array
@param {Array} errors
@return {Array}
@api public
###

exports.errors = (errors) ->
  keys = Object.keys(errors)
  errs = []
  
  # if there is no validation error, just display a generic error
  unless keys
    console.log errors
    return ["Oops! There was an error"]
  keys.forEach (key) ->
    errs.push errors[key].type

  errs