
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , imagerConfig = require(config.root + '/config/imager.js')
  , Schema = mongoose.Schema

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

var getDate = function(date) {
  // convert Date class to string date
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

var setDate = function(date) {
  //convert string date to Date class
}

/**
 * Tweet Schema
 */

var TweetSchema = new Schema({
  user: { type : Schema.ObjectId, ref : 'User' },
  keywords: { type : Array, ref : 'User' },
  id: Number,
  id_str: String,
  name: String,
  screen_name: String,
  location: String,
  url: String,
  description: String,
  protected: Boolean,
  followers_count: Number,
  friends_count: Number,
  listed_count: Number,
  created_at: String,
  favourites_count: Number,
  text: String,
  source: String,
  truncated: Boolean,
  in_reply_to_status_id: Number,
  in_reply_to_status_id_str: String,
  in_reply_to_user_id: Number,
  in_reply_to_user_id_str: String,
  in_reply_to_screen_name: String,
  twitter_user: {
    utc_offset: Number,
    time_zone: String,
    geo_enabled: Boolean,
    verified: Boolean,
    statuses_count: Number,
    lang: String,
    contributors_enabled: Boolean,
    is_translator: Boolean,
    profile_background_color: String,
    profile_background_image_url: String,
    profile_background_image_url_https: String,
    profile_background_tile: Boolean,
    profile_image_url: String,
    profile_image_url_https: String,
    profile_banner_url: String,
    profile_link_color: String,
    profile_sidebar_border_color: String,
    profile_sidebar_fill_color: String,
    profile_text_color: String,
    profile_use_background_image: Boolean,
    default_profile: Boolean,
    default_profile_image: Boolean,
    following: String,
    follow_request_sent: String,
    notifications: String,
    profile_banner_url_https: String,
    profile_image_url: String,
  },
  geo: String,
  coordinates: String,
  place: String,
  contributors: String,
  retweet_count: Number,
  favorite_count: Number,
  entities: {
    hashtags: Array,
    symbols: Array,
    urls: Array,
    user_mentions: Object,
    media: Object,
  },
  favorited: Boolean,
  retweeted: Boolean,
  possibly_sensitive: Boolean,
  filter_level: String,
  lang: String
})

/**
 * Validations
 */

TweetSchema.path('name').validate(function (title) {
  return title.length > 0
}, 'Tweet title cannot be blank')

TweetSchema.path('text').validate(function (body) {
  return body.length > 0
}, 'Tweet body cannot be blank')

/**
 * Pre-remove hook
 */

TweetSchema.pre('remove', function (next) {
  var imager = new Imager(imagerConfig, 'S3')
  var files = this.image.files

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function (err) {
    if (err) return next(err)
  }, 'tweet')

  next()
})

/**
 * Methods
 */

TweetSchema.methods = {

  /**
   * Save tweet
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */
  
  save: function(cb) {
    return this.save;
  },
  
  /**
   * Save tweet and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function (images, cb) {
    if (!images || !images.length) return this.save(cb)

    var imager = new Imager(imagerConfig, 'S3')
    var self = this

    imager.upload(images, function (err, cdnUri, files) {
      if (err) return cb(err)
      if (files.length) {
        self.image = { cdnUri : cdnUri, files : files }
      }
      self.save(cb)
    }, 'tweet')
  },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  addComment: function (user, comment, cb) {
    var notify = require('../mailer/notify')

    this.comments.push({
      body: comment.body,
      user: user._id
    })

    notify.comment({
      tweet: this,
      currentUser: user,
      comment: comment.body
    })

    this.save(cb)
  }

}

/**
 * Statics
 */

TweetSchema.statics = {

  /**
   * Find tweet by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .populate('comments.user')
      .exec(cb)
  },

  /**
   * List tweets
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Tweet', TweetSchema)







/**
 * Module dependencies.
 */
// 
// var mongoose = require('mongoose')
//   , Tweet = mongoose.model('Tweet')
// 
// /**
//  * List items tagged with a tag
//  */
// 
// exports.index = function (req, res) {
//   var criteria = { tags: req.param('tag') }
//   var perPage = 5
//   var page = req.param('page') > 0 ? req.param('page') : 0
//   var options = {
//     perPage: perPage,
//     page: page,
//     criteria: criteria
//   }
// 
//   Tweet.list(options, function(err, tweets) {
//     if (err) return res.render('500')
//     Tweet.count(criteria).exec(function (err, count) {
//       res.render('tweets/index', {
//         title: 'Tweets tagged ' + req.param('tag'),
//         tweets: tweets,
//         page: page,
//         pages: count / perPage
//       })
//     })
//   })
// }


