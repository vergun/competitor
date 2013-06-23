
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Tweet = mongoose.model('Tweet')

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.param('tag') }
  var perPage = 5
  var page = req.param('page') > 0 ? req.param('page') : 0
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  }

  Tweet.list(options, function(err, tweets) {
    if (err) return res.render('500')
    Tweet.count(criteria).exec(function (err, count) {
      res.render('tweets/index', {
        title: 'Tweet tagged ' + req.param('tag'),
        tweets: tweets,
        page: page,
        pages: count / perPage
      })
    })
  })
}
