// Generated by CoffeeScript 1.6.3
/*
Module dependencies.
*/


(function() {
  var Schema, UserSchema, config, crypto, env, getKeywords, mongoose, setKeywords, validatePresenceOf, _;

  env = process.env.NODE_ENV || "development";

  config = require("../../config/config")[env];

  mongoose = require("mongoose");

  crypto = require("crypto");

  _ = require("underscore");

  Schema = mongoose.Schema;

  /*
  Getters
  */


  getKeywords = function(keywords) {
    return keywords.join(",");
  };

  /*
  Setters
  */


  setKeywords = function(keywords) {
    return keywords.split(",");
  };

  /*
  User Schema
  */


  UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    keywords: {
      type: [],
      get: getKeywords,
      set: setKeywords
    },
    plan: String,
    hashed_password: String,
    salt: String,
    authToken: String,
    createdAt: {
      type: Date,
      "default": Date.now
    }
  });

  /*
  Virtuals
  */


  UserSchema.virtual("password").set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    return this.hashed_password = this.encryptPassword(password);
  }).get(function() {
    return this._password;
  });

  /*
  Validations
  */


  validatePresenceOf = function(value) {
    return value && value.length;
  };

  UserSchema.path("first_name").validate((function(name) {
    return name.length;
  }), "First name cannot be blank");

  UserSchema.path("last_name").validate((function(name) {
    return name.length;
  }), "Last name cannot be blank");

  UserSchema.path("email").validate((function(email) {
    return email.length;
  }), "Email cannot be blank");

  UserSchema.path("keywords").validate((function(keywords) {
    return keywords.length;
  }), "Competitors cannot be blank");

  UserSchema.path("email").validate((function(email, fn) {
    var User;
    User = mongoose.model("User");
    if (this.isNew || this.isModified("email")) {
      return User.find({
        email: email
      }).exec(function(err, users) {
        return fn(err || users.length === 0);
      });
    } else {
      return fn(true);
    }
  }), "Email already exists");

  UserSchema.path("hashed_password").validate((function(hashed_password) {
    return hashed_password.length;
  }), "Password cannot be blank");

  /*
  Pre-save hook
  */


  UserSchema.pre("save", function(next) {
    if (!this.isNew) {
      this.plan = "Free";
      return next();
    }
    if (validatePresenceOf(this.password)) {
      this.plan = "Free";
      return next();
    }
  });

  /*
  Methods
  */


  UserSchema.methods = {
    /*
    Save user and upload image
    
    @param {Object} images
    @param {Function} cb
    @api private
    */

    uploadAndSave: function(images, cb) {
      return this.save(cb);
    },
    /*
    Authenticate - check if the passwords are the same
    
    @param {String} plainText
    @return {Boolean}
    @api public
    */

    authenticate: function(plainText) {
      return this.encryptPassword(plainText) === this.hashed_password;
    },
    /*
    Make salt
    
    @return {String}
    @api public
    */

    makeSalt: function() {
      return Math.round(new Date().valueOf() * Math.random()) + "";
    },
    /*
    Encrypt password
    
    @param {String} password
    @return {String}
    @api public
    */

    encryptPassword: function(password) {
      var encrypred, err;
      if (!password) {
        return "";
      }
      encrypred = void 0;
      try {
        encrypred = crypto.createHmac("sha1", this.salt).update(password).digest("hex");
        return encrypred;
      } catch (_error) {
        err = _error;
        return "";
      }
    }
  };

  /*
  Find user by id
  
  @param {ObjectId} id
  @param {Function} cb
  @api private
  */


  UserSchema.statics = {
    load: function(id, cb) {
      return this.findOne({
        _id: id
      }).exec(cb);
    }
  };

  mongoose.model("User", UserSchema);

}).call(this);
