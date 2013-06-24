/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , imagerConfig = require(config.root + '/config/imager.js')
  , langs = require('../../lib/langs')
  , Schema = mongoose.Schema

/**
 * Tweet Schema
 */
  
var TweetSchema = new Schema({
  user_id: {type : Schema.ObjectId, ref : 'User'},
  keywords: Array,
  request_date: Date,
  created_at: Date,
  id: Number,
  id_str: String,
  text: String,
  source: String,
  truncated: Boolean,
  in_reply_to_status_id: Number,
  in_reply_to_status_id_str: String,
  in_reply_to_user_id: Number,
  in_reply_to_user_id_str: String,
  in_reply_to_screen_name: String,
  coordinates: String,
  place: String,
  contributors: String,
  retweet_count: Number,
  favorite_count: Number,
  favorited: Boolean,
  retweeted: Boolean,
  lang: String,
  geo: String,
  user: {
    id: Number,
    id_str: String,
    name: String,
    screen_name: String,
    location: String,
    description: String,
    url: String,
    followers_count: Number,
    friends_count: Number,
    created_at: String,
    favourites_count: Number,
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
    notifications: Boolean
  }
})

/**
 * Pre-save hook
 */

TweetSchema.pre('save', function(next) {
  //set language from language 639-1 code
  if (langs[this.lang].name) this.lang = langs[this.lang].name
  if (!langs[this.lang].name) console.log(this.lang + " NOT FOUND!!!!!!!!") //todo remove
  this.created_at = new Date(this.created_at)
  this.request_date = new Date()
  return next()
})

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



