var defaults = {
  
     keywords: []
  ,  keywordsCounter: {}
  ,  total: 0
     }
  ,  socket = io.connect();
  
  jQuery(function($) {
    var tweetList = $('ul.tweets.streaming')
      , analytics = $('ul.analytics')
      , firstField = $('input#email-login')
      , login = {
        addFocus: function() {
          if (firstField.length) firstField.focus();
        }
      }
      , tweet = {
      prependTweet: function(data) {
        var content = '<li><img src=' + data.avatar + ' />' + data.user + ': ' + data.text +  '</li>'
        tweetList.prepend(content); //todo remove tweets from bottom of the list
      },
      updateTotal: function(data) {
        defaults.total++;
      },
      
      updateAnalytics: function(data) {
        for (var key in defaults.keywordsCounter) {
          
          var cstr = primitive_types.prepare_string(key)
           ,  ckey = defaults.keywordsCounter[key]
           ,  ctotal = defaults.total
           ,  cp = (Math.round(((ckey/ctotal)*100) * 10) / 10);
           
            $('.' + cstr + '.meter').css("width", cp + '%');
            $('.' + cstr + ' span.number').text(ckey);
            $('.' + cstr + ' span:not(".number")').text(cp + '%');
            
          }
      },
      updateNumbers: function(data, k, c) {
        for (var i = 0; i < k.length; i++) {
          if (data.text.indexOf(k[i]) !== -1) {
            c[k[i]] 
          ? c[k[i]] ++ 
          : c[k[i]] = 1;
            this.updateTotal();
          }
        }
      }
    }
    , primitive_types = {
        prepare_string: function(string) {
          return this.change_white_space_to_hyphens(string);
        },
        change_white_space_to_hyphens: function(string) {
          return string.replace(/ /g, '-');
        },
        styleKeyword: function(keywords) {
          var holder = "";
          for ( var i=0; i < keywords.length; i+=1 ) {
            holder += "<span class='radius secondary label'>" + keywords[i] + "</span>"
          }
          return holder;
        }
      }
    , setup = {
        addPanelClass: function() {
          // analytics.addClass('panel')
        },
        header: function() {
          var header = $('#tracking');
          console.log(defaults.keywords);
          header.html("<h2>Competitive Intelligence</h2><h3 class='subheader'>Stay informed on your competition</h3><p>Live example: Tracking " + primitive_types.styleKeyword(defaults.keywords) +  "</p>"); 
        }, 
        analytics: function() {
          
          for (var i = 0; i < defaults.keywords.length; i++) {
             analytics.prepend('<ul class="inline-list ' + primitive_types.prepare_string(defaults.keywords[i]) + '"' 
                + '><li class="' + 
                primitive_types.prepare_string(defaults.keywords[i]) + 
                '">' + defaults.keywords[i] + 
                '</li><li><span class="number">0</span></li><li><span>0%</span></li></ul>' + 
                '<div class="progress small-12 radius"><span class="meter' 
                + ' ' 
                + primitive_types.prepare_string(defaults.keywords[i])
                + '" style="width: 40%"></span></div>'
                
              ) 
          }
          
        },
        keywords: function(keywords) {  
          defaults.keywords = keywords.keywords;
        }
      }
    socket.on('connect', function() {
      login.addFocus();
    })
    socket.on('keywords', function(keywords) {
      if (!defaults.keywords.length) {
        setup.addPanelClass();
        setup.keywords(keywords);
        setup.analytics();
        setup.header();
      }
    })
    socket.on('tweet', function(data) {
      tweet.updateAnalytics(data);
      tweet.updateNumbers(data, defaults.keywords, defaults.keywordsCounter);
      tweet.prependTweet(data);
    });
}); //jQuery
