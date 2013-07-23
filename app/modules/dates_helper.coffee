_ = require("underscore")
moment = require("moment")
Date::addDays = (days) ->
  dat = new Date(@valueOf())
  dat.setDate dat.getDate() + days
  dat

exports.getDates = (startDate, stopDate, callback) ->
  dateArray = new Array()
  currentDate = startDate
  while currentDate <= stopDate
    dateArray.push currentDate
    currentDate = currentDate.addDays(1)
  return callback(dateArray)  if typeof (callback) is "function"
  dateArray

exports.formatDate = (dateArray) ->
  format = ""
  
  # // todo if day is less than one do it by time of day
  format = "dddd"  if dateArray.length <= 7
  format = "MMMM"  if dateArray.length > 7 and dateArray.length <= 365
  format = "YYYY"  if dateArray.length > 365
  i = 0

  while i < dateArray.length
    dateArray[i] = moment(dateArray[i]).format(format)
    i++
  _.uniq dateArray

exports.formatDateForView = (dateArray) ->
  format = ""
  dateArray = [moment(dateArray[0]).startOf("day"), moment(dateArray[1]).startOf("day")]
  format = moment(dateArray[0]).calendar().split(" at")[0] + " to " + moment(dateArray[1]).calendar().split(" at")[0]  unless dateArray[0].format() is dateArray[1].format()
  if dateArray[0].format() is dateArray[1].format()
    if moment(dateArray[0]).format("L") is moment(new Date()).format("L")
      format = "Today"
    else
      format = moment(dateArray[0]).fromNow() #not today but identical dates
  format

exports.getTweetValuesByLabels = (tws, labels) ->
  format = ""
  days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  years = ["2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"]
  grouped = _(tws).groupBy("keyword")
  format = "dddd"  if (_.intersection(days, labels)).length > 0
  format = "MMMM"  if (_.intersection(months, labels)).length > 0
  format = "YYYY"  if (_.intersection(years, labels)).length > 0
  
  # add property dateformat (a label identifier ) to each record in tws
  i = 0

  while i < tws.length
    tws[i].dateformat = ""
    tws[i].dateformat = moment(tws[i].requested_at).format(format)
    i++
  
  # group count by label and keyword
  # example: { ' hello': { Sunday: 197, Saturday: 1024, Friday: 1874 }
  for key of grouped
    obj = grouped[key]
    grouped[key] = _(obj).countBy("dateformat")
  
  # insert 0's for labels with no values
  for key of grouped
    obj = grouped[key]
    i = 0

    while i < labels.length
      obj[labels[i]] = 0  unless obj.hasOwnProperty(labels[i])
      i++
  
  # remove keywords and store counts in a sorted array
  # example: { ' hello': [ 197, 1024, 1874 ]  
  for key of grouped
    obj = grouped[key]
    grouped[key] = []
    i = 0

    while i < labels.length
      grouped[key].push obj[labels[i]]  if obj.hasOwnProperty(labels[i])
      i++
  grouped