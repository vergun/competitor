_ = require("underscore")
moment = require("moment")
datesHelper = require("../modules/dates_helper")
exports.formatGraphData = (colors, tws, labels, callback) ->
  tweetValues = datesHelper.getTweetValuesByLabels(tws, labels)
  graphData = _.map(_(tws).countBy("keyword"), (value, key) ->
    fillColor: null
    strokeColor: null
    pointColor: null
    pointStrokeColor: null
    keyword: key
    percentage: ((value / tws.length) * 100).toFixed(2)
    data: tweetValues[key] #was [value]
    value: value
    color: null
  )
  return callback(colors, graphData)  if typeof (callback) is "function"
  graphData

exports.addColorsToGraphData = (colors, graphData) ->
  i = 0

  while i < graphData.length
    current = graphData[i]
    current.fillColor = current.strokeColor = current.pointColor = current.pointStrokeColor = current.color = colors[i]
    i++
  graphData

exports.setup = (req, query) ->
  query = query.split("&")
  dates = query[0].replace("date=", "").split(".")
  time_range = (if (dates.length > 1) then [new Date(moment(dates[0]).startOf("day")), new Date(moment(dates[1]).endOf("day"))] else [new Date(moment().startOf("day")), new Date(moment().endOf("day"))])
  chart = query[1].replace("chart=", "")
  keywords = query[2].replace("keywords=", "").replace(/\+/g, " ").split(";")
  since = query[3].replace("since=", "")
  context = query[4].replace("context=", "")
  perPage = 30
  page = ((if req.param("page") > 0 then req.param("page") else 1)) - 1
  dateArray = datesHelper.getDates(time_range[0], time_range[1], datesHelper.formatDate)
  formattedDates = datesHelper.formatDateForView(time_range)
  query: query
  dates: dates
  time_range: time_range
  chart: chart
  keywords: keywords
  since: since
  context: context
  simple_charts: ["Doughnut", "Pie", "PolarArea"]
  complex_charts: ["Bar", "Line", "Radar"]
  colors: ["#F38630", "#E0E4CC", "#69D2E7", "#6AD2E7", "#6A93E7", "#7F6AE7", "#BD6AE7", "#6AE7BD", "#35C2DE", "#1E9FB8", "#E76AD2", "#6AE77F", "#B8381E", "#DE5135", "#E76A93", "#D2E76A", "#E7BD6A", "#E77F6A"]
  labels: dateArray
  user: req.user
  page: page
  perPage: perPage
  formattedDates: formattedDates