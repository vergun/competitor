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
   
   if ( typeof(callback) == "function" ) callback( dateArray );
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