var _ = require('underscore')
  , moment = require('moment')

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf())
    dat.setDate(dat.getDate() + days);
    return dat;
}

exports.getDates = function ( startDate, stopDate, callback ) {
   var dateArray = new Array();
   var currentDate = startDate;
   while (currentDate <= stopDate) {
     dateArray.push(currentDate)
     currentDate = currentDate.addDays(1);
   }
   
   if ( typeof(callback) == "function" ) return callback( dateArray );
   return dateArray;
   
 }
 
exports.formatDate = function ( dateArray ) {
   
   var format = "";
    
   // // todo if day is less than one do it by time of day
   if ( dateArray.length <= 7 ) format = "dddd";
   if ( dateArray.length > 7 && dateArray.length <= 365 ) format = "MMMM";
   if ( dateArray.length > 365 ) format = "YYYY";
      
   for (var i=0; i<dateArray.length; i++ ) {
         dateArray[i] = moment(dateArray[i]).format( format );
     } 
      
   return _.uniq( dateArray );
   
 }
 
 exports.getTweetValuesByLabels = function( tws, labels ) {
   
   var format = ""
    ,  days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ]
    ,  months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
    ,  years = [ "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020" ]
    ,  grouped = _(tws).groupBy('keyword')
   
   if ( (_.intersection(days, labels) ).length > 0 ) format = "dddd";
   if ( (_.intersection(months, labels) ).length > 0 ) format = "MMMM";
   if ( (_.intersection(years, labels) ).length > 0 ) format = "YYYY";   
   
   for (var i=0; i<tws.length; i++) {  
     
     tws[i].dateformat = "";
     tws[i].dateformat = moment(tws[i].requested_at).format( format );  
     
   }
   
   for ( var key in grouped ) {
     
      var obj = grouped[key];
      grouped[key] = _(obj).countBy('dateformat');
      
   }
      
   for ( var key in grouped ) {
     
     var obj = grouped[key];
     grouped[key] = [];
       
     for ( var prop in obj ) {
  
      if ( obj.hasOwnProperty(prop) ) {
           grouped[key].push( obj[prop] )
         }
      }
   }   
   
   return grouped;
   
 }