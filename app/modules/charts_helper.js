// Generated by CoffeeScript 1.6.3
(function() {
  var datesHelper, moment, _;

  _ = require("underscore");

  moment = require("moment");

  datesHelper = require("../modules/dates_helper");

  exports.formatGraphData = function(colors, tws, labels, callback) {
    var graphData, tweetValues;
    tweetValues = datesHelper.getTweetValuesByLabels(tws, labels);
    graphData = _.map(_(tws).countBy("keyword"), function(value, key) {
      return {
        fillColor: null,
        strokeColor: null,
        pointColor: null,
        pointStrokeColor: null,
        keyword: key,
        percentage: ((value / tws.length) * 100).toFixed(2),
        data: tweetValues[key],
        value: value,
        color: null
      };
    });
    if (typeof callback === "function") {
      return callback(colors, graphData);
    }
    return graphData;
  };

  exports.addColorsToGraphData = function(colors, graphData) {
    var current, i;
    i = 0;
    while (i < graphData.length) {
      current = graphData[i];
      current.fillColor = current.strokeColor = current.pointColor = current.pointStrokeColor = current.color = colors[i];
      i++;
    }
    return graphData;
  };

  exports.setup = function(req, query) {
    var chart, context, dateArray, dates, formattedDates, keywords, page, perPage, since, time_range;
    query = query.split("&");
    dates = query[0].replace("date=", "").split(".");
    time_range = (dates.length > 1 ? [new Date(moment(dates[0]).startOf("day")), new Date(moment(dates[1]).endOf("day"))] : [new Date(moment().startOf("day")), new Date(moment().endOf("day"))]);
    chart = query[1].replace("chart=", "");
    keywords = query[2].replace("keywords=", "").replace(/\+/g, " ").split(";");
    since = query[3].replace("since=", "");
    context = query[4].replace("context=", "");
    perPage = 30;
    page = (req.param("page") > 0 ? req.param("page") : 1) - 1;
    dateArray = datesHelper.getDates(time_range[0], time_range[1], datesHelper.formatDate);
    formattedDates = datesHelper.formatDateForView(time_range);
    return {
      query: query,
      dates: dates,
      time_range: time_range,
      chart: chart,
      keywords: keywords,
      since: since,
      context: context,
      simple_charts: ["Doughnut", "Pie", "PolarArea"],
      complex_charts: ["Bar", "Line", "Radar"],
      colors: ["#F38630", "#E0E4CC", "#69D2E7", "#6AD2E7", "#6A93E7", "#7F6AE7", "#BD6AE7", "#6AE7BD", "#35C2DE", "#1E9FB8", "#E76AD2", "#6AE77F", "#B8381E", "#DE5135", "#E76A93", "#D2E76A", "#E7BD6A", "#E77F6A"],
      labels: dateArray,
      user: req.user,
      page: page,
      perPage: perPage,
      formattedDates: formattedDates
    };
  };

}).call(this);
