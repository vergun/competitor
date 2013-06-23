/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , imagerConfig = require(config.root + '/config/imager.js')
  , crypto = require('crypto')
  , _ = require('underscore')
  , Schema = mongoose.Schema

  /**
   * Getters
   */

  var getCompetitors = function (competitors) {
    return competitors.join(',')
  }

  /**
   * Setters
   */

  var setCompetitors = function (competitors) {
    return competitors.split(',')
  }

/**
 * User Schema
 */

var UserSchema = new Schema({
  name: String,
  email: String,
  username: String,
  competitors: {type: [], get: getCompetitors, set: setCompetitors},
  plan: String,
  provider: String,
  hashed_password: String,
  salt: String,
  authToken: String,
  image: {
    cdnUri: String,
    files: []
  },
  createdAt  : {type : Date, default : Date.now},
  
})

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() { return this._password })

/**
 * Validations
 */

var validatePresenceOf = function (value) {
  return value && value.length
}

// the below 4 validations only apply if you are signing up traditionally

UserSchema.path('name').validate(function (name) {
  return name.length
}, 'Name cannot be blank')

UserSchema.path('email').validate(function (email) {
  return email.length
}, 'Email cannot be blank')

UserSchema.path('competitors').validate(function (competitors) {
  return competitors.length
}, 'Competitors cannot be blank')

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User')

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(err || users.length === 0)
    })
  } else fn(true)
}, 'Email already exists')

UserSchema.path('username').validate(function (username) {
  return username.length
}, 'Username cannot be blank')

UserSchema.path('hashed_password').validate(function (hashed_password) {
  return hashed_password.length
}, 'Password cannot be blank')


/**
 * Pre-save hook
 */

UserSchema.pre('save', function(next) {
  if (!this.isNew) return next()
  if (!validatePresenceOf(this.password)) next(new Error('Invalid password'))
  else next()
})

/**
 * Methods
 */

UserSchema.methods = {


  /**
   * Save user and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */
  
  uploadAndSave: function (images, cb) {
    return this.save(cb)
  },
  
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */

  encryptPassword: function (password) {
    if (!password) return ''
    var encrypred
    try {
      encrypred = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
      return encrypred
    } catch (err) {
      return ''
    }
  }
}

UserSchema.statics = {
  
  /**
   * Find user by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .exec(cb)
}
  
}

mongoose.model('User', UserSchema)
