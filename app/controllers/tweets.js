/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Tweet = mongoose.model('Tweet')
  , utils = require('../../lib/utils')
  , _ = require('underscore')
  , User = mongoose.model('User')
  , moment = require('moment')
  , chartsHelper = require('../modules/charts_helper')
  

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

//todo case when there is no data, return what?
exports.getChartData = function(req, res, next, query) {
  var d = chartsHelper.setup(req, query)

  var options = {  
      perPage: d.perPage
    , page: d.page
    , criteria: {
        user_id: d.user._id 
      , keyword: {$in: d.keywords}
      , requested_at: { $gte : d.time_range[0], $lte : d.time_range[1] }
      }
    }
    
  if (req.isAuthenticated()) {

    Tweet.list(options, function(err, tws) {
            
      if (err) return next(err);  
      if (tws.length) {
                       
        var graphData = chartsHelper.formatGraphData( d.colors, tws, d.labels, chartsHelper.addColorsToGraphData )
          , data = [];

        if (_(d.simple_charts).contains(d.chart)) data = graphData;   
        if (_(d.complex_charts).contains(d.chart)) {                        
          data = { labels: [], datasets: [] };
          data.labels = d.labels;
          data.datasets = graphData;             
          }
        
        req.chartData = data;
        req.tweets = tws.slice(0, 19)
        req.since = tws[0].id_str;
                
        next()
          
        }
    });
  }
}


exports.index = function(req, res){
  if (req.isAuthenticated()) {
    
    var query = "date=&chart=Pie&keywords=" + req.user.keywords.replace(/ /g, "_").split(",").join(";") + "&since=&context=Total"
      , d = chartsHelper.setup(req, query)   
    
    var options = {  
        perPage: d.perPage
      , page: d.page
      , criteria: {
          user_id: d.user._id 
        , keyword: {$in: d.keywords}
        , requested_at: { $gte : d.time_range[0], $lte : d.time_range[1] }
        }
      }
      
    Tweet.list(options, function(err, tws) {
      if (err) return next(err)
      if(tws.length) {
        
        var graphData = chartsHelper.formatGraphData( d.colors, tws, d.labels, chartsHelper.addColorsToGraphData )
          , arrayOfTweetsSource = _.map(_(tws).countBy('source'), function (value, key) { return [key, value] })
          , arrayOfTweetsLanguage = _.map(_(tws).countBy('lang'), function (value, key) { return [key, value] });
                  
          res.render('index', {
            chartData: graphData
          , tweets: tws
          , displayedTweets: tws.slice(0, 10)
          , lang: _.sortBy(arrayOfTweetsLanguage, function (t) { return t[1] }).reverse()
          , source: _.sortBy(arrayOfTweetsSource, function (t) { return t[1] }).reverse()
          , since: _(tws).sortBy('id')[0].id
          , user: d.user
          })
          
        } else {
          //todo provide in view an empty view not just Loading
          res.render('tweets/_index_empty', {});
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

exports.chart = function(req, res){
  res.writeHead(200, {'content-type': 'text/json' });
  res.write( JSON.stringify({ chartData: req.chartData, tweets: req.tweets, since: req.since }) );
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
