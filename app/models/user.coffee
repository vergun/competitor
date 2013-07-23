###
Module dependencies.
###
env = process.env.NODE_ENV or "development"
config = require("../../config/config")[env]
mongoose = require("mongoose")
crypto = require("crypto")
_ = require("underscore")
Schema = mongoose.Schema

###
Getters
###
getKeywords = (keywords) ->
  keywords.join ","


###
Setters
###
setKeywords = (keywords) ->
  keywords.split ","


###
User Schema
###
UserSchema = new Schema(
  first_name: String
  last_name: String
  email: String
  keywords:
    type: []
    get: getKeywords
    set: setKeywords
  plan: String
  hashed_password: String
  salt: String
  authToken: String
  createdAt:
    type: Date
    default: Date.now
)

###
Virtuals
###
UserSchema.virtual("password").set((password) ->
  @_password = password
  @salt = @makeSalt()
  @hashed_password = @encryptPassword(password)
).get ->
  @_password


###
Validations
###
validatePresenceOf = (value) ->
  value and value.length


# the below 4 validations only apply if you are signing up traditionally
UserSchema.path("first_name").validate ((name) ->
  name.length
), "First name cannot be blank"
UserSchema.path("last_name").validate ((name) ->
  name.length
), "Last name cannot be blank"
UserSchema.path("email").validate ((email) ->
  email.length
), "Email cannot be blank"
UserSchema.path("keywords").validate ((keywords) ->
  keywords.length
), "Competitors cannot be blank"
UserSchema.path("email").validate ((email, fn) ->
  User = mongoose.model("User")
  
  # Check only when it is a new user or when email field is modified
  if @isNew or @isModified("email")
    User.find(email: email).exec (err, users) ->
      fn err or users.length is 0

  else
    fn true
), "Email already exists"
UserSchema.path("hashed_password").validate ((hashed_password) ->
  hashed_password.length
), "Password cannot be blank"

###
Pre-save hook
###
UserSchema.pre "save", (next) ->
  unless @isNew
    @plan = "Free"
    
    # this.keywords = _(this.keywords).each(function(k) { k.replace("'", "") }) //todo dry //
    return next()
  if validatePresenceOf(@password)
    @plan = "Free"
    
    # this.keywords = _(this.keywords).each(function(k) { k.replace("'", "")} )
    # todo separate keywords for each user //
    next()


###
Methods
###
UserSchema.methods =
  
  ###
  Save user and upload image
  
  @param {Object} images
  @param {Function} cb
  @api private
  ###
  uploadAndSave: (images, cb) ->
    @save cb

  
  ###
  Authenticate - check if the passwords are the same
  
  @param {String} plainText
  @return {Boolean}
  @api public
  ###
  authenticate: (plainText) ->
    @encryptPassword(plainText) is @hashed_password

  
  ###
  Make salt
  
  @return {String}
  @api public
  ###
  makeSalt: ->
    Math.round((new Date().valueOf() * Math.random())) + ""

  
  ###
  Encrypt password
  
  @param {String} password
  @return {String}
  @api public
  ###
  encryptPassword: (password) ->
    return ""  unless password
    encrypred = undefined
    try
      encrypred = crypto.createHmac("sha1", @salt).update(password).digest("hex")
      return encrypred
    catch err
      return ""


###
Find user by id

@param {ObjectId} id
@param {Function} cb
@api private
###
UserSchema.statics = load: (id, cb) ->
  @findOne(_id: id).exec cb

mongoose.model "User", UserSchema