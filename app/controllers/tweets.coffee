###
Module dependencies.
###
mongoose = require("mongoose")
Tweet = mongoose.model("Tweet")
utils = require("../../vendor/lib/utils")
_ = require("underscore")
User = mongoose.model("User")
moment = require("moment")
chartsHelper = require("../modules/charts_helper")

###
Load
###
exports.load = (req, res, next, id) ->
  Tweet.load id, (err, tweet) ->
    return next(err)  if err
    return next(new Error("not found"))  unless tweet
    req.tweet = tweet
    next()


exports.getChartData = (req, res, next, query) ->
  if req.isAuthenticated()
    d = chartsHelper.setup(req, query)
    options =
      perPage: d.perPage
      page: d.page
      criteria:
        user_id: d.user._id
        keyword:
          $in: d.keywords

        requested_at:
          $gte: d.time_range[0]
          $lte: d.time_range[1]

    Tweet.list options, (err, tws) ->
      return next(err)  if err
      graphData = chartsHelper.formatGraphData(d.colors, tws, d.labels, chartsHelper.addColorsToGraphData)
      data = []
      arrayOfTweetsSource = _.map(_(tws).countBy("source"), (value, key) ->
        [key, value]
      )
      arrayOfTweetsLanguage = _.map(_(tws).countBy("lang"), (value, key) ->
        [key, value]
      )
      
      #todo remove this block of code
      data = graphData  if _(d.simple_charts).contains(d.chart)
      if _(d.complex_charts).contains(d.chart)
        data =
          labels: []
          datasets: []

        data.labels = d.labels
        data.datasets = graphData
      complex =
        labels: []
        datasets: []

      complex.labels = d.labels
      complex.datasets = graphData
      req.complex = complex
      req.chart = d.chart
      req.chartData = data
      req.displayedTweets = tws.slice(0, 19)
      req.since = (if (tws.length) then tws[0].id_str else "")
      req.formattedDates = d.formattedDates
      req.keywords = d.keywords
      req.source = _.sortBy(arrayOfTweetsSource, (t) ->
        t[1]
      ).reverse()
      req.lang = _.sortBy(arrayOfTweetsLanguage, (t) ->
        t[1]
      ).reverse()
      
      # req.tweets = tws
      next()


exports.index = (req, res) ->
  if req.isAuthenticated()
    query = "date=&chart=Pie&keywords=" + req.user.keywords.replace(/d\+1/g, " ").split(",").join("%3B") + "&since=&context=Total"
    d = chartsHelper.setup(req, query)
    options =
      perPage: d.perPage
      page: d.page
      criteria:
        user_id: d.user._id
        keyword:
          $in: d.keywords

        requested_at:
          $gte: d.time_range[0]
          $lte: d.time_range[1]

    Tweet.list options, (err, tws) ->
      return next(err)  if err
      graphData = chartsHelper.formatGraphData(d.colors, tws, d.labels, chartsHelper.addColorsToGraphData)
      arrayOfTweetsSource = _.map(_(tws).countBy("source"), (value, key) ->
        [key, value]
      )
      arrayOfTweetsLanguage = _.map(_(tws).countBy("lang"), (value, key) ->
        [key, value]
      )
      res.render "index",
        chartData: graphData
        tweets: tws
        displayedTweets: tws.slice(0, 10)
        lang: _.sortBy(arrayOfTweetsLanguage, (t) ->
          t[1]
        ).reverse()
        source: _.sortBy(arrayOfTweetsSource, (t) ->
          t[1]
        ).reverse()
        since: (if (tws.length) then tws[0].id_str else "")
        user: d.user


  
  # res.render('tweets/_index_empty', {});
  else
    res.render "index",
      user: new User()



###
Update chart
###
exports.chart = (req, res) ->
  res.writeHead 200,
    "content-type": "text/json"

  res.write JSON.stringify(
    complex: req.complex
    chart: req.chart
    lang: req.lang
    source: req.source
    chartData: req.chartData
    displayedTweets: req.displayedTweets
    since: req.since
    formattedDates: req.formattedDates
    keywords: req.keywords
  )
  res.end "\n"


###
New tweet
###
exports.new = (req, res) ->
  res.render "tweets/new",
    title: "New Tweet"
    tweet: new Tweet({})



###
Create a tweet
###
exports.create = (req, res) ->
  tweet = new Tweet(req.body)
  tweet.user = req.user
  tweet.save


###
Edit a tweet
###
exports.edit = (req, res) ->
  res.render "tweets/edit",
    title: "Edit " + req.tweet.title
    tweet: req.tweet



###
Update tweet
###
exports.update = (req, res) ->
  tweet = req.tweet
  tweet = _.extend(tweet, req.body)
  tweet.uploadAndSave req.files.image, (err) ->
    return res.redirect("/tweets/" + tweet._id)  unless err
    res.render "tweets/edit",
      title: "Edit Tweet"
      tweet: tweet
      errors: err.errors




###
Show
###
exports.show = (req, res) ->
  res.render "tweets/show",
    title: req.tweet.title
    tweet: req.tweet



###
Delete a tweet
###
exports.destroy = (req, res) ->
  tweet = req.tweet
  tweet.remove (err) ->
    req.flash "info", "Deleted successfully"
    res.redirect "/tweets"



###
Explore tweets
###
exports.explore = (req, res) ->
  user = req.user
  res.render "tweets/explore",
    title: "Explore"
    user: user
