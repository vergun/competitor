/**
 * Module dependencies.
 */

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */


var express = require('express')
  , http = require('http')
  , fs = require('fs')
  , passport = require('passport')
  , env = process.env.NODE_ENV || 'development'  
  , config = require('./config/config')[env]
  , twitter = require('ntwitter')
  , twit = new twitter(config.twitter)
  , mongoose = require('mongoose');
  // Load configurations
  // if test env, load example file
  
/* ==== Make jade templates available in browsers via javascript template functions ==== */
var templatizer = require('templatizer');
templatizer(config.root + '/app/views/templates', config.root + '/public/js/backbone/templates.js');

// Bootstrap db connection
mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

// bootstrap passport config
require('./config/passport')(passport, config)

var app = express()
  , server = http.createServer(app)
  
// express settings
require('./config/express')(app, config, passport)

// Bootstrap routes
require('./config/routes')(app, passport)

// Start the app by listening on <port>
var port = process.env.PORT || 3000
server.listen(port)
console.log('Express app started on port '+port)

// Start socket.io //
var io = require('socket.io').listen(server);

// Start Twitter stream engine //
require('./app/modules/server_connections')(twit, config, io);

// Start cron //
require('./app/modules/cron').cron();

// expose app
exports = module.exports = app
