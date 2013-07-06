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
                       
        var graphData = chartsHelper.formatGraphData( d.colors, tws, chartsHelper.addColorsToGraphData )

        if (_(d.simple_charts).contains(d.chart)) var data = graphData;   
        if (_(d.complex_charts).contains(d.chart)) {                        
          var data = { labels: [], datasets: [] };
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

//todo condense into getChartData
// limit: 20, 
exports.index = function(req, res){
  if (req.isAuthenticated()) {
    var user = req.user 
    Tweet.find({user_id: req.user._id, created_at: { $gt: moment().startOf('day') }}, null, { sort: {id: -1} }, function(err, tws) {
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
          var limitedTweets = tws.slice(0, 19);
                  
          res.render('index', {
            //charts
            chartData: arrayOfTweetsKeyword,            
            //tweets data
            tweets: tws,
            // _(tws).sortBy('created_at').reverse(),
            created: tws.slice(0, 10),
            recent: _(tws).sortBy('id').reverse(),
            lang: _.sortBy(arrayOfTweetsLanguage, function (t) { return t[1] }).reverse(),
            source: _.sortBy(arrayOfTweetsSource, function (t) { return t[1] }).reverse(),
            recent_tweet: _(tws).sortBy('id').reverse()[0],
            since: _(tws).sortBy('id')[0].id,
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
