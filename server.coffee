###
Module dependencies.
###
express = require("express")
http = require("http")
fs = require("fs")
passport = require("passport")
env = process.env.NODE_ENV or "development"
config = require("./config/config")[env]
twitter = require("ntwitter")
twit = new twitter(config.twitter)
mongoose = require("mongoose")

# Templates on client
templatizer = require("templatizer")
templatizer config.root + "/app/assets/jade/templates", config.root + "/app/assets/js/templates/templates.js"

# Bootstrap db connection
mongoose.connect config.db

# Bootstrap models
models_path = __dirname + "/app/models"
fs.readdirSync(models_path).forEach (file) ->
  require models_path + "/" + file  if ~file.indexOf(".js")

# bootstrap passport config
require("./config/passport") passport, config
app = express()
server = http.createServer(app)

# express settings
require("./config/express") app, config, passport

# Bootstrap routes
require("./config/routes") app, passport

# Start the app by listening on <port>
port = process.env.PORT or 3000
server.listen port

# Start socket.io //
io = require("socket.io").listen(server)

# Start Twitter stream engine //
require("./app/modules/server_connections") twit, config, io

# Start cron //
require("./app/modules/cron").cron()

# expose app
exports = module.exports = app