/**
 * Module dependencies.
 */

var _ = require('underscore')
  , moment = require('moment')


exports.formatGraphData = function(colors, tws, cb) {
  var graphData = _.map(_(tws).countBy('keyword'), function(value, key) { return { 
            "fillColor" : null, 
            "strokeColor" : null, 
            "pointColor" : null,
            "pointStrokeColor" : null,
            "keyword" : key, 
            "percentage" : ( ( value / tws.length ) * 100).toFixed(2),
            "data" : [value],
            "value" : value,
            "color" : null
            } 
          });
          
          return cb(colors, graphData);
}

exports.addColorsToGraphData = function(colors, graphData) {        
  for (var i=0; i < graphData.length; i++) {
         var current = graphData[i];
         current.fillColor = current.strokeColor = current.pointColor = current.pointStrokeColor = current.color = colors[i];
  }
  return graphData;
}

exports.setup = function(req, query) {
  
  // days, weeks, months
  // compare dates first and second distance from one another
  // if less than 7 days display days
  // if more than 7 days display months
  
var query = query.split("&")
  , dates = query[0].replace("date=", "").split('.')
  , time_range = ( dates.length > 1 ) 
      ? [ new Date(moment(dates[0]).startOf('day')), new Date(moment(dates[1]).endOf('day')) ] 
      : [ new Date(moment().startOf('day')), new Date(moment().endOf('day')) ]
  , chart = query[1].replace("chart=", "")
  , keywords = query[2].replace("keywords=", "").replace(/_/g, " ").split(';')
  , since = query[3].replace("since=", "")
  , context = query[4].replace("context=", "")
  , perPage = 30
  , page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  
  
  //** start tests **/
  
  Date.prototype.addDays = function(days) {
      var dat = new Date(this.valueOf())
      dat.setDate(dat.getDate() + days);
      return dat;
  }
  
  function getDates(startDate, stopDate) {
     var dateArray = new Array();
     var currentDate = startDate;
     while (currentDate <= stopDate) {
       dateArray.push(currentDate)
       currentDate = currentDate.addDays(1);
     }
     return dateArray;
   }
   
   var dateArray = getDates(time_range[0], time_range[1]);
   
   if ( dateArray.length <= 7 ) {
     
     for (i = 0; i < dateArray.length; i ++ ) {
         dateArray[i] = moment(dateArray[i]).format('dddd');
     } 
     
     
   } 
   
   if ( dateArray.length > 7 && dateArray.length <= 365 ) {
     
     for (i = 0; i < dateArray.length; i ++ ) {
         dateArray[i] = moment(dateArray[i]).format('MMMM');
     } 
     
     dateArray = _.uniq(dateArray);
     
   }
   
   if ( dateArray.length > 365 ) {
     
     for (i = 0; i < dateArray.length; i ++ ) {
         dateArray[i] = moment(dateArray[i]).format('YYYY');
     } 
     
     dateArray = _.uniq(dateArray);
     
     
   }
      
   
      
   console.log(dateArray);

   
   //** end tests **/
   
  
  return {
    query: query
  , dates: dates
  , time_range: time_range
  , chart: chart
  , keywords: keywords
  , since: since
  , context: context
  , simple_charts: [ "Doughnut", "Pie", "PolarArea" ]
  , complex_charts: [ "Bar", "Line", "Radar" ]
  , colors: [ "#F38630", "#E0E4CC", "#69D2E7", "#6AD2E7", "#6A93E7", "#7F6AE7", "#BD6AE7", "#6AE7BD", "#35C2DE", "#1E9FB8", "#E76AD2", "#6AE77F", "#B8381E", "#DE5135", "#E76A93", "#D2E76A", "#E7BD6A", "#E77F6A" ]
  , labels: dateArray
  , user: req.user
  , page: page
  , perPage: perPage
  }
 
}