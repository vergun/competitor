// Generated by CoffeeScript 1.6.3
(function() {
  this.Competitor.module("TweetApp", function(TweetApp, App, Backbone, Marionette, $, _) {
    var API;
    this.startWithParent = false;
    API = {
      showIndex: function() {
        return TweetApp.Index.Controller.showIndex();
      },
      showChart: function(options) {
        if (options == null) {
          options = {};
        }
        return TweetApp.Index.Controller.showChart(options.model);
      },
      showLoading: function() {
        return TweetApp.Index.Controller.showLoading();
      },
      removeLoading: function() {
        return TweetApp.Index.Controller.removeLoading();
      },
      updateTweets: function(options) {
        if (options == null) {
          options = {};
        }
        return TweetApp.Index.Controller.updateIndex(options);
      }
    };
    TweetApp.on("start", function() {
      return API.showIndex();
    });
    App.vent.on("update:chart", function(options) {
      if (options == null) {
        options = {};
      }
      return API.showChart(options);
    });
    App.vent.on("update:keywords", function(options) {
      if (options == null) {
        options = {};
      }
      return API.showChart(options);
    });
    App.vent.on("update:tweets", function(options) {
      if (options == null) {
        options = {};
      }
      return API.updateTweets(options);
    });
    App.vent.on("show:loading", function() {
      return API.showLoading();
    });
    return App.vent.on("remove:loading", function() {
      return API.removeLoading();
    });
  });

}).call(this);
