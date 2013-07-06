/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Tweet = mongoose.model('Tweet')
  , utils = require('../../lib/utils')
  , _ = require('underscore')
  , User = mongoose.model('User')
  , moment = require('moment')

/**
 * Load
 */

exports.load = function(req, res, next, id){
  Tweet.load(id, function (err, tweet) {
    if (err) return next(err)
    if (!tweet) return next(new Error('not found'))
    req.tweet = tweet
    next()
  })
}


exports.getChartData = function(req, res, next, query) {
  
  var query = query.split("&")
  , dates = query[0]
  , chart = query[1]
  
  if (req.isAuthenticated()) {
    
    var user = req.user;
    
    // not getting data because value is type of chart and type of chart is not being passed just date
    
    //deal with time ranges
    if (dates.indexOf("date=") !== -1) {
      
      dates = dates.replace("date=", "")
      
      if (dates) {
        dates = dates.split('.')
        var time_range = [ new Date(moment(dates[0]).startOf('day')), new Date(moment(dates[1]).startOf('day')) ]  
      }
  
    }
    
    if (!dates) {
       var time_range = [moment().subtract('years', 3),moment().format()]; //todo set as a specific day in time
       //todo always submit dates as current day if no date selected
    }
    
    if (chart.indexOf("chart=") !== -1) {
      
      chart = chart.replace("chart=", "")
      if (!chart) chart = "unknown";
      console.log(chart);
      
    }

    //working but created_at time is being entered as utc or something
    Tweet.find({user_id: req.user._id, requested_at: {$gte : time_range[0], $lte : time_range[1]} }, null, { limit: 300 }, function(err, tws) {
      
      if (err) return next(err);      
      if (!err) {
        
        if(tws.length) {
          console.log("Tweets length:" + tws.length)
          
          var colors = ["#F38630", "#E0E4CC", "#69D2E7", "#6AD2E7", "#6A93E7", "#7F6AE7", "#BD6AE7", "#6AE7BD", "#35C2DE", "#1E9FB8", "#E76AD2", "#6AE77F", "#B8381E", "#DE5135", "#E76A93", "#D2E76A", "#E7BD6A", "#E77F6A"];
          
          if (chart === "Doughnut" || chart === "Pie" || chart === "PolarArea") {
            
            var arrayOfTweetsKeyword = _.map(_(tws).countBy('keyword'), function(value, key) { return { "color" : null, "value" : value, "keyword" : key, "percentage" : ( ( value / tws.length ) * 100).toFixed(2) } });
            
            for (var i=0; i<arrayOfTweetsKeyword.length; i++) {
              arrayOfTweetsKeyword[i].color = colors[i];
            }
            
            var data = arrayOfTweetsKeyword;
            
          }
          if (chart === "Bar" || chart === "Line" || chart == "Radar") {
            console.log("chart first type");
            
            var labels = ["January","February","March","April","May","June","July"];
            
            // count by keyword with data elements by date
            
            var data = { labels: [], datasets: [] }
            data.labels = labels;
            
            var arrayOfTweetsKeyword = _.map(_(tws).countBy('keyword'), function(value, key) { return { 
              "fillColor" : null, 
              "strokeColor" : null, 
              "pointColor" : null,
              "pointStrokeColor" : null,
              "keyword" : key, 
              "percentage" : ( ( value / tws.length ) * 100).toFixed(2),
              "data" : [value]
              } 
            });
            
            for (var i=0; i<arrayOfTweetsKeyword.length; i++) {
              var current = arrayOfTweetsKeyword[i];
              current.fillColor = current.strokeColor = current.pointColor = current.pointStrokeColor = colors[i];
            }
            
            data.datasets = arrayOfTweetsKeyword;
              
          }
          req.chartData = data;
          console.log("Tweets data: " + req.chartData);
          next()
          
        }
    }
  });
}
}

exports.index = function(req, res){
  if (req.isAuthenticated()) {
    var user = req.user // todo remove limit and add pagination
    Tweet.find({user_id: req.user._id, created_at: { $gt: moment().startOf('day') }}, null, { limit: 300 }, function(err, tws) {
      if (err) return err
      if (!err) {
        if(tws.length) {
          
          var colors = ["#F38630", "#E0E4CC", "#69D2E7", "#6AD2E7", "#6A93E7", "#7F6AE7", "#BD6AE7", "#6AE7BD", "#35C2DE", "#1E9FB8", "#E76AD2", "#6AE77F", "#B8381E", "#DE5135", "#E76A93", "#D2E76A", "#E7BD6A", "#E77F6A"];
          var arrayOfTweetsKeyword = _.map(_(tws).countBy('keyword'), function(value, key) { return { "color" : null, "value" : value, "keyword" : key, "percentage" : ( ( value / tws.length ) * 100).toFixed(2) } });
          for (var i=0; i<arrayOfTweetsKeyword.length; i++) {
            arrayOfTweetsKeyword[i].color = colors[i];
          }
          
          // setup tweets data 
          var arrayOfTweetsSource = _.map(_(tws).countBy('source'), function (value, key) { return [key, value] });
          var arrayOfTweetsLanguage = _.map(_(tws).countBy('lang'), function (value, key) { return [key, value] });
                  
          res.render('index', {
            //charts
            chartData: arrayOfTweetsKeyword,            
            //tweets data
            tweets: tws,
            created: _(tws).sortBy('created_at').reverse(),
            lang: _.sortBy(arrayOfTweetsLanguage, function (t) { return t[1] }).reverse(),
            source: _.sortBy(arrayOfTweetsSource, function (t) { return t[1] }).reverse(),
            recent: _(tws).sortBy('id').reverse(),
            recent_tweet: _(tws).sortBy('id').reverse()[0],
            user: user
          })
        } else {
          res.render('tweets/_index_empty', {});
        }
      }
    }) 
  } else {
    res.render('index', {
      user: new User()
    })
  }
} 

/**
 * Update chart
 */

// exports.chart = function(req, res) {
//   var user = req.user
//   console.log(req);
//   console.log("YEAHHHH");
//   return false;
// }

exports.chart = function(req, res){
  res.writeHead(200, {'content-type': 'text/json' });
  res.write( JSON.stringify({ chartData: req.chartData }) );
  res.end('\n');
}

/**
 * New tweet
 */

exports.new = function(req, res){
  res.render('tweets/new', {
    title: 'New Tweet',
    tweet: new Tweet({})
  })
}

/**
 * Create a tweet
 */

exports.create = function (req, res) {
  var tweet = new Tweet(req.body)
  tweet.user = req.user
  tweet.save
}

/**
 * Edit a tweet
 */

exports.edit = function (req, res) {
  res.render('tweets/edit', {
    title: 'Edit ' + req.tweet.title,
    tweet: req.tweet
  })
}

/**
 * Update tweet
 */

exports.update = function(req, res){
  var tweet = req.tweet
  tweet = _.extend(tweet, req.body)

  tweet.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/tweets/' + tweet._id)
    }
    
    res.render('tweets/edit', {
      title: 'Edit Tweet',
      tweet: tweet,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('tweets/show', {
    title: req.tweet.title,
    tweet: req.tweet
  })
}

/**
 * Delete a tweet
 */

exports.destroy = function(req, res){
  var tweet = req.tweet
  tweet.remove(function(err){
    req.flash('info', 'Deleted successfully')
    res.redirect('/tweets')
  })
}

/**
 * Explore tweets
 */


exports.explore = function(req, res){
  var user = req.user
  res.render('tweets/explore', {
    title: "Explore",
    user: user
  })
  

 
}
