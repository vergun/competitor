var defaults = {
  
     keywords: []
  ,  keywordsCounter: {}
  ,  total: 0
     }
  ,  socket = io.connect();
  
  jQuery(function($) {
    var tweetList = $('ul.tweets')
      , analytics = $('ul.analytics')
      , tweet = {
      prependTweet: function(data) {
        var content = '<li><img src=' + data.avatar + ' />' + data.user + ': ' + data.text +  '</li>'
        tweetList.prepend(content);
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
           
            $('.' + cstr).css("width", cp + '%');
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
        }
      }
    , setup = {
        header: function() {
          var header = $('#tracking');
          header.text("Tracking: " + defaults.keywords.toString()); 
        }, 
        analytics: function() {
          for (var i = 0; i < defaults.keywords.length; i++) {
             analytics.prepend('<li class="' + 
                primitive_types.prepare_string(defaults.keywords[i]) + 
                '">' + defaults.keywords[i] + 
                ':<span class="number">0</span><span>0%</span></li>'
              ) 
          }
        },
        keywords: function(keywords) {  
          defaults.keywords = keywords.keywords;
        }
      }
    socket.on('keywords', function(keywords) {
      if (!defaults.keywords.length) {
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
