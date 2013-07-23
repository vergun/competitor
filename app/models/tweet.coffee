###
Module dependencies.
###
mongoose = require("mongoose")
env = process.env.NODE_ENV or "development"
config = require("../../config/config")[env]
langs = require("../../vendor/lib/langs")
Schema = mongoose.Schema
fs = require("fs")
moment = require("moment")

###
Tweet Schema
###
TweetSchema = new Schema(
  user_id:
    type: Schema.ObjectId
    ref: "User"

  keyword: String
  keywords: Array
  requested_at: Date
  created_at: Date
  id: Number
  id_str: String
  text: String
  source: String
  truncated: Boolean
  in_reply_to_status_id: Number
  in_reply_to_status_id_str: String
  in_reply_to_user_id: Number
  in_reply_to_user_id_str: String
  in_reply_to_screen_name: String
  coordinates: String
  place: String
  contributors: String
  retweet_count: Number
  favorite_count: Number
  favorited: Boolean
  retweeted: Boolean
  lang: String
  geo: String
  user:
    id: Number
    id_str: String
    name: String
    screen_name: String
    location: String
    description: String
    url: String
    followers_count: Number
    friends_count: Number
    created_at: String
    favourites_count: Number
    utc_offset: Number
    time_zone: String
    geo_enabled: Boolean
    verified: Boolean
    statuses_count: Number
    lang: String
    contributors_enabled: Boolean
    is_translator: Boolean
    profile_background_color: String
    profile_background_image_url: String
    profile_background_image_url_https: String
    profile_background_tile: Boolean
    profile_image_url: String
    profile_image_url_https: String
    profile_banner_url: String
    profile_link_color: String
    profile_sidebar_border_color: String
    profile_sidebar_fill_color: String
    profile_text_color: String
    profile_use_background_image: Boolean
    default_profile: Boolean
    default_profile_image: Boolean
    notifications: Boolean
)

###
Pre-save hook
###
TweetSchema.pre "save", (next) ->
  
  #set language from language 639-1 code
  @lang = langs[@lang].name  if langs[@lang]
  fs.appendFile "../../lang.txt", @lang  unless langs[@lang] #todo remove
  @created_at = new Date(@created_at)
  @requested_at = moment().format()
  next()


###
Statics
###
TweetSchema.statics =
  
  ###
  Find tweet by id
  
  @param {ObjectId} id
  @param {Function} cb
  @api private
  ###
  load: (id, cb) ->
    @findOne(_id: id).populate("user", "name email").populate("comments.user").exec cb

  
  ###
  List tweets
  
  @param {Object} options
  @param {Function} cb
  @api private
  ###
  list: (options, cb) ->
    criteria = options.criteria or {}
    
    # .populate('user', 'name username')
    
    # .limit(options.perPage)
    # .skip(options.perPage * options.page)
    @find(criteria).sort(id: -1).exec cb

mongoose.model "Tweet", TweetSchema