// Generated by CoffeeScript 1.6.3
(function() {
  var defaults, socket;

  defaults = {
    keywords: [],
    keywordsCounter: {},
    total: 0
  };

  socket = io.connect();

  jQuery(function($) {
    var analytics, firstField, login, primitive_types, setup, tweet, tweetList;
    tweetList = $("ul.tweets.streaming");
    analytics = $("ul.analytics");
    firstField = $("input#email-login");
    login = {
      addFocus: function() {
        if (firstField.length) {
          return firstField.focus();
        }
      }
    };
    tweet = {
      removeTweets: function() {
        var limit, list;
        limit = 5;
        list = tweetList.children("li:gt(" + limit + ")");
        return list.remove();
      },
      prependTweet: function(data) {
        var content, url;
        url = (data.username ? "<a href=\"" + "http://www.twitter.com/" + data.user + "\">" + data.username + "</a>" : data.username);
        content = "<li><div class=\"row\"><div class=\"small-3 columns\"><img src=" + data.avatar + " /></div>" + "<div class=\"small-8 columns\"><h6>" + url + " said: </h6>" + data.text + "</div><hr></li>";
        return tweetList.prepend(content);
      },
      updateTotal: function(data) {
        return defaults.total++;
      },
      updateAnalytics: function(data) {
        var ckey, cp, cstr, ctotal, key, _results;
        _results = [];
        for (key in defaults.keywordsCounter) {
          cstr = primitive_types.prepare_string(key);
          ckey = defaults.keywordsCounter[key];
          ctotal = defaults.total;
          cp = Math.round(((ckey / ctotal) * 100) * 10) / 10;
          $("." + cstr + ".meter").css("width", cp + "%");
          $("." + cstr + " span.number").text(ckey);
          _results.push($("." + cstr + " span:not(\".number\")").text(cp + "%"));
        }
        return _results;
      },
      updateNumbers: function(data, k, c) {
        var i, _results;
        i = 0;
        _results = [];
        while (i < k.length) {
          if (data.text.indexOf(k[i]) !== -1) {
            if (c[k[i]]) {
              c[k[i]]++;
            } else {
              c[k[i]] = 1;
            }
            this.updateTotal();
          }
          _results.push(i++);
        }
        return _results;
      }
    };
    primitive_types = {
      prepare_string: function(string) {
        return this.change_white_space_to_hyphens(string);
      },
      change_white_space_to_hyphens: function(string) {
        return string.replace(RegExp(" ", "g"), "-");
      },
      styleKeyword: function(keywords) {
        var holder, i;
        holder = "";
        i = 0;
        while (i < keywords.length) {
          holder += "<span class='radius secondary label'>" + keywords[i] + "</span>";
          i += 1;
        }
        return holder;
      }
    };
    setup = {
      bindSubmit: function() {
        return $("#login-button").click(function() {
          return $(".login").submit();
        });
      },
      addPanelClass: function() {},
      header: function() {
        var header;
        header = $("#tracking");
        return header.html("<h2>Competitive Intelligence</h2><h3 class='subheader'>Stay informed on your competition</h3><p>Live example: Tracking " + primitive_types.styleKeyword(defaults.keywords) + "</p>");
      },
      analytics: function() {
        var i, _results;
        i = 0;
        _results = [];
        while (i < defaults.keywords.length) {
          analytics.prepend("<ul class=\"inline-list " + primitive_types.prepare_string(defaults.keywords[i]) + "\"" + "><li class=\"" + primitive_types.prepare_string(defaults.keywords[i]) + "\">" + defaults.keywords[i] + "</li><li><span class=\"number\">0</span></li><li><span>0%</span></li></ul>" + "<div class=\"progress small-12 radius\"><span class=\"meter" + " " + primitive_types.prepare_string(defaults.keywords[i]) + "\" style=\"width: 40%\"></span></div>");
          _results.push(i++);
        }
        return _results;
      },
      keywords: function(keywords) {
        return defaults.keywords = keywords.keywords;
      }
    };
    socket.on("connect", function() {
      login.addFocus();
      return setup.bindSubmit();
    });
    socket.on("keywords", function(keywords) {
      if (!defaults.keywords.length) {
        setup.addPanelClass();
        setup.keywords(keywords);
        setup.analytics();
        return setup.header();
      }
    });
    return socket.on("tweet", function(data) {
      tweet.updateAnalytics(data);
      tweet.updateNumbers(data, defaults.keywords, defaults.keywordsCounter);
      tweet.prependTweet(data);
      return tweet.removeTweets();
    });
  });

}).call(this);